import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams, Outlet, useLocation } from 'react-router-dom'
import { User, Package, Heart, CreditCard, Settings, LogOut, Bell, Shield, Truck, Leaf, Star, ArrowRight, Edit, Calendar, MapPin, Phone, Mail, Lock, ChevronRight, Loader2, Menu, X, Check, Trash2 } from 'lucide-react'
import { formatPrice, formatDate } from '../utils/helpers'
import { useCartStore, useWishlistStore } from '../stores'

const accountTabs = [
  { id: 'orders', label: 'My Orders', icon: Package, count: 5 },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, count: 3 },
  { id: 'addresses', label: 'Addresses', icon: MapPin, count: 2 },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard, count: 1 },
  { id: 'notifications', label: 'Notifications', icon: Bell, count: 0 },
  { id: 'settings', label: 'Settings', icon: Settings, count: 0 },
]

const mockOrders = [
  {
    id: 'SVG2024001',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { id: 1, name: 'Fresh Tomatoes', quantity: 2, price: 40, unit: 'kg', image: 'https://images.unsplash.com/photo-1546470427-e4e29e8a6b06?w=100&h=100&fit=crop' },
      { id: 2, name: 'Organic Carrots', quantity: 1, price: 35, unit: 'kg', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100&h=100&fit=crop' },
    ],
    total: 115,
    deliveryAddress: '123 Green Street, Mumbai, Maharashtra - 400001',
    paymentMethod: 'UPI',
    trackingId: 'TRK789456123',
  },
  {
    id: 'SVG2024002',
    date: '2024-01-12',
    status: 'shipped',
    items: [
      { id: 3, name: 'Fresh Spinach', quantity: 3, price: 25, unit: 'bunch', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop' },
    ],
    total: 75,
    deliveryAddress: '123 Green Street, Mumbai, Maharashtra - 400001',
    paymentMethod: 'Cash on Delivery',
    trackingId: 'TRK789456124',
  },
  {
    id: 'SVG2024003',
    date: '2024-01-10',
    status: 'processing',
    items: [
      { id: 4, name: 'Red Bell Peppers', quantity: 1, price: 60, unit: 'kg', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=100&h=100&fit=crop' },
      { id: 5, name: 'Broccoli Crowns', quantity: 2, price: 45, unit: 'kg', image: 'https://images.unsplash.com/photo-1584270354949-0df9ba93860b?w=100&h=100&fit=crop' },
    ],
    total: 150,
    deliveryAddress: '456 Office Park, Bangalore, Karnataka - 560001',
    paymentMethod: 'Credit Card',
    trackingId: 'TRK789456125',
  },
  {
    id: 'SVG2024004',
    date: '2024-01-08',
    status: 'cancelled',
    items: [
      { id: 6, name: 'Cauliflower', quantity: 1, price: 35, unit: 'piece', image: 'https://images.unsplash.com/photo-1626850336914-4e1b8b8c8e4b?w=100&h=100&fit=crop' },
    ],
    total: 35,
    deliveryAddress: '123 Green Street, Mumbai, Maharashtra - 400001',
    paymentMethod: 'UPI',
    trackingId: null,
  },
  {
    id: 'SVG2024005',
    date: '2024-01-05',
    status: 'delivered',
    items: [
      { id: 7, name: 'Fresh Cucumber', quantity: 2, price: 20, unit: 'kg', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a9?w=100&h=100&fit=crop' },
      { id: 8, name: 'Red Onions', quantity: 1, price: 30, unit: 'kg', image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=100&h=100&fit=crop' },
    ],
    total: 70,
    deliveryAddress: '123 Green Street, Mumbai, Maharashtra - 400001',
    paymentMethod: 'Cash on Delivery',
    trackingId: 'TRK789456126',
  },
]

const mockAddresses = [
  {
    id: 1,
    type: 'home',
    isDefault: true,
    firstName: 'Rajesh',
    lastName: 'Kumar',
    address: '123 Green Street, Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 98765 43210',
    landmark: 'Near City Mall',
  },
  {
    id: 2,
    type: 'work',
    isDefault: false,
    firstName: 'Rajesh',
    lastName: 'Kumar',
    address: '456 Office Park, Tower A, Floor 12',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 98765 43210',
    landmark: 'Opposite Metro Station',
  },
]

const mockPayments = [
  {
    id: 1,
    type: 'upi',
    isDefault: true,
    upiId: 'rajesh.kumar@upi',
    label: 'Primary UPI',
  },
  {
    id: 2,
    type: 'card',
    isDefault: false,
    last4: '4242',
    brand: 'Visa',
    expiry: '12/25',
    label: 'Visa ending in 4242',
  },
]

const mockNotifications = [
  { id: 1, type: 'order', title: 'Order Delivered', message: 'Your order SVG2024001 has been delivered', time: '2024-01-15T10:30:00', read: true },
  { id: 2, type: 'offer', title: 'Special Offer', message: 'Get 20% off on organic vegetables this weekend!', time: '2024-01-14T09:00:00', read: false },
  { id: 3, type: 'restock', title: 'Back in Stock', message: 'Your wishlisted item "Fresh Spinach" is back in stock', time: '2024-01-13T14:20:00', read: false },
  { id: 4, type: 'delivery', title: 'Order Shipped', message: 'Your order SVG2024002 is out for delivery', time: '2024-01-12T16:45:00', read: true },
]

const Account = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  const [editingAddress, setEditingAddress] = useState(null)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const { items: cartItems } = useCartStore()
  const { getCount } = useWishlistStore()
  const location = useLocation()
  const params = useParams()

  const currentTab = params.tab || activeTab

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { label: 'Delivered', color: '#2E7D32', icon: Check },
      shipped: { label: 'Shipped', color: '#1565C0', icon: Truck },
      processing: { label: 'Processing', color: '#F57F17', icon: Loader2 },
      cancelled: { label: 'Cancelled', color: '#C62828', icon: X },
    }
    return configs[status] || configs.processing
  }

  return (
    <div className="account-page">
      <motion.div 
        className="account-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <div className="header-content">
            <div className="user-profile">
              <div className="avatar">
                <User size={40} />
              </div>
              <div className="user-info">
                <h1>Welcome back, Rajesh!</h1>
                <p className="user-email">rajesh.kumar@example.com</p>
                <div className="user-stats">
                  <span><strong>5</strong> Orders</span>
                  <span><strong>{getCount()}</strong> Wishlist Items</span>
                  <span><strong>2</strong> Saved Addresses</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <Link to="/cart" className="btn btn-ghost cart-link">
                <Package size={20} />
                <span>Cart ({cartItems.length})</span>
              </Link>
              <button className="btn btn-outline" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container account-container">
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div className="mobile-menu-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} onClick={e => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <h3>Account Menu</h3>
                  <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={24} /></button>
                </div>
                <nav className="mobile-tabs">
                  {accountTabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`mobile-tab ${currentTab === tab.id ? 'active' : ''}`}
                      onClick={() => { handleTabChange(tab.id); setMobileMenuOpen(false) }}
                    >
                      <tab.icon size={20} />
                      <span>{tab.label}</span>
                      {tab.count > 0 && <span className="tab-badge">{tab.count}</span>}
                    </button>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="account-grid">
          <aside className="account-sidebar">
            <nav className="account-tabs" aria-label="Account sections">
              {accountTabs.map(tab => (
                <Link
                  key={tab.id}
                  to={`/account/${tab.id}`}
                  className={`account-tab ${currentTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && <span className="tab-badge">{tab.count}</span>}
                  <ChevronRight size={16} />
                </Link>
              ))}
            </nav>

            <div className="sidebar-footer">
              <div className="loyalty-card">
                <div className="loyalty-header">
                  <Leaf size={24} />
                  <span>Green Rewards</span>
                </div>
                <div className="loyalty-points">
                  <span className="points">1,250</span>
                  <span className="points-label">Points</span>
                </div>
                <p className="loyalty-desc">Redeem for discounts on future orders</p>
                <Link to="/rewards" className="btn btn-primary btn-sm">View Rewards</Link>
              </div>

              <div className="referral-card">
                <h4>Refer & Earn</h4>
                <p>Share your code <strong>RAJESH123</strong> and get ₹100 when they order</p>
                <button className="btn btn-ghost btn-sm">Share Code</button>
              </div>

              <button className="btn btn-danger logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          <main className="account-main">
            <AnimatePresence mode="wait">
              {currentTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="section-header">
                    <h2>My Orders</h2>
                    <Link to="/shop" className="btn btn-outline btn-sm">Shop Again</Link>
                  </div>

                  <div className="orders-filters">
                    <select className="filter-select" defaultValue="all">
                      <option value="all">All Orders</option>
                      <option value="delivered">Delivered</option>
                      <option value="shipped">Shipped</option>
                      <option value="processing">Processing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="orders-list">
                    {mockOrders.map((order, index) => (
                      <motion.article
                        key={order.id}
                        className="order-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="order-header">
                          <div className="order-meta">
                            <span className="order-id">Order <strong>{order.id}</strong></span>
                            <span className="order-date">{formatDate(order.date)}</span>
                          </div>
                          <div className="order-status">
                            <StatusBadge status={order.status} />
                          </div>
                        </div>

                        <div className="order-items">
                          {order.items.slice(0, 3).map(item => (
                            <div key={item.id} className="order-item">
                              <img src={item.image} alt={item.name} className="order-item-image" />
                              <div className="order-item-details">
                                <p className="order-item-name">{item.name}</p>
                                <p className="order-item-qty">Qty: {item.quantity} × {formatPrice(item.price)}/{item.unit}</p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="order-item-more">+{order.items.length - 3} more items</div>
                          )}
                        </div>

                        <div className="order-footer">
                          <div className="order-summary">
                            <span className="order-total">Total: <strong>{formatPrice(order.total)}</strong></span>
                            <span className="order-payment">{order.paymentMethod}</span>
                          </div>
                          <div className="order-actions">
                            {order.status !== 'cancelled' && order.trackingId && (
                              <button className="btn btn-ghost btn-sm">
                                <Truck size={16} />
                                <span>Track</span>
                              </button>
                            )}
                            {order.status === 'delivered' && (
                              <button className="btn btn-primary btn-sm">
                                <ArrowRight size={16} />
                                <span>Reorder</span>
                              </button>
                            )}
                            <Link to={`/account/orders/${order.id}`} className="btn btn-outline btn-sm">
                              Details
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>

                  <div className="orders-pagination">
                    <button className="page-btn" disabled><ChevronLeft size={18} /></button>
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn"><ChevronRight size={18} /></button>
                  </div>
                </motion.div>
              )}

              {currentTab === 'wishlist' && (
                <motion.div key="wishlist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="section-header">
                    <h2>My Wishlist</h2>
                    <div className="wishlist-actions">
                      <button className="btn btn-primary btn-sm">Add All to Cart</button>
                      <button className="btn btn-outline btn-sm">Clear Wishlist</button>
                    </div>
                  </div>
                  <p className="empty-state">Your wishlist items appear here. Visit the <Link to="/shop">Shop</Link> to add favorites!</p>
                </motion.div>
              )}

              {currentTab === 'addresses' && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="section-header">
                    <h2>Saved Addresses</h2>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddAddress(true)}>
                      <MapPin size={16} /> Add New Address
                    </button>
                  </div>

                  <div className="addresses-grid">
                    {mockAddresses.map((address, index) => (
                      <motion.article
                        key={address.id}
                        className={`address-card ${address.isDefault ? 'default' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="address-header">
                          <span className="address-type">{address.type === 'home' ? '🏠 Home' : address.type === 'work' ? '🏢 Work' : '📍 Other'}</span>
                          {address.isDefault && <span className="default-badge">Default</span>}
                        </div>
                        <address className="address-content">
                          <p><strong>{address.firstName} {address.lastName}</strong></p>
                          <p>{address.address}</p>
                          <p>{address.landmark && `${address.landmark}, `}{address.city}, {address.state} - {address.pincode}</p>
                          <p>{address.phone}</p>
                        </address>
                        <div className="address-actions">
                          {!address.isDefault && (
                            <button className="btn btn-ghost btn-sm">Set as Default</button>
                          )}
                          <button className="btn btn-outline btn-sm" onClick={() => setEditingAddress(address)}>Edit</button>
                          <button className="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentTab === 'payments' && (
                <motion.div key="payments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="section-header">
                    <h2>Payment Methods</h2>
                    <button className="btn btn-primary btn-sm">Add Payment Method</button>
                  </div>

                  <div className="payments-list">
                    {mockPayments.map((payment, index) => (
                      <motion.article
                        key={payment.id}
                        className={`payment-card ${payment.isDefault ? 'default' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="payment-icon">
                          {payment.type === 'upi' ? <Smartphone size={32} /> : <CreditCard size={32} />}
                        </div>
                        <div className="payment-details">
                          <h4>{payment.label}</h4>
                          <p>{payment.type === 'upi' ? `UPI: ${payment.upiId}` : `${payment.brand} ending in ${payment.last4} • Expires ${payment.expiry}`}</p>
                        </div>
                        <div className="payment-actions">
                          {!payment.isDefault && <button className="btn btn-ghost btn-sm">Set Default</button>}
                          <button className="btn btn-danger btn-sm">Remove</button>
                        </div>
                        {payment.isDefault && <span className="default-tag">Default</span>}
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentTab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="section-header">
                    <h2>Notifications</h2>
                    <button className="btn btn-outline btn-sm">Mark All Read</button>
                  </div>

                  <div className="notifications-list">
                    {mockNotifications.map((notification, index) => (
                      <motion.article
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="notification-icon">
                          {notification.type === 'order' && <Package size={20} />}
                          {notification.type === 'offer' && <Tag size={20} />}
                          {notification.type === 'restock' && <Leaf size={20} />}
                          {notification.type === 'delivery' && <Truck size={20} />}
                        </div>
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">{formatDate(notification.time)}</span>
                        </div>
                        {!notification.read && <div className="unread-dot" />}
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="section-header">
                    <h2>Account Settings</h2>
                  </div>

                  <div className="settings-sections">
                    <section className="settings-card">
                      <h3>Profile Information</h3>
                      <form className="settings-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input id="firstName" type="text" defaultValue="Rajesh" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input id="lastName" type="text" defaultValue="Kumar" />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" defaultValue="rajesh.kumar@example.com" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input id="phone" type="tel" defaultValue="+91 98765 43210" />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                      </form>
                    </section>

                    <section className="settings-card">
                      <h3>Password & Security</h3>
                      <form className="settings-form">
                        <div className="form-group">
                          <label htmlFor="currentPassword">Current Password</label>
                          <input id="currentPassword" type="password" />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input id="newPassword" type="password" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input id="confirmPassword" type="password" />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Update Password</button>
                      </form>
                    </section>

                    <section className="settings-card">
                      <h3>Preferences</h3>
                      <div className="preferences-list">
                        <label className="preference-item">
                          <input type="checkbox" defaultChecked />
                          <span>Email notifications for orders</span>
                        </label>
                        <label className="preference-item">
                          <input type="checkbox" defaultChecked />
                          <span>SMS notifications for delivery updates</span>
                        </label>
                        <label className="preference-item">
                          <input type="checkbox" defaultChecked />
                          <span>Promotional offers and discounts</span>
                        </label>
                        <label className="preference-item">
                          <input type="checkbox" />
                          <span>Weekly newsletter with recipes</span>
                        </label>
                        <label className="preference-item">
                          <input type="checkbox" defaultChecked />
                          <span>Price drop alerts for wishlist items</span>
                        </label>
                      </div>
                    </section>

                    <section className="settings-card danger-zone">
                      <h3>Danger Zone</h3>
                      <p>These actions are irreversible. Please proceed with caution.</p>
                      <div className="danger-actions">
                        <button className="btn btn-outline">Download My Data</button>
                        <button className="btn btn-danger">Delete Account</button>
                      </div>
                    </section>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {editingAddress && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingAddress(null)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Address</h3>
                <button onClick={() => setEditingAddress(null)}><X size={24} /></button>
              </div>
              <form className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label>First Name</label><input type="text" defaultValue={editingAddress.firstName} /></div>
                  <div className="form-group"><label>Last Name</label><input type="text" defaultValue={editingAddress.lastName} /></div>
                </div>
                <div className="form-group"><label>Address</label><textarea defaultValue={editingAddress.address} rows={2} /></div>
                <div className="form-group"><label>Landmark</label><input type="text" defaultValue={editingAddress.landmark} /></div>
                <div className="form-row">
                  <div className="form-group"><label>City</label><input type="text" defaultValue={editingAddress.city} /></div>
                  <div className="form-group"><label>State</label><input type="text" defaultValue={editingAddress.state} /></div>
                  <div className="form-group"><label>Pincode</label><input type="text" defaultValue={editingAddress.pincode} maxLength={6} /></div>
                </div>
                <div className="form-group"><label>Phone</label><input type="tel" defaultValue={editingAddress.phone} /></div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingAddress(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showAddAddress && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddAddress(false)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Address</h3>
                <button onClick={() => setShowAddAddress(false)}><X size={24} /></button>
              </div>
              <form className="modal-body">
                <div className="form-group">
                  <label>Address Type</label>
                  <select defaultValue="home">
                    <option value="home">🏠 Home</option>
                    <option value="work">🏢 Work</option>
                    <option value="other">📍 Other</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>First Name</label><input type="text" /></div>
                  <div className="form-group"><label>Last Name</label><input type="text" /></div>
                </div>
                <div className="form-group"><label>Address</label><textarea rows={2} placeholder="House/Flat, Building, Street, Area" /></div>
                <div className="form-group"><label>Landmark</label><input type="text" placeholder="Nearby landmark" /></div>
                <div className="form-row">
                  <div className="form-group"><label>City</label><input type="text" /></div>
                  <div className="form-group"><label>State</label><input type="text" /></div>
                  <div className="form-group"><label>Pincode</label><input type="text" maxLength={6} /></div>
                </div>
                <div className="form-group"><label>Phone</label><input type="tel" /></div>
                <div className="form-group checkbox-group">
                  <label><input type="checkbox" defaultChecked /> Save as default address</label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddAddress(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Address</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatusBadge({ status }) {
  const config = {
    delivered: { label: 'Delivered', color: '#2E7D32', icon: Check },
    shipped: { label: 'Shipped', color: '#1565C0', icon: Truck },
    processing: { label: 'Processing', color: '#F57F17', icon: Loader2 },
    cancelled: { label: 'Cancelled', color: '#C62828', icon: X },
  }
  const { label, color, icon: Icon } = config[status] || config.processing
  return (
    <span className="status-badge" style={{ backgroundColor: `${color}15`, color, borderColor: `${color}40` }}>
      <Icon size={12} /> {label}
    </span>
  )
}

function Smartphone({ size, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size} {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

export default Account