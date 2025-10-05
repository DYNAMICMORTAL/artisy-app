import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// Initialize Supabase (server-side with service role key)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Middleware
app.use(cors({
  origin: process.env.VITE_SITE_URL || 'http://localhost:5173',
  credentials: true
}))

// Raw body middleware for webhook verification
app.use('/api/webhook', express.raw({ type: 'application/json' }))

// JSON middleware for other routes
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, userEmail, userId } = req.body

    if (!items || !items.length) {
      return res.status(400).json({ error: 'No items provided' })
    }

    if (!userEmail) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Create order record in database first
    const { data: order, error: orderError } = await supabase
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
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
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
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    if (updateError) {
      console.error('Failed to update order:', updateError)
    }

    res.json({ sessionId: session.id, checkoutUrl: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Stripe webhook handler
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !endpointSecret) {
    console.error('Missing signature or webhook secret')
    return res.status(400).send('Missing signature or webhook secret')
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Payment completed:', session.id)

        // Update order status to paid
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)

        if (error) {
          console.error('Failed to update order status:', error)
        } else {
          console.log('Order status updated to paid')
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', failedPayment.id)

        if (failedPayment.metadata?.orderId) {
          await supabase
            .from('orders')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', failedPayment.metadata.orderId)
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  } catch (error) {
    console.error('Error handling webhook:', error)
    return res.status(500).send('Webhook handler failed')
  }

  res.status(200).send('OK')
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app