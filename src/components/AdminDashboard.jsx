import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [reward, setReward] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userStr || !token) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (!userData.isAdmin) {
        navigate('/dashboard');
        return;
      }
      setUser(userData);
      loadData(token);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const loadData = async (token) => {
    try {
      const res = await fetch('https://influencer-gig-api-production.up.railway.app/api/submissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSubmissions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleApprove = async () => {
    if (!selectedId || !reward) return alert('Enter reward amount');
    const token = localStorage.getItem('token');
    try {
      await fetch('https://influencer-gig-api-production.up.railway.app/api/admin/approve-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ submissionId: selectedId, rewardAmount: parseFloat(reward) })
      });
      alert('Approved!');
      setSelectedId(null);
      setReward('');
      const t = localStorage.getItem('token');
      loadData(t);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleReject = async () => {
    if (!selectedId) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://influencer-gig-api-production.up.railway.app/api/submissions/${selectedId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ Status: 'Rejected' })
      });
      alert('Rejected!');
      setSelectedId(null);
      const t = localStorage.getItem('token');
      loadData(t);
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

  return (
    <div style={{ background: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1>Admin Dashboard</h1>
            <p style={{ color: '#94a3b8', marginTop: '5px' }}>Welcome, {user?.displayName || user?.username}!</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Logout
          </button>
        </div>

        <button
          onClick={() => loadData(localStorage.getItem('token'))}
          style={{ padding: '10px 20px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '30px' }}
        >
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
