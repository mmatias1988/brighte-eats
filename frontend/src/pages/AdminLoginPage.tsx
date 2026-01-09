import { useNavigate } from 'react-router-dom';
import { AdminLogin } from '../components/Admin/AdminLogin';
import { isAuthenticated } from '../auth/simpleAuth';
import { useEffect } from 'react';

export function AdminLoginPage() {
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate('/admin/dashboard', { replace: true });
  };

  return <AdminLogin onSuccess={handleLoginSuccess} />;
}
