import React from "react"; // Import React for JSX rendering
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// ServiceCard component displays individual service information
function ServiceCard({ 
  title = "Service", // Service title/name
  image, // Service image URL
  description, // Service description
  price, // Service price
  duration, // Service duration
  rating, // Service rating
  provider, // Service provider name
  isAvailable = true, // Service availability status
  onClick, // Click handler for the card
  variant = "default", // Card variant (default, compact, detailed)
  className = "service-card", // Customizable CSS class
  showPrice = true, // Control price display
  showRating = true, // Control rating display
  isLoading = false // Loading state
}) {

  // Handle card click
  function handleClick() {
    if (onClick && !isLoading) {
      onClick({ title, image, description, price, duration, rating, provider });
    }
  }

  // Handle image load error
  function handleImageError(e) {
    e.target.style.display = 'none'; // Hide broken image
    e.target.nextSibling.style.display = 'flex'; // Show fallback
  }

  // Get card styles based on variant
  function getCardStyles() {
    const baseStyles = {
      width: variant === 'detailed' ? '100%' : '86px',
      textAlign: 'center',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      opacity: isLoading ? 0.6 : 1,
      pointerEvents: isLoading ? 'none' : 'auto'
    };

    if (variant === 'detailed') {
      return {
        ...baseStyles,
        background: '#fff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '16px'
      };
    }

    return baseStyles;
  }

  // Get image container styles
  function getImageStyles() {
    const baseStyles = {
      height: variant === 'detailed' ? '120px' : '86px',
      borderRadius: '12px',
      background: image ? 'transparent' : 'linear-gradient(180deg,#e5e5ec,#f0f7ff)',
      border: '1px solid #e8f1ff',
      boxShadow: '0 6px 14px rgba(14,34,60,0.04)',
      marginBottom: variant === 'detailed' ? '12px' : '8px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    return baseStyles;
  }

  // Renders the service card component
  return (
    <div 
      className={className}
      style={getCardStyles()}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,34,60,0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = variant === 'detailed' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none';
        }
      }}
      role={onClick ? "button" : undefined} // ARIA role for clickable cards
      tabIndex={onClick ? 0 : undefined} // Make clickable cards keyboard accessible
      onKeyDown={(e) => { // Handle keyboard navigation
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Service image container */}
      <div 
        className="service-image" 
        style={getImageStyles()}
      >
        {/* Actual image if provided */}
        {image && (
          <img
            src={image}
            alt={`${title} service`} // Dynamic alt text
            onError={handleImageError} // Handle broken images
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px'
            }}
            loading="lazy" // Optimize loading performance
          />
        )}
        
        {/* Fallback icon/placeholder */}
        <div
          style={{
            display: image ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontSize: variant === 'detailed' ? '32px' : '24px',
            color: 'var(--muted)'
          }}
        >
          🛠️
        </div>

        {/* Availability indicator */}
        {!isAvailable && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(255,0,0,0.8)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600'
            }}
          >
            N/A
          </div>
        )}
      </div>

      {/* Service title */}
      <div 
        className="service-title"
        style={{
          fontSize: variant === 'detailed' ? '16px' : '13px',
          color: 'var(--dark)',
          fontWeight: variant === 'detailed' ? '600' : '400',
          marginBottom: variant === 'detailed' ? '8px' : '0',
          lineHeight: '1.3'
        }}
      >
        {isLoading ? "Loading..." : title}
      </div>

      {/* Additional details for detailed variant */}
      {variant === 'detailed' && !isLoading && (
        <>
          {/* Description */}
          {description && (
            <p 
              style={{
                fontSize: '13px',
                color: 'var(--muted)',
                margin: '0 0 8px 0',
                lineHeight: '1.4'
              }}
            >
              {description}
            </p>
          )}

          {/* Price and duration row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            {/* Price */}
            {showPrice && price && (
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent)' }}>
                R{price}
              </span>
            )}
            
            {/* Duration */}
            {duration && (
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {duration}
              </span>
            )}
          </div>

          {/* Rating and provider row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Rating */}
            {showRating && rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#f5b700' }}>★</span>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{rating}</span>
              </div>
            )}
            
            {/* Provider */}
            {provider && (
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                by {provider}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// PropTypes for type checking
ServiceCard.propTypes = {
  title: PropTypes.string.isRequired, // Title is required
  image: PropTypes.string, // Image URL must be string
  description: PropTypes.string, // Description must be string
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Price can be string or number
  duration: PropTypes.string, // Duration must be string
  rating: PropTypes.number, // Rating must be number
  provider: PropTypes.string, // Provider name must be string
  isAvailable: PropTypes.bool, // Availability must be boolean
  onClick: PropTypes.func, // Click handler must be function
  variant: PropTypes.oneOf(['default', 'compact', 'detailed']), // Predefined variants
  className: PropTypes.string, // CSS class must be string
  showPrice: PropTypes.bool, // Price display control must be boolean
  showRating: PropTypes.bool, // Rating display control must be boolean
  isLoading: PropTypes.bool // Loading state must be boolean
};

// Default props
ServiceCard.defaultProps = {
  title: "Service",
  image: null,
  description: null,
  price: null,
  duration: null,
  rating: null,
  provider: null,
  isAvailable: true,
  onClick: null,
  variant: "default",
  className: "service-card",
  showPrice: true,
  showRating: true,
  isLoading: false
};

export default ServiceCard;