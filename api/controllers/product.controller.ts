import { Response } from 'express'
import { AuthRequest } from '../types'
import { supabaseAdmin } from '../config/supabase'

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
export const getFilterOptions = async (req: AuthRequest, res: Response) => {
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
