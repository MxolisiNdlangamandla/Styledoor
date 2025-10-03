import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignupClient from "./pages/SignupClient";
import SignupProvider from "./pages/SignupProvider";
import LoginPage from "./pages/LoginPage";
import ClientDashboard from "./pages/ClientDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";

function App() {
  const [user, setUser] = useState(null); // user object after login

  return (
    <Router>
      <div className="app-root">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup-client" element={<SignupClient />} />
          <Route path="/signup-provider" element={<SignupProvider />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/client" element={<ClientDashboard user={user} />} />
          <Route path="/provider" element={<ProviderDashboard user={user} />} />
          {/* Redirect to dashboard based on user role */}
          <Route path="*" element={<Navigate to={user?.role === "provider" ? "/provider" : "/client"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;