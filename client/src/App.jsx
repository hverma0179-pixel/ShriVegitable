import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ProductModal from './components/ProductModal'
import { useCartStore } from './stores'

const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Account = lazy(() => import('./pages/Account'))
const NotFound = lazy(() => import('./pages/NotFound'))

const Loading = () => (
  <div className="page-loading" role="status" aria-label="Loading page">
    <div className="spinner" />
    <span>Loading...</span>
  </div>
)

const Layout = () => {
  const { isOpen: cartOpen, closeCart } = useCartStore()
  const [modalProduct, setModalProduct] = React.useState(null)

  React.useEffect(() => {
    const handleQuickView = (e) => {
      setModalProduct(e.detail)
    }
    window.addEventListener('quick-view', handleQuickView)
    return () => window.removeEventListener('quick-view', handleQuickView)
  }, [])

  return (
    <>
      <Header />
      <main id="main-content" className="main-content">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ProductModal 
        product={modalProduct} 
        isOpen={!!modalProduct} 
        onClose={() => setModalProduct(null)} 
      />
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App