import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { wishlistAPI } from '../lib/api'

interface WishlistStore {
  items: number[] // Array of product IDs
  isLoading: boolean
  isInitialized: boolean
  
  // Actions
  addItem: (productId: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  toggleItem: (productId: number) => Promise<void>
  isInWishlist: (productId: number) => boolean
  syncWithServer: () => Promise<void>
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isInitialized: false,

      addItem: async (productId: number) => {
        const state = get()
        if (state.items.includes(productId)) return

        // Optimistic update
        set({ items: [...state.items, productId] })

        try {
          await wishlistAPI.addItem(productId)
        } catch (error) {
          console.error('Error adding to wishlist:', error)
          // Revert optimistic update on error
          set({ items: state.items })
        }
      },

      removeItem: async (productId: number) => {
        const state = get()
        if (!state.items.includes(productId)) return

        // Optimistic update
        set({ items: state.items.filter(id => id !== productId) })

        try {
          await wishlistAPI.removeItem(productId)
        } catch (error) {
          console.error('Error removing from wishlist:', error)
          // Revert optimistic update on error
          set({ items: state.items })
        }
      },

      toggleItem: async (productId: number) => {
        const state = get()
        if (state.items.includes(productId)) {
          await state.removeItem(productId)
        } else {
          await state.addItem(productId)
        }
      },

      isInWishlist: (productId: number) => {
        return get().items.includes(productId)
      },

      syncWithServer: async () => {
        set({ isLoading: true })

        try {
          const response = await wishlistAPI.getWishlist() as { success: boolean; data: number[] }
          
          if (!response.success) {
            set({ items: [], isLoading: false, isInitialized: true })
            return
          }

          // Backend returns array of product IDs directly
          const productIds = response.data || []
          set({ items: productIds, isLoading: false, isInitialized: true })
        } catch (error) {
          console.error('Error syncing wishlist:', error)
          set({ items: [], isLoading: false, isInitialized: true })
        }
      },

      clearWishlist: () => set({ items: [], isInitialized: false }),
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
)
