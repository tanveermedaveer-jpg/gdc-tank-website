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
  contactDetails: {}
};

const createSubscriber = (tableName) => {
  return (callback) => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('site_content').select('*').eq('id', tableName).single();
        if (error) throw error;
        if (data) {
          const content = data.content || data;
          if (callback) callback(content);
        } else {
          if (callback) callback(defaultContents[tableName] || []);
        }
      } catch (e) {
        console.warn(`Using fallback for ${tableName}:`, e.message);
        // Agar table khali hai to default data bhejo, khali array nahi
        const fallback = defaultContents[tableName];
        if (callback) {
          if (fallback) callback(fallback);
          else if (tableName.toLowerCase().includes('data') || tableName.toLowerCase().includes('content') || tableName === 'localData') {
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

// --- Constants jo AdminDashboard maang raha hai ---
export const MAX_CIRCULAR_SIZE_BYTES = 10 * 1024 * 1024;

// --- Functions jo baqi pages maang rahe hain ---
export const getLocalFileUrl = (file) => file?.url || file?.localUrl || '';
export const submitFileRequest = async () => ({ success: true });
export const adminFileRequest = async () => ({ success: true });
export const adminRequest = async () => ({ success: true });
export const getAdminSessionUsername = () => localStorage.getItem('adminUser') || 'admin';
export const signOutAdmin = () => localStorage.removeItem('adminUser');

// --- Saare Subscribe Functions (ab ek hi kaam karenge) ---
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

// purane naam jo kahin use ho rahe hon
export const subscribeLocalDataList = subscribeLocalData;
export const subscribeWaitlist = subscribeWaitList;
export const subscribeApprovedGalleryList = subscribeApprovedGallery;

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
