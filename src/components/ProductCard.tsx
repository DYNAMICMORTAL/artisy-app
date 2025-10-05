import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { useCartStore } from '../store/cart'
import { useWishlistStore } from '../store/wishlist'
import type { Product } from '../lib/supabase'
import { MapPin, Star, Award, Palette, Heart } from 'lucide-react'
import { useEffect } from 'react'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist, syncWithServer, isInitialized } = useWishlistStore()
  const isWishlisted = isInWishlist(product.id)

  // Sync wishlist on mount if not initialized
  useEffect(() => {
    if (!isInitialized) {
      syncWithServer()
    }
  }, [isInitialized, syncWithServer])

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await toggleItem(product.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    })
    
    // Show success feedback (could be enhanced with toast notification later)
    const button = e.target as HTMLElement
    const originalText = button.textContent
    button.textContent = 'Added!'
    setTimeout(() => {
      button.textContent = originalText
    }, 1000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  const hasDiscount = product.original_price && product.original_price > product.price

  return (
    <Card 
      className="cursor-pointer hover-lift transition-smooth group bg-white border-gray-100 overflow-hidden rounded-xl shadow-soft hover:shadow-elegant"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <span className="bg-gray-900/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 animate-scale-in">
                <Award className="w-3 h-3" />
                Featured
              </span>
            )}
            {product.is_handmade && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Handmade
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold">
                {Math.round(((product.original_price! - product.price) / product.original_price!) * 100)}% OFF
              </span>
            )}
          </div>
          
          {/* Quick Action Buttons */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleWishlistToggle}
                className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart 
                  className={`w-4 h-4 transition-all duration-200 ${
                    isWishlisted 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-600 hover:text-red-500'
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {/* Artist and Origin */}
          <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
            {product.artist_name && (
              <span className="font-medium">by {product.artist_name}</span>
            )}
            {product.origin_state && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{product.origin_state}</span>
              </div>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-gray-800">
            {product.name}
          </h3>

          {/* Art Form */}
          {product.art_form && (
            <p className="text-sm text-gray-600 font-medium mb-2">
              {product.art_form}
            </p>
          )}

          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.review_count || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-gray-800">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.original_price!)}
                </span>
              )}
            </div>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
              {product.subcategory || product.category}
            </span>
          </div>

          {/* Material and Dimensions */}
          <div className="text-xs text-gray-500 space-y-1">
            {product.material && (
              <p>Material: {product.material}</p>
            )}
            {product.dimensions && (
              <p>Size: {product.dimensions}</p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium transition-smooth opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          size="sm"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}