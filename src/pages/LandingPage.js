import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

// Import components
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FooterSmall from "../components/FooterSmall";
import FeaturedServices from "../components/featuredServices";

// ✅ Import logo image
import logo from "../assets/logo.png";

/**
 * LandingPage Component
 * 
 * Main entry point for new users visiting the application.
 * Displays featured services, search functionality, and signup options.
 * Redirects authenticated users to their respective dashboards.
 */
function LandingPage({ isAuthenticated = false, user = null }) {
  const navigate = useNavigate();

  // ============================================
  // EFFECTS
  // ============================================

  // Effect: Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      // Determine dashboard route based on user role/type
      const dashboardRoute = user.role === 'provider' || user.user_type === 'Provider' 
        ? '/provider' 
        : '/client';
      
      console.log(`🔄 Authenticated user detected, redirecting to ${dashboardRoute}`);
      navigate(dashboardRoute);
    }
  }, [isAuthenticated, user, navigate]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle search functionality
   * @param {string} query - Search query entered by user
   */
  function handleSearch(query) {
    if (isAuthenticated) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate(`/signup-client?service=${encodeURIComponent(query)}`);
    }
  }

  /**
   * Handle service card click from FeaturedServices component
   * @param {Object} service - Service object that was clicked
   */
  function handleServiceClick(service) {
    if (isAuthenticated) {
      navigate(`/service/${service.id}`);
    } else {
      navigate(`/signup-client?service=${encodeURIComponent(service.title)}`);
    }
  }

  /**
   * Handle client signup button click
   */
  function handleClientSignup() {
    navigate('/signup-client');
  }

  /**
   * Handle provider signup button click
   */
  function handleProviderSignup() {
    navigate('/signup-provider');
  }

  // ============================================
  // RENDER JSX
  // ============================================

  return (
    <div className="page-wrapper">
      <div className="container landing">
        
        {/* ============================================
            LOGO & BRANDING SECTION
            ============================================ */}
        
        <div className="landing-logo-section">
          {/* Logo Container */}
          <div className="landing-logo-container">
            {/* ✅ Use actual logo image from assets folder */}
            <img 
              src={logo} 
              alt="Waasha Logo" 
              className="landing-logo-image"
            />
          </div>
          
          {/* Brand Name */}
          <h1 className="landing-brand-name">WAASHA</h1>
          
          {/* Tagline */}
          <p className="landing-brand-tagline">The Future Of Service, Today</p>
        </div>
    
        {/* ============================================
            FEATURED SERVICES SECTION
            ============================================ */}
        
        <FeaturedServices 
          onServiceClick={handleServiceClick}
          isAuthenticated={isAuthenticated}
        />

        {/* ============================================
            SEARCH BAR SECTION
            ============================================ */}
        
        <SearchBar 
          onSearch={handleSearch}
          placeholder="What service do you need?"
          variant="large"
          autoFocus={false}
        />

        {/* ============================================
            VALUE PROPOSITION TEXT
            ============================================ */}
        
        <p 
          className="lead"
          style={{
            textAlign: 'center',
            lineHeight: '1.6',
            color: 'var(--muted)',
            margin: '24px 0 32px 0',
            fontSize: '15px'
          }}
        >
          Discover a smarter way to connect with reliable local service providers.
          Whether you're at home or on the go, get things done effortlessly with
          vetted professionals at your fingertips.
        </p>

        {/* ============================================
            CALL-TO-ACTION BUTTONS
            ============================================ */}
        
        <div 
          className="actions"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            margin: '32px 0 24px 0'
          }}
        >
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

        {/* ============================================
            FEATURES SECTION
            ============================================ */}
        
        <div style={{ margin: '32px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px',
            textAlign: 'center'
          }}>
            
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                margin: '0 0 4px 0',
                color: 'var(--text-primary)' 
              }}>
                Fast Booking
              </h4>
              <p style={{ 
                fontSize: '12px', 
                color: 'var(--muted)', 
                margin: 0 
              }}>
                Book services in seconds
              </p>
            </div>
            
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                margin: '0 0 4px 0',
                color: 'var(--text-primary)' 
              }}>
                Verified Pros
              </h4>
              <p style={{ 
                fontSize: '12px', 
                color: 'var(--muted)', 
                margin: 0 
              }}>
                All providers are vetted
              </p>
            </div>
            
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                margin: '0 0 4px 0',
                color: 'var(--text-primary)' 
              }}>
                Fair Pricing
              </h4>
              <p style={{ 
                fontSize: '12px', 
                color: 'var(--muted)', 
                margin: 0 
              }}>
                Transparent, competitive rates
              </p>
            </div>
            
          </div>
        </div>

        {/* ============================================
            FOOTER - LOGIN LINK
            ============================================ */}
        
        <FooterSmall 
          text="ALREADY HAVE AN ACCOUNT?"
          linkText="LOG IN"
          linkTo="/login"
        />
        
      </div>
    </div>
  );
}

// ============================================
// PROPTYPES VALIDATION
// ============================================

LandingPage.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    role: PropTypes.oneOf(['client', 'provider']),
    user_type: PropTypes.oneOf(['Client', 'Provider'])
  })
};

LandingPage.defaultProps = {
  isAuthenticated: false,
  user: null
};

export default LandingPage;