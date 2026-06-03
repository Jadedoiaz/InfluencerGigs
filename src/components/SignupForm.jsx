import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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

export default SignupForm;
