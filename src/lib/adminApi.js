import { supabase } from './supabase.js';

// --- Default Data Fallbacks ---
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
  }
};

// --- Real Supabase Subscribers ---
const createSubscriber = (tableName, transformFn = (d) => d) => {
  return (callback) => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        let query = supabase.from(tableName).select('*');
        if (tableName !== 'site_content') {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        if (isSubscribed && callback) {
          callback(transformFn(data));
        }
      } catch (e) {
        console.warn(`Error fetching ${tableName}:`, e.message);
        if (isSubscribed && callback) {
          callback(tableName === 'site_content' ? {} : []);
        }
      }
    };

    fetchData();

    const channel = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  };
};

export const MAX_CIRCULAR_SIZE_BYTES = 10 * 1024 * 1024;

export const getLocalFileUrl = (file) => file?.url || file?.image_url || file?.file_url || '';
export const getFileUrl = (file) => getLocalFileUrl(file);
export const getPublicFileUrl = (file) => getLocalFileUrl(file);
export const publicFileUrl = (file) => getLocalFileUrl(file);
export const localFileUrl = (file) => getLocalFileUrl(file);

export const getAdminSessionUsername = () => localStorage.getItem('adminUser') || 'admin';
export const signOutAdmin = () => localStorage.removeItem('adminUser');

// --- Supabase Storage File Upload Helper ---
const uploadFileToSupabaseStorage = async (file, bucketName = 'media') => {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

// --- Active Admin API Request Handler ---
export const adminRequest = async (action, payload = {}) => {
  switch (action) {
    case 'admin.bootstrap': {
      const [admissionsRes, galleryRes, facultyRes, noticesRes, settingsRes] = await Promise.all([
        supabase.from('admissions').select('*').order('created_at', { ascending: false }),
        supabase.from('media_gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('faculty').select('*'),
        supabase.from('notices').select('*').order('created_at', { ascending: false }),
        supabase.from('site_content').select('*')
      ]);

      const settingsMap = {};
      (settingsRes.data || []).forEach(item => {
        settingsMap[item.key] = item.value;
      });

      return {
        username: getAdminSessionUsername(),
        admissions: admissionsRes.data || [],
        gallery: galleryRes.data || [],
        faculty: facultyRes.data || [],
        circulars: noticesRes.data || [],
        settings: {
          principal_name: settingsMap.home_settings?.principal_name || 'Captain Ashfaq Shaheed',
          principal_message: settingsMap.home_settings?.principal_message || '',
          principal_image_url: settingsMap.home_settings?.principal_image_url || '',
          phone: settingsMap.home_settings?.phone || '0963-123456',
          address: settingsMap.home_settings?.address || 'Tank, KPK',
          merit_list_live: settingsMap.merit_list_status?.isPublished || false
        }
      };
    }

    case 'admin.admission.update': {
      const { regId, ...updates } = payload;
      const { data, error } = await supabase
        .from('admissions')
        .update(updates)
        .eq('student_id', regId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    case 'admin.gallery.moderate': {
      const { id, status, category } = payload;
      const { data, error } = await supabase
        .from('media_gallery')
        .update({ status, category })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    case 'admin.gallery.delete': {
      const { id } = payload;
      const { error } = await supabase.from('media_gallery').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }

    case 'admin.faculty.save': {
      const { faculty } = payload;
      const query = faculty.id 
        ? supabase.from('faculty').update(faculty).eq('id', faculty.id).select().single()
        : supabase.from('faculty').insert([faculty]).select().single();
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }

    case 'admin.faculty.delete': {
      const { id } = payload;
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }

    case 'admin.merit.set': {
      const { published } = payload;
      const { error } = await supabase
        .from('site_content')
        .upsert({ key: 'merit_list_status', value: { isPublished: published, updated_at: new Date() } });
      if (error) throw error;
      return { success: true };
    }

    case 'admin.settings.save': {
      const { settings } = payload;
      const { error } = await supabase
        .from('site_content')
        .upsert({ key: 'home_settings', value: settings });
      if (error) throw error;
      return { success: true };
    }

    default:
      console.warn(`Unhandled admin request: ${action}`);
      return { success: true };
  }
};

export const adminFileRequest = async (action, payload = {}, file, fileField = 'file') => {
  if (action === 'admin.gallery.upload') {
    const publicUrl = await uploadFileToSupabaseStorage(file, 'media');
    const { title, category, description } = payload;
    const { data, error } = await supabase
      .from('media_gallery')
      .insert([{ title, category: category || 'General', image_url: publicUrl, description, status: 'approved' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  if (action === 'admin.circular.save') {
    const publicUrl = await uploadFileToSupabaseStorage(file, 'circulars');
    const { title, publishDate } = payload;
    const { data, error } = await supabase
      .from('notices')
      .insert([{ title, file_url: publicUrl, date: publishDate, category: 'Examination' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  if (action === 'admin.faculty.save') {
    let photoUrl = payload.faculty?.photo_url || '';
    if (file) {
      photoUrl = await uploadFileToSupabaseStorage(file, 'faculty');
    }
    const facultyData = { ...payload.faculty, image_url: photoUrl };
    delete facultyData.photo_url;

    const query = facultyData.id
      ? supabase.from('faculty').update(facultyData).eq('id', facultyData.id).select().single()
      : supabase.from('faculty').insert([facultyData]).select().single();

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  return { success: true };
};

export const publicFileRequest = async () => ({ success: true });
export const publicRequest = async () => ({ success: true });
export const fileRequest = async () => ({ success: true });

// --- Real Subscribers ---
export const subscribeLocalData = createSubscriber('site_content');
export const subscribeHomeContent = createSubscriber('site_content', (data) => {
  const homeSetting = (data || []).find(item => item.key === 'home_settings')?.value || {};
  return homeSetting;
});
export const subscribeWaitList = createSubscriber('admissions');
export const subscribeAdmissions = createSubscriber('admissions');
export const subscribeMeritList = createSubscriber('site_content', (data) => {
  return (data || []).find(item => item.key === 'merit_list_status')?.value || { isPublished: false };
});
export const subscribeApprovedGallery = createSubscriber('media_gallery');
export const subscribeLocalChanges = createSubscriber('media_gallery');
export const subscribeAnnouncements = createSubscriber('notices');
export const subscribeSiteContent = createSubscriber('site_content');
export const subscribeAdminData = createSubscriber('site_content');

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
