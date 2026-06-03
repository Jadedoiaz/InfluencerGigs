import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Requires admin but user is not admin
  if (requireAdmin && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (!user.isAdmin) {
        return (
          <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
            <div style={{ background: '#1e293b', borderRadius: '8px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', border: '1px solid #475569' }}>
              <h1 style={{ color: '#fff', marginBottom: '20px' }}>🚫 Access Denied</h1>
              <p style={{ color: '#cbd5e1', marginBottom: '30px' }}>You don't have permission to access this area.</p>
              <a href="/dashboard" style={{ display: 'inline-block', padding: '12px 24px', background: '#7c3aed', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' }}>
                Go to Dashboard
              </a>
            </div>
          </div>
        );
      }
    } catch (e) {
      console.error('Error parsing user:', e);
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
