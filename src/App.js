import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import SignupClient from './pages/SignupClient';
import SignupProvider from './pages/SignupProvider';
import ChooseServices from './pages/ChooseServices';
import AddService from './pages/Provider-a-service';

function App() {
  
  // State for current user
  const [user, setUser] = useState(null);
  // State for loading authentication
  const [authLoading, setAuthLoading] = useState(true);

  // 🚨 TESTING MODE - Set to false when going live
  const TESTING_MODE = false; // ✅ Changed to false to test real signup flow

  // Mock user data for testing (only used when TESTING_MODE = true)
  const MOCK_CLIENT_USER = {
    id: 1,
    username: 'John Doe',
    email: 'john@example.com',
    user_type: 'Client',
    token: 'mock-client-token'
  };

  const MOCK_PROVIDER_USER = {
    id: 2,
    username: 'Jane Smith',
    email: 'jane@example.com',
    user_type: 'Provider',
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
      }, 500);
    } else {
      // ✅ Check for real user data from localStorage
      checkAuthStatus();
    }
  }, []);

  // ✅ Check if user is already logged in (from localStorage)
  function checkAuthStatus() {
    try {
      // Check localStorage for saved user data (matches backend response)
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        console.log('✅ Found user in localStorage:', userData);
        setUser(userData);
      } else {
        console.log('ℹ️ No user found in localStorage');
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('user');
    } finally {
      setAuthLoading(false);
    }
  }

  // ✅ Handle user login/registration
  function handleLogin(userData) {
    console.log('✅ Setting user:', userData);
    setUser(userData);
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  }

  // Handle user logout
  function handleLogout() {
    console.log('🚪 Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  }

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="app-loading" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Loading Waasha...
        {TESTING_MODE && (
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            Testing Mode Enabled
          </div>
        )}
      </div>
    );
  }

  // ✅ PRODUCTION MODE - Normal flow with proper authentication
  return (
    <Router>
      <div className="app-root">
        {/* Show testing banner if in testing mode */}
        {TESTING_MODE && (
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
        )}
        
        <div style={{ paddingTop: TESTING_MODE ? '30px' : '0' }}>
          <Routes>
            
            {/* ============================================
                PUBLIC ROUTES (No authentication required)
                ============================================ */}
            
            {/* Landing Page */}
            <Route 
              path="/" 
              element={<LandingPage isAuthenticated={!!user} user={user} />} 
            />

            {/* Login Page */}
            <Route 
              path="/login" 
              element={<LoginPage setUser={handleLogin} />} 
            />

            {/* Client Signup */}
            <Route 
              path="/signup-client" 
              element={<SignupClient setUser={handleLogin} />} 
            />

            {/* Provider Signup */}
            <Route 
              path="/signup-provider" 
              element={<SignupProvider setUser={handleLogin} />} 
            />

            {/* ============================================
                PROVIDER ONBOARDING FLOW
                (Requires user in localStorage but not full auth)
                ============================================ */}
            
            {/* Choose Services - After provider signup */}
            <Route 
              path="/choose-services" 
              element={<ChooseServices user={user} />} 
            />

            {/* Add Service - Provider adds their first service */}
            <Route 
              path="/add-service" 
              element={<AddService user={user} />} 
            />

            {/* ============================================
                PROTECTED DASHBOARDS
                (Full authentication required)
                ============================================ */}
            
            {/* Client Dashboard */}
            <Route 
              path="/client" 
              element={
                user && (user.user_type === 'Client' || user.role === 'client') ? (
                  <ClientDashboard user={user} onLogout={handleLogout} />
                ) : user && (user.user_type === 'Provider' || user.role === 'provider') ? (
                  <Navigate to="/provider" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* Provider Dashboard */}
            <Route 
              path="/provider" 
              element={
                user && (user.user_type === 'Provider' || user.role === 'provider') ? (
                  <ProviderDashboard user={user} onLogout={handleLogout} />
                ) : user && (user.user_type === 'Client' || user.role === 'client') ? (
                  <Navigate to="/client" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* ============================================
                CATCH-ALL ROUTE
                ============================================ */}
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;