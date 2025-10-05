import { useEffect, useState, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { Header } from '../components/Header'
import { ShoppingCart } from '../components/ShoppingCart'
import { Footer } from '../components/Footer'
import { useCartStore } from '../store/cart'
import { type Product } from '../lib/supabase'
import { searchProducts, getFilterOptions, getFeaturedProducts, type SearchOptions, type SearchFilters } from '../lib/search'
import { productAPI } from '../lib/api'
import { Search, Filter, Palette, X, ChevronDown, Grid3x3, List, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

interface FilterOptions {
  categories: string[]
  subcategories: string[]
  artForms: string[]
  states: string[]
}

export function Browse() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [useSemanticSearch, setUseSemanticSearch] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [sortBy, setSortBy] = useState<SearchOptions['sortBy']>('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    subcategories: [],
    artForms: [],
    states: []
  })
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const { isOpen, toggleCart } = useCartStore()
  const location = useLocation()

  // Define functions before they are used in useEffect
  const performSearch = useCallback(async () => {
    try {
      setLoading(true)
      
      // Use semantic search if enabled and there's a query
      if (useSemanticSearch && searchQuery.trim()) {
        const response = await productAPI.semanticSearch(searchQuery, 20) as { success: boolean; data: Product[] }
        if (response.success) {
          setProducts(response.data)
          setTotal(response.data.length)
        }
      } else {
        // Use regular search
        const searchOptions: SearchOptions = {
          query: searchQuery,
          filters,
          sortBy,
          limit: 20,
          offset: 0
        }
        
        const result = await searchProducts(searchOptions)
        setProducts(result.products)
        setTotal(result.total)
      }
      setError(null)
    } catch (error) {
      console.error('Search error:', error)
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filters, sortBy, useSemanticSearch])

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [filterOptionsData, featuredData] = await Promise.all([
        getFilterOptions(),
        getFeaturedProducts(4)
      ])
      
      setFilterOptions(filterOptionsData)
      setFeaturedProducts(featuredData)
      
      // Initial search
      await performSearch()
    } catch (error) {
      console.error('Error loading initial data:', error)
      setError('Failed to load data. Please try again.')
    }
  }, [performSearch])

  // Get URL parameters for initial filtering and listen to location changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const category = urlParams.get('category')
    const search = urlParams.get('search')
    
    // Update filters when URL parameters change
    setFilters(prev => {
      const newFilters = { ...prev }
      if (category) {
        newFilters.category = category
      } else {
        delete newFilters.category
      }
      return newFilters
    })
    
    if (search) {
      setSearchQuery(search)
    }
  }, [location.search]) // Re-run when location.search changes

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryFilter = (category: string) => {
    if (category === 'All') {
      setFilters(prev => ({ ...prev, category: undefined }))
    } else {
      setFilters(prev => ({ ...prev, category: category.toLowerCase() }))
    }
  }

  const handleFilterChange = (filterType: keyof SearchFilters, value: string | number | boolean | { min: number; max: number } | undefined) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value || undefined
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const handleProductClick = (product: Product) => {
    window.location.href = `/product/${product.id}`
  }

  const handleCheckout = () => {
    window.location.href = '/checkout'
  }

  const priceRanges = [
    { label: 'Under ₹2,000', min: 0, max: 2000 },
    { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
    { label: 'Above ₹25,000', min: 25000, max: 100000 }
  ]

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length + (searchQuery ? 1 : 0)
  }, [filters, searchQuery])

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} onCategorySelect={handleCategoryFilter} />
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm p-4">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} onCategorySelect={handleCategoryFilter} />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => loadInitialData()}
              className="bg-gray-800 hover:bg-gray-900 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} onCategorySelect={handleCategoryFilter} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Browse Artworks</h1>
          <p className="text-gray-600 text-lg">Discover authentic Indian art from talented artists across the country</p>
        </div>

        {/* Featured Products - Only show if no active search/filters */}
        {featuredProducts.length > 0 && !searchQuery && Object.keys(filters).length === 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-gray-900">Featured Artworks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: Product) => (
                <div key={product.id} className="relative">
                  <ProductCard
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for art forms, artists, or regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-full border-gray-200 focus:border-gray-400 rounded-lg"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3 items-center flex-wrap">
              {/* Semantic Search Toggle */}
              <Button
                variant={useSemanticSearch ? "default" : "outline"}
                onClick={() => setUseSemanticSearch(!useSemanticSearch)}
                className="flex items-center gap-2 px-4 py-2"
                title="AI-powered semantic search for natural language queries"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">AI Search</span>
              </Button>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 relative"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SearchOptions['sortBy'])}
                  className="appearance-none px-4 py-2 pr-8 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/20 bg-white text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <option value="featured">Featured First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Filter Options</h3>
                <p className="text-sm text-gray-600">Narrow down your search to find the perfect artwork</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Category</label>
                  <div className="relative">
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/20 bg-white text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <option value="">All Categories</option>
                      {filterOptions.categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Art Form Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Art Form</label>
                  <div className="relative">
                    <select
                      value={filters.artForm || ''}
                      onChange={(e) => handleFilterChange('artForm', e.target.value)}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/20 bg-white text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <option value="">All Art Forms</option>
                      {filterOptions.artForms.map(artForm => (
                        <option key={artForm} value={artForm}>{artForm}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* State Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">State/Region</label>
                  <div className="relative">
                    <select
                      value={filters.originState || ''}
                      onChange={(e) => handleFilterChange('originState', e.target.value)}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/20 bg-white text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <option value="">All Regions</option>
                      {filterOptions.states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Price Range</label>
                  <div className="relative">
                    <select
                      value={filters.priceRange ? `${filters.priceRange.min}-${filters.priceRange.max}` : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const [min, max] = e.target.value.split('-').map(Number)
                          handleFilterChange('priceRange', { min, max })
                        } else {
                          handleFilterChange('priceRange', undefined)
                        }
                      }}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/20 bg-white text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <option value="">All Prices</option>
                      {priceRanges.map(range => (
                        <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3 hover:text-gray-600" />
                    </button>
                  </span>
                )}
                {Object.entries(filters).map(([key, value]) => 
                  value && (
                    <span key={key} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {key}: {typeof value === 'object' ? `₹${value.min}-₹${value.max}` : value}
                      <button onClick={() => handleFilterChange(key as keyof SearchFilters, undefined)}>
                        <X className="w-3 h-3 hover:text-gray-600" />
                      </button>
                    </span>
                  )
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 px-3 py-1 h-auto"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{products.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{total}</span> artworks
          </p>
          
          {loading && (
            <div className="text-sm text-gray-500">Searching...</div>
          )}
        </div>

        {/* Products Grid/List */}
        {products.length === 0 && !loading ? (
          <div className="text-center py-16">
            <Palette className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">No artworks found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to discover more beautiful pieces
            </p>
            <Button 
              onClick={clearFilters}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3"
            >
              Clear Filters & Browse All
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
          }>
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {products.length > 0 && products.length < total && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => {/* Implement pagination */}}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3"
              disabled={loading}
            >
              {loading ? 'Loading...' : `Load More (${total - products.length} remaining)`}
            </Button>
          </div>
        )}
      </main>

      <Footer />

      <ShoppingCart
        isOpen={isOpen}
        onClose={toggleCart}
        onCheckout={handleCheckout}
      />
    </div>
  )
}