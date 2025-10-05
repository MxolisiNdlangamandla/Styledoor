import React, { useState } from "react"; // Import React and useState hook for state management
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for programmatic routing
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// SignupForm component for both Client and Provider registration
function SignupForm({ role = "Client" }) {
  const navigate = useNavigate(); // Hook to navigate after successful signup
  
  // State for all form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });
  
  // State for error messages
  const [error, setError] = useState("");
  // State for loading status during API calls
  const [loading, setLoading] = useState(false);

  // Handles input changes and updates form state
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError("");
  }

  // Client-side form validation
  function validateForm() {
    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password'];
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
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

  // Handles form submission with error handling and API call
  async function handleSubmit(e) {
    e.preventDefault(); // Prevents default form reload
    
    // Clear previous errors
    setError("");
    
    // Validate form before submitting
    if (!validateForm()) return;
    
    // Set loading state
    setLoading(true);
    
    try {
      // Call backend signup API
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          ...form, // Spread all form fields
          role: role.toLowerCase() // Send role (client/provider)
        })
      });
      
      // Parse response data
      const data = await response.json();
      
      // Handle successful signup
      if (response.ok && data.success) {
        // Navigate to login page with success message
        navigate("/login", { 
          state: { 
            message: "Account created successfully! Please log in.",
            email: form.email // Pre-fill email on login page
          }
        });
      } else {
        // Display error message from server
        setError(data.message || `Failed to create ${role.toLowerCase()} account. Please try again.`);
      }
    } catch (err) {
      // Handle network or server errors
      console.error('Signup error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      // Reset loading state regardless of success/failure
      setLoading(false);
    }
  }

  // Renders the signup form UI
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

      {/* Main signup card */}
      <div className="card">
        <h2 className="card-title">Sign Up as {role}</h2>

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

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="form" noValidate>
          <label htmlFor="firstName">First Name</label>
          <input 
            id="firstName"
            name="firstName" 
            value={form.firstName} 
            onChange={handleChange} // Updates firstName in state
            placeholder="Enter first name..." 
            required 
            disabled={loading} // Disable input during loading
            aria-describedby={error ? "error-message" : undefined}
          />

          <label htmlFor="lastName">Last Name</label>
          <input 
            id="lastName"
            name="lastName" 
            value={form.lastName} 
            onChange={handleChange} // Updates lastName in state
            placeholder="Enter last name..." 
            required 
            disabled={loading} // Disable input during loading
          />

          <label htmlFor="email">Email</label>
          <input 
            id="email"
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} // Updates email in state
            placeholder="Enter email..." 
            required 
            disabled={loading} // Disable input during loading
          />

          <label htmlFor="phone">Phone Number</label>
          <input 
            id="phone"
            name="phone" 
            type="tel"
            value={form.phone} 
            onChange={handleChange} // Updates phone in state
            placeholder="Enter phone number..." 
            required 
            disabled={loading} // Disable input during loading
          />

          <label htmlFor="password">Password</label>
          <input 
            id="password"
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} // Updates password in state
            placeholder="Enter password (min 8 characters)..." 
            required 
            disabled={loading} // Disable input during loading
            minLength={8}
          />

          {/* Submit button with loading state */}
          <button 
            type="submit" 
            className="btn submit"
            disabled={loading} // Disable button during loading
            aria-label={loading ? "Creating account..." : "Sign Up"}
          >
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        {/* Footer with login link */}
        <div className="card-footer">
          <span>Already have an account? </span>
          <Link to="/login" aria-label="Go to login page">LOG IN</Link>
        </div>
      </div>
    </>
  );
}

// PropTypes for type checking
SignupForm.propTypes = {
  role: PropTypes.oneOf(['Client', 'Provider']).isRequired // Role must be either Client or Provider
};

// Default props
SignupForm.defaultProps = {
  role: 'Client' // Default to Client if no role is provided
};

export default SignupForm;