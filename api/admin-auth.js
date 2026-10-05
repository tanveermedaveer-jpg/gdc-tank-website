import {
  ApiError,
  clearSessionCookie,
  createSessionToken,
  getAdminCredential,
  getAuthenticatedAdmin,
  getDatabase,
  getLoginAddressHash,
  isSameOrigin,
  parseJsonBody,
  sendError,
  setSessionCookie,
  verifyPassword
} from '../server/_server.js';

const LOGIN_ATTEMPT_LIMIT = 5;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  if (!isSameOrigin(req)) return res.status(403).json({ error: 'Cross-origin request denied.' });

  try {
    const body = parseJsonBody(req);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ApiError(400, 'Invalid authentication request.');
    }
    if (body.action === 'logout') {
      clearSessionCookie(res);
      return res.status(200).json({ ok: true });
    }
    if (body.action === 'login') {
      if (typeof body.username !== 'string' || typeof body.password !== 'string' ||
          body.username.length > 80 || body.password.length > 256) {
        throw new ApiError(401, 'Invalid admin username or password.');
      }
      const sql = await getDatabase();
      const credential = await getAdminCredential(sql);
      const addressHash = getLoginAddressHash(req);
      const attempts = await sql`
        INSERT INTO casdct_admin_login_attempts (address_hash, attempt_count, window_started_at)
        VALUES (${addressHash}, 1, NOW())
        ON CONFLICT (address_hash) DO UPDATE SET
          attempt_count = CASE
            WHEN casdct_admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes'
            THEN 1
            ELSE casdct_admin_login_attempts.attempt_count + 1
          END,
          window_started_at = CASE
            WHEN casdct_admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes'
            THEN NOW()
            ELSE casdct_admin_login_attempts.window_started_at
          END
        RETURNING attempt_count
      `;
      if (Number(attempts[0]?.attempt_count) > LOGIN_ATTEMPT_LIMIT) {
        throw new ApiError(429, 'Too many login attempts. Try again in 15 minutes.');
      }
      const passwordMatches = await verifyPassword(body.password, credential);
      if (body.username !== credential.username || !passwordMatches) {
        clearSessionCookie(res);
        throw new ApiError(401, 'Invalid admin username or password.');
      }
      await sql`DELETE FROM casdct_admin_login_attempts WHERE address_hash = ${addressHash}`;
      setSessionCookie(res, createSessionToken(credential));
      return res.status(200).json({ username: credential.username });
    }
    if (body.action === 'verify') {
      const { credential } = await getAuthenticatedAdmin(req);
      return res.status(200).json({ username: credential.username });
    }
    throw new ApiError(400, 'Unknown authentication action.');
  } catch (error) {
    if (error.status === 401) clearSessionCookie(res);
    return sendError(res, error);
  }
}
