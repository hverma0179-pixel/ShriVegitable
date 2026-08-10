import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Save, X, Loader2, Eye, EyeOff, 
  Tag, DollarSign, Package, AlertCircle, CheckCircle, LogOut, LayoutDashboard
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../utils/api'
import { formatPrice } from '../utils/helpers'
import { useCartStore } from '../stores'
import toast from 'react-hot-toast'

const Admin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { closeCart } = useCartStore()
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'))
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', stock: '', unit: 'kg',
    image: '', description: '', featured: false
  })
  const [errors, setErrors] = useState({})
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) fetchData()
  }, [isLoggedIn])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.products.list(),
        api.products.categories()
      ])
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
    } catch (err) {
      toast.error('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const res = await api.admin.login(loginData.email, loginData.password)
      localStorage.setItem('adminToken', res.data.token)
      setIsLoggedIn(true)
      toast.success('Logged in successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    setProducts([])
    toast.success('Logged out')
  }

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        image: product.image || '',
        description: product.description || '',
        featured: product.featured || false
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: '', category: '', price: '', stock: '', unit: 'kg', image: '', description: '', featured: false })
    }
    setErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({ name: '', category: '', price: '', stock: '', unit: 'kg', image: '', description: '', featured: false })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price required'
    if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = 'Valid stock required'
    if (!formData.unit) newErrors.unit = 'Unit is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const data = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      unit: formData.unit,
      image: formData.image.trim() || '🥬',
      description: formData.description.trim(),
      featured: formData.featured
    }

    setLoading(true)
    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, data)
        toast.success('Product updated')
      } else {
        await api.products.create(data)
        toast.success('Product created')
      }
      closeModal()
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.products.delete(id)
      toast.success('Product deleted')
      fetchData()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <motion.div 
          className="admin-login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-login-header">
            <LayoutDashboard className="admin-login-icon" />
            <h1>Admin Panel</h1>
            <p>Sign in to manage products</p>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
                disabled={loginLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
                disabled={loginLoading}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loginLoading}>
              {loginLoading ? <Loader2 className="spin" /> : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <LayoutDashboard className="admin-logo" />
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <button className="admin-nav-item active">
            <Tag /> Products
          </button>
          <button className="admin-nav-item">
            <Package /> Orders
          </button>
          <button className="admin-nav-item" onClick={handleLogout}>
            <LogOut /> Logout
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer">View Store →</a>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Products Management</h1>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus /> Add Product
          </button>
        </header>

        {loading && <div className="admin-loading"><Loader2 className="spin" /></div>}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-image">{product.image || '🥬'}</span>
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td><span className="category-badge">{product.category}</span></td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={product.stock > 0 ? 'stock-ok' : 'stock-low'}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.unit}</td>
                  <td>
                    <span className={`status-badge ${product.featured ? 'featured' : ''} ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.featured ? '⭐ Featured' : product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => openModal(product)} title="Edit">
                        <Edit />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(product.id)} title="Delete">
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="admin-empty">
              <Package className="admin-empty-icon" />
              <p>No products yet. Click "Add Product" to start.</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div 
              className="admin-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div 
                className="admin-modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="admin-modal-header">
                  <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                  <button className="btn-icon" onClick={closeModal}><X /></button>
                </div>
                <form onSubmit={handleSubmit} className="admin-modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={errors.name ? 'error' : ''}
                        required
                      />
                      {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className={errors.category ? 'error' : ''}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      {errors.category && <span className="error-text">{errors.category}</span>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className={errors.price ? 'error' : ''}
                        required
                      />
                      {errors.price && <span className="error-text">{errors.price}</span>}
                    </div>
                    <div className="form-group">
                      <label>Stock *</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className={errors.stock ? 'error' : ''}
                        required
                      />
                      {errors.stock && <span className="error-text">{errors.stock}</span>}
                    </div>
                    <div className="form-group">
                      <label>Unit *</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        required
                      >
                        <option value="kg">kg</option>
                        <option value="piece">piece</option>
                        <option value="bunch">bunch</option>
                        <option value="head">head</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image URL / Emoji</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="🥬 or https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      />
                      <span>Featured Product</span>
                    </label>
                  </div>
                  <div className="admin-modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <Loader2 className="spin" /> : (editingProduct ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Admin