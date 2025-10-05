import { ShoppingCart, Search, Menu, User, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useCartStore } from '../store/cart'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  onSearch?: (query: string) => void
  onCategorySelect?: (category: string) => void
}

export function Header({ onSearch, onCategorySelect }: HeaderProps) {
  const { getTotalItems, toggleCart } = useCartStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 glass shadow-soft">
      <div className="container mx-auto px-4 flex h-16 items-center">
        {/* Logo */}
        <div className="mr-8">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="font-light text-2xl text-gray-900 tracking-tight">Artisy</span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden lg:flex space-x-1 mr-8">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActive('/') 
                ? 'text-gray-900 bg-gray-100' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/browse" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActive('/browse') && !location.search.includes('category=')
                ? 'text-gray-900 bg-gray-100' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Browse
          </Link>
          <Link 
            to={{ pathname: '/browse', search: '?category=paintings' }}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActiveCategory('paintings')
                ? 'text-gray-900 bg-gray-100' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Paintings
          </Link>
          <Link 
            to={{ pathname: '/browse', search: '?category=sculptures' }}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActiveCategory('sculptures')
                ? 'text-gray-900 bg-gray-100' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Sculptures
          </Link>
          <Link 
            to={{ pathname: '/browse', search: '?category=photography' }}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActiveCategory('photography')
                ? 'text-gray-900 bg-gray-100' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Photography
          </Link>
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search artworks..."
              className="pl-10 pr-4 py-2 w-64 lg:w-80 border-gray-200 focus:border-gray-400 rounded-lg bg-gray-50/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100" asChild>
                  <Link to="/wishlist">Wishlist</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100" asChild>
                  <Link to="/orders">Orders</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100">
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}