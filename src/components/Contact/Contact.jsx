import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import './Contact.css';

const SERVICE_ID  = 'service_3c6g9xn';
const TEMPLATE_ID = 'template_br4uyse';
const PUBLIC_KEY  = '6R8pkR8nvxYQsAWjl';

const Contact = ({ showNotification }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  const contactInfo = [
    {
      icon: 'fa-solid fa-location-dot',
      title: 'Visit Our Studio',
      details: '123 Craft Street, Artist Colony\nMumbai, India - 400001',
      color: '#25649C'
    },
    {
      icon: 'fa-solid fa-phone',
      title: 'Call Us',
      details: '+91 9738911107\nMon-Sat: 10AM-7PM',
      color: '#25649C'
    },
    {
      icon: 'fa-solid fa-envelope',
      title: 'Email Us',
      details: 'thedollzie@gmail.com',
      color: '#25649C'
    }
  ];

  const socialLinks = [
    { icon: 'fa-brands fa-facebook-f', url: '#', color: '#1877F2', label: 'Facebook' },
    { icon: 'fa-brands fa-instagram', url: '#', color: '#E4405F', label: 'Instagram' },
    { icon: 'fa-brands fa-whatsapp', url: '#', color: '#25D366', label: 'WhatsApp' },
    { icon: 'fa-brands fa-pinterest', url: '#', color: '#E60023', label: 'Pinterest' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openEmailClient = () => {
    const subject = encodeURIComponent(`Contact from ${formData.name}: ${formData.subject || 'General Inquiry'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\n\nMessage:\n${formData.message}`
    );
    window.open(`mailto:thedollzie@gmail.com?subject=${subject}&body=${body}`, '_self');
    setShowEmailPopup(false);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('thedollzie@gmail.com');
      showNotification?.('📧 Email address copied!', 'success');
      setShowEmailPopup(false);
    } catch (err) {
      showNotification?.('📧 Email: thedollzie@gmail.com', 'info');
      setShowEmailPopup(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔥 Form submitted!');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      console.log('❌ Validation failed');
      showNotification?.('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    // ✅ Proper template parameters
    const templateParams = {
      from_name: formData.name,                    // Customer name
      from_email: formData.email,                  // Customer email (for reply-to)
      phone: formData.phone || 'Not provided',    // Customer phone
      subject: formData.subject || 'General Inquiry', // Email subject
      message: formData.message                    // Customer message
    };

    console.log('📧 Sending email with:', templateParams);

    try {
      // Initialize EmailJS
      emailjs.init(PUBLIC_KEY);
      
      // Send email
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

      console.log('✅ EmailJS Success:', response);
      showNotification?.('✅ Message sent successfully! We will contact you soon.', 'success');
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

    } catch (error) {
      console.error('❌ EmailJS Error:', error);
      showNotification?.('⚠️ Email service error. Opening direct contact...', 'warning');
      setShowEmailPopup(true);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const EmailPopup = () => (
    showEmailPopup && (
      <div className="email-popup-overlay" onClick={(e) => {
        if (e.target.className === 'email-popup-overlay') {
          setShowEmailPopup(false);
        }
      }}>
        <div className="email-popup">
          <div className="popup-header">
            <h3>📧 Contact Us Directly</h3>
            <button 
              className="popup-close"
              onClick={() => setShowEmailPopup(false)}
              aria-label="Close popup"
              title="Close"
            >
              ✕
            </button>
          </div>
          
          <div className="popup-content">
            <p>Email service is temporarily unavailable.</p>
            <p><strong>Please choose an option:</strong></p>
            
            <div className="popup-options">
              <button 
                className="popup-btn primary"
                onClick={openEmailClient}
                title="Open Email Client"
              >
                📧 Open Email App
              </button>
              
              <button 
                className="popup-btn secondary"
                onClick={copyEmail}
                title="Copy Email Address"
              >
                📋 Copy Email
              </button>
            </div>

            <div className="direct-contact">
              <h4>📞 Direct Contact:</h4>
              <p><strong>📧 Email:</strong> thedollzie@gmail.com</p>
              <p><strong>📱 Phone:</strong> +91 9738911107</p>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <section id="contact" className="contact-section" ref={ref}>
      <div className="container contact-container">
        <div className={`section-header ${inView ? 'fade-in-up' : ''}`}>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            We'd love to connect! Whether you want a custom piece or just want to say hi — drop us a message.
          </p>
        </div>

        <div className="contact-content">
          <div className={`contact-info ${inView ? 'slide-in-left' : ''}`}>
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="contact-item"
                style={{ animationDelay: `${index * 0.2}s`, '--contact-color': info.color }}
              >
                <div className="contact-icon">
                  <i className={info.icon} style={{ color: info.color }}></i>
                </div>
                <div className="contact-details">
                  <h4>{info.title}</h4>
                  <p>{info.details}</p>
                </div>
              </div>
            ))}

            <div className="social-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    style={{ backgroundColor: social.color }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.label}`}
                    title={social.label}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form className={`contact-form ${inView ? 'slide-in-right' : ''}`} onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
                aria-label="Your Name"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                value={formData.email}
                onChange={handleInputChange}
                required
                aria-label="Your Email"
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone (Optional)"
                value={formData.phone}
                onChange={handleInputChange}
                aria-label="Your Phone"
              />
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                aria-label="Select Subject"
                title="Select Subject"
              >
                <option value="">Select Subject</option>
                <option value="Custom Order">Custom Order</option>
                <option value="Bulk Order">Bulk Order</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <textarea
              name="message"
              placeholder="Your Message *"
              rows="7"
              value={formData.message}
              onChange={handleInputChange}
              required
              aria-label="Your Message"
            ></textarea>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
              title="Send Message"
            >
              <i className={`fa-solid ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <EmailPopup />
    </section>
  );
};

export default Contact;