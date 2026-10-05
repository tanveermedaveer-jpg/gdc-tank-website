import { neon } from '@neondatabase/serverless';
import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp } from 'firebase-admin/app';

let schemaPromise;
const FIREBASE_PROJECT_ID = 'degree-college-tank';

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
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  await schemaPromise;
  return sql;
};

export const getFirebaseAdminUid = () => {
  const uid = process.env.FIREBASE_ADMIN_UID;
  if (!uid || uid.length > 128) {
    throw new ApiError(503, 'Admin access is not configured. Set FIREBASE_ADMIN_UID to the administrator user UID in Vercel.');
  }
  return uid;
};

const getFirebaseAuth = () => {
  const app = getApps().find((item) => item.name === 'portal-auth') ||
    initializeApp({ projectId: FIREBASE_PROJECT_ID }, 'portal-auth');
  return getAuth(app);
};

export const verifyFirebaseIdToken = async (idToken) => {
  const auth = getFirebaseAuth();
  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    if (typeof error?.code === 'string' && error.code.startsWith('auth/')) {
      throw new ApiError(401, 'Invalid or expired Firebase sign-in. Please try again.');
    }
    throw error;
  }
  const adminUid = getFirebaseAdminUid();
  if (decodedToken.uid !== adminUid || typeof decodedToken.email !== 'string') {
    throw new ApiError(403, 'This Firebase account is not authorized for the admin portal.');
  }
  return { uid: decodedToken.uid, email: decodedToken.email };
};

export const getFirebaseIdToken = (req) => {
  const authorization = req.headers?.authorization;
  const match = typeof authorization === 'string' && authorization.match(/^Bearer ([^\s]+)$/i);
  if (!match || match[1].length > 8192) {
    throw new ApiError(401, 'Sign in with the authorized Firebase admin account to continue.');
  }
  return match[1];
};

export const getVerifiedAdmin = async (req) => {
  const token = getFirebaseIdToken(req);
  return await verifyFirebaseIdToken(token);
};

export const getAuthenticatedAdmin = async (req) => {
  const admin = await getVerifiedAdmin(req);
  const sql = await getDatabase();
  return { sql, admin };
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
    : 'The server could not complete this request. Verify the configured services and try again.';
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
