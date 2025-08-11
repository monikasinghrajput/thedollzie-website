import React from 'react';
import { useInView } from 'react-intersection-observer';
import './Categories.css';

const Categories = ({ onScrollTo }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const categories = [
    {
      id: 'home-decor',
      title: '🎨 Home Decor',
      icon: 'fas fa-home',
      image: 'https://i.pinimg.com/736x/61/3e/ac/613eac53d2232118d9092a4958e2e4ee.jpg'
    },
    {
      id: 'keychains',
      title: '🗝️ Keychains',
      icon: 'fas fa-key',
      image: 'https://i.pinimg.com/1200x/20/fb/7c/20fb7c342c2595e3bb0cbb96545a55ae.jpg'
    },
    {
      id: 'mini-decor',
      title: '✨ Mini Gifts',
      icon: 'fas fa-gift',
      image: 'https://i.pinimg.com/1200x/17/0d/ce/170dceac95d7d3421eea8126c3758749.jpg'
    },
    {
      id: 'trending',
      title: '🔥 Trending',
      icon: 'fas fa-fire',
      image: 'https://i.pinimg.com/736x/ae/99/db/ae99db2c918c9b0fe1a4743613bd3384.jpg',
      isTrending: true
    },
    {
      id: 'jewelry',
      title: '💎 Jewelry',
      icon: 'fas fa-gem',
      image: 'https://i.pinimg.com/736x/b4/fc/8f/b4fc8fea076fa39450248cc7bc2e9045.jpg'
    },
    {
      id: 'bags-accessories',
      title: '👜 Bags & More',
      icon: 'fas fa-shopping-bag',
      image: 'https://i.pinimg.com/736x/e6/e6/e6/e6e6e6a504e7515b22094e2be82504af.jpg'
    }
  ];

  const handleCategoryClick = (categoryId) => {
    onScrollTo('products');
    const event = new CustomEvent('filterProducts', { 
      detail: { category: categoryId } 
    });
    window.dispatchEvent(event);
  };

  return (
    <section id="categories" className="categories-section" ref={ref}>
      <div className="container">
        <div className={`section-header ${inView ? 'fade-in-up' : ''}`}>
          <h2 className="section-title">Our Handmade Categories</h2>
          <p className="section-subtitle">Discover our beautiful collection of handcrafted treasures</p>
        </div>
        
        <div className="categories-showcase">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className={`category-card-compact ${inView ? 'fade-in-up' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
              data-category={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-visual">
                <div className={`category-icon-modern ${category.isTrending ? 'trending' : ''}`}>
                  <i className={category.icon}></i>
                </div>
                <div className="category-image">
                  <img src={category.image} alt={category.title} />
                  <div className="image-overlay"></div>
                </div>
              </div>
              
              <div className="category-content">
                <h3>{category.title}</h3>
                <button 
                  className={`category-explore-btn ${category.isTrending ? 'trending' : ''}`}
                >
                  <span>Explore</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`categories-stats ${inView ? 'fade-in-up' : ''}`}>
          <div className="stat-item">
            <div className="stat-number">80+</div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">6</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Handmade</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;