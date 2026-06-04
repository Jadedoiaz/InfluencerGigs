import React, { useState, useEffect, useCallback } from 'react';

const API = 'https://influencer-gig-api-production.up.railway.app';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveModal, setApproveModal] = useState(null);
  const [rewardAmount, setRewardAmount] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const token = localStorage.getItem('token');

  const fetchSubmissions = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch(API + '/api/submissions', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleApprove = async () => {
    if (!rewardAmount || parseFloat(rewardAmount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid reward amount' });
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      const res = await fetch(API + '/api/admin/approve-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          submissionId: approveModal.id,
          rewardAmount: parseFloat(rewardAmount)
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `✅ Submission approved! Creator will receive $${rewardAmount}` });
        setApproveModal(null);
        setRewardAmount('');
        fetchSubmissions(false); // Refresh silently in background
      } else {
        setMessage({ type: 'error', text: data.error || 'Approval failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    setMessage(null);

    try {
      const res = await fetch(API + '/api/admin/reject-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          submissionId: rejectModal.id,
          adminNotes: rejectionReason
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Submission rejected' });
        setRejectModal(null);
        setRejectionReason('');
        fetchSubmissions(false); // Refresh silently in background
      } else {
        setMessage({ type: 'error', text: data.error || 'Rejection failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#10b981';
      case 'Rejected': return '#ef4444';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredSubmissions = activeFilter === 'All'
    ? submissions
    : submissions.filter(s => s.Status === activeFilter);

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.Status === 'Pending').length,
    approved: submissions.filter(s => s.Status === 'Approved').length,
    totalPaid: submissions
      .filter(s => s.Status === 'Approved' && s['Reward Amount'])
      .reduce((sum, s) => sum + (s['Reward Amount'] || 0), 0)
  };

  if (loading) {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Review and approve creator submissions</p>
        </div>

        {/* Messages */}
        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            border: message.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca'
          }}>
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Total</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.total}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Pending</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pending}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Approved</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{stats.approved}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Total Paid</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>${stats.totalPaid.toFixed(2)}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: activeFilter === status ? '2px solid #7c3aed' : '1px solid #d1d5db',
                background: activeFilter === status ? '#7c3aed' : '#fff',
                color: activeFilter === status ? '#fff' : '#374151',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#6b7280' }}>No submissions to display</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  {/* Submission Info */}
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                      {sub['Submission ID']} - {sub['Product Name'] || 'Unknown Product'}
                    </p>
                    {sub.Caption && (
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{sub.Caption}</p>
                    )}
                    {sub['Video URL'] && (
                      <a href={sub['Video URL']} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#7c3aed' }}>
                        View Video
                      </a>
                    )}
                  </div>

                  {/* Status & Amount */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#fff',
                      background: getStatusColor(sub.Status),
                      marginBottom: '8px'
                    }}>
                      {sub.Status || 'Pending'}
                    </span>

                    {sub.Status === 'Approved' && sub['Reward Amount'] && (
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#10b981', marginTop: '4px' }}>
                        💰 ${sub['Reward Amount'].toFixed(2)}
                      </p>
                    )}

                    {sub.Status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        <button
                          onClick={() => {
                            setApproveModal(sub);
                            setRewardAmount('');
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectModal(sub);
                            setRejectionReason('');
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {sub['Admin Notes'] && (
                  <div style={{ marginTop: '12px', padding: '10px', background: '#f9fafb', borderRadius: '6px', fontSize: '13px', color: '#4b5563' }}>
                    <strong>Admin Note:</strong> {sub['Admin Notes']}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {approveModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '28px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              Approve Submission
            </h2>

            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
              {approveModal['Submission ID']}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Reward Amount ($) *
              </label>
              <input
                type="number"
                placeholder="e.g. 50.00"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                min="0"
                step="0.01"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setApproveModal(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: processing ? '#9ca3af' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: processing ? 'not-allowed' : 'pointer'
                }}
              >
                {processing ? 'Processing...' : 'Approve & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '28px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              Reject Submission
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Feedback (optional)
              </label>
              <textarea
                placeholder="Why was this rejected?"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setRejectModal(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: processing ? '#9ca3af' : '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: processing ? 'not-allowed' : 'pointer'
                }}
              >
                {processing ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
