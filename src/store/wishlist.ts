import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

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
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            const { error } = await supabase
              .from('wishlist')
              .insert({ user_id: user.id, product_id: productId })
            
            if (error) throw error
          }
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
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            const { error } = await supabase
              .from('wishlist')
              .delete()
              .match({ user_id: user.id, product_id: productId })
            
            if (error) throw error
          }
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
          const { data: { user } } = await supabase.auth.getUser()
          
          if (!user) {
            set({ items: [], isLoading: false, isInitialized: true })
            return
          }

          const { data, error } = await supabase
            .from('wishlist')
            .select('product_id')
            .eq('user_id', user.id)

          if (error) throw error

          const productIds = data?.map(item => item.product_id) || []
          set({ items: productIds, isLoading: false, isInitialized: true })
        } catch (error) {
          console.error('Error syncing wishlist:', error)
          set({ isLoading: false, isInitialized: true })
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
