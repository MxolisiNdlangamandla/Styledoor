// React core - useState for managing component state, useEffect for side effects
import React, { useState, useEffect } from 'react';

// React Router hooks:
// - useNavigate: programmatically navigate to different routes
// - useLocation: access current location/route information and state
import { useNavigate, useLocation } from 'react-router-dom';

// Custom Header component for navigation bar
import Header from '../components/Header';

// PROVIDER DASHBOARD COMPONENT

function ProviderDashboard() {
  
  // HOOKS INITIALIZATION
  
  // Hook to navigate to different pages programmatically
  const navigate = useNavigate();
  
  // Hook to access current route location and any passed state
  const location = useLocation();
  
  // State to store the logged-in user's data (username, email, user_type, etc.)
  const [user, setUser] = useState(null);
  
  // State to store success/info messages to display to the user
  const [message, setMessage] = useState('');

  // ============================================
  // AUTHENTICATION & INITIALIZATION
  // ============================================
  
  // useEffect runs when component mounts and when dependencies change
  // Dependencies: [navigate, location] - runs when these change
  useEffect(() => {
    
    // STEP 1: Check if user is logged in
    // Get user data from browser's localStorage (saved during login/registration)
    const userData = localStorage.getItem('user');
    
    // If no user data found, user is not logged in
    if (!userData) {
      // Redirect to login page
      navigate('/login');
      return; // Exit early, don't run rest of code
    }

    // STEP 2: Parse and validate user data
    // Convert JSON string from localStorage back to JavaScript object
    const parsedUser = JSON.parse(userData);
    
    // Check if user is actually a Provider (not a Client)
    if (parsedUser.user_type !== 'Provider') {
      // If user is a Client, redirect them to client dashboard
      navigate('/client');
      return; // Exit early
    }

    // STEP 3: User is authenticated and is a Provider
    // Store user data in component state for use in JSX
    setUser(parsedUser);

    // STEP 4: Check for navigation messages
    // location.state?.message checks if a message was passed during navigation
    // Example: navigate('/provider', { state: { message: 'Success!' } })
    if (location.state?.message) {
      // Display the message to user
      setMessage(location.state.message);
      
      // Automatically clear the message after 5 seconds (5000ms)
      setTimeout(() => setMessage(''), 5000);
    }
    
  }, [navigate, location]); // Re-run effect if navigate or location changes

  // ============================================
  // LOADING STATE
  // ============================================
  
  // If user data hasn't loaded yet, show loading text
  // This prevents errors from trying to access user.username before it exists
  if (!user) return <div>Loading...</div>;

  // ============================================
  // RENDER JSX (USER INTERFACE)
  // ============================================
  
  return (
    <div className="page-wrapper">
      
      {/* ============================================
          HEADER NAVIGATION
          ============================================ */}
      
      {/* Header component with dashboard variant and user data */}
      <Header 
        variant="dashboard"  // Tells Header to render dashboard-style nav
        user={user}          // Pass user data to Header (for logout, profile, etc.)
      />
      
      {/* ============================================
          MAIN CONTENT CONTAINER
          ============================================ */}
      
      {/* Main content area with top padding to account for fixed header */}
      <div className="container" style={{ paddingTop: '80px' }}>
        
        {/* ============================================
            SUCCESS/INFO MESSAGE ALERT
            ============================================ */}
        
        {/* Only render alert if message exists (conditional rendering) */}
        {message && (
          <div 
            className="alert alert-success" 
            style={{ marginBottom: '20px' }}
          >
            {/* Success checkmark icon */}
            <span className="alert-icon">✅</span>
            
            {/* The actual message text */}
            <span className="alert-message">{message}</span>
          </div>
        )}

        {/* ============================================
            WELCOME SECTION
            ============================================ */}
        
        {/* Personalized greeting using user's name from state */}
        <h1>Welcome, {user.username}!</h1>
        
        {/* Subtitle describing the page */}
        <p style={{ color: '#666', marginBottom: '40px' }}>
          Provider Dashboard
        </p>

        {/* ============================================
            DASHBOARD CARDS GRID
            ============================================ */}
        
        {/* Grid container for dashboard action cards */}
        <div style={{
          display: 'grid',                                    // Use CSS Grid layout
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive columns: min 250px, auto-fit
          gap: '20px',                                        // 20px space between cards
          marginTop: '30px'                                   // Space above grid
        }}>
          
          {/* ============================================
              CARD 1: MY SERVICES
              ============================================ */}
          
          <div className="dashboard-card">
            {/* Card title */}
            <h3>My Services</h3>
            
            {/* Card description */}
            <p>Manage your service offerings</p>
            
            {/* Button to add new service */}
            <button 
              className="btn btn-primary"              // Primary button styling (blue, solid)
              onClick={() => navigate('/add-service')} // Navigate to add-service page on click
              style={{ marginTop: '15px' }}           // Space above button
            >
              + Add New Service
            </button>
          </div>

          {/* ============================================
              CARD 2: BOOKINGS
              ============================================ */}
          
          <div className="dashboard-card">
            {/* Card title */}
            <h3>Bookings</h3>
            
            {/* Card description */}
            <p>View and manage appointments</p>
            
            {/* Button to view bookings (functionality not implemented yet) */}
            <button 
              className="btn btn-outline"           // Outline button styling (white with blue border)
              style={{ marginTop: '15px' }}        // Space above button
            >
              View Bookings
            </button>
          </div>

          {/* ============================================
              CARD 3: PROFILE
              ============================================ */}
          
          <div className="dashboard-card">
            {/* Card title */}
            <h3>Profile</h3>
            
            {/* Card description */}
            <p>Update your provider profile</p>
            
            {/* Button to edit profile (functionality not implemented yet) */}
            <button 
              className="btn btn-outline"           // Outline button styling
              style={{ marginTop: '15px' }}        // Space above button
            >
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Export component so it can be imported and used in App.js routes
export default ProviderDashboard;