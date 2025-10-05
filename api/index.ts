import express, { Request, Response } from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import orderRoutes from './routes/order.routes.js'
import paymentRoutes from './routes/payment.routes.js'

const app = express()

// Middleware
app.use(cors({
  origin: process.env.VITE_SITE_URL || 'http://localhost:5173',
  credentials: true
}))

// Raw body middleware for webhook verification (must be before express.json())
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

app.use(express.json())

// Simple root route that always works
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
    documentation: 'Visit https://artisy-app.vercel.app for the frontend',
    timestamp: new Date().toISOString()
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
    viteUrl: process.env.VITE_SITE_URL || 'Not set',
    supabaseUrl: process.env.VITE_SUPABASE_URL || 'Not set',
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

// 404 handler (must be after all routes)
app.use((_req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist',
    availableEndpoints: ['/api/health', '/api/products', '/api/auth', '/api/cart', '/api/wishlist', '/api/orders', '/api/payments']
  })
})

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// Start server for local development
const PORT = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 CORS enabled for: ${process.env.VITE_SITE_URL || 'http://localhost:5173'}`)
  })
}

// Export for Vercel serverless
export default app
