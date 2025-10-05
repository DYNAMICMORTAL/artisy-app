import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Header } from '../components/Header'
import { ShoppingCart as ShoppingCartComponent } from '../components/ShoppingCart'
import { useCartStore } from '../store/cart'
import { supabase, type Product } from '../lib/supabase'
import { productAPI } from '../lib/api'

interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  review_text?: string
  created_at: string
  users?: {
    id: string
    email: string
  }
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newReview, setNewReview] = useState({ rating: 5, review_text: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  
  const { addItem, isOpen, toggleCart } = useCartStore()

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id))
      fetchReviews(parseInt(id))
    }
  }, [id])

  const fetchProduct = async (productId: number) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error

      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async (productId: number) => {
    try {
      setReviewsLoading(true)
      const response = await productAPI.getReviews(productId) as { success: boolean; data: Review[] }
      if (response.success) {
        setReviews(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      setSubmittingReview(true)
      setReviewError(null)
      setReviewSuccess(false)

      await productAPI.addReview(parseInt(id), newReview.rating, newReview.review_text)
      
      setReviewSuccess(true)
      setNewReview({ rating: 5, review_text: '' })
      
      // Refresh reviews and product data
      await fetchReviews(parseInt(id))
      await fetchProduct(parseInt(id))
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url
      })
    }
  }

  const handleCheckout = () => {
    window.location.href = '/checkout'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-muted aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-muted h-8 rounded w-3/4"></div>
                <div className="bg-muted h-6 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 rounded"></div>
                  <div className="bg-muted h-4 rounded"></div>
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              {error || 'Product not found'}
            </h2>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </CardContent>
            </Card>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm bg-muted px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating Display */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}
              
              <p className="text-4xl font-bold text-primary mb-6">
                ₹{product.price}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full flex items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg">
                  Add to Favorites
                </Button>
                <Button variant="outline" size="lg">
                  Share
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground pt-6 border-t">
              <p>• Secure payment processing</p>
              <p>• Free shipping on orders over ₹500</p>
              <p>• 30-day return policy</p>
              <p>• Certificate of authenticity included</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
          
          {/* Add Review Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 cursor-pointer transition-colors ${
                            star <= newReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review (Optional)</label>
                  <textarea
                    value={newReview.review_text}
                    onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                    className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                {reviewError && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                    {reviewError}
                  </div>
                )}

                {reviewSuccess && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                    Review submitted successfully!
                  </div>
                )}

                <Button type="submit" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="text-center py-8">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {review.users?.email?.split('@')[0] || 'Anonymous'}
                          </span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    {review.review_text && (
                      <p className="text-muted-foreground mt-2">{review.review_text}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <ShoppingCartComponent
        isOpen={isOpen}
        onClose={toggleCart}
        onCheckout={handleCheckout}
      />
    </div>
  )
}