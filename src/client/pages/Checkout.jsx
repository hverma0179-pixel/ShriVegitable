import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Check, CreditCard, Truck, Shield, Star, Leaf, MapPin, Phone, Mail, Lock, User, Home, Building, ChevronDown, Loader2, ArrowLeft } from 'lucide-react'
import { formatPrice } from '../utils/helpers'
import { useCartStore } from '../stores'

const Checkout = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderId, setOrderId] = useState('')

  const totalItems = getTotalItems()
  const subtotal = getTotalPrice()
  const deliveryFee = subtotal >= 499 ? 0 : 40
  const total = subtotal + deliveryFee

  const steps = [
    { number: 1, title: 'Delivery', icon: Truck, description: 'Shipping address' },
    { number: 2, title: 'Payment', icon: CreditCard, description: 'Payment method' },
    { number: 3, title: 'Review', icon: Check, description: 'Confirm order' },
  ]

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'home',
    saveAddress: true,
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    upiId: '',
    saveCard: false,
  })

  const [errors, setErrors] = useState({})

  const validateStep = (step) => {
    const newErrors = {}
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid Indian phone number'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.state.trim()) newErrors.state = 'State is required'
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode (6 digits)'
    }
    if (step === 2) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
        else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number'
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required'
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Invalid format (MM/YY)'
        if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV is required'
        else if (!/^\d{3}$/.test(formData.cardCvv)) newErrors.cardCvv = 'Invalid CVV'
        if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required'
      }
      if (formData.paymentMethod === 'upi') {
        if (!formData.upiId.trim()) newErrors.upiId = 'UPI ID is required'
        else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId)) newErrors.upiId = 'Invalid UPI ID format'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(3)) return
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    const newOrderId = 'SVG' + Date.now().toString().slice(-8)
    setOrderId(newOrderId)
    setOrderConfirmed(true)
    clearCart()
    setIsProcessing(false)
  }

  if (items.length === 0 && !orderConfirmed) {
    navigate('/cart')
    return null
  }

  if (orderConfirmed) {
    return (
      <div className="checkout-page confirmed">
        <div className="container">
          <motion.div className="confirmation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div className="success-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <Check size={64} />
            </motion.div>
            <h1>Order Confirmed!</h1>
            <p className="order-id">Order ID: <strong>{orderId}</strong></p>
            <p className="confirmation-message">Thank you for your order! We've sent a confirmation to <strong>{formData.email}</strong> and SMS to <strong>{formData.phone}</strong>.</p>
            <div className="confirmation-details">
              <div className="detail-item">
                <Truck size={20} />
                <div>
                  <span className="detail-label">Delivery Address</span>
                  <span className="detail-value">{formData.firstName} {formData.lastName}, {formData.address}, {formData.city} - {formData.pincode}</span>
                </div>
              </div>
              <div className="detail-item">
                <CreditCard size={20} />
                <div>
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}</span>
                </div>
              </div>
              <div className="detail-item">
                <Star size={20} />
                <div>
                  <span className="detail-label">Total Paid</span>
                  <span className="detail-value">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <div className="confirmation-actions">
              <Link to="/account/orders" className="btn btn-primary btn-lg">
                <ArrowLeft size={18} />
                <span>View My Orders</span>
              </Link>
              <Link to="/shop" className="btn btn-outline btn-lg">Continue Shopping</Link>
            </div>
            <p className="delivery-info">
              <Truck size={16} /> Your fresh vegetables will be delivered within 2 hours. Track your order in the <Link to="/account/orders">Orders</Link> section.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <Link to="/cart" className="back-link" onClick={(e) => { if (currentStep === 1) { e.preventDefault(); navigate('/cart') } }}>
            <ArrowLeft size={18} /> Back to Cart
          </Link>
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Complete your order in 3 easy steps</p>
        </div>
      </motion.div>

      <nav className="checkout-progress" aria-label="Checkout progress">
        <div className="container">
          <div className="progress-line" />
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={`progress-step ${currentStep > step.number ? 'completed' : currentStep === step.number ? 'active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="step-circle">
                {currentStep > step.number ? <Check size={16} /> : <step.icon size={16} />}
              </div>
              <div className="step-label">
                <span className="step-title">{step.title}</span>
                <span className="step-description">{step.description}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </nav>

      <div className="container checkout-container">
        <motion.div 
          className="checkout-form-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form onSubmit={handleSubmit} className="checkout-form">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  key="delivery"
                  className="form-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2>Delivery Address</h2>
                  <p className="step-hint">Where should we deliver your fresh vegetables?</p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                        placeholder="Enter first name"
                        required
                        autoComplete="given-name"
                      />
                      {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'error' : ''}
                        placeholder="Enter last name"
                        required
                        autoComplete="family-name"
                      />
                      {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'error' : ''}
                        placeholder="+91 98765 43210"
                        required
                        autoComplete="tel"
                        maxLength={13}
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Full Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'error' : ''}
                      placeholder="House/Flat number, Building name, Street, Area"
                      rows={3}
                      required
                      autoComplete="street-address"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="apartment">Apartment/Suite (Optional)</label>
                    <input
                      id="apartment"
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Floor, Apartment, Landmark"
                      autoComplete="address-line2"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'error' : ''}
                        placeholder="Enter city"
                        required
                        autoComplete="address-level2"
                      />
                      {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={errors.state ? 'error' : ''}
                        required
                        autoComplete="address-level1"
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                        <option value="Daman and Diu">Daman and Diu</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                      </select>
                      {errors.state && <span className="error-message">{errors.state}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="pincode">Pincode *</label>
                      <input
                        id="pincode"
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={errors.pincode ? 'error' : ''}
                        placeholder="123456"
                        required
                        autoComplete="postal-code"
                        maxLength={6}
                      />
                      {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="landmark">Landmark (Optional)</label>
                    <input
                      id="landmark"
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Nearby landmark for easy delivery"
                    />
                  </div>

                  <fieldset className="form-group address-type">
                    <legend>Address Type</legend>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="addressType"
                          value="home"
                          checked={formData.addressType === 'home'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-custom"><Home size={16} /></span>
                        <span>Home</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="addressType"
                          value="work"
                          checked={formData.addressType === 'work'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-custom"><Building size={16} /></span>
                        <span>Work</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="addressType"
                          value="other"
                          checked={formData.addressType === 'other'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-custom"><MapPin size={16} /></span>
                        <span>Other</span>
                      </label>
                    </div>
                  </fieldset>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="saveAddress"
                        checked={formData.saveAddress}
                        onChange={handleInputChange}
                      />
                      <span className="checkbox-custom"><Check size={14} /></span>
                      <span>Save this address for future orders</span>
                    </label>
                  </div>

                  <div className="step-actions">
                    <button type="button" className="btn btn-secondary btn-lg" onClick={handleBack} disabled={currentStep === 1}>
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                      Continue <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="payment"
                  className="form-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2>Payment Method</h2>
                  <p className="step-hint">Choose how you'd like to pay</p>

                  <div className="payment-methods" role="radiogroup" aria-label="Payment method">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives', icon: Truck },
                      { id: 'card', label: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay, Amex', icon: CreditCard },
                      { id: 'upi', label: 'UPI', description: 'PhonePe, Google Pay, Paytm, BHIM', icon: Smartphone },
                    ].map(method => (
                      <label key={method.id} className={`payment-method ${formData.paymentMethod === method.id ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                        />
                        <div className="method-content">
                          <method.icon size={24} className="method-icon" />
                          <div className="method-info">
                            <span className="method-label">{method.label}</span>
                            <span className="method-description">{method.description}</span>
                          </div>
                        </div>
                        <div className="method-check"><Check size={20} /></div>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <motion.div className="card-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="card-header">
                        <Lock size={18} />
                        <span>Card Details</span>
                        <span className="secure-badge">Secured by Razorpay</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardNumber">Card Number *</label>
                        <input
                          id="cardNumber"
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={errors.cardNumber ? 'error' : ''}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          autoComplete="cc-number"
                        />
                        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="cardExpiry">Expiry (MM/YY) *</label>
                          <input
                            id="cardExpiry"
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className={errors.cardExpiry ? 'error' : ''}
                            placeholder="MM/YY"
                            maxLength={5}
                            autoComplete="cc-exp"
                          />
                          {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="cardCvv">CVV *</label>
                          <input
                            id="cardCvv"
                            type="password"
                            name="cardCvv"
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            className={errors.cardCvv ? 'error' : ''}
                            placeholder="123"
                            maxLength={3}
                            autoComplete="cc-csc"
                          />
                          {errors.cardCvv && <span className="error-message">{errors.cardCvv}</span>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardName">Name on Card *</label>
                        <input
                          id="cardName"
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={errors.cardName ? 'error' : ''}
                          placeholder="John Doe"
                          autoComplete="cc-name"
                        />
                        {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                      </div>
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="saveCard"
                            checked={formData.saveCard}
                            onChange={handleInputChange}
                          />
                          <span className="checkbox-custom"><Check size={14} /></span>
                          <span>Save card for future orders (tokenized)</span>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <motion.div className="upi-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="upi-header">
                        <Smartphone size={18} />
                        <span>UPI Payment</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="upiId">UPI ID *</label>
                        <input
                          id="upiId"
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          className={errors.upiId ? 'error' : ''}
                          placeholder="yourname@upi"
                          autoComplete="off"
                        />
                        {errors.upiId && <span className="error-message">{errors.upiId}</span>}
                      </div>
                      <p className="upi-hint">You'll receive a payment request on your UPI app after placing the order.</p>
                    </motion.div>
                  )}

                  <div className="step-actions">
                    <button type="button" className="btn btn-secondary btn-lg" onClick={handleBack}>
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                      Continue <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                  key="review"
                  className="form-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2>Review Your Order</h2>
                  <p className="step-hint">Please verify all details before placing your order</p>

                  <div className="review-section">
                    <h3>Delivery Address</h3>
                    <address className="review-address">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.address}</p>
                      {formData.apartment && <p>{formData.apartment}</p>}
                      <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                      <p>Phone: {formData.phone}</p>
                      <p>Email: {formData.email}</p>
                    </address>
                    <Link to="/checkout" className="edit-link" onClick={() => setCurrentStep(1)}>Edit</Link>
                  </div>

                  <div className="review-section">
                    <h3>Payment Method</h3>
                    <div className="review-payment">
                      <div className="payment-icon">
                        {formData.paymentMethod === 'cod' && <Truck size={24} />}
                        {formData.paymentMethod === 'card' && <CreditCard size={24} />}
                        {formData.paymentMethod === 'upi' && <Smartphone size={24} />}
                      </div>
                      <div>
                        <p>{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}</p>
                        {formData.paymentMethod === 'card' && <p className="card-last4">Ending in {formData.cardNumber.slice(-4)}</p>}
                        {formData.paymentMethod === 'upi' && <p className="upi-display">{formData.upiId}</p>}
                      </div>
                    </div>
                    <Link to="/checkout" className="edit-link" onClick={() => setCurrentStep(2)}>Edit</Link>
                  </div>

                  <div className="review-section">
                    <h3>Order Items</h3>
                    <div className="review-items">
                      {items.map(item => (
                        <div key={item.id} className="review-item">
                          <img src={item.image} alt={item.name} className="review-item-image" />
                          <div className="review-item-details">
                            <p className="review-item-name">{item.name}</p>
                            <p className="review-item-meta">Qty: {item.quantity} × {formatPrice(item.price)}/{item.unit}</p>
                          </div>
                          <span className="review-item-price">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="review-section terms">
                    <label className="checkbox-label">
                      <input type="checkbox" required onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))} />
                      <span className="checkbox-custom"><Check size={14} /></span>
                      <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" onChange={(e) => setFormData(prev => ({ ...prev, marketing: e.target.checked }))} />
                      <span className="checkbox-custom"><Check size={14} /></span>
                      <span>Send me offers and updates via email/SMS</span>
                    </label>
                  </div>

                  <div className="step-actions">
                    <button type="button" className="btn btn-secondary btn-lg" onClick={handleBack}>
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg place-order-btn" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="spinner" size={20} />
                          <span>Placing Order...</span>
                        </>
                      ) : (
                        <>
                          <span>Place Order</span>
                          <span className="order-total">{formatPrice(total)}</span>
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        <motion.aside 
          className="checkout-summary"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="summary-card sticky">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} className="summary-item-image" />
                  <div className="summary-item-details">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-qty">{item.quantity} × {formatPrice(item.price)}/{item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? 'free' : ''}>
                {deliveryFee === 0 ? (
                  <>
                    <Star size={14} className="free-icon" /> Free
                  </>
                ) : formatPrice(deliveryFee)}
              </span>
            </div>
            {deliveryFee > 0 && (
              <p className="delivery-hint">Add ₹{499 - subtotal} more for free delivery</p>
            )}
            <div className="summary-divider total-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="secure-note">
              <Lock size={14} /> 100% Secure • No hidden charges
            </p>
          </div>

          <div className="summary-guarantees">
            <div className="guarantee">
              <Shield size={18} />
              <div>
                <h4>Secure Payment</h4>
                <p>Razorpay encrypted checkout</p>
              </div>
            </div>
            <div className="guarantee">
              <Truck size={18} />
              <div>
                <h4>Fast Delivery</h4>
                <p>Within 2 hours</p>
              </div>
            </div>
            <div className="guarantee">
              <Leaf size={18} />
              <div>
                <h4>Freshness Guaranteed</h4>
                <p>Or full refund</p>
              </div>
            </div>
            <div className="guarantee">
              <Star size={18} />
              <div>
                <h4>Quality Assured</h4>
                <p>Hand-picked daily</p>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}

const Smartphone = ({ size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size} {...props}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
)

export default Checkout