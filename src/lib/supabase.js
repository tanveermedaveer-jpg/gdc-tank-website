import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const CIRCULARS_BUCKET = 'examination-circulars';
export const MAX_CIRCULAR_SIZE_BYTES = 10 * 1024 * 1024;

export const isAdminUser = (user) => user?.app_metadata?.role === 'admin';
