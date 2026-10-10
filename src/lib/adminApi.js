import { supabase } from './supabase.js';

// Sab pages ke liye ek hi jaisa subscribe function
const createSubscriber = (tableName) => {
  return (callback) => {
    const fetchData = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('id', tableName).single();
      if (data && callback) {
        callback(data.content || data);
      } else if (callback) {
        callback({});
      }
    };
    fetchData();
    // Vercel build ke liye dummy unsubscribe return karna zaroori hai
    return () => {};
  };
};

// Yahan saare naam export kar diye hain taake koi bhi page error na de
export const subscribeLocalData = createSubscriber('localData');
export const subscribeHomeContent = createSubscriber('homeContent');
export const subscribeWaitlist = createSubscriber('admissions');
export const subscribeAdminData = createSubscriber('adminData');
export const subscribeSiteContent = createSubscriber('siteContent');
export const subscribeAnnouncements = createSubscriber('announcements');
export const subscribeAdmissions = createSubscriber('admissions');

// Agar kahin default import ho to uske liye bhi
export const subscribeLocalDataList = subscribeLocalData;
export const subscribeWaitList = subscribeWaitlist;

export default {
  subscribeLocalData,
  subscribeHomeContent,
  subscribeWaitlist,
};
