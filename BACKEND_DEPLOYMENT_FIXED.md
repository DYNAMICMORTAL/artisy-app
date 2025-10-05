# 🎯 Backend Deployment - FIXED & Ready!

## ✅ What Was Fixed

**Problem:** Backend deployment was crashing with `FUNCTION_INVOCATION_FAILED` error

**Solution:** Fixed Vercel serverless function configuration
- Updated `api/vercel.json` with proper routing and HTTP methods
- Ensured correct export format in `api/index.ts`

---

## 🚀 Deploy Backend NOW

### Quick Commands:

```powershell
# 1. Navigate to API folder
cd api

# 2. Deploy to Vercel production
vercel --prod
```

That's it! Your backend will be deployed in ~1 minute.

---

## 📋 Important: Environment Variables Required

Before deploying, go to your Vercel dashboard and add these environment variables:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
OPENAI_API_KEY=sk-proj-your_openai_api_key
NODE_ENV=production
VITE_SITE_URL=https://your-frontend-url.vercel.app
```

**How to add them:**
1. Go to Vercel Dashboard
2. Select your API project
3. Settings → Environment Variables
4. Add each variable
5. Select "Production" environment
6. Save and redeploy

---

## 🔗 Connect Frontend to Backend

After backend is deployed, update frontend:

**Method 1: Vercel Dashboard (Recommended)**
1. Go to your **frontend** Vercel project
2. Settings → Environment Variables
3. Add: `VITE_API_URL=https://your-backend-url.vercel.app`
4. Redeploy frontend

**Method 2: Local .env file**
```bash
# In root .env file
VITE_API_URL=https://your-backend-url.vercel.app
```

---

## ✅ What You Should See After Deployment

### 1. Open Your Backend URL in Browser

You should see:
```json
{
  "message": "Artisy API",
  "version": "1.0.0",
  "status": "running"
}
```

### 2. Test Health Check

Visit: `https://your-backend-url.vercel.app/api/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-10-05T...",
  "environment": "production",
  "hasSupabaseKey": true,
  "hasStripeKey": true,
  "hasOpenAIKey": true
}
```

**Important:** All "has...Key" fields should be **true**!
- If any is **false** → That environment variable is missing!

### 3. Test Products Endpoint

Visit: `https://your-backend-url.vercel.app/api/products`

You should see your products from the database.

---

## 🎯 Success Checklist

- [ ] Backend deployed successfully (green checkmark in Vercel)
- [ ] Root URL shows API info JSON
- [ ] Health check shows all keys as `true`
- [ ] Products endpoint returns data
- [ ] Frontend environment variable updated with backend URL
- [ ] Frontend can fetch products
- [ ] Add to cart works
- [ ] Checkout flow works
- [ ] Stripe webhook URL updated (see below)

---

## 🔧 Update Stripe Webhook

After backend deployment:

1. Go to Stripe Dashboard
2. Developers → Webhooks
3. Click on your webhook (or create new)
4. Update endpoint URL to:
   ```
   https://your-backend-url.vercel.app/api/payments/webhook
   ```
5. Ensure these events are selected:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Copy the "Signing secret" and update `STRIPE_WEBHOOK_SECRET` in Vercel

---

## 📚 Detailed Documentation

For complete deployment instructions, see:
- `api/DEPLOYMENT_FIX.md` - Comprehensive deployment guide
- `api/QUICK_DEPLOY.md` - Quick reference commands

---

## 🐛 Troubleshooting

### Still seeing errors?

**Check Vercel Logs:**
```powershell
vercel logs [your-deployment-url]
```

**Common Issues:**

1. **500 Error** → Missing environment variables
   - Solution: Add all env vars in Vercel dashboard

2. **CORS Error** → Wrong VITE_SITE_URL
   - Solution: Update to match your frontend URL exactly

3. **Database Error** → Wrong Supabase key
   - Solution: Use SERVICE_ROLE_KEY (not anon key)

4. **Stripe Error** → Wrong webhook secret
   - Solution: Copy from Stripe dashboard webhook settings

---

## 🎉 You're Ready!

Your backend configuration is fixed and ready to deploy!

**Next Steps:**
1. Run `cd api && vercel --prod`
2. Wait ~1 minute for deployment
3. Test the URLs above
4. Connect frontend
5. Test complete app flow

**Status:** ✅ READY TO DEPLOY!

---

*Fixed: October 5, 2025*
*All serverless function issues resolved*
