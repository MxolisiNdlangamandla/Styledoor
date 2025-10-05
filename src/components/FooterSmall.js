import React from "react"; // Import React for JSX rendering
import { Link } from "react-router-dom"; // Import Link for client-side navigation
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// FooterSmall component displays a small footer with login link
function FooterSmall({ 
  text = "ALREADY HAVE AN ACCOUNT?", // Customizable text message
  linkText = "LOG IN", // Customizable link text
  linkTo = "/login", // Customizable link destination
  className = "footer-small" // Customizable CSS class
}) {
  return (
    <div className={className}>
      {/* Display customizable text message */}
      <span>{text} </span>
      {/* Navigation link with accessibility attributes */}
      <Link 
        to={linkTo}
        aria-label={`Navigate to ${linkText.toLowerCase()} page`} // Screen reader description
      >
        {linkText}
      </Link>
    </div>
  );
}

// PropTypes for type checking - ensures correct prop types are passed
FooterSmall.propTypes = {
  text: PropTypes.string, // Text message must be a string
  linkText: PropTypes.string, // Link text must be a string
  linkTo: PropTypes.string, // Link destination must be a string
  className: PropTypes.string // CSS class must be a string
};

// Default props - fallback values if no props are provided
FooterSmall.defaultProps = {
  text: "ALREADY HAVE AN ACCOUNT?",
  linkText: "LOG IN",
  linkTo: "/login",
  className: "footer-small"
};

export default FooterSmall;