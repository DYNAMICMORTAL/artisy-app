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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="animate-pulse">
          <div className="h-screen bg-gray-100"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-60"></div>
          <img 
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center"
            alt="Art Gallery"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <span className="text-sm uppercase tracking-[0.2em] font-light">
              Discover • Collect • Celebrate
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight opacity-0 animate-fade-in-up" 
              style={{ animationDelay: '0.6s' }}>
            Art & Heritage
            <br />
            <span className="font-extralight">Collection</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" 
             style={{ animationDelay: '0.9s' }}>
            Explore the finest collection of authentic Indian artworks, 
            from traditional masterpieces to contemporary expressions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up" 
               style={{ animationDelay: '1.2s' }}>
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-medium tracking-wide" 
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
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 px-8 py-4 text-lg font-medium tracking-wide backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-50">
          <div className="animate-bounce">
            <ChevronRight className="w-6 h-6 rotate-90" />
          </div>
        </div>
      </section>

      {/* Collections Overview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Featured Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Curated selections showcasing the diversity and richness of Indian artistic heritage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group cursor-pointer hover-lift">
              <Link to="/browse?category=paintings" className="block bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop"
                    alt="Traditional Paintings"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-full">
                      Traditional Art
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Paintings</h3>
                      <p className="text-gray-600">Madhubani, Warli, Tanjore & More</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="group cursor-pointer hover-lift">
              <Link to="/browse?category=sculptures" className="block bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img 
                    src="https://images.unsplash.com/photo-1594736797933-d0803ba72303?w=400&h=500&fit=crop"
                    alt="Sculptures"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-full">
                      Modern Art
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Sculptures & Modern</h3>
                      <p className="text-gray-600">Contemporary Indian Artists</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="group cursor-pointer hover-lift">
              <Link to="/browse?category=photography" className="block bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img 
                    src="https://images.unsplash.com/photo-1577083288073-40892c0860cf?w=400&h=500&fit=crop"
                    alt="Photography"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-full">
                      Contemporary
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Photography & Digital</h3>
                      <p className="text-gray-600">Mixed Media & Digital Art</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link to="/browse">
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 px-8 py-3"
              >
                View All Collections
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">Featured Artworks</h2>
              <p className="text-gray-600">Handpicked masterpieces from our collection</p>
            </div>
            <Link to="/browse">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                View All
                <ChevronRight className="ml-1 w-4 h-4" />
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
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                    <img 
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">{product.artist_name}</p>
                    <p className="font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8">
            Welcome To
            <br />
            The Art & Heritage Museum
          </h2>
          <p className="text-xl leading-relaxed mb-12 opacity-90">
            Not only the outstanding quality of the collection, 
            but also the high level of expertise in the research, 
            exhibitions and education programs, the Artisy 
            promises polish to the international art 
            museum landscape.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
          >
            More About
            <ArrowRight className="ml-2 w-4 h-4" />
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