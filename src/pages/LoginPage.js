import React, { useState } from "react"; // Import React and useState hook for state management
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for programmatic routing
import PropTypes from 'prop-types'; // Import PropTypes for type checking

function LoginPage({ setUser }) { // Accept setUser prop to update app-level user state
  const navigate = useNavigate(); // Hook to navigate after successful login
  
  // State for form fields: email and password
  const [form, setForm] = useState({ email: "", password: "" });
  // State for error messages
  const [error, setError] = useState("");
  // State for loading status during API calls
  const [loading, setLoading] = useState(false);

  // Handles input changes and updates form state
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Client-side form validation
  function validateForm() {
    // Check if both fields are filled
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return false;
    }
    // Check password minimum length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
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
      // Call backend login API
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });
      
      // Parse response data
      const data = await response.json();
      
      // Handle successful login
      if (response.ok && data.success) {
        // Update app-level user state
        setUser(data.user);
        // Navigate to appropriate dashboard based on user role
        navigate(data.user.role === 'provider' ? '/provider' : '/client');
      } else {
        // Display error message from server
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle network or server errors
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      // Reset loading state regardless of success/failure
      setLoading(false);
    }
  }

  // Renders the login page UI
  return (
    <div className="page-wrapper">
      <div className="container form-page">
        {/* Top section with back link and branding */}
        <div className="card-top">
          <Link to="/" className="back-link" aria-label="Go back to home">←</Link>
          <div className="top-text">
            <div className="small-brand">Welcome to WAASHA</div>
            <div className="small-slogan">The Future Of Service, Today</div>
          </div>
        </div>

        {/* Main login card */}
        <div className="card">
          <h2 className="card-title">Log In</h2>

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

          {/* Login form */}
          <form onSubmit={handleSubmit} className="form" noValidate>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email..."
              value={form.email}
              onChange={handleChange} // Updates email in state
              required
              disabled={loading} // Disable input during loading
              aria-describedby={error ? "error-message" : undefined}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password..."
              value={form.password}
              onChange={handleChange} // Updates password in state
              required
              disabled={loading} // Disable input during loading
              minLength={6}
              aria-describedby={error ? "error-message" : undefined}
            />

            {/* Submit button with loading state */}
            <button 
              className="btn submit" 
              type="submit"
              disabled={loading} // Disable button during loading
              aria-label={loading ? "Logging in..." : "Log In"}
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          {/* Footer with forgot password and signup links */}
          <div className="card-footer">
            <a href="#forgot" aria-label="Reset your password">FORGOT PASSWORD?</a>
            <Link to="/signup-client" aria-label="Create a new account">SIGNUP</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// PropTypes for type checking
LoginPage.propTypes = {
  setUser: PropTypes.func.isRequired // setUser function is required
};

export default LoginPage;