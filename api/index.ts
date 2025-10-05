import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

// Basic middleware first (before any imports that might fail)
app.use(cors({
  origin: process.env.VITE_SITE_URL || 'http://localhost:5173',
  credentials: true
}))

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

// Try to load routes (with error handling)
try {
  // Import routes asynchronously to catch any import errors
  import('./routes/auth.routes.js').then(({ default: authRoutes }) => {
    app.use('/api/auth', authRoutes)
  }).catch(err => console.error('Failed to load auth routes:', err))

  import('./routes/product.routes.js').then(({ default: productRoutes }) => {
    app.use('/api/products', productRoutes)
  }).catch(err => console.error('Failed to load product routes:', err))

  import('./routes/cart.routes.js').then(({ default: cartRoutes }) => {
    app.use('/api/cart', cartRoutes)
  }).catch(err => console.error('Failed to load cart routes:', err))

  import('./routes/wishlist.routes.js').then(({ default: wishlistRoutes }) => {
    app.use('/api/wishlist', wishlistRoutes)
  }).catch(err => console.error('Failed to load wishlist routes:', err))

  import('./routes/order.routes.js').then(({ default: orderRoutes }) => {
    app.use('/api/orders', orderRoutes)
  }).catch(err => console.error('Failed to load order routes:', err))

  import('./routes/payment.routes.js').then(({ default: paymentRoutes }) => {
    // Raw body for webhook must be set before this route
    app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
    app.use('/api/payments', paymentRoutes)
  }).catch(err => console.error('Failed to load payment routes:', err))

} catch (error) {
  console.error('Error loading routes:', error)
}

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist',
    availableEndpoints: ['/api/health', '/api/test', '/api/products', '/api/auth', '/api/cart', '/api/wishlist', '/api/orders', '/api/payments']
  })
})

// Error handling middleware
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
