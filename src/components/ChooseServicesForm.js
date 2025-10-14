import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChooseServicesForm() {
  const navigate = useNavigate();
  
  const [selectedServices, setSelectedServices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    { id: 'hair', name: 'Hair Service', icon: '✂️' },
    { id: 'nails', name: 'Nails', icon: '💅' },
    { id: 'facials', name: 'Facials', icon: '🧖‍♀️' },
    { id: 'massages', name: 'Massages', icon: '💆‍♀️' },
    { id: 'makeup', name: 'Makeup', icon: '💄' },
    { id: 'carwash', name: 'Carwash', icon: '🚗' }
  ];

  const handleToggle = (serviceId) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
    if (error) setError('');
  };

  const handleServiceClick = (serviceId) => {
    if (selectedServices[serviceId]) {
      // Navigate to specific service page
      navigate(`/provider/services/${serviceId}`);
    }
  };

  const handleSave = async () => {
    const activeServices = Object.keys(selectedServices).filter(
      serviceId => selectedServices[serviceId]
    );

    if (activeServices.length === 0) {
      setError('Please select at least one service to continue');
      return;
    }

    setLoading(true);
    
    try {
      // Save services to backend (we'll implement this later)
      localStorage.setItem('providerServices', JSON.stringify(selectedServices));
      
      // Navigate to provider dashboard
      navigate('/provider', {
        state: {
          message: 'Services configured successfully! Welcome to your dashboard.'
        }
      });
    } catch (err) {
      setError('Failed to save services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="choose-services">
      <div className="choose-services-header">
        <h2>What service do you offer ?</h2>
      </div>

      {error && (
        <div className="error-message" style={{
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <div className="services-list">
        {services.map(service => (
          <div key={service.id} className="service-item">
            <div 
              className={`service-content ${selectedServices[service.id] ? 'active' : 'inactive'}`}
              onClick={() => handleServiceClick(service.id)}
              style={{ 
                cursor: selectedServices[service.id] ? 'pointer' : 'default',
                opacity: selectedServices[service.id] ? 1 : 0.6 
              }}
            >
              <span className="service-icon">{service.icon}</span>
              <span className="service-name">{service.name}</span>
            </div>
            
            <div className="toggle-switch" onClick={() => handleToggle(service.id)}>
              <div className={`toggle ${selectedServices[service.id] ? 'on' : 'off'}`}>
                <div className="toggle-handle"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ NEW: Add a New Service Button */}
      <button
        onClick={() => navigate('/add-service')}
        className="btn btn-outline"
        style={{
          marginTop: '20px',
          marginBottom: '12px',
          width: '100%',
          padding: '14px 24px',
          fontSize: '16px',
          fontWeight: '600',
          border: '2px solid #1976d2',
          background: 'white',
          color: '#1976d2',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#1976d2';
          e.currentTarget.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = '#1976d2';
        }}
      >
        + Add a New Service
      </button>

      <button 
        className="save-button"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'SAVING...' : 'SAVE'}
      </button>
    </div>
  );
}

export default ChooseServicesForm;