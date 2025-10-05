import { Response } from 'express'
import { AuthRequest } from '../types'
import { supabaseAdmin } from '../config/supabase'
import { getEmbedding } from '../utils/embedding'

// Get all products with search and filter
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const {
      query,
      category,
      subcategory,
      art_form,
      state,
      minPrice,
      maxPrice,
      is_featured,
      is_handmade,
      sortBy = 'featured',
      limit = 20,
      offset = 0
    } = req.query

    let queryBuilder = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })

    // Apply filters
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category)
    }

    if (subcategory) {
      queryBuilder = queryBuilder.eq('subcategory', subcategory)
    }

    if (art_form) {
      queryBuilder = queryBuilder.eq('art_form', art_form)
    }

    if (state) {
      queryBuilder = queryBuilder.eq('origin_state', state)
    }

    if (minPrice) {
      queryBuilder = queryBuilder.gte('price', Number(minPrice))
    }

    if (maxPrice) {
      queryBuilder = queryBuilder.lte('price', Number(maxPrice))
    }

    if (is_featured === 'true') {
      queryBuilder = queryBuilder.eq('is_featured', true)
    }

    if (is_handmade === 'true') {
      queryBuilder = queryBuilder.eq('is_handmade', true)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        queryBuilder = queryBuilder.order('price', { ascending: true })
        break
      case 'price_desc':
        queryBuilder = queryBuilder.order('price', { ascending: false })
        break
      case 'newest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
        break
      case 'rating':
        queryBuilder = queryBuilder.order('rating', { ascending: false })
        break
      default:
        queryBuilder = queryBuilder.order('is_featured', { ascending: false })
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    // Apply pagination
    queryBuilder = queryBuilder.range(Number(offset), Number(offset) + Number(limit) - 1)

    const { data, error, count } = await queryBuilder

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      success: true,
      data: data || [],
      pagination: {
        total: count || 0,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: (count || 0) > Number(offset) + Number(limit)
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

// Get single product by ID
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}

// Get featured products
export const getFeaturedProducts = async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 4

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Get featured products error:', error)
    res.status(500).json({ error: 'Failed to fetch featured products' })
  }
}

// Get filter options (categories, art forms, etc.)
export const getFilterOptions = async (_req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('category, subcategory, art_form, origin_state')

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Extract unique values
    const categories = [...new Set(data?.map(p => p.category).filter(Boolean))]
    const subcategories = [...new Set(data?.map(p => p.subcategory).filter(Boolean))]
    const artForms = [...new Set(data?.map(p => p.art_form).filter(Boolean))]
    const states = [...new Set(data?.map(p => p.origin_state).filter(Boolean))]

    res.json({
      success: true,
      data: {
        categories,
        subcategories,
        artForms,
        states
      }
    })
  } catch (error) {
    console.error('Get filter options error:', error)
    res.status(500).json({ error: 'Failed to fetch filter options' })
  }
}

// Semantic search for products using embeddings
export const semanticSearch = async (req: AuthRequest, res: Response) => {
  try {
    const { query, limit = 20 } = req.body

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required and must be a string' })
    }

    // Generate embedding for the search query
    const queryEmbedding = await getEmbedding(query)

    // Use pgvector similarity search in Supabase
    // Note: This requires pgvector extension and embedding column in products table
    const { data, error } = await supabaseAdmin.rpc('search_products_by_embedding', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: Number(limit)
    })

    if (error) {
      console.error('Semantic search error:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Semantic search error:', error)
    res.status(500).json({ error: 'Failed to perform semantic search' })
  }
}

// Add a review for a product
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { rating, review_text } = req.body
    const user_id = req.user?.id

    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('product_id', id)
      .eq('user_id', user_id)
      .single()

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' })
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([{
        product_id: id,
        user_id,
        rating: Number(rating),
        review_text
      }])
      .select()
      .single()

    if (error) {
      console.error('Add review error:', error)
      return res.status(500).json({ error: error.message })
    }

    // Update product average rating and review count
    await updateProductRating(id)

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Add review error:', error)
    res.status(500).json({ error: 'Failed to add review' })
  }
}

// Get reviews for a product
export const getReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { limit = 20, offset = 0 } = req.query

    // First get reviews
    const { data: reviews, error, count } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    if (error) {
      console.error('Get reviews error:', error)
      return res.status(500).json({ error: error.message })
    }

    // Then get user data for each review separately
    const reviewsWithUsers = await Promise.all(
      (reviews || []).map(async (review) => {
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id, email')
          .eq('id', review.user_id)
          .single()
        
        return {
          ...review,
          users: user
        }
      })
    )

    res.json({
      success: true,
      data: reviewsWithUsers,
      pagination: {
        total: count || 0,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: (count || 0) > Number(offset) + Number(limit)
      }
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}

// Helper function to update product rating
async function updateProductRating(productId: string) {
  try {
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)

    if (reviews && reviews.length > 0) {
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      const reviewCount = reviews.length

      await supabaseAdmin
        .from('products')
        .update({
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          review_count: reviewCount
        })
        .eq('id', productId)
    }
  } catch (error) {
    console.error('Update product rating error:', error)
  }
}

