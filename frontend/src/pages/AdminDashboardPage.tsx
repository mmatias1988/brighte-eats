import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { GET_LEADS } from '../graphql/queries';
import { logout, isAuthenticated } from '../auth/simpleAuth';
import LeadList from '../components/LeadList';
import type { GetLeadsData } from '../types';
import './AdminDashboardPage.css';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery<GetLeadsData>(GET_LEADS);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // This shouldn't happen due to ProtectedRoute, but safety check
  if (!isAuthenticated()) {
    navigate('/admin');
    return null;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage registered leads</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-card">
          <div className="admin-stats">
            <div className="stat-item">
              <span className="stat-label">Total Leads</span>
              <span className="stat-value">{data?.leads.length || 0}</span>
            </div>
          </div>

          <div className="leads-section">
            <h2>Registered Leads</h2>
            {loading && <div className="loading">Loading leads...</div>}
            {error && (
              <div className="error">
                Error loading leads: {error.message}
              </div>
            )}
            {!loading && !error && data && (
              <>
                <LeadList leads={data.leads} />
                <button onClick={() => refetch()} className="refresh-button">
                  Refresh
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
