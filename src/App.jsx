import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import Products from './components/Products/Products';
import Service from './components/Service/Service';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Notification from './components/common/Notification/Notification';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
// import WishlistDrawer from './components/WishlistDrawer/WishlistDrawer'; // ✅ Remove this
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="App">
      <Header
        onScrollTo={scrollToSection}
        showNotification={showNotification}
      />

      {/* ✅ Remove WishlistDrawer */}
      {/* <WishlistDrawer /> */}

      <main>
        <Hero onScrollTo={scrollToSection} />
        <Categories onScrollTo={scrollToSection} />
        <Products
          showNotification={showNotification}
          setIsLoading={setIsLoading}
        />
        <Service />
        <About />
        <Contact showNotification={showNotification} />
      </main>

      <Footer onScrollTo={scrollToSection} />

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
