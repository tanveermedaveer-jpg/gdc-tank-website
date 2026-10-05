import { issueSignedToken } from '@vercel/blob';
import { handleUploadPresigned } from '@vercel/blob/client';
import { ApiError, getAuthenticatedAdmin, getDatabase, isSameOrigin, sendError } from '../server/_server.js';

const getUploadPolicy = async (req, pathname, clientPayload) => {
  let payload;
  try {
    payload = JSON.parse(clientPayload || '{}');
  } catch {
    throw new ApiError(400, 'Invalid file upload request.');
  }
  if (typeof pathname !== 'string' ||
      !/^(receipts|gallery|faculty|circulars)\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(pathname)) {
    throw new ApiError(400, 'Invalid file path.');
  }
  const isPublicSubmission = payload.publicSubmission === true;
  if (isPublicSubmission) {
    if (!pathname.startsWith('receipts/') && !pathname.startsWith('gallery/')) {
      throw new ApiError(403, 'Public uploads are not allowed for this file type.');
    }
  } else {
    await getAuthenticatedAdmin(req);
  }

  let allowedContentTypes;
  let maximumSizeInBytes;
  if (pathname.startsWith('receipts/')) {
    allowedContentTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    maximumSizeInBytes = 5 * 1024 * 1024;
  } else if (pathname.startsWith('faculty/')) {
    allowedContentTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    maximumSizeInBytes = 5 * 1024 * 1024;
  } else if (pathname.startsWith('circulars/')) {
    allowedContentTypes = ['application/pdf'];
    maximumSizeInBytes = 10 * 1024 * 1024;
  } else {
    allowedContentTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
      'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v',
      'video/ogg', 'video/x-msvideo'
    ];
    maximumSizeInBytes = 5 * 1024 * 1024;
  }
  return { allowedContentTypes, maximumSizeInBytes, addRandomSuffix: false, access: 'private', tokenPayload: JSON.stringify({ path: pathname }) };
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const result = await handleUploadPresigned({
      body: req.body,
      request: req,
      getSignedToken: async (pathname, clientPayload) => {
        if (!isSameOrigin(req)) throw new ApiError(403, 'Cross-origin request denied.');
        const policy = await getUploadPolicy(req, pathname, clientPayload);
        const token = await issueSignedToken({
          pathname,
          operations: ['put'],
          allowedContentTypes: policy.allowedContentTypes,
          maximumSizeInBytes: policy.maximumSizeInBytes,
          validUntil: Date.now() + 10 * 60 * 1000
        });
        return {
          token,
          urlOptions: {
            allowedContentTypes: policy.allowedContentTypes,
            maximumSizeInBytes: policy.maximumSizeInBytes,
            addRandomSuffix: false,
            allowOverwrite: false,
            validUntil: Date.now() + 10 * 60 * 1000,
            tokenPayload: policy.tokenPayload
          }
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        let payload;
        try {
          payload = JSON.parse(tokenPayload || '{}');
        } catch {
          throw new ApiError(400, 'Invalid completed file upload metadata.');
        }
        const path = payload.path;
        if (typeof path !== 'string' || !/^(receipts|gallery|faculty|circulars)\/[a-zA-Z0-9-]+$/.test(path)) {
          throw new ApiError(400, 'Invalid completed file path.');
        }
        const sql = await getDatabase();
        await sql`
          INSERT INTO casdct_portal_files (path, pathname, content_type, is_public)
          VALUES (${path}, ${blob.pathname}, ${blob.contentType}, ${path.startsWith('faculty/') || path.startsWith('circulars/')})
          ON CONFLICT (path) DO UPDATE SET
            pathname = EXCLUDED.pathname,
            content_type = EXCLUDED.content_type,
            updated_at = NOW()
        `;
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}
