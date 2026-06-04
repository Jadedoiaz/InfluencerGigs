import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header style={{ background: '#1e293b', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', cursor: 'pointer' }} onClick={() => navigate('/marketplace')}>
          🎬 InfluencerGig
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {!token ? (
            <>
              <a href="/marketplace" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Marketplace
              </a>
              <a href="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Login
              </a>
              <a href="/signup" style={{ color: '#fff', background: '#7c3aed', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Sign Up
              </a>
            </>
          ) : (
            <>
              <a href="/marketplace" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Marketplace
              </a>
              
              {user?.isAdmin ? (
                <a href="/admin" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontWeight: 'bold', color: '#a78bfa' }}>
                  🔧 Admin
                </a>
              ) : (
                <a href="/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                  Dashboard
                </a>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  👤 {user?.displayName || user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
