import React from "react"; // Import React for JSX rendering
import PropTypes from 'prop-types'; // Import PropTypes for type checking
import logo from "../assets/Logo.png"; // Import logo image asset

// Header component displays the main brand header with logo and text
function Header({ 
  showLogo = true, // Control whether to show the logo image
  logoSize = 150, // Customizable logo size
  title = "WAASHA", // Customizable title text
  slogan = "The Future Of Service, Today", // Customizable slogan text
  className = "brand-header", // Customizable CSS class
  variant = "default" // Header variant (default, compact, minimal)
}) {
  
  // Handle logo load error - fallback to text logo
  function handleLogoError(e) {
    console.warn('Logo failed to load, hiding image');
    e.target.style.display = 'none'; // Hide broken image
  }

  // Get header styles based on variant
  function getHeaderStyles() {
    const baseStyles = {
      textAlign: 'center',
      marginBottom: variant === 'compact' ? '8px' : '10px'
    };

    // Add variant-specific styles
    switch (variant) {
      case 'compact':
        return { ...baseStyles, padding: '10px 0' };
      case 'minimal':
        return { ...baseStyles, padding: '5px 0' };
      default:
        return baseStyles;
    }
  }

  // Get logo styles based on variant and size
  function getLogoStyles() {
    const size = variant === 'compact' ? logoSize * 0.7 : logoSize;
    return {
      width: size,
      height: size,
      objectFit: 'contain', // Maintain aspect ratio
      marginBottom: variant === 'minimal' ? '5px' : '8px'
    };
  }

  // Renders the header component
  return (
    <header 
      className={className}
      style={getHeaderStyles()}
      role="banner" // ARIA role for header landmark
    >
      {/* Logo image - only render if showLogo is true and not minimal variant */}
      {showLogo && variant !== 'minimal' && (
        <img 
          src={logo} 
          alt={`${title} Logo`} // Dynamic alt text based on title
          className="brand-logo"
          style={getLogoStyles()}
          onError={handleLogoError} // Handle broken image gracefully
          loading="lazy" // Optimize loading performance
        />
      )}
      
      {/* Main title - semantic h1 for SEO and accessibility */}
      <h1 
        className="brand-title"
        style={{
          fontSize: variant === 'compact' ? '20px' : '22px',
          margin: '8px 0 2px',
          letterSpacing: '1px',
          color: 'var(--dark)'
        }}
      >
        {title}
      </h1>
      
      {/* Slogan - only show if not minimal variant */}
      {variant !== 'minimal' && (
        <div 
          className="brand-slogan"
          style={{
            fontSize: variant === 'compact' ? '12px' : '13px',
            color: 'var(--muted)'
          }}
        >
          {slogan}
        </div>
      )}
    </header>
  );
}

// PropTypes for type checking - ensures correct prop types are passed
Header.propTypes = {
  showLogo: PropTypes.bool, // Boolean to control logo visibility
  logoSize: PropTypes.number, // Number for logo size in pixels
  title: PropTypes.string, // String for the main title
  slogan: PropTypes.string, // String for the slogan text
  className: PropTypes.string, // String for CSS class
  variant: PropTypes.oneOf(['default', 'compact', 'minimal']) // Predefined variants
};

// Default props - fallback values if no props are provided
Header.defaultProps = {
  showLogo: true,
  logoSize: 150,
  title: "WAASHA",
  slogan: "The Future Of Service, Today",
  className: "brand-header",
  variant: "default"
};

export default Header;