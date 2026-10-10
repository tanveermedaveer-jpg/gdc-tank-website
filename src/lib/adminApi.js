import { supabase } from './supabase.js'

// Admission save karna
export const saveAdmission = async (data) => {
  const { error } = await supabase.from('admissions').insert([data])
  return { error }
}

// Sare admissions lena
export const getAdmissions = async () => {
  const { data, error } = await supabase.from('admissions').select('*').order('created_at', {ascending: false})
  return { data, error }
}

// Notices
export const getNotices = async () => {
  const { data, error } = await supabase.from('notices').select('*').order('created_at', {ascending: false})
  return { data, error }
}

export const addNotice = async (notice) => {
  const { data, error } = await supabase.from('notices').insert([notice]).select()
  return { data, error }
}
