import React from 'react';
import { useInView } from 'react-intersection-observer';
import './About.css';

const About = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const journeyItems = [
    {
      icon: 'fas fa-seedling',
      title: 'Our Beginning',
      description: 'Started with a passion to preserve traditional craftsmanship'
    },
    {
      icon: 'fas fa-hands-helping',
      title: 'Supporting Artisans',
      description: 'Empowering local craftspeople and keeping traditions alive'
    },
    {
      icon: 'fas fa-heart',
      title: 'Made with Love',
      description: 'Every piece carries the warmth and care of human hands'
    }
  ];

  const features = [
    {
      icon: 'fas fa-hand-sparkles',
      title: '100% Handcrafted',
      description: 'Every product is made entirely by hand'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Eco-Friendly',
      description: 'Sustainable materials and processes'
    }
  ];

  const badges = [
    { icon: 'fas fa-award', label: 'Quality Assured' },
    { icon: 'fas fa-shipping-fast', label: 'Fast Delivery' },
    { icon: 'fas fa-star', label: '5-Star Rated' }
  ];

  return (
    <section id="about" className="about-section" ref={ref}>
      <div className="container">
        <div className="about-content">
          <div className={`about-text ${inView ? 'fade-in-up' : ''}`}>
            <span className="section-badge">About Us</span>
            <h2>Our Story</h2>
            <p className="about-intro">
              We don't just create products. We create joy, memories, and magic — all with our hands.
              At Dollzie, we believe in the soulful charm of handmade. What began as a passion project 
              now brings joy to hundreds across India. Every piece is designed with love, shaped by skill, 
              and delivered to light up your space.
            </p>
            
            <div className="about-journey">
              {journeyItems.map((item, index) => (
                <div 
                  key={index}
                  className={`journey-item ${inView ? 'slide-in-left' : ''}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="journey-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="journey-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="about-features">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`about-feature ${inView ? 'slide-in-left' : ''}`}
                  style={{ animationDelay: `${(index + 3) * 0.2}s` }}
                >
                  <div className="feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <div className="feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`about-visual ${inView ? 'slide-in-right' : ''}`}>
            <div className="about-gallery">
              <div className="gallery-main">
                <img 
                  src="https://i.pinimg.com/736x/88/3f/da/883fdacdfd4df366dbcf57a919fd335f.jpg" 
                  alt="Artisan at work" 
                />
              </div>
              <div className="gallery-side">
                <img 
                  src="https://i.pinimg.com/736x/05/77/02/0577029a2b436af69c5513bcdb6c49ea.jpg" 
                  alt="Handmade crafts" 
                />
                <img 
                  src="https://i.pinimg.com/1200x/69/f0/ec/69f0ecae97f1b73f43211088dde5ba10.jpg" 
                  alt="Traditional art" 
                />
              </div>
            </div>
            
            <div className="about-badges">
              {badges.map((badge, index) => (
                <div key={index} className="badge-item">
                  <i className={badge.icon}></i>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;