import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ArrowLeft, Tag, Leaf, Truck, Shield, Star, RotateCcw, Gift, CreditCard, ChevronRight, Loader2 } from 'lucide-react'
import { formatPrice } from '../utils/helpers'
import { useCartStore } from '../stores'

const Cart = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice,
    closeCart 
  } = useCartStore()
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const totalItems = getTotalItems()
  const subtotal = getTotalPrice()
  const deliveryFee = subtotal >= 499 ? 0 : 40
  const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0
  const total = subtotal - discount + deliveryFee

  const coupons = {
    'WELCOME10': { code: 'WELCOME10', discount: 10, description: '10% off on first order', minOrder: 0 },
    'FRESH20': { code: 'FRESH20', discount: 15, description: '15% off on orders above ₹500', minOrder: 500 },
    'ORGANIC15': { code: 'ORGANIC15', discount: 15, description: '15% off on organic products', minOrder: 300 },
    'SAVE50': { code: 'SAVE50', discount: 50, description: 'Flat ₹50 off on orders above ₹1000', minOrder: 1000, flat: true },
  }

  const applyCoupon = () => {
    const coupon = coupons[couponCode.toUpperCase()]
    setCouponError('')
    
    if (!coupon) {
      setCouponError('Invalid coupon code')
      return
    }
    
    if (subtotal < coupon.minOrder) {
      setCouponError(coupon.flat 
        ? `Minimum order of ${formatPrice(coupon.minOrder)} required`
        : `Minimum order of ${formatPrice(coupon.minOrder)} required`
      )
      return
    }
    
    setAppliedCoupon(coupon)
    setCouponCode('')
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    setIsCheckingOut(true)
    setTimeout(() => {
      setIsCheckingOut(false)
      window.location.href = '/checkout'
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="container">
          <motion.div className="empty-cart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="empty-icon">
              <motion.div 
                className="cart-icon"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </motion.div>
            </div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any fresh vegetables yet.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              <ArrowLeft size={18} />
              <span>Continue Shopping</span>
            </Link>
            <div className="empty-features">
              <div className="feature">
                <Leaf size={20} />
                <span>100% Organic Options</span>
              </div>
              <div className="feature">
                <Truck size={20} />
                <span>Free Delivery {'>'}₹499</span>
              </div>
              <div className="feature">
                <Shield size={20} />
                <span>Freshness Guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>
      </motion.div>

      <div className="container cart-container">
        <motion.div 
          className="cart-items-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="cart-items-header">
            <h2>Your Items</h2>
            {items.length > 1 && (
              <button className="clear-cart-btn" onClick={clearCart}>
                <Trash2 size={16} /> Clear Cart
              </button>
            )}
          </div>

          <div className="cart-items-list" role="list" aria-label="Cart items">
            {items.map((item, index) => (
              <motion.article
                key={item.id}
                className="cart-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <div className="item-image-wrapper">
                  <img src={item.image} alt={item.name} className="item-image" loading="lazy" />
                  {!item.inStock && <div className="item-out-of-stock">Out of Stock</div>}
                </div>
                
                <div className="item-details">
                  <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                  <div className="item-meta">
                    <span className="item-category">{item.category.replace('-', ' ')}</span>
                    {item.organic && <span className="item-organic"><Leaf size={12} /> Organic</span>}
                    <span className="item-unit">/{item.unit}</span>
                  </div>
                  <div className="item-price-row">
                    <span className="item-current-price">{formatPrice(item.price)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="item-original-price">{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>
                </div>

                <div className="item-quantity">
                  <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity for {item.name}</label>
                  <div className="quantity-selector">
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || !item.inStock}
                      aria-label={`Decrease ${item.name} quantity`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1)
                        updateQuantity(item.id, Math.min(val, item.stockCount || 99))
                      }}
                      min="1"
                      max={item.stockCount || 99}
                      className="qty-input"
                      disabled={!item.inStock}
                    />
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.stockCount || 99) || !item.inStock}
                      aria-label={`Increase ${item.name} quantity`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <span className="total-price">{formatPrice(item.price * item.quantity)}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isCheckingOut}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div 
            className="continue-shopping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/shop" className="btn btn-outline btn-lg">
              <ArrowLeft size={18} />
              <span>Continue Shopping</span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.aside 
          className="cart-summary"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="summary-card">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="coupon-section">
              <div className="coupon-input-wrapper">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="coupon-input"
                  disabled={!!appliedCoupon}
                  aria-label="Coupon code"
                />
                {appliedCoupon ? (
                  <button className="coupon-applied-btn" onClick={removeCoupon} aria-label="Remove coupon">
                    <Tag size={16} /> {appliedCoupon.code} Applied
                  </button>
                ) : (
                  <button className="apply-coupon-btn" onClick={applyCoupon} disabled={!couponCode.trim()}>
                    Apply
                  </button>
                )}
              </div>
              {couponError && <p className="coupon-error">{couponError}</p>}
              {appliedCoupon && (
                <p className="coupon-success">
                  <Tag size={14} /> {appliedCoupon.description} - You saved {appliedCoupon.flat ? formatPrice(appliedCoupon.discount) : `${appliedCoupon.discount}%`}
                </p>
              )}
              <div className="available-coupons">
                <p className="coupons-hint">Available: </p>
                <div className="coupon-tags">
                  {Object.values(coupons).map(coupon => (
                    <button
                      key={coupon.code}
                      className="coupon-tag"
                      onClick={() => { setCouponCode(coupon.code); applyCoupon() }}
                      disabled={appliedCoupon || subtotal < coupon.minOrder}
                    >
                      {coupon.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? 'free' : ''}>
                {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                {deliveryFee > 0 && <span className="delivery-hint"> (Free over ₹499)</span>}
              </span>
            </div>

            {discount > 0 && (
              <motion.div className="summary-row discount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="discount-amount">-{formatPrice(discount)}</span>
              </motion.div>
            )}

            <div className="summary-divider total-divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="summary-guarantees">
              <div className="guarantee">
                <Shield size={16} />
                <span>Secure Payment</span>
              </div>
              <div className="guarantee">
                <RotateCcw size={16} />
                <span>Easy Returns</span>
              </div>
              <div className="guarantee">
                <Star size={16} />
                <span>Quality Guaranteed</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut || items.some(item => !item.inStock)}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>Proceed to Checkout</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>

            {items.some(item => !item.inStock) && (
              <p className="checkout-warning">
                Some items are out of stock. Please update your cart.
              </p>
            )}

            <p className="secure-checkout">
              <Shield size={14} /> 100% Secure Checkout • Multiple Payment Options
            </p>
          </div>

          <motion.div 
            className="free-delivery-progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="progress-header">
              <span>Free Delivery Progress</span>
              <span>{subtotal >= 499 ? 'Achieved!' : `${formatPrice(499 - subtotal)} more`}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
            <p className="progress-text">
              {subtotal >= 499 
                ? '🎉 You qualify for free delivery!' 
                : `Add ${formatPrice(499 - subtotal)} more for free delivery`}
            </p>
          </motion.div>
        </motion.aside>
      </div>

      <motion.section 
        className="cart-benefits"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Truck size={24} />
              </div>
              <h3>Free Delivery</h3>
              <p>On orders above ₹499</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Leaf size={24} />
              </div>
              <h3>Fresh Guarantee</h3>
              <p>Or full refund</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Shield size={24} />
              </div>
              <h3>Secure Payment</h3>
              <p>100% encrypted</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <RotateCcw size={24} />
              </div>
              <h3>Easy Returns</h3>
              <p>Within 24 hours</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Cart