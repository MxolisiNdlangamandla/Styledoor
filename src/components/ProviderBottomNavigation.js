import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function ProviderBottomNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/provider', icon: '🏠', label: 'Home' },
    { path: '/provider/search', icon: '🔍', label: 'Search' },
    { path: '/provider/team', icon: '👥', label: 'Team' },
    { path: '/provider/profile', icon: '👤', label: 'Profile' },
    { path: '/provider/more', icon: '⋯', label: 'More' }
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-content">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="nav-item-icon">{item.icon}</div>
            <div>{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProviderBottomNavigation;