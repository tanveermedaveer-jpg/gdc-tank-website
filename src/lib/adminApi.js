import { supabase } from './supabase.js';

// --- Storage File Upload Helper ---
const uploadFileToSupabaseStorage = async (file, bucketName = 'media') => {
  if (!file) return '';
  
  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, { upsert: true, cacheControl: '3600' });

    if (uploadError) {
      console.error(`Upload Error (${bucketName}):`, uploadError.message);
      return '';
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return data?.publicUrl || '';
  } catch (err) {
    console.error('Storage Exception:', err);
    return '';
  }
};

// --- Upload Request Handler ---
export const adminFileRequest = async (action, payload = {}, file) => {
  if (action === 'admin.gallery.upload') {
    const publicUrl = await uploadFileToSupabaseStorage(file, 'media');
    
    const { title, category, description } = payload;
    const { data, error } = await supabase
      .from('media_gallery')
      .insert([{ 
        title: title || 'Campus Photo', 
        category: category || 'General', 
        image_url: publicUrl, 
        url: publicUrl, // Backup property
        description: description || '', 
        status: 'approved' 
      }])
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
    const facultyData = { ...payload.faculty, image_url: photoUrl, photo_url: photoUrl };

    const query = facultyData.id
      ? supabase.from('faculty').update(facultyData).eq('id', facultyData.id).select().single()
      : supabase.from('faculty').insert([facultyData]).select().single();

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  return { success: true };
};
