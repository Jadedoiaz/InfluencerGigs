import React, { useState, useEffect } from 'react';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchProducts();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://influencer-gig-api-production.up.railway.app/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#fff', padding: '40px 20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>🎬 Marketplace</h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Discover amazing products to create content with</p>
          <button 
            onClick={fetchProducts}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Refresh Products
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <p style={{ color: '#cbd5e1', fontSize: '16px' }}>Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '8px', padding: '20px', color: '#fca5a5', textAlign: 'center' }}>
            <p>{error}</p>
            <button 
              onClick={fetchProducts}
              style={{ marginTop: '10px', padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
            <p style={{ color: '#cbd5e1', fontSize: '16px' }}>No products available yet</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Product Image */}
                <div style={{ aspectRatio: '1', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {product['Image URL'] ? (
                    <img
                      src={product['Image URL']}
                      alt={product['Product Name']}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '48px' }}>📦</div>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#e2e8f0' }}>
                    {product['Product Name']}
                  </h3>

                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                      💰 <span style={{ fontWeight: '600', color: '#10b981' }}>${product.Price?.toFixed(2) || 'N/A'}</span>
                    </p>
                    {product.Category && (
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                        🏷️ {product.Category}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product['Affiliate Link'] && (
                      <a
                        href={product['Affiliate Link']}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#7c3aed',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textAlign: 'center',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        View Product
                      </a>
                    )}
                    {localStorage.getItem('token') && (
                      <button
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#334155',
                          color: '#cbd5e1',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Create Content
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
            zIndex: 50,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
