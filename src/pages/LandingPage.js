import React, { useState, useEffect } from "react"; // Import React hooks for state management
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate for navigation
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// Import components
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import SearchBar from "../components/SearchBar";
import FooterSmall from "../components/FooterSmall";

// LandingPage component - main entry point for new users
function LandingPage({ isAuthenticated = false, user = null }) {
  const navigate = useNavigate(); // Hook for programmatic navigation
  
  // State for featured services
  const [featuredServices, setFeaturedServices] = useState([]);
  // State for loading featured services
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);

  // Default services to show if API fails
  const defaultServices = [
    { id: 1, title: "Hair Styling", icon: "💇‍♀️" },
    { id: 2, title: "Car Wash", icon: "🚗" },
    { id: 3, title: "Barber", icon: "✂️" },
    /*{ id: 4, title: "Cleaning", icon: "🧹" },
    { id: 5, title: "Plumbing", icon: "🔧" },
    { id: 6, title: "Beauty", icon: "💄" }*/
  ];

  // Fetch featured services on component mount
  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = user.role === 'provider' ? '/provider' : '/client';
      navigate(dashboardRoute);
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch featured services from backend
  async function fetchFeaturedServices() {
    try {
      const response = await fetch('http://localhost:5000/api/services/featured');
      
      if (response.ok) {
        const data = await response.json();
        setFeaturedServices(data.services || defaultServices);
      } else {
        // Use default services if API call fails
        setFeaturedServices(defaultServices);
      }
    } catch (err) {
      console.error('Failed to fetch featured services:', err);
      // Use default services as fallback
      setFeaturedServices(defaultServices);
    } finally {
      setLoading(false);
    }
  }

  // Handle search functionality
  function handleSearch(query) {
    if (isAuthenticated) {
      // Navigate to search results if user is logged in
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      // Redirect to signup if user is not logged in
      navigate(`/signup-client?service=${encodeURIComponent(query)}`);
    }
  }

  // Handle service card click
  function handleServiceClick(service) {
    if (isAuthenticated) {
      // Navigate to service details if user is logged in
      navigate(`/service/${service.id}`);
    } else {
      // Redirect to signup if user is not logged in
      navigate(`/signup-client?service=${encodeURIComponent(service.title)}`);
    }
  }

  // Handle client signup button click
  function handleClientSignup() {
    navigate('/signup-client');
  }

  // Handle provider signup button click
  function handleProviderSignup() {
    navigate('/signup-provider');
  }

  // Main landing page render
  return (
    <div className="page-wrapper">
      <div className="container landing">
        {/* Header with logo and branding */}
        <Header 
          variant="default"
          showLogo={true}
        />

        {/* Featured services section */}
        <div 
          className="services-row"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: '12px',
            margin: '20px 0'
          }}
        >
          {loading ? (
            // Show loading state for services
            Array.from({ length: 6 }).map((_, index) => (
              <ServiceCard 
                key={index}
                title="Loading..."
                isLoading={true}
              />
            ))
          ) : (
            // Display featured services
            featuredServices.slice(0, 6).map(service => (
              <ServiceCard 
                key={service.id}
                title={service.title}
                image={service.image}
                onClick={() => handleServiceClick(service)}
              />
            ))
          )}
        </div>

        {/* Search bar */}
        <SearchBar 
          onSearch={handleSearch}
          placeholder="What service do you need?"
          variant="large"
          autoFocus={false}
        />

        {/* Value proposition text */}
        <p 
          className="lead"
          style={{
            textAlign: 'center',
            lineHeight: '1.6',
            color: 'var(--muted)',
            margin: '24px 0 32px 0'
          }}
        >
          Discover a smarter way to connect with reliable local service providers.
          Whether you're at home or on the go, get things done effortlessly with
          vetted professionals at your fingertips.
        </p>

        {/* Call-to-action buttons */}
        <div 
          className="actions"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            margin: '32px 0 24px 0'
          }}
        >
          {/* Client signup button */}
          <button 
            className="btn primary"
            onClick={handleClientSignup}
            style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: '600'
            }}
            aria-label="Sign up as a client to book services"
          >
            JOIN AS A CLIENT
          </button>
          
          {/* Provider signup button */}
          <button 
            className="btn outline"
            onClick={handleProviderSignup}
            style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: '600'
            }}
            aria-label="Sign up as a service provider"
          >
            JOIN AS A PROVIDER
          </button>
        </div>

        {/* Features section */}
        <div style={{ margin: '32px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px',
            textAlign: 'center'
          }}>
            {/* Feature 1 */}
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                Fast Booking
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                Book services in seconds
              </p>
            </div>
            
            {/* Feature 2 */}
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                Verified Pros
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                All providers are vetted
              </p>
            </div>
            
            {/* Feature 3 */}
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                Fair Pricing
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                Transparent, competitive rates
              </p>
            </div>
          </div>
        </div>

        {/* Login link footer */}
        <FooterSmall 
          text="ALREADY HAVE AN ACCOUNT?"
          linkText="LOG IN"
          linkTo="/login"
        />
      </div>
    </div>
  );
}

// PropTypes for type checking
LandingPage.propTypes = {
  isAuthenticated: PropTypes.bool, // Authentication status
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    role: PropTypes.oneOf(['client', 'provider'])
  }) // User object if authenticated
};

// Default props
LandingPage.defaultProps = {
  isAuthenticated: false,
  user: null
};

export default LandingPage;