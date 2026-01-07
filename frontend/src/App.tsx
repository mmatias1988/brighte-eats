import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_LEADS, REGISTER_LEAD } from './graphql/queries.ts';
import LeadForm from './components/LeadForm.tsx';
import LeadList from './components/LeadList.tsx';
import type { GetLeadsData } from './types.ts';
import './App.css';

function App() {
  const { loading, error, data, refetch } = useQuery<GetLeadsData>(GET_LEADS);
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
      refetch(); // Refresh the leads list
      setSuccessMessage('Lead registered successfully!');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      const errorMsg = err.graphQLErrors?.[0]?.message || err.message || 'An error occurred while registering the lead';
      setErrorMessage(errorMsg);
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Brighte Eats - Expressions of Interest</h1>
        <p>Register your interest for Brighte Eats services</p>
      </header>

      <main className="app-main">
        <section className="register-section">
          <h2>Register Your Interest</h2>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
          <LeadForm onSubmit={handleRegister} isSubmitting={submitting} />
        </section>

        <section className="leads-section">
          <h2>Registered Leads</h2>
          {loading && <div className="loading">Loading leads...</div>}
          {error && (
            <div className="error">
              Error loading leads: {error.message}
            </div>
          )}
          {!loading && !error && data && <LeadList leads={data.leads} />}
        </section>
      </main>
    </div>
  );
}

export default App;

