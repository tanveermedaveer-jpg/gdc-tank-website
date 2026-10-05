import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { neon } from '@neondatabase/serverless';

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = 'casdct_admin_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const PASSWORD_KEY_BYTES = 64;
const SCRYPT_OPTIONS = { N: 32_768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
let schemaPromise;

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const getDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    throw new ApiError(503, 'Database is not configured. Add DATABASE_URL to the Vercel environment.');
  }
  const sql = neon(process.env.DATABASE_URL);
  if (!schemaPromise) {
    schemaPromise = (async () => {
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
        CREATE TABLE IF NOT EXISTS casdct_portal_records (
          record_key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          version INTEGER NOT NULL DEFAULT 1,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS casdct_portal_files (
          path TEXT PRIMARY KEY,
          pathname TEXT NOT NULL UNIQUE,
          content_type TEXT NOT NULL,
          is_public BOOLEAN NOT NULL DEFAULT FALSE,
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
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  await schemaPromise;
  return sql;
};

const hashPassword = async (password, salt) =>
  await scrypt(password, salt, PASSWORD_KEY_BYTES, SCRYPT_OPTIONS);

export const getAdminCredential = async (sql) => {
  let rows = await sql`
    SELECT username, password_salt, password_hash, token_version
    FROM casdct_admin_credentials WHERE singleton = TRUE LIMIT 1
  `;
  if (rows.length) return rows[0];

  const username = process.env.ADMIN_USERNAME || 'Shabir Ahmed';
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password || password.length < 16 || password.length > 256) {
    throw new ApiError(503, 'Admin setup is incomplete. Set ADMIN_INITIAL_PASSWORD (16–256 characters) in Vercel.');
  }
  const salt = randomBytes(16);
  const passwordHash = await hashPassword(password, salt);
  await sql`
    INSERT INTO casdct_admin_credentials
      (singleton, username, password_salt, password_hash)
    VALUES (TRUE, ${username}, ${salt.toString('hex')}, ${passwordHash.toString('hex')})
    ON CONFLICT (singleton) DO NOTHING
  `;
  rows = await sql`
    SELECT username, password_salt, password_hash, token_version
    FROM casdct_admin_credentials WHERE singleton = TRUE LIMIT 1
  `;
  if (!rows.length) throw new ApiError(503, 'Unable to initialize the admin account.');
  return rows[0];
};

const isEqual = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const getSessionSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new ApiError(503, 'Admin session signing is not configured. Set ADMIN_SESSION_SECRET (at least 32 characters) in Vercel.');
  }
  return secret;
};

export const getLoginAddressHash = (req) => {
  const forwardedFor = req.headers?.['x-forwarded-for'] || '';
  const address = String(forwardedFor).split(',')[0].trim().slice(0, 128) || 'unknown';
  return createHmac('sha256', getSessionSecret()).update(`login-rate:${address}`).digest('hex');
};

const sign = (payload, secret) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

export const createSessionToken = (credential) => {
  const payload = Buffer.from(JSON.stringify({
    username: credential.username,
    version: credential.token_version,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
  })).toString('base64url');
  return `${payload}.${sign(payload, getSessionSecret())}`;
};

const readCookie = (req) => {
  const cookieHeader = req.headers?.cookie || '';
  const cookie = cookieHeader.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return cookie ? cookie.slice(SESSION_COOKIE.length + 1) : '';
};

export const setSessionCookie = (res, token) => {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}`
  );
};

export const clearSessionCookie = (res) => {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
};

export const getAuthenticatedAdmin = async (req) => {
  const sql = await getDatabase();
  const credential = await getAdminCredential(sql);
  const secret = getSessionSecret();
  const token = readCookie(req);
  if (!token || token.length > 2048) throw new ApiError(401, 'Admin session is invalid or has expired.');
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra !== undefined || !isEqual(signature, sign(payload, secret))) {
    throw new ApiError(401, 'Admin session is invalid or has expired.');
  }
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (claims.username !== credential.username ||
        claims.version !== credential.token_version ||
        !Number.isInteger(claims.expiresAt) ||
        claims.expiresAt <= Math.floor(Date.now() / 1000)) {
      throw new ApiError(401, 'Admin session is invalid or has expired.');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Admin session is invalid or has expired.');
  }
  return { sql, credential };
};

export const isSameOrigin = (req) => {
  const origin = req.headers?.origin;
  if (!origin) return false;
  const hosts = [req.headers?.host, req.headers?.['x-forwarded-host']]
    .filter(Boolean)
    .flatMap((host) => String(host).split(',').map((value) => value.trim().toLowerCase()));
  if (!hosts.length) return false;
  try {
    return hosts.includes(new URL(origin).host.toLowerCase());
  } catch {
    return false;
  }
};

export const sendError = (res, error) => {
  const status = error instanceof ApiError ? error.status : 500;
  if (status >= 500) console.error('Portal API request failed:', error);
  const message = error instanceof ApiError
    ? error.message
    : 'The database request failed. Verify the Neon connection and try again.';
  return res.status(status).json({ error: message });
};

export const parseJsonBody = (req) => {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new ApiError(400, 'Invalid JSON request body.');
    }
  }
  return req.body;
};

export const verifyPassword = async (password, credential) => {
  const suppliedHash = await hashPassword(password, Buffer.from(credential.password_salt, 'hex'));
  return isEqual(suppliedHash, Buffer.from(credential.password_hash, 'hex'));
};

export { PASSWORD_KEY_BYTES };
