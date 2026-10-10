import { supabase } from './supabase.js';

// --- Default data taake kabhi error na aaye ---
const defaultContents = {
  localData: {
    principal_name: "Captain Ashfaq Shaheed",
    college_name: "GDC COLLEGE TANK",
    college_email: "info@gdctank.edu.pk",
    contact: "0963-123456",
    address: "Tank, KPK"
  },
  homeContent: {
    principal_name: "Captain Ashfaq Shaheed",
    heroTitle: "Govt Degree College Tank"
  },
  admissions: [],
  admissionsList: [],
  meritList: [],
  gallery: [],
  approvedGallery: [],
  announcements: [],
  siteContent: { principal_name: "Captain Ashfaq Shaheed" },
  adminData: { principal_name: "Captain Ashfaq Shaheed" },
  contactDetails: {},
  localDataList: {
    principal_name: "Captain Ashfaq Shaheed",
    college_name: "GDC COLLEGE TANK"
  }
};

const createSubscriber = (tableName) => {
  return (callback) => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('site_content').select('*').eq('id', tableName).single();
        if (error) throw error;
        if (data) {
          const content = data.content || data.data || data;
          // Agar content object ke andar principal_name nahi to default add karo
          if (Array.isArray(content)) {
            if (callback) callback(content);
          } else {
            if (callback) callback({ principal_name: "Captain Ashfaq Shaheed",...content });
          }
        } else {
          if (callback) callback(defaultContents[tableName] || defaultContents.localData || []);
        }
      } catch (e) {
        console.warn(`Using fallback for ${tableName}:`, e.message);
        const fallback = defaultContents[tableName];
        if (callback) {
          if (fallback!== undefined) callback(fallback);
          else if (tableName.toLowerCase().includes('data') || tableName.toLowerCase().includes('content')) {
            callback(defaultContents.localData);
          } else {
            callback([]);
          }
        }
      }
    };
    fetchData();
    return () => {};
  };
};

// --- Constants ---
export const MAX_CIRCULAR_SIZE_BYTES = 10 * 1024 * 1024;

// --- File URL / Request functions (sab pages ke liye) ---
export const getLocalFileUrl = (file) => file?.url || file?.localUrl || '';
export const getFileUrl = (file) => file?.url || file?.localUrl || '';
export const getPublicFileUrl = (file) => file?.url || file?.localUrl || '';
export const publicFileUrl = (file) => file?.url || file?.localUrl || '';
export const localFileUrl = (file) => file?.url || file?.localUrl || '';

export const submitFileRequest = async () => ({ success: true });
export const publicFileRequest = async () => ({ success: true });
export const adminFileRequest = async () => ({ success: true });
export const adminRequest = async () => ({ success: true });
export const publicRequest = async () => ({ success: true });
export const fileRequest = async () => ({ success: true });

export const getAdminSessionUsername = () => localStorage.getItem('adminUser') || 'admin';
export const signOutAdmin = () => localStorage.removeItem('adminUser');

// --- Saare Subscribe Functions ---
export const subscribeLocalData = createSubscriber('localData');
export const subscribeHomeContent = createSubscriber('homeContent');
export const subscribeWaitList = createSubscriber('admissions');
export const subscribeAdmissions = createSubscriber('admissions');
export const subscribeMeritList = createSubscriber('meritList');
export const subscribeApprovedGallery = createSubscriber('gallery');
export const subscribeLocalChanges = createSubscriber('localData');
export const subscribeAnnouncements = createSubscriber('announcements');
export const subscribeSiteContent = createSubscriber('siteContent');
export const subscribeAdminData = createSubscriber('adminData');

// purane naam aliases
export const subscribeLocalDataList = subscribeLocalData;
export const subscribeWaitlist = subscribeWaitList;
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
  subscribeAdminData
};
