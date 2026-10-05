import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { neon } from '@neondatabase/serverless';

const scrypt = promisify(scryptCallback);
const INITIAL_ADMIN_USERNAME = 'Shabir Ahmed';
const SESSION_COOKIE = 'casdct_admin_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_WINDOW_MINUTES = 15;
const PASSWORD_KEY_BYTES = 64;
const SCRYPT_OPTIONS = { N: 32_768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

const sendError = (res, status, message) => res.status(status).json({ error: message });

const isEqual = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

const getConfiguration = () => {
  if (!process.env.DATABASE_URL) throw new Error('Admin credential storage is not configured on this deployment.');
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error('Admin session signing is not configured on this deployment.');
  }
  return { sql: neon(process.env.DATABASE_URL), sessionSecret };
};

const hashPassword = async (password, salt) =>
  await scrypt(password, salt, PASSWORD_KEY_BYTES, SCRYPT_OPTIONS);

const getAdminCredential = async (sql) => {
  await sql`
    CREATE TABLE IF NOT EXISTS casdct_admin_credentials (
      singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
      username VARCHAR(80) NOT NULL,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      token_version INTEGER NOT NULL DEFAULT 1,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS casdct_admin_login_attempts (
      address_hash TEXT PRIMARY KEY,
      attempt_count INTEGER NOT NULL,
      window_started_at TIMESTAMPTZ NOT NULL
    )
  `;

  let rows = await sql`
    SELECT username, password_salt, password_hash, token_version
    FROM casdct_admin_credentials
    WHERE singleton = TRUE
    LIMIT 1
  `;
  if (rows.length) return rows[0];

  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!initialPassword || initialPassword.length < 16 || initialPassword.length > 256) {
    throw new Error('Admin setup is incomplete: configure a unique initial password of 16–256 characters.');
  }

  const salt = randomBytes(16);
  const passwordHash = await hashPassword(initialPassword, salt);
  await sql`
    INSERT INTO casdct_admin_credentials (singleton, username, password_salt, password_hash)
    VALUES (TRUE, ${INITIAL_ADMIN_USERNAME}, ${salt.toString('hex')}, ${passwordHash.toString('hex')})
    ON CONFLICT (singleton) DO NOTHING
  `;
  rows = await sql`
    SELECT username, password_salt, password_hash, token_version
    FROM casdct_admin_credentials
    WHERE singleton = TRUE
    LIMIT 1
  `;
  if (!rows.length) throw new Error('Unable to initialize the admin credential record.');
  return rows[0];
};

const sign = (payload, secret) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

const createSession = (credential, secret) => {
  const payload = Buffer.from(JSON.stringify({
    username: credential.username,
    version: credential.token_version,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
  })).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
};

const verifySession = (token, secret, credential) => {
  if (typeof token !== 'string' || token.length > 2048) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra !== undefined || !isEqual(signature, sign(payload, secret))) return false;

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return claims.username === credential.username &&
      claims.version === credential.token_version &&
      Number.isInteger(claims.expiresAt) &&
      claims.expiresAt > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

const getSessionCookie = (req) => {
  const cookieHeader = req.headers?.cookie || '';
  const cookie = cookieHeader.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return cookie ? cookie.slice(SESSION_COOKIE.length + 1) : '';
};

const recordLoginAttempt = async (sql, req, secret) => {
  const forwardedFor = req.headers?.['x-forwarded-for'] || '';
  const address = String(forwardedFor).split(',').pop().trim().slice(0, 128) || 'unknown';
  const addressHash = createHmac('sha256', secret).update(`login-rate:${address}`).digest('hex');
  const rows = await sql`
    INSERT INTO casdct_admin_login_attempts (address_hash, attempt_count, window_started_at)
    VALUES (${addressHash}, 1, NOW())
    ON CONFLICT (address_hash) DO UPDATE SET
      attempt_count = CASE
        WHEN casdct_admin_login_attempts.window_started_at < NOW() - (${LOGIN_WINDOW_MINUTES} * INTERVAL '1 minute')
        THEN 1
        ELSE casdct_admin_login_attempts.attempt_count + 1
      END,
      window_started_at = CASE
        WHEN casdct_admin_login_attempts.window_started_at < NOW() - (${LOGIN_WINDOW_MINUTES} * INTERVAL '1 minute')
        THEN NOW()
        ELSE casdct_admin_login_attempts.window_started_at
      END
    RETURNING attempt_count
  `;
  return rows[0]?.attempt_count || LOGIN_ATTEMPT_LIMIT + 1;
};

const clearLoginAttempts = async (sql, req, secret) => {
  const forwardedFor = req.headers?.['x-forwarded-for'] || '';
  const address = String(forwardedFor).split(',').pop().trim().slice(0, 128) || 'unknown';
  const addressHash = createHmac('sha256', secret).update(`login-rate:${address}`).digest('hex');
  await sql`DELETE FROM casdct_admin_login_attempts WHERE address_hash = ${addressHash}`;
};

const setSessionCookie = (res, token) => {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}`
  );
};

const clearSessionCookie = (res) => {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendError(res, 405, 'Method not allowed.');
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return sendError(res, 400, 'Invalid authentication request.');
  }

  if (body.action === 'logout') {
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }

  if (body.action === 'loginInfo') {
    try {
      const { sql } = getConfiguration();
      const credential = await getAdminCredential(sql);
      return res.status(200).json({ username: credential.username });
    } catch (error) {
      console.error('Unable to load admin login details:', error);
      return sendError(res, 503, 'Admin authentication is unavailable. Verify the server configuration and database connection.');
    }
  }

  let sql;
  let sessionSecret;
  let credential;
  try {
    ({ sql, sessionSecret } = getConfiguration());
    credential = await getAdminCredential(sql);
  } catch (error) {
    console.error('Admin authentication setup failed:', error);
    return sendError(res, 503, 'Admin authentication is unavailable. Verify the server configuration and database connection.');
  }

  if (body.action === 'login') {
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' && body.password.length <= 256 ? body.password : '';
    let attempts;
    try {
      attempts = await recordLoginAttempt(sql, req, sessionSecret);
    } catch (error) {
      console.error('Unable to apply admin login throttling:', error);
      return sendError(res, 503, 'Admin login is temporarily unavailable.');
    }
    if (attempts > LOGIN_ATTEMPT_LIMIT) {
      return sendError(res, 429, 'Too many login attempts. Try again in 15 minutes.');
    }
    let suppliedHash = Buffer.alloc(PASSWORD_KEY_BYTES);
    if (password) suppliedHash = await hashPassword(password, Buffer.from(credential.password_salt, 'hex'));
    if (!password || !isEqual(username.toLocaleLowerCase('en-US'), credential.username.toLocaleLowerCase('en-US')) ||
        !isEqual(suppliedHash, Buffer.from(credential.password_hash, 'hex'))) {
      return sendError(res, 401, 'Invalid admin username or password.');
    }

    await clearLoginAttempts(sql, req, sessionSecret);
    setSessionCookie(res, createSession(credential, sessionSecret));
    return res.status(200).json({ username: credential.username });
  }

  if (body.action === 'verify') {
    if (!verifySession(getSessionCookie(req), sessionSecret, credential)) {
      clearSessionCookie(res);
      return sendError(res, 401, 'Admin session is invalid or has expired.');
    }
    return res.status(200).json({ username: credential.username });
  }

  if (body.action === 'updateCredentials') {
    if (!verifySession(getSessionCookie(req), sessionSecret, credential)) {
      clearSessionCookie(res);
      return sendError(res, 401, 'Admin session is invalid or has expired.');
    }

    const username = typeof body.username === 'string' ? body.username.trim() : credential.username;
    const password = typeof body.password === 'string' ? body.password : '';
    if (username.length < 3 || username.length > 80) {
      return sendError(res, 400, 'Admin username must be between 3 and 80 characters.');
    }
    if (password && (password.length < 16 || password.length > 256)) {
      return sendError(res, 400, 'New admin passwords must be between 16 and 256 characters.');
    }
    if (username === credential.username && !password) {
      return sendError(res, 400, 'Enter a new username or password before saving.');
    }

    let updatedRows;
    try {
      const salt = password ? randomBytes(16) : Buffer.from(credential.password_salt, 'hex');
      const passwordHash = password
        ? await hashPassword(password, salt)
        : Buffer.from(credential.password_hash, 'hex');
      updatedRows = await sql`
        UPDATE casdct_admin_credentials
        SET username = ${username},
            password_salt = ${salt.toString('hex')},
            password_hash = ${passwordHash.toString('hex')},
            token_version = token_version + 1,
            updated_at = NOW()
        WHERE singleton = TRUE
        RETURNING username, password_salt, password_hash, token_version
      `;
    } catch (error) {
      console.error('Unable to update admin credentials:', error);
      return sendError(res, 503, 'Unable to save admin credentials. Try again later.');
    }
    if (!updatedRows.length) return sendError(res, 503, 'Unable to save updated admin credentials.');

    setSessionCookie(res, createSession(updatedRows[0], sessionSecret));
    return res.status(200).json({ username: updatedRows[0].username });
  }

  return sendError(res, 400, 'Unknown authentication action.');
}
