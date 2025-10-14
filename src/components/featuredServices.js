import React from 'react';
import PropTypes from 'prop-types';

// ============================================
// STATIC FEATURED SERVICES
// ============================================

const FEATURED_SERVICES = [
  { 
    id: 1, 
    title: "Hair Styling", 
    icon: "💇‍♀️",
    category: "Beauty & Wellness" 
  },
  { 
    id: 2, 
    title: "Barber", 
    icon: "✂️",
    category: "Beauty & Wellness" 
  },
  { 
    id: 3, 
    title: "Beauty", 
    icon: "💄",
    category: "Beauty & Wellness" 
  }
];

/**
 * FeaturedServices Component
 * 
 * Displays featured services on the landing page in a grid layout
 * Services are static/hardcoded, not from database
 */
function FeaturedServices({ onServiceClick, isAuthenticated }) {
  
  return (
    <div className="featured-services-section">
      <div className="featured-services-grid">
        {FEATURED_SERVICES.map(service => (
          <div
            key={service.id}
            className="featured-service-card"
            onClick={() => onServiceClick(service)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onServiceClick(service);
              }
            }}
            aria-label={`View ${service.title} services`}
          >
            {/* Service Icon */}
            <div className="featured-service-icon">
              {service.icon}
            </div>
            
            {/* Service Title */}
            <h3 className="featured-service-title">
              {service.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PROPTYPES VALIDATION
// ============================================

FeaturedServices.propTypes = {
  onServiceClick: PropTypes.func.isRequired, // Function to handle service card clicks
  isAuthenticated: PropTypes.bool // Whether user is logged in
};

FeaturedServices.defaultProps = {
  isAuthenticated: false
};

// ============================================
// EXPORT COMPONENT
// ============================================

export default FeaturedServices;