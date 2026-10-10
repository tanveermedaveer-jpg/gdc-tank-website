import { supabase } from './supabase.js';

// --- Common Helper ---
const createSubscriber = (tableName) => {
  return (callback) => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('site_content').select('*').eq('id', tableName).single();
        if (data && callback) callback(data.content || data);
        else if (callback) callback([]);
      } catch (e) {
        if (callback) callback([]);
      }
    };
    fetchData();
    return () => {};
  };
};

// --- Constants jo AdminDashboard maang raha hai ---
export const MAX_CIRCULAR_SIZE_BYTES = 10 * 1024 * 1024;

// --- Functions jo baqi pages maang rahe hain ---
export const getLocalFileUrl = (file) => file?.url || file || '';
export const publicFileRequest = async () => [];
export const adminFileRequest = async () => ({ success: true });
export const adminRequest = async () => ({ success: true });
export const getAdminSessionUsername = () => localStorage.getItem('adminUser') || 'admin';
export const signOutAdmin = () => localStorage.removeItem('adminUser');

// --- Saare Subscribe Functions (ek hi kaam karenge) ---
export const subscribeLocalData = createSubscriber('localData');
export const subscribeHomeContent = createSubscriber('homeContent');
export const subscribeWaitlist = createSubscriber('admissions');
export const subscribeAdmissions = createSubscriber('admissions');
export const subscribeMeritList = createSubscriber('meritList');
export const subscribeApprovedGallery = createSubscriber('gallery');
export const subscribeLocalChanges = createSubscriber('localData');
export const subscribeAnnouncements = createSubscriber('announcements');
export const subscribeSiteContent = createSubscriber('siteContent');
export const subscribeAdminData = createSubscriber('adminData');

// purane naam jo kahin use ho rahe hon
export const subscribeLocalDataList = subscribeLocalData;
export const subscribeWaitList = subscribeWaitlist;
export const subscribeApprovedGalleryList = subscribeApprovedGallery;

export default {
  subscribeLocalData,
  subscribeHomeContent,
  subscribeWaitlist,
  subscribeMeritList,
  subscribeApprovedGallery,
};
