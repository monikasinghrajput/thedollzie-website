import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import Products from './components/Products/Products';
import Service from './components/Service/Service';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import Notification from './components/common/Notification/Notification';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import { useCart } from './hooks/useCart';
import WishlistDrawer from './components/WishlistDrawer/WishlistDrawer';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  /* 🔗 CONNECT global events with cart hook */
  useEffect(() => {
    const onAdd = (e) => {
      const it = e.detail;
      if (!it) return;
      // ensure fields hook expects
      addToCart({
        id: it.id,
        title: it.title,
        image: it.image,
        quantity: it.quantity || 1,
        price: it.price || 0,
      });
    };
    const onRemove = (e) => {
      const { id } = e.detail || {};
      if (!id) return;
      removeFromCart(id);
    };
    window.addEventListener('cart:add', onAdd);
    window.addEventListener('cart:remove', onRemove);
    return () => {
      window.removeEventListener('cart:add', onAdd);
      window.removeEventListener('cart:remove', onRemove);
    };
  }, [addToCart, removeFromCart]);

  return (
    <div className="App">
      <Header
        cart={cart}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onScrollTo={scrollToSection}
      />

      {/* Wishlist Drawer mounts once */}
      <WishlistDrawer />

      <main>
        <Hero onScrollTo={scrollToSection} />
        <Categories onScrollTo={scrollToSection} />
        <Products
          onAddToCart={addToCart}
          showNotification={showNotification}
          setIsLoading={setIsLoading}
        />
        <Service />
        <About />
        <Contact showNotification={showNotification} />
      </main>

      <Footer onScrollTo={scrollToSection} />

      <Cart
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        showNotification={showNotification}
      />

      <div className="notification-container">
        {notifications.map(n => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default App;
