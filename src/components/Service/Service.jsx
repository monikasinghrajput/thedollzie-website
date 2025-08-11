import React, { memo, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import './Service.css';

/** Single card – memoized to avoid re-renders */
const ServiceCard = memo(function ServiceCard({ icon, title, description, delay, inView }) {
  return (
    <div
      className={`service-item reveal ${inView ? 'in' : ''}`}
      style={{ '--delay': `${delay}s` }}
    >
      <div className="service-icon" aria-hidden="true">
        <i className={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
});

const Service = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '120px 0px', // pre-trigger for smoother entry
  });

  // useMemo so array/object identity is stable
  const services = useMemo(() => ([
    { icon: 'fas fa-palette',       title: 'Custom Designs',
      description: 'We create personalized handmade items tailored to your preferences and style.' },
    { icon: 'fas fa-recycle',       title: 'Eco-Friendly Crafts',
      description: 'Using sustainable materials and eco-conscious methods in all our creations.' },
    { icon: 'fas fa-shipping-fast', title: 'Quick Delivery',
      description: 'Fast and secure shipping to bring your handmade treasures to your doorstep.' },
    { icon: 'fas fa-heart',         title: 'Made with Love',
      description: 'Every piece is crafted with passion, attention to detail, and genuine care.' },
    { icon: 'fas fa-star',          title: 'Limited Edition Pieces',
      description: 'Exclusive handmade creations available in small batches, ensuring uniqueness.' },
    { icon: 'fas fa-globe',         title: 'Global Shipping',
      description: 'Delivering our handmade creations worldwide with careful packaging.' },
  ]), []);

  return (
    <section className="Service-section" ref={ref}>
      <div className="container">
        <div className={`section-header`}>
          <h2 className="section-title">What We Do</h2>
          <p className="section-subtitle">
            Discover the heart of our handmade craftsmanship and the services that make us unique
          </p>
        </div>

        <div className="Service-grid">
          {services.map((s, i) => (
            <ServiceCard
              key={s.title}
              icon={s.icon}
              title={s.title}
              description={s.description}
              delay={i * 0.08}     // small stagger, fast
              inView={inView}
            />
          ))}
        </div>

        <div className={`Service-cta reveal ${inView ? 'in' : ''}`} style={{ '--delay': `${services.length * 0.08}s` }}>
          <h3>Ready to Create Something Special?</h3>
          <p>Let's bring your ideas to life with our handmade craftsmanship</p>
          <button className="cta-button">
            <i className="fas fa-phone" /> Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default Service;
