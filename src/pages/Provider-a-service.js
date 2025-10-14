import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

/**
 * AddService Page Component
 * 
 * This page allows providers to add a new service to their profile.
 * Providers can input service details like:
 * - Service name/title
 * - Description
 * - Category
 * - Pricing
 * - Availability
 * 
 * Flow: Choose Services → Add Service → Provider Dashboard
 */
function AddService() {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const [user, setUser] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    service_title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    availability: 'available'
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);

  // Initialize page - check authentication
  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Ensure user is a provider
      if (parsedUser.user_type !== 'Provider') {
        console.log('❌ User is not a provider, redirecting...');
        navigate('/client');
        return;
      }
      
      console.log('👤 Add Service page loaded for provider:', parsedUser.username);
    } else {
      console.log('❌ No user found, redirecting to login');
      navigate('/login');
      return;
    }

    // Fetch service categories from backend
    fetchCategories();
  }, [navigate]);

  // Fetch available service categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Use default categories if fetch fails
      setCategories([
        'Cleaning',
        'Plumbing',
        'Electrical',
        'Carpentry',
        'Painting',
        'Gardening',
        'Moving',
        'Tutoring',
        'Beauty & Wellness',
        'Pet Care',
        'Other'
      ]);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    // Validate form data
    if (!formData.service_title || !formData.category || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Submitting new service:', formData);

      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...formData,
          provider_id: user.id
        }),
      });

      const result = await response.json();
      
      console.log('📥 Add service response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to add service');
      }

      console.log('✅ Service added successfully');
      
      setSuccess('Service added successfully! Redirecting to dashboard...');
      
      // Navigate to provider dashboard after short delay
      setTimeout(() => {
        navigate('/provider', {
          state: {
            message: 'Service added successfully!'
          }
        });
      }, 1500);

    } catch (err) {
      console.error('❌ Add service error:', err);
      setError(err.message || 'Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while user data is being loaded
  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* Add Service Form Container */}
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
              <h2 className="form-title">Add a New Service</h2>
              <p className="form-subtitle">Tell clients about the service you offer</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                <span className="alert-message">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span className="alert-message">{error}</span>
              </div>
            )}

            {/* Add Service Form */}
            <form onSubmit={handleSubmit} className="signup-form">
              
              {/* Service Title Field */}
              <div className="form-group">
                <label htmlFor="service_title" className="form-label">
                  Service Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="service_title"
                  name="service_title"
                  value={formData.service_title}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="e.g., Home Cleaning, Plumbing Repair"
                  className="form-input"
                  maxLength="100"
                />
              </div>

              {/* Category Field */}
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Field */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Describe your service, what you offer, and what makes you stand out..."
                  className="form-input"
                  rows="4"
                  maxLength="500"
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginTop: '4px',
                  textAlign: 'right' 
                }}>
                  {formData.description.length}/500 characters
                </div>
              </div>

              {/* Price Field */}
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price (R) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="Starting price in Rands"
                  className="form-input"
                  min="0"
                  step="0.01"
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  💡 You can set your base rate or starting price
                </div>
              </div>

              {/* Duration Field */}
              <div className="form-group">
                <label htmlFor="duration" className="form-label">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="e.g., 2 hours, 1 day, varies"
                  className="form-input"
                />
              </div>

              {/* Availability Field */}
              <div className="form-group">
                <label htmlFor="availability" className="form-label">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-input"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
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
                    Adding Service...
                  </>
                ) : (
                  'Add Service'
                )}
              </button>

              {/* Skip Link */}
              <div className="form-footer">
                <p className="form-footer-text">
                  Want to add more services later?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/provider')}
                    className="link-button"
                    disabled={loading}
                  >
                    Go to Dashboard
                  </button>
                </p>
              </div>

            </form>

            {/* Tips Section */}
            <div className="info-box">
              <strong className="info-box-title">💡 Tips for Success:</strong>
              <ul className="info-box-list">
                <li>Use clear, descriptive service names</li>
                <li>Be specific about what's included</li>
                <li>Set competitive pricing</li>
                <li>Update availability regularly</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AddService;