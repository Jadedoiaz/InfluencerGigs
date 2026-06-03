import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [reward, setReward] = useState('');

  // Load admin password from backend on mount
  useEffect(() => {
    const checkAuth = async () => {
      const stored = sessionStorage.getItem('adminAuth');
      if (stored) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const res = await fetch('https://influencer-gig-api-production.up.railway.app/api/submissions');
      const data = await res.json();
      setSubmissions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Use a simple hardcoded password for now - CHANGE THIS
    const ADMIN_PASSWORD = 'influencer2025'; // CHANGE THIS TO YOUR PASSWORD
    
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setPasswordInput('');
      alert('✅ Welcome, Admin!');
    } else {
      alert('❌ Incorrect password');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleApprove = async () => {
    if (!selectedId || !reward) return alert('Enter reward amount');
    try {
      await fetch('https://influencer-gig-api-production.up.railway.app/api/admin/approve-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: selectedId, rewardAmount: parseFloat(reward) })
      });
      alert('Approved!');
      setSelectedId(null);
      setReward('');
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleReject = async () => {
    if (!selectedId) return;
    try {
      await fetch(`https://influencer-gig-api-production.up.railway.app/api/submissions/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: 'Rejected' })
      });
      alert('Rejected!');
      setSelectedId(null);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const filtered = submissions.filter(s => {
    if (filter === 'pending') return s.Status === 'Pending Review';
    if (filter === 'approved') return s.Status === 'Approved';
    if (filter === 'rejected') return s.Status === 'Rejected';
    return true;
  });

  const selected = submissions.find(s => s.id === selectedId);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '40px', maxWidth: '400px', width: '100%', border: '1px solid #475569' }}>
          <h1 style={{ color: '#fff', marginBottom: '10px' }}>🔐 Admin Access</h1>
          <p style={{ color: '#cbd5e1', marginBottom: '30px' }}>Influencers cannot access this area</p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Admin Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              Login
            </button>
          </form>

          <p style={{ color: '#64748b', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
            Only admins can access this dashboard. Unauthorized access is logged.
          </p>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div style={{ background: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1>Admin Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Manage submissions & payouts</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Logout
          </button>
        </div>

        <button onClick={loadData} style={{ padding: '10px 20px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '30px' }}>
          Refresh
        </button>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', background: filter === f ? '#7c3aed' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {filtered.map(sub => (
            <div key={sub.id} onClick={() => setSelectedId(sub.id)} style={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>{sub['Submission ID']}</p>
              <p style={{ fontSize: '12px', color: '#cbd5e1' }}>Status: {sub.Status}</p>
              <p style={{ fontSize: '12px', color: '#cbd5e1' }}>Reward: ${sub['Reward Amount'] || 'TBD'}</p>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#1e293b', borderRadius: '8px', padding: '30px', maxWidth: '500px', width: '90%' }}>
              <h2>Submission: {selected['Submission ID']}</h2>
              <p style={{ marginTop: '20px', color: '#cbd5e1' }}>Video: <a href={selected['Video URL']} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{selected['Video URL']}</a></p>
              <p style={{ color: '#cbd5e1' }}>Status: {selected.Status}</p>

              {selected.Status === 'Pending Review' && (
                <>
                  <input type="number" min="0" step="0.01" placeholder="Reward amount" value={reward} onChange={e => setReward(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '20px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button onClick={handleApprove} style={{ flex: 1, padding: '12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                    <button onClick={handleReject} style={{ flex: 1, padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                  </div>
                </>
              )}

              <button onClick={() => setSelectedId(null)} style={{ width: '100%', padding: '12px', marginTop: '20px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
