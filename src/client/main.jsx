import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1B5E20',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'Poppins, sans-serif'
              },
              success: {
                iconTheme: {
                  primary: '#2E7D32',
                  secondary: '#fff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#C62828',
                  secondary: '#fff'
                }
              }
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
)