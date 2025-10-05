import { Response } from 'express'
import { AuthRequest } from '../types'
import { supabaseAdmin } from '../config/supabase'
import { stripe } from '../config/stripe'

// Create checkout session
export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { items, userEmail, userId } = req.body

    if (!items || !items.length) {
      return res.status(400).json({ error: 'No items provided' })
    }

    if (!userEmail) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Create order record in database first
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: userId || null,
          stripe_session_id: '', // Will be updated after session creation
          amount: totalAmount,
          status: 'pending',
          items: items
        }
      ])
      .select()
      .single()

    if (orderError) {
      console.error('Database error:', orderError)
      return res.status(500).json({ error: 'Failed to create order' })
    }

    // Create Stripe line items
    const lineItems = items.map((item: { name: string; image_url: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image_url],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.VITE_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_SITE_URL}/checkout`,
      customer_email: userEmail,
      metadata: {
        orderId: order.id,
        userId: userId || '',
      },
      payment_intent_data: {
        metadata: {
          orderId: order.id,
          userId: userId || '',
        }
      }
    })

    // Update order with Stripe session ID
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    if (updateError) {
      console.error('Failed to update order:', updateError)
    }

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url
      }
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Get user's orders
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

// Get order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Check if user owns this order (if authenticated)
    if (req.user && data.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}

// Get order status
export const getOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('status, amount, created_at')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get order status error:', error)
    res.status(500).json({ error: 'Failed to fetch order status' })
  }
}
