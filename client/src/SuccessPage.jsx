// client/src/SuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const SuccessPage = () => {
  const [backgroundCheckStarted, setBackgroundCheckStarted] = useState(false);

  useEffect(() => {
    toast.success('Payment successful! Now, let’s complete your background check.', { autoClose: 5000 });
  }, []);

  const handleStartBackgroundCheck = async () => {
    setBackgroundCheckStarted(true);
    toast.info('Initiating your background check...', { autoClose: 5000 });

    try {
      // API call to your server using the Vite proxy
      const response = await fetch('/api/create-checkr-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateData: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Background check invitation created. Redirecting...', { autoClose: 3000 });
        window.location.href = data.invitationUrl;
      } else {
        throw new Error(data.error || 'Failed to create Checkr invitation.');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setBackgroundCheckStarted(false);
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      <h1>Welcome to GuardianPay!</h1>
      <p>Your payment has been successfully processed.</p>
      <button
        onClick={handleStartBackgroundCheck}
        disabled={backgroundCheckStarted}
        style={{ marginTop: '20px' }}
      >
        {backgroundCheckStarted ? 'Redirecting...' : 'Start Background Check'}
      </button>
    </div>
  );
};

export default SuccessPage;