# Artisy App - Complete E-Commerce Platform# 🎨 Artisy - E-Commerce Platform for Artists# React + TypeScript + Vite



A full-stack e-commerce application for handcrafted Indian art and crafts, featuring a React frontend and Express.js backend API.



## 🚀 FeaturesA modern, full-stack e-commerce platform built with React 18, Vite, TypeScript, Supabase, and Stripe. Designed specifically for artists to sell their artwork online with a beautiful, responsive interface and secure payment processing.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



- **Product Catalog**: Browse and search art products with advanced filtering

- **Shopping Cart**: Add/remove items, update quantities

- **Wishlist**: Save favorite products## ✨ FeaturesCurrently, two official plugins are available:

- **User Authentication**: Sign up, login with Supabase Auth

- **Secure Payments**: Stripe integration for checkout

- **Order Management**: View order history and status

- **Responsive Design**: Mobile-friendly UI with Tailwind CSS### 🛍️ For Customers- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh



## 📁 Project Structure- **Browse Artwork**: Discover beautiful artwork across multiple categories (Paintings, Sculptures, Photography)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



```- **Advanced Search**: Find specific pieces with powerful search and filtering capabilities

artisy-app/

├── api/                    # Backend API (Express + TypeScript)- **Shopping Cart**: Add items, manage quantities, and track total prices in real-time## React Compiler

│   ├── controllers/        # Business logic

│   ├── routes/            # API routes- **Secure Checkout**: Stripe-powered payment processing with guest and user checkout options

│   ├── middleware/        # Auth, error handling, logging

│   ├── config/            # Supabase, Stripe configuration- **Order Tracking**: View order history and status for registered usersThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

│   └── types/             # TypeScript types

├── src/                   # Frontend (React + TypeScript)- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

│   ├── components/        # UI components

│   ├── pages/            # Route pages## Expanding the ESLint configuration

│   ├── lib/              # API client, utilities

│   └── store/            # Zustand state management### 🎨 For Artists/Admins

├── vercel.json           # Vercel deployment config

└── package.json          # Dependencies- **Product Management**: Easy-to-manage product database via Supabase dashboardIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```

- **Order Management**: Real-time order tracking and automatic status updates

## 🛠️ Tech Stack

- **Payment Tracking**: Complete integration with Stripe payments and webhooks```js

**Frontend:**

- React 19 + TypeScript- **User Analytics**: Understanding customer behavior through Supabase analyticsexport default defineConfig([

- Vite (build tool)

- Tailwind CSS  globalIgnores(['dist']),

- React Router v7

- Zustand (state management)### 🔒 Security & Performance  {



**Backend:**- **Row Level Security**: Database-level security with Supabase RLS policies    files: ['**/*.{ts,tsx}'],

- Node.js + Express

- TypeScript- **Environment Variables**: Secure API key management with client/server separation    extends: [

- Supabase (PostgreSQL + Auth)

- Stripe (payments)- **Real-time Updates**: Webhook-powered order status synchronization      // Other configs...



## 🚦 Quick Start- **Optimized Loading**: Image lazy loading and efficient state management



### Prerequisites      // Remove tseslint.configs.recommended and replace with this

- Node.js 18+

- npm or yarn## 🚀 Quick Start      tseslint.configs.recommendedTypeChecked,

- Supabase account

- Stripe account      // Alternatively, use this for stricter rules



### Installation### Prerequisites      tseslint.configs.strictTypeChecked,



1. **Clone and install dependencies**- Node.js 18+ and npm      // Optionally, add this for stylistic rules

```bash

git clone <repo-url>- Supabase account and project      tseslint.configs.stylisticTypeChecked,

cd artisy-app

npm install- Stripe account (test mode for development)

```

      // Other configs...

2. **Set up environment variables**

```bash### Installation    ],

cp .env.example .env

```    languageOptions: {

Edit `.env` with your API keys.

1. **Clone and Setup**      parserOptions: {

3. **Run the application**

```bash```bash        project: ['./tsconfig.node.json', './tsconfig.app.json'],

# Run both frontend and backend

npm run dev:allgit clone <repository-url>        tsconfigRootDir: import.meta.dirname,



# Or run separately:cd artisy-app      },

npm run dev      # Frontend only

npm run api:dev  # Backend onlynpm install      // other options...

```

```    },

4. **Access the application**

- Frontend: http://localhost:5173  },

- Backend API: http://localhost:3001

2. **Environment Configuration**])

## 🔑 Environment Variables

```bash```

See `.env.example` for all required variables:

cp .env.example .env

- **Supabase**: URL, anon key, service role key

- **Stripe**: Publishable key, secret key, webhook secret# Fill in your Supabase and Stripe credentialsYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

- **URLs**: Frontend URL, API URL

```

## 📡 API Endpoints

```js

All endpoints are prefixed with `/api`:

3. **Database Setup**// eslint.config.js

- `POST /api/auth/signup` - Create account

- `POST /api/auth/login` - Sign in```sqlimport reactX from 'eslint-plugin-react-x'

- `GET /api/products` - List products (with filters)

- `GET /api/products/:id` - Get product details-- Run the SQL scripts in your Supabase dashboardimport reactDom from 'eslint-plugin-react-dom'

- `GET /api/cart` - Get user cart (auth required)

- `POST /api/cart/items` - Add to cart (auth required)-- 1. Execute database/schema.sql

- `GET /api/wishlist` - Get wishlist (auth required)

- `POST /api/orders/checkout` - Create checkout session-- 2. Execute database/seed.sqlexport default defineConfig([

- `GET /api/orders` - Get order history (auth required)

- `POST /api/payments/webhook` - Stripe webhook```  globalIgnores(['dist']),



See `API_README.md` for complete documentation.  {



## 🚀 Deployment4. **Start Development Servers**    files: ['**/*.{ts,tsx}'],



### Deploy to Vercel```bash    extends: [



1. Install Vercel CLI: `npm i -g vercel`# Terminal 1: Frontend (Vite)      // Other configs...

2. Login: `vercel login`

3. Deploy: `vercel --prod`npm run dev      // Enable lint rules for React

4. Add environment variables in Vercel dashboard

5. Update `VITE_API_URL` and `VITE_SITE_URL` to Vercel URLs      reactX.configs['recommended-typescript'],

6. Configure Stripe webhook with Vercel URL

# Terminal 2: Backend API (Express)      // Enable lint rules for React DOM

## 📚 Documentation

npm run server:dev      reactDom.configs.recommended,

- **API Documentation**: See `API_README.md`

- **Database Schema**: See `API_README.md` → Database Schema section```    ],

- **Stripe Integration**: See `API_README.md` → Stripe Integration section

    languageOptions: {

## 🧪 Testing

5. **Test Stripe Webhooks (Optional)**      parserOptions: {

**Test Stripe Payments:**

- Success card: `4242 4242 4242 4242````bash        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- Decline card: `4000 0000 0000 0002`

- Use any future date and any 3-digit CVC# Terminal 3: Stripe CLI        tsconfigRootDir: import.meta.dirname,



## 🔒 Securitystripe listen --forward-to localhost:3001/api/webhook      },



- ✅ Environment variables not committed```      // other options...

- ✅ Service role key only on backend

- ✅ JWT authentication for protected routes    },

- ✅ CORS configured for frontend domain

- ✅ Stripe webhook signature verificationVisit `http://localhost:5173` to see the application!  },

- ✅ Input validation on all endpoints

])

## 🐛 Troubleshooting

## 🛠️ Tech Stack```

**Backend won't start:**

- Check environment variables are set

- Verify port 3001 is available### Frontend

- Check Supabase/Stripe credentials- **React 18** - Modern React with hooks and concurrent features

- **TypeScript** - Type-safe development

**Frontend can't connect:**- **Vite** - Lightning-fast build tool and dev server

- Verify `VITE_API_URL` is correct- **Tailwind CSS** - Utility-first CSS framework

- Check backend is running- **ShadCN UI** - Beautiful, accessible component library

- Check browser console for CORS errors- **Zustand** - Lightweight state management for cart

- **React Router** - Client-side routing

## 📄 License

### Backend

MIT- **Express.js** - Node.js web application framework

- **Supabase** - Backend-as-a-service with PostgreSQL

## 🙏 Credits- **Stripe** - Payment processing and webhooks

- **TypeScript** - Full-stack type safety

Built with React, Express, Supabase, Stripe, and TypeScript.

## 📁 Project Structure

```
artisy-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── Header.tsx      # Navigation header with cart counter
│   │   ├── ProductCard.tsx # Product display component
│   │   └── ShoppingCart.tsx# Shopping cart sidebar
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Product listing with search/filter
│   │   ├── ProductDetail.tsx# Individual product page
│   │   ├── Checkout.tsx    # Stripe checkout flow
│   │   ├── Auth.tsx        # Sign in/up authentication
│   │   ├── OrderSuccess.tsx# Post-purchase confirmation
│   │   └── Orders.tsx      # Order history (protected)
│   ├── lib/                # Utility libraries
│   │   ├── supabase.ts     # Supabase client configuration
│   │   └── utils.ts        # Helper functions
│   ├── store/              # State management
│   │   └── cart.ts         # Zustand cart store with persistence
│   └── App.tsx             # Main application with routing
├── server/                 # Express.js backend
│   └── index.ts           # API routes and webhook handlers
├── database/              # SQL scripts
│   ├── schema.sql         # Database schema with RLS
│   └── seed.sql          # Sample artwork data (18 items)
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
```env
# Supabase (Frontend - Safe to expose)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase (Backend - Keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
VITE_SITE_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

## 🔄 API Endpoints

### POST /api/create-checkout-session
Creates a Stripe checkout session and database order record.

**Request:**
```json
{
  "items": [{ "id": 1, "name": "Artwork", "price": 299.99, "quantity": 1 }],
  "userEmail": "customer@example.com",
  "userId": "uuid-or-null"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

### POST /api/webhook
Handles Stripe webhook events:
- `checkout.session.completed` → Updates order status to 'paid'
- `payment_intent.payment_failed` → Updates order status to 'cancelled'

## 🧪 Testing

### Test Cards (Stripe)
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Complete Testing Flow
1. Browse 18 sample artworks on homepage
2. Use search bar to find specific pieces
3. Filter by category (Paintings, Sculptures, Photography)
4. Click product to view details
5. Add items to cart (note cart counter updates)
6. View cart and modify quantities
7. Sign up/in or checkout as guest
8. Complete payment with test card
9. View order confirmation page
10. Check order in database and order history page

## 🚀 Deployment

### Frontend (Vercel - Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Backend (Railway/Heroku)
1. Deploy Express.js server to cloud platform
2. Set production environment variables
3. Update CORS settings for production domain

### Webhook Configuration
1. Add webhook endpoint in Stripe dashboard
2. Set URL: `https://your-api-domain/api/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy webhook secret to environment variables

## 📱 Features Showcase

- **🛒 Shopping Cart**: Persistent cart with Zustand + localStorage
- **🔍 Search & Filter**: Real-time product search across name, description, category
- **🎨 Product Categories**: Paintings, Sculptures, Photography with 18 sample items
- **💳 Secure Payments**: Stripe Checkout with webhook order synchronization  
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🔐 Authentication**: Supabase Auth with email confirmation
- **📊 Order Management**: Protected order history with RLS enforcement
- **⚡ Performance**: Vite dev server, optimized builds, lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: GitHub Issues for bugs/feature requests
- **Documentation**: Check `/database` folder for SQL scripts
- **Demo**: Live demo at [your-deployed-url]

---

**Built with ❤️ for artists and art lovers worldwide**

*Artisy makes it easy for artists to sell their work online and for customers to discover and purchase beautiful artwork securely.*