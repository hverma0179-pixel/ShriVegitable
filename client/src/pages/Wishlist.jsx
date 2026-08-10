import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ArrowLeft, Tag, Leaf, Truck, Shield, Star, Share2, Bell, Eye, Loader2, X } from 'lucide-react'
import { formatPrice } from '../utils/helpers'
import { useCartStore, useWishlistStore } from '../stores'
import ProductCard from '../components/ProductCard'

const Wishlist = () => {
  const { items, removeItem, toggleItem, clearWishlist, getCount } = useWishlistStore()
  const { addItem } = useCartStore()
  const [showShare, setShowShare] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const wishlistCount = getCount()

  const moveAllToCart = () => {
    items.forEach(item => {
      if (item.inStock) {
        addItem(item, 1)
      }
    })
  }

  const shareWishlist = async () => {
    const productNames = items.map(p => p.name).join(', ')
    const text = `Check out my wishlist on ShriVegitable: ${productNames}`
    try {
      await navigator.share({ title: 'My ShriVegitable Wishlist', text, url: window.location.href })
    } catch {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`)
      alert('Wishlist link copied to clipboard!')
    }
    setShowShare(false)
  }

  if (items.length === 0) {
    return (
      <div className="wishlist-page empty">
        <div className="container">
          <motion.div className="empty-wishlist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="empty-icon">
              <motion.div 
                className="heart-icon"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={64} />
              </motion.div>
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save your favorite vegetables for later or share with friends and family.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              <ArrowLeft size={18} />
              <span>Start Shopping</span>
            </Link>
            <div className="empty-features">
              <div className="feature">
                <Heart size={20} />
                <span>Save Favorites</span>
              </div>
              <div className="feature">
                <Bell size={20} />
                <span>Price Drop Alerts</span>
              </div>
              <div className="feature">
                <Share2 size={20} />
                <span>Share with Others</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container header-content">
          <div>
            <h1 className="page-title">My Wishlist</h1>
            <p className="page-subtitle">{wishlistCount} item{wishlistCount !== 1 ? 's' : ''} saved for later</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-ghost" onClick={() => setNotifications(!notifications)} aria-label="Notification settings">
              <Bell size={20} />
            </button>
            <button className="btn btn-ghost" onClick={() => setShowShare(true)} aria-label="Share wishlist">
              <Share2 size={20} />
            </button>
            {items.some(item => item.inStock) && (
              <button className="btn btn-primary" onClick={moveAllToCart}>
                <ShoppingCart size={18} />
                <span>Add All to Cart</span>
              </button>
            )}
            <button className="btn btn-outline" onClick={clearWishlist}>
              <Trash2 size={18} />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="container wishlist-container">
        <motion.div 
          className="wishlist-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          role="list"
          aria-label="Wishlist items"
        >
          <AnimatePresence>
            {items.map((product, index) => (
              <motion.article
                key={product.id}
                className="wishlist-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="item-image-wrapper">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="item-image" loading="lazy" />
                  </Link>
                  {!product.inStock && <div className="item-out-of-stock">Out of Stock</div>}
                  {product.organic && <div className="item-organic-badge"><Leaf size={14} /> Organic</div>}
                  <div className="item-overlay">
                    <button 
                      className="overlay-btn quick-view"
                      onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('quick-view', { detail: product })) }}
                      aria-label="Quick view"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                <div className="item-content">
                  <div className="item-header">
                    <Link to={`/product/${product.id}`} className="item-name">{product.name}</Link>
                    <button
                      className="remove-wishlist-btn"
                      onClick={() => toggleItem(product)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="item-meta">
                    <span className="item-category">{product.category.replace('-', ' ')}</span>
                    <span className="item-unit">/{product.unit}</span>
                  </div>

                  <div className="item-rating">
                    <Star className="filled" size={14} fill="#FFD700" stroke="#FFD700" />
                    <span>{product.rating}</span>
                    <span className="review-count">({product.reviews})</span>
                  </div>

                  <div className="item-price-stock">
                    <div className="price-section">
                      <span className="current-price">{formatPrice(product.price)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      )}
                      <span className="unit">/{product.unit}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="discount-badge">
                          Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      <span className="stock-dot" />
                      <span>{product.inStock ? `In Stock (${product.stockCount} left)` : 'Out of Stock'}</span>
                    </div>
                  </div>

                  <div className="item-actions">
                    {product.inStock ? (
                      <button
                        className="btn btn-primary btn-full"
                        onClick={(e) => { e.stopPropagation(); addItem(product, 1) }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-full notify-btn" disabled>
                        <Bell size={18} />
                        <span>Notify When Available</span>
                      </button>
                    )}
                    <button
                      className="btn btn-ghost share-item-btn"
                      onClick={(e) => { e.stopPropagation(); shareWishlist() }}
                      aria-label="Share this item"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {items.some(p => !p.inStock) && (
          <motion.div 
            className="out-of-stock-notice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="notice-content">
              <Truck size={24} />
              <div>
                <h3>Some Items Are Out of Stock</h3>
                <p>{items.filter(p => !p.inStock).length} item(s) in your wishlist are currently unavailable. We'll notify you when they're back!</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <motion.section 
        className="wishlist-benefits"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="container">
          <h2 className="section-title">Why Use Wishlist?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon"><Heart size={24} /></div>
              <h3>Save for Later</h3>
              <p>Keep track of vegetables you want to buy on your next order</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><Bell size={24} /></div>
              <h3>Price Alerts</h3>
              <p>Get notified when your favorite items go on sale</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><Share2 size={24} /></div>
              <h3>Share with Family</h3>
              <p>Send your wishlist to others for easy grocery coordination</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><Star size={24} /></div>
              <h3>Priority Restock</h3>
              <p>Wishlisted items get priority when restocking popular products</p>
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {showShare && (
          <motion.div
            className="share-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShare(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            <motion.div 
              className="share-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowShare(false)} aria-label="Close share modal" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                <X size={24} />
              </button>
              <div className="modal-content">
                <h2 id="share-modal-title">Share Your Wishlist</h2>
                <p>Let friends and family know what fresh vegetables you'd love!</p>
                <div className="share-options">
                  <button className="share-option whatsapp" onClick={() => shareWishlist()}>
                    <svg viewBox="0 0 24 24" fill="#25D366" width="24" height="24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.454.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.397-.272 9.89 9.89 0 00-3.35 2.579 9.816 9.816 0 00-.36 4.055c0 2.904 1.717 7.18 6.118 7.234 3.878.05 6.246-1.99 6.288-5.577.038-3.417-2.689-6.71-6.324-6.773zm2.323-9.329c-.918-.844-2.483-1.136-3.475-.96-2.155.383-5.838 2.86-7.983 6.609-.817 1.42-1.147 2.964-1.105 3.244.038.273.209.473.45.553.48.149 2.855.915 3.551.491.468-.287 2.389-2.378 2.786-2.77.477-.476.84-.99.999-1.386.1-.272.174-.666.107-1.033-.099-.579-1.307-2.103-2.427-3.228-.643-.642-1.05-1.346-1.137-1.731-.109-.477-.003-.926.346-1.222.242-.208.654-.31 1.068-.258.683.086 1.339.482 1.339 1.476.003.399-.003.807-.144 1.286-.14.478-.558 1.443-1.435 2.333-.945.945-2.313 2.32-3.218 3.463-1.172 1.471-.962 3.776.106 5.376.773 1.145 2.369 1.817 3.702 1.752 1.235-.056 1.845-.654 2.298-1.72.453-1.065.845-2.894 1.034-4.555.188-1.663.225-3.084-.264-3.602-.489-.518-1.31-.803-2.226-1.009-.917-.206-2.807-.486-4.742-.684z"/></svg>
                    <span>WhatsApp</span>
                  </button>
                  <button className="share-option facebook" onClick={() => shareWishlist()}>
                    <svg viewBox="0 0 24 24" fill="#1877F2" width="24" height="24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span>Facebook</span>
                  </button>
                  <button className="share-option copy" onClick={() => shareWishlist()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <span>Copy Link</span>
                  </button>
                  <button className="share-option email" onClick={() => shareWishlist()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Wishlist