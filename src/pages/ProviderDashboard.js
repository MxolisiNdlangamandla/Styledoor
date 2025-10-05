import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import components
import BottomNavigation from '../components/BottomNavigation';
import SearchBar from '../components/SearchBar';

const ProviderDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  // State for provider's services, bookings, and team
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [team, setTeam] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState({
    services: true,
    bookings: true,
    team: true,
    completed: true
  });
  const [error, setError] = useState(null);

  // Fetch provider data on component mount
  useEffect(() => {
    if (user) {
      fetchProviderData();
    }
  }, [user]);

  // Fetch all provider-related data
  async function fetchProviderData() {
    try {
      await Promise.all([
        fetchServices(),
        fetchBookings(),
        fetchTeam(),
        fetchCompletedBookings()
      ]);
    } catch (err) {
      console.error('Failed to fetch provider data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    }
  }

  // Fetch provider's services
  async function fetchServices() {
    try {
      // Mock data for now - replace with actual API call
      setTimeout(() => {
        setServices([
          { id: 1, name: 'Hair Styling', price: 50, status: 'active', bookings: 5 },
          { id: 2, name: 'Hair Cut', price: 30, status: 'active', bookings: 8 },
          { id: 3, name: 'Hair Wash', price: 20, status: 'active', bookings: 3 }
        ]);
        setLoading(prev => ({ ...prev, services: false }));
      }, 800);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setLoading(prev => ({ ...prev, services: false }));
    }
  }

  // Fetch active bookings
  async function fetchBookings() {
    try {
      // Mock data for now - replace with actual API call
      setTimeout(() => {
        setBookings([
          { 
            id: 1, 
            client_name: 'John Doe', 
            service: 'Hair Cut', 
            date: '2025-01-15', 
            time: '10:00', 
            status: 'confirmed',
            phone: '+27 82 123 4567'
          },
          { 
            id: 2, 
            client_name: 'Sarah Wilson', 
            service: 'Hair Styling', 
            date: '2025-01-15', 
            time: '14:30', 
            status: 'pending',
            phone: '+27 81 987 6543'
          },
          { 
            id: 3, 
            client_name: 'Mike Johnson', 
            service: 'Hair Wash', 
            date: '2025-01-16', 
            time: '09:00', 
            status: 'confirmed',
            phone: '+27 83 456 7890'
          }
        ]);
        setLoading(prev => ({ ...prev, bookings: false }));
      }, 600);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  }

  // Fetch team members
  async function fetchTeam() {
    try {
      // Mock data for now - replace with actual API call
      setTimeout(() => {
        setTeam([
          { 
            id: 1, 
            name: 'Alice Brown', 
            role: 'Senior Stylist', 
            status: 'online',
            avatar: '/team-alice.jpg',
            rating: 4.8
          },
          { 
            id: 2, 
            name: 'David Lee', 
            role: 'Hair Specialist', 
            status: 'online',
            avatar: '/team-david.jpg',
            rating: 4.6
          },
          { 
            id: 3, 
            name: 'Emma Clark', 
            role: 'Junior Stylist', 
            status: 'offline',
            avatar: '/team-emma.jpg',
            rating: 4.4
          }
        ]);
        setLoading(prev => ({ ...prev, team: false }));
      }, 1000);
    } catch (err) {
      console.error('Failed to fetch team:', err);
      setLoading(prev => ({ ...prev, team: false }));
    }
  }

  // Fetch completed bookings
  async function fetchCompletedBookings() {
    try {
      // Mock data for now - replace with actual API call
      setTimeout(() => {
        setCompletedBookings([
          { 
            id: 1, 
            client_name: 'Lisa Anderson', 
            service: 'Hair Cut', 
            date: '2025-01-10', 
            time: '11:00', 
            status: 'completed',
            rating: 5,
            earnings: 30
          },
          { 
            id: 2, 
            client_name: 'Tom Wilson', 
            service: 'Hair Styling', 
            date: '2025-01-12', 
            time: '15:30', 
            status: 'completed',
            rating: 4,
            earnings: 50
          },
          { 
            id: 3, 
            client_name: 'Kate Davis', 
            service: 'Hair Wash', 
            date: '2025-01-13', 
            time: '10:15', 
            status: 'completed',
            rating: 5,
            earnings: 20
          }
        ]);
        setLoading(prev => ({ ...prev, completed: false }));
      }, 1200);
    } catch (err) {
      console.error('Failed to fetch completed bookings:', err);
      setLoading(prev => ({ ...prev, completed: false }));
    }
  }

  // Handle search functionality
  function handleSearch(query) {
    navigate(`/search?q=${encodeURIComponent(query)}`);
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
        <BottomNavigation userRole="provider" />
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header with welcome message and user actions */}
      <div className="brand-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <div className="logo-circle">W</div>
            <div className="brand-title">Waasha</div>
            <div className="brand-slogan">
              Welcome, {user?.first_name || "Provider"}!
            </div>
          </div>
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

      {/* Search bar for managing services */}
      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search clients, bookings..."
        variant="default"
      />

      {/* Quick stats showing provider activity */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
        <div style={{
          flex: 1,
          background: '#e3f7ff',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--accent)' }}>
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Active Bookings</div>
        </div>
        <div style={{
          flex: 1,
          background: '#d6f5e9',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#1ca67a' }}>
            {team.filter(t => t.status === 'online').length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Online Team</div>
        </div>
        <div style={{
          flex: 1,
          background: '#fff0e6',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#ff8c00' }}>
            {completedBookings.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Completed</div>
        </div>
      </div>

      {/* Active Bookings section */}
      <div className="card">
        <div className="card-title">Active Bookings</div>
        {loading.bookings ? (
          <p className="lead">Loading bookings...</p>
        ) : bookings.length > 0 ? (
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
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    {booking.client_name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {booking.service} • {booking.date} at {booking.time}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                    📞 {booking.phone}
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
            {bookings.length > 3 && (
              <button 
                className="btn outline"
                onClick={() => navigate('/provider/bookings')}
                style={{ width: '100%', marginTop: '8px' }}
              >
                View All Bookings
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="lead">No active bookings.</p>
            <button className="btn primary" onClick={() => navigate('/provider/services')}>
              Manage Services
            </button>
          </div>
        )}
      </div>

      {/* Online Team section */}
      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-title">Team Status</div>
        {loading.team ? (
          <p className="lead">Loading team...</p>
        ) : team.length > 0 ? (
          <div>
            {team.slice(0, 3).map(member => (
              <div key={member.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <img 
                  src={member.avatar || '/default-avatar.png'} 
                  alt={`${member.name} profile`}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {member.role} • ★ {member.rating}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: member.status === 'online' ? '#d6f5e9' : '#f8f9fa',
                  color: member.status === 'online' ? '#1ca67a' : '#6b7280'
                }}>
                  {member.status}
                </div>
              </div>
            ))}
            {team.length > 3 && (
              <button 
                className="btn outline"
                onClick={() => navigate('/provider/team')}
                style={{ width: '100%', marginTop: '8px' }}
              >
                View All Team
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="lead">No team members added yet.</p>
            <button className="btn primary" onClick={() => navigate('/provider/team/add')}>
              Add Team Member
            </button>
          </div>
        )}
      </div>

      {/* Completed Bookings section */}
      <div className="card" style={{ marginTop: '18px' }}>
        <div className="card-title">Recent Completed</div>
        {loading.completed ? (
          <p className="lead">Loading completed bookings...</p>
        ) : completedBookings.length > 0 ? (
          <div>
            {completedBookings.slice(0, 3).map(booking => (
              <div key={booking.id} style={{
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    {booking.client_name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {booking.service} • {booking.date}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                    {'★'.repeat(booking.rating)} • R{booking.earnings}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: '#d6f5e9',
                  color: '#1ca67a'
                }}>
                  Completed
                </div>
              </div>
            ))}
            {completedBookings.length > 3 && (
              <button 
                className="btn outline"
                onClick={() => navigate('/provider/completed')}
                style={{ width: '100%', marginTop: '8px' }}
              >
                View All Completed
              </button>
            )}
          </div>
        ) : (
          <p className="lead">No completed bookings yet.</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation userRole="provider" />
    </div>
  );
};

// PropTypes
ProviderDashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string.isRequired,
    token: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func
};

export default ProviderDashboard;