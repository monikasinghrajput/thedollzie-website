import React, { useState, useEffect } from "react";
import "./Header.css";

/** localStorage helpers */
const LS_CART_KEY = "app_cart";
const LS_WISHLIST_KEY = "app_wishlist";
const readLS = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};
const writeLS = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

const Header = ({ cart, onCartToggle, onScrollTo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persisted states for badges
  const [persistCart, setPersistCart] = useState(() => readLS(LS_CART_KEY, []));
  const [wishlist, setWishlist] = useState(() => readLS(LS_WISHLIST_KEY, []));

  // sync external cart (from hook) -> LS + local
  useEffect(() => {
    if (Array.isArray(cart)) {
      writeLS(LS_CART_KEY, cart);
      setPersistCart(cart);
    }
  }, [cart]);

  // header scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // listen global cart/wishlist events so badges stay updated
  useEffect(() => {
    const addCart = (e) => {
      const item = e.detail; if (!item) return;
      setPersistCart(prev => {
        const found = prev.find(p => p.id === item.id);
        const next = found
          ? prev.map(p => p.id === item.id ? { ...p, quantity: (p.quantity || 1) + (item.quantity || 1) } : p)
          : [...prev, { ...item, quantity: item.quantity || 1 }];
        writeLS(LS_CART_KEY, next);
        return next;
      });
    };
    const removeCart = (e) => {
      const { id } = e.detail || {}; if (!id) return;
      setPersistCart(prev => {
        const next = prev.filter(p => p.id !== id);
        writeLS(LS_CART_KEY, next);
        return next;
      });
    };
    const addWish = (e) => {
      const item = e.detail; if (!item) return;
      setWishlist(prev => {
        if (prev.some(p => p.id === item.id)) return prev;
        const next = [...prev, item];
        writeLS(LS_WISHLIST_KEY, next);
        return next;
      });
    };
    const removeWish = (e) => {
      const { id } = e.detail || {}; if (!id) return;
      setWishlist(prev => {
        const next = prev.filter(p => p.id !== id);
        writeLS(LS_WISHLIST_KEY, next);
        return next;
      });
    };
    const toggleWish = (e) => {
      const item = e.detail; if (!item) return;
      setWishlist(prev => {
        const exists = prev.some(p => p.id === item.id);
        const next = exists ? prev.filter(p => p.id !== item.id) : [...prev, item];
        writeLS(LS_WISHLIST_KEY, next);
        return next;
      });
    };

    window.addEventListener("cart:add", addCart);
    window.addEventListener("cart:remove", removeCart);
    window.addEventListener("wishlist:add", addWish);
    window.addEventListener("wishlist:remove", removeWish);
    window.addEventListener("wishlist:toggle", toggleWish);
    return () => {
      window.removeEventListener("cart:add", addCart);
      window.removeEventListener("cart:remove", removeCart);
      window.removeEventListener("wishlist:add", addWish);
      window.removeEventListener("wishlist:remove", removeWish);
      window.removeEventListener("wishlist:toggle", toggleWish);
    };
  }, []);

  const cartItemCount = persistCart?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0;
  const wishCount = wishlist?.length || 0;

  const handleNavClick = (e, id) => {
    e.preventDefault();
    onScrollTo?.(id);
    setIsMobileMenuOpen(false);
  };

  // open Wishlist Drawer
  const onWishlistToggle = () => {
    window.dispatchEvent(new CustomEvent("ui:wishlist:toggle"));
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        {/* 1. LOGO */}
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

        {/* 2. NAVIGATION */}
        <nav className={`navbar ${isMobileMenuOpen ? "mobile-active" : ""}`}>
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => handleNavClick(e, "home")}>Home</a></li>
            <li><a href="#products" onClick={(e) => handleNavClick(e, "products")}>Products</a></li>
            <li><a href="#categories" onClick={(e) => handleNavClick(e, "categories")}>Categories</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick(e, "about")}>About</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, "contact")}>Contact</a></li>
          </ul>
        </nav>

        {/* 3. ACTIONS */}
        <div className="actions">
          {/* Wishlist button */}
          <button
            className="action-btn"
            onClick={onWishlistToggle}
            title="Wishlist"
            aria-label="Open wishlist"
          >
            <i className="fas fa-heart"></i>
            <span className="action-label">Wishlist</span>
            {wishCount > 0 && (
              <span className="badge alt">{wishCount > 99 ? "99+" : wishCount}</span>
            )}
          </button>

          {/* Cart button (with label) */}
          <button
            className="action-btn"
            onClick={onCartToggle}
            title="Shopping Cart"
            aria-label="Open cart"
          >
            <i className="fas fa-shopping-cart"></i>
            <span className="action-label">Cart</span>
            {cartItemCount > 0 && (
              <span className="badge">{cartItemCount > 99 ? "99+" : cartItemCount}</span>
            )}
          </button>

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
            <a href="#home" onClick={(e) => handleNavClick(e, "home")}><i className="fas fa-home"></i>Home</a>
            <a href="#products" onClick={(e) => handleNavClick(e, "products")}><i className="fas fa-box"></i>Products</a>
            <a href="#categories" onClick={(e) => handleNavClick(e, "categories")}><i className="fas fa-th-large"></i>Categories</a>
            <a href="#about" onClick={(e) => handleNavClick(e, "about")}><i className="fas fa-info-circle"></i>About</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, "contact")}><i className="fas fa-envelope"></i>Contact</a>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
