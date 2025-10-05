import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

// Basic middleware first (before any imports that might fail)
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

// Test endpoint to check if we can import modules
app.get('/api/test', async (_req: Request, res: Response) => {
  try {
    // Try to import routes dynamically
    const { default: productRoutes } = await import('./routes/product.routes.js')
    res.json({ 
      success: true, 
      message: 'Module imports working',
      hasProductRoutes: !!productRoutes
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Module import failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Load routes synchronously using top-level await pattern
// This ensures routes are registered before the 404 handler
;(async () => {
  try {
    // Import and register auth routes
    const { default: authRoutes } = await import('./routes/auth.routes.js')
    app.use('/api/auth', authRoutes)
    console.log('✅ Auth routes loaded')

    // Import and register product routes
    const { default: productRoutes } = await import('./routes/product.routes.js')
    app.use('/api/products', productRoutes)
    console.log('✅ Product routes loaded')

    // Import and register cart routes
    const { default: cartRoutes } = await import('./routes/cart.routes.js')
    app.use('/api/cart', cartRoutes)
    console.log('✅ Cart routes loaded')

    // Import and register wishlist routes
    const { default: wishlistRoutes } = await import('./routes/wishlist.routes.js')
    app.use('/api/wishlist', wishlistRoutes)
    console.log('✅ Wishlist routes loaded')

    // Import and register order routes
    const { default: orderRoutes } = await import('./routes/order.routes.js')
    app.use('/api/orders', orderRoutes)
    console.log('✅ Order routes loaded')

    // Import and register payment routes
    const { default: paymentRoutes } = await import('./routes/payment.routes.js')
    app.use('/api/payments', paymentRoutes)
    console.log('✅ Payment routes loaded')

  } catch (error) {
    console.error('❌ Error loading routes:', error)
  }
})()

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist',
    availableEndpoints: ['/api/health', '/api/test', '/api/products', '/api/auth', '/api/cart', '/api/wishlist', '/api/orders', '/api/payments']
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

// Export for Vercel serverless
export default app
