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
      className="cursor-pointer hover-lift transition-smooth group bg-white border-0 overflow-hidden rounded-xl card-premium"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden relative image-zoom-container">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover image-zoom"
            loading="lazy"
          />
          {/* Elegant gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Overlay badges with premium styling */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && (
              <span className="backdrop-blur-glass bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 animate-fade-in-up shadow-premium">
                <Award className="w-3.5 h-3.5 text-gallery-gold" />
                Featured
              </span>
            )}
            {product.is_handmade && (
              <span className="backdrop-blur-glass bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 animate-fade-in-up shadow-soft">
                <Palette className="w-3.5 h-3.5" />
                Handmade
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-soft animate-fade-in-up">
                {Math.round(((product.original_price! - product.price) / product.original_price!) * 100)}% OFF
              </span>
            )}
          </div>
          
          {/* Quick Action Buttons with premium hover effects */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleWishlistToggle}
                className="backdrop-blur-glass bg-white/95 hover:bg-white p-2.5 rounded-full shadow-elegant hover:shadow-premium backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-white/20"
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart 
                  className={`w-4.5 h-4.5 transition-all duration-300 ${
                    isWishlisted 
                      ? 'text-red-500 fill-red-500 scale-110' 
                      : 'text-gray-600 hover:text-red-500'
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          {/* Artist and Origin with premium styling */}
          <div className="flex items-center justify-between mb-2.5 text-xs text-gray-500">
            {product.artist_name && (
              <span className="font-medium tracking-wide">by {product.artist_name}</span>
            )}
            {product.origin_state && (
              <div className="flex items-center gap-1 bg-gallery-cream px-2 py-1 rounded-full">
                <MapPin className="w-3 h-3" />
                <span className="font-medium">{product.origin_state}</span>
              </div>
            )}
          </div>

          <h3 className="font-display font-semibold text-lg mb-1.5 line-clamp-2 text-gray-900 group-hover:text-gallery-charcoal transition-colors">
            {product.name}
          </h3>

          {/* Art Form with premium badge */}
          {product.art_form && (
            <p className="text-sm text-gallery-bronze font-medium mb-2.5 tracking-wide">
              {product.art_form}
            </p>
          )}

          {/* Rating with gold stars */}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 transition-colors ${
                      star <= Math.floor(product.rating!)
                        ? 'text-gallery-gold fill-gallery-gold'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({product.review_count || 0})
              </span>
            </div>
          )}

          {/* Price with premium styling */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-gallery-charcoal">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  {formatPrice(product.original_price!)}
                </span>
              )}
            </div>
            <span className="text-xs bg-gallery-cream text-gallery-charcoal px-3 py-1.5 rounded-full font-medium tracking-wide">
              {product.subcategory || product.category}
            </span>
          </div>

          {/* Material and Dimensions with premium styling */}
          <div className="text-xs text-gray-500 space-y-1.5 border-t border-gallery-stone pt-3">
            {product.material && (
              <p className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Material:</span>
                <span>{product.material}</span>
              </p>
            )}
            {product.dimensions && (
              <p className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Size:</span>
                <span>{product.dimensions}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gallery-charcoal hover:bg-gallery-charcoal/90 text-white font-medium tracking-wide transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-soft hover:shadow-elegant rounded-lg py-6 text-base"
          size="sm"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}