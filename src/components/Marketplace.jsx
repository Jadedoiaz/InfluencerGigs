import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Beauty', 'Wellness', 'Lifestyle', 'Tech', 'Fashion', 'Home', 'Health', 'Fitness', 'Pets'];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();

    const onScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://influencer-gig-api-production.up.railway.app/api/products');
      const data = await res.json();
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateContent = (product) => {
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/dashboard', { state: { selectedProduct: product } });
  };

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => {
        const cat = p.Category;
        if (!cat) return false;
        if (typeof cat === 'object' && cat.name) return cat.name === activeCategory;
        return cat === activeCategory;
      });

  const getCategoryCount = (cat) => {
    if (cat === 'All') return products.length;
    return products.filter(p => {
      const c = p.Category;
      if (!c) return false;
      if (typeof c === 'object' && c.name) return c.name === cat;
      return c === cat;
    }).length;
  };

  if (loading) {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: '#ef4444', fontSize: '16px' }}>{error}</p>
        <button onClick={fetchProducts} style={{ padding: '10px 20px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Marketplace</h1>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>Browse products and create content to earn</p>
        </div>

        {/* Category Filters */}
        <div style={{ marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: isActive ? '2px solid #7c3aed' : '1px solid #d1d5db',
                  background: isActive ? '#7c3aed' : '#ffffff',
                  color: isActive ? '#ffffff' : '#374151',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat} {count > 0 ? '(' + count + ')' : ''}
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
          Showing {filteredProducts.length} of {products.length} products
          {activeCategory !== 'All' ? ' in ' + activeCategory : ''}
        </p>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
            <p style={{ color: '#374151', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No products in this category</p>
            <button
              onClick={() => setActiveCategory('All')}
              style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((product) => {
              const categoryName = product.Category
                ? (typeof product.Category === 'object' ? product.Category.name : product.Category)
                : null;

              return (
                <div
                  key={product.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ aspectRatio: '1', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {product['Image URL'] ? (
                      <img
                        src={product['Image URL']}
                        alt={product['Product Name'] || 'Product'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span style={{ fontSize: '40px' }}>📦</span>
                    )}
                  </div>

                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '6px', lineHeight: '1.3' }}>
                      {product['Product Name']}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#10b981', fontWeight: '600', marginBottom: '4px' }}>
                      ${product.Price ? product.Price.toFixed(2) : 'N/A'}
                    </p>
                    {categoryName && (
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        background: '#f3f4f6',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#6b7280',
                        fontWeight: '500',
                        marginBottom: '10px'
                      }}>
                        {categoryName}
                      </span>
                    )}

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {product['Affiliate Link'] && (
                        <a
                          href={product['Affiliate Link']}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#7c3aed',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            textAlign: 'center'
                          }}
                        >
                          View Product
                        </a>
                      )}
                      <button
                        onClick={() => handleCreateContent(product)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Create Content
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
            zIndex: 50
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}
