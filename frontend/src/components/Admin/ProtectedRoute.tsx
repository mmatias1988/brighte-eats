import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../auth/simpleAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component that checks authentication
 * Redirects to admin login if not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
