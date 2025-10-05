import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { ShoppingCart } from '../components/ShoppingCart'
import { Footer } from '../components/Footer'
import { useCartStore } from '../store/cart'
import { getFeaturedProducts } from '../lib/search'
import { type Product } from '../lib/supabase'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'

export function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { isOpen, toggleCart } = useCartStore()

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const products = await getFeaturedProducts(6)
      setFeaturedProducts(products)
    } catch (error) {
      console.error('Error loading featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    window.location.href = '/checkout'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gallery-cream">
        <Header />
        <div className="space-y-8 p-8">
          <div className="h-screen bg-gallery-stone skeleton rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gallery-cream">
      <Header />
      
      {/* Premium Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 parallax">
          <img 
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center"
            alt="Art Gallery"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 gradient-elegant opacity-70"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <span className="text-sm uppercase tracking-[0.3em] font-medium backdrop-blur-glass bg-white/10 px-6 py-2 rounded-full border border-white/20">
              Discover • Collect • Celebrate
            </span>
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl font-semibold mb-8 leading-tight opacity-0 animate-fade-in-up" 
              style={{ animationDelay: '0.6s' }}>
            Art & Heritage
            <br />
            <span className="text-gradient-gold block mt-2">Collection</span>
          </h1>
          
          <p className="font-serif text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up backdrop-blur-sm" 
             style={{ animationDelay: '0.9s' }}>
            Explore the finest collection of authentic Indian artworks, 
            from traditional masterpieces to contemporary expressions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up" 
               style={{ animationDelay: '1.2s' }}>
            <Button 
              size="lg" 
              className="gradient-gold text-white hover:opacity-90 shadow-premium hover:shadow-elegant transition-all duration-300 px-10 py-6 text-lg font-medium tracking-wide rounded-xl" 
              asChild
            >
              <Link to="/browse">
                Browse Collection
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-gallery-charcoal transition-all duration-300 px-10 py-6 text-lg font-medium tracking-wide backdrop-blur-glass bg-white/10 rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/60 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
          <div className="animate-bounce-slow">
            <ChevronRight className="w-8 h-8 rotate-90" />
          </div>
        </div>
      </section>

      {/* Premium Collections Overview */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="text-gallery-bronze text-sm uppercase tracking-[0.3em] font-medium mb-4 block">
              Curated Excellence
            </span>
            <h2 className="font-display text-5xl md:text-6xl text-gallery-charcoal mb-6 font-semibold">
              Featured Collections
            </h2>
            <p className="font-serif text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Curated selections showcasing the diversity and richness of Indian artistic heritage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group cursor-pointer hover-lift animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link to="/browse?category=paintings" className="block card-premium overflow-hidden rounded-2xl border-0">
                <div className="relative overflow-hidden aspect-[4/5] image-zoom-container">
                  <img 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop"
                    alt="Traditional Paintings"
                    className="w-full h-full object-cover image-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-4 py-2 backdrop-blur-glass bg-white/20 border border-white/30 text-white text-sm font-medium rounded-full shadow-premium">
                      Traditional Art
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-gallery-charcoal mb-2 group-hover:text-gallery-bronze transition-colors">
                        Traditional Paintings
                      </h3>
                      <p className="text-gray-600 font-medium">Madhubani, Warli, Tanjore & More</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gallery-bronze opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="group cursor-pointer hover-lift animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/browse?category=sculptures" className="block card-premium overflow-hidden rounded-2xl border-0">
                <div className="relative overflow-hidden aspect-[4/5] image-zoom-container">
                  <img 
                    src="https://images.unsplash.com/photo-1594736797933-d0803ba72303?w=400&h=500&fit=crop"
                    alt="Sculptures"
                    className="w-full h-full object-cover image-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-4 py-2 backdrop-blur-glass bg-white/20 border border-white/30 text-white text-sm font-medium rounded-full shadow-premium">
                      Modern Art
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-gallery-charcoal mb-2 group-hover:text-gallery-bronze transition-colors">
                        Sculptures & Modern
                      </h3>
                      <p className="text-gray-600 font-medium">Contemporary Indian Artists</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gallery-bronze opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="group cursor-pointer hover-lift animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/browse?category=photography" className="block card-premium overflow-hidden rounded-2xl border-0">
                <div className="relative overflow-hidden aspect-[4/5] image-zoom-container">
                  <img 
                    src="https://images.unsplash.com/photo-1577083288073-40892c0860cf?w=400&h=500&fit=crop"
                    alt="Photography"
                    className="w-full h-full object-cover image-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-4 py-2 backdrop-blur-glass bg-white/20 border border-white/30 text-white text-sm font-medium rounded-full shadow-premium">
                      Contemporary
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-gallery-charcoal mb-2 group-hover:text-gallery-bronze transition-colors">
                        Photography & Digital
                      </h3>
                      <p className="text-gray-600 font-medium">Mixed Media & Digital Art</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gallery-bronze opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/browse">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gallery-charcoal text-gallery-charcoal hover:bg-gallery-charcoal hover:text-white transition-all duration-300 px-10 py-6 rounded-xl font-medium tracking-wide shadow-soft hover:shadow-premium"
              >
                View All Collections
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Featured Artworks */}
      <section className="py-24 md:py-32 bg-gallery-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 animate-fade-in-up">
            <div>
              <span className="text-gallery-bronze text-sm uppercase tracking-[0.3em] font-medium mb-3 block">
                Handpicked Selection
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-gallery-charcoal mb-4 font-semibold">
                Featured Artworks
              </h2>
              <p className="text-gray-600 text-lg">Masterpieces from our curated collection</p>
            </div>
            <Link to="/browse">
              <Button 
                variant="ghost" 
                className="text-gallery-charcoal hover:text-gallery-bronze hover:bg-white transition-all duration-200 font-medium mt-4 md:mt-0"
              >
                View All
                <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <div 
                key={product.id} 
                className="group cursor-pointer opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/product/${product.id}`}>
                  <div className="card-premium overflow-hidden rounded-2xl hover-lift transition-all duration-300">
                    <div className="relative overflow-hidden aspect-square image-zoom-container">
                      <img 
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover image-zoom"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="font-display text-xl font-semibold text-gallery-charcoal group-hover:text-gallery-bronze transition-colors mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium mb-3">{product.artist_name}</p>
                      <p className="font-display text-2xl font-bold text-gallery-charcoal">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium About Section */}
      <section className="py-24 md:py-32 bg-gallery-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-gallery-gold via-gallery-bronze to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-gallery-gold text-sm uppercase tracking-[0.3em] font-medium mb-6 block">
            Our Story
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-semibold mb-8 leading-tight">
            Welcome To
            <br />
            <span className="text-gradient-gold">The Art & Heritage Museum</span>
          </h2>
          <p className="font-serif text-xl leading-relaxed mb-12 opacity-90">
            Not only the outstanding quality of the collection, 
            but also the high level of expertise in the research, 
            exhibitions and education programs, the Artisy 
            promises polish to the international art 
            museum landscape.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-gallery-charcoal px-10 py-6 rounded-xl font-medium tracking-wide transition-all duration-300 shadow-premium backdrop-blur-glass bg-white/5"
          >
            More About
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />

      <ShoppingCart
        isOpen={isOpen}
        onClose={toggleCart}
        onCheckout={handleCheckout}
      />
    </div>
  )
}