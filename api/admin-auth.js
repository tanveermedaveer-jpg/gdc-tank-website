import { createHmac, timingSafeEqual } from 'node:crypto';

const ADMIN_USERNAME = 'Professor Saleem Khan';
const SESSION_COOKIE = 'casdct_admin_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

const sendError = (res, status, message) => res.status(status).json({ error: message });

const isEqual = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

const sign = (payload, secret) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

const createSession = (secret) => {
  const payload = Buffer.from(JSON.stringify({
    username: ADMIN_USERNAME,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
  })).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
};

const verifySession = (token, secret) => {
  if (typeof token !== 'string' || token.length > 2048) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra !== undefined) return false;
  if (!isEqual(signature, sign(payload, secret))) return false;

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return claims.username === ADMIN_USERNAME &&
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

export default function handler(req, res) {
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
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
    return res.status(200).json({ ok: true });
  }

  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 16 || password.length > 256 ||
      !sessionSecret || sessionSecret.length < 32) {
    return sendError(res, 503, 'Admin authentication is not configured on this deployment.');
  }

  if (body.action === 'login') {
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const suppliedPassword = typeof body.password === 'string' && body.password.length <= 256
      ? body.password
      : '';
    if (username.toLocaleLowerCase('en-US') !== ADMIN_USERNAME.toLocaleLowerCase('en-US') ||
        !suppliedPassword || !isEqual(suppliedPassword, password)) {
      return sendError(res, 401, 'Invalid admin username or password.');
    }

    const token = createSession(sessionSecret);
    res.setHeader(
      'Set-Cookie',
      `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}`
    );
    return res.status(200).json({
      username: ADMIN_USERNAME
    });
  }

  if (body.action === 'verify') {
    if (!verifySession(getSessionCookie(req), sessionSecret)) {
      res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
      return sendError(res, 401, 'Admin session is invalid or has expired.');
    }
    return res.status(200).json({ username: ADMIN_USERNAME });
  }

  return sendError(res, 400, 'Unknown authentication action.');
}
