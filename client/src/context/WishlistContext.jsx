import { createContext, useContext, useMemo } from 'react'
import { useWishlistStore } from '../stores'

const WishlistContext = createContext(null)

export const WishlistProvider = ({ children }) => {
  const wishlist = useWishlistStore()
  const value = useMemo(() => wishlist, [wishlist])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}