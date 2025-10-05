import { Response } from 'express'
import { AuthRequest } from '../types/index.js'
import { supabaseAdmin } from '../config/supabase.js'

// Get user's wishlist
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { data, error } = await supabaseAdmin
      .from('wishlist')
      .select('product_id, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    const productIds = data?.map(item => item.product_id) || []

    res.json({
      success: true,
      data: productIds
    })
  } catch (error) {
    console.error('Get wishlist error:', error)
    res.status(500).json({ error: 'Failed to fetch wishlist' })
  }
}

// Add item to wishlist
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { product_id } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    // Check if already in wishlist
    const { data: existing } = await supabaseAdmin
      .from('wishlist')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single()

    if (existing) {
      return res.status(400).json({ error: 'Product already in wishlist' })
    }

    const { data, error } = await supabaseAdmin
      .from('wishlist')
      .insert({
        user_id: req.user.id,
        product_id
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    res.status(500).json({ error: 'Failed to add to wishlist' })
  }
}

// Remove item from wishlist
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { id } = req.params

    const { error } = await supabaseAdmin
      .from('wishlist')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ success: true, message: 'Item removed from wishlist' })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    res.status(500).json({ error: 'Failed to remove from wishlist' })
  }
}

// Check if product is in wishlist
export const checkWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ success: true, data: { inWishlist: false } })
    }

    const { productId } = req.params

    const { data, error } = await supabaseAdmin
      .from('wishlist')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single()

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      success: true,
      data: { inWishlist: !!data }
    })
  } catch (error) {
    console.error('Check wishlist error:', error)
    res.status(500).json({ error: 'Failed to check wishlist' })
  }
}
