import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Analytics } from '@vercel/analytics/react';

// Import components
import Marketplace from './components/Marketplace';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

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
          <button onClick={() => setPage('admin')} className={page === 'admin' ? 'active' : ''}>
            🔧 Admin
          </button>
        </nav>
      </header>

      <main className="content">
        {page === 'marketplace' && <Marketplace products={products} loading={loading} />}
        {page === 'signup' && <SignupForm />}
        {page === 'dashboard' && <Dashboard />}
        {page === 'admin' && <AdminDashboard />}
      </main>
      <Analytics />
    </div>
  );
}

export default App;
