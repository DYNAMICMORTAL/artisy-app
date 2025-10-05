# 🎨 Artisy App - Complete Deployment Guide

## 📊 Architecture Overview

```
Frontend (Vercel)                Backend (Vercel)              Database
┌─────────────────┐             ┌─────────────────┐          ┌──────────────┐
│   React + Vite  │────────────▶│   Express API   │─────────▶│   Supabase   │
│                 │             │   (Serverless)  │          │  (PostgreSQL)│
│  artisy-app     │             │   artisy-api    │          └──────────────┘
│  .vercel.app    │             │   .vercel.app   │
└─────────────────┘             └─────────────────┘
         │                               │
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │   Stripe    │
                  │  (Payments) │
                  └─────────────┘
```

---

## 🚀 Deployment Steps

### 1️⃣ Deploy Backend (API)

#### A. Set Environment Variables in Vercel
Go to Vercel Dashboard → Your API Project → Settings → Environment Variables

```bash
# Required Variables
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...     # From Supabase Dashboard
STRIPE_SECRET_KEY=sk_test_51...         # From Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...         # From Stripe Webhook Settings
OPENAI_API_KEY=sk-proj-...              # From OpenAI Dashboard
NODE_ENV=production
VITE_SITE_URL=https://your-frontend.vercel.app
```

#### B. Deploy Backend
```powershell
cd api
vercel --prod
```

#### C. Get Your Backend URL
After deployment, Vercel will show: `https://artisy-api-xxx.vercel.app`
**Save this URL!** You'll need it for the frontend.

---

### 2️⃣ Deploy Frontend

#### A. Set Environment Variables in Vercel
Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

```bash
# Required Variables
VITE_API_URL=https://your-backend-url.vercel.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_STRIPE_PUBLIC_KEY=pk_test_51...
VITE_SITE_URL=https://your-frontend.vercel.app
```

#### B. Deploy Frontend
```powershell
# From root directory
vercel --prod
```

---

### 3️⃣ Update Stripe Webhook

After backend deployment:

1. Go to **Stripe Dashboard** → Developers → Webhooks
2. Click your webhook (or create new)
3. Update endpoint URL:
   ```
   https://your-backend-url.vercel.app/api/payments/webhook
   ```
4. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Copy the **Signing Secret**
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel backend env vars

---

## ✅ Testing Checklist

### Backend Tests

| Endpoint | URL | Expected Result |
|----------|-----|----------------|
| Root | `https://your-api.vercel.app/` | `{"message":"Artisy API","version":"1.0.0","status":"running"}` |
| Health | `https://your-api.vercel.app/api/health` | All `has...Key` fields are `true` |
| Products | `https://your-api.vercel.app/api/products` | Array of products from database |

### Frontend Tests

- [ ] Homepage loads with featured products
- [ ] Browse page shows all products
- [ ] Search works correctly
- [ ] Product detail page loads
- [ ] Add to cart works
- [ ] Cart shows items correctly
- [ ] Checkout redirects to Stripe
- [ ] After payment, redirected to success page
- [ ] Orders page shows completed orders

---

## 🔍 What You Should See

### 1. Backend Root Endpoint
Visit: `https://your-backend-url.vercel.app/`

```json
{
  "message": "Artisy API",
  "version": "1.0.0",
  "status": "running"
}
```

✅ **This means:** API is deployed and running!

### 2. Backend Health Check
Visit: `https://your-backend-url.vercel.app/api/health`

```json
{
  "status": "OK",
  "timestamp": "2025-10-05T12:34:56.789Z",
  "environment": "production",
  "hasSupabaseKey": true,
  "hasStripeKey": true,
  "hasOpenAIKey": true
}
```

✅ **This means:** All environment variables are loaded correctly!

⚠️ **If any `has...Key` is `false`:** That environment variable is missing!

### 3. Frontend Homepage
Visit: `https://your-frontend-url.vercel.app/`

You should see:
- Premium art gallery design
- Featured products loading
- Navigation working
- Search bar functional

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Shows 500 Error

**Problem:** `FUNCTION_INVOCATION_FAILED`

**Solution:**
1. Check environment variables in Vercel
2. Ensure all required vars are set
3. Check function logs: `vercel logs [url]`
4. Redeploy after adding vars

### Issue 2: Frontend Can't Connect to Backend

**Problem:** Products not loading, API errors in console

**Solution:**
1. Check `VITE_API_URL` in frontend env vars
2. Ensure no trailing slash in URL
3. Verify CORS settings (VITE_SITE_URL in backend)
4. Check browser console for error details

### Issue 3: Checkout Not Working

**Problem:** Stripe checkout fails or webhook not triggered

**Solution:**
1. Verify `STRIPE_SECRET_KEY` in backend
2. Update Stripe webhook URL
3. Check `STRIPE_WEBHOOK_SECRET` matches Stripe
4. Test webhook in Stripe dashboard

### Issue 4: Database Connection Errors

**Problem:** API returns database errors

**Solution:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` (not anon key!)
2. Check Supabase project is active
3. Verify database tables exist
4. Check RLS policies allow access

---

## 📝 Environment Variables Summary

### Backend (API) - Vercel Dashboard
```
SUPABASE_SERVICE_ROLE_KEY     → From Supabase
STRIPE_SECRET_KEY             → From Stripe
STRIPE_WEBHOOK_SECRET         → From Stripe Webhook
OPENAI_API_KEY                → From OpenAI
NODE_ENV=production           → Set manually
VITE_SITE_URL                 → Your frontend URL
```

### Frontend - Vercel Dashboard
```
VITE_API_URL                  → Your backend URL
VITE_SUPABASE_URL             → From Supabase
VITE_SUPABASE_ANON_KEY        → From Supabase
VITE_STRIPE_PUBLIC_KEY        → From Stripe
VITE_SITE_URL                 → Your frontend URL
```

---

## 🎯 Quick Deployment Commands

### Deploy Backend
```powershell
cd api
vercel --prod
```

### Deploy Frontend
```powershell
# From root
vercel --prod
```

### Check Logs
```powershell
vercel logs [deployment-url]
```

---

## 🎉 Success!

Once both are deployed and tested:

1. ✅ Backend API responding correctly
2. ✅ Frontend loading and displaying products
3. ✅ Add to cart working
4. ✅ Checkout flow complete
5. ✅ Orders showing after purchase
6. ✅ Stripe webhook receiving events

**Your Artisy App is LIVE! 🎨🖼️**

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Project Docs:**
  - `BACKEND_DEPLOYMENT_FIXED.md` - Backend deployment guide
  - `api/DEPLOYMENT_FIX.md` - Detailed API deployment
  - `api/QUICK_DEPLOY.md` - Quick reference

---

*Last Updated: October 5, 2025*
*Status: ✅ Ready for Production Deployment*
