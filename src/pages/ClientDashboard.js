import React from 'react';

const ClientDashboard = ({ user }) => (
  <div className="container">
    <div className="brand-header">
      <div className="logo-circle">W</div>
      <div className="brand-title">Waasha</div>
      <div className="brand-slogan">Welcome, {user?.first_name || "Client"}!</div>
    </div>
    <div className="card">
      <div className="card-title">Your Bookings</div>
      {/* List bookings here */}
      <p className="lead">You have no bookings yet.</p>
      <button className="btn primary">Book a Service</button>
    </div>
    <div className="card" style={{marginTop: '18px'}}>
      <div className="card-title">Favorite Providers</div>
      {/* List favorites here */}
      <p className="lead">No favorites yet.</p>
    </div>
  </div>
);

export default ClientDashboard;