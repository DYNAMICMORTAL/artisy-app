# 🎨 Artisy - E-Commerce Platform for Artists# React + TypeScript + Vite



A modern, full-stack e-commerce platform built with React 18, Vite, TypeScript, Supabase, and Stripe. Designed specifically for artists to sell their artwork online with a beautiful, responsive interface and secure payment processing.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## ✨ FeaturesCurrently, two official plugins are available:



### 🛍️ For Customers- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **Browse Artwork**: Discover beautiful artwork across multiple categories (Paintings, Sculptures, Photography)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Advanced Search**: Find specific pieces with powerful search and filtering capabilities

- **Shopping Cart**: Add items, manage quantities, and track total prices in real-time## React Compiler

- **Secure Checkout**: Stripe-powered payment processing with guest and user checkout options

- **Order Tracking**: View order history and status for registered usersThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## Expanding the ESLint configuration

### 🎨 For Artists/Admins

- **Product Management**: Easy-to-manage product database via Supabase dashboardIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **Order Management**: Real-time order tracking and automatic status updates

- **Payment Tracking**: Complete integration with Stripe payments and webhooks```js

- **User Analytics**: Understanding customer behavior through Supabase analyticsexport default defineConfig([

  globalIgnores(['dist']),

### 🔒 Security & Performance  {

- **Row Level Security**: Database-level security with Supabase RLS policies    files: ['**/*.{ts,tsx}'],

- **Environment Variables**: Secure API key management with client/server separation    extends: [

- **Real-time Updates**: Webhook-powered order status synchronization      // Other configs...

- **Optimized Loading**: Image lazy loading and efficient state management

      // Remove tseslint.configs.recommended and replace with this

## 🚀 Quick Start      tseslint.configs.recommendedTypeChecked,

      // Alternatively, use this for stricter rules

### Prerequisites      tseslint.configs.strictTypeChecked,

- Node.js 18+ and npm      // Optionally, add this for stylistic rules

- Supabase account and project      tseslint.configs.stylisticTypeChecked,

- Stripe account (test mode for development)

      // Other configs...

### Installation    ],

    languageOptions: {

1. **Clone and Setup**      parserOptions: {

```bash        project: ['./tsconfig.node.json', './tsconfig.app.json'],

git clone <repository-url>        tsconfigRootDir: import.meta.dirname,

cd artisy-app      },

npm install      // other options...

```    },

  },

2. **Environment Configuration**])

```bash```

cp .env.example .env

# Fill in your Supabase and Stripe credentialsYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```

```js

3. **Database Setup**// eslint.config.js

```sqlimport reactX from 'eslint-plugin-react-x'

-- Run the SQL scripts in your Supabase dashboardimport reactDom from 'eslint-plugin-react-dom'

-- 1. Execute database/schema.sql

-- 2. Execute database/seed.sqlexport default defineConfig([

```  globalIgnores(['dist']),

  {

4. **Start Development Servers**    files: ['**/*.{ts,tsx}'],

```bash    extends: [

# Terminal 1: Frontend (Vite)      // Other configs...

npm run dev      // Enable lint rules for React

      reactX.configs['recommended-typescript'],

# Terminal 2: Backend API (Express)      // Enable lint rules for React DOM

npm run server:dev      reactDom.configs.recommended,

```    ],

    languageOptions: {

5. **Test Stripe Webhooks (Optional)**      parserOptions: {

```bash        project: ['./tsconfig.node.json', './tsconfig.app.json'],

# Terminal 3: Stripe CLI        tsconfigRootDir: import.meta.dirname,

stripe listen --forward-to localhost:3001/api/webhook      },

```      // other options...

    },

Visit `http://localhost:5173` to see the application!  },

])

## 🛠️ Tech Stack```


### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Beautiful, accessible component library
- **Zustand** - Lightweight state management for cart
- **React Router** - Client-side routing

### Backend
- **Express.js** - Node.js web application framework
- **Supabase** - Backend-as-a-service with PostgreSQL
- **Stripe** - Payment processing and webhooks
- **TypeScript** - Full-stack type safety

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