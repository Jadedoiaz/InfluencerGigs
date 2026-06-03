import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rewardAmount, setRewardAmount] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://influencer-gig-api-production.up.railway.app/api/submissions');
      const data = await response.json();
      
      const pending = data.filter(s => s.Status === 'Pending Review').length;
      const approved = data.filter(s => s.Status === 'Approved').length;
      const rejected = data.filter(s => s.Status === 'Rejected').length;
      const totalEarnings = data
        .filter(s => s.Status === 'Approved')
        .reduce((sum, s) => sum + (s['Reward Amount'] || 0), 0);

      setSubmissions(data);
      setStats({ pending, approved, rejected, totalEarnings });
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedSubmission || !rewardAmount) {
      alert('Please enter a reward amount');
      return;
    }

    try {
      const response = await fetch(
        'https://influencer-gig-api-production.up.railway.app/api/admin/approve-submission',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submissionId: selectedSubmission.id,
            influencerId: selectedSubmission.Influencer?.[0] || '',
            rewardAmount: parseFloat(rewardAmount)
          })
        }
      );

      if (response.ok) {
        alert('✅ Video approved and payment initiated!');
        setShowRewardInput(false);
        setRewardAmount('');
        setSelectedSubmission(null);
        fetchSubmissions();
      } else {
        alert('❌ Failed to approve submission');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    try {
      const response = await fetch(
        `https://influencer-gig-api-production.up.railway.app/api/submissions/${selectedSubmission.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Status: 'Rejected' })
        }
      );

      if (response.ok) {
        alert('❌ Video rejected');
        setSelectedSubmission(null);
        fetchSubmissions();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'pending') return sub.Status === 'Pending Review';
    if (filter === 'approved') return sub.Status === 'Approved';
    if (filter === 'rejected') return sub.Status === 'Rejected';
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to br, #0f172a, #1e1b4b)', color: '#fff', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>Admin Dashboard</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Manage submissions & creator payouts</p>
        <button
          onClick={fetchSubmissions}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '20px' }}>
          <p style={{ color: '#93c5fd', fontSize: '12px', marginBottom: '10px' }}>Pending Review</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dbeafe' }}>{stats.pending}</p>
        </div>

        <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '8px', padding: '20px' }}>
          <p style={{ color: '#86efac', fontSize: '12px', marginBottom: '10px' }}>Approved</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dcfce7' }}>{stats.approved}</p>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '8px', padding: '20px' }}>
          <p style={{ color: '#fca5a5', fontSize: '12px', marginBottom: '10px' }}>Rejected</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#fee2e2' }}>{stats.rejected}</p>
        </div>

        <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(196, 181, 253, 0.3)', borderRadius: '8px', padding: '20px' }}>
          <p style={{ color: '#d8b4fe', fontSize: '12px', marginBottom: '10px' }}>Total Earnings</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ede9fe' }}>${stats.totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
        {['pending', 'approved', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '8px 16px',
              background: filter === tab ? '#7c3aed' : 'transparent',
              color: filter === tab ? '#fff' : '#cbd5e1',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Submissions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {filteredSubmissions.map(submission => (
          <div
            key={submission.id}
            style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid #475569',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onClick={() => setSelectedSubmission(submission)}
          >
            <div style={{ aspectRatio: '16/9', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontSize: '32px' }}>🎬</span>
            </div>

            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#e2e8f0' }}>
                {submission['Submission ID']}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Reward:</span> ${submission['Reward Amount']?.toFixed(2) || 'TBD'}
                </p>
                <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  <span style={{ color: '#94a3b8' }}>Status:</span>{' '}
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: submission.Status === 'Pending Review' ? 'rgba(202, 138, 4, 0.2)' :
                              submission.Status === 'Approved' ? 'rgba(34, 197, 94, 0.2)' :
                              'rgba(239, 68, 68, 0.2)',
                    color: submission.Status === 'Pending Review' ? '#fcd34d' :
                          submission.Status === 'Approved' ? '#86efac' :
                          '#fca5a5'
                  }}>
                    {submission.Status}
                  </span>
                </p>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  setSelectedSubmission(submission);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(124, 58, 237, 0.2)',
                  color: '#c4b5fd',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {submission.Status === 'Pending Review' ? '⚡ Review' : '👁️ View'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 50
        }}>
          <div style={{
            background: '#1e293b',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #334155'
          }}>
            {/* Modal Header */}
            <div style={{
              borderBottom: '1px solid #334155',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'rgba(30, 41, 59, 0.9)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px', color: '#cbd5e1' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Video URL</label>
                <a
                  href={selectedSubmission['Video URL']}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#a78bfa', wordBreak: 'break-all' }}
                >
                  🎬 {selectedSubmission['Video URL']}
                </a>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Submission ID</label>
                <p style={{ fontFamily: 'monospace', color: '#fff' }}>{selectedSubmission['Submission ID']}</p>
              </div>

              {selectedSubmission.Caption && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Caption</label>
                  <p style={{ color: '#cbd5e1' }}>{selectedSubmission.Caption}</p>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Status</label>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  background: selectedSubmission.Status === 'Pending Review' ? 'rgba(202, 138, 4, 0.2)' :
                            selectedSubmission.Status === 'Approved' ? 'rgba(34, 197, 94, 0.2)' :
                            'rgba(239, 68, 68, 0.2)',
                  color: selectedSubmission.Status === 'Pending Review' ? '#fcd34d' :
                        selectedSubmission.Status === 'Approved' ? '#86efac' :
                        '#fca5a5'
                }}>
                  {selectedSubmission.Status}
                </span>
              </div>

              {selectedSubmission.Status === 'Pending Review' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Reward Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rewardAmount}
                    onChange={e => setRewardAmount(e.target.value)}
                    placeholder="e.g., 25.00"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#334155',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              {selectedSubmission.Status === 'Pending Review' && (
                <div style={{ display: 'flex', gap: '12px', paddingTop: '20px' }}>
                  <button
                    onClick={handleApprove}
                    disabled={!rewardAmount}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: rewardAmount ? '#22c55e' : '#6b7280',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: rewardAmount ? 'pointer' : 'not-allowed',
                      fontSize: '14px'
                    }}
                  >
                    ✓ Approve & Pay
                  </button>
                  <button
                    onClick={handleReject}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
