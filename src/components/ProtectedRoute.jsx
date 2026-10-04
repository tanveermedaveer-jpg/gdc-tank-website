import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdminUser, isSupabaseConfigured, supabase } from '../lib/supabase';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [authState, setAuthState] = useState(() => ({
    loading: isSupabaseConfigured,
    isAdmin: false,
    error: ''
  }));

  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setAuthState({
          loading: false,
          isAdmin: isAdminUser(session?.user),
          error: ''
        });
      }
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (isMounted) {
          setAuthState({
            loading: false,
            isAdmin: isAdminUser(data.session?.user),
            error: error?.message || ''
          });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAuthState({ loading: false, isAdmin: false, error: error.message });
        }
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (authState.loading) {
    return <div className="flex flex-1 items-center justify-center p-8 text-slate-600">Checking admin access…</div>;
  }

  if (authState.error) {
    return <div role="alert" className="flex flex-1 items-center justify-center p-8 text-rose-700">Unable to verify admin access: {authState.error}</div>;
  }

  if (!authState.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
