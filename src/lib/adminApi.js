// Pure Local Storage API implementation - No External Backend Dependencies

export const MAX_CIRCULAR_SIZE_BYTES = 10 * 1024 * 1024;

// Helper utilities for local storage key management
const STORAGE_KEYS = {
  ADMISSIONS: 'casdct_admissions',
  GALLERY: 'casdct_gallery',
  FACULTY: 'casdct_faculty',
  NOTICES: 'casdct_notices',
  SETTINGS: 'casdct_settings'
};

const getStoredData = (key, fallback = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('casdct_local_storage_updated'));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

export const getLocalFileUrl = (file) => {
  if (!file) return '';
  if (typeof file === 'string') return file;
  return file.image_url || file.file_url || file.photo_url || file.url || '';
};
export const getFileUrl = (file) => getLocalFileUrl(file);
export const getPublicFileUrl = (file) => getLocalFileUrl(file);
export const publicFileUrl = (file) => getLocalFileUrl(file);
export const localFileUrl = (file) => getLocalFileUrl(file);

export const getAdminSessionUsername = () => localStorage.getItem('adminUser') || 'admin';
export const signOutAdmin = () => localStorage.removeItem('adminUser');

const fileToBase64 = (file) => new Promise((resolve) => {
  if (!file) { resolve(''); return; }
  const reader = new FileReader();
  const blob = file instanceof Blob ? file : new Blob([file]);
  reader.readAsDataURL(blob);
  reader.onload = () => resolve(reader.result || '');
  reader.onerror = () => resolve('');
});

export const adminRequest = async (action, payload = {}) => {
  if (action === 'admin.bootstrap') {
    return {
      username: getAdminSessionUsername(),
      admissions: getStoredData(STORAGE_KEYS.ADMISSIONS, []),
      gallery: getStoredData(STORAGE_KEYS.GALLERY, []),
      faculty: getStoredData(STORAGE_KEYS.FACULTY, []),
      circulars: getStoredData(STORAGE_KEYS.NOTICES, []),
      settings: getStoredData(STORAGE_KEYS.SETTINGS, {
        principal_name: 'Captain Ashfaq Shaheed',
        principal_message: 'Welcome to Captain Ashfaq Shaheed Degree College, Tank.',
        principal_image_url: '',
        phone: '0963-123456',
        address: 'Tank, KPK',
        merit_list_live: true
      })
    };
  }

  if (action === 'admin.gallery.delete') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, []);
    const updated = list.filter(item => item.id !== payload.id);
    setStoredData(STORAGE_KEYS.GALLERY, updated);
    return { success: true };
  }

  if (action === 'admin.faculty.delete') {
    const list = getStoredData(STORAGE_KEYS.FACULTY, []);
    const updated = list.filter(item => item.id !== payload.id);
    setStoredData(STORAGE_KEYS.FACULTY, updated);
    return { success: true };
  }

  if (action === 'admin.admission.update') {
    const list = getStoredData(STORAGE_KEYS.ADMISSIONS, []);
    const updated = list.map(item => item.regId === payload.regId ? { ...item, ...payload } : item);
    setStoredData(STORAGE_KEYS.ADMISSIONS, updated);
    return { success: true };
  }

  return { success: true };
};

export const adminFileRequest = async (action, payload = {}, file) => {
  let fileBase64 = '';
  if (file) {
    fileBase64 = await fileToBase64(file);
  }

  if (action === 'admin.gallery.upload') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, []);
    const newItem = {
      id: Date.now().toString(),
      title: payload.title || 'Campus Photo',
      category: payload.category || 'General',
      image_url: fileBase64 || payload.image_url || '',
      filename: file?.name || '',
      description: payload.description || '',
      status: 'approved',
      date: new Date().toISOString().split('T')[0]
    };
    list.unshift(newItem);
    setStoredData(STORAGE_KEYS.GALLERY, list);
    return newItem;
  }

  if (action === 'admin.circular.save') {
    const list = getStoredData(STORAGE_KEYS.NOTICES, []);
    const newItem = {
      id: Date.now().toString(),
      title: payload.title || 'Notice',
      file_url: fileBase64 || payload.file_url || '',
      filename: file?.name || '',
      date: payload.publishDate || new Date().toISOString().split('T')[0],
      category: 'Examination'
    };
    list.unshift(newItem);
    setStoredData(STORAGE_KEYS.NOTICES, list);
    return newItem;
  }

  if (action === 'admin.faculty.save') {
    const list = getStoredData(STORAGE_KEYS.FACULTY, []);
    const fac = payload.faculty || {};
    const newItem = {
      id: fac.id || Date.now().toString(),
      name: fac.name || '',
      designation: fac.designation || '',
      department: fac.department || '',
      qualification: fac.qualification || '',
      image_url: fileBase64 || fac.image_url || '',
      filename: file?.name || ''
    };
    const index = list.findIndex(m => m.id === newItem.id);
    if (index >= 0) list[index] = newItem;
    else list.push(newItem);
    setStoredData(STORAGE_KEYS.FACULTY, list);
    return newItem;
  }

  return { success: true };
};

export const publicFileRequest = async (action, payload = {}, file) => {
  let fileBase64 = '';
  if (file) {
    fileBase64 = await fileToBase64(file);
  }

  if (action === 'public.admission.submit' || payload.table === 'admissions') {
    const list = getStoredData(STORAGE_KEYS.ADMISSIONS, []);
    const newAdmission = {
      regId: 'CASDCT-' + Math.floor(100000 + Math.random() * 900000),
      fullName: payload.fullName || payload.name || 'Applicant',
      fatherName: payload.fatherName || '',
      program: payload.program || 'BS Program',
      status: 'pending',
      feeSlipUrl: fileBase64 || payload.feeSlipUrl || '',
      meritPct: payload.meritPct || '80',
      submittedAt: new Date().toISOString()
    };
    list.unshift(newAdmission);
    setStoredData(STORAGE_KEYS.ADMISSIONS, list);
    return { success: true, regId: newAdmission.regId };
  }

  if (action === 'public.gallery.upload' || action === 'user.gallery.share') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, []);
    const newItem = {
      id: Date.now().toString(),
      title: payload.title || 'User Photo',
      category: payload.category || 'General',
      image_url: fileBase64 || payload.image_url || '',
      status: 'pending',
      description: payload.description || ''
    };
    list.unshift(newItem);
    setStoredData(STORAGE_KEYS.GALLERY, list);
    return { success: true };
  }

  return { success: true };
};

export const publicRequest = async () => ({ success: true });
export const fileRequest = async (action, payload, file) => publicFileRequest(action, payload, file);

export const subscribeApprovedGallery = (callback) => {
  if (typeof callback === 'function') {
    const update = () => {
      const data = getStoredData(STORAGE_KEYS.GALLERY, []);
      callback(data);
    };
    update();
    window.addEventListener('casdct_local_storage_updated', update);
    return () => window.removeEventListener('casdct_local_storage_updated', update);
  }
  return () => {};
};

export const subscribeHomeContent = (callback) => {
  if (typeof callback === 'function') {
    callback({
      principal_name: 'Captain Ashfaq Shaheed',
      phone: '0963-123456',
      address: 'Tank, KPK'
    });
  }
  return () => {};
};

export const subscribeAnnouncements = (callback) => {
  if (typeof callback === 'function') {
    const update = () => callback(getStoredData(STORAGE_KEYS.NOTICES, []));
    update();
    window.addEventListener('casdct_local_storage_updated', update);
    return () => window.removeEventListener('casdct_local_storage_updated', update);
  }
  return () => {};
};

export const subscribeFaculty = (callback) => {
  if (typeof callback === 'function') {
    const update = () => callback(getStoredData(STORAGE_KEYS.FACULTY, []));
    update();
    window.addEventListener('casdct_local_storage_updated', update);
    return () => window.removeEventListener('casdct_local_storage_updated', update);
  }
  return () => {};
};

export const subscribeAdmissions = (callback) => {
  if (typeof callback === 'function') {
    const update = () => callback(getStoredData(STORAGE_KEYS.ADMISSIONS, []));
    update();
    window.addEventListener('casdct_local_storage_updated', update);
    return () => window.removeEventListener('casdct_local_storage_updated', update);
  }
  return () => {};
};

export const subscribeMeritList = (callback) => {
  if (typeof callback === 'function') {
    const update = () => {
      const admissionsList = getStoredData(STORAGE_KEYS.ADMISSIONS, []);
      callback({
        published: true,
        admissions: admissionsList
      });
    };
    update();
    window.addEventListener('casdct_local_storage_updated', update);
    return () => window.removeEventListener('casdct_local_storage_updated', update);
  }
  return () => {};
};

export const subscribeLocalData = (callback) => {
  if (typeof callback === 'function') callback([]);
  return () => {};
};

export const subscribeWaitList = subscribeLocalData;
export const subscribeWaitlist = subscribeLocalData;
export const subscribeLocalChanges = (keys, callback) => {
  if (typeof callback === 'function') {
    window.addEventListener('casdct_local_storage_updated', callback);
    return () => window.removeEventListener('casdct_local_storage_updated', callback);
  }
  return () => {};
};
export const subscribeSiteContent = subscribeHomeContent;
export const subscribeAdminData = subscribeHomeContent;
export const subscribeLocalDataList = subscribeLocalData;
export const subscribeApprovedGalleryList = subscribeApprovedGallery;
export const subscribeGallery = subscribeApprovedGallery;

export default {
  subscribeLocalData,
  subscribeHomeContent,
  subscribeWaitList,
  subscribeAdmissions,
  subscribeMeritList,
  subscribeApprovedGallery,
  subscribeLocalChanges,
  subscribeAnnouncements,
  subscribeSiteContent,
  subscribeAdminData,
  subscribeFaculty
};
