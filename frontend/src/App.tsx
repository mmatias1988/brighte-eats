import { Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/Admin/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public route - registration form */}
      <Route path="/" element={<RegisterPage />} />
      
      {/* Admin login */}
      <Route path="/admin" element={<AdminLoginPage />} />
      
      {/* Protected admin dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

