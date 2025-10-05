import { productAPI } from './api'
import type { Product } from './supabase'

export interface SearchFilters {
  category?: string
  subcategory?: string
  artForm?: string
  originState?: string
  priceRange?: {
    min: number
    max: number
  }
  isHandmade?: boolean
  isFeatured?: boolean
  rating?: number
}

export interface SearchOptions {
  query?: string
  filters?: SearchFilters
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'featured'
  limit?: number
  offset?: number
}

// Enhanced search function with semantic search and filtering
export async function searchProducts(options: SearchOptions): Promise<{
  products: Product[]
  total: number
  error?: string
}> {
  try {
    // Build query params for API
    const params: Record<string, string | number> = {}
    
    if (options.query) params.query = options.query
    if (options.filters?.category) params.category = options.filters.category
    if (options.filters?.subcategory) params.subcategory = options.filters.subcategory
    if (options.filters?.artForm) params.art_form = options.filters.artForm
    if (options.filters?.originState) params.state = options.filters.originState
    if (options.filters?.priceRange?.min) params.minPrice = options.filters.priceRange.min
    if (options.filters?.priceRange?.max) params.maxPrice = options.filters.priceRange.max
    if (options.filters?.isHandmade !== undefined) params.is_handmade = options.filters.isHandmade ? 'true' : 'false'
    if (options.filters?.isFeatured !== undefined) params.is_featured = options.filters.isFeatured ? 'true' : 'false'
    if (options.filters?.rating) params.rating = options.filters.rating
    if (options.sortBy) params.sortBy = options.sortBy
    if (options.limit) params.limit = options.limit
    if (options.offset) params.offset = options.offset

    const response = await productAPI.getProducts(params) as { success: boolean; data: Product[]; pagination: { total: number } }

    return {
      products: response.data || [],
      total: response.pagination?.total || 0
    }
  } catch (error) {
    console.error('Search error:', error)
    return { 
      products: [], 
      total: 0, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get search suggestions based on partial input
export async function getSearchSuggestions(query: string, limit = 5): Promise<string[]> {
  if (!query || query.length < 2) return []

  try {
    // Use semantic search to get suggestions
    const response = await productAPI.semanticSearch(query, limit) as { success: boolean; data: Product[] }
    
    if (!response.success || !response.data) return []
    
    const suggestions: string[] = []
    
    response.data.forEach(product => {
      // Add product name
      if (product.name) {
        suggestions.push(product.name)
      }
      
      // Add art form if it matches
      if (product.art_form && product.art_form.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(product.art_form)
      }
      
      // Add artist name if it matches
      if (product.artist_name && product.artist_name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(product.artist_name)
      }
    })

    // Remove duplicates and return limited results
    return [...new Set(suggestions)].slice(0, limit)
  } catch (error) {
    console.error('Suggestion error:', error)
    return []
  }
}

// Get unique filter values for dropdowns
export async function getFilterOptions() {
  try {
    const response = await productAPI.getFilters() as {
      success: boolean
      data: {
        categories: string[]
        subcategories: string[]
        artForms: string[]
        states: string[]
      }
    }

    return {
      categories: response.data?.categories || [],
      subcategories: response.data?.subcategories || [],
      artForms: response.data?.artForms || [],
      states: response.data?.states || []
    }
  } catch (error) {
    console.error('Filter options error:', error)
    return {
      categories: [],
      subcategories: [],
      artForms: [],
      states: []
    }
  }
}

// Get trending/popular products
export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  try {
    const response = await productAPI.getProducts({
      sortBy: 'rating',
      limit
    }) as { success: boolean; data: Product[] }

    return response.data || []
  } catch (error) {
    console.error('Trending products error:', error)
    return []
  }
}

// Get featured products for homepage
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const response = await productAPI.getFeatured(limit) as { success: boolean; data: Product[] }
    return response.data || []
  } catch (error) {
    console.error('Featured products error:', error)
    return []
  }
}