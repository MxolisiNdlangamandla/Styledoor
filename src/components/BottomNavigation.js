import React from "react"; // Import React for JSX rendering
import { useNavigate, useLocation } from "react-router-dom"; // Import hooks for navigation and current route
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// BottomNavigation component for logged-in users
function BottomNavigation({ userRole = "client" }) {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const location = useLocation(); // Hook to get current route
  
  // Navigation tabs configuration
  const tabs = [
    {
      id: 'discover',
      label: 'Discover',
      icon: '🔍',
      route: userRole === 'client' ? '/client' : '/provider',
      ariaLabel: 'Discover services'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: '📅',
      route: userRole === 'client' ? '/client/bookings' : '/provider/bookings',
      ariaLabel: 'View your bookings'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: '♡',
      route: userRole === 'client' ? '/client/favorites' : '/provider/favorites',
      ariaLabel: 'View your favorites'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '💬',
      route: userRole === 'client' ? '/client/messages' : '/provider/messages',
      ariaLabel: 'View your messages'
    }
  ];

  // Handle tab click navigation
  function handleTabClick(tab) {
    navigate(tab.route);
  }

  // Check if current tab is active based on current route
  function isActiveTab(tab) {
    return location.pathname === tab.route || location.pathname.startsWith(tab.route);
  }

  // Renders the bottom navigation bar
  return (
    <nav 
      className="bottom-navigation"
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed', // Fixed to bottom of screen
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)', // Center horizontally
        width: '100%',
        maxWidth: '420px', // Match your container max-width
        background: '#fff',
        borderTop: '1px solid #e6edf8',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0 12px 0', // Extra padding for safe area
        zIndex: 1000, // Ensure it stays on top
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}
    >
      {/* Render each navigation tab */}
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab)} // Navigate to tab route
          className="nav-tab"
          aria-label={tab.ariaLabel}
          aria-current={isActiveTab(tab) ? 'page' : undefined} // Accessibility for active tab
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            color: isActiveTab(tab) ? 'var(--accent)' : 'var(--muted)', // Active state color
            fontWeight: isActiveTab(tab) ? '600' : '500'
          }}
          onMouseEnter={(e) => {
            // Hover effect
            if (!isActiveTab(tab)) {
              e.target.style.backgroundColor = '#f8f9fa';
            }
          }}
          onMouseLeave={(e) => {
            // Remove hover effect
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          {/* Tab icon */}
          <span 
            className="tab-icon"
            style={{ 
              fontSize: '20px',
              filter: isActiveTab(tab) ? 'none' : 'grayscale(0.3)' // Slight gray for inactive
            }}
          >
            {tab.icon}
          </span>
          {/* Tab label */}
          <span 
            className="tab-label"
            style={{ fontSize: '12px' }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

// PropTypes for type checking
BottomNavigation.propTypes = {
  userRole: PropTypes.oneOf(['client', 'provider']).isRequired // Must be client or provider
};

// Default props
BottomNavigation.defaultProps = {
  userRole: 'client'
};

export default BottomNavigation;