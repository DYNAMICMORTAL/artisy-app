import { supabase } from './supabase'
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
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })

    // Apply semantic text search
    if (options.query && options.query.trim()) {
      const searchTerm = options.query.trim().toLowerCase()
      
      // Multi-field search with semantic matching
      query = query.or(`name.ilike.*${searchTerm}*,description.ilike.*${searchTerm}*,category.ilike.*${searchTerm}*,subcategory.ilike.*${searchTerm}*,art_form.ilike.*${searchTerm}*,artist_name.ilike.*${searchTerm}*,origin_state.ilike.*${searchTerm}*,material.ilike.*${searchTerm}*`)
    }

    // Apply filters
    if (options.filters?.category) {
      query = query.eq('category', options.filters.category)
    }

    if (options.filters?.subcategory) {
      query = query.eq('subcategory', options.filters.subcategory)
    }

    if (options.filters?.artForm) {
      query = query.eq('art_form', options.filters.artForm)
    }

    if (options.filters?.originState) {
      query = query.eq('origin_state', options.filters.originState)
    }

    if (options.filters?.priceRange) {
      query = query
        .gte('price', options.filters.priceRange.min)
        .lte('price', options.filters.priceRange.max)
    }

    if (options.filters?.isHandmade !== undefined) {
      query = query.eq('is_handmade', options.filters.isHandmade)
    }

    if (options.filters?.isFeatured !== undefined) {
      query = query.eq('is_featured', options.filters.isFeatured)
    }

    if (options.filters?.rating) {
      query = query.gte('rating', options.filters.rating)
    }

    // Apply sorting
    switch (options.sortBy) {
      case 'price_low':
        query = query.order('price', { ascending: true })
        break
      case 'price_high':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'featured':
        query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false })
        break
      default: // relevance
        if (options.query) {
          // When searching, order by relevance (ts_rank)
          query = query.order('rating', { ascending: false })
        } else {
          // Default to featured first, then rating
          query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false })
        }
    }

    // Apply pagination
    if (options.limit) {
      query = query.range(
        options.offset || 0,
        (options.offset || 0) + options.limit - 1
      )
    }

    const { data: products, count, error } = await query

    if (error) {
      console.error('Search error:', error)
      return { products: [], total: 0, error: error.message }
    }

    return {
      products: products || [],
      total: count || 0
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
    const { data, error } = await supabase
      .from('products')
      .select('name, tags, art_form, artist_name')
      .ilike('name', `%${query}%`)
      .limit(limit)

    if (error) {
      console.error('Suggestion error:', error)
      return []
    }

    const suggestions: string[] = []
    
    data?.forEach(product => {
      // Add product name if it matches
      if (product.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(product.name)
      }
      
      // Add art form if it matches
      if (product.art_form?.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(product.art_form)
      }
      
      // Add artist name if it matches
      if (product.artist_name?.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(product.artist_name)
      }
      
      // Add matching tags
      product.tags?.forEach((tag: string) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push(tag)
        }
      })
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
    const { data: products, error } = await supabase
      .from('products')
      .select('category, subcategory, art_form, origin_state')

    if (error) {
      console.error('Filter options error:', error)
      return {
        categories: [],
        subcategories: [],
        artForms: [],
        states: []
      }
    }

    const categories = [...new Set(products?.map(p => p.category).filter(Boolean))]
    const subcategories = [...new Set(products?.map(p => p.subcategory).filter(Boolean))]
    const artForms = [...new Set(products?.map(p => p.art_form).filter(Boolean))]
    const states = [...new Set(products?.map(p => p.origin_state).filter(Boolean))]

    return {
      categories: categories.sort(),
      subcategories: subcategories.sort(),
      artForms: artForms.sort(),
      states: states.sort()
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
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Trending products error:', error)
      return []
    }

    return products || []
  } catch (error) {
    console.error('Trending products error:', error)
    return []
  }
}

// Get featured products for homepage
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Featured products error:', error)
      return []
    }

    return products || []
  } catch (error) {
    console.error('Featured products error:', error)
    return []
  }
}