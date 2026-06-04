import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API = 'https://influencer-gig-api-production.up.railway.app';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [activeTab, setActiveTab] = useState('submissions');
  const [submitForm, setSubmitForm] = useState({
    productId: '',
    productName: '',
    videoUrl: '',
    caption: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem('token');

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoadingSubmissions(true);
      const res = await fetch(API + '/api/my-submissions', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [token]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));

    fetchSubmissions();
    fetchProducts();

    if (location.state && location.state.selectedProduct) {
      const p = location.state.selectedProduct;
      setSubmitForm(prev => ({
        ...prev,
        productId: p.id,
        productName: p['Product Name'] || ''
      }));
      setActiveTab('create');
    }
  }, [location.state, fetchSubmissions]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API + '/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitForm.productId || !submitForm.videoUrl) {
      setSubmitMessage({ type: 'error', text: 'Please select a product and enter a video URL' });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch(API + '/api/submit-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          productId: submitForm.productId,
          videoUrl: submitForm.videoUrl,
          caption: submitForm.caption
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitMessage({ type: 'success', text: 'Content submitted successfully! We will review it shortly.' });
        setSubmitForm({ productId: '', productName: '', videoUrl: '', caption: '' });
        fetchSubmissions();
        setTimeout(() => setActiveTab('submissions'), 2000);
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Submission failed' });
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
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

  const totalEarnings = submissions
    .filter(s => s['Reward Amount'] && s.Status === 'Approved')
    .reduce((sum, s) => sum + (s['Reward Amount'] || 0), 0);

  const pendingCount = submissions.filter(s => s.Status === 'Pending').length;
  const approvedCount = submissions.filter(s => s.Status === 'Approved').length;

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            Welcome back, {user ? (user.displayName || user.username) : 'Creator'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{user ? user.email : ''}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Submissions</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{submissions.length}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Approved</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{approvedCount}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Pending Review</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{pendingCount}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Earnings</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed' }}>${totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'submissions' ? '2px solid #7c3aed' : '2px solid transparent',
              color: activeTab === 'submissions' ? '#7c3aed' : '#6b7280',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            My Submissions
          </button>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'create' ? '2px solid #7c3aed' : '2px solid transparent',
              color: activeTab === 'create' ? '#7c3aed' : '#6b7280',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            Create Content
          </button>
        </div>

        {/* Create Content Tab */}
        {activeTab === 'create' && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Submit Your Content</h2>

            {submitMessage && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                background: submitMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: submitMessage.type === 'success' ? '#065f46' : '#991b1b',
                border: submitMessage.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca'
              }}>
                {submitMessage.text}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Product Select */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Select Product *
                </label>
                {submitForm.productName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '10px 14px', background: '#f3f4f6', borderRadius: '6px', fontSize: '14px', color: '#111827', flex: 1 }}>
                      {submitForm.productName}
                    </span>
                    <button
                      onClick={() => setSubmitForm(prev => ({ ...prev, productId: '', productName: '' }))}
                      style={{ padding: '10px 14px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <select
                    value={submitForm.productId}
                    onChange={(e) => {
                      const selected = products.find(p => p.id === e.target.value);
                      setSubmitForm(prev => ({
                        ...prev,
                        productId: e.target.value,
                        productName: selected ? selected['Product Name'] : ''
                      }));
                    }}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#fff', color: '#111827' }}
                  >
                    <option value="">-- Choose a product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p['Product Name']}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Video URL * (YouTube, TikTok, Instagram, etc.)
                </label>
                <input
                  type="url"
                  placeholder="https://www.tiktok.com/@username/video/123456"
                  value={submitForm.videoUrl}
                  onChange={(e) => setSubmitForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Paste the link to your published content</p>
              </div>

              {/* Caption */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Caption / Description
                </label>
                <textarea
                  placeholder="Describe your content, hashtags used, engagement notes..."
                  value={submitForm.caption}
                  onChange={(e) => setSubmitForm(prev => ({ ...prev, caption: e.target.value }))}
                  rows={4}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !submitForm.productId || !submitForm.videoUrl}
                style={{
                  padding: '14px 28px',
                  background: submitting ? '#9ca3af' : '#7c3aed',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Content'}
              </button>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div>
            {loadingSubmissions ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>Loading submissions...</p>
            ) : submissions.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>📝</p>
                <p style={{ color: '#374151', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No submissions yet</p>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Browse the marketplace and create your first content!</p>
                <button
                  onClick={() => navigate('/marketplace')}
                  style={{ padding: '10px 20px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                          {sub['Submission ID'] || 'Submission'}
                        </p>
                        {sub.Caption && (
                          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{sub.Caption}</p>
                        )}
                        {sub['Video URL'] && (
                          <a href={sub['Video URL']} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#7c3aed' }}>
                            View Content
                          </a>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#fff',
                          background: getStatusColor(sub.Status)
                        }}>
                          {sub.Status || 'Pending'}
                        </span>
                        {sub['Reward Amount'] && sub.Status === 'Approved' && (
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#10b981', marginTop: '6px' }}>
                            +${sub['Reward Amount'].toFixed(2)}
                          </p>
                        )}
                        {sub['Submission Date'] && (
                          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                            {new Date(sub['Submission Date']).toLocaleDateString()}
                          </p>
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
        )}
      </div>
    </div>
  );
}
