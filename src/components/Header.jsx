import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '2px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div
          style={{ fontSize: '20px', fontWeight: 'bold', color: '#7c3aed', cursor: 'pointer' }}
          onClick={() => navigate('/marketplace')}
        >
          InfluencerGig
        </div>

        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="https://www.influencergig.online" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Home
          </a>
          <a href="/marketplace" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Marketplace
          </a>

          {!token ? (
            <>
              <a href="/login" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                Login
              </a>
              <a href="/signup" style={{
                color: '#fff',
                background: '#7c3aed',
                padding: '8px 18px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Sign Up
              </a>
            </>
          ) : (
            <>
              {user && user.isAdmin ? (
                <a href="/admin" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                  Admin
                </a>
              ) : (
                <a href="/dashboard" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                  Dashboard
                </a>
              )}
              <span style={{ color: '#6b7280', fontSize: '13px' }}>
                {user ? (user.displayName || user.username) : ''}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
