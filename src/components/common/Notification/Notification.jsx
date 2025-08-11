import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification
    setTimeout(() => setIsVisible(true), 100);
    
    // Hide notification after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-bell';
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <i className={getIcon()}></i>
        <span className="notification-message">{message}</span>
        <button 
          className="notification-close"
          onClick={() => setIsVisible(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="notification-progress"></div>
    </div>
  );
};

export default Notification;