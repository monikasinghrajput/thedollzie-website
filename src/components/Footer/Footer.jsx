import React from 'react';
import './Footer.css';

const Footer = ({ onScrollTo }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/image/Dollzie_Logo-03-02.png" alt="Dollzie" className="footer-logo-img" />
              <h3>Dollzie</h3>
            </div>
            <p>Creating beautiful handmade products with traditional craftsmanship and modern design. From our hands to your heart.</p>
            <div className="footer-social">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-whatsapp"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home" onClick={() => onScrollTo('home')}>Home</a></li>
              <li><a href="#products" onClick={() => onScrollTo('products')}>Products</a></li>
              <li><a href="#categories" onClick={() => onScrollTo('categories')}>Categories</a></li>
              <li><a href="#about" onClick={() => onScrollTo('about')}>About Us</a></li>
              <li><a href="#contact" onClick={() => onScrollTo('contact')}>Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><a href="#">Home Decor</a></li>
              <li><a href="#">Keychains</a></li>
              <li><a href="#">Mini Decor</a></li>
              <li><a href="#">Trending</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Customer Care</h4>
            <ul>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Custom Orders</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Size Guide</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Dollzie. All rights reserved. | Made with ❤️ in India</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;