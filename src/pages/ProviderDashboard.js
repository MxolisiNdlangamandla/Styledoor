import React from 'react';

const ProviderDashboard = ({ user }) => (
  <div className="container">
    <div className="brand-header">
      <div className="logo-circle">W</div>
      <div className="brand-title">Waasha</div>
      <div className="brand-slogan">Welcome, {user?.first_name || "Provider"}!</div>
    </div>
    <div className="card">
      <div className="card-title">Today's Bookings</div>
      {/* List provider bookings here */}
      <p className="lead">No bookings for today.</p>
    </div>
    <div className="card" style={{marginTop: '18px'}}>
      <div className="card-title">Earnings</div>
      <p className="lead">R0.00</p>
    </div>
  </div>
);

export default ProviderDashboard;