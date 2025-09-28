import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignupClient from "./pages/SignupClient";
import SignupProvider from "./pages/SignupProvider";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <div className="app-root">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup-client" element={<SignupClient />} />
          <Route path="/signup-provider" element={<SignupProvider />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
