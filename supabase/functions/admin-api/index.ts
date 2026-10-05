import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')?.replace(/\/+$/, '');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const SESSION_SECRET = Deno.env.get('ADMIN_SESSION_SECRET');
const INITIAL_USERNAME = Deno.env.get('ADMIN_INITIAL_USERNAME');
const INITIAL_PASSWORD = Deno.env.get('ADMIN_INITIAL_PASSWORD');
const FIREBASE_SERVICE_ACCOUNT_JSON = Deno.env.get('FIREBASE_SERVICE_ACCOUNT_JSON');
const FIREBASE_STORAGE_BUCKET = Deno.env.get('FIREBASE_STORAGE_BUCKET');
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const PASSWORD_ITERATIONS = 310_000;
const MAX_BODY_BYTES = 16 * 1024 * 1024;
const FIREBASE_MEDIA_LIMIT = 5 * 1024 * 1024;
const FACULTY_PHOTO_LIMIT = 5 * 1024 * 1024;
const RECEIPT_LIMIT = 5 * 1024 * 1024;
const GALLERY_MEDIA_LIMIT = FIREBASE_MEDIA_LIMIT;
const GALLERY_MEDIA_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
  'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v',
  'video/ogg', 'video/x-msvideo'
];

type JsonRecord = Record<string, unknown>;
let cachedFirebaseToken: { value: string; expiresAt: number } | null = null;

const json = (body: JsonRecord, status = 200, origin = '') => new Response(
  status === 204 ? null : JSON.stringify(body),
  {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'apikey, authorization, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Vary': 'Origin'
    }
  }
);

const fail = (message: string, status = 400): never => {
  throw Object.assign(new Error(message), { status });
};

const encodeBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');

const decodeBase64Url = (value: string) => {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const hex = (bytes: Uint8Array) =>
  [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const encodeBase64UrlText = (value: string) =>
  btoa(value).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');

const decodePem = (value: string) => {
  const base64 = value.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

const getFirebaseAccessToken = async () => {
  if (cachedFirebaseToken && cachedFirebaseToken.expiresAt > Date.now() + 60_000) {
    return cachedFirebaseToken.value;
  }
  if (!FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new Error('Firebase server credentials have not been configured.');
  }

  let account: { client_email?: string; private_key?: string; token_uri?: string; project_id?: string };
  try {
    account = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch {
    throw new Error('Firebase service-account configuration is invalid.');
  }
  if (!account.client_email || !account.private_key || !account.project_id) {
    throw new Error('Firebase service-account configuration is incomplete.');
  }
  if (!FIREBASE_STORAGE_BUCKET) {
    throw new Error('Firebase Storage bucket has not been configured.');
  }

  const tokenUri = account.token_uri || 'https://oauth2.googleapis.com/token';
  const now = Math.floor(Date.now() / 1000);
  const assertionHeader = encodeBase64UrlText(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const assertionClaims = encodeBase64UrlText(JSON.stringify({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/devstorage.read_write',
    aud: tokenUri,
    iat: now,
    exp: now + 3600
  }));
  const unsignedAssertion = `${assertionHeader}.${assertionClaims}`;
  const signingKey = await crypto.subtle.importKey(
    'pkcs8',
    decodePem(account.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = new Uint8Array(await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    signingKey,
    new TextEncoder().encode(unsignedAssertion)
  ));
  const assertion = `${unsignedAssertion}.${encodeBase64Url(signature)}`;
  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });
  if (!response.ok) {
    console.error('Firebase service-token exchange failed:', response.status, (await response.text()).slice(0, 500));
    throw new Error('Firebase server authentication failed.');
  }
  const result = await response.json();
  if (typeof result.access_token !== 'string' || !Number.isFinite(Number(result.expires_in))) {
    throw new Error('Firebase returned an invalid service token.');
  }
  cachedFirebaseToken = {
    value: result.access_token,
    expiresAt: Date.now() + Number(result.expires_in) * 1000
  };
  return result.access_token;
};

const firebaseProjectId = async () => {
  if (!FIREBASE_SERVICE_ACCOUNT_JSON) throw new Error('Firebase server credentials have not been configured.');
  try {
    const account = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON);
    if (typeof account.project_id !== 'string' || !account.project_id) throw new Error();
    return account.project_id;
  } catch {
    throw new Error('Firebase service-account configuration is invalid.');
  }
};

const firestoreBaseUrl = async () =>
  `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(await firebaseProjectId())}/databases/(default)/documents`;

const encodeFirestoreValue = (value: unknown): JsonRecord => {
  if (value === null || value === undefined) return { nullValue: 'NULL_VALUE' };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeFirestoreValue) } };
  }
  if (typeof value === 'object') {
    const fields: JsonRecord = {};
    for (const [key, entry] of Object.entries(value)) fields[key] = encodeFirestoreValue(entry);
    return { mapValue: { fields } };
  }
  throw new Error('Unsupported Firestore value.');
};

const decodeFirestoreValue = (value: JsonRecord): unknown => {
  if (Object.hasOwn(value, 'nullValue')) return null;
  if (Object.hasOwn(value, 'stringValue')) return value.stringValue;
  if (Object.hasOwn(value, 'booleanValue')) return value.booleanValue;
  if (Object.hasOwn(value, 'integerValue')) return Number(value.integerValue);
  if (Object.hasOwn(value, 'doubleValue')) return Number(value.doubleValue);
  if (Object.hasOwn(value, 'timestampValue')) return value.timestampValue;
  if (Object.hasOwn(value, 'arrayValue')) {
    const arrayValue = value.arrayValue as JsonRecord;
    return Array.isArray(arrayValue.values)
      ? arrayValue.values.map((entry) => decodeFirestoreValue(entry as JsonRecord))
      : [];
  }
  if (Object.hasOwn(value, 'mapValue')) {
    const mapValue = value.mapValue as JsonRecord;
    const fields = (mapValue.fields || {}) as JsonRecord;
    return Object.fromEntries(Object.entries(fields).map(([key, entry]) =>
      [key, decodeFirestoreValue(entry as JsonRecord)]
    ));
  }
  return undefined;
};

const decodeFirestoreDocument = (document: JsonRecord) => {
  const fields = (document.fields || {}) as JsonRecord;
  const name = typeof document.name === 'string' ? document.name : '';
  return {
    id: name.split('/').pop() || '',
    ...Object.fromEntries(Object.entries(fields).map(([key, value]) =>
      [key, decodeFirestoreValue(value as JsonRecord)]
    ))
  } as JsonRecord;
};

const firebaseFetch = async (url: string, init: RequestInit = {}) => {
  const accessToken = await getFirebaseAccessToken();
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, ...init.headers }
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error('Firebase data request failed:', response.status, detail.slice(0, 500));
    throw new Error('The shared Firebase content service could not complete the request.');
  }
  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : null;
};

const readFirebaseCollection = async (collectionName: string) => {
  const baseUrl = await firestoreBaseUrl();
  const documents: JsonRecord[] = [];
  let nextPageToken = '';
  do {
    const url = new URL(`${baseUrl}/${collectionName}`);
    url.searchParams.set('pageSize', '1000');
    if (nextPageToken) url.searchParams.set('pageToken', nextPageToken);
    const result = await firebaseFetch(url.toString()) as JsonRecord;
    if (Array.isArray(result.documents)) documents.push(...result.documents.map(decodeFirestoreDocument));
    nextPageToken = typeof result.nextPageToken === 'string' ? result.nextPageToken : '';
  } while (nextPageToken);
  return documents;
};

const readFirebaseDocument = async (collectionName: string, documentId: string) => {
  const baseUrl = await firestoreBaseUrl();
  const response = await fetch(`${baseUrl}/${collectionName}/${encodeURIComponent(documentId)}`, {
    headers: { Authorization: `Bearer ${await getFirebaseAccessToken()}` }
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    console.error('Firebase document read failed:', response.status, (await response.text()).slice(0, 500));
    throw new Error('The shared Firebase content service could not complete the request.');
  }
  return decodeFirestoreDocument(await response.json());
};

const writeFirebaseDocument = async (collectionName: string, documentId: string, data: JsonRecord) => {
  const baseUrl = await firestoreBaseUrl();
  const fields: JsonRecord = {};
  for (const [key, value] of Object.entries(data)) fields[key] = encodeFirestoreValue(value);
  const updateMask = new URLSearchParams();
  Object.keys(fields).forEach((field) => updateMask.append('updateMask.fieldPaths', field));
  const result = await firebaseFetch(`${baseUrl}/${collectionName}/${encodeURIComponent(documentId)}?${updateMask}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  });
  return decodeFirestoreDocument(result as JsonRecord);
};

const deleteFirebaseDocument = async (collectionName: string, documentId: string) => {
  const baseUrl = await firestoreBaseUrl();
  await firebaseFetch(`${baseUrl}/${collectionName}/${encodeURIComponent(documentId)}`, { method: 'DELETE' });
};

const uploadFirebaseMedia = async (path: string, bytes: Uint8Array, contentType: string) => {
  if (!FIREBASE_STORAGE_BUCKET) throw new Error('Firebase Storage bucket has not been configured.');
  const boundary = `firebase-upload-${crypto.randomUUID()}`;
  const downloadToken = crypto.randomUUID();
  const metadata = JSON.stringify({
    name: path,
    contentType,
    metadata: { firebaseStorageDownloadTokens: downloadToken }
  });
  const encoder = new TextEncoder();
  const beforeFile = encoder.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
    `--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`
  );
  const afterFile = encoder.encode(`\r\n--${boundary}--`);
  const multipartBody = new Uint8Array(beforeFile.length + bytes.length + afterFile.length);
  multipartBody.set(beforeFile);
  multipartBody.set(bytes, beforeFile.length);
  multipartBody.set(afterFile, beforeFile.length + bytes.length);
  const response = await fetch(
    `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(FIREBASE_STORAGE_BUCKET)}/o?uploadType=multipart&name=${encodeURIComponent(path)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await getFirebaseAccessToken()}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    }
  );
  if (!response.ok) {
    console.error('Firebase Storage upload failed:', response.status, (await response.text()).slice(0, 500));
    throw new Error('The media file could not be uploaded to Firebase Storage.');
  }
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(FIREBASE_STORAGE_BUCKET)}/o/${encodeURIComponent(path)}?alt=media&token=${downloadToken}`;
};

const deleteFirebaseMedia = async (path: string) => {
  if (!FIREBASE_STORAGE_BUCKET) throw new Error('Firebase Storage bucket has not been configured.');
  const response = await fetch(
    `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(FIREBASE_STORAGE_BUCKET)}/o/${encodeURIComponent(path)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${await getFirebaseAccessToken()}` }
    }
  );
  if (response.status !== 404 && !response.ok) {
    console.error('Firebase Storage delete failed:', response.status, (await response.text()).slice(0, 500));
    throw new Error('The media record was updated, but its file could not be removed.');
  }
};

const fromHex = (value: string) =>
  Uint8Array.from(value.match(/.{2}/g) || [], (byte) => Number.parseInt(byte, 16));

const derivePasswordHash = async (password: string, salt = crypto.getRandomValues(new Uint8Array(16))) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PASSWORD_ITERATIONS },
    key,
    256
  ));
  return `pbkdf2$${PASSWORD_ITERATIONS}$${hex(salt)}$${hex(hash)}`;
};

const verifyPassword = async (password: string, storedHash: string) => {
  const [algorithm, iterationsText, saltText, expectedText] = storedHash.split('$');
  const iterations = Number(iterationsText);
  if (algorithm !== 'pbkdf2' || !Number.isInteger(iterations) ||
      iterations < 100_000 || iterations > 1_000_000 ||
      !/^[a-f0-9]{32}$/i.test(saltText || '') ||
      !/^[a-f0-9]{64}$/i.test(expectedText || '')) {
    throw new Error('Stored admin credential hash is invalid.');
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const actual = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltText), iterations },
    key,
    256
  ));
  const expected = fromHex(expectedText);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual[index] ^ expected[index];
  }
  return difference === 0;
};

const credentialsUrl = `${SUPABASE_URL}/rest/v1/admin_credentials?id=eq.1&select=id,username,password_hash,session_version`;

const serviceFetch = async (path: string, init: RequestInit = {}) => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Supabase Edge Function service configuration is incomplete.');
  }
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers
    }
  });
  const text = await response.text();
  if (!response.ok) {
    console.error('Supabase service request failed:', response.status, text.slice(0, 500));
    throw new Error('The shared data service could not complete the request.');
  }
  return text ? JSON.parse(text) : null;
};

const getCredentials = async () => {
  const rows = await serviceFetch(credentialsUrl);
  return Array.isArray(rows) ? rows[0] || null : null;
};

const saveCredentials = async (username: string, passwordHash: string, sessionVersion: number) => {
  await serviceFetch('/rest/v1/admin_credentials?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      id: 1,
      username,
      password_hash: passwordHash,
      session_version: sessionVersion
    })
  });
};

const loginAllowed = async (username: string) => {
  const result = await serviceFetch('/rest/v1/rpc/admin_login_allowed', {
    method: 'POST',
    body: JSON.stringify({ requested_username: username })
  });
  return result === true;
};

const registerLoginFailure = async (username: string) => {
  await serviceFetch('/rest/v1/rpc/admin_login_failure', {
    method: 'POST',
    body: JSON.stringify({ requested_username: username })
  });
};

const clearLoginFailures = async (username: string) => {
  await serviceFetch('/rest/v1/rpc/admin_login_success', {
    method: 'POST',
    body: JSON.stringify({ requested_username: username })
  });
};

const saveHomeContent = async (source: unknown) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    fail('Provide valid homepage content.');
  }
  const data = source as JsonRecord;
  const heroTitle = typeof data.heroTitle === 'string' ? data.heroTitle.trim() : '';
  const heroDesc = typeof data.heroDesc === 'string' ? data.heroDesc.trim() : '';
  const stats = Array.isArray(data.stats) ? data.stats : [];
  const notices = Array.isArray(data.notices) ? data.notices : [];
  const tickerAnnouncements = Array.isArray(data.tickerAnnouncements) ? data.tickerAnnouncements : [];
  if (!heroTitle || heroTitle.length > 180 || heroDesc.length > 1000 || stats.length !== 4 ||
      notices.length > 12 || tickerAnnouncements.length > 12) {
    fail('Homepage content contains missing or invalid fields.');
  }

  const cleanStats = stats.map((stat) => {
    if (!stat || typeof stat !== 'object' || Array.isArray(stat)) fail('Enter valid homepage statistics.');
    const item = stat as JsonRecord;
    if (typeof item.value !== 'string' || !item.value.trim() || item.value.length > 40 ||
        typeof item.label !== 'string' || !item.label.trim() || item.label.length > 100) {
      fail('Each homepage statistic needs a value and label.');
    }
    return { value: item.value.trim(), label: item.label.trim() };
  });
  const cleanNotices = notices.map((notice) => {
    if (!notice || typeof notice !== 'object' || Array.isArray(notice)) fail('Enter valid homepage announcements.');
    const item = notice as JsonRecord;
    if (typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
        Number.isNaN(Date.parse(`${item.date}T00:00:00Z`)) ||
        typeof item.title !== 'string' || !item.title.trim() || item.title.length > 300) {
      fail('Each announcement needs a valid date and title.');
    }
    return { id: crypto.randomUUID(), date: item.date, title: item.title.trim() };
  });
  const cleanTicker = tickerAnnouncements.map((announcement) => {
    if (typeof announcement !== 'string' || !announcement.trim() || announcement.length > 300) {
      fail('Ticker announcements must be non-empty text up to 300 characters.');
    }
    return announcement.trim();
  });
  return await writeFirebaseDocument('siteContent', 'home', {
    heroTitle,
    heroDesc,
    stats: cleanStats,
    notices: cleanNotices,
    tickerAnnouncements: cleanTicker,
    updatedAt: new Date().toISOString()
  });
};

const reservePublicGalleryUpload = async (request: Request, byteSize: number) => {
  const forwardedIps = request.headers.get('x-forwarded-for')
    ?.split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);
  const ip = request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    forwardedIps?.at(-1) ||
    'unknown';
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip)));
  const visitorHash = hex(digest);
  const allowed = await serviceFetch('/rest/v1/rpc/reserve_public_gallery_upload', {
    method: 'POST',
    body: JSON.stringify({ requested_visitor_hash: visitorHash, requested_bytes: byteSize })
  });
  if (allowed !== true) fail('This network has reached the daily gallery upload limit. Please try again tomorrow.', 429);
};

const signToken = async (username: string, sessionVersion: number) => {
  if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
    throw new Error('Admin session signing secret is not configured securely.');
  }
  const payload = encodeBase64Url(new TextEncoder().encode(JSON.stringify({
    sub: username,
    ver: sessionVersion,
    exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60
  })));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = new Uint8Array(await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  ));
  return `${payload}.${encodeBase64Url(signature)}`;
};

const verifyToken = async (request: Request) => {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !SESSION_SECRET || SESSION_SECRET.length < 32) fail('Admin session is missing or expired.', 401);
  const [payload, signature] = token.split('.');
  if (!payload || !signature) fail('Admin session is invalid.', 401);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const validSignature = await crypto.subtle.verify(
    'HMAC',
    key,
    decodeBase64Url(signature),
    new TextEncoder().encode(payload)
  );
  if (!validSignature) fail('Admin session is invalid.', 401);

  let session: { sub?: string; ver?: number; exp?: number };
  try {
    session = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
  } catch {
    fail('Admin session is invalid.', 401);
  }
  if (!session.sub || !Number.isInteger(session.ver) ||
      !Number.isInteger(session.exp) || session.exp! <= Date.now() / 1000) {
    fail('Admin session has expired. Please sign in again.', 401);
  }
  const credentials = await getCredentials();
  if (!credentials || credentials.username !== session.sub ||
      credentials.session_version !== session.ver) {
    fail('Admin session is no longer valid. Please sign in again.', 401);
  }
  return credentials;
};

const db = (table: string, query = '') =>
  `/rest/v1/${table}${query ? `?${query}` : ''}`;

const uploadedFileBytes = async (file: unknown, allowedTypes: string[], maxBytes: number, label: string) => {
  if (!(file instanceof File) || !allowedTypes.includes(file.type)) {
    fail(`Select a supported ${label} file.`);
  }
  if (file.size <= 0 || file.size > maxBytes) {
    fail(`The ${label} file must be between 1 byte and ${Math.floor(maxBytes / 1024 / 1024)} MB.`);
  }
  return { bytes: new Uint8Array(await file.arrayBuffer()), mimeType: file.type };
};

const storePublicFile = async (bucket: string, path: string, bytes: Uint8Array, mimeType: string) => {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': mimeType,
      'x-upsert': 'false'
    },
    body: bytes
  });
  if (!response.ok) {
    console.error('Supabase file upload failed:', response.status, (await response.text()).slice(0, 500));
    throw new Error('The file could not be uploaded to shared storage.');
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};

const removeStoredFile = async (bucket: string, path: string) => {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}`, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prefixes: [path] })
  });
  if (!response.ok) {
    console.error('Supabase file removal failed:', response.status, (await response.text()).slice(0, 500));
    throw new Error('The record was updated, but its previous file could not be removed.');
  }
};

const createReceiptUrl = async (path: string) => {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/admission-receipts/${path}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ expiresIn: 3600 })
  });
  if (!response.ok) {
    console.error('Unable to create a private receipt link:', response.status, (await response.text()).slice(0, 500));
    throw new Error('A fee receipt could not be opened. Refresh the dashboard and try again.');
  }
  const result = await response.json();
  const url = result.signedURL || result.signedUrl;
  return url?.startsWith('http') ? url : `${SUPABASE_URL}/storage/v1${url}`;
};

const readTable = (table: string, query: string) => serviceFetch(db(table, query));

const migrateLegacyGallery = async (existingDocuments: JsonRecord[]) => {
  const existingIds = new Set(existingDocuments.map((row) => String(row.id)));
  const migratedDocuments: JsonRecord[] = [];
  const legacyRows = await readTable(
    'gallery_media',
    'select=id,title,media_type,category,description,uploaded_by,file_name,content_type,file_size,storage_path,status,created_at&order=created_at.desc'
  );
  for (const legacy of (legacyRows || []) as JsonRecord[]) {
    const id = String(legacy.id || '');
    const oldPath = typeof legacy.storage_path === 'string' ? legacy.storage_path : '';
    const fileSize = Number(legacy.file_size);
    if (!id || existingIds.has(id)) continue;
    if (!oldPath || !Number.isFinite(fileSize) || fileSize <= 0 || fileSize > 10 * 1024 * 1024) {
      throw new Error(`Legacy gallery item ${id || '(unknown)'} has invalid media metadata and needs manual review.`);
    }
    const fileResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/gallery-media/${oldPath.split('/').map(encodeURIComponent).join('/')}`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    if (!fileResponse.ok) {
      console.error('Unable to read legacy Supabase gallery file:', id, fileResponse.status);
      throw new Error('An existing gallery file could not be copied to Firebase. Check its Supabase Storage object.');
    }
    const fileBytes = new Uint8Array(await fileResponse.arrayBuffer());
    const contentType = String(legacy.content_type || fileResponse.headers.get('Content-Type') || '');
    if (!GALLERY_MEDIA_TYPES.includes(contentType) || fileBytes.length !== fileSize) {
      throw new Error(`Legacy gallery item ${id} has unsupported or inconsistent file metadata.`);
    }
    const extension = String(legacy.file_name || '').split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
    const storagePath = `gallery/${id}.${extension}`;
    const publicUrl = await uploadFirebaseMedia(storagePath, fileBytes, contentType);
    try {
      const migrated = await writeFirebaseDocument('galleryMedia', id, {
        id,
        title: String(legacy.title || '').slice(0, 180),
        mediaType: legacy.media_type === 'video' ? 'video' : 'image',
        category: legacy.category === 'sports' ? 'sports' : 'facilities',
        description: String(legacy.description || '').slice(0, 1000),
        uploadedBy: String(legacy.uploaded_by || 'Student / Visitor').slice(0, 120),
        fileName: String(legacy.file_name || `${id}.${extension}`).slice(0, 200),
        contentType,
        fileSize: fileBytes.length,
        storagePath,
        publicUrl,
        status: legacy.status === 'approved' ? 'approved' : 'pending',
        createdAt: typeof legacy.created_at === 'string' ? legacy.created_at : new Date().toISOString()
      });
      existingIds.add(id);
      migratedDocuments.push(migrated);
    } catch (error) {
      try {
        await deleteFirebaseMedia(storagePath);
      } catch (cleanupError) {
        console.error('Unable to remove a migrated Firebase gallery file after its metadata write failed:', cleanupError);
      }
      throw error;
    }
  }
  return migratedDocuments;
};

const bootstrap = async () => {
  const [admissionRows, faculty, settingRows, circulars, galleryRows, content] = await Promise.all([
    readTable('admissions', 'select=reg_id,record,fee_verified,fee_amount&order=created_at.desc'),
    readTable('faculty_profiles', 'select=id,name,designation,department,qualification,contact,photo_url,photo_path,is_hod&order=sort_order.asc,name.asc'),
    readTable('site_settings', 'select=data&id=eq.global'),
    readTable('examination_circulars', 'select=id,title,publish_date,storage_path,file_name,created_at&order=publish_date.desc,created_at.desc'),
    readFirebaseCollection('galleryMedia'),
    readFirebaseDocument('siteContent', 'home')
  ]);
  const migratedGallery = await migrateLegacyGallery(galleryRows);
  const admissions = await Promise.all((admissionRows || []).map(async (row: JsonRecord) => {
    const record = row.record as JsonRecord;
    return {
      ...record,
      regId: row.reg_id,
      feeVerified: row.fee_verified,
      feeAmount: row.fee_amount,
      feeSlipUrl: record.feeSlipPath
        ? await createReceiptUrl(String(record.feeSlipPath))
        : ''
    };
  }));
  return {
    admissions,
    faculty: faculty || [],
    settings: settingRows?.[0]?.data || {},
    circulars: circulars || [],
    gallery: [...galleryRows, ...migratedGallery].map(mapGalleryRow),
    homeContent: content || {}
  };
};

const mapGalleryRow = (row: JsonRecord) => ({
  id: row.id,
  title: row.title,
  type: row.mediaType ?? row.media_type,
  category: row.category,
  desc: row.description,
  uploadedBy: row.uploadedBy ?? row.uploaded_by,
  fileName: row.fileName ?? row.file_name,
  mimeType: row.contentType ?? row.content_type,
  size: Number(row.fileSize ?? row.file_size) > 1024 * 1024
    ? `${(Number(row.fileSize ?? row.file_size) / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(Number(row.fileSize ?? row.file_size) / 1024))} KB`,
  publicUrl: row.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/gallery-media/${row.storage_path}`,
  status: row.status,
  isApproved: row.status === 'approved',
  uploadedTime: new Date(String(row.createdAt ?? row.created_at)).toLocaleDateString('en', { dateStyle: 'medium' })
});

const saveGalleryMedia = async (body: JsonRecord, approved: boolean, request: Request) => {
  const file = body.media_file;
  if (!(file instanceof File)) fail('Select a gallery image or video.');
  const { bytes, mimeType } = await uploadedFileBytes(
    file,
    GALLERY_MEDIA_TYPES,
    GALLERY_MEDIA_LIMIT,
    'gallery image or video'
  );
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (body.category !== 'sports' && body.category !== 'facilities') fail('Choose a valid gallery category.');
  const category = body.category;
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const uploaderName = typeof body.uploaderName === 'string' ? body.uploaderName.trim() : '';
  if (!title || title.length > 180 || description.length > 1000 || uploaderName.length > 120) {
    fail('Enter a title and valid description/uploader details for this gallery upload.');
  }
  if (!approved) await reservePublicGalleryUpload(request, file.size);
  const pathExtension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
  const id = crypto.randomUUID();
  const storagePath = `gallery/${id}.${pathExtension}`;
  const publicUrl = await uploadFirebaseMedia(storagePath, bytes, mimeType);
  const row = {
    id,
    title,
    mediaType: mimeType.startsWith('video/') ? 'video' : 'image',
    category,
    description,
    uploadedBy: approved ? 'Admin' : uploaderName || 'Student / Visitor',
    fileName: file.name.slice(0, 200),
    contentType: mimeType,
    fileSize: file.size,
    storagePath,
    publicUrl,
    status: approved ? 'approved' : 'pending',
    createdAt: new Date().toISOString()
  };
  try {
    return mapGalleryRow(await writeFirebaseDocument('galleryMedia', id, row));
  } catch (error) {
    try {
      await deleteFirebaseMedia(storagePath);
    } catch (cleanupError) {
      console.error('Unable to clean up Firebase media after metadata save failed:', cleanupError);
    }
    throw error;
  }
};

const saveFaculty = async (body: JsonRecord) => {
  const source = (body.faculty || {}) as JsonRecord;
  const fields = ['name', 'designation', 'department', 'qualification', 'contact'];
  const row: JsonRecord = {};
  for (const field of fields) {
    const value = source[field];
    if (typeof value !== 'string' || value.trim().length > 500) {
      fail(`Enter a valid ${field.replaceAll('_', ' ')}.`);
    }
    row[field] = value.trim();
  }
  if (fields.slice(0, 4).some((field) => !(row[field] as string).trim())) {
    fail('Name, designation, department, and qualification are required.');
  }
  row.is_hod = source.is_hod === true;
  row.sort_order = typeof source.sort_order === 'number' && Number.isInteger(source.sort_order)
    ? source.sort_order
    : 0;
  let oldPhotoPath = '';
  let uploadedPhotoPath = '';
  const existing = source.id
    ? (await readTable('faculty_profiles', `select=id,photo_path&id=eq.${encodeURIComponent(String(source.id))}`))?.[0]
    : null;
  if (source.id && !existing) fail('The faculty profile no longer exists.', 404);

  const photoFile = body.photo_file;
  if (photoFile) {
    const { bytes, mimeType } = await uploadedFileBytes(
      photoFile,
      ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      FACULTY_PHOTO_LIMIT,
      'faculty photo'
    );
    const extension = mimeType.split('/')[1].replace('jpeg', 'jpg');
    uploadedPhotoPath = `${crypto.randomUUID()}.${extension}`;
    const photoUrl = await storePublicFile('faculty-photos', uploadedPhotoPath, bytes, mimeType);
    row.photo_path = uploadedPhotoPath;
    row.photo_url = photoUrl;
    oldPhotoPath = existing?.photo_path || '';
  } else if (existing) {
    row.photo_path = existing.photo_path;
    row.photo_url = source.photo_url || '';
  }

  let saved;
  try {
    saved = source.id
      ? await serviceFetch(db('faculty_profiles', `id=eq.${encodeURIComponent(String(source.id))}`), {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(row)
        })
      : await serviceFetch(db('faculty_profiles'), {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(row)
        });
    if (!saved?.[0]) fail('The faculty profile could not be saved.', 500);
  } catch (error) {
    if (uploadedPhotoPath) {
      try {
        await removeStoredFile('faculty-photos', uploadedPhotoPath);
      } catch (cleanupError) {
        console.error('Failed to clean up a faculty image after a profile update failed:', cleanupError);
      }
    }
    throw error;
  }
  if (oldPhotoPath) await removeStoredFile('faculty-photos', oldPhotoPath);
  return saved[0];
};

const publicSettings = (data: JsonRecord = {}) => ({
  principal_name: data.principal_name || '',
  principal_message: data.principal_message || '',
  principal_image_url: data.principal_image_url || '',
  phone: data.phone || '',
  address: data.address || '',
  merit_list_live: data.merit_list_live === true
});

const mergeSettings = (data: JsonRecord, current: JsonRecord = {}) => ({
    ...current,
    principal_name: typeof data.principal_name === 'string' ? data.principal_name.trim() : current.principal_name || '',
    principal_message: typeof data.principal_message === 'string' ? data.principal_message.trim() : current.principal_message || '',
    principal_image_url: typeof data.principal_image_url === 'string' ? data.principal_image_url : current.principal_image_url || '',
    phone: typeof data.phone === 'string' ? data.phone.trim() : current.phone || '',
    address: typeof data.address === 'string' ? data.address.trim() : current.address || '',
    merit_list_live: typeof data.merit_list_live === 'boolean' ? data.merit_list_live : current.merit_list_live === true
  });

const updateSettings = async (data: JsonRecord) => {
  const existing = await readTable('site_settings', 'select=data&id=eq.global');
  const merged = mergeSettings(data, existing?.[0]?.data || {});
  await serviceFetch(db('site_settings', 'id=eq.global'), {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ data: merged, updated_at: new Date().toISOString() })
  });
  return merged;
};

const login = async (body: JsonRecord) => {
  const initialUsername = INITIAL_USERNAME?.trim() || '';
  if (!initialUsername || initialUsername.length > 120 ||
      !INITIAL_PASSWORD || INITIAL_PASSWORD.length < 10 || INITIAL_PASSWORD.length > 256) {
    throw new Error('The initial admin username and password have not been configured in Supabase.');
  }
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!username || !password || username.length > 120 || password.length > 256) {
    fail('Enter a valid admin username and password.', 401);
  }
  if (!(await loginAllowed(username))) {
    fail('Too many failed sign-in attempts. Try again in 15 minutes.', 429);
  }

  let credentials = await getCredentials();
  if (!credentials) {
    if (username !== initialUsername || password !== INITIAL_PASSWORD) {
      await registerLoginFailure(username);
      fail('Invalid username or password.', 401);
    }
    credentials = {
      username: initialUsername,
      password_hash: await derivePasswordHash(INITIAL_PASSWORD),
      session_version: 1
    };
    await saveCredentials(credentials.username, credentials.password_hash, credentials.session_version);
    credentials = await getCredentials();
  }

  if (!credentials || username !== credentials.username ||
      !(await verifyPassword(password, credentials.password_hash))) {
    await registerLoginFailure(username);
    fail('Invalid username or password.', 401);
  }
  await clearLoginFailures(username);
  return {
    token: await signToken(credentials.username, credentials.session_version),
    username: credentials.username
  };
};

const handleAction = async (request: Request, body: JsonRecord) => {
  const action = typeof body.action === 'string' ? body.action : '';
  if (action === 'auth.login') return login(body);
  if (action === 'public.faculty') {
    return await readTable('faculty_profiles', 'select=id,name,designation,department,qualification,contact,photo_url,is_hod&order=sort_order.asc,name.asc') || [];
  }
  if (action === 'public.gallery') {
    const rows = await readFirebaseCollection('galleryMedia');
    return rows.filter((row) => row.status === 'approved').map(mapGalleryRow);
  }
  if (action === 'public.settings') {
    const rows = await readTable('site_settings', 'select=data&id=eq.global');
    return publicSettings(rows?.[0]?.data || {});
  }
  if (action === 'public.merit') {
    const rows = await readTable('site_settings', 'select=data&id=eq.global');
    const settings = rows?.[0]?.data || {};
    if (settings.merit_list_live !== true) return { published: false, admissions: [] };
    const admissionRows = await readTable('admissions', 'select=record,reg_id,fee_verified,fee_amount&record->>status=eq.approved');
    return {
      published: true,
      admissions: (admissionRows || []).map((row: JsonRecord) => {
        const record = row.record as JsonRecord;
        return {
          regId: row.reg_id,
          fullName: record.fullName,
          program: record.program,
          meritPct: record.meritPct,
          marksText: record.marksText || `${record.matricMarks ?? ''}/${record.matricTotal ?? ''}`,
          status: record.status
        };
      })
    };
  }
  if (action === 'public.submitAdmission') {
    const record = (body.record || {}) as JsonRecord;
    const name = typeof record.fullName === 'string' ? record.fullName.trim() : '';
    const program = typeof record.program === 'string' ? record.program.trim() : '';
    const phone = typeof record.phone === 'string' ? record.phone.trim() : '';
    if (!name || !program || !phone) fail('Complete the required name, program, and phone fields.');
    if (name.length > 180 || program.length > 120 || phone.length > 80) {
      fail('One or more application fields are too long.');
    }
    const fields = [
      'fatherName', 'dob', 'gender', 'cnic', 'domicile', 'email', 'address',
      'matricBoard', 'matricRollNo', 'matricPassingYear', 'interBoard',
      'interRollNo', 'interPassingYear', 'paymentMethod', 'trxId'
    ];
    const applicantFields: JsonRecord = {
      fullName: name,
      studentName: name,
      program,
      phone,
      mobile: phone
    };
    for (const field of fields) {
      const value = record[field];
      if (value !== undefined) {
        if (typeof value !== 'string' || value.length > 500) fail(`Invalid application field: ${field}.`);
        applicantFields[field] = value.trim();
      }
    }
    const isBsProgram = program.toLowerCase().startsWith('bs');
    const obtainedMarks = Number(isBsProgram ? record.interObtainedMarks : record.matricMarks);
    const totalMarks = Number(isBsProgram ? record.interTotalMarks : record.matricTotal);
    const validMarks = Number.isFinite(obtainedMarks) && Number.isFinite(totalMarks) &&
      obtainedMarks >= 0 && totalMarks > 0 && obtainedMarks <= totalMarks;
    const meritPct = validMarks ? Math.round((obtainedMarks / totalMarks) * 1000) / 10 : 0;
    applicantFields.matricMarks = isBsProgram ? 0 : validMarks ? obtainedMarks : 0;
    applicantFields.matricTotal = isBsProgram ? 0 : validMarks ? totalMarks : 0;
    applicantFields.interObtainedMarks = isBsProgram && validMarks ? String(obtainedMarks) : '';
    applicantFields.interTotalMarks = isBsProgram && validMarks ? String(totalMarks) : '';
    applicantFields.marksText = validMarks ? `${obtainedMarks}/${totalMarks}` : 'N/A';
    applicantFields.meritPct = meritPct;
    applicantFields.paymentStatus = applicantFields.trxId
      ? `Submitted - ${applicantFields.paymentMethod || 'Payment'} TRX: ${applicantFields.trxId}`
      : 'Pending Slip';
    const regId = `STU-${crypto.getRandomValues(new Uint32Array(1))[0] % 900000 + 100000}`;
    const safeRecord = {
      ...applicantFields,
      regId,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      isPaid: false,
      feeVerified: false,
      feeAmount: null
    };
    const receiptFile = body.receipt_file;
    if (receiptFile) {
      if (!(receiptFile instanceof File)) fail('Select a valid receipt file.');
      const { bytes, mimeType } = await uploadedFileBytes(
        receiptFile,
        ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        RECEIPT_LIMIT,
        'receipt'
      );
      const extension = receiptFile.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
      const storagePath = `${crypto.randomUUID()}.${extension}`;
      await storePublicFile('admission-receipts', storagePath, bytes, mimeType);
      safeRecord.feeSlipName = receiptFile.name.slice(0, 200);
      safeRecord.feeSlipPath = storagePath;
    }
    try {
      await serviceFetch(db('admissions'), {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          reg_id: regId,
          record: safeRecord,
          fee_verified: false,
          fee_amount: null
        })
      });
    } catch (error) {
      if (safeRecord.feeSlipPath) {
        try {
          await removeStoredFile('admission-receipts', String(safeRecord.feeSlipPath));
        } catch (cleanupError) {
          console.error('Unable to remove a receipt after application submission failed:', cleanupError);
        }
      }
      throw error;
    }
    return {
      regId,
      program: safeRecord.program,
      meritPct: safeRecord.meritPct
    };
  }
  if (action === 'public.gallery.upload') return await saveGalleryMedia(body, false, request);

  const credentials = await verifyToken(request);
  switch (action) {
    case 'admin.bootstrap':
      return { ...(await bootstrap()), username: credentials.username };
    case 'admin.faculty.save':
      return await saveFaculty(body);
    case 'admin.faculty.delete': {
      const id = typeof body.id === 'string' ? body.id : '';
      if (!id) fail('Select a faculty profile to delete.');
      const existing = (await readTable('faculty_profiles', `select=id,photo_path&id=eq.${encodeURIComponent(id)}`))?.[0];
      if (!existing) fail('The faculty profile no longer exists.', 404);
      await serviceFetch(db('faculty_profiles', `id=eq.${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' }
      });
      if (existing.photo_path) await removeStoredFile('faculty-photos', existing.photo_path);
      return { id };
    }
    case 'admin.gallery.upload':
      return await saveGalleryMedia(body, true, request);
    case 'admin.gallery.moderate': {
      const id = typeof body.id === 'string' ? body.id : '';
      if (!id) fail('Select a gallery item to update.');
      if (body.status !== 'approved' && body.status !== 'pending') fail('Choose a valid gallery status.');
      if (body.category !== 'facilities' && body.category !== 'sports') fail('Choose a valid gallery category.');
      const existing = await readFirebaseDocument('galleryMedia', id);
      if (!existing) fail('The gallery item no longer exists.', 404);
      const updated = await writeFirebaseDocument('galleryMedia', id, {
        ...existing,
        status: body.status,
        category: body.category
      });
      return mapGalleryRow(updated);
    }
    case 'admin.gallery.delete': {
      const id = typeof body.id === 'string' ? body.id : '';
      if (!id) fail('Select a gallery item to delete.');
      const existing = await readFirebaseDocument('galleryMedia', id);
      if (!existing) fail('The gallery item no longer exists.', 404);
      await deleteFirebaseDocument('galleryMedia', id);
      if (typeof existing.storagePath === 'string') await deleteFirebaseMedia(existing.storagePath);
      return { id };
    }
    case 'admin.homeContent.save':
      return await saveHomeContent(body.homeContent);
    case 'admin.admission.update': {
      const regId = typeof body.regId === 'string' ? body.regId.trim() : '';
      if (!regId) fail('Select an admission record to update.');
      const rows = await readTable('admissions', `select=record,fee_verified,fee_amount&reg_id=eq.${encodeURIComponent(regId)}`);
      if (!rows?.[0]) fail('The admission record no longer exists.', 404);
      const record = rows[0].record as JsonRecord;
      record.feeVerified = rows[0].fee_verified;
      record.feeAmount = rows[0].fee_amount;
      record.isPaid = rows[0].fee_verified;
      if (typeof body.status === 'string') {
        if (!['pending', 'approved', 'rejected'].includes(body.status)) fail('Invalid admission status.');
        record.status = body.status;
      }
      if (typeof body.trxId === 'string') record.trxId = body.trxId.trim().slice(0, 150);
      if (typeof body.paymentMethod === 'string') record.paymentMethod = body.paymentMethod.trim().slice(0, 80);
      if (typeof body.feeVerified === 'boolean') {
        record.feeVerified = body.feeVerified;
        record.isPaid = body.feeVerified;
      }
      const hasFeeAmount = Object.hasOwn(body, 'feeAmount');
      const feeAmount = body.feeAmount === '' || body.feeAmount === null
        ? null
        : Number(body.feeAmount);
      if (hasFeeAmount && feeAmount !== null &&
          (!Number.isFinite(feeAmount) || feeAmount < 0 || feeAmount > 100_000_000)) {
        fail('Enter a valid fee amount.');
      }
      if (hasFeeAmount) record.feeAmount = feeAmount;
      if (body.feeVerified === true && !record.trxId && !record.feeSlipPath) {
        fail('Add a transaction ID or receipt before verifying this payment.');
      }
      if (body.trxId !== undefined || body.paymentMethod !== undefined || body.feeVerified !== undefined) {
        record.paymentStatus = record.feeVerified
          ? `Verified - ${record.paymentMethod || 'Payment'}${record.trxId ? ` TRX: ${record.trxId}` : ''}`
          : record.trxId
            ? `Submitted - ${record.paymentMethod || 'Payment'} TRX: ${record.trxId}`
            : 'Pending Slip';
      }
      await serviceFetch(db('admissions', `reg_id=eq.${encodeURIComponent(regId)}`), {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          record,
          fee_verified: typeof body.feeVerified === 'boolean' ? body.feeVerified : rows[0].fee_verified,
          fee_amount: hasFeeAmount ? feeAmount : rows[0].fee_amount
        })
      });
      return {
        ...record,
        regId,
        feeVerified: typeof body.feeVerified === 'boolean' ? body.feeVerified : rows[0].fee_verified,
        feeAmount: hasFeeAmount ? feeAmount : rows[0].fee_amount
      };
    }
    case 'admin.settings.save': {
      const settings = (body.settings || {}) as JsonRecord;
      if (typeof body.username !== 'string' || !body.username.trim() || body.username.trim().length > 120) {
        fail('Enter a valid admin username.');
      }
      const username = body.username.trim();
      const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
      if (newPassword && newPassword.length < 10) fail('New admin passwords must be at least 10 characters long.');
      if (newPassword.length > 256) fail('New admin passwords must be 256 characters or fewer.');
      if (typeof settings.principal_name === 'string' && settings.principal_name.length > 180) fail('Principal name is too long.');
      if (typeof settings.principal_message === 'string' && settings.principal_message.length > 5000) fail('Principal message is too long.');
      if (typeof settings.address === 'string' && settings.address.length > 500) fail('Address is too long.');
      if (typeof settings.phone === 'string' && settings.phone.length > 80) fail('Phone number is too long.');
      const existing = await readTable('site_settings', 'select=data&id=eq.global');
      const savedSettings = mergeSettings(settings, existing?.[0]?.data || {});
      const passwordHash = newPassword ? await derivePasswordHash(newPassword) : null;
      const result = await serviceFetch('/rest/v1/rpc/admin_save_settings', {
        method: 'POST',
        body: JSON.stringify({
          requested_settings: savedSettings,
          requested_username: username,
          requested_password_hash: passwordHash
        })
      });
      if (result.credentials_changed) {
        return {
          settings: savedSettings,
          username,
          credentialsChanged: true,
          token: await signToken(username, result.session_version)
        };
      }
      return { settings: savedSettings, username, credentialsChanged: false };
    }
    case 'admin.merit.set': {
      if (typeof body.published !== 'boolean') fail('Choose whether the merit list should be published.');
      return await updateSettings({ merit_list_live: body.published });
    }
    case 'admin.circular.save': {
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const publishDate = typeof body.publishDate === 'string' ? body.publishDate : '';
      const circularFile = body.circular_file;
      if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(publishDate) || !(circularFile instanceof File) ||
          circularFile.type !== 'application/pdf' || !circularFile.name.toLowerCase().endsWith('.pdf')) {
        fail('Provide a circular title, publish date, and valid PDF file.');
      }
      const { bytes } = await uploadedFileBytes(circularFile, ['application/pdf'], 10 * 1024 * 1024, 'PDF');
      const storagePath = `${crypto.randomUUID()}.pdf`;
      await storePublicFile('examination-circulars', storagePath, bytes, 'application/pdf');
      try {
        const rows = await serviceFetch(db('examination_circulars'), {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({
            title,
            publish_date: publishDate,
            storage_path: storagePath,
            file_name: circularFile.name.slice(0, 200)
          })
        });
        return rows?.[0];
      } catch (error) {
        try {
          await removeStoredFile('examination-circulars', storagePath);
        } catch (cleanupError) {
          console.error('Failed to remove a PDF after circular metadata creation failed:', cleanupError);
        }
        throw error;
      }
    }
    case 'admin.circular.delete': {
      const id = typeof body.id === 'string' ? body.id : '';
      if (!id) fail('Select an examination circular to delete.');
      const rows = await readTable('examination_circulars', `select=id,storage_path&id=eq.${encodeURIComponent(id)}`);
      if (!rows?.[0]) fail('The examination circular no longer exists.', 404);
      await serviceFetch(db('examination_circulars', `id=eq.${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' }
      });
      await removeStoredFile('examination-circulars', rows[0].storage_path);
      return { id };
    }
    default:
      fail('Unknown admin service action.', 404);
  }
};

serve(async (request) => {
  const origin = request.headers.get('Origin') || '';
  if (!ALLOWED_ORIGINS.length) {
    return json({ error: 'Admin service allowed origins have not been configured.' }, 503, '');
  }
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return json({ error: 'This site is not allowed to use the admin service.' }, 403, '');
  }
  if (request.method === 'OPTIONS') return json({}, 204, origin);
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, origin);

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'Request is too large.' }, 413, origin);

  try {
    let body: JsonRecord;
    if (request.headers.get('Content-Type')?.toLowerCase().includes('multipart/form-data')) {
      const form = await request.formData();
      body = {};
      for (const [key, value] of form.entries()) {
        if (key === 'faculty' || key === 'record') {
          try {
            body[key] = JSON.parse(String(value));
          } catch {
            fail(`The ${key} form data is invalid.`);
          }
        } else {
          body[key] = value;
        }
      }
    } else {
      body = await request.json();
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) fail('Invalid request body.');
    const result = await handleAction(request, body as JsonRecord);
    return json({ data: result }, 200, origin);
  } catch (error) {
    const status = Number((error as { status?: number })?.status) || 500;
    const message = status >= 500
      ? (error instanceof Error && error.message.includes('configuration')
          ? error.message
          : 'The shared admin service encountered an error. Please try again.')
      : (error instanceof Error ? error.message : 'Invalid request.');
    if (status >= 500) console.error('Admin API request failed:', error);
    return json({ error: message }, status, origin);
  }
});
