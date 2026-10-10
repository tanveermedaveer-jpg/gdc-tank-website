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
    try {
      const response = await fetch(`${SCRIPT_URL}?action=get_all`);
      const data = await response.json();
      return {
        username: getAdminSessionUsername(),
        admissions: Array.isArray(data.admissions) ? data.admissions : [],
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        faculty: Array.isArray(data.faculty) ? data.faculty : [],
        circulars: Array.isArray(data.notices) ? data.notices : [],
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
      console.error('Bootstrap Fetch Error:', err);
      return { username: 'admin', admissions: [], gallery: [], faculty: [], circulars: [], settings: {} };
    }
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload })
    });
    return await response.json();
  } catch (err) {
    console.error('Admin Request Error:', err);
    return { success: true, ...payload };
  }
};

export const adminFileRequest = async (action, payload = {}, file) => {
  let table = '';
  let bodyData = {};
  let fileBase64 = '';

  if (file) {
    fileBase64 = await fileToBase64(file);
  }

  if (action === 'admin.gallery.upload') {
    table = 'media_gallery';
    bodyData = {
      table: 'media_gallery',
      title: payload.title || 'Campus Photo',
      category: payload.category || 'General',
      image_url: fileBase64 || payload.image_url || '',
      filename: file?.name || '',
      description: payload.description || '',
      status: 'approved'
    };
  } else if (action === 'admin.circular.save') {
    table = 'notices';
    bodyData = {
      table: 'notices',
      title: payload.title || 'Notice',
      file_url: fileBase64 || payload.file_url || '',
      filename: file?.name || '',
      date: payload.publishDate || new Date().toISOString().split('T')[0],
      category: 'Examination'
    };
  } else if (action === 'admin.faculty.save') {
    table = 'faculty';
    const fac = payload.faculty || {};
    bodyData = {
      table: 'faculty',
      name: fac.name || '',
      designation: fac.designation || '',
      department: fac.department || '',
      qualification: fac.qualification || '',
      image_url: fileBase64 || fac.image_url || '',
      filename: file?.name || ''
    };
  }

  if (table) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(bodyData)
      });
      return await response.json();
    } catch (err) {
      console.error('Admin File Request Error:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
};

export const publicFileRequest = async (action, payload = {}, file) => {
  let fileBase64 = '';
  if (file) {
    fileBase64 = await fileToBase64(file);
  }

  if (action === 'public.admission.submit' || payload.table === 'admissions') {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          table: 'admissions',
          ...payload,
          feeSlipUrl: fileBase64 || payload.feeSlipUrl || '',
          feeSlipName: file?.name || payload.feeSlipName || ''
        })
      });
      return await response.json();
    } catch (err) {
      console.error('Admission Submit Error:', err);
      return { success: false, error: err.message };
    }
  }

  if (action === 'public.gallery.upload' || action === 'user.gallery.share') {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          table: 'media_gallery',
          title: payload.title || 'User Photo',
          category: payload.category || 'General',
          image_url: fileBase64 || payload.image_url || '',
          filename: file?.name || '',
          description: payload.description ? `${payload.description} (By: ${payload.uploaderName || 'Student'})` : `By: ${payload.uploaderName || 'Student'}`,
          status: 'pending'
        })
      });
      return await response.json();
    } catch (err) {
      console.error('Gallery Upload Error:', err);
      return { success: false };
    }
  }

  return { success: true };
};

export const publicRequest = async () => ({ success: true });
export const fileRequest = async (action, payload, file) => publicFileRequest(action, payload, file);

export const subscribeApprovedGallery = (callback) => {
  if (typeof callback === 'function') {
    fetch(`${SCRIPT_URL}?action=get_all`)
      .then(res => res.json())
      .then(data => callback(Array.isArray(data.gallery) ? data.gallery : []))
      .catch(() => callback([]));
  }
  return () => {};
};

export const subscribeHomeContent = (callback) => {
  if (typeof callback === 'function') {
    callback({ principal_name: 'Captain Ashfaq Shaheed', phone: '0963-123456', address: 'Tank, KPK' });
  }
  return () => {};
};

export const subscribeAnnouncements = (callback) => {
  if (typeof callback === 'function') {
    fetch(`${SCRIPT_URL}?action=get_all`)
      .then(res => res.json())
      .then(data => callback(Array.isArray(data.notices) ? data.notices : []))
      .catch(() => callback([]));
  }
  return () => {};
};

export const subscribeFaculty = (callback) => {
  if (typeof callback === 'function') {
    fetch(`${SCRIPT_URL}?action=get_all`)
      .then(res => res.json())
      .then(data => callback(Array.isArray(data.faculty) ? data.faculty : []))
      .catch(() => callback([]));
  }
  return () => {};
};

export const subscribeAdmissions = (callback) => {
  if (typeof callback === 'function') {
    fetch(`${SCRIPT_URL}?action=get_all`)
      .then(res => res.json())
      .then(data => callback(Array.isArray(data.admissions) ? data.admissions : []))
      .catch(() => callback([]));
  }
  return () => {};
};

export const subscribeMeritList = (callback) => {
  if (typeof callback === 'function') callback({ isPublished: false });
  return () => {};
};

export const subscribeLocalData = (callback) => {
  if (typeof callback === 'function') callback([]);
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
