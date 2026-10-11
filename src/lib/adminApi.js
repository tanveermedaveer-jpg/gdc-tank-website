// Client-side Storage API implementation for Captain Ashfaq Shaheed Degree College, Tank
import campusImg from '../assets/campus.png';
import principalImg from '../assets/principal.jpg';

export const MAX_CIRCULAR_SIZE_BYTES = 10 * 1024 * 1024;

// Storage keys
const STORAGE_KEYS = {
  ADMISSIONS: 'casdct_admissions',
  GALLERY: 'casdct_gallery',
  FACULTY: 'casdct_faculty',
  NOTICES: 'casdct_notices',
  SETTINGS: 'casdct_settings'
};

// Check if a file is a video
export const isVideoMediaFile = (file) => {
  if (!file) return false;
  const name = typeof file === 'string' ? file : file.name || '';
  const type = (file && typeof file === 'object' && file.type) ? file.type : '';
  return type.startsWith('video/') || /\.(mp4|mov|webm|m4v|ogv|avi)$/i.test(name);
};

// Compress image on canvas to avoid LocalStorage Quota Exceeded & black screens
export const compressImageFile = (file, maxWidth = 1280, maxHeight = 1280, quality = 0.82) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }
    // For non-images (videos, PDFs), read as direct Data URL
    if (typeof file === 'object' && file.type && !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }
    if (typeof file === 'string') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width || 600;
        canvas.height = height || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL(file.type || 'image/jpeg', quality));
        } else {
          resolve(e.target?.result || '');
        }
      };
      img.onerror = () => resolve(e.target?.result || '');
      img.src = e.target?.result || '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

// Default high-quality Faculty members
const DEFAULT_FACULTY_MEMBERS = [
  {
    id: 'fac-1',
    name: 'Prof. Shabir Ahmad',
    designation: 'Principal / Head of Institution',
    department: 'Administration / English',
    qualification: 'M.Phil English Literature (Quaid-e-Azam University)',
    contact: 'principal@casdct.edu.pk',
    is_hod: true,
    photo_url: principalImg,
    image_url: principalImg,
    sort_order: 1
  },
  {
    id: 'fac-2',
    name: 'Dr. Shakeel Ahmad',
    designation: 'HOD / Assistant Professor',
    department: 'Computer Science',
    qualification: 'Ph.D Computer Science (Peshawar University)',
    contact: 'cs.hod@casdct.edu.pk',
    is_hod: true,
    photo_url: '',
    image_url: '',
    sort_order: 2
  },
  {
    id: 'fac-3',
    name: 'Mr. Muhammad Imran',
    designation: 'HOD / Assistant Professor',
    department: 'Chemistry',
    qualification: 'Ph.D Organic Chemistry (Gomal University)',
    contact: 'chem.hod@casdct.edu.pk',
    is_hod: true,
    photo_url: '',
    image_url: '',
    sort_order: 3
  },
  {
    id: 'fac-4',
    name: 'Mr. Habib-ur-Rehman',
    designation: 'Assistant Professor',
    department: 'Physics',
    qualification: 'M.Sc Physics (Gomal University)',
    contact: 'physics@casdct.edu.pk',
    is_hod: false,
    photo_url: '',
    image_url: '',
    sort_order: 4
  },
  {
    id: 'fac-5',
    name: 'Mr. Tariq Rafiq',
    designation: 'Lecturer',
    department: 'Mathematics',
    qualification: 'M.Sc Applied Mathematics (Peshawar University)',
    contact: 'math@casdct.edu.pk',
    is_hod: false,
    photo_url: '',
    image_url: '',
    sort_order: 5
  },
  {
    id: 'fac-6',
    name: 'Mr. Shaukat Khan',
    designation: 'HOD / Lecturer',
    department: 'Biological Sciences (Zoology)',
    qualification: 'M.Phil Zoology (Gomal University)',
    contact: 'bio.hod@casdct.edu.pk',
    is_hod: true,
    photo_url: '',
    image_url: '',
    sort_order: 6
  }
];

// Default Gallery media items
const DEFAULT_GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Main Academic Campus & Grounds',
    category: 'facilities',
    type: 'image',
    mediaType: 'image',
    publicUrl: campusImg,
    image_url: campusImg,
    image: campusImg,
    mediaUrl: campusImg,
    status: 'approved',
    isApproved: true,
    uploadedBy: 'Administration',
    description: 'Spacious academic building, lush green lawns, and modern infrastructure of GDC Tank.',
    desc: 'Spacious academic building, lush green lawns, and modern infrastructure of GDC Tank.',
    date: '2026-09-15',
    uploadedTime: 'Recent'
  },
  {
    id: 'gal-2',
    title: 'Annual Sports Gala & Athletics Day',
    category: 'sports',
    type: 'image',
    mediaType: 'image',
    publicUrl: campusImg,
    image_url: campusImg,
    image: campusImg,
    mediaUrl: campusImg,
    status: 'approved',
    isApproved: true,
    uploadedBy: 'Sports Committee',
    description: 'Inter-collegiate athletics, cricket, and badminton championship matches held on college sports ground.',
    desc: 'Inter-collegiate athletics, cricket, and badminton championship matches held on college sports ground.',
    date: '2026-09-20',
    uploadedTime: 'Recent'
  },
  {
    id: 'gal-3',
    title: 'Science & Computer Laboratories',
    category: 'facilities',
    type: 'image',
    mediaType: 'image',
    publicUrl: campusImg,
    image_url: campusImg,
    image: campusImg,
    mediaUrl: campusImg,
    status: 'approved',
    isApproved: true,
    uploadedBy: 'Faculty of Sciences',
    description: 'Equipped science laboratories and modern IT computing lab for practical research and learning.',
    desc: 'Equipped science laboratories and modern IT computing lab for practical research and learning.',
    date: '2026-09-25',
    uploadedTime: 'Recent'
  }
];

// Default College Settings
const DEFAULT_SETTINGS = {
  principal_name: 'Prof. Shabir Ahmad',
  principal_message: 'It is a matter of great pride and privilege to welcome you to Captain Ashfaq Shaheed Degree College, Tank. This college stands as a beacon of learning in South KP, committed to delivering high-quality intermediate and undergraduate education to our youth.\n\nOur primary goal is to nurture academic curiosity, foster critical thinking, and build a strong sense of responsibility. Naming our college in honor of the martyred military officer, Captain Ashfaq Shaheed, reminds us daily of the virtues of discipline, sacrifice, and duty to our homeland.',
  principal_image_url: principalImg,
  phone: '+92 (0963) 510111',
  email: 'info@casdct.edu.pk',
  address: 'Captain Ashfaq Shaheed Degree College, Tank, Khyber Pakhtunkhwa, Pakistan',
  merit_list_live: true
};

// Default Sample Admissions
const DEFAULT_ADMISSIONS = [
  {
    regId: 'CASDCT-10255',
    fullName: 'Muhammad Usman Khan',
    fatherName: 'Ahmad Khan',
    program: 'BS Computer Science',
    matricMarks: '945',
    matricTotal: '1100',
    meritPct: '85.9',
    status: 'approved',
    isPaid: true,
    feeVerified: true,
    paymentStatus: 'Payment verified · EasyPaisa (TRX: 8941205)',
    paymentMethod: 'EasyPaisa',
    trxId: '8941205',
    submittedAt: '2026-09-10'
  },
  {
    regId: 'CASDCT-10256',
    fullName: 'Hamza Tariq',
    fatherName: 'Tariq Mehmood',
    program: 'FSc Pre-Medical',
    matricMarks: '980',
    matricTotal: '1100',
    meritPct: '89.1',
    status: 'pending',
    isPaid: true,
    feeVerified: false,
    paymentStatus: 'Payment submitted · pending verification',
    paymentMethod: 'Bank Deposit',
    trxId: '7721094',
    submittedAt: '2026-09-12'
  },
  {
    regId: 'CASDCT-10257',
    fullName: 'Bilal Ahmad',
    fatherName: 'Saeed Ahmad',
    program: 'FSc Pre-Engineering',
    matricMarks: '915',
    matricTotal: '1100',
    meritPct: '83.2',
    status: 'pending',
    isPaid: false,
    feeVerified: false,
    paymentStatus: 'Pending',
    submittedAt: '2026-09-14'
  }
];

// Normalization Helpers
export const normalizeMediaItem = (item) => {
  if (!item) return null;
  const url = item.publicUrl || item.image_url || item.image || item.mediaUrl || item.url || item.file_url || '';
  const isVideo = item.type === 'video' || item.mediaType === 'video' || isVideoMediaFile(item.filename || item.fileName || url);
  const mediaType = isVideo ? 'video' : 'image';
  const effectiveUrl = url || campusImg;

  return {
    ...item,
    id: item.id || String(Date.now()),
    title: item.title || 'Campus Moment',
    category: (item.category === 'sports' || item.category === 'facilities') ? item.category : 'facilities',
    type: mediaType,
    mediaType: mediaType,
    publicUrl: effectiveUrl,
    image_url: effectiveUrl,
    image: effectiveUrl,
    mediaUrl: effectiveUrl,
    url: effectiveUrl,
    uploadedBy: item.uploadedBy || item.uploaderName || 'College Administration',
    uploaderName: item.uploaderName || item.uploadedBy || 'College Administration',
    description: item.description || item.desc || '',
    desc: item.desc || item.description || '',
    status: item.status || 'approved',
    isApproved: item.status === 'approved' || item.isApproved === true,
    size: item.size || (isVideo ? 'Video' : 'Photo'),
    uploadedTime: item.uploadedTime || item.date || 'Recent'
  };
};

export const normalizeFacultyItem = (item) => {
  if (!item) return null;
  const photo = item.photo_url || item.image_url || item.photoUrl || item.image || '';
  return {
    ...item,
    id: item.id || String(Date.now()),
    name: item.name || 'Faculty Member',
    designation: item.designation || item.role || 'Lecturer',
    role: item.role || item.designation || 'Lecturer',
    department: item.department || item.dept || 'Academics',
    dept: item.dept || item.department || 'Academics',
    qualification: item.qualification || item.qual || 'Master Degree',
    qual: item.qual || item.qualification || 'Master Degree',
    contact: item.contact || item.email || '',
    email: item.email || item.contact || '',
    is_hod: item.is_hod === true || item.isHOD === true,
    isHOD: item.is_hod === true || item.isHOD === true,
    photo_url: photo,
    image_url: photo,
    photoUrl: photo,
    sort_order: item.sort_order || 99
  };
};

export const normalizeAdmissionItem = (item) => {
  if (!item) return null;
  return {
    ...item,
    regId: item.regId || item.id || item.student_id || ('CASDCT-' + Math.floor(100000 + Math.random() * 900000)),
    fullName: item.fullName || item.name || 'Applicant',
    fatherName: item.fatherName || item.father_name || '',
    program: item.program || 'BS Program',
    meritPct: item.meritPct || item.merit_pct || '75',
    status: item.status || 'pending',
    isPaid: item.isPaid === true || item.feeVerified === true || Boolean(item.trxId),
    feeVerified: item.feeVerified === true || item.isPaid === true,
    paymentStatus: item.paymentStatus || (item.feeVerified ? 'Verified' : 'Pending'),
    feeSlipUrl: item.feeSlipUrl || item.feeSlipPath || '',
    feeSlipName: item.feeSlipName || item.filename || ''
  };
};

// LocalStorage helpers
const getStoredData = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== undefined && parsed !== null ? parsed : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
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

// URL resolution
export const getLocalFileUrl = (file) => {
  if (!file) return '';
  if (typeof file === 'string') return file;
  return file.publicUrl || file.image_url || file.photo_url || file.file_url || file.url || '';
};
export const getFileUrl = (file) => getLocalFileUrl(file);
export const getPublicFileUrl = (file) => getLocalFileUrl(file);
export const publicFileUrl = (file) => getLocalFileUrl(file);
export const localFileUrl = (file) => getLocalFileUrl(file);

export const getAdminSessionUsername = () => localStorage.getItem('casdct_admin_name') || localStorage.getItem('adminUser') || 'Admin';
export const signOutAdmin = () => {
  localStorage.removeItem('casdct_is_logged_in');
  localStorage.removeItem('adminUser');
};

// Main Admin Request Handler
export const adminRequest = async (action, payload = {}) => {
  if (action === 'admin.bootstrap') {
    const rawAdmissions = getStoredData(STORAGE_KEYS.ADMISSIONS, DEFAULT_ADMISSIONS);
    const rawGallery = getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const rawFaculty = getStoredData(STORAGE_KEYS.FACULTY, DEFAULT_FACULTY_MEMBERS);
    const rawNotices = getStoredData(STORAGE_KEYS.NOTICES, []);
    const rawSettings = getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

    return {
      username: getAdminSessionUsername(),
      admissions: (Array.isArray(rawAdmissions) && rawAdmissions.length > 0 ? rawAdmissions : DEFAULT_ADMISSIONS).map(normalizeAdmissionItem),
      gallery: (Array.isArray(rawGallery) && rawGallery.length > 0 ? rawGallery : DEFAULT_GALLERY_ITEMS).map(normalizeMediaItem),
      faculty: (Array.isArray(rawFaculty) && rawFaculty.length > 0 ? rawFaculty : DEFAULT_FACULTY_MEMBERS).map(normalizeFacultyItem),
      circulars: Array.isArray(rawNotices) ? rawNotices : [],
      settings: { ...DEFAULT_SETTINGS, ...rawSettings }
    };
  }

  // Gallery moderation
  if (action === 'admin.gallery.approve') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const updated = list.map(item => item.id === payload.id ? { ...item, status: 'approved', isApproved: true } : item);
    setStoredData(STORAGE_KEYS.GALLERY, updated);
    return { success: true };
  }

  if (action === 'admin.gallery.category') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const updated = list.map(item => item.id === payload.id ? { ...item, category: payload.category } : item);
    setStoredData(STORAGE_KEYS.GALLERY, updated);
    return { success: true };
  }

  if (action === 'admin.gallery.reject') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const updated = list.map(item => item.id === payload.id ? { ...item, status: 'rejected', isApproved: false } : item);
    setStoredData(STORAGE_KEYS.GALLERY, updated);
    return { success: true };
  }

  if (action === 'admin.gallery.delete') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const updated = list.filter(item => item.id !== payload.id);
    setStoredData(STORAGE_KEYS.GALLERY, updated);
    return { success: true };
  }

  // Faculty management
  if (action === 'admin.faculty.save') {
    const list = getStoredData(STORAGE_KEYS.FACULTY, DEFAULT_FACULTY_MEMBERS);
    const fac = payload.faculty || payload || {};
    const newItem = normalizeFacultyItem({
      ...fac,
      id: fac.id || ('fac_' + Date.now().toString())
    });
    const index = list.findIndex(m => m.id === newItem.id);
    if (index >= 0) list[index] = newItem;
    else list.push(newItem);
    setStoredData(STORAGE_KEYS.FACULTY, list);
    return newItem;
  }

  if (action === 'admin.faculty.delete') {
    const list = getStoredData(STORAGE_KEYS.FACULTY, DEFAULT_FACULTY_MEMBERS);
    const updated = list.filter(item => item.id !== payload.id);
    setStoredData(STORAGE_KEYS.FACULTY, updated);
    return { success: true };
  }

  // Admissions management
  if (action === 'admin.admission.update') {
    const list = getStoredData(STORAGE_KEYS.ADMISSIONS, DEFAULT_ADMISSIONS);
    const updated = list.map(item => item.regId === payload.regId ? { ...item, ...payload } : item);
    setStoredData(STORAGE_KEYS.ADMISSIONS, updated);
    return { success: true };
  }

  // Circulars
  if (action === 'admin.circular.delete') {
    const list = getStoredData(STORAGE_KEYS.NOTICES, []);
    const updated = list.filter(item => item.id !== payload.id);
    setStoredData(STORAGE_KEYS.NOTICES, updated);
    return { success: true };
  }

  // Settings
  if (action === 'admin.settings.save') {
    const currentSettings = getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const newSettings = { ...currentSettings, ...(payload.settings || payload) };
    setStoredData(STORAGE_KEYS.SETTINGS, newSettings);
    if (newSettings.principal_name) localStorage.setItem('casdct_principal_name', newSettings.principal_name);
    if (newSettings.phone) localStorage.setItem('casdct_college_phone', newSettings.phone);
    if (newSettings.email) localStorage.setItem('casdct_college_email', newSettings.email);
    if (newSettings.principal_message) localStorage.setItem('casdct_principal_message', newSettings.principal_message);
    if (newSettings.merit_list_live !== undefined) localStorage.setItem('casdct_merit_list_live', String(newSettings.merit_list_live));
    return newSettings;
  }

  // Credentials
  if (action === 'auth.credentials.update') {
    if (payload.username) {
      localStorage.setItem('casdct_admin_name', payload.username);
      localStorage.setItem('adminUser', payload.username);
    }
    if (payload.password) {
      localStorage.setItem('casdct_admin_pass', payload.password);
    }
    return { success: true };
  }

  return { success: true };
};

// Admin File Request (handles file uploads with image compression)
export const adminFileRequest = async (action, payload = {}, file) => {
  let fileData = '';
  if (file) {
    fileData = await compressImageFile(file);
  }

  if (action === 'admin.gallery.upload') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const isVideo = isVideoMediaFile(file);
    const mediaType = isVideo ? 'video' : 'image';
    const effectiveUrl = fileData || campusImg;

    const newItem = normalizeMediaItem({
      id: 'gal_' + Date.now().toString(),
      title: payload.title || (file?.name ? file.name.replace(/\.[^/.]+$/, '') : 'Campus Photo'),
      category: payload.category || 'facilities',
      type: mediaType,
      mediaType: mediaType,
      image_url: effectiveUrl,
      publicUrl: effectiveUrl,
      image: effectiveUrl,
      mediaUrl: effectiveUrl,
      url: effectiveUrl,
      filename: file?.name || '',
      description: payload.description || '',
      desc: payload.description || '',
      uploadedBy: 'Admin',
      uploaderName: 'Admin',
      status: 'approved',
      isApproved: true,
      date: new Date().toISOString().split('T')[0],
      uploadedTime: 'Just now'
    });

    list.unshift(newItem);
    setStoredData(STORAGE_KEYS.GALLERY, list);
    return newItem;
  }

  if (action === 'admin.faculty.save') {
    const list = getStoredData(STORAGE_KEYS.FACULTY, DEFAULT_FACULTY_MEMBERS);
    const fac = payload.faculty || payload || {};
    const effectivePhoto = fileData || fac.photo_url || fac.image_url || '';

    const newItem = normalizeFacultyItem({
      ...fac,
      id: fac.id || ('fac_' + Date.now().toString()),
      photo_url: effectivePhoto,
      image_url: effectivePhoto,
      photoUrl: effectivePhoto,
      filename: file?.name || fac.filename || ''
    });

    const index = list.findIndex(m => m.id === newItem.id);
    if (index >= 0) list[index] = newItem;
    else list.push(newItem);
    setStoredData(STORAGE_KEYS.FACULTY, list);
    return newItem;
  }

  if (action === 'admin.circular.save') {
    const list = getStoredData(STORAGE_KEYS.NOTICES, []);
    const newItem = {
      id: 'circ_' + Date.now().toString(),
      title: payload.title || file?.name || 'Notice',
      file_url: fileData || payload.file_url || '',
      filename: file?.name || '',
      publish_date: payload.publishDate || new Date().toISOString().split('T')[0],
      category: payload.category || 'General',
      size: file ? `${Math.round(file.size / 1024)} KB` : 'PDF'
    };
    list.unshift(newItem);
    setStoredData(STORAGE_KEYS.NOTICES, list);
    return newItem;
  }

  return { success: true };
};

// Public File Request (visitor gallery upload, online admission form)
export const publicFileRequest = async (action, payload = {}, file) => {
  let fileData = '';
  if (file) {
    fileData = await compressImageFile(file);
  }

  if (action === 'public.gallery.upload' || action === 'user.gallery.share') {
    const list = getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const isVideo = isVideoMediaFile(file);
    const mediaType = isVideo ? 'video' : 'image';
    const effectiveUrl = fileData || campusImg;

    const newItem = normalizeMediaItem({
      id: 'user_' + Date.now().toString(),
      title: payload.title || (file?.name ? file.name.replace(/\.[^/.]+$/, '') : 'Campus Photo'),
      category: payload.category || 'facilities',
      type: mediaType,
      mediaType: mediaType,
      image_url: effectiveUrl,
      publicUrl: effectiveUrl,
      image: effectiveUrl,
      mediaUrl: effectiveUrl,
      url: effectiveUrl,
      filename: file?.name || '',
      description: payload.description || payload.desc || '',
      desc: payload.description || payload.desc || '',
      uploadedBy: payload.uploaderName || payload.uploadedBy || 'Student / Visitor',
      uploaderName: payload.uploaderName || payload.uploadedBy || 'Student / Visitor',
      status: 'pending', // Requires admin moderation
      isApproved: false,
      date: new Date().toISOString().split('T')[0],
      uploadedTime: 'Recent'
    });

    list.unshift(newItem);
    setStoredData(STORAGE_KEYS.GALLERY, list);
    return { success: true, item: newItem };
  }

  if (action === 'public.admission.submit' || payload.table === 'admissions') {
    const list = getStoredData(STORAGE_KEYS.ADMISSIONS, DEFAULT_ADMISSIONS);
    const studentId = payload.student_id || ('CASDCT-' + Math.floor(100000 + Math.random() * 900000));
    
    const marksObt = Number(payload.obtained_marks || payload.matricMarks || 800);
    const marksTotal = Number(payload.total_marks || payload.matricTotal || 1100);
    const calcMerit = marksTotal > 0 ? ((marksObt / marksTotal) * 100).toFixed(1) : '75.0';

    const newAdmission = normalizeAdmissionItem({
      regId: studentId,
      fullName: payload.name || payload.fullName || 'Student Applicant',
      fatherName: payload.father_name || payload.fatherName || '',
      phone: payload.phone || payload.mobile || '',
      program: payload.program || 'BS Program',
      discipline: payload.discipline || '',
      matricMarks: String(marksObt),
      matricTotal: String(marksTotal),
      meritPct: payload.meritPct || calcMerit,
      status: 'pending',
      feeSlipUrl: fileData || '',
      feeSlipName: file?.name || '',
      isPaid: Boolean(fileData),
      feeVerified: false,
      paymentStatus: fileData ? 'Fee Slip Uploaded · Pending Verification' : 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    });

    list.unshift(newAdmission);
    setStoredData(STORAGE_KEYS.ADMISSIONS, list);
    return { success: true, regId: studentId };
  }

  return { success: true };
};

export const publicRequest = async () => ({ success: true });
export const fileRequest = async (action, payload, file) => publicFileRequest(action, payload, file);

// Subscriptions
export const subscribeApprovedGallery = (callback) => {
  if (typeof callback !== 'function') return () => {};
  const notify = () => {
    const data = getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const approved = (Array.isArray(data) && data.length > 0 ? data : DEFAULT_GALLERY_ITEMS)
      .filter(item => item.status === 'approved' || item.isApproved === true)
      .map(normalizeMediaItem);
    callback(approved);
  };
  notify();
  window.addEventListener('casdct_local_storage_updated', notify);
  return () => window.removeEventListener('casdct_local_storage_updated', notify);
};

export const subscribeFaculty = (callback) => {
  if (typeof callback !== 'function') return () => {};
  const notify = () => {
    const data = getStoredData(STORAGE_KEYS.FACULTY, DEFAULT_FACULTY_MEMBERS);
    const list = (Array.isArray(data) && data.length > 0 ? data : DEFAULT_FACULTY_MEMBERS)
      .map(normalizeFacultyItem)
      .sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
    callback(list);
  };
  notify();
  window.addEventListener('casdct_local_storage_updated', notify);
  return () => window.removeEventListener('casdct_local_storage_updated', notify);
};

export const subscribeAdmissions = (callback) => {
  if (typeof callback !== 'function') return () => {};
  const notify = () => {
    const data = getStoredData(STORAGE_KEYS.ADMISSIONS, DEFAULT_ADMISSIONS);
    const list = (Array.isArray(data) && data.length > 0 ? data : DEFAULT_ADMISSIONS).map(normalizeAdmissionItem);
    callback(list);
  };
  notify();
  window.addEventListener('casdct_local_storage_updated', notify);
  return () => window.removeEventListener('casdct_local_storage_updated', notify);
};

export const subscribeMeritList = (callback) => {
  if (typeof callback !== 'function') return () => {};
  const notify = () => {
    const data = getStoredData(STORAGE_KEYS.ADMISSIONS, DEFAULT_ADMISSIONS);
    const settings = getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const isLive = settings.merit_list_live !== undefined ? Boolean(settings.merit_list_live) : true;
    const list = (Array.isArray(data) && data.length > 0 ? data : DEFAULT_ADMISSIONS)
      .map(normalizeAdmissionItem)
      .sort((a, b) => Number(b.meritPct || 0) - Number(a.meritPct || 0));
    callback({
      published: isLive,
      admissions: list
    });
  };
  notify();
  window.addEventListener('casdct_local_storage_updated', notify);
  return () => window.removeEventListener('casdct_local_storage_updated', notify);
};

export const subscribeAnnouncements = (callback) => {
  if (typeof callback !== 'function') return () => {};
  const notify = () => {
    const data = getStoredData(STORAGE_KEYS.NOTICES, []);
    callback(Array.isArray(data) ? data : []);
  };
  notify();
  window.addEventListener('casdct_local_storage_updated', notify);
  return () => window.removeEventListener('casdct_local_storage_updated', notify);
};

export const subscribeHomeContent = (callback) => {
  if (typeof callback !== 'function') return () => {};
  const notify = () => {
    const settings = getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    callback({
      ...DEFAULT_SETTINGS,
      ...settings
    });
  };
  notify();
  window.addEventListener('casdct_local_storage_updated', notify);
  return () => window.removeEventListener('casdct_local_storage_updated', notify);
};

// Flexible Local Data Subscriber
export const subscribeLocalData = (typeOrCallback, maybeCallback) => {
  let type = 'general';
  let callback = null;

  if (typeof typeOrCallback === 'string') {
    type = typeOrCallback;
    callback = maybeCallback;
  } else if (typeof typeOrCallback === 'function') {
    callback = typeOrCallback;
  }

  if (typeof callback !== 'function') return () => {};

  if (type === 'faculty') return subscribeFaculty(callback);
  if (type === 'gallery' || type === 'media') return subscribeApprovedGallery(callback);
  if (type === 'admissions') return subscribeAdmissions(callback);
  if (type === 'notices' || type === 'circulars') return subscribeAnnouncements(callback);
  if (type === 'settings') return subscribeHomeContent(callback);

  // Fallback generic subscriber
  const notify = () => callback([]);
  notify();
  window.addEventListener('casdct_local_storage_updated', notify);
  return () => window.removeEventListener('casdct_local_storage_updated', notify);
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
