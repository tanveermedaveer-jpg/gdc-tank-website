import { randomUUID } from 'node:crypto';
import {
  ApiError,
  getAuthenticatedAdmin,
  getDatabase,
  isSameOrigin,
  parseJsonBody,
  sendError
} from '../server/_server.js';

const ADMIN_KEYS = new Set([
  'admissions', 'faculty', 'gallery', 'circulars', 'settings', 'homeContent'
]);
const PUBLIC_KEYS = new Set([
  'settings', 'faculty', 'gallery', 'circulars', 'homeContent', 'admissions'
]);

const readRecord = async (sql, key) => {
  const rows = await sql`
    SELECT value, version FROM casdct_portal_records WHERE record_key = ${key} LIMIT 1
  `;
  return rows[0] || { value: undefined, version: 0 };
};

const saveRecord = async (sql, key, value, expectedVersion) => {
  const rows = await sql`
    INSERT INTO casdct_portal_records (record_key, value, version)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb, 1)
    ON CONFLICT (record_key) DO UPDATE SET
      value = EXCLUDED.value,
      version = casdct_portal_records.version + 1,
      updated_at = NOW()
    WHERE casdct_portal_records.version = ${expectedVersion}
    RETURNING version
  `;
  if (!rows.length) throw new ApiError(409, 'This record changed on another device. Refresh and try again.');
  if (key === 'gallery') {
    await sql`
      UPDATE casdct_portal_files AS file SET is_public = EXISTS (
        SELECT 1 FROM jsonb_array_elements(${JSON.stringify(value)}::jsonb) AS item
        WHERE item->>'storagePath' = file.path
          AND item->>'status' = 'approved'
      )
      WHERE file.path LIKE 'gallery/%'
    `;
  }
  return rows[0].version;
};

const getPublicValue = async (sql, key) => {
  const record = await readRecord(sql, key);
  if (key === 'admissions') {
    const settings = await readRecord(sql, 'settings');
    if (settings.value?.merit_list_live !== true) return [];
    return (Array.isArray(record.value) ? record.value : [])
      .filter((item) => item.status === 'approved')
      .map(({ regId, fullName, program, meritPct, marksText, status }) =>
        ({ regId, fullName, program, meritPct, marksText, status }));
  }
  if (key === 'gallery') {
    return (Array.isArray(record.value) ? record.value : [])
      .filter((item) => item.status === 'approved');
  }
  return record.value;
};

const appendPublicRecord = async (sql, key, value) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const current = await readRecord(sql, key);
    try {
      await saveRecord(sql, key, [value, ...(Array.isArray(current.value) ? current.value : [])], current.version);
      return;
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 409 || attempt === 4) throw error;
    }
  }
};

const savePublicRecord = async (sql, body) => {
  const key = body.key;
  if (key !== 'admissions' && key !== 'gallery') {
    throw new ApiError(403, 'Public submissions are not allowed for this record.');
  }
  const item = body.value;
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new ApiError(400, 'Invalid public submission.');
  }
  if (key === 'admissions') {
    const fullName = typeof item.fullName === 'string' ? item.fullName.trim().slice(0, 160) : '';
    const program = typeof item.program === 'string' ? item.program.trim().slice(0, 120) : '';
    const phone = typeof item.phone === 'string' ? item.phone.trim().slice(0, 40) : '';
    if (!fullName || !program || !phone) throw new ApiError(400, 'Complete the required name, program, and phone fields.');
    if (item.feeSlipPath && !String(item.feeSlipPath).startsWith('receipts/')) {
      throw new ApiError(400, 'Invalid receipt file reference.');
    }
    const value = {
      ...item,
      fullName,
      studentName: fullName,
      program,
      phone,
      regId: `STU-${randomUUID().slice(0, 8).toUpperCase()}`,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      isPaid: false,
      feeVerified: false,
      feeAmount: null
    };
    delete value.id;
    if (value.feeSlipPath) {
      const files = await sql`SELECT path FROM casdct_portal_files WHERE path = ${value.feeSlipPath} LIMIT 1`;
      if (!files.length) throw new ApiError(400, 'The uploaded receipt is not available.');
    }
    await appendPublicRecord(sql, key, value);
    return { regId: value.regId, program: value.program, meritPct: value.meritPct };
  }

  if (typeof item.title !== 'string' || !item.title.trim() ||
      !['facilities', 'sports'].includes(item.category) ||
      typeof item.storagePath !== 'string' || !item.storagePath.startsWith('gallery/')) {
    throw new ApiError(400, 'Provide valid gallery media details.');
  }
  const files = await sql`SELECT path FROM casdct_portal_files WHERE path = ${item.storagePath} LIMIT 1`;
  if (!files.length) throw new ApiError(400, 'The uploaded gallery file is not available.');
  const value = {
    id: randomUUID(),
    title: item.title.trim().slice(0, 180),
    mediaType: item.mediaType === 'video' ? 'video' : 'image',
    category: item.category,
    description: typeof item.description === 'string' ? item.description.slice(0, 1000) : '',
    uploadedBy: typeof item.uploadedBy === 'string' ? item.uploadedBy.slice(0, 120) : 'Student / Visitor',
    fileName: String(item.fileName || '').slice(0, 200),
    contentType: String(item.contentType || ''),
    fileSize: Number(item.fileSize) || 0,
    storagePath: item.storagePath,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  await appendPublicRecord(sql, key, value);
  return { id: value.id, status: value.status };
};

const migrateRecord = async (sql, body) => {
  if (!ADMIN_KEYS.has(body.key) || !body.value || typeof body.value !== 'object') {
    throw new ApiError(400, 'Invalid local data migration.');
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const current = await readRecord(sql, body.key);
    let value = body.value;
    if (Array.isArray(current.value) && Array.isArray(body.value)) {
      const idField = body.key === 'admissions' ? 'regId' : 'id';
      const merged = new Map(current.value.map((item) => [item[idField], item]));
      let hasNewItems = false;
      body.value.forEach((item) => {
        if (item && typeof item === 'object' && item[idField] && !merged.has(item[idField])) {
          merged.set(item[idField], item);
          hasNewItems = true;
        }
      });
      if (!hasNewItems) return { migrated: false };
      value = [...merged.values()];
    } else if (current.value !== undefined) {
      return { migrated: false };
    }
    try {
      await saveRecord(sql, body.key, value, current.version);
      return { migrated: true };
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 409 || attempt === 4) throw error;
    }
  }
  throw new ApiError(409, 'Local data migration conflicted with another update. Sign in and try again.');
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    try {
      const key = req.query?.key;
      if (typeof key !== 'string' || !ADMIN_KEYS.has(key)) {
        throw new ApiError(400, 'Unknown portal data record.');
      }
      const sql = await getDatabase();
      if (PUBLIC_KEYS.has(key)) {
        let admin = false;
        if (req.headers?.authorization) {
          try {
            await getAuthenticatedAdmin(req);
            admin = true;
          } catch (error) {
            if (!(error instanceof ApiError) || error.status !== 401) throw error;
          }
        }
        const record = await readRecord(sql, key);
        return res.status(200).json({
          value: admin ? record.value : await getPublicValue(sql, key),
          version: record.version
        });
      }
      const { sql: authenticatedSql } = await getAuthenticatedAdmin(req);
      const record = await readRecord(authenticatedSql, key);
      return res.status(200).json({ value: record.value, version: record.version });
    } catch (error) {
        return sendError(res, error);
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  if (!isSameOrigin(req)) return res.status(403).json({ error: 'Cross-origin request denied.' });

  try {
    const body = parseJsonBody(req);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ApiError(400, 'Invalid portal data request.');
    }
    if (body.action === 'public.append') {
      const sql = await getDatabase();
      return res.status(200).json(await savePublicRecord(sql, body));
    }
    const { sql } = await getAuthenticatedAdmin(req);
    if (body.action === 'migrate') {
      return res.status(200).json(await migrateRecord(sql, body));
    }
    if (body.action === 'write') {
      if (!ADMIN_KEYS.has(body.key) || !Number.isInteger(body.expectedVersion) ||
          body.expectedVersion < 0 || body.value === undefined) {
        throw new ApiError(400, 'Invalid portal data update.');
      }
      const version = await saveRecord(sql, body.key, body.value, body.expectedVersion);
      return res.status(200).json({ version });
    }
    throw new ApiError(400, 'Unknown portal data action.');
  } catch (error) {
    return sendError(res, error);
  }
}
