import { useEffect, useState } from 'react'
import { useWishlistStore } from '../store/wishlist'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Heart, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Wishlist() {
  const { items: wishlistProductIds, syncWithServer, isLoading: isWishlistLoading } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Sync wishlist from server
    syncWithServer()
  }, [syncWithServer])

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlistProductIds.length === 0) {
        setProducts([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlistProductIds)

        if (error) throw error

        // Sort products to match wishlist order
        const sortedProducts = wishlistProductIds
          .map(id => data?.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined)

        setProducts(sortedProducts)
      } catch (error) {
        console.error('Error fetching wishlist products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlistProducts()
  }, [wishlistProductIds])

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-red-500 mr-3" />
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">Your Wishlist</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Save your favorite artworks and come back to them anytime
          </p>
        </div>

        {/* Loading State */}
        {(isLoading || isWishlistLoading) && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isWishlistLoading && products.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-light text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding artworks to your wishlist by clicking the heart icon on products you love
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Artworks
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isWishlistLoading && products.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
