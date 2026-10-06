import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  
  // Directly check localStorage set by Login.jsx
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userRole') === 'admin';

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
