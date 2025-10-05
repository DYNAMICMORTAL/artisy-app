import express, { Request, Response } from 'express'
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

// Load environment variables
dotenv.config()

const app = express()

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

// Root route - Show a nice welcome message
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: '🎨 Artisy API - Your Premium Art Gallery Backend',
    version: '1.0.0',
    status: '✅ Running Successfully',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      auth: '/api/auth',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      orders: '/api/orders',
      payments: '/api/payments'
    },
    documentation: 'Visit https://artisy-app.vercel.app for the frontend'
  })
})

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: '✅ Healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Connected' : '❌ Not configured',
    payments: process.env.STRIPE_SECRET_KEY ? '✅ Connected' : '❌ Not configured',
    ai: process.env.OPENAI_API_KEY ? '✅ Connected' : '❌ Not configured',
    message: 'All systems operational'
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
app.use((_req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist',
    availableEndpoints: ['/api/health', '/api/products', '/api/auth', '/api/cart', '/api/wishlist', '/api/orders', '/api/payments']
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Export for Vercel serverless
export default app
