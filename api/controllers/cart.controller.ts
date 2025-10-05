import { Response } from 'express'
import { AuthRequest } from '../types'
import { supabaseAdmin } from '../config/supabase'

// Get user's cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { data, error } = await supabaseAdmin
      .from('carts')
      .select('*')
      .eq('user_id', req.user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return res.status(500).json({ error: error.message })
    }

    res.json({
      success: true,
      data: data || { items: [], user_id: req.user.id }
    })
  } catch (error) {
    console.error('Get cart error:', error)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
}

// Add item to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { product_id, quantity = 1 } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    // Get product details
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, image_url')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Get or create cart
    const { data: existingCart } = await supabaseAdmin
      .from('carts')
      .select('*')
      .eq('user_id', req.user.id)
      .single()

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity
    }

    let updatedItems = []

    if (existingCart) {
      // Update existing cart
      const items = existingCart.items || []
      const existingItemIndex = items.findIndex((item: { id: number }) => item.id === product_id)

      if (existingItemIndex >= 0) {
        items[existingItemIndex].quantity += quantity
        updatedItems = items
      } else {
        updatedItems = [...items, cartItem]
      }

      const { data, error } = await supabaseAdmin
        .from('carts')
        .update({ items: updatedItems, updated_at: new Date().toISOString() })
        .eq('user_id', req.user.id)
        .select()
        .single()

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.json({ success: true, data })
    } else {
      // Create new cart
      const { data, error } = await supabaseAdmin
        .from('carts')
        .insert({
          user_id: req.user.id,
          items: [cartItem]
        })
        .select()
        .single()

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.json({ success: true, data })
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
}

// Update cart item quantity
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { id } = req.params
    const { quantity } = req.body

    if (!quantity || quantity < 0) {
      return res.status(400).json({ error: 'Valid quantity is required' })
    }

    const { data: cart, error: getError } = await supabaseAdmin
      .from('carts')
      .select('*')
      .eq('user_id', req.user.id)
      .single()

    if (getError || !cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    let items = cart.items || []

    if (quantity === 0) {
      // Remove item
      items = items.filter((item: { id: number }) => item.id !== Number(id))
    } else {
      // Update quantity
      items = items.map((item: { id: number; quantity: number }) =>
        item.id === Number(id) ? { ...item, quantity } : item
      )
    }

    const { data, error } = await supabaseAdmin
      .from('carts')
      .update({ items, updated_at: new Date().toISOString() })
      .eq('user_id', req.user.id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Update cart item error:', error)
    res.status(500).json({ error: 'Failed to update cart item' })
  }
}

// Remove item from cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { id } = req.params

    const { data: cart, error: getError } = await supabaseAdmin
      .from('carts')
      .select('*')
      .eq('user_id', req.user.id)
      .single()

    if (getError || !cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    const items = (cart.items || []).filter((item: { id: number }) => item.id !== Number(id))

    const { data, error } = await supabaseAdmin
      .from('carts')
      .update({ items, updated_at: new Date().toISOString() })
      .eq('user_id', req.user.id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Remove from cart error:', error)
    res.status(500).json({ error: 'Failed to remove item from cart' })
  }
}

// Clear cart
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { error } = await supabaseAdmin
      .from('carts')
      .update({ items: [], updated_at: new Date().toISOString() })
      .eq('user_id', req.user.id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ success: true, message: 'Cart cleared' })
  } catch (error) {
    console.error('Clear cart error:', error)
    res.status(500).json({ error: 'Failed to clear cart' })
  }
}
