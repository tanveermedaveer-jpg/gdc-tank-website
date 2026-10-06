import { COLLEGE_ADDRESS, COLLEGE_PHONE } from './contactDetails';
import { DEFAULT_HOME_CONTENT } from './siteContentDefaults';

const DATABASE_NAME = 'casdct-local-portal';
const DATABASE_VERSION = 1;
const STORE_NAME = 'records';
const SESSION_MARKER_KEY = 'casdct_admin_session_active';
const SESSION_USERNAME_KEY = 'casdct_local_admin_username';
const ADMIN_USERNAME_KEY = 'casdct_local_admin_configured_username';
const ADMIN_PASSWORD_KEY = 'casdct_local_admin_configured_password';
const DEFAULT_ADMIN_USERNAME = 'Professor Salim Khan';
const DEFAULT_ADMIN_PASSWORD = '122011577';
const MAX_MEDIA_SIZE = 5 * 1024 * 1024;
const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;
const MAX_CIRCULAR_SIZE = 10 * 1024 * 1024;
const DEFAULT_SETTINGS = {
  principal_name: 'Prof. Shabir Ahmad',
  principal_message: '',
  principal_image_url: '',
  phone: COLLEGE_PHONE,
  address: COLLEGE_ADDRESS,
  merit_list_live: false
};

let databasePromise;
const fileUrlCache = new Map();
const channel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('casdct-local-portal');

const openDatabase = () => {
  if (!globalThis.indexedDB) {
    return Promise.reject(new Error('This browser does not support persistent local storage for the admin portal.'));
  }
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Unable to open local portal storage.'));
      request.onblocked = () => reject(new Error('Close other college website tabs to finish updating local storage.'));
    });
  }
  return databasePromise;
};

const readValue = async (key) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error || new Error('Unable to read local portal data.'));
    transaction.onabort = () => reject(transaction.error || new Error('Local portal data read was interrupted.'));
  });
};

const writeValue = async (key, value) => {
  await writeValues([[key, value]]);
  return value;
};

const writeValues = async (entries) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    entries.forEach(([key, value]) => store.put({ key, value }));
    transaction.oncomplete = () => {
      entries.forEach(([key]) => notifyLocalDataChanged(key));
      resolve();
    };
    transaction.onerror = () => reject(transaction.error || new Error('Unable to save local portal data.'));
    transaction.onabort = () => reject(transaction.error || new Error('Local portal data update was interrupted.'));
  });
};

const updateValue = async (key, updater, initialValue) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    let updatedValue;
    let result;
    request.onsuccess = () => {
      try {
        const updated = updater(request.result ? request.result.value : initialValue);
        updatedValue = updated.value;
        result = updated.result;
        store.put({ key, value: updatedValue });
      } catch (error) {
        transaction.abort();
        reject(error);
      }
    };
    transaction.oncomplete = () => {
      notifyLocalDataChanged(key);
      resolve(result);
    };
    transaction.onerror = () => reject(transaction.error || new Error('Unable to update local portal data.'));
    transaction.onabort = () => reject(transaction.error || new Error('Local portal data update was interrupted.'));
  });
};

const deleteValue = async (key) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Unable to remove local portal data.'));
    transaction.onabort = () => reject(transaction.error || new Error('Local portal data removal was interrupted.'));
  });
};

const notifyLocalDataChanged = (key) => {
  channel?.postMessage({ key });
  window.dispatchEvent(new CustomEvent('casdct_local_data_updated', { detail: { key } }));
};

const getOrCreateValue = async (key, factory) => {
  const current = await readValue(key);
  if (current !== undefined) return current;
  const value = await factory();
  await writeValue(key, value);
  return value;
};

const getAdmissions = () => getOrCreateValue('admissions', () => []);
const getFaculty = () => getOrCreateValue('faculty', () => []);
const getGallery = () => getOrCreateValue('gallery', () => []);
const getCirculars = () => getOrCreateValue('circulars', () => []);
const getSettings = () => getOrCreateValue('settings', () => ({ ...DEFAULT_SETTINGS }));

const parseLegacyNoticeDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
};

const getHomeContent = () => getOrCreateValue('homeContent', async () => {
  let legacyNotices = [];
  try {
    const parsedNotices = JSON.parse(localStorage.getItem('casdct_notices') || '[]');
    if (Array.isArray(parsedNotices)) legacyNotices = parsedNotices;
  } catch (error) {
    console.warn('Ignoring invalid legacy notices during the one-time local migration.', error);
  }
  const notices = legacyNotices
    .filter((notice) => typeof notice?.title === 'string' && notice.title.trim())
    .map((notice) => ({
      id: crypto.randomUUID(),
      date: parseLegacyNoticeDate(notice.date) || new Date().toISOString().slice(0, 10),
      title: notice.title.trim()
    }));
  let tickerAnnouncements = [];
  try {
    const storedTicker = JSON.parse(localStorage.getItem('casdct_ticker_announcements') || '[]');
    if (Array.isArray(storedTicker)) {
      tickerAnnouncements = storedTicker.filter((item) => typeof item === 'string' && item.trim());
    }
  } catch (error) {
    console.warn('Ignoring invalid legacy ticker content during the one-time local migration.', error);
  }
  const stats = [1, 2, 3, 4].map((index) => ({
    value: localStorage.getItem(`casdct_stat${index}_value`) || DEFAULT_HOME_CONTENT.stats[index - 1].value,
    label: localStorage.getItem(`casdct_stat${index}_label`) || DEFAULT_HOME_CONTENT.stats[index - 1].label
  }));
  return {
    ...DEFAULT_HOME_CONTENT,
    heroTitle: localStorage.getItem('casdct_hero_title') || DEFAULT_HOME_CONTENT.heroTitle,
    heroDesc: localStorage.getItem('casdct_hero_desc') || DEFAULT_HOME_CONTENT.heroDesc,
    notices,
    tickerAnnouncements,
    stats
  };
});

const getLocalAdminCredentials = () => {
  const username = localStorage.getItem(ADMIN_USERNAME_KEY);
  const password = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (username === null && password === null) {
    return { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD };
  }
  if (!username || !password) {
    throw new Error('Local admin credentials are incomplete. Set them again in Dashboard settings.');
  }
  return { username, password };
};

export const hasAdminSession = () => (
  localStorage.getItem(SESSION_MARKER_KEY) === '1'
  && Boolean(localStorage.getItem(SESSION_USERNAME_KEY))
);
export const getAdminSessionUsername = () => localStorage.getItem(SESSION_USERNAME_KEY) || '';

export const clearAdminSession = () => {
  localStorage.removeItem(SESSION_MARKER_KEY);
  localStorage.removeItem(SESSION_USERNAME_KEY);
  localStorage.removeItem('isAdminAuthenticated');
};

export { MAX_CIRCULAR_SIZE as MAX_CIRCULAR_SIZE_BYTES };

const isLocalSessionValid = () => {
  if (!hasAdminSession()) return false;
  return getAdminSessionUsername() === getLocalAdminCredentials().username;
};

export const signInAdmin = (username, password) => {
  const credentials = getLocalAdminCredentials();
  if (username !== credentials.username || password !== credentials.password) return null;
  localStorage.setItem(SESSION_USERNAME_KEY, credentials.username);
  localStorage.setItem(SESSION_MARKER_KEY, '1');
  return { username: credentials.username };
};

export const updateAdminCredentials = (username, password) => {
  if (typeof username !== 'string' || !username.trim()) {
    throw new Error('Enter a valid admin username.');
  }
  if (typeof password !== 'string' || password.length < 16 || password.length > 256) {
    throw new Error('New admin passwords must be between 16 and 256 characters.');
  }
  const normalizedUsername = username.trim();
  localStorage.setItem(ADMIN_USERNAME_KEY, normalizedUsername);
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  if (hasAdminSession()) {
    localStorage.setItem(SESSION_USERNAME_KEY, normalizedUsername);
  }
  return { username: normalizedUsername };
};

export const verifyAdminSession = () => {
  if (isLocalSessionValid()) return true;
  clearAdminSession();
  return false;
};

export const signOutAdmin = () => clearAdminSession();

const createFileUrl = (path, blob) => {
  if (!(blob instanceof Blob)) {
    throw new Error('The requested file is not available in this browser storage.');
  }
  const current = fileUrlCache.get(path);
  if (current?.blob === blob) return current.url;
  if (current) URL.revokeObjectURL(current.url);
  const url = URL.createObjectURL(blob);
  fileUrlCache.set(path, { blob, url });
  return url;
};

const removeLocalFile = async (path) => {
  if (!path) return;
  const blob = await readValue(`file:${path}`);
  if (blob) await deleteValue(`file:${path}`);
  const cached = fileUrlCache.get(path);
  if (cached) {
    URL.revokeObjectURL(cached.url);
    fileUrlCache.delete(path);
  }
};

const saveLocalFile = async (path, file, maxBytes, label) => {
  if (!(file instanceof Blob) || file.size <= 0 || file.size > maxBytes) {
    throw new Error(`${label} must be between 1 byte and ${Math.floor(maxBytes / 1024 / 1024)} MB.`);
  }
  await writeValue(`file:${path}`, file);
  return createFileUrl(path, file);
};

const mapGalleryRecord = async (item) => ({
  ...item,
  type: item.mediaType,
  desc: item.description,
  uploadedBy: item.uploadedBy,
  fileName: item.fileName,
  mimeType: item.contentType,
  size: item.fileSize > 1024 * 1024
    ? `${(item.fileSize / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(item.fileSize / 1024))} KB`,
  publicUrl: createFileUrl(item.storagePath, await readValue(`file:${item.storagePath}`)),
  status: item.status,
  isApproved: item.status === 'approved',
  uploadedTime: new Date(item.createdAt).toLocaleDateString('en', { dateStyle: 'medium' })
});

const mapFacultyRecord = async (member) => {
  const { photoBlob, ...fields } = member;
  return {
    ...fields,
    photo_url: photoBlob
      ? createFileUrl(member.photoPath, photoBlob)
      : member.photo_url || ''
  };
};

const mapCircularRecord = async (circular) => ({
  ...circular,
  public_url: createFileUrl(circular.storage_path, await readValue(`file:${circular.storage_path}`))
});

const validateSession = async () => {
  if (!isLocalSessionValid()) throw new Error('Admin session expired. Please sign in again.');
  if (!await verifyAdminSession()) {
    clearAdminSession();
    throw new Error('Admin session is invalid or has expired. Please sign in again.');
  }
};

const saveGalleryFile = async (payload, file, approved) => {
  if (!(file instanceof File)) throw new Error('Select an image or video file.');
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v', 'video/ogg', 'video/x-msvideo'].includes(file.type)) {
    throw new Error('Choose a supported image or video file.');
  }
  if (file.size > MAX_MEDIA_SIZE) throw new Error('Image and video files must be 5 MB or smaller.');
  if (!payload.title?.trim() || !['facilities', 'sports'].includes(payload.category)) {
    throw new Error('Enter a title and choose a valid gallery category.');
  }
  const item = {
    id: crypto.randomUUID(),
    title: payload.title.trim().slice(0, 180),
    mediaType: file.type.startsWith('video/') ? 'video' : 'image',
    category: payload.category,
    description: typeof payload.description === 'string' ? payload.description.trim().slice(0, 1000) : '',
    uploadedBy: approved ? 'Admin' : payload.uploaderName?.trim().slice(0, 120) || 'Student / Visitor',
    fileName: file.name.slice(0, 200),
    contentType: file.type,
    fileSize: file.size,
    storagePath: `gallery/${crypto.randomUUID()}`,
    status: approved ? 'approved' : 'pending',
    createdAt: new Date().toISOString()
  };
  await saveLocalFile(item.storagePath, file, MAX_MEDIA_SIZE, 'Gallery media');
  try {
    await updateValue('gallery', (gallery) => ({ value: [item, ...gallery] }), []);
  } catch (error) {
    await removeLocalFile(item.storagePath);
    throw error;
  }
  return mapGalleryRecord(item);
};

const bootstrap = async () => {
  const [admissions, faculty, settings, circulars, gallery, homeContent] = await Promise.all([
    getAdmissions(), getFaculty(), getSettings(), getCirculars(), getGallery(), getHomeContent()
  ]);
  return {
    admissions: await Promise.all(admissions.map(async (record) => ({
      ...record,
      feeSlipUrl: record.feeSlipPath ? createFileUrl(record.feeSlipPath, await readValue(`file:${record.feeSlipPath}`)) : ''
    }))),
    faculty: await Promise.all(faculty.map(mapFacultyRecord)),
    settings,
    circulars: await Promise.all(circulars.map(mapCircularRecord)),
    gallery: await Promise.all(gallery.map(mapGalleryRecord)),
    homeContent
  };
};

const saveAdmission = async (payload, file) => {
  const record = payload.record || {};
  const fullName = typeof record.fullName === 'string' ? record.fullName.trim() : '';
  const program = typeof record.program === 'string' ? record.program.trim() : '';
  const phone = typeof record.phone === 'string' ? record.phone.trim() : '';
  if (!fullName || !program || !phone) throw new Error('Complete the required name, program, and phone fields.');
  const regId = `STU-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const isBsProgram = program.toLowerCase().startsWith('bs');
  const obtained = Number(isBsProgram ? record.interObtainedMarks : record.matricMarks);
  const total = Number(isBsProgram ? record.interTotalMarks : record.matricTotal);
  const validMarks = Number.isFinite(obtained) && Number.isFinite(total) && obtained >= 0 && total > 0 && obtained <= total;
  const admission = {
    ...record,
    fullName,
    studentName: fullName,
    phone,
    program,
    regId,
    meritPct: validMarks ? Math.round((obtained / total) * 1000) / 10 : 0,
    marksText: validMarks ? `${obtained}/${total}` : 'N/A',
    status: 'pending',
    appliedAt: new Date().toISOString(),
    isPaid: false,
    feeVerified: false,
    feeAmount: null,
    feeSlipPath: ''
  };
  if (file) {
    if (!(file instanceof File) || !['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      throw new Error('Select a supported receipt file.');
    }
    admission.feeSlipPath = `receipts/${crypto.randomUUID()}`;
    admission.feeSlipName = file.name.slice(0, 200);
    await saveLocalFile(admission.feeSlipPath, file, MAX_RECEIPT_SIZE, 'Receipt');
  }
  try {
    await updateValue('admissions', (admissions) => ({ value: [admission, ...admissions] }), []);
  } catch (error) {
    await removeLocalFile(admission.feeSlipPath);
    throw error;
  }
  return { regId, program, meritPct: admission.meritPct };
};

const saveFaculty = async (payload, file) => {
  const source = payload.faculty || {};
  for (const field of ['name', 'designation', 'department', 'qualification']) {
    if (typeof source[field] !== 'string' || !source[field].trim()) {
      throw new Error(`${field} is required.`);
    }
  }
  if (file && (!(file instanceof File) || !file.type.startsWith('image/') || file.size > MAX_MEDIA_SIZE)) {
    throw new Error('Select a valid faculty photo no larger than 5 MB.');
  }
  let member;
  let oldPhotoPath = '';
  await updateValue('faculty', (faculty) => {
    const existing = faculty.find((item) => item.id === source.id);
    member = {
      ...existing,
      id: existing?.id || crypto.randomUUID(),
      name: source.name.trim(),
      designation: source.designation.trim(),
      department: source.department.trim(),
      qualification: source.qualification.trim(),
      contact: typeof source.contact === 'string' ? source.contact.trim() : '',
      is_hod: source.is_hod === true,
      sort_order: Number.isInteger(source.sort_order) ? source.sort_order : 0,
      photo_url: existing?.photo_url || '',
      photoPath: existing?.photoPath || '',
      photoBlob: existing?.photoBlob || null
    };
    if (file) {
      oldPhotoPath = member.photoPath;
      member.photoPath = `faculty/${crypto.randomUUID()}`;
      member.photoBlob = file;
      member.photo_url = '';
    }
    return { value: [member, ...faculty.filter((item) => item.id !== member.id)] };
  }, []);
  if (oldPhotoPath) await removeLocalFile(oldPhotoPath);
  return mapFacultyRecord(member);
};

const updateAdmissionRecord = async (payload) => {
  return await updateValue('admissions', (admissions) => {
    const index = admissions.findIndex((item) => item.regId === payload.regId);
    if (index < 0) throw new Error('The admission record no longer exists.');
    const updated = { ...admissions[index] };
    if (typeof payload.status === 'string') {
      if (!['pending', 'approved', 'rejected'].includes(payload.status)) throw new Error('Invalid admission status.');
      updated.status = payload.status;
    }
    if (typeof payload.trxId === 'string') updated.trxId = payload.trxId.trim().slice(0, 150);
    if (typeof payload.paymentMethod === 'string') updated.paymentMethod = payload.paymentMethod.trim().slice(0, 80);
    if (typeof payload.feeVerified === 'boolean') {
      updated.feeVerified = payload.feeVerified;
      updated.isPaid = payload.feeVerified;
    }
    if (Object.hasOwn(payload, 'feeAmount')) {
      const amount = payload.feeAmount === '' || payload.feeAmount === null ? null : Number(payload.feeAmount);
      if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 100_000_000)) {
        throw new Error('Enter a valid fee amount.');
      }
      updated.feeAmount = amount;
    }
    updated.paymentStatus = updated.feeVerified
      ? `Verified - ${updated.paymentMethod || 'Payment'}${updated.trxId ? ` TRX: ${updated.trxId}` : ''}`
      : updated.trxId
        ? `Submitted - ${updated.paymentMethod || 'Payment'} TRX: ${updated.trxId}`
        : 'Pending Slip';
    admissions[index] = updated;
    return { value: admissions, result: updated };
  }, []);
};

const saveSettings = async (payload) => {
  const settings = { ...await getSettings(), ...(payload.settings || {}) };
  await writeValue('settings', settings);
  return { username: getAdminSessionUsername(), settings };
};

const saveCircular = async (payload, file) => {
  if (!(file instanceof File) || file.type !== 'application/pdf' ||
      !file.name.toLowerCase().endsWith('.pdf') || file.size > MAX_CIRCULAR_SIZE) {
    throw new Error('Select a PDF file no larger than 10 MB.');
  }
  if (!payload.title?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(payload.publishDate || '')) {
    throw new Error('Provide a circular title and valid publish date.');
  }
  const circular = {
    id: crypto.randomUUID(),
    title: payload.title.trim().slice(0, 180),
    publish_date: payload.publishDate,
    storage_path: `circulars/${crypto.randomUUID()}`,
    file_name: file.name.slice(0, 200),
    created_at: new Date().toISOString()
  };
  await saveLocalFile(circular.storage_path, file, MAX_CIRCULAR_SIZE, 'Circular PDF');
  try {
    await updateValue('circulars', (circulars) => ({ value: [circular, ...circulars] }), []);
  } catch (error) {
    await removeLocalFile(circular.storage_path);
    throw error;
  }
  return mapCircularRecord(circular);
};

const saveHomeContent = async (source) => {
  if (!source || typeof source.heroTitle !== 'string' || !source.heroTitle.trim() ||
      !Array.isArray(source.stats) || source.stats.length !== 4 ||
      !Array.isArray(source.notices) || !Array.isArray(source.tickerAnnouncements)) {
    throw new Error('Homepage content contains missing or invalid fields.');
  }
  if (source.notices.length > 12 || source.tickerAnnouncements.length > 12) {
    throw new Error('A maximum of 12 notices and 12 ticker messages is allowed.');
  }
  const homeContent = {
    ...source,
    heroTitle: source.heroTitle.trim().slice(0, 180),
    heroDesc: typeof source.heroDesc === 'string' ? source.heroDesc.trim().slice(0, 1000) : '',
    stats: source.stats.map((stat) => ({
      value: String(stat.value || '').trim().slice(0, 40),
      label: String(stat.label || '').trim().slice(0, 100)
    })),
    notices: source.notices.map((notice) => ({
      id: notice.id || crypto.randomUUID(),
      date: notice.date,
      title: String(notice.title || '').trim().slice(0, 300)
    })),
    tickerAnnouncements: source.tickerAnnouncements.map((item) => String(item).trim().slice(0, 300))
  };
  if (homeContent.stats.some((item) => !item.value || !item.label) ||
      homeContent.notices.some((item) => !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
        Number.isNaN(Date.parse(`${item.date}T00:00:00Z`)) || !item.title) ||
      homeContent.tickerAnnouncements.some((item) => !item)) {
    throw new Error('Check homepage statistic values, announcement dates/titles, and ticker messages.');
  }
  await writeValue('homeContent', homeContent);
  return homeContent;
};

const handlePublicAction = async (action, payload, file) => {
  if (action === 'public.settings') return await getSettings();
  if (action === 'public.faculty') {
    return await Promise.all((await getFaculty()).map(mapFacultyRecord));
  }
  if (action === 'public.gallery') {
    return await Promise.all((await getGallery()).filter((item) => item.status === 'approved').map(mapGalleryRecord));
  }
  if (action === 'public.merit') {
    const settings = await getSettings();
    if (!settings.merit_list_live) return { published: false, admissions: [] };
    return {
      published: true,
      admissions: (await getAdmissions())
        .filter((record) => record.status === 'approved')
        .map((record) => ({
          regId: record.regId,
          fullName: record.fullName,
          program: record.program,
          meritPct: record.meritPct,
          marksText: record.marksText,
          status: record.status
        }))
    };
  }
  if (action === 'public.submitAdmission') return await saveAdmission(payload, file);
  if (action === 'public.gallery.upload') return await saveGalleryFile(payload, file, false);
  throw new Error(`Unknown local portal action: ${action}`);
};

const handleAdminAction = async (action, payload, file) => {
  await validateSession();
  switch (action) {
    case 'admin.bootstrap':
      return { ...(await bootstrap()), username: getAdminSessionUsername() };
    case 'admin.admission.update':
      return await updateAdmissionRecord(payload);
    case 'admin.faculty.save':
      return await saveFaculty(payload, file);
    case 'admin.faculty.delete': {
      const profile = await updateValue('faculty', (faculty) => {
        const existing = faculty.find((item) => item.id === payload.id);
        if (!existing) throw new Error('The faculty profile no longer exists.');
        return {
          value: faculty.filter((item) => item.id !== existing.id),
          result: existing
        };
      }, []);
      await removeLocalFile(profile.photoPath);
      return { id: profile.id };
    }
    case 'admin.gallery.upload':
      return await saveGalleryFile(payload, file, true);
    case 'admin.gallery.moderate': {
      if (!['approved', 'pending'].includes(payload.status) || !['facilities', 'sports'].includes(payload.category)) {
        throw new Error('Choose a valid gallery status and category.');
      }
      const updated = await updateValue('gallery', (gallery) => {
        const index = gallery.findIndex((item) => item.id === payload.id);
        if (index < 0) throw new Error('The gallery item no longer exists.');
        gallery[index] = { ...gallery[index], status: payload.status, category: payload.category };
        return { value: gallery, result: gallery[index] };
      }, []);
      return await mapGalleryRecord(updated);
    }
    case 'admin.gallery.delete': {
      const item = await updateValue('gallery', (gallery) => {
        const existing = gallery.find((entry) => entry.id === payload.id);
        if (!existing) throw new Error('The gallery item no longer exists.');
        return {
          value: gallery.filter((entry) => entry.id !== existing.id),
          result: existing
        };
      }, []);
      await removeLocalFile(item.storagePath);
      return { id: item.id };
    }
    case 'admin.settings.save':
      return await saveSettings(payload);
    case 'admin.merit.set': {
      if (typeof payload.published !== 'boolean') throw new Error('Choose whether the merit list should be published.');
      const settings = await updateValue('settings', (current) => {
        const updated = { ...current, merit_list_live: payload.published };
        return { value: updated, result: updated };
      }, { ...DEFAULT_SETTINGS });
      return settings;
    }
    case 'admin.circular.save':
      return await saveCircular(payload, file);
    case 'admin.circular.delete': {
      const circular = await updateValue('circulars', (circulars) => {
        const existing = circulars.find((item) => item.id === payload.id);
        if (!existing) throw new Error('The examination circular no longer exists.');
        return {
          value: circulars.filter((item) => item.id !== existing.id),
          result: existing
        };
      }, []);
      await removeLocalFile(circular.storage_path);
      return { id: circular.id };
    }
    case 'admin.homeContent.save':
      return await saveHomeContent(payload.homeContent);
    default:
      throw new Error(`Unknown local portal action: ${action}`);
  }
};

const request = async (action, payload = {}, file = null) => {
  if (action.startsWith('public.')) return await handlePublicAction(action, payload, file);
  if (action === 'auth.login') return await signInAdmin(payload.username, payload.password);
  if (action === 'auth.logout') return await signOutAdmin();
  if (action === 'auth.credentials.update') {
    return await updateAdminCredentials(payload.username, payload.password);
  }
  return await handleAdminAction(action, payload, file);
};

export const adminRequest = (action, payload) => request(action, payload);
export const adminFileRequest = (action, payload, file) => request(action, payload, file);
export const publicRequest = (action, payload) => request(action, payload);
export const publicFileRequest = (action, payload, file) => request(action, payload, file);

export const subscribeLocalData = (key, onData, onError) => {
  let isActive = true;
  const readLatest = async () => {
    try {
      const value = key === 'homeContent'
        ? await getHomeContent()
        : key === 'gallery'
          ? await getGallery()
          : key === 'faculty'
            ? await getFaculty()
            : key === 'settings'
              ? await getSettings()
              : key === 'circulars'
                ? await getCirculars()
                : await readValue(key);
      if (isActive) onData(value);
    } catch (error) {
      if (isActive) onError(error);
    }
  };
  const handleLocalUpdate = (event) => {
    if (event.detail?.key === key) readLatest();
  };
  const handleBroadcast = (event) => {
    if (event.data?.key === key) readLatest();
  };
  readLatest();
  window.addEventListener('casdct_local_data_updated', handleLocalUpdate);
  channel?.addEventListener('message', handleBroadcast);
  return () => {
    isActive = false;
    window.removeEventListener('casdct_local_data_updated', handleLocalUpdate);
    channel?.removeEventListener('message', handleBroadcast);
  };
};

export const subscribeHomeContent = (onContent, onError) =>
  subscribeLocalData('homeContent', onContent, onError);

export const subscribeMeritList = (onMeritList, onError) => {
  let admissions = [];
  let settings = {};
  let hasAdmissions = false;
  let hasSettings = false;
  const publish = () => {
    if (hasAdmissions && hasSettings) {
      const published = settings.merit_list_live === true;
      onMeritList({
        published,
        admissions: published
          ? admissions.filter((record) => record.status === 'approved').map((record) => ({
              regId: record.regId,
              fullName: record.fullName,
              program: record.program,
              meritPct: record.meritPct,
              marksText: record.marksText,
              status: record.status
            }))
          : []
      });
    }
  };
  const unsubscribeAdmissions = subscribeLocalData('admissions', (value) => {
    admissions = value;
    hasAdmissions = true;
    publish();
  }, onError);
  const unsubscribeSettings = subscribeLocalData('settings', (value) => {
    settings = value;
    hasSettings = true;
    publish();
  }, onError);
  return () => {
    unsubscribeAdmissions();
    unsubscribeSettings();
  };
};

export const subscribeLocalChanges = (keys, onChange) => {
  const allowedKeys = new Set(keys);
  const handleEvent = (event) => {
    if (allowedKeys.has(event.detail?.key)) onChange(event.detail.key);
  };
  const handleBroadcast = (event) => {
    if (allowedKeys.has(event.data?.key)) onChange(event.data.key);
  };
  window.addEventListener('casdct_local_data_updated', handleEvent);
  channel?.addEventListener('message', handleBroadcast);
  return () => {
    window.removeEventListener('casdct_local_data_updated', handleEvent);
    channel?.removeEventListener('message', handleBroadcast);
  };
};

export const subscribeApprovedGallery = (onItems, onError) =>
  subscribeLocalData('gallery', async (items) => {
    const approved = items.filter((item) => item.status === 'approved');
    onItems(await Promise.all(approved.map(async (item) => {
      const mapped = await mapGalleryRecord(item);
      return {
        ...mapped,
        mediaType: mapped.type,
        description: mapped.desc,
        uploadedBy: mapped.uploadedBy,
        fileName: mapped.fileName,
        image: mapped.publicUrl,
        mediaUrl: mapped.publicUrl
      };
    })));
  }, onError);

export const getLocalFileUrl = async (path) => {
  const blob = await readValue(`file:${path}`);
  if (!(blob instanceof Blob)) throw new Error('The requested file is not available in this browser storage.');
  return createFileUrl(path, blob);
};

export const getStoredHomeContent = () => getHomeContent();
export const getStoredGallery = () => getGallery();
