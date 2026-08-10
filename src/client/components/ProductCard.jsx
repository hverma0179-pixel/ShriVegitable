import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Eye, Tag, Leaf, Star, Truck, Package, Minus, Plus, Check } from 'lucide-react'
import { useCartStore, useWishlistStore } from '../stores'
import { formatPrice } from '../utils/helpers'

const ProductCard = ({ product, variant = 'default' }) => {
  const { addItem, getTotalItems } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const [isAdding, setIsAdding] = React.useState(false)
  const [showAdded, setShowAdded] = React.useState(false)
  const inWishlist = isInWishlist(product.id)
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const handleAddToCart = (e) => {
    e.stopPropagation()
    setIsAdding(true)
    addItem(product, 1)
    setShowAdded(true)
    setTimeout(() => {
      setIsAdding(false)
      setShowAdded(false)
    }, 2000)
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    toggleItem(product)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent('quick-view', { detail: product }))
  }

  if (variant === 'compact') {
    return (
      <motion.article 
        className="product-card compact"
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ y: -4 }}
        layout
      >
        <div className="product-image-wrapper">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {!product.inStock && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price-row">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="unit">/{product.unit}</span>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article 
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      whileHover={{ y: -8, boxShadow: 'var(--shadow-xl)' }}
      layout
      style={{ '--card-index': 0 }}
    >
      <div className="product-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        
        <AnimatePresence>
          {discount > 0 && (
            <motion.div 
              className="discount-badge"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              -{discount}%
            </motion.div>
          )}
        </AnimatePresence>

        {!product.inStock && (
          <motion.div 
            className="out-of-stock-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span>Out of Stock</span>
          </motion.div>
        )}

        <div className="product-actions-overlay">
          <motion.button
            className="action-btn wishlist-btn"
            onClick={handleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Heart 
              className={inWishlist ? 'filled' : ''} 
              size={20} 
              strokeWidth={inWishlist ? 0 : 2}
            />
          </motion.button>
          
          <motion.button
            className="action-btn quick-view-btn"
            onClick={handleQuickView}
            aria-label="Quick view"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Eye size={20} />
          </motion.button>
        </div>

        {product.organic && (
          <motion.div 
            className="organic-badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Leaf size={14} />
            <span>Organic</span>
          </motion.div>
        )}

        {product.tags.includes('popular') && (
          <motion.div 
            className="popular-badge"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 0.25 }}
          >
            <Star size={12} fill="#FFD700" stroke="#FFD700" />
            <span>Popular</span>
          </motion.div>
        )}
      </div>

      <div className="product-content">
        <div className="product-meta">
          <span className="product-category">{product.category.replace('-', ' ')}</span>
          <div className="product-rating">
            <Star className="filled" size={14} fill="#FFD700" stroke="#FFD700" />
            <span>{product.rating}</span>
            <span className="review-count">({product.reviews})</span>
          </div>
        </div>

        <h3 className="product-name">{product.name}</h3>
        
        <p className="product-description">{product.description}</p>

        <div className="product-details">
          <div className="detail-item">
            <Package size={14} />
            <span>{product.origin}</span>
          </div>
          <div className="detail-item">
            <Truck size={14} />
            <span>Harvested: {new Date(product.harvestDate).toLocaleDateString('en-IN', { day: 'short', month: 'short' })}</span>
          </div>
        </div>

        <div className="product-price-stock">
          <div className="price-section">
            <motion.span 
              className="current-price"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {formatPrice(product.price)}
            </motion.span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="unit">/{product.unit}</span>
          </div>
          
          <AnimatePresence mode="wait">
            {product.inStock ? (
              <motion.div 
                key="in-stock"
                className="stock-status in-stock"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <span className="stock-dot" />
                <span>In Stock ({product.stockCount} left)</span>
              </motion.div>
            ) : (
              <motion.div 
                key="out-stock"
                className="stock-status out-of-stock"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <span className="stock-dot" />
                <span>Out of Stock</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="product-actions">
          <AnimatePresence mode="wait">
            {showAdded ? (
              <motion.button 
                key="added"
                className="btn btn-primary btn-full added"
                disabled
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Check size={18} />
                <span>Added to Cart!</span>
              </motion.button>
            ) : product.inStock ? (
              <motion.button
                key="add-cart"
                className="btn btn-primary btn-full"
                onClick={handleAddToCart}
                disabled={isAdding}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isAdding ? (
                  <>
                    <motion.div className="spinner" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                key="out-stock"
                className="btn btn-secondary btn-full out-of-stock-btn"
                disabled
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Package size={18} />
                <span>Out of Stock</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard