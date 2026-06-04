import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch('https://influencer-gig-api-production.up.railway.app/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token })
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('✅ Email verified! Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error verifying email. Please try again.');
        console.error(err);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid #475569' }}>
        {status === 'verifying' && (
          <>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>🔐 Verifying Email</h2>
            <p style={{ color: '#cbd5e1' }}>{message}</p>
            <div style={{ marginTop: '20px', fontSize: '24px' }}>⏳</div>
          </>
        )}

        {status === 'success' && (
          <>
            <h2 style={{ color: '#22c55e', marginBottom: '20px' }}>✅ Email Verified!</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>{message}</p>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>❌ Verification Failed</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>{message}</p>
            <a href="/login" style={{ display: 'inline-block', padding: '12px 24px', background: '#7c3aed', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', marginTop: '20px' }}>
              Go to Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
