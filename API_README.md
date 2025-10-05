# Artisy App - Backend API Documentation

## Overview

This is the backend API for the Artisy e-commerce application, built with Node.js, Express, TypeScript, and Supabase. The API provides endpoints for authentication, product management, cart operations, wishlist management, order processing, and Stripe payment integration.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel

## Project Structure

```
api/
├── index.ts                 # Main application entry point
├── config/
│   ├── supabase.ts         # Supabase client configuration
│   └── stripe.ts           # Stripe client configuration
├── controllers/
│   ├── auth.controller.ts       # Authentication logic
│   ├── product.controller.ts    # Product management
│   ├── cart.controller.ts       # Shopping cart operations
│   ├── wishlist.controller.ts   # Wishlist management
│   ├── order.controller.ts      # Order processing
│   └── payment.controller.ts    # Stripe webhooks
├── middleware/
│   ├── auth.middleware.ts       # JWT authentication
│   ├── error.middleware.ts      # Error handling
│   └── logger.middleware.ts     # Request logging
├── routes/
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── cart.routes.ts
│   ├── wishlist.routes.ts
│   ├── order.routes.ts
│   └── payment.routes.ts
└── types/
    └── index.ts            # TypeScript type definitions
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Sign in user
- `GET /api/auth/user` - Get current user (requires auth)
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Sign out user

### Products (`/api/products`)

- `GET /api/products` - Get all products with filtering & search
  - Query params: `query`, `category`, `subcategory`, `art_form`, `state`, `minPrice`, `maxPrice`, `is_featured`, `is_handmade`, `sortBy`, `limit`, `offset`
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/filters` - Get available filter options

### Cart (`/api/cart`)

All cart endpoints require authentication.

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Wishlist (`/api/wishlist`)

All wishlist endpoints require authentication.

- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/items` - Add item to wishlist
- `DELETE /api/wishlist/items/:id` - Remove item from wishlist
- `GET /api/wishlist/check/:productId` - Check if product is in wishlist

### Orders (`/api/orders`)

- `POST /api/orders/checkout` - Create Stripe checkout session
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/:id/status` - Get order status

### Payments (`/api/payments`)

- `POST /api/payments/webhook` - Stripe webhook handler (raw body)

### Health Check

- `GET /api/health` - API health check

## Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Site Configuration
VITE_SITE_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run in development mode:
```bash
npm run api:dev
```

4. Or run production build:
```bash
npm run api
```

## Development

### Running Frontend and Backend Together

```bash
npm run dev:all
```

This runs both the Vite frontend (port 5173) and the Express backend (port 3001) concurrently.

### API Development Only

```bash
npm run api:dev
```

## Deployment to Vercel

### Prerequisites

1. Vercel account
2. Vercel CLI installed: `npm i -g vercel`
3. Environment variables configured in Vercel dashboard

### Deployment Steps

1. **Configure Environment Variables in Vercel**:
   - Go to your Vercel project settings
   - Add all environment variables from `.env`
   - Mark sensitive variables as "Sensitive"

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The project includes a `vercel.json` file that configures:
- Build settings for the API
- Routing for API endpoints
- Environment variables

### Important Notes for Vercel

1. The `api/index.ts` file exports an Express app for Vercel serverless functions
2. All API routes are prefixed with `/api`
3. The webhook endpoint requires raw body parsing for Stripe signature verification
4. Update `VITE_API_URL` environment variable to your Vercel URL after deployment

## Authentication Flow

1. **Sign Up**: User creates account via `/api/auth/signup`
2. **Sign In**: User logs in via `/api/auth/login`, receives access token
3. **Authenticated Requests**: Include `Authorization: Bearer <token>` header
4. **Token Refresh**: Use `/api/auth/refresh-token` when access token expires

## Database Schema

### Products Table
```sql
- id (int, primary key)
- name (text)
- description (text)
- price (decimal)
- original_price (decimal, nullable)
- image_url (text)
- category (text)
- subcategory (text, nullable)
- tags (text[], nullable)
- artist_name (text, nullable)
- origin_state (text, nullable)
- art_form (text, nullable)
- material (text, nullable)
- dimensions (text, nullable)
- is_featured (boolean, default false)
- is_handmade (boolean, default false)
- stock_quantity (int, nullable)
- rating (decimal, nullable)
- review_count (int, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### Orders Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key, nullable)
- stripe_session_id (text)
- amount (decimal)
- status (enum: pending, paid, cancelled, refunded)
- items (jsonb)
- shipping_address (jsonb, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### Carts Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- items (jsonb)
- created_at (timestamp)
- updated_at (timestamp)
```

### Wishlist Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- product_id (int, foreign key)
- created_at (timestamp)
```

## Stripe Integration

### Checkout Flow

1. Frontend calls `/api/orders/checkout` with cart items
2. Backend creates order in database with status "pending"
3. Backend creates Stripe checkout session
4. Backend updates order with Stripe session ID
5. Frontend redirects user to Stripe checkout
6. User completes payment
7. Stripe sends webhook to `/api/payments/webhook`
8. Backend updates order status to "paid"

### Webhook Setup

1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/payments/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET` environment variable

## Error Handling

The API uses centralized error handling:

- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

All errors return JSON:
```json
{
  "error": "Error message",
  "message": "Detailed description (dev mode only)"
}
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Service Role Key**: Only use on backend, never expose to client
3. **JWT Verification**: All protected routes verify Supabase JWT tokens
4. **CORS**: Configured to allow only your frontend domain
5. **Stripe Webhooks**: Signature verification required
6. **Input Validation**: Validate all user inputs

## Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:3001/api/health

# Get products
curl http://localhost:3001/api/products

# Get product by ID
curl http://localhost:3001/api/products/1

# Login (get token)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get user (with auth)
curl http://localhost:3001/api/auth/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Support

For issues or questions, please open an issue in the GitHub repository.

## License

MIT
