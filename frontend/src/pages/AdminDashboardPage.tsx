import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { GET_LEADS } from '../graphql/queries';
import { logout, isAuthenticated } from '../auth/simpleAuth';
import LeadList from '../components/LeadList';
import { LeadModal } from '../components/LeadModal';
import type { GetLeadsData, Lead } from '../types';
import './AdminDashboardPage.css';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery<GetLeadsData>(GET_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // This shouldn't happen due to ProtectedRoute, but safety check
  if (!isAuthenticated()) {
    navigate('/admin');
    return null;
  }

  // Sort and filter leads
  const processedLeads = useMemo(() => {
    if (!data?.leads) return [];

    let leads: Lead[] = [...data.leads];

    // Sort by registration date (newest first) by default
    leads.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    // Filter by search query (name or email)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      leads = leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query)
      );
    }

    return leads;
  }, [data?.leads, searchQuery]);

  // Calculate service type statistics (based on all leads, not filtered)
  const totalLeads = data?.leads.length || 0;
  const deliveryCount =
    data?.leads.filter((lead) =>
      lead.services.some((service) => service.serviceType === 'DELIVERY')
    ).length || 0;
  const pickupCount =
    data?.leads.filter((lead) =>
      lead.services.some((service) => service.serviceType === 'PICKUP')
    ).length || 0;
  const paymentCount =
    data?.leads.filter((lead) =>
      lead.services.some((service) => service.serviceType === 'PAYMENT')
    ).length || 0;

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
              <span className="stat-value">{totalLeads}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Delivery</span>
              <span className="stat-value">{deliveryCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pickup</span>
              <span className="stat-value">{pickupCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Payment</span>
              <span className="stat-value">{paymentCount}</span>
            </div>
          </div>

          <div className="leads-section">
            <div className="leads-section-header">
              <h2>Registered Leads</h2>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="clear-search-button"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            {loading && <div className="loading">Loading leads...</div>}
            {error && (
              <div className="error">
                Error loading leads: {error.message}
              </div>
            )}
            {!loading && !error && (
              <>
                {searchQuery && processedLeads.length === 0 && (
                  <div className="no-results">
                    No leads found matching "{searchQuery}"
                  </div>
                )}
                <LeadList
                  leads={processedLeads}
                  onLeadClick={setSelectedLeadId}
                />
                <button onClick={() => refetch()} className="refresh-button">
                  Refresh
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {selectedLeadId && (
        <LeadModal
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
        />
      )}
    </div>
  );
}
