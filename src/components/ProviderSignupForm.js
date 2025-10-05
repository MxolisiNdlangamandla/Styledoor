import React, { useState } from "react"; // Import React and useState hook for state management
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for programmatic routing

// SignupFormProvider component for Provider registration only
function SignupFormProvider() {
  const navigate = useNavigate(); // Hook to navigate after successful signup
  
  // State for all form fields (Provider registration)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    // Provider-specific fields (always included)
    businessType: "",
    businessCategory: [] // Changed to array for multiple selections
  });
  
  // State for error messages
  const [error, setError] = useState("");
  // State for loading status during API calls
  const [loading, setLoading] = useState(false);

  // Handles input changes and updates form state
  function handleChange(e) {
    const { name, value } = e.target;
    
    // Handle multiple select for businessCategory
    if (name === 'businessCategory') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setForm(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (error) setError("");
  }

  // Handles checkbox changes for service categories
  function handleCategoryChange(e) {
    const { value, checked } = e.target;
    
    setForm(prev => ({
      ...prev,
      businessCategory: checked 
        ? [...prev.businessCategory, value] // Add category
        : prev.businessCategory.filter(cat => cat !== value) // Remove category
    }));
    
    // Clear error when user makes selection
    if (error) setError("");
  }

  // Client-side form validation for Provider
  function validateForm() {
    // All required fields for Provider registration (including business fields)
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'businessType'];
    
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate business category (at least one must be selected)
    if (!form.businessCategory || form.businessCategory.length === 0) {
      setError("Please select at least one service category");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate phone number (basic validation for digits)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return false;
    }

    // Validate password strength
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Check for at least one number and one letter
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
      setError("Password must contain at least one letter and one number");
      return false;
    }

    return true;
  }

  // Handles Provider form submission with error handling and API call
  async function handleSubmit(e) {
    e.preventDefault(); // Prevents default form reload
    
    // Clear previous errors
    setError("");
    
    // Validate form before submitting
    if (!validateForm()) return;
    
    // Set loading state
    setLoading(true);
    
    try {
      // Step 1: Register basic Provider user account
      const userResponse = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          username: `${form.firstName} ${form.lastName}`,
          email: form.email,
          password: form.password,
          phone_number: form.phone,
          user_type: "Provider" // Always Provider
        })
      });
      
      const userData = await userResponse.json();
      
      if (!userResponse.ok || !userData.success) {
        throw new Error(userData.message || 'Provider registration failed');
      }

      // Step 2: Register Provider business information
      const providerResponse = await fetch('http://localhost:5000/api/provider/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.user.token}`
        },
        body: JSON.stringify({
          provider_name: `${form.firstName} ${form.lastName}`,
          provider_type: form.businessType,
          business_category: form.businessCategory.join(', '), // Convert array to comma-separated string
          location: 'Not specified', // Default value - can be updated later
          contact_info: form.email, // Use email as default contact
          offers_home_request: false,
          offers_walk_in: true,
          offers_drive_in: false
        }),
      });

      const providerData = await providerResponse.json();

      if (!providerResponse.ok || !providerData.success) {
        throw new Error(providerData.message || 'Provider business registration failed');
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      // Navigate to Provider dashboard
      navigate('/provider', {
        state: {
          message: `Welcome to Waasha! Your provider account has been created successfully.`
        }
      });

    } catch (err) {
      // Handle network or server errors
      console.error('Provider signup error:', err);
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      // Reset loading state regardless of success/failure
      setLoading(false);
    }
  }

  // Renders the Provider signup form UI
  return (
    <>
      {/* Top section with back link and branding */}
      <div className="card-top">
        <Link to="/" className="back-link" aria-label="Go back to home">←</Link>
        <div className="top-text">
          <div className="small-brand">Welcome to WAASHA</div>
          <div className="small-slogan">The Future Of Service, Today</div>
        </div>
      </div>

      {/* Main Provider signup card */}
      <div className="card">
        <h2 className="card-title">🚀 Sign Up as Provider</h2>
        <p className="card-subtitle">Start your business journey with us</p>

        {/* Display error message if exists */}
        {error && (
          <div 
            className="error-message" 
            role="alert"
            style={{
              color: 'red', 
              backgroundColor: '#ffe6e6', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '15px',
              fontSize: '14px'
            }}
            aria-live="polite" // Announces error to screen readers
          >
            {error}
          </div>
        )}

        {/* Provider signup form */}
        <form onSubmit={handleSubmit} className="form" noValidate>
          <label htmlFor="firstName">First Name</label>
          <input 
            id="firstName"
            name="firstName" 
            value={form.firstName} 
            onChange={handleChange}
            placeholder="Enter first name..." 
            required 
            disabled={loading}
            aria-describedby={error ? "error-message" : undefined}
          />

          <label htmlFor="lastName">Last Name</label>
          <input 
            id="lastName"
            name="lastName" 
            value={form.lastName} 
            onChange={handleChange}
            placeholder="Enter last name..." 
            required 
            disabled={loading}
          />

          <label htmlFor="email">Email</label>
          <input 
            id="email"
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange}
            placeholder="Enter email..." 
            required 
            disabled={loading}
          />

          <label htmlFor="phone">Phone Number</label>
          <input 
            id="phone"
            name="phone" 
            type="tel"
            value={form.phone} 
            onChange={handleChange}
            placeholder="Enter phone number..." 
            required 
            disabled={loading}
          />

          {/* Provider business fields - always visible */}
          <label htmlFor="businessType">Business Type</label>
          <select 
            id="businessType"
            name="businessType" 
            value={form.businessType} 
            onChange={handleChange}
            required 
            disabled={loading}
          >
            <option value="">Select business type...</option>
            <option value="Individual">Individual</option>
            <option value="Salon">Salon</option>
            <option value="Barbershop">Barbershop</option>
            <option value="Carwash">Carwash</option>
            <option value="Training Center">Training Center</option>
          </select>

          {/* Service Categories - Multiple Selection with Checkboxes */}
          <label>Service Categories (Select all that apply)</label>
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#fafafa',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {[
              { value: "Hairstyling", label: "Hairstyling Services" },
              { value: "Haircut", label: "Haircut Services" },
              { value: "Beauty", label: "Makeup Services" },
              { value: "Nails", label: "Nail Services" },
              { value: "Carwash", label: "Car Wash Services" },
              { value: "Training", label: "Training & Education" },
              { value: "Other", label: "Other Services" }
            ].map((category) => (
              <div key={category.value} style={{ marginBottom: '8px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'normal'
                }}>
                  <input
                    type="checkbox"
                    value={category.value}
                    checked={form.businessCategory.includes(category.value)}
                    onChange={handleCategoryChange}
                    disabled={loading}
                    style={{ 
                      marginRight: '8px',
                      width: '16px',
                      height: '16px'
                    }}
                  />
                  {category.label}
                </label>
              </div>
            ))}
          </div>

          {/* Display selected categories */}
          {form.businessCategory.length > 0 && (
            <div style={{
              backgroundColor: '#e8f5e8',
              color: '#2e7d32',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '13px'
            }}>
              <strong>Selected:</strong> {form.businessCategory.join(', ')}
            </div>
          )}

          {/* Info message for providers */}
          <div 
            style={{
              backgroundColor: '#e8f4fd',
              color: '#1976d2',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '13px',
              border: '1px solid #bbdefb'
            }}
          >
            💡 <strong>Don't worry!</strong> You can add more business details like location and service options later in your provider dashboard.
          </div>

          <label htmlFor="password">Password</label>
          <input 
            id="password"
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange}
            placeholder="Enter password (min 8 characters)..." 
            required 
            disabled={loading}
            minLength={8}
          />

          {/* Submit button with loading state */}
          <button 
            type="submit" 
            className="btn submit"
            disabled={loading}
            aria-label={loading ? "Creating provider account..." : "Sign Up as Provider"}
          >
            {loading ? "CREATING PROVIDER ACCOUNT..." : "🚀 SIGN UP AS PROVIDER"}
          </button>
        </form>

        {/* Footer with navigation links */}
        <div className="card-footer">
          <span>Already have an account? </span>
          <Link to="/login" aria-label="Go to login page">LOG IN</Link>
          <br />
          <span>Want to join as a client? </span>
          <Link to="/signup-client" aria-label="Sign up as client">SIGN UP AS CLIENT</Link>
        </div>
      </div>
    </>
  );
}

export default SignupFormProvider;