import { isSupabaseConfigured } from './supabase';

const SESSION_TOKEN_KEY = 'casdct_admin_session';
const SESSION_USERNAME_KEY = 'casdct_admin_username';

const getFunctionUrl = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Contact the site administrator.');
  }

  return `${import.meta.env.VITE_SUPABASE_URL.replace(/\/+$/, '')}/functions/v1/admin-api`;
};

export const getAdminSessionToken = () => sessionStorage.getItem(SESSION_TOKEN_KEY);
export const getAdminSessionUsername = () => sessionStorage.getItem(SESSION_USERNAME_KEY) || '';

export const clearAdminSession = () => {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_USERNAME_KEY);
};

const callAdminApi = async (action, payload = {}, token = getAdminSessionToken()) => {
  const headers = {
    'Content-Type': 'application/json',
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  return parseApiResponse(await fetch(getFunctionUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, ...payload })
  }));
};

const parseApiResponse = async (response) => {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && getAdminSessionToken()) {
      clearAdminSession();
      window.location.assign('/login');
    }
    throw new Error(result?.error || `Admin service request failed (${response.status}).`);
  }
  const data = result?.data;
  if (data?.token && data?.username) {
    sessionStorage.setItem(SESSION_TOKEN_KEY, data.token);
    sessionStorage.setItem(SESSION_USERNAME_KEY, data.username);
  }
  return data;
};

const callAdminFileApi = async (action, payload, file, fileField, token = getAdminSessionToken()) => {
  const formData = new FormData();
  formData.append('action', action);
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
  });
  formData.append(fileField, file);
  const headers = {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  return parseApiResponse(await fetch(getFunctionUrl(), {
    method: 'POST',
    headers,
    body: formData
  }));
};

export const signInAdmin = async (username, password) => {
  const result = await callAdminApi('auth.login', { username, password }, null);
  if (!result?.token || !result?.username) {
    throw new Error('The admin service returned an invalid login response.');
  }
  sessionStorage.setItem(SESSION_TOKEN_KEY, result.token);
  sessionStorage.setItem(SESSION_USERNAME_KEY, result.username);
  return result;
};

export const adminRequest = (action, payload) => callAdminApi(action, payload);
export const adminFileRequest = (action, payload, file, fileField) =>
  callAdminFileApi(action, payload, file, fileField);

export const publicRequest = async (action, payload = {}) => {
  const result = await callAdminApi(action, payload, null);
  return result;
};
export const publicFileRequest = (action, payload, file, fileField) =>
  callAdminFileApi(action, payload, file, fileField, null);
