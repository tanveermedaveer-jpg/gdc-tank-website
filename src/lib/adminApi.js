const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrugcvacClSlDHN38GnoxN1fbTs9BElfqfjlm4PY640g16ZbpzKdSx22unMNDSlE/exec';

export const MAX_CIRCULAR_SIZE_BYTES = 10 * 1024 * 1024;

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

export const adminRequest = async (action, payload = {}) => {
  if (action === 'admin.bootstrap') {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=get_all`);
      const data = await response.json();
      return {
        username: getAdminSessionUsername(),
        admissions: data.admissions || [],
        gallery: data.gallery || [],
        faculty: data.faculty || [],
        circulars: data.notices || [],
        settings: {
          principal_name: 'Captain Ashfaq Shaheed',
          principal_message: '',
          principal_image_url: '',
          phone: '0963-123456',
          address: 'Tank, KPK',
          merit_list_live: false
        }
      };
    } catch (err) {
      console.error('Bootstrap Error:', err);
      return { username: 'admin', admissions: [], gallery: [], faculty: [], circulars: [], settings: {} };
    }
  }

  if (action === 'admin.admission.update') {
    return { success: true, ...payload };
  }

  return { success: true };
};

export const adminFileRequest = async (action, payload = {}, file) => {
  return { success: true };
};

export const publicFileRequest = async (action, payload = {}, file) => {
  if (action === 'public.admission.submit' || payload.table === 'admissions') {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ table: 'admissions', ...payload })
      });
      return await response.json();
    } catch (err) {
      console.error('Admission Submit Error:', err);
      throw err;
    }
  }

  if (action === 'public.gallery.upload' || action === 'user.gallery.share') {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          table: 'media_gallery', 
          title: payload.title || 'Campus Photo',
          category: payload.category || 'General',
          image_url: payload.image_url || '',
          description: payload.description || ''
        })
      });
      return await response.json();
    } catch (err) {
      console.error('Gallery Upload Error:', err);
    }
  }

  return { success: true };
};

export const publicRequest = async () => ({ success: true });
export const fileRequest = async (action, payload, file) => publicFileRequest(action, payload, file);

// --- Subscriptions ---
export const subscribeApprovedGallery = (callback) => {
  fetch(`${SCRIPT_URL}?action=get_all`)
    .then(res => res.json())
    .then(data => callback(data.gallery || []))
    .catch(() => callback([]));
  return () => {};
};

export const subscribeHomeContent = (callback) => {
  callback({ principal_name: 'Captain Ashfaq Shaheed', phone: '0963-123456', address: 'Tank, KPK' });
  return () => {};
};

export const subscribeAnnouncements = (callback) => {
  fetch(`${SCRIPT_URL}?action=get_all`)
    .then(res => res.json())
    .then(data => callback(data.notices || []))
    .catch(() => callback([]));
  return () => {};
};

export const subscribeFaculty = (callback) => {
  fetch(`${SCRIPT_URL}?action=get_all`)
    .then(res => res.json())
    .then(data => callback(data.faculty || []))
    .catch(() => callback([]));
  return () => {};
};

export const subscribeAdmissions = (callback) => {
  fetch(`${SCRIPT_URL}?action=get_all`)
    .then(res => res.json())
    .then(data => callback(data.admissions || []))
    .catch(() => callback([]));
  return () => {};
};

export const subscribeMeritList = (callback) => {
  callback({ isPublished: false });
  return () => {};
};

export const subscribeLocalData = (callback) => {
  callback([]);
  return () => {};
};

export const subscribeWaitList = subscribeLocalData;
export const subscribeWaitlist = subscribeLocalData;
export const subscribeLocalChanges = subscribeApprovedGallery;
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
