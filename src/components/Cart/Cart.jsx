import React from 'react';
import './Cart.css';

const Cart = ({ isOpen, cart, onClose, onUpdateQuantity, onRemoveItem, showNotification }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'error');
      return;
    }
    
    showNotification('Order placed successfully! 🎉', 'success');
    onClose();
    
    setTimeout(() => {
      alert(`Thank you for your order!\nTotal: ₹${total.toLocaleString()}\n\nYour handmade treasures will be delivered soon!`);
    }, 1000);
  };

  return (
    <>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3><i className="fas fa-shopping-cart"></i> Shopping Cart</h3>
          <button className="close-cart" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started</p>
              <button className="browse-btn" onClick={onClose}>
                <i className="fas fa-shopping-bag"></i>
                Browse Products
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                  <div className="cart-item-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="cart-item-subtotal">
                    Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="cart-total">
                <span>Total: ₹{total.toLocaleString()}</span>
              </div>
              <div className="cart-actions">
                <button className="view-cart-btn" onClick={onClose}>
                  <i className="fas fa-eye"></i> Continue Shopping
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  <i className="fas fa-credit-card"></i> Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isOpen && <div className="overlay" onClick={onClose}></div>}
    </>
  );
};

export default Cart;