import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { REGISTER_LEAD } from '../graphql/queries';
import LeadForm from '../components/LeadForm';
import { ImageSlider } from '../components/ImageSlider';
import './RegisterPage.css';

export function RegisterPage() {
  const [registerLead, { loading: submitting }] = useMutation(REGISTER_LEAD);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (input: {
    name: string;
    email: string;
    mobile: string;
    postcode: string;
    services: string[];
  }) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      await registerLead({
        variables: { input },
      });
      setSuccessMessage('Thank you! Your interest has been registered successfully.');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      const errorMsg = err.graphQLErrors?.[0]?.message || err.message || 'An error occurred while registering your interest';
      setErrorMessage(errorMsg);
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div className="register-page">
      <ImageSlider opacity={0.60} />
      <header className="register-header">
        <h1>Brighte Eats - Expressions of Interest</h1>
      </header>

      <main className="register-main">
        <div className="register-card">
          <h2>Register Your Interest</h2>
          <p className="register-description">
            Fill out the form below to express your interest in Brighte Eats services.
            We'll keep you updated on our launch!
          </p>
          
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
          
          <LeadForm onSubmit={handleRegister} isSubmitting={submitting} />
        </div>
      </main>
    </div>
  );
}
