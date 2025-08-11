import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, showNotification, animationDelay = 0 }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const generateStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    showNotification(`${product.title} added to cart!`, 'success');
  };

  const handleWishlist = () => {
    setIsWishlist(!isWishlist);
    showNotification(
      `${product.title} ${isWishlist ? 'removed from' : 'added to'} wishlist!`, 
      'info'
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Product link copied to clipboard!', 'success');
    }
  };

  const PurchaseModal = () => (
    <div className="purchase-options-modal show">
      <div className="purchase-modal-content">
        <div className="modal-header">
          <h3><i className="fas fa-shopping-bag"></i> Where to Buy</h3>
          <button 
            className="close-purchase-modal"
            onClick={() => setShowPurchaseModal(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="product-mini-info">
          <img src={product.image} alt={product.title} />
          <div>
            <h4>{product.title}</h4>
            <span className="price">₹{product.price.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="purchase-options">
          <button 
            className="purchase-option direct-buy"
            onClick={() => {
              handleAddToCart();
              setShowPurchaseModal(false);
            }}
          >
            <div className="option-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div className="option-details">
              <h4>Buy from Our Store</h4>
              <p>Direct purchase with fast delivery</p>
              <span className="benefit">✓ Free shipping above ₹999</span>
            </div>
            <div className="option-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </button>
          
          <button 
            className="purchase-option whatsapp-buy"
            onClick={() => {
              const message = `Hi! I'm interested in ${product.title} (₹${product.price})`;
              window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`);
              setShowPurchaseModal(false);
            }}
          >
            <div className="option-icon">
              <i className="fab fa-whatsapp"></i>
            </div>
            <div className="option-details">
              <h4>Order via WhatsApp</h4>
              <p>Personalized assistance and custom orders</p>
              <span className="benefit">✓ Custom modifications available</span>
            </div>
            <div className="option-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="product-card fade-in-up"
        style={{ animationDelay: `${animationDelay}s` }}
      >
        {product.badge && <div className="product-badge">{product.badge}</div>}
        
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-image"
            loading="lazy"
          />
          <div className="product-overlay">
            <button 
              className="overlay-btn quick-view-btn"
              onClick={() => showNotification('Quick view coming soon!', 'info')}
              title="Quick View"
            >
              <i className="fas fa-eye"></i>
            </button>
            <button 
              className={`overlay-btn wishlist-btn ${isWishlist ? 'active' : ''}`}
              onClick={handleWishlist}
              title="Add to Wishlist"
            >
              <i className="fas fa-heart"></i>
            </button>
            <button 
              className="overlay-btn share-btn"
              onClick={handleShare}
              title="Share"
            >
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
          <div className="product-stroke-border"></div>
        </div>
        
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          
          <div className="product-rating">
            <div className="stars">
              {generateStars(product.rating)}
            </div>
            <span className="rating-text">({product.reviews} reviews)</span>
          </div>
          
          <div className="product-price">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                <span className="discount-badge">{discount}% OFF</span>
              </>
            )}
          </div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-actions">
            <button 
              className="add-to-cart-btn"
              onClick={() => setShowPurchaseModal(true)}
            >
              <i className="fas fa-shopping-cart"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showPurchaseModal && <PurchaseModal />}
    </>
  );
};

export default ProductCard;