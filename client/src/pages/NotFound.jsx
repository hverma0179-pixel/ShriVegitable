import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Search, Truck, Leaf, Star, Shield, Compass, RotateCcw } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <motion.div 
        className="not-found-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="error-code">
          <motion.span 
            className="digit"
            initial={{ rotate: -15, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          >
            4
          </motion.span>
          <motion.div className="digit-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}>
            <motion.div 
              className="search-icon"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <Search size={48} />
            </motion.div>
          </motion.div>
          <motion.span 
            className="digit"
            initial={{ rotate: 15, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          >
            4
          </motion.span>
        </div>

        <motion.h1 
          className="error-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p 
          className="error-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Oops! The page you're looking for doesn't exist or has been moved. 
          Don't worry, our fresh vegetables are still here!
        </motion.p>

        <motion.div 
          className="error-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
          <Link to="/shop" className="btn btn-outline btn-lg">
            <Search size={20} />
            <span>Browse Vegetables</span>
          </Link>
        </motion.div>

        <motion.div 
          className="error-suggestions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="suggestions-label">Or explore our popular sections:</p>
          <div className="suggestions-grid">
            <Link to="/shop?category=vegetables" className="suggestion-card">
              <div className="suggestion-icon veggie">
                <Truck size={24} />
              </div>
              <h4>Fresh Vegetables</h4>
              <p>500+ farm-fresh items</p>
            </Link>
            <Link to="/shop?category=organic" className="suggestion-card">
              <div className="suggestion-icon organic">
                <Leaf size={24} />
              </div>
              <h4>Organic Only</h4>
              <p>100% certified organic</p>
            </Link>
            <Link to="/shop?category=leafy-greens" className="suggestion-card">
              <div className="suggestion-icon leafy">
                <Star size={24} />
              </div>
              <h4>Leafy Greens</h4>
              <p>Spinach, kale & more</p>
            </Link>
            <Link to="/offers" className="suggestion-card">
              <div className="suggestion-icon offers">
                <Shield size={24} />
              </div>
              <h4>Special Offers</h4>
              <p>Daily deals & discounts</p>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="error-features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="feature">
            <Truck size={20} />
            <span>Free Delivery {'>'}₹499</span>
          </div>
          <div className="feature">
            <Leaf size={20} />
            <span>100% Organic Options</span>
          </div>
          <div className="feature">
            <Shield size={20} />
            <span>Freshness Guaranteed</span>
          </div>
          <div className="feature">
            <RotateCcw size={20} />
            <span>Easy Returns</span>
          </div>
        </motion.div>

        <motion.div 
          className="error-contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p>Still can't find what you're looking for?</p>
          <Link to="/contact" className="btn btn-ghost">
            <Compass size={18} />
            <span>Contact Support</span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        className="floating-veggies"
        aria-hidden="true"
      >
        {[
          { emoji: '🥕', top: '10%', left: '5%', delay: 0, duration: 8 },
          { emoji: '🍅', top: '20%', right: '8%', delay: 1, duration: 10 },
          { emoji: '🥦', bottom: '15%', left: '10%', delay: 2, duration: 9 },
          { emoji: '🌽', bottom: '25%', right: '12%', delay: 0.5, duration: 11 },
          { emoji: '🥬', top: '40%', left: '3%', delay: 1.5, duration: 7 },
          { emoji: '🍆', top: '60%', right: '5%', delay: 2.5, duration: 12 },
          { emoji: '🌶️', bottom: '30%', left: '20%', delay: 3, duration: 8 },
          { emoji: '🥔', bottom: '10%', right: '20%', delay: 0.8, duration: 10 },
        ].map((veggie, index) => (
          <motion.span
            key={index}
            className="floating-veggie"
            style={{ 
              top: veggie.top, 
              bottom: veggie.bottom, 
              left: veggie.left, 
              right: veggie.right 
            }}
            animate={{ 
              y: [0, -30, 0], 
              x: [0, 15, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: veggie.duration, 
              repeat: Infinity, 
              delay: veggie.delay,
              ease: 'easeInOut'
            }}
          >
            {veggie.emoji}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export default NotFound