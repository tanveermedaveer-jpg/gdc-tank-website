import { get, head, del } from '@vercel/blob';
import { Readable } from 'node:stream';
import { ApiError, getAuthenticatedAdmin, getDatabase, isSameOrigin, parseJsonBody, sendError } from '../server/_server.js';

const isSafePath = (path) =>
  typeof path === 'string' &&
  /^(receipts|gallery|faculty|circulars)\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(path);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const path = req.query?.path;
  if (!isSafePath(path)) return res.status(400).json({ error: 'Invalid file path.' });

  try {
    const sql = await getDatabase();
    if (req.method === 'POST') {
      if (!isSameOrigin(req)) throw new ApiError(403, 'Cross-origin request denied.');
      const body = parseJsonBody(req);
      const publicSubmission = body?.publicSubmission === true;
      if (publicSubmission) {
        if (!path.startsWith('receipts/') && !path.startsWith('gallery/')) {
          throw new ApiError(403, 'Public uploads are not allowed for this file type.');
        }
      } else {
        await getAuthenticatedAdmin(req);
      }
      if (body.path !== path || body.pathname !== path || typeof body.contentType !== 'string') {
        throw new ApiError(400, 'Invalid uploaded file metadata.');
      }
      const blob = await head(path, { access: 'private' });
      await sql`
        INSERT INTO casdct_portal_files (path, pathname, content_type, is_public)
        VALUES (${path}, ${blob.pathname}, ${blob.contentType || body.contentType},
          ${path.startsWith('faculty/') || path.startsWith('circulars/')})
        ON CONFLICT (path) DO UPDATE SET
          pathname = EXCLUDED.pathname,
          content_type = EXCLUDED.content_type,
          updated_at = NOW()
      `;
      return res.status(200).json({ path });
    }
    const rows = await sql`
      SELECT pathname, content_type, is_public
      FROM casdct_portal_files WHERE path = ${path} LIMIT 1
    `;
    if (!rows.length) throw new ApiError(404, 'The requested file is not available.');
    const file = rows[0];
    if (!file.is_public) await getAuthenticatedAdmin(req);

    if (req.method === 'HEAD') return res.status(204).end();
    if (req.method === 'GET') {
      const result = await get(file.pathname, { access: 'private' });
      if (!result || result.statusCode !== 200) throw new ApiError(404, 'The requested file is not available.');
      res.setHeader('Content-Type', file.content_type || result.blob.contentType || 'application/octet-stream');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', 'inline');
      Readable.fromWeb(result.stream).pipe(res);
      return;
    }
    if (req.method === 'DELETE') {
      if (!isSameOrigin(req)) throw new ApiError(403, 'Cross-origin request denied.');
      await getAuthenticatedAdmin(req);
      await del(file.pathname, { access: 'private' });
      await sql`DELETE FROM casdct_portal_files WHERE path = ${path}`;
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, HEAD, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    if (res.headersSent) {
      console.error('Unable to stream portal file:', error);
      return res.end();
    }
    return sendError(res, error);
  }
}
