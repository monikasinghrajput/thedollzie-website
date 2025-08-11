import React from 'react';
import './Hero.css';

const Hero = ({ onScrollTo }) => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title fade-in-up">From Our Hands to Your Heart</h1>
          <p className="hero-subtitle fade-in-up">Handcrafted with love, designed for your home</p>
          
          <div className="hero-buttons fade-in-up">
            <button 
              className="cta-btn primary" 
              onClick={() => onScrollTo('products')}
            >
              <i className="fas fa-shopping-bag"></i>
              Shop Now
            </button>
            <button 
              className="cta-btn secondary" 
              onClick={() => onScrollTo('categories')}
            >
              <i className="fas fa-eye"></i>
              View Categories
            </button>
          </div>
        </div>

        <div className="hero-stats fade-in-up">
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Unique Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Handmade</span>
          </div>
        </div>
      </div>
      
      <div className="hero-bg-animation"></div>
    </section>
  );
};

export default Hero;