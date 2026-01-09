import { useLazyQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { GET_LEAD } from '../graphql/queries';
import type { Lead } from '../types';
import './LeadModal.css';

interface LeadModalProps {
  leadId: string | null;
  onClose: () => void;
}

interface GetLeadData {
  lead: Lead;
}

export function LeadModal({ leadId, onClose }: LeadModalProps) {
  const [getLead, { loading, error, data }] = useLazyQuery<GetLeadData>(
    GET_LEAD,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (leadId) {
      getLead({ variables: { id: leadId } });
    }
  }, [leadId, getLead]);

  if (!leadId) return null;

  const lead: Lead | undefined = data?.lead;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Lead Details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="modal-loading">Loading lead details...</div>}
          
          {error && (
            <div className="modal-error">
              Error loading lead: {error.message}
            </div>
          )}

          {!loading && !error && lead && (
            <div className="lead-details">
              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <div className="detail-value">{lead.name}</div>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <div className="detail-value">
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Mobile</label>
                    <div className="detail-value">
                      <a href={`tel:${lead.mobile}`}>{lead.mobile}</a>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Postcode</label>
                    <div className="detail-value">{lead.postcode}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Services</h3>
                <div className="services-list">
                  {lead.services.length > 0 ? (
                    lead.services.map((service) => (
                      <div key={service.id} className="service-detail-item">
                        <span className="service-type">{service.serviceType}</span>
                        <span className="service-date">
                          Selected: {new Date(service.createdAt).toLocaleDateString()}{' '}
                          {new Date(service.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="no-services">No services selected</div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Registration Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Registered</label>
                    <div className="detail-value">
                      {new Date(lead.createdAt).toLocaleDateString()}{' '}
                      {new Date(lead.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated</label>
                    <div className="detail-value">
                      {new Date(lead.updatedAt).toLocaleDateString()}{' '}
                      {new Date(lead.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Lead ID</label>
                    <div className="detail-value detail-id">{lead.id}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="modal-close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
