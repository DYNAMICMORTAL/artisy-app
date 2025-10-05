import { ShoppingCart, Search, Menu, User, LogOut, MapPin, Heart, Bell, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useCartStore } from '../store/cart'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onSearch?: (query: string) => void
  onCategorySelect?: (category: string) => void
}

export function Header({ onSearch, onCategorySelect }: HeaderProps) {
  const { getTotalItems, toggleCart } = useCartStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const indianCategories = [
    'Traditional Art',
    'Sculptures', 
    'Textiles',
    'Contemporary Art',
    'Metal Craft',
    'Photography'
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 border-b shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 text-xs text-white/80 border-b border-white/20">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Free shipping across India
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Authentic handmade art
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block">Support: +91-9876543210</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/80 hover:text-white h-auto p-1 text-xs"
            >
              Track Order
            </Button>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  आर्टिसी
                </span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-white">Artisy</h1>
                <p className="text-xs text-white/80 -mt-1">भारतीय कला संग्रह</p>
              </div>
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for Madhubani, Tanjore, artists, states..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-3 w-full bg-white/95 border-0 focus:bg-white focus:ring-2 focus:ring-white/50 text-gray-800 placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center space-x-2">
            {/* Wishlist (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white hover:bg-white/20 relative"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 text-orange-800 text-xs flex items-center justify-center font-semibold">
                0
              </span>
            </Button>

            {/* Notifications (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white hover:bg-white/20 relative"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="text-white hover:bg-white/20 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 text-orange-800 text-xs flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
            ) : user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  asChild
                >
                  <a href="/orders">Orders</a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSignOut}
                  className="text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex bg-white text-orange-600 hover:bg-white/90 border-white font-semibold"
                asChild
              >
                <a href="/auth">Sign In</a>
              </Button>
            )}

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white hover:bg-white/20"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </nav>
        </div>

        {/* Categories Navigation */}
        <div className="hidden lg:flex items-center justify-center space-x-1 py-3 border-t border-white/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategorySelect?.('All')}
            className="text-white/90 hover:text-white hover:bg-white/20 text-sm font-medium"
          >
            All Categories
          </Button>
          {indianCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              onClick={() => onCategorySelect?.(category)}
              className="text-white/90 hover:text-white hover:bg-white/20 text-sm font-medium"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3 border-t border-white/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search artwork, artists..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-3 w-full bg-white/95 border-0 focus:bg-white focus:ring-2 focus:ring-white/50 text-gray-800 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {indianCategories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onCategorySelect?.(category)
                      setShowMobileMenu(false)
                    }}
                    className="justify-start text-gray-600 hover:text-orange-600"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="border-t pt-4">
              {user ? (
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600"
                    asChild
                  >
                    <a href="/orders">My Orders</a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600"
                    onClick={() => {
                      handleSignOut()
                      setShowMobileMenu(false)
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  asChild
                >
                  <a href="/auth">Sign In / Register</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}