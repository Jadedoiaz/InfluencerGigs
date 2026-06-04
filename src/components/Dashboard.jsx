import React, { useState, useEffect, useCallback } from 'react';

const API = 'https://influencer-gig-api-production.up.railway.app';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('submissions');
  const [submitting, setSubmitting] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState('');
  const [stripeConnectUrl, setStripeConnectUrl] = useState('');

  const token = localStorage.getItem('token');

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(API + '/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setUser(data);
      setStripeAccountId(data.stripeAccountId || '');
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }, [token]);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch(API + '/api/my-submissions', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  }, [token]);

  const fetchPayouts = useCallback(async () => {
    try {
      const res = await fetch(API + '/api/my-payouts', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setPayouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching payouts:', err);
    }
  }, [token]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(API + '/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUser();
      await fetchSubmissions();
      await fetchPayouts();
      await fetchProducts();
      setLoading(false);
    };
    loadData();
  }, [fetchUser, fetchSubmissions, fetchPayouts, fetchProducts]);

  const handleSubmitContent = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !videoUrl) {
      setMessage({ type: 'error', text: 'Product and video URL are required' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(API + '/api/submit-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ productId: selectedProduct, videoUrl, caption })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Content submitted successfully!' });
        setSelectedProduct('');
        setVideoUrl('');
        setCaption('');
        fetchSubmissions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Submission failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    totalSubmissions: submissions.length,
    approvedSubmissions: submissions.filter(s => s.Status === 'Approved').length,
    totalEarnings: submissions
      .filter(s => s.Status === 'Approved' && s['Reward Amount'])
      .reduce((sum, s) => sum + (s['Reward Amount'] || 0), 0),
    totalPaidOut: payouts
      .filter(p => p.Status === 'Completed')
      .reduce((sum, p) => sum + (p['Total Amount'] || 0), 0)
  };

  if (loading) {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            Welcome, {user?.displayName}! 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage your submissions and earnings</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Submissions</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.totalSubmissions}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Approved</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{stats.approvedSubmissions}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Earnings</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>${stats.totalEarnings.toFixed(2)}</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Paid Out</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>${stats.totalPaidOut.toFixed(2)}</p>
          </div>
        </div>

        {/* Stripe Connection Card */}
        <div style={{ background: stripeAccountId ? '#ecfdf5' : '#fef3c7', border: '1px solid ' + (stripeAccountId ? '#a7f3d0' : '#fcd34d'), borderRadius: '10px', padding: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                {stripeAccountId ? '✅ Stripe Account Connected' : '⚠️ Stripe Account Not Connected'}
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                {stripeAccountId 
                  ? `Account ID: ${stripeAccountId.substr(0, 8)}...` 
                  : 'Connect your Stripe account to receive payouts'}
              </p>
            </div>
            {!stripeAccountId && (
              <button
                onClick={() => alert('Stripe Connect onboarding coming soon! For now, ask admin to set your account.')}
                style={{
                  padding: '10px 20px',
                  background: '#7c3aed',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Connect Stripe
              </button>
            )}
          </div>
        </div>

        {/* Message */}
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

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'submissions' ? '2px solid #7c3aed' : 'none',
              color: activeTab === 'submissions' ? '#7c3aed' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            My Submissions
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'payouts' ? '2px solid #7c3aed' : 'none',
              color: activeTab === 'payouts' ? '#7c3aed' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Payouts
          </button>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'create' ? '2px solid #7c3aed' : 'none',
              color: activeTab === 'create' ? '#7c3aed' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Create Content
          </button>
        </div>

        {/* Tab: My Submissions */}
        {activeTab === 'submissions' && (
          <div>
            {submissions.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 20px' }}>No submissions yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {submissions.map((sub) => (
                  <div key={sub.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                          {sub['Product Name'] || 'Unknown Product'}
                        </p>
                        {sub.Caption && <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{sub.Caption}</p>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#fff',
                          background: sub.Status === 'Approved' ? '#10b981' : sub.Status === 'Rejected' ? '#ef4444' : '#f59e0b'
                        }}>
                          {sub.Status || 'Pending'}
                        </span>
                        {sub.Status === 'Approved' && sub['Reward Amount'] && (
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#10b981', marginTop: '8px' }}>
                            💰 ${sub['Reward Amount'].toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Payouts */}
        {activeTab === 'payouts' && (
          <div>
            {payouts.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 20px' }}>No payouts yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {payouts.map((payout) => (
                  <div key={payout.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                          {payout['Payout ID']}
                        </p>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>
                          {new Date(payout['Payout Date']).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#7c3aed', marginBottom: '4px' }}>
                          ${payout['Total Amount'].toFixed(2)}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#fff',
                          background: payout.Status === 'Completed' ? '#10b981' : payout.Status === 'Failed' ? '#ef4444' : '#f59e0b'
                        }}>
                          {payout.Status}
                        </span>
                      </div>
                    </div>
                    {payout.Notes && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>📝 {payout.Notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Create Content */}
        {activeTab === 'create' && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>Create New Submission</h3>

            <form onSubmit={handleSubmitContent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Product *
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                >
                  <option value="">Select a product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p['Product Name']}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Video URL *
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe your video content..."
                  rows={4}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px',
                  background: submitting ? '#9ca3af' : '#7c3aed',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Content'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
