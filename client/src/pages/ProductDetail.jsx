import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Minus, Plus, Check, Star, Leaf, Truck, Package, MapPin, Clock, Share2, ArrowLeft, Tag, Shield, RotateCcw } from 'lucide-react'
import { getProductById, vegetables, getProductsByCategory } from '../utils/products'
import { formatPrice } from '../utils/helpers'
import { useCartStore, useWishlistStore } from '../stores'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const [product, setProduct] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showAdded, setShowAdded] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundProduct = getProductById(id)
    if (foundProduct) {
      setProduct(foundProduct)
      const related = vegetables
        .filter(v => v.category === foundProduct.category && v.id !== foundProduct.id)
        .slice(0, 4)
      setRelatedProducts(related)
    } else {
      navigate('/shop')
    }
    setLoading(false)
  }, [id, navigate])

  const images = product?.images || [product?.image].filter(Boolean)
  const discount = product?.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
  const inWishlist = isInWishlist(product?.id)

  const handleAddToCart = () => {
    if (!product?.inStock) return
    addItem(product, quantity)
    setShowAdded(true)
    setTimeout(() => { setShowAdded(false) }, 2000)
  }

  const handleImageChange = (direction) => {
    setCurrentImageIndex(prev => (prev + direction + images.length) % images.length)
  }

  if (loading) {
    return (
      <div className="product-detail-page loading">
        <div className="container">
          <div className="skeleton-grid">
            {[1, 2].map(i => (
              <motion.div key={i} className="skeleton-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div className="skeleton-image" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
                <div className="skeleton-text" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page not-found">
        <div className="container">
          <motion.div className="not-found-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="not-found-icon">
              <Search size={48} />
            </div>
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/shop" className="btn btn-primary">
              <ArrowLeft size={18} /> Back to Shop
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to={`/shop?category=${product.category}`}>{product.category.replace('-', ' ')}</Link></li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="container product-detail-grid">
        <motion.div 
          className="product-gallery"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="main-image-wrapper">
            <motion.img 
              src={images[currentImageIndex]} 
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="main-image"
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            {images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={() => handleImageChange(-1)} aria-label="Previous image" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ChevronLeft size={24} />
                </button>
                <button className="gallery-nav next" onClick={() => handleImageChange(1)} aria-label="Next image" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            {discount > 0 && (
              <motion.div className="discount-badge" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                -{discount}%
              </motion.div>
            )}
            {!product.inStock && <div className="out-of-stock-overlay"><span>Out of Stock</span></div>}
          </div>

          {images.length > 1 && (
            <div className="thumbnail-strip" role="list" aria-label="Product images">
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === currentImageIndex ? 'true' : 'false'}
                  role="listitem"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <img src={img} alt={`${product.name} - Thumbnail ${index + 1}`} loading="lazy" />
                </motion.button>
              ))}
            </div>
          )}

          <div className="gallery-badges">
            {product.organic && (
              <motion.div className="badge organic" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Leaf size={16} /> 100% Organic
              </motion.div>
            )}
            <motion.div className="badge freshness" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Shield size={16} /> Freshness Guaranteed
            </motion.div>
            <motion.div className="badge delivery" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Truck size={16} /> Free Delivery {'>'}₹499
            </motion.div>
            <motion.div className="badge returns" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <RotateCcw size={16} /> Easy Returns
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="product-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="product-meta">
            <span className="product-category">{product.category.replace('-', ' ')}</span>
            <div className="product-rating">
              <Star className="filled" size={18} fill="#FFD700" stroke="#FFD700" />
              <span>{product.rating}</span>
              <span className="review-count">({product.reviews} reviews)</span>
              <Link to="#reviews" className="write-review">Write a review</Link>
            </div>
          </div>

          <motion.h1 className="product-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {product.name}
          </motion.h1>

          {product.organic && (
            <motion.div className="organic-badge" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Leaf size={18} />
              <span>100% Organic Certified</span>
            </motion.div>
          )}

          <motion.p className="product-description" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {product.description}
          </motion.p>

          <motion.div className="product-price-stock" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="price-display">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
              <span className="unit">/{product.unit}</span>
              {discount > 0 && (
                <span className="discount-percent">Save {discount}%</span>
              )}
            </div>
            <div className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              <span className="stock-dot" />
              <span>{product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}</span>
            </div>
          </motion.div>

          <motion.div className="product-quantity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <label htmlFor="quantity" className="quantity-label">Quantity</label>
            <div className="quantity-selector">
              <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} aria-label="Decrease quantity" whileTap={{ scale: 0.9 }}>
                <Minus size={18} />
              </button>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stockCount || 99}
                className="qty-input"
                aria-label="Quantity"
              />
              <button className="qty-btn" onClick={() => setQuantity(Math.min(product.stockCount || 99, quantity + 1))} disabled={quantity >= (product.stockCount || 99)} aria-label="Increase quantity" whileTap={{ scale: 0.9 }}>
                <Plus size={18} />
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {showAdded ? (
              <motion.button 
                key="added"
                className="btn btn-primary btn-full btn-lg added"
                disabled
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Check size={20} />
                <span>Added to Cart!</span>
              </motion.button>
            ) : product.inStock ? (
              <motion.button
                key="add-cart"
                className="btn btn-primary btn-full btn-lg"
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ShoppingCart size={22} />
                <span>Add to Cart</span>
              </motion.button>
            ) : (
              <motion.button
                key="out-stock"
                className="btn btn-secondary btn-full btn-lg out-of-stock-btn"
                disabled
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Package size={22} />
                <span>Out of Stock</span>
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            className="btn btn-ghost btn-full btn-lg wishlist-btn"
            onClick={() => toggleItem(product)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Heart className={inWishlist ? 'filled' : ''} size={20} strokeWidth={inWishlist ? 0 : 2} />
            <span>{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
          </motion.button>

          <motion.div className="product-meta-details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="meta-item">
              <MapPin size={18} />
              <div>
                <span className="meta-label">Origin</span>
                <span className="meta-value">{product.origin}</span>
              </div>
            </div>
            <div className="meta-item">
              <Clock size={18} />
              <div>
                <span className="meta-label">Harvested</span>
                <span className="meta-value">{new Date(product.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="meta-item">
              <Package size={18} />
              <div>
                <span className="meta-label">Category</span>
                <span className="meta-value">{product.category.replace('-', ' ')}</span>
              </div>
            </div>
            <div className="meta-item">
              <Tag size={18} />
              <div>
                <span className="meta-label">SKU</span>
                <span className="meta-value">SVG-{product.id.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="product-share" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <span>Share:</span>
            <div className="share-buttons">
              <button className="share-btn" aria-label="Share on WhatsApp" onClick={() => shareProduct('whatsapp')}>
                <svg viewBox="0 0 24 24" fill="#25D366" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.454.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.397-.272 9.89 9.89 0 00-3.35 2.579 9.816 9.816 0 00-.36 4.055c0 2.904 1.717 7.18 6.118 7.234 3.878.05 6.246-1.99 6.288-5.577.038-3.417-2.689-6.71-6.324-6.773zm2.323-9.329c-.918-.844-2.483-1.136-3.475-.96-2.155.383-5.838 2.86-7.983 6.609-.817 1.42-1.147 2.964-1.105 3.244.038.273.209.473.45.553.48.149 2.855.915 3.551.491.468-.287 2.389-2.378 2.786-2.77.477-.476.84-.99.999-1.386.1-.272.174-.666.107-1.033-.099-.579-1.307-2.103-2.427-3.228-.643-.642-1.05-1.346-1.137-1.731-.109-.477-.003-.926.346-1.222.242-.208.654-.31 1.068-.258.683.086 1.339.482 1.339 1.476.003.399-.003.807-.144 1.286-.14.478-.558 1.443-1.435 2.333-.945.945-2.313 2.32-3.218 3.463-1.172 1.471-.962 3.776.106 5.376.773 1.145 2.369 1.817 3.702 1.752 1.235-.056 1.845-.654 2.298-1.72.453-1.065.845-2.894 1.034-4.555.188-1.663.225-3.084-.264-3.602-.489-.518-1.31-.803-2.226-1.009-.917-.206-2.807-.486-4.742-.684z"/></svg>
              </button>
              <button className="share-btn" aria-label="Share on Facebook" onClick={() => shareProduct('facebook')}>
                <svg viewBox="0 0 24 24" fill="#1877F2" width="20" height="20"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="share-btn" aria-label="Copy link" onClick={() => shareProduct('copy')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.section 
        className="product-details-tabs"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container">
          <div className="tabs-header" role="tablist">
            <button role="tab" aria-selected="true" className="tab-btn active" id="tab-description">Description</button>
            <button role="tab" aria-selected="false" className="tab-btn" id="tab-nutrition">Nutrition</button>
            <button role="tab" aria-selected="false" className="tab-btn" id="tab-reviews">Reviews ({product.reviews})</button>
          </div>

          <div role="tabpanel" aria-labelledby="tab-description" className="tab-panel active">
            <div className="tab-content">
              <h3>About This Product</h3>
              <p>{product.description}</p>
              <div className="product-features">
                <h4>Key Features</h4>
                <ul>
                  <li><Leaf size={18} /> {product.organic ? '100% Organic Certified' : 'Conventionally Grown'}</li>
                  <li><Truck size={18} /> Harvested Fresh: {new Date(product.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</li>
                  <li><Package size={18} /> Sourced from: {product.origin}</li>
                  <li><Star size={18} className="filled" fill="#FFD700" stroke="#FFD700" /> Customer Rating: {product.rating}/5 ({product.reviews} reviews)</li>
                  <li><Tag size={18} /> Category: {product.category.replace('-', ' ')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div role="tabpanel" aria-labelledby="tab-nutrition" className="tab-panel" hidden>
            <div className="tab-content">
              <h3>Nutrition Facts (per 100g)</h3>
              <div className="nutrition-grid">
                {Object.entries(product.nutrition).map(([key, value]) => (
                  <div key={key} className="nutrition-item">
                    <span className="nutrient-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span className="nutrient-value">
                      {typeof value === 'number' 
                        ? value + (key.toLowerCase().includes('vitamin') || key.toLowerCase().includes('folate') ? 'mg' : 'g') 
                        : value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="nutrition-note">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.</p>
            </div>
          </div>

          <div role="tabpanel" aria-labelledby="tab-reviews" className="tab-panel" hidden>
            <div className="tab-content">
              <h3>Customer Reviews</h3>
              <div className="reviews-summary">
                <div className="rating-overview">
                  <span className="overall-rating">{product.rating}</span>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="filled" size={20} fill={i < Math.round(product.rating) ? '#FFD700' : '#E0E0E0'} stroke={i < Math.round(product.rating) ? '#FFD700' : '#E0E0E0'} />
                    ))}
                  </div>
                  <span className="review-count">Based on {product.reviews} reviews</span>
                </div>
                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="rating-bar">
                      <span>{star}★</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${Math.max(5, (product.reviews / 5) * (6 - star) * 20)}%` }} />
                      </div>
                      <span>{Math.round((product.reviews / 5) * (6 - star) * 2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="reviews-list">
                <p className="no-reviews">Customer reviews will appear here once submitted.</p>
                <button className="btn btn-outline">Write a Review</button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {relatedProducts.length > 0 && (
        <motion.section 
          className="related-products"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">You May Also Like</h2>
              <p className="section-subtitle">Similar fresh vegetables you might enjoy</p>
            </div>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      <script>
        {`
          function shareProduct(platform) {
            const url = window.location.href;
            const text = \`Check out \${product.name} at ShriVegitable! \${formatPrice(product.price)}/\${product.unit}\`;
            if (platform === 'whatsapp') window.open(\`https://wa.me/?text=\${encodeURIComponent(text + ' ' + url)}\`, '_blank');
            else if (platform === 'facebook') window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`, '_blank');
            else if (platform === 'copy') navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
          }
        `}
      </script>
    </div>
  )
}

function shareProduct(platform) {
  // This function is defined in the script tag above for inline event handlers
  // Actual implementation is handled by the component's event handlers
}

export default ProductDetail