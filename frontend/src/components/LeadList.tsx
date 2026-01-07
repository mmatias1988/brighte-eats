import './LeadList.css';
import type { Lead } from '../types.ts';

interface LeadListProps {
  leads: Lead[];
}

function LeadList({ leads }: LeadListProps) {
  if (leads.length === 0) {
    return <p className="no-leads">No leads registered yet.</p>;
  }

  return (
    <div className="lead-list">
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Postcode</th>
            <th>Services</th>
            <th>Registered</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.mobile}</td>
              <td>{lead.postcode}</td>
              <td>
                <div className="services-badges">
                  {lead.services.map((service) => (
                    <span key={service.id} className="service-badge">
                      {service.serviceType}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                {new Date(lead.createdAt).toLocaleDateString()}{' '}
                {new Date(lead.createdAt).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadList;

