import React, { useState, useEffect, useRef } from 'react';
import './Products.css';

/* ===== ProductCard Component ===== */
const ProductCard = ({ product, showNotification, animationDelay = 0 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);
  const [dirUp, setDirUp] = useState(true);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowShopMenu(false);
      }
    };
    if (showShopMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showShopMenu]);

  // Close menu on Esc
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setShowShopMenu(false);
    if (showShopMenu) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [showShopMenu]);

  // Menu direction detection
  const checkMenuDirection = () => {
    if (!menuRef.current) return;
    
    const trigger = menuRef.current.querySelector('.shop-now-trigger');
    if (!trigger) return;
    
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    
    const menuHeight = 150;
    const canShowAbove = spaceAbove >= menuHeight;
    const canShowBelow = spaceBelow >= menuHeight;
    
    if (canShowAbove) {
      setDirUp(true);
    } else if (canShowBelow) {
      setDirUp(false);
    } else {
      setDirUp(true);
    }
  };

  useEffect(() => {
    if (showShopMenu) {
      setTimeout(checkMenuDirection, 10);
    }
  }, [showShopMenu]);

  const handleShopNow = async (platform) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (platform === 'meesho' && product.meeshoLink) {
        window.open(product.meeshoLink, '_blank', 'noopener,noreferrer');
      } else if (platform === 'etsy' && product.etsyLink) {
        window.open(product.etsyLink, '_blank', 'noopener,noreferrer');
      }
      showNotification?.(`Opening ${platform} for ${product.title}!`, 'success');
    } catch (e) {
      showNotification?.('Unable to open link. Try again.', 'error');
    } finally {
      setIsLoading(false);
      setShowShopMenu(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.title,
          url: window.location.href
        });
      } else {
        const shareText = `${product.title} — ${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        showNotification?.('Link copied to clipboard!', 'success');
      }
    } catch {
      showNotification?.('Share canceled.', 'info');
    }
  };

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="product-card" style={{ animationDelay: `${animationDelay}s` }}>
      {/* Badges */}
      <div className="product-badges">
        {product.isNew && <span className="badge new-badge">New</span>}
        {product.isTrending && <span className="badge trending-badge">🔥 Trending</span>}
        {discountPercentage > 0 && <span className="badge discount-badge">{discountPercentage}% Off</span>}
      </div>

      {/* Image */}
      <div className="product-image-container clip-rounded">
        <div className={`image-loader ${imageLoaded ? 'loaded' : ''}`}>
          <div className="image-skeleton"></div>
        </div>
        <img
          src={product.image}
          alt={product.title}
          className={`product-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = 'https://i.pinimg.com/736x/dd/77/55/dd7755a95dac607c7b9a26ff20b4c6b5.jpg';
            setImageLoaded(true);
          }}
        />

        {/* Overlay - Only Quick View and Share */}
        <div className="image-overlay">
          <div className="overlay-buttons">
            <button type="button" className="quick-view-btn" title="Quick View">
              <i className="fas fa-eye"></i>
            </button>

            <button type="button" className="share-btn" title="Share" onClick={handleShare}>
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info product-info--compact">
        <div className="product-category">
          <i className="fas fa-tag"></i>
          <span>{product.category.replace('-', ' ').toUpperCase()}</span>
        </div>

        <h3 className="product-title product-title--tight">{product.title}</h3>

        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <i key={index} className={`fas fa-star ${index < Math.floor(product.rating) ? 'filled' : ''}`}></i>
            ))}
            <span className="rating-text">({product.rating})</span>
          </div>
          <span className="review-count">{product.reviews} reviews</span>
        </div>

        <div className="product-pricing">
          <div className="price-container">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Shop Now Actions */}
        <div className="card-actions">
          <div className="shop-now-wrap" ref={menuRef}>
            <button
              type="button"
              className={`shop-now-trigger ${isLoading ? 'loading' : ''}`}
              onClick={() => setShowShopMenu((s) => !s)}
              aria-expanded={showShopMenu}
              aria-controls={`shop-menu-${product.id}`}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <strong>OPENING…</strong>
                </>
              ) : (
                <>
                  <i className="fas fa-shopping-cart"></i>
                  <strong>SHOP NOW</strong>
                </>
              )}
            </button>

            {showShopMenu && (
              <div
                id={`shop-menu-${product.id}`}
                className={`shop-menu ${dirUp ? 'up' : 'down'}`}
              >
                <button 
                  type="button" 
                  className="shop-menu-item etsy" 
                  onClick={() => handleShopNow('etsy')}
                >
                  <i className="fas fa-store"></i> 
                  Shop on Etsy
                </button>
                <button 
                  type="button" 
                  className="shop-menu-item meesho" 
                  onClick={() => handleShopNow('meesho')}
                >
                  <i className="fas fa-shopping-bag"></i> 
                  Shop on Meesho
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== Products Data - All 20 Products ===== */
const productsData = [
  // Home Decor
  {
    id: 1,
    title: "Handwoven Wall Hanging",
    description: "Beautiful macrame wall hanging perfect for living room decoration with intricate patterns",
    price: 899,
    originalPrice: 1199,
    image: "https://i.pinimg.com/736x/f8/83/46/f88346c9931fbd8e52b3e5d27a200a71.jpg",
    category: "home-decor",
    rating: 4.8,
    reviews: 45,
    meeshoLink: "https://meesho.com/wall-hanging",
    etsyLink: "https://etsy.com/wall-hanging",
    isNew: true
  },
  {
    id: 2,
    title: "Ceramic Flower Vase",
    description: "Elegant handcrafted ceramic vase with unique patterns and beautiful glazing finish",
    price: 649,
    originalPrice: 899,
    image: "https://i.pinimg.com/736x/77/0f/ca/770fcaa73bf83f197026d2f3fe602eb9.jpg",
    category: "home-decor",
    rating: 4.6,
    reviews: 32,
    meeshoLink: "https://meesho.com/ceramic-vase",
    etsyLink: "https://etsy.com/ceramic-vase",
    isTrending: true
  },
  {
    id: 3,
    title: "Wooden Photo Frame",
    description: "Rustic wooden photo frame with intricate hand carvings and natural wood finish",
    price: 499,
    originalPrice: 699,
    image: "https://i.pinimg.com/736x/43/a6/c2/43a6c2aea78cbe28475fe9f59b5f0dbf.jpg",
    category: "home-decor",
    rating: 4.7,
    reviews: 28,
    meeshoLink: "https://meesho.com/wooden-frame",
    etsyLink: "https://etsy.com/wooden-frame"
  },
  {
    id: 4,
    title: "Bamboo Table Lamp",
    description: "Eco-friendly bamboo table lamp with warm LED lighting and adjustable brightness",
    price: 1299,
    originalPrice: 1699,
    image: "https://i.pinimg.com/1200x/b2/f9/c1/b2f9c1a0b3e1e164564e632e90af192f.jpg",
    category: "home-decor",
    rating: 4.9,
    reviews: 56,
    meeshoLink: "https://meesho.com/bamboo-lamp",
    etsyLink: "https://etsy.com/bamboo-lamp",
    isNew: true
  },
  {
    id: 5,
    title: "Handmade Cushion Cover",
    description: "Colorful embroidered cushion cover with traditional Indian patterns and designs",
    price: 349,
    originalPrice: 499,
    image: "https://i.pinimg.com/736x/d7/c4/66/d7c46682d5bb16d617bfa0b1943c6ed9.jpg",
    category: "home-decor",
    rating: 4.5,
    reviews: 41,
    meeshoLink: "https://meesho.com/cushion-cover",
    etsyLink: "https://etsy.com/cushion-cover"
  },

  // Keychains
  {
    id: 6,
    title: "Leather Name Keychain",
    description: "Personalized leather keychain with custom name engraving and premium leather quality",
    price: 199,
    originalPrice: 299,
    image: "https://i.pinimg.com/736x/da/cc/43/dacc43e715a72c1bb1557225ce39a0b2.jpg",
    category: "keychains",
    rating: 4.8,
    reviews: 89,
    meeshoLink: "https://meesho.com/leather-keychain",
    etsyLink: "https://etsy.com/leather-keychain",
    isTrending: true
  },
  {
    id: 7,
    title: "Wooden Car Keychain",
    description: "Miniature wooden car keychain handcrafted with attention to detail and smooth finish",
    price: 149,
    originalPrice: 199,
    image: "https://i.pinimg.com/1200x/fe/96/a3/fe96a3c6fe353a246a74c27b779d90f3.jpg",
    category: "keychains",
    rating: 4.6,
    reviews: 67,
    meeshoLink: "https://meesho.com/wooden-keychain",
    etsyLink: "https://etsy.com/wooden-keychain"
  },
  {
    id: 8,
    title: "Metal Initial Keychain",
    description: "Elegant metal keychain with custom initial engraving and premium stainless steel material",
    price: 249,
    originalPrice: 349,
    image: "https://i.pinimg.com/1200x/8c/7a/b0/8c7ab070d36e3d9639a0b42eac2c514e.jpg",
    category: "keychains",
    rating: 4.7,
    reviews: 54,
    meeshoLink: "https://meesho.com/metal-keychain",
    etsyLink: "https://etsy.com/metal-keychain",
    isNew: true
  },
  {
    id: 9,
    title: "Beaded Tassel Keychain",
    description: "Colorful beaded keychain with decorative tassel and vibrant color combinations",
    price: 129,
    originalPrice: 179,
    image: "https://i.pinimg.com/736x/8f/d2/67/8fd267acb3b0b00ff2774588cb501c14.jpg",
    category: "keychains",
    rating: 4.4,
    reviews: 38,
    meeshoLink: "https://meesho.com/beaded-keychain",
    etsyLink: "https://etsy.com/beaded-keychain"
  },
  {
    id: 10,
    title: "Resin Art Keychain",
    description: "Beautiful resin art keychain with dried flowers inside transparent resin casting",
    price: 179,
    originalPrice: 249,
    image: "https://i.pinimg.com/736x/47/48/d6/4748d6459403d2230ca1f40c406b76a2.jpg",
    category: "keychains",
    rating: 4.9,
    reviews: 72,
    meeshoLink: "https://meesho.com/resin-keychain",
    etsyLink: "https://etsy.com/resin-keychain",
    isTrending: true
  },

  // Mini Decor
  {
    id: 11,
    title: "Mini Succulent Planter",
    description: "Cute ceramic mini planter perfect for succulents with drainage hole and included plant",
    price: 299,
    originalPrice: 399,
    image: "https://i.pinimg.com/736x/5a/9d/8c/5a9d8c7f4b2e9a6c3f8d5b1a7e4c9f6b.jpg",
    category: "mini-decor",
    rating: 4.6,
    reviews: 91,
    meeshoLink: "https://meesho.com/succulent-planter",
    etsyLink: "https://etsy.com/succulent-planter",
    isNew: true
  },
  {
    id: 12,
    title: "Miniature Fairy Garden",
    description: "Enchanting miniature fairy garden with tiny accessories, figurines and glass container",
    price: 599,
    originalPrice: 799,
    image: "https://i.pinimg.com/736x/2e/6f/4a/2e6f4a8c9b5d7f1c6a4e9b2f8c5a7d4e.jpg",
    category: "mini-decor",
    rating: 4.8,
    reviews: 63,
    meeshoLink: "https://meesho.com/fairy-garden",
    etsyLink: "https://etsy.com/fairy-garden",
    isTrending: true
  },
  {
    id: 13,
    title: "Tiny Buddha Statue",
    description: "Peaceful mini Buddha statue for meditation corner with hand painted details",
    price: 399,
    originalPrice: 549,
    image: "https://i.pinimg.com/736x/7c/1a/5f/7c1a5f9d8b4e2a6c9f3d7b5a1e8c4f9d.jpg",
    category: "mini-decor",
    rating: 4.7,
    reviews: 47,
    meeshoLink: "https://meesho.com/buddha-statue",
    etsyLink: "https://etsy.com/buddha-statue"
  },
  {
    id: 14,
    title: "Mini Dream Catcher",
    description: "Delicate mini dream catcher with colorful feathers and traditional beadwork",
    price: 199,
    originalPrice: 279,
    image: "https://i.pinimg.com/736x/4b/8e/3c/4b8e3c7a5f9d2c6e8a4f9b1d7c5e8a3f.jpg",
    category: "mini-decor",
    rating: 4.5,
    reviews: 35,
    meeshoLink: "https://meesho.com/dream-catcher",
    etsyLink: "https://etsy.com/dream-catcher"
  },
  {
    id: 15,
    title: "Glass Terrarium Globe",
    description: "Beautiful glass terrarium globe for air plants with hanging chain and modern design",
    price: 449,
    originalPrice: 599,
    image: "https://i.pinimg.com/736x/9f/2d/6a/9f2d6a8c5b4e7f1c3a9d6b5f2c8e4a7f.jpg",
    category: "mini-decor",
    rating: 4.9,
    reviews: 84,
    meeshoLink: "https://meesho.com/terrarium-globe",
    etsyLink: "https://etsy.com/terrarium-globe",
    isNew: true
  },

  // Trending
  {
    id: 16,
    title: "Macrame Plant Hanger",
    description: "Trending macrame plant hanger for indoor plants with cotton rope and boho style",
    price: 599,
    originalPrice: 799,
    image: "https://i.pinimg.com/736x/6a/4f/8c/6a4f8c9d2e7b5a1f6c9d4a8e7b2f5c9a.jpg",
    category: "trending",
    rating: 4.8,
    reviews: 156,
    meeshoLink: "https://meesho.com/plant-hanger",
    etsyLink: "https://etsy.com/plant-hanger",
    isTrending: true,
    isNew: true
  },
  {
    id: 17,
    title: "Resin Coasters Set",
    description: "Trending alcohol ink resin coasters set of 4 with heat resistant and unique patterns",
    price: 699,
    originalPrice: 999,
    image: "https://i.pinimg.com/736x/1d/9c/7e/1d9c7e5a8b4f2c9d6e3a7f5c8b1d9e4a.jpg",
    category: "trending",
    rating: 4.9,
    reviews: 203,
    meeshoLink: "https://meesho.com/resin-coasters",
    etsyLink: "https://etsy.com/resin-coasters",
    isTrending: true
  },
  {
    id: 18,
    title: "Polymer Clay Earrings",
    description: "Handmade polymer clay earrings in geometric design with lightweight and hypoallergenic materials",
    price: 399,
    originalPrice: 549,
    image: "https://i.pinimg.com/736x/8e/5a/2f/8e5a2f7c4b9d6a1e8c5f2a9d7b4e6c8a.jpg",
    category: "trending",
    rating: 4.7,
    reviews: 127,
    meeshoLink: "https://meesho.com/clay-earrings",
    etsyLink: "https://etsy.com/clay-earrings",
    isTrending: true
  },
  {
    id: 19,
    title: "Scented Soy Candle",
    description: "Hand-poured soy candle with natural essential oils and 40 hour burn time",
    price: 499,
    originalPrice: 699,
    image: "https://i.pinimg.com/736x/3a/7f/5c/3a7f5c8d9b2e4a6f9c7d3b5e8a1f4c9d.jpg",
    category: "trending",
    rating: 4.8,
    reviews: 189,
    meeshoLink: "https://meesho.com/soy-candle",
    etsyLink: "https://etsy.com/soy-candle",
    isTrending: true,
    isNew: true
  },
  {
    id: 20,
    title: "Customized Phone Case",
    description: "Personalized phone case with your photo or design with durable material and HD print",
    price: 599,
    originalPrice: 799,
    image: "https://i.pinimg.com/736x/5c/8f/1a/5c8f1a4d7b9e2c6a8f5d1b4e7a9c5f8d.jpg",
    category: "trending",
    rating: 4.6,
    reviews: 245,
    meeshoLink: "https://meesho.com/phone-case",
    etsyLink: "https://etsy.com/phone-case",
    isTrending: true
  }
];

/* ===== Main Products Component ===== */
const Products = ({ showNotification, setIsLoading }) => {
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [displayCount, setDisplayCount] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');

  const filters = [
    { id: 'all', label: 'All Products', icon: 'fas fa-th' },
    { id: 'home-decor', label: 'Home Decor', icon: 'fas fa-home' },
    { id: 'keychains', label: 'Keychains', icon: 'fas fa-key' },
    { id: 'mini-decor', label: 'Mini Decor', icon: 'fas fa-gift' },
    { id: 'trending', label: 'Trending', icon: 'fas fa-fire' }
  ];

  useEffect(() => {
    const handleFilterProducts = (event) => {
      const category = event.detail.category;
      handleFilterChange(category);
    };

    window.addEventListener('filterProducts', handleFilterProducts);
    return () => window.removeEventListener('filterProducts', handleFilterProducts);
  }, []);

  useEffect(() => {
    let result = productsData;

    if (activeFilter !== 'all') {
      result = result.filter(product => product.category === activeFilter);
    }

    if (searchTerm) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result = sortProducts(result, sortBy);
    setFilteredProducts(result);
  }, [activeFilter, sortBy, searchTerm]);

  const sortProducts = (arr, sortType) => {
    const sorted = [...arr];
    switch (sortType) {
      case 'price-low': return sorted.sort((a, b) => a.price - b.price);
      case 'price-high': return sorted.sort((a, b) => b.price - a.price);
      case 'name': return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'popular': return sorted.sort((a, b) => b.reviews - a.reviews);
      case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
      default: return sorted;
    }
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setDisplayCount(9);
  };

  const handleSortChange = (e) => setSortBy(e.target.value);

  const handleLoadMore = () => {
    setIsLoading?.(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 9);
      setIsLoading?.(false);
    }, 500);
  };

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMoreProducts = filteredProducts.length > displayCount;

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return productsData.length;
    return productsData.filter(p => p.category === categoryId).length;
  };

  return (
    <section id="products" className="products-section">
      <div className="container">
        <h2 className="section-title">🎨 OUR HANDMADE COLLECTION</h2>
        <p className="section-subtitle">✨ Discover {productsData.length} unique handcrafted items made with love ✨</p>

        <div className="products-header">
          <div className="category-filter">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter.id)}
              >
                <i className={filter.icon}></i>
                <span className="filter-text">
                  <strong>{filter.label}</strong>
                  <span className="filter-count">({getCategoryCount(filter.id)})</span>
                </span>
              </button>
            ))}
          </div>

          <div className="sort-filter">
            <select value={sortBy} onChange={handleSortChange}>
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
        </div>

        <div className="products-search">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="🔍 Search from 20+ amazing products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {searchTerm && (
            <p className="search-info">
              <strong>Found {filteredProducts.length} products for "{searchTerm}"</strong>
            </p>
          )}
        </div>

        {displayedProducts.length === 0 ? (
          <div className="no-products">
            <i className="fas fa-search"></i>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button
              className="reset-filters-btn"
              onClick={() => {
                setActiveFilter('all');
                setSearchTerm('');
                setSortBy('default');
              }}
            >
              <i className="fas fa-refresh"></i>
              <strong>RESET ALL FILTERS</strong>
            </button>
          </div>
        ) : (
          <>
            <div className="products-stats">
              <p className="showing-products">
                <strong>📦 Showing {displayedProducts.length} of {filteredProducts.length} products</strong>
                {activeFilter !== 'all' && (
                  <span className="active-filter"> in <strong>{filters.find(f => f.id === activeFilter)?.label}</strong></span>
                )}
              </p>
            </div>

            <div className="products-grid">
              {displayedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showNotification={showNotification}
                  animationDelay={index * 0.06}
                />
              ))}
            </div>

            {hasMoreProducts && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={handleLoadMore}>
                  <i className="fas fa-plus"></i>
                  <strong>LOAD MORE PRODUCTS ({filteredProducts.length - displayCount} remaining)</strong>
                </button>
              </div>
            )}

            <div className="products-footer">
              <div className="total-products">
                <i className="fas fa-heart"></i>
                <span><strong>All {productsData.length} products are handmade with love ❤️</strong></span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
