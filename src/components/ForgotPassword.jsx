import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://influencer-gig-api-production.up.railway.app';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(API + '/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Reset link sent to your email! Check your inbox.' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Request failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '40px', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
          Forgot Password?
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>
          Enter your email and we'll send you a reset link
        </p>

        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            border: message.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca',
            fontSize: '13px'
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: loading ? '#9ca3af' : '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
