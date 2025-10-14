import React, { useState, useEffect } from "react"; // Import React hooks for state management
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import navigation components
import ChooseServicesForm from "../components/ChooseServicesForm"; // Import your updated component

/**
 * ChooseServices Page Component
 * 
 * This page serves as the wrapper/layout for the ChooseServices functionality.
 * It provides:
 * - Header with navigation and branding
 * - Welcome messages from previous pages (like registration)
 * - The ChooseServicesForm component
 * - Consistent styling and layout
 * 
 * Flow: Registration → Choose Services Page → Provider Dashboard
 */
function ChooseServices() {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const location = useLocation(); // Hook to access passed state/messages from previous pages
  
  // State for managing welcome/success messages passed from registration
  const [welcomeMessage, setWelcomeMessage] = useState("");
  
  // State for current user data (for header display and validation)
  const [user, setUser] = useState(null);

  /**
   * Page Initialization
   * 
   * Runs when page loads to:
   * - Get user data from localStorage (set during registration)
   * - Display welcome message if passed from registration page
   * - Redirect unauthorized users
   */
  useEffect(() => {
    // Get user data from localStorage (stored during registration/login)
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      console.log('👤 Choose Services page loaded for user:', parsedUser.username);
    } else {
      // No user found - redirect to login
      console.log('❌ No user found, redirecting to login');
      navigate('/login');
      return;
    }

    // Display welcome message if passed from registration page
    if (location.state?.message) {
      setWelcomeMessage(location.state.message);
      console.log('💬 Welcome message received:', location.state.message);
      
      // Auto-hide welcome message after 5 seconds
      setTimeout(() => {
        setWelcomeMessage("");
      }, 5000);
    }
  }, [navigate, location.state]);

  /**
   * Handle Back Navigation
   * 
   * Custom back button handler that provides appropriate navigation
   * based on user state and registration flow.
   */
  const handleBackClick = () => {
    // For providers in registration flow, go back to signup
    if (user?.user_type === 'Provider') {
      navigate('/signup-provider');
    } else {
      // For other cases, go to home
      navigate('/');
    }
  };

  // Show loading while user data is being loaded
  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading...</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Setting up your service selection</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render Choose Services Page
   * 
   * Returns the complete page layout with:
   * - Header with back navigation and branding
   * - Welcome message display
   * - The ChooseServicesForm component
   * - Consistent page styling
   */
  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* Page Header Section */}
        <div className="choose-services-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '20px'
        }}>
          
          {/* Back Button */}
          <button 
            onClick={handleBackClick}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            aria-label="Go back to previous page"
          >
            ← Back
          </button>

          {/* Page Title/Branding */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: '#1976d2'
            }}>
              Waasha
            </h1>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '2px'
            }}>
              Service Provider Setup
            </div>
          </div>

          {/* User Info Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {/* Display first letter of username */}
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>{user.username}</span>
          </div>
        </div>

        {/* Welcome Message Display - Shows success message from registration */}
        {welcomeMessage && (
          <div style={{
            backgroundColor: '#e8f5e8',
            color: '#2e7d2e',
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px',
            border: '1px solid #c3e6c3',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>🎉</span>
            <div>
              <strong>Welcome to Waasha!</strong>
              <br />
              {welcomeMessage}
            </div>
          </div>
        )}

        {/* Provider Registration Progress Indicator */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '16px 20px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ fontWeight: '600', color: '#495057' }}>Setup Progress</span>
            <span style={{ fontSize: '12px', color: '#6c757d' }}>Step 2 of 3</span>
          </div>
          
          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              width: '24px',
              height: '4px',
              backgroundColor: '#28a745',
              borderRadius: '2px'
            }}></div>
            <span style={{ fontSize: '12px', color: '#28a745' }}>✓ Account Created</span>
            
            <div style={{
              width: '24px',
              height: '4px',
              backgroundColor: '#007bff',
              borderRadius: '2px',
              marginLeft: '12px'
            }}></div>
            <span style={{ fontSize: '12px', color: '#007bff' }}>→ Choose Services</span>
            
            <div style={{
              width: '24px',
              height: '4px',
              backgroundColor: '#e9ecef',
              borderRadius: '2px',
              marginLeft: '12px'
            }}></div>
            <span style={{ fontSize: '12px', color: '#6c757d' }}>Dashboard Setup</span>
          </div>
        </div>

        {/* Main Content Area - Your ChooseServicesForm Component */}
        <div className="choose-services-content">
          <ChooseServicesForm />
        </div>

        {/* Footer Information */}
        <div style={{
          marginTop: '40px',
          padding: '20px 0',
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#666',
            lineHeight: '1.5'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Need help?</strong> Contact our support team for assistance with setting up your services.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
              <Link 
                to="/help" 
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none',
                  fontSize: '12px'
                }}
              >
                Help Center
              </Link>
              <Link 
                to="/contact" 
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none',
                  fontSize: '12px'
                }}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page-specific Styles */}
      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 0;
        }
        
        .container {
          max-width: 480px;
          margin: 0 auto;
          background-color: white;
          min-height: 100vh;
          padding: 0 20px;
        }

        .choose-services-content {
          padding: 0;
        }

        /* Responsive design for mobile devices */
        @media (max-width: 768px) {
          .container {
            max-width: 100%;
            padding: 0 16px;
          }
          
          .choose-services-header {
            padding: 12px 0 !important;
          }
          
          .choose-services-header h1 {
            font-size: 18px !important;
          }
        }

        /* Smooth transitions for interactive elements */
        button {
          transition: all 0.2s ease;
        }

        button:hover {
          transform: translateY(-1px);
        }

        /* Loading animation */
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .loading {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Export the page component for use in routing
export default ChooseServices;