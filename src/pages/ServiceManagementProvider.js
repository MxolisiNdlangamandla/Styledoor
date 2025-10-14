import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

function ProviderServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Load saved services from localStorage
    const savedServices = localStorage.getItem('providerServices');
    if (savedServices) {
      const serviceData = JSON.parse(savedServices);
      const activeServices = Object.keys(serviceData).filter(key => serviceData[key]);
      setServices(activeServices);
    }
  }, []);

  const serviceNames = {
    hair: 'Hair Service',
    nails: 'Nails',
    facials: 'Facials',
    massages: 'Massages',
    makeup: 'Makeup',
    carwash: 'Carwash'
  };

  const serviceIcons = {
    hair: '✂️',
    nails: '💅',
    facials: '🧖‍♀️',
    massages: '💆‍♀️',
    makeup: '💄',
    carwash: '🚗'
  };

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <Link to="/provider" className="back-link">←</Link>
        <h1 className="dashboard-title">Services</h1>
        <div></div>
      </div>

      <div className="dashboard-content">
        <div className="services-content">
          <h3>Your Active Services</h3>
          
          {services.length === 0 ? (
            <div className="empty-state">
              <p>No services configured yet.</p>
              <Link to="/choose-services" className="btn primary">
                Add Services
              </Link>
            </div>
          ) : (
            <>
              <div className="services-list">
                {services.map(serviceId => (
                  <div key={serviceId} className="service-card">
                    <div className="service-info">
                      <span className="service-icon">{serviceIcons[serviceId]}</span>
                      <span className="service-name">{serviceNames[serviceId]}</span>
                    </div>
                    <Link 
                      to={`/provider/services/${serviceId}`} 
                      className="service-manage-btn"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
              
              <Link to="/choose-services" className="add-service-btn">
                + Add More Services
              </Link>
            </>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default ProviderServices;