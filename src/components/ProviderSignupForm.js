import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // ✅ Import logo

/**
 * ProviderSignupForm Component
 * 
 * This component handles provider registration and redirects to choose services
 * after successful signup. Updated to integrate with backend API.
 */
function SignupFormProvider() {
  const navigate = useNavigate(); // ✅ Hook for navigation after registration
  
  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    user_type: 'Provider' // ✅ Ensure this is set to Provider
  });

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle form submission - UPDATED FOR BACKEND INTEGRATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    // Validate form data
    if (!formData.username || !formData.email || !formData.password || !formData.phone_number ) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.phone_number.length < 10) {
      setError('Phone number must be at least 10 digits long');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Submitting provider registration:', {
        username: formData.username,
        email: formData.email,
        user_type: formData.user_type
      });

      // Make API call to register provider
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number,
          user_type: formData.user_type // This should be 'Provider'
        }),
      });

      const result = await response.json();
      
      console.log('📥 Registration response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      // Registration successful!
      console.log('✅ Provider registration successful');
      
      // Save user data to localStorage (matches backend format)
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Show success message briefly
      setSuccess('Registration successful! Redirecting to service selection...');
      
      // Navigate to choose services page after short delay
      setTimeout(() => {
        navigate('/choose-services', {
          state: {
            message: `Welcome ${result.user.username}! Registration successful. Now choose your services.`
          }
        });
      }, 1500); // 1.5 second delay to show success message

    } catch (err) {
      console.error('❌ Registration error:', err);
      
      // Handle specific error messages
      if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Please ensure the backend is running.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Backend server is not responding. Please start the server and try again.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form-container">
      <div className="signup-form-card">
        
        {/* Top Navigation: Back Arrow (Left) and Logo (Right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          {/* Back Arrow - Top Left */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#1976d2'}
            onMouseOut={(e) => e.currentTarget.style.color = '#666'}
            aria-label="Go back"
          >
            ← Back
          </button>

          {/* Logo - Top Right */}
          <img 
            src={logo} 
            alt="Waasha Logo" 
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Form Header */}
        <div className="form-header">
          <h2 className="form-title">Join as a Service Provider</h2>
          <p className="form-subtitle">Create your account to start offering services</p>
        </div>

        {/* Success Message Display */}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span className="alert-message">{success}</span>
          </div>
        )}

        {/* Error Message Display */}
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="signup-form">
          
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Business/Provider Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Enter your business or provider name"
              className="form-input"
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Enter your email address"
              className="form-input"
            />
          </div>

          {/* Phone Number Field */}
          <div className="form-group">
            <label htmlFor="phone_number" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Enter your phone number"
              className="form-input"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Create a password (min 6 characters)"
              className="form-input"
              minLength="6"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Confirm your password"
              className="form-input"
              minLength="6"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`btn btn-primary btn-submit ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Provider Account'
            )}
          </button>

          {/* Login Link */}
          <div className="form-footer">
            <p className="form-footer-text">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="link-button"
                disabled={loading}
              >
                Sign In
              </button>
            </p>
          </div>

        </form>

        {/* Next Steps Information */}
        <div className="info-box">
          <strong className="info-box-title">📋 Next Steps:</strong>
          <ol className="info-box-list">
            <li>Complete registration</li>
            <li>Choose services you offer</li>
            <li>Set up your provider profile</li>
            <li>Start receiving bookings!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default SignupFormProvider;