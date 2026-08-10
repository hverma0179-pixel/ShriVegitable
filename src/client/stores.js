import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(item => item.id === product.id)
        if (existing) {
          set({ items: items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },
      removeItem: (productId) => set({ items: get().items.filter(item => item.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeItem(productId); return }
        set({ items: get().items.map(item => item.id === productId ? { ...item, quantity } : item) })
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'shrivegetable-cart' }
  )
)

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => { const items = get().items; if (!items.find(i => i.id === product.id)) set({ items: [...items, product] }) },
      removeItem: (productId) => set({ items: get().items.filter(item => item.id !== productId) }),
      toggleItem: (product) => { const items = get().items; const exists = items.find(i => i.id === product.id); exists ? get().removeItem(product.id) : get().addItem(product) },
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) => get().items.some(item => item.id === productId),
      getCount: () => get().items.length,
    }),
    { name: 'shrivegetable-wishlist' }
  )
)