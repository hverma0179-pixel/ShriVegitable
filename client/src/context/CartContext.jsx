import { createContext, useContext, useMemo } from 'react'
import { useCartStore } from '../stores'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const cart = useCartStore()
  const value = useMemo(() => cart, [cart])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}