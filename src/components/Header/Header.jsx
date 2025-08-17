import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = ({ onScrollTo, showNotification }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    onScrollTo?.(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        {/* Logo */}
        <div className="nav-brand">
          <img
            src="/image/Dollzie_Logo-03-02.png"
            alt="Dollzie Logo"
            className="logo"
            onClick={() => handleNavClick({ preventDefault: () => {} }, "home")}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const textLogo = e.currentTarget.parentNode.querySelector(".logo-text");
              if (textLogo) textLogo.style.display = "block";
            }}
          />
          <div className="logo-text" style={{ display: "none" }}>
            <h2>DOLLZIE</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`navbar ${isMobileMenuOpen ? "mobile-active" : ""}`}>
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => handleNavClick(e, "home")}>Home</a></li>
            <li><a href="#products" onClick={(e) => handleNavClick(e, "products")}>Products</a></li>
            <li><a href="#categories" onClick={(e) => handleNavClick(e, "categories")}>Categories</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick(e, "about")}>About</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, "contact")}>Contact</a></li>
          </ul>
        </nav>

        {/* Actions - No wishlist button */}
        <div className="actions">
          {/* Mobile menu toggle */}
          <button
            className={`mobile-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="mobile-nav">
            <a href="#home" onClick={(e) => handleNavClick(e, "home")}>
              <i className="fas fa-home"></i>Home
            </a>
            <a href="#products" onClick={(e) => handleNavClick(e, "products")}>
              <i className="fas fa-box"></i>Products
            </a>
            <a href="#categories" onClick={(e) => handleNavClick(e, "categories")}>
              <i className="fas fa-th-large"></i>Categories
            </a>
            <a href="#about" onClick={(e) => handleNavClick(e, "about")}>
              <i className="fas fa-info-circle"></i>About
            </a>
            <a href="#contact" onClick={(e) => handleNavClick(e, "contact")}>
              <i className="fas fa-envelope"></i>Contact
            </a>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
