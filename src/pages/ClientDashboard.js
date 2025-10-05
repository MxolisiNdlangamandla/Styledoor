import React, { useState, useEffect } from 'react'; // Import React hooks for state management
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic routing
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// Import components
import BottomNavigation from '../components/BottomNavigation';
import SearchBar from '../components/SearchBar';

// ClientDashboard component - main dashboard for client users
const ClientDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate(); // Hook for navigation
  
  // State for user's bookings
  const [bookings, setBookings] = useState([]);
  // State for favorite providers
  const [favorites, setFavorites] = useState([]);
  // State for loading indicators
  const [loading, setLoading] = useState({
    bookings: true,
    favorites: true
  });
  // State for errors
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Fetch all user-related data
  async function fetchUserData() {
    try {
      await Promise.all([
        fetchBookings(),
        fetchFavorites()
      ]);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    }
  }

  // Fetch user's bookings from backend
  async function fetchBookings() {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  }

  // Fetch user's favorite providers from backend
  async function fetchFavorites() {
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(prev => ({ ...prev, favorites: false }));
    }
  }

  // Handle search functionality
  function handleSearch(query) {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  // Handle book service button click
  function handleBookService() {
    navigate('/services');
  }

  // Handle logout
  function handleLogout() {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="container">
        <div className="brand-header">
          <div className="logo-circle">W</div>
          <div className="brand-title">Waasha</div>
          <div className="brand-slogan">Dashboard Error</div>
        </div>
        <div className="card">
          <div className="card-title">Error</div>
          <p className="lead" style={{ color: 'red' }}>{error}</p>
          <button className="btn primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
        <BottomNavigation userRole="client" />
      </div>
    );
  }

  // Main dashboard render
  return (
    <div className="container">
      {/* Header with welcome message and user actions */}
      <div className="brand-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <div className="logo-circle">W</div>
            <div className="brand-title">Waasha</div>
            {/* Welcome message with user's first name */}
            <div className="brand-slogan">
              Welcome, {user?.first_name || "Client"}!
            </div>
          </div>
          {/* User menu with logout button */}
          <button 
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'var(--accent)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            aria-label="Logout from your account"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search bar for finding services */}
      <SearchBar 
        onSearch={handleSearch}
        placeholder="What service do you need?"
        variant="default"
      />

      {/* Quick stats showing user activity */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
        <div style={{
          flex: 1,
          background: '#e3f7ff',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--accent)' }}>
            {bookings.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Active Bookings</div>
        </div>
        <div style={{
          flex: 1,
          background: '#fff0e6',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#ff8c00' }}>
            {favorites.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Favorites</div>
        </div>
      </div>

      {/* Bookings section */}
      <div className="card">
        <div className="card-title">Your Bookings</div>
        {loading.bookings ? (
          // Show loading state while fetching bookings
          <p className="lead">Loading bookings...</p>
        ) : bookings.length > 0 ? (
          // Display bookings if user has any
          <div>
            {bookings.slice(0, 3).map(booking => (
              <div key={booking.id} style={{
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    {booking.service_name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {booking.date} at {booking.time}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: booking.status === 'confirmed' ? '#d6f5e9' : '#fff3cd',
                  color: booking.status === 'confirmed' ? '#1ca67a' : '#856404'
                }}>
                  {booking.status}
                </div>
              </div>
            ))}
            {/* Show "View All" button if there are more than 3 bookings */}
            {bookings.length > 3 && (
              <button 
                className="btn outline"
                onClick={() => navigate('/client/bookings')}
                style={{ width: '100%', marginTop: '8px' }}
              >
                View All Bookings
              </button>
            )}
          </div>
        ) : (
          // Show empty state if no bookings
          <div>
            <p className="lead">You have no bookings yet.</p>
            <button className="btn primary" onClick={handleBookService}>
              Book a Service
            </button>
          </div>
        )}
      </div>

      {/* Favorite Providers section */}
      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-title">Favorite Providers</div>
        {loading.favorites ? (
          // Show loading state while fetching favorites
          <p className="lead">Loading favorites...</p>
        ) : favorites.length > 0 ? (
          // Display favorites if user has any
          <div>
            {favorites.slice(0, 3).map(favorite => (
              <div key={favorite.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <img 
                  src={favorite.avatar || '/default-avatar.png'} 
                  alt={`${favorite.name} profile`}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{favorite.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    ★ {favorite.rating} • {favorite.service_type}
                  </div>
                </div>
                <button 
                  className="btn small outline"
                  onClick={() => navigate(`/provider/${favorite.id}`)}
                  aria-label={`View ${favorite.name} profile`}
                >
                  View
                </button>
              </div>
            ))}
            {/* Show "View All" button if there are more than 3 favorites */}
            {favorites.length > 3 && (
              <button 
                className="btn outline"
                onClick={() => navigate('/client/favorites')}
                style={{ width: '100%', marginTop: '8px' }}
              >
                View All Favorites
              </button>
            )}
          </div>
        ) : (
          // Show empty state if no favorites
          <p className="lead">No favorites yet.</p>
        )}
      </div>

      {/* Bottom Navigation - only show when user is logged in */}
      <BottomNavigation userRole="client" />
    </div>
  );
};

// PropTypes for type checking
ClientDashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    token: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func
};

export default ClientDashboard;