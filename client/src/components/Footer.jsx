import { motion } from 'framer-motion'
import { Truck, Leaf, Star, Shield, ArrowRight, Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Farms', href: '/farms' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' }
    ],
    support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Delivery Info', href: '/delivery' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Track Order', href: '/track-order' }
    ],
    account: [
      { label: 'My Account', href: '/account' },
      { label: 'Order History', href: '/orders' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Subscriptions', href: '/subscriptions' },
      { label: 'Gift Cards', href: '/gift-cards' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' }
    ]
  }

  const features = [
    { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
    { icon: Leaf, title: '100% Organic', desc: 'Certified fresh produce' },
    { icon: Star, title: 'Quality Guarantee', desc: 'Freshness or refund' },
    { icon: Shield, title: 'Secure Payment', desc: '100% safe checkout' }
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/shrivegetable', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/shrivegetable', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/shrivegetable', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/shrivegetable', label: 'YouTube' }
  ]

  const contactInfo = [
    { icon: MapPin, text: '123 Green Valley Road, Farm City, FC 12345' },
    { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: Mail, text: 'hello@shrivegetable.com', href: 'mailto:hello@shrivegetable.com' },
    { icon: Clock, text: 'Mon-Sat: 7AM - 9PM | Sun: 8AM - 6PM' }
  ]

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="ShriVegitable Home">
              <motion.div 
                className="logo-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Leaf className="logo-leaf" size={32} />
              </motion.div>
              <span className="logo-main">ShriVegitable</span>
            </Link>
            <p className="footer-tagline">
              Bringing farm-fresh, organic vegetables straight to your doorstep. 
              Healthy eating made simple, affordable, and delicious.
            </p>
            <div className="footer-social" role="list" aria-label="Social media links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <nav className="footer-nav" aria-label="Company links">
            <h3 className="footer-heading">Company</h3>
            <ul role="list">
              {footerLinks.company.map((link, index) => (
                <motion.li key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link to={link.href} className="footer-link">{link.label}</Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <nav className="footer-nav" aria-label="Support links">
            <h3 className="footer-heading">Support</h3>
            <ul role="list">
              {footerLinks.support.map((link, index) => (
                <motion.li key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link to={link.href} className="footer-link">{link.label}</Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <nav className="footer-nav" aria-label="Account links">
            <h3 className="footer-heading">My Account</h3>
            <ul role="list">
              {footerLinks.account.map((link, index) => (
                <motion.li key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link to={link.href} className="footer-link">{link.label}</Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="footer-contact">
            <h3 className="footer-heading">Contact Us</h3>
            <ul role="list" className="contact-list">
              {contactInfo.map((item, index) => (
                <motion.li key={item.text} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="contact-item">
                  <item.icon size={18} className="contact-icon" />
                  {item.href ? (
                    <a href={item.href} className="contact-text">{item.text}</a>
                  ) : (
                    <span className="contact-text">{item.text}</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-features">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright">
            © {currentYear} ShriVegitable. All rights reserved. 
            <span className="heart">♥</span> Made with love for fresh food
          </p>
          <nav className="footer-legal" aria-label="Legal links">
            <ul role="list">
              {footerLinks.legal.map((link, index) => (
                <li key={link.href}>
                  <Link to={link.href} className="legal-link">{link.label}</Link>
                  {index < footerLinks.legal.length - 1 && <span className="legal-separator" aria-hidden="true">•</span>}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <motion.div 
        className="scroll-top"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        role="button"
        tabIndex={0}
        aria-label="Scroll to top"
        onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowRight size={24} className="scroll-top-icon" />
      </motion.div>
    </footer>
  )
}

export default Footer