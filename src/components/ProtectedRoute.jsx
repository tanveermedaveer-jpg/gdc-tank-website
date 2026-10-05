import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSessionToken } from '../lib/adminApi';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isLoggedIn = Boolean(getAdminSessionToken());

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
