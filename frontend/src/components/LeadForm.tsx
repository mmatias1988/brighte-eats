import { useState } from 'react';
import type { FormEvent } from 'react';
import './LeadForm.css';

interface LeadFormProps {
  onSubmit: (input: {
    name: string;
    email: string;
    mobile: string;
    postcode: string;
    services: string[];
  }) => void;
  isSubmitting?: boolean;
}

const SERVICE_OPTIONS = ['DELIVERY', 'PICKUP', 'PAYMENT'];

function LeadForm({ onSubmit, isSubmitting = false }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    postcode: '',
  });
  const [services, setServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    }

    if (services.length === 0) {
      newErrors.services = 'At least one service must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        services,
      });
      // Reset form
      setFormData({
        name: '',
        email: '',
        mobile: '',
        postcode: '',
      });
      setServices([]);
      setErrors({});
    }
  };

  const handleServiceChange = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lead-form">
      <div className="form-group">
        <label htmlFor="name">
          Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="mobile">
          Mobile <span className="required">*</span>
        </label>
        <input
          type="tel"
          id="mobile"
          value={formData.mobile}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, mobile: e.target.value }))
          }
          className={errors.mobile ? 'error' : ''}
        />
        {errors.mobile && (
          <span className="error-message">{errors.mobile}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="postcode">
          Postcode <span className="required">*</span>
        </label>
        <input
          type="text"
          id="postcode"
          value={formData.postcode}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, postcode: e.target.value }))
          }
          className={errors.postcode ? 'error' : ''}
        />
        {errors.postcode && (
          <span className="error-message">{errors.postcode}</span>
        )}
      </div>

      <div className="form-group">
        <label>
          Services <span className="required">*</span>
        </label>
        <div className="service-options">
          {SERVICE_OPTIONS.map((service) => (
            <label key={service} className="service-checkbox">
              <input
                type="checkbox"
                checked={services.includes(service)}
                onChange={() => handleServiceChange(service)}
              />
              <span>{service}</span>
            </label>
          ))}
        </div>
        {errors.services && (
          <span className="error-message">{errors.services}</span>
        )}
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register Interest'}
      </button>
    </form>
  );
}

export default LeadForm;

