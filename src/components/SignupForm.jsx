import React, { useState } from 'react';

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    niche: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = () => {
    setError('');
    
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    setStep(2);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.username) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://influencer-gig-api-production.up.railway.app/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          displayName: formData.displayName,
          niche: formData.niche,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      // Success - show confirmation message
      setStep(3);
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '40px', maxWidth: '500px', width: '100%', border: '1px solid #475569' }}>
        {step === 1 && (
          <>
            <h1 style={{ color: '#fff', marginBottom: '10px' }}>🎬 Create Your Account</h1>
            <p style={{ color: '#cbd5e1', marginBottom: '30px' }}>Start earning with InfluencerGig</p>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '6px', padding: '12px', marginBottom: '20px', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              onClick={handleContinue}
              style={{ width: '100%', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              Continue
            </button>

            <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '20px', textAlign: 'center' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '600' }}>Sign in</a>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ color: '#fff', marginBottom: '10px' }}>Complete Your Profile</h1>
            <p style={{ color: '#cbd5e1', marginBottom: '30px' }}>Email: {formData.email}</p>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '6px', padding: '12px', marginBottom: '20px', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Display Name (optional)</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Niche (optional)</label>
                <select
                  name="niche"
                  value={formData.niche}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                >
                  <option value="">Select a niche</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Tech">Tech</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  style={{ width: '100%', padding: '12px', background: '#334155', border: '1px solid #475569', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '12px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ flex: 1, padding: '12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={{ color: '#22c55e', marginBottom: '20px', textAlign: 'center' }}>✅ Signup Successful!</h1>
            <p style={{ color: '#cbd5e1', marginBottom: '20px', textAlign: 'center' }}>
              We've sent a verification email to <strong>{formData.email}</strong>
            </p>
            <p style={{ color: '#cbd5e1', marginBottom: '30px', textAlign: 'center' }}>
              Click the link in the email to verify your account, then you can login.
            </p>
            
            <a href="/login" style={{ display: 'block', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', textAlign: 'center', textDecoration: 'none' }}>
              Go to Login
            </a>

            <p style={{ color: '#64748b', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
              Link expires in 24 hours
            </p>
          </>
        )}
      </div>
    </div>
  );
}
