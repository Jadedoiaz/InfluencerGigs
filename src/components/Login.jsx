import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://influencer-gig-api-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '40px', maxWidth: '400px', width: '100%', border: '1px solid #475569' }}>
        <h1 style={{ color: '#fff', marginBottom: '10px' }}>🎬 InfluencerGig Login</h1>
        <p style={{ color: '#cbd5e1', marginBottom: '30px' }}>Sign in to your account</p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '6px', padding: '12px', marginBottom: '20px', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '600' }}>Sign up</a>
          </p>
        </div>

        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
          Secure login with encrypted passwords
        </p>
      </div>
    </div>
  );
}
