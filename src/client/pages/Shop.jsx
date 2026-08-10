import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, X, ChevronDown, Grid, List, Loader2, Truck, Leaf, Star, Tag, Search, SlidersHorizontal, ShoppingCart, Heart } from 'lucide-react'
import { vegetables, categories, getProductsByCategory, getOrganicProducts, getInStockProducts, searchProducts } from '../utils/products'
import { formatPrice } from '../utils/helpers'
import ProductCard from '../components/ProductCard'
import { useCartStore } from '../stores'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 200])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(searchParams.get('organic') === 'true')
  const [showOnlyInStock, setShowOnlyInStock] = useState(true)
  const { addItem } = useCartStore()

  const initialCategory = searchParams.get('category')
  const initialSearch = searchParams.get('search')
  const initialOrganic = searchParams.get('organic')

  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory)
    }
    if (initialSearch && initialSearch !== searchQuery) {
      setSearchQuery(initialSearch)
    }
    if (initialOrganic !== null && (initialOrganic === 'true') !== showOnlyOrganic) {
      setShowOnlyOrganic(initialOrganic === 'true')
    }
  }, [])

  const filteredProducts = useMemo(() => {
    let products = [...vegetables]

    if (selectedCategory && selectedCategory !== 'all') {
      products = getProductsByCategory(selectedCategory)
    }

    if (searchQuery) {
      products = searchProducts(searchQuery)
    }

    if (showOnlyOrganic) {
      products = getOrganicProducts().filter(p => products.some(pp => pp.id === p.id))
    }

    if (showOnlyInStock) {
      products = getInStockProducts().filter(p => products.some(pp => pp.id === p.id))
    }

    if (priceRange[0] > 0 || priceRange[1] < 200) {
      products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    }

    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        products.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        products.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        products.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate))
        break
      case 'popular':
        products.sort((a, b) => (b.tags.includes('popular') ? 1 : 0) - (a.tags.includes('popular') ? 1 : 0))
        break
      default:
        break
    }

    return products
  }, [selectedCategory, searchQuery, showOnlyOrganic, showOnlyInStock, priceRange, sortBy])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    const params = new URLSearchParams(searchParams)
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    setSearchParams(params)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery.trim()) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setShowOnlyOrganic(false)
    setShowOnlyInStock(true)
    setPriceRange([0, 200])
    setSortBy('featured')
    const params = new URLSearchParams()
    setSearchParams(params)
  }

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || showOnlyOrganic || !showOnlyInStock || priceRange[0] > 0 || priceRange[1] < 200

  return (
    <div className="shop-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <motion.h1 className="page-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Fresh Vegetables
          </motion.h1>
          <motion.p className="page-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Discover our wide selection of farm-fresh, organic vegetables delivered straight to your door
          </motion.p>
        </div>
      </motion.div>

      <div className="shop-container">
        <div className="container shop-grid">
          <aside className="shop-sidebar">
            <motion.div 
              className="sidebar-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="sidebar-header">
                <h3 className="sidebar-title">Categories</h3>
                {selectedCategory !== 'all' && (
                  <button className="clear-category" onClick={() => handleCategoryChange('all')}>
                    <X size={14} /> Clear
                  </button>
                )}
              </div>
              <ul className="category-list" role="list" aria-label="Product categories">
                {categories.map((category, index) => (
                  <motion.li
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <button
                      className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category.id)}
                      aria-pressed={selectedCategory === category.id}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">
                        {vegetables.filter(v => category.id === 'all' || v.category === category.id).length}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              className="sidebar-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="sidebar-title">
                <SlidersHorizontal size={18} /> Filters
              </h3>
              
              <div className="filter-group">
                <label className="filter-label">Price Range</label>
                <div className="price-range">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1] - 1), priceRange[1]])}
                    className="range-slider"
                    aria-label="Minimum price"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0] + 1)])}
                    className="range-slider"
                    aria-label="Maximum price"
                  />
                  <div className="price-inputs">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value) || 0, priceRange[1] - 1), priceRange[1]])}
                      min="0"
                      max="200"
                      placeholder="Min"
                      className="price-input"
                      aria-label="Minimum price"
                    />
                    <span>–</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value) || 200, priceRange[0] + 1)])}
                      min="0"
                      max="200"
                      placeholder="Max"
                      className="price-input"
                      aria-label="Maximum price"
                    />
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={showOnlyOrganic}
                    onChange={(e) => setShowOnlyOrganic(e.target.checked)}
                  />
                  <span className="checkbox-custom">
                    <Leaf size={16} />
                  </span>
                  <span>Organic Only</span>
                </label>
              </div>

              <div className="filter-group">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                  />
                  <span className="checkbox-custom">
                    <Truck size={16} />
                  </span>
                  <span>In Stock Only</span>
                </label>
              </div>

              {hasActiveFilters && (
                <motion.button 
                  className="clear-filters-btn"
                  onClick={clearFilters}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X size={16} /> Clear All Filters
                </motion.button>
              )}
            </motion.div>
          </aside>

          <main className="shop-main">
            <motion.div 
              className="shop-toolbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="toolbar-left">
                <form onSubmit={handleSearch} className="search-form" role="search">
                  <label htmlFor="shop-search" className="sr-only">Search products</label>
                  <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                      id="shop-search"
                      type="search"
                      placeholder="Search vegetables..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                      autoComplete="off"
                    />
                  </div>
                </form>
              </div>

              <div className="toolbar-right">
                <div className="toolbar-item">
                  <label htmlFor="sort-select" className="sr-only">Sort products</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                    aria-label="Sort products"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown className="select-arrow" size={16} />
                </div>

                <div className="toolbar-item view-toggle" role="group" aria-label="View mode">
                  <button
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    className={viewMode === 'list' ? 'active' : ''}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                    whileTap={{ scale: 0.95 }}
                  >
                    <List size={20} />
                  </button>
                </div>

                <button
                  className="mobile-filters-btn"
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  aria-controls="mobile-filters"
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter size={20} />
                  <span>Filters</span>
                  {hasActiveFilters && <span className="filter-badge">{(
                    (selectedCategory !== 'all' ? 1 : 0) +
                    (showOnlyOrganic ? 1 : 0) +
                    (!showOnlyInStock ? 1 : 0) +
                    (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0)
                  )}</span>}
                </button>
              </div>
            </motion.div>

            <motion.div 
              className={`products-grid ${viewMode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              role="list"
              aria-label="Products"
            >
              {filteredProducts.length > 0 ? (
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="product-grid-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <ProductCard 
                        product={product} 
                        variant={viewMode === 'list' ? 'compact' : 'default'}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <motion.div 
                  className="no-products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="no-products-icon">
                    <Search size={48} />
                  </div>
                  <h3>No Products Found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button className="btn btn-primary" onClick={clearFilters}>
                    <X size={18} /> Clear Filters
                  </button>
                </motion.div>
              )}
            </motion.div>

            {filteredProducts.length > 0 && (
              <motion.div 
                className="pagination"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <button className="page-btn" disabled aria-label="Previous page">
                  <ChevronLeft size={18} />
                </button>
                <button className="page-btn active" aria-label="Page 1">1</button>
                <button className="page-btn" aria-label="Page 2">2</button>
                <button className="page-btn" aria-label="Page 3">3</button>
                <span className="page-ellipsis" aria-hidden="true">…</span>
                <button className="page-btn" aria-label="Page 10">10</button>
                <button className="page-btn" aria-label="Next page">
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            id="mobile-filters"
            className="mobile-filters-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filters-title"
          >
            <motion.div 
              className="mobile-filters-panel"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-filters-header">
                <h2 id="mobile-filters-title">Filters</h2>
                <button 
                  className="close-filters-btn"
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mobile-filters-content">
                <div className="filter-group">
                  <h3>Categories</h3>
                  <ul className="category-list mobile">
                    {categories.map((category, index) => (
                      <motion.li
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <button
                          className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                          onClick={() => { handleCategoryChange(category.id); setShowFilters(false) }}
                          aria-pressed={selectedCategory === category.id}
                        >
                          <span className="category-icon">{category.icon}</span>
                          <span className="category-name">{category.name}</span>
                          <span className="category-count">
                            {vegetables.filter(v => category.id === 'all' || v.category === category.id).length}
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="filter-group">
                  <h3>Price Range</h3>
                  <div className="price-range">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1] - 1), priceRange[1]])}
                      className="range-slider"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0] + 1)])}
                      className="range-slider"
                    />
                    <div className="price-inputs">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value) || 0, priceRange[1] - 1), priceRange[1]])}
                        min="0"
                        max="200"
                        placeholder="Min"
                        className="price-input"
                      />
                      <span>–</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value) || 200, priceRange[0] + 1)])}
                        min="0"
                        max="200"
                        placeholder="Max"
                        className="price-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="filter-group">
                  <h3>Options</h3>
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={showOnlyOrganic}
                      onChange={(e) => setShowOnlyOrganic(e.target.checked)}
                    />
                    <span className="checkbox-custom"><Leaf size={16} /></span>
                    <span>Organic Only</span>
                  </label>
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={showOnlyInStock}
                      onChange={(e) => setShowOnlyInStock(e.target.checked)}
                    />
                    <span className="checkbox-custom"><Truck size={16} /></span>
                    <span>In Stock Only</span>
                  </label>
                </div>

                {hasActiveFilters && (
                  <motion.button 
                    className="clear-filters-btn full-width"
                    onClick={() => { clearFilters(); setShowFilters(false) }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X size={16} /> Clear All Filters
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Shop