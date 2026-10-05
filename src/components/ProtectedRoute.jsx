import { Navigate, useLocation } from 'react-router-dom';
import { hasAdminSession } from '../lib/adminApi';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isLoggedIn = hasAdminSession();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
