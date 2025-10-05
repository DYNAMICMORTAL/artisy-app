import { ShoppingCart, Search, Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useCartStore } from '../store/cart'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface HeaderProps {
  onSearch?: (query: string) => void
  onCategorySelect?: (category: string) => void
}

export function Header({ onSearch }: HeaderProps) {
  const { getTotalItems, toggleCart } = useCartStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
    // If not on browse page, navigate there with search
    if (location.pathname !== '/browse') {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const isActive = (path: string) => location.pathname === path
  const isActiveCategory = (category: string) => {
    if (location.pathname !== '/browse') return false;
    const params = new URLSearchParams(location.search);
    return params.get('category')?.toLowerCase() === category.toLowerCase();
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-glass border-gray-200 shadow-premium bg-white/90' 
        : 'border-gallery-stone glass shadow-soft bg-white'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        {/* Logo with premium styling */}
        <div className="mr-8">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group">
            <span className="font-display text-2xl text-gallery-charcoal tracking-tight group-hover:text-gallery-bronze transition-colors">
              Artisy
            </span>
          </Link>
        </div>
        
        {/* Navigation Links with premium styling */}
        <nav className="hidden lg:flex space-x-1 mr-8">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActive('/') 
                ? 'text-gallery-charcoal bg-gallery-cream' 
                : 'text-gray-600 hover:text-gallery-charcoal hover:bg-gallery-cream/50'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/browse" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActive('/browse') && !location.search.includes('category=')
                ? 'text-gallery-charcoal bg-gallery-cream' 
                : 'text-gray-600 hover:text-gallery-charcoal hover:bg-gallery-cream/50'
            }`}
          >
            Browse
          </Link>
          <Link 
            to="/browse?category=paintings"
            onClick={(e) => {
              e.preventDefault()
              navigate('/browse?category=paintings')
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActiveCategory('paintings')
                ? 'text-gallery-charcoal bg-gallery-cream' 
                : 'text-gray-600 hover:text-gallery-charcoal hover:bg-gallery-cream/50'
            }`}
          >
            Paintings
          </Link>
          <Link 
            to="/browse?category=sculptures"
            onClick={(e) => {
              e.preventDefault()
              navigate('/browse?category=sculptures')
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActiveCategory('sculptures')
                ? 'text-gallery-charcoal bg-gallery-cream' 
                : 'text-gray-600 hover:text-gallery-charcoal hover:bg-gallery-cream/50'
            }`}
          >
            Sculptures
          </Link>
          <Link 
            to="/browse?category=photography"
            onClick={(e) => {
              e.preventDefault()
              navigate('/browse?category=photography')
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActiveCategory('photography')
                ? 'text-gallery-charcoal bg-gallery-cream' 
                : 'text-gray-600 hover:text-gallery-charcoal hover:bg-gallery-cream/50'
            }`}
          >
            Photography
          </Link>
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search Bar with premium styling */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors" />
            <Input
              type="search"
              placeholder="Search artworks..."
              className="pl-10 pr-4 py-2 w-64 lg:w-80 border-gallery-stone focus:border-gallery-bronze rounded-lg bg-gallery-cream/30 focus:bg-white transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Navigation Items with premium styling */}
          <div className="flex items-center space-x-2">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative hover:bg-gallery-cream transition-all duration-200 hover:scale-105"
            >
              <ShoppingCart className="h-5 w-5 text-gallery-charcoal" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-gold text-white text-xs flex items-center justify-center font-bold shadow-soft">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gallery-stone skeleton" />
            ) : user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gallery-charcoal hover:bg-gallery-cream transition-colors" asChild>
                  <Link to="/wishlist">Wishlist</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gallery-charcoal hover:bg-gallery-cream transition-colors" asChild>
                  <Link to="/orders">Orders</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-700 hover:text-gallery-charcoal hover:bg-gallery-cream transition-colors">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gradient-gold text-white hover:opacity-90 transition-all duration-200 shadow-soft hover:shadow-elegant px-4" 
                asChild
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gallery-cream transition-colors">
              <Menu className="h-5 w-5 text-gallery-charcoal" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}