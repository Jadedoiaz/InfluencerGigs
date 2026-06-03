import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [page, setPage] = useState('marketplace');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🎬 InfluencerGig</h1>
        <nav>
          <button onClick={() => setPage('marketplace')} className={page === 'marketplace' ? 'active' : ''}>
            Marketplace
          </button>
          <button onClick={() => setPage('signup')} className={page === 'signup' ? 'active' : ''}>
            Sign Up as Creator
          </button>
          <button onClick={() => setPage('dashboard')} className={page === 'dashboard' ? 'active' : ''}>
            Dashboard
          </button>
        </nav>
      </header>

      <main className="content">
        {page === 'marketplace' && <Marketplace products={products} loading={loading} />}
        {page === 'signup' && <SignupForm />}
        {page === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}

// Marketplace Page
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

// Creator Signup
function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    niche: '',
    followerCount: 0,
    socialLinks: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'followerCount' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/influencers/register`, formData);
      console.log('Registration successful:', response.data);
      setSubmitted(true);
      setFormData({
        email: '',
        username: '',
        displayName: '',
        niche: '',
        followerCount: 0,
        socialLinks: ''
      });
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="signup">
      <h2>Become a Creator</h2>
      <p className="subtitle">Create UGC videos and earn up to $50 per video</p>

      {submitted ? (
        <div className="success-message">
          <h3>✅ Welcome aboard!</h3>
          <p>Your account has been created. Check your email for next steps.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="displayName"
            placeholder="Display name"
            value={formData.displayName}
            onChange={handleChange}
            required
          />
          <select name="niche" value={formData.niche} onChange={handleChange} required>
            <option value="">Select your niche</option>
            <option value="Beauty">Beauty</option>
            <option value="Fitness">Fitness</option>
            <option value="Wellness">Wellness</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            name="followerCount"
            placeholder="Follower count (all platforms combined)"
            value={formData.followerCount}
            onChange={handleChange}
          />
          <input
            type="url"
            name="socialLinks"
            placeholder="Link to your main social profile"
            value={formData.socialLinks}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>
      )}
    </div>
  );
}

// Creator Dashboard
function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    // TODO: Load submissions for logged-in creator
    setSubmissions([
      { id: 1, product: 'Skincare Serum', status: 'Approved', reward: 25 },
      { id: 2, product: 'Workout Protein', status: 'Pending', reward: 0 }
    ]);
    setEarnings(25);
  }, []);

  return (
    <div className="dashboard">
      <h2>Your Dashboard</h2>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="stat-value">${earnings.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Videos Submitted</h3>
          <p className="stat-value">{submissions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p className="stat-value">{submissions.filter(s => s.status === 'Approved').length}</p>
        </div>
      </div>

      <h3>Your Submissions</h3>
      {submissions.length === 0 ? (
        <p>No submissions yet. Start creating videos to earn!</p>
      ) : (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub.id}>
                <td>{sub.product}</td>
                <td><span className={`status-${sub.status.toLowerCase()}`}>{sub.status}</span></td>
                <td>${sub.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
