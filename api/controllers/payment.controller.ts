import { Request, Response } from 'express'
import Stripe from 'stripe'
import { stripe } from '../config/stripe'
import { supabaseAdmin } from '../config/supabase'

// Stripe webhook handler
export const handleWebhook = async (req: Request, res: Response) => {
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
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Payment completed:', session.id)

        // Update order status to paid
        const { error } = await supabaseAdmin
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
      }
      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', failedPayment.id)

        if (failedPayment.metadata?.orderId) {
          await supabaseAdmin
            .from('orders')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', failedPayment.metadata.orderId)
        }
        break
      }
      default: {
        console.log(`Unhandled event type ${event.type}`)
      }
    }
  } catch (error) {
    console.error('Error handling webhook:', error)
    return res.status(500).send('Webhook handler failed')
  }

  res.status(200).send('OK')
}
