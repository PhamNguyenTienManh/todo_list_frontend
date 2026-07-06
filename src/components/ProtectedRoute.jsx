import { Navigate, useLocation } from 'react-router-dom';
import { hasToken } from '../utils/tokenStorage.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!hasToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
