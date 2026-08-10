import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, ShoppingCart, Heart, User, Truck, Leaf, Star, Tag, Package, Clock, MapPin, Phone, Mail } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useCartStore, useWishlistStore } from '../stores'
import { useState } from 'react'

const Header = () => {
  const { getTotalItems, toggleCart } = useCartStore()
  const { getCount } = useWishlistStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  
  const totalItems = getTotalItems()
  const wishlistCount = getCount()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/categories', label: 'Categories' },
    { path: '/offers', label: 'Offers' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-content">
          <div className="header-announcement">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="announcement-text"
            >
              🚚 Free delivery on orders above ₹499 | 🌱 100% Fresh & Organic | 📞 Support: +91 98765 43210
            </motion.span>
          </div>
        </div>
      </div>
      
      <nav className="header-main" role="navigation" aria-label="Main navigation">
        <div className="container header-main-content">
          <Link to="/" className="logo" aria-label="ShriVegitable Home">
            <motion.div 
              className="logo-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Leaf className="logo-leaf" size={28} />
            </motion.div>
            <motion.div 
              className="logo-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="logo-main">ShriVegitable</span>
              <span className="logo-tagline">Fresh Harvest Daily</span>
            </motion.div>
          </Link>

          <div className="header-search" role="search">
            <form onSubmit={handleSearch} className="search-form">
              <label htmlFor="search-input" className="sr-only">Search vegetables</label>
              <motion.div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  id="search-input"
                  type="search"
                  placeholder="Search fresh vegetables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoComplete="off"
                  aria-label="Search vegetables"
                />
              </motion.div>
              <button type="submit" className="search-btn" aria-label="Search">
                <motion.span className="btn-text">Search</motion.span>
              </button>
            </form>
          </div>

          <div className="header-actions">
            <Link to="/wishlist" className="header-action-btn" aria-label={`Wishlist, ${wishlistCount} items`}>
              <motion.div className="action-icon-wrapper">
                <Heart className="action-icon" size={22} />
                {wishlistCount > 0 && (
                  <motion.span 
                    className="action-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <Link to="/account" className="header-action-btn" aria-label="My Account">
              <motion.div className="action-icon-wrapper">
                <User className="action-icon" size={22} />
              </motion.div>
            </Link>

            <button 
              onClick={toggleCart} 
              className="header-action-btn cart-btn"
              aria-label={`Shopping cart, ${totalItems} items`}
              aria-expanded={totalItems > 0}
            >
              <motion.div className="action-icon-wrapper">
                <ShoppingCart className="action-icon" size={22} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      className="action-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.div 
              className="hamburger"
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              id="mobile-menu"
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-menu-content">
                <div className="mobile-search">
                  <form onSubmit={handleSearch} className="search-form">
                    <Search className="search-icon" size={20} />
                    <input
                      type="search"
                      placeholder="Search vegetables..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                  </form>
                </div>
                <ul className="mobile-nav" role="list">
                  {navLinks.map((link, index) => (
                    <motion.li 
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        to={link.path} 
                        className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="mobile-features">
                  <div className="feature-item">
                    <Truck size={20} />
                    <span>Free Delivery {'>'} ₹499</span>
                  </div>
                  <div className="feature-item">
                    <Leaf size={20} />
                    <span>100% Organic Options</span>
                  </div>
                  <div className="feature-item">
                    <Star size={20} />
                    <span>Freshness Guaranteed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header