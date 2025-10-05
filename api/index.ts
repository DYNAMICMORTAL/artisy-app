import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import cartRoutes from './routes/cart.routes'
import wishlistRoutes from './routes/wishlist.routes'
import orderRoutes from './routes/order.routes'
import paymentRoutes from './routes/payment.routes'
import { errorHandler } from './middleware/error.middleware'
import { requestLogger } from './middleware/logger.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(requestLogger)

app.use(cors({
  origin: process.env.VITE_SITE_URL || 'http://localhost:5173',
  credentials: true
}))

// Raw body middleware for webhook verification (must be before express.json())
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// JSON middleware for other routes
app.use(express.json())

// Root route
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Artisy API',
    version: '1.0.0',
    status: 'running'
  })
})

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)

// 404 handler (must be before error handler)
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

export default app
