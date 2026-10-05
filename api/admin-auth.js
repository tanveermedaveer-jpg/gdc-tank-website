import {
  ApiError,
  getVerifiedAdmin,
  isSameOrigin,
  parseJsonBody,
  sendError
} from '../server/_server.js';

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
      return res.status(200).json({ ok: true });
    }
    if (body.action === 'login' || body.action === 'verify') {
      const admin = await getVerifiedAdmin(req);
      return res.status(200).json({ username: admin.email });
    }
    throw new ApiError(400, 'Unknown authentication action.');
  } catch (error) {
    return sendError(res, error);
  }
}
