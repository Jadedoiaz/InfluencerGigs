import React, { useState } from 'react';

function Marketplace({ products, loading }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Beauty', 'Wellness', 'Lifestyle', 'Health', 'Fitness', 'Fashion', 'Home'];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.Category === selectedCategory);

  return (
    <div className="marketplace">
      <h2>Curated Products for UGC Creation</h2>
      <p className="subtitle">Create videos for these products and earn $10-50 per approved submission</p>

      <div className="filters">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="loading">Loading products...</p>}

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product['Image URL'] || 'https://via.placeholder.com/200'} alt={product['Product Name']} />
            </div>
            <h3>{product['Product Name']}</h3>
            <p className="price">${product.Price?.toFixed(2)}</p>
            <p className="category">{product.Category}</p>
            <a href={product['Affiliate Link']} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              View on Amazon
            </a>
            <button className="btn btn-secondary">Create UGC Video</button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && <p className="empty">No products in this category</p>}
    </div>
  );
}

export default Marketplace;
