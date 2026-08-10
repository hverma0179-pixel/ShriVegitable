import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Truck, Star, Shield, Search, Tag, Heart, ShoppingCart } from 'lucide-react'
import { vegetables, categories, getFeaturedProducts } from '../utils/products'
import { formatPrice } from '../utils/helpers'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [featuredProducts] = useState(getFeaturedProducts())
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100)
  }, [])

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      <section 
        className="hero" 
        role="banner"
        aria-label="Welcome to ShriVegitable"
      >
        <div className="hero-background">
          <motion.div 
            className="hero-shape shape-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          <motion.div 
            className="hero-shape shape-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          />
        </div>
        
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Leaf size={16} /> 100% Fresh & Organic Vegetables
            </motion.span>
            
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Farm Fresh Vegetables <br />
              <span className="highlight">Delivered to Your Door</span>
            </motion.h1>
            
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Experience the taste of freshly harvested, hand-picked vegetables 
              sourced directly from certified organic farms. Healthy eating made simple.
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button 
                className="btn btn-primary btn-lg"
                onClick={scrollToShop}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Shop Fresh Now</span>
                <ArrowRight size={20} />
              </button>
              <Link to="/shop?category=organic" className="btn btn-outline btn-lg">
                <Leaf size={20} />
                <span>Organic Only</span>
              </Link>
            </motion.div>

            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Fresh Items</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Local Farms</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2hr</span>
                <span className="stat-label">Quick Delivery</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="hero-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop" 
                alt="Fresh organic vegetables assortment"
                className="hero-image"
              />
              <motion.div 
                className="floating-badge badge-1"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Leaf size={24} className="badge-icon" />
                <span>Organic Certified</span>
              </motion.div>
              <motion.div 
                className="floating-badge badge-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <Truck size={24} className="badge-icon" />
                <span>Free Delivery >₹499</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section 
        id="features"
        className="features-section"
        aria-label="Our Features"
      >
        <div className="container">
          <div className="section-header">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Choose ShriVegitable?
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.1 }}
            >
              We're committed to bringing you the freshest, healthiest produce with unmatched convenience
            </motion.p>
          </div>

          <div className="features-grid">
            {[
              { icon: Leaf, title: '100% Organic', desc: 'Certified organic produce from trusted farms', color: '#2E7D32' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Doorstep delivery within 2 hours', color: '#1565C0' },
              { icon: Star, title: 'Quality Guaranteed', desc: 'Freshness guarantee or full refund', color: '#F57F17' },
              { icon: Shield, title: 'Secure Payment', desc: 'Multiple safe payment options', color: '#6A1B9A' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ '--feature-color': feature.color }}
              >
                <div className="feature-icon">
                  <feature.icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section 
        id="categories"
        className="categories-section"
        aria-label="Shop by Categories"
      >
        <div className="container">
          <div className="section-header">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Shop by Category
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.1 }}
            >
              Find exactly what you need from our wide range of fresh vegetables
            </motion.p>
          </div>

          <div className="categories-grid">
            {categories.slice(1).map((category, index) => (
              <motion.div
                key={category.id}
                className="category-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/shop?category=${category.id}`} className="category-link">
                  <div className="category-image">
                    <span className="category-emoji">{category.icon}</span>
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <span className="category-count">
                      {vegetables.filter(v => v.category === category.id).length} items
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="section-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/shop" className="btn btn-primary btn-lg">
              View All Vegetables
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section 
        id="shop"
        className="featured-section"
        aria-label="Featured Products"
      >
        <div className="container">
          <div className="section-header">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Featured Vegetables
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.1 }}
            >
              Hand-picked favorites from our customers
            </motion.p>
          </div>

          <div className="products-grid">
            {featuredProducts.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="section-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/shop" className="btn btn-outline btn-lg">
              Explore All Products
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="newsletter-section" aria-label="Newsletter Signup">
        <div className="container">
          <motion.div 
            className="newsletter-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="newsletter-content">
              <div className="newsletter-text">
                <h2>Stay Fresh, Stay Updated</h2>
                <p>Subscribe to our newsletter for seasonal offers, recipes, and farming stories</p>
              </div>
              <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }}>
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input 
                  id="newsletter-email"
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input"
                  required
                  autoComplete="email"
                />
                <button type="submit" className="btn btn-primary">
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
            <div className="newsletter-trust">
              <span>No spam • Unsubscribe anytime • 10,000+ happy subscribers</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home