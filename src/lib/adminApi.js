import { db } from './firebase';
import { 
  collection, doc, getDoc, setDoc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { COLLEGE_ADDRESS, COLLEGE_PHONE } from './contactDetails';
import { DEFAULT_HOME_CONTENT } from './siteContentDefaults';

const SESSION_MARKER_KEY = 'casdct_admin_session_active';
const SESSION_USERNAME_KEY = 'casdct_local_admin_username';
const DEFAULT_ADMIN_USERNAME = 'Shabir Ahmad';
const DEFAULT_ADMIN_PASSWORD = '1271573';

const DEFAULT_SETTINGS = {
  principal_name: 'Prof. Shabir Ahmad',
  principal_message: '',
  principal_image_url: '',
  phone: COLLEGE_PHONE,
  address: COLLEGE_ADDRESS,
  merit_list_live: false
};

// --- AUTHENTICATION & SESSIONS ---
export const hasAdminSession = () => (
  localStorage.getItem(SESSION_MARKER_KEY) === '1' && 
  Boolean(localStorage.getItem(SESSION_USERNAME_KEY))
);

export const getAdminSessionUsername = () => localStorage.getItem(SESSION_USERNAME_KEY) || '';

export const clearAdminSession = () => {
  localStorage.removeItem(SESSION_MARKER_KEY);
  localStorage.removeItem(SESSION_USERNAME_KEY);
  localStorage.removeItem('isAdminAuthenticated');
};

export const signInAdmin = (username, password) => {
  if (username !== DEFAULT_ADMIN_USERNAME || password !== DEFAULT_ADMIN_PASSWORD) return null;
  localStorage.setItem(SESSION_USERNAME_KEY, DEFAULT_ADMIN_USERNAME);
  localStorage.setItem(SESSION_MARKER_KEY, '1');
  return { username: DEFAULT_ADMIN_USERNAME };
};

export const verifyAdminSession = () => hasAdminSession();
export const signOutAdmin = () => clearAdminSession();

// --- FIRESTORE CRUD HELPERS ---

export const getStoredHomeContent = async () => {
  try {
    const docRef = doc(db, 'portal', 'homeContent');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      await setDoc(docRef, DEFAULT_HOME_CONTENT);
      return DEFAULT_HOME_CONTENT;
    }
  } catch (error) {
    console.error('Error fetching home content:', error);
    return DEFAULT_HOME_CONTENT;
  }
};

export const saveHomeContent = async (source) => {
  const docRef = doc(db, 'portal', 'homeContent');
  await setDoc(docRef, source);
  return source;
};

// --- ADMISSIONS ---
const saveAdmission = async (payload, file) => {
  const record = payload.record || {};
  const fullName = typeof record.fullName === 'string' ? record.fullName.trim() : '';
  const program = typeof record.program === 'string' ? record.program.trim() : '';
  const phone = typeof record.phone === 'string' ? record.phone.trim() : '';
  if (!fullName || !program || !phone) throw new Error('Complete the required name, program, and phone fields.');
   
  const regId = `STU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const admission = {
    ...record,
    fullName,
    studentName: fullName,
    phone,
    program,
    regId,
    status: 'pending',
    appliedAt: new Date().toISOString(),
    isPaid: false,
    feeVerified: false
  };

  try {
    await addDoc(collection(db, 'admissions'), admission);
  } catch (error) {
    console.error('Error saving admission:', error);
    throw error;
  }
  return { regId, program };
};

const getAdmissions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'admissions'));
    const list = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (error) {
    console.error('Error getting admissions:', error);
    return [];
  }
};

// --- SETTINGS ---
export const getSettings = async () => {
  try {
    const docRef = doc(db, 'portal', 'settings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      await setDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = async (payload) => {
  const settings = { ...await getSettings(), ...(payload.settings || {}) };
  const docRef = doc(db, 'portal', 'settings');
  await setDoc(docRef, settings);
  return { username: getAdminSessionUsername(), settings };
};

// --- GENERAL REQUEST HANDLERS ---
const handlePublicAction = async (action, payload, file) => {
  if (action === 'public.settings') return await getSettings();
  if (action === 'public.submitAdmission') return await saveAdmission(payload, file);
  if (action === 'public.merit') {
    const settings = await getSettings();
    const admissions = await getAdmissions();
    if (!settings.merit_list_live) return { published: false, admissions: [] };
    return {
      published: true,
      admissions: admissions.filter(r => r.status === 'approved')
    };
  }
  return {};
};

const handleAdminAction = async (action, payload, file) => {
  if (!hasAdminSession()) throw new Error('Admin session expired.');
   
  if (action === 'admin.bootstrap') {
    const admissions = await getAdmissions();
    const settings = await getSettings();
    const homeContent = await getStoredHomeContent();
    return {
      admissions,
      settings,
      homeContent,
      faculty: [],
      circulars: [],
      gallery: [],
      username: getAdminSessionUsername()
    };
  }
  if (action === 'admin.settings.save') return await saveSettings(payload);
  if (action === 'admin.homeContent.save') return await saveHomeContent(payload.homeContent);
   
  return {};
};

const request = async (action, payload = {}, file = null) => {
  if (action.startsWith('public.')) return await handlePublicAction(action, payload, file);
  if (action === 'auth.login') return await signInAdmin(payload.username, payload.password);
  if (action === 'auth.logout') return await signOutAdmin();
  return await handleAdminAction(action, payload, file);
};

export const adminRequest = (action, payload) => request(action, payload);
export const adminFileRequest = (action, payload, file) => request(action, payload, file);
export const publicRequest = (action, payload) => request(action, payload);
export const publicFileRequest = (action, payload, file) => request(action, payload, file);

// --- SUBSCRIPTIONS FOR LIVE SYNC ---
export const subscribeHomeContent = (onContent) => {
  const docRef = doc(db, 'portal', 'homeContent');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      onContent(docSnap.data());
    } else {
      onContent(DEFAULT_HOME_CONTENT);
    }
  });
};

export const subscribeMeritList = (onMeritList) => {
  const unsubSettings = onSnapshot(doc(db, 'portal', 'settings'), async (settingsSnap) => {
    const settings = settingsSnap.exists() ? settingsSnap.data() : DEFAULT_SETTINGS;
    const admissions = await getAdmissions();
    const published = settings.merit_list_live === true;
    onMeritList({
      published,
      admissions: published ? admissions.filter(r => r.status === 'approved') : []
    });
  });
  return unsubSettings;
};
