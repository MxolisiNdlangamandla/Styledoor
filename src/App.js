import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import SignupClient from './pages/SignupClient';
import SignupProvider from './pages/SignupProvider';

function App() {
  // State for current user
  const [user, setUser] = useState(null);
  // State for loading authentication
  const [authLoading, setAuthLoading] = useState(true);

  // 🚨 TESTING MODE - Set to false when going live
  const TESTING_MODE = false;

  // Mock user data for testing
  const MOCK_CLIENT_USER = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    role: 'client',
    token: 'mock-client-token'
  };

  const MOCK_PROVIDER_USER = {
    id: 2,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    role: 'provider',
    token: 'mock-provider-token'
  };

  // Check for existing user session on app load
  useEffect(() => {
    if (TESTING_MODE) {
      // In testing mode, skip auth check and set mock user
      setTimeout(() => {
        // You can change this to MOCK_PROVIDER_USER to test provider dashboard
        setUser(MOCK_CLIENT_USER);
        setAuthLoading(false);
      }, 500); // Small delay to simulate loading
    } else {
      checkAuthStatus();
    }
  }, []);

  // Check if user is already logged in (from localStorage or sessionStorage)
  async function checkAuthStatus() {
    try {
      // Check localStorage for saved user data
      const savedUser = localStorage.getItem('waasha_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        
        // Verify the token is still valid
        const response = await fetch('http://localhost:5000/api/verify-token', {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        });
        
        if (response.ok) {
          setUser(userData);
        } else {
          // Token is invalid, remove from storage
          localStorage.removeItem('waasha_user');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('waasha_user');
    } finally {
      setAuthLoading(false);
    }
  }

  // Handle user login
  function handleLogin(userData) {
    setUser(userData);
    // Save to localStorage for persistence (only in production)
    if (!TESTING_MODE) {
      localStorage.setItem('waasha_user', JSON.stringify(userData));
    }
  }

  // Handle user logout
  function handleLogout() {
    if (TESTING_MODE) {
      // In testing mode, allow switching between user types
      const switchToProvider = user?.role === 'client';
      setUser(switchToProvider ? MOCK_PROVIDER_USER : MOCK_CLIENT_USER);
    } else {
      setUser(null);
      localStorage.removeItem('waasha_user');
    }
  }

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="app-loading">
        Loading Waasha...
        {TESTING_MODE && (
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            Testing Mode Enabled
          </div>
        )}
      </div>
    );
  }

  // Testing mode routes - direct access to dashboards
  if (TESTING_MODE) {
    return (
      <Router>
        <div className="app-root">
          {/* Testing mode banner */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: '#ff6b6b',
            color: 'white',
            padding: '4px 8px',
            fontSize: '12px',
            textAlign: 'center',
            zIndex: 9999,
            fontWeight: '600'
          }}>
            🧪 TESTING MODE - Set TESTING_MODE = false for production
          </div>
          
          <div style={{ paddingTop: '30px' }}>
            <Routes>
              {/* Landing page */}
              <Route 
                path="/" 
                element={<LandingPage isAuthenticated={!!user} user={user} />} 
              />

              {/* Login page */}
              <Route 
                path="/login" 
                element={<LoginPage setUser={handleLogin} />} 
              />

              {/* Signup pages */}
              <Route 
                path="/signup-client" 
                element={<SignupClient setUser={handleLogin} />} 
              />

              <Route 
                path="/signup-provider" 
                element={<SignupProvider setUser={handleLogin} />} 
              />

              {/* Direct access to dashboards for testing */}
              <Route 
                path="/client" 
                element={
                  <ClientDashboard 
                    user={user || MOCK_CLIENT_USER} 
                    onLogout={handleLogout} 
                  />
                } 
              />

              <Route 
                path="/provider" 
                element={
                  <ProviderDashboard 
                    user={user || MOCK_PROVIDER_USER} 
                    onLogout={handleLogout} 
                  />
                } 
              />

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }

  // Production mode routes - with authentication
  return (
    <Router>
      <div className="app-root">
        <Routes>
          {/* Landing page - redirect to dashboard if logged in */}
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={user.role === 'provider' ? '/provider' : '/client'} replace />
              ) : (
                <LandingPage isAuthenticated={!!user} user={user} />
              )
            } 
          />

          {/* Login page - redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to={user.role === 'provider' ? '/provider' : '/client'} replace />
              ) : (
                <LoginPage setUser={handleLogin} />
              )
            } 
          />

          {/* Signup pages - redirect to dashboard if already logged in */}
          <Route 
            path="/signup-client" 
            element={
              user ? (
                <Navigate to={user.role === 'provider' ? '/provider' : '/client'} replace />
              ) : (
                <SignupClient setUser={handleLogin} />
              )
            } 
          />

          <Route 
            path="/signup-provider" 
            element={
              user ? (
                <Navigate to={user.role === 'provider' ? '/provider' : '/client'} replace />
              ) : (
                <SignupProvider setUser={handleLogin} />
              )
            } 
          />

          {/* Protected Client Dashboard */}
          <Route 
            path="/client" 
            element={
              user && user.role === 'client' ? (
                <ClientDashboard user={user} onLogout={handleLogout} />
              ) : user && user.role === 'provider' ? (
                <Navigate to="/provider" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Protected Provider Dashboard */}
          <Route 
            path="/provider" 
            element={
              user && user.role === 'provider' ? (
                <ProviderDashboard user={user} onLogout={handleLogout} />
              ) : user && user.role === 'client' ? (
                <Navigate to="/client" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Catch all other routes - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;