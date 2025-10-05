# Artisy App - Deployment Guide for Vercel

This guide will walk you through deploying the Artisy e-commerce application to Vercel, including both the frontend and backend API.

## Prerequisites

- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ GitHub repository with your code
- ✅ Supabase project set up
- ✅ Stripe account configured
- ✅ Domain name (optional, Vercel provides a free subdomain)

## Step-by-Step Deployment

### 1. Prepare Your Code

Ensure all files are committed to your Git repository:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Install Vercel CLI (Optional)

While you can deploy via the Vercel dashboard, the CLI is recommended:

```bash
npm install -g vercel
```

### 3. Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "New Project"**

3. **Import your Git repository**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select the `artisy-app` repository

4. **Configure Project Settings**
   - Framework Preset: **Vite**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables**
   
   Click "Environment Variables" and add:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NODE_ENV=production
   PORT=3001
   ```

   ⚠️ **Important**: 
   - Mark `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` as **Sensitive**
   - Leave `VITE_SITE_URL` and `VITE_API_URL` blank for now

6. **Click "Deploy"**
   
   Vercel will build and deploy your application. This takes 2-3 minutes.

### 4. Configure URLs

After successful deployment:

1. **Note your Vercel URLs**
   - You'll get a URL like: `https://artisy-app-xxx.vercel.app`

2. **Update Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add/Update these variables:
     ```
     VITE_SITE_URL=https://artisy-app-xxx.vercel.app
     VITE_API_URL=https://artisy-app-xxx.vercel.app
     ```

3. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Select "Redeploy"

### 5. Configure Stripe Webhook

1. **Go to [Stripe Dashboard](https://dashboard.stripe.com)**

2. **Navigate to Developers → Webhooks**

3. **Click "Add endpoint"**
   - Endpoint URL: `https://artisy-app-xxx.vercel.app/api/payments/webhook`
   - Events to send:
     - `checkout.session.completed`
     - `payment_intent.payment_failed`

4. **Copy the Signing Secret**
   - Click on your webhook
   - Copy the signing secret (starts with `whsec_`)

5. **Update Vercel Environment Variable**
   - Go back to Vercel Project Settings → Environment Variables
   - Update `STRIPE_WEBHOOK_SECRET` with the new value
   - Redeploy again

### 6. Configure Supabase CORS (Optional)

If you encounter CORS issues:

1. **Go to Supabase Dashboard**
2. **Navigate to Settings → API**
3. **Add your Vercel URL to allowed origins**

### 7. Update Supabase Auth Redirect URLs

1. **Go to Supabase Dashboard**
2. **Navigate to Authentication → URL Configuration**
3. **Add your Vercel URL to:**
   - Site URL: `https://artisy-app-xxx.vercel.app`
   - Redirect URLs: `https://artisy-app-xxx.vercel.app/**`

## Alternative: Deploy via Vercel CLI

If you prefer the command line:

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: artisy-app
# - Directory: ./ (press Enter)
# - Override build settings? N
```

After deployment, add environment variables:

```bash
# Add environment variables (do this for each variable)
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
# ... etc
```

Then redeploy:
```bash
vercel --prod
```

## Vercel Configuration File

The project includes a `vercel.json` that configures:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

This tells Vercel to:
- Build the API as a serverless function
- Route all `/api/*` requests to the backend
- Set NODE_ENV to production

## Testing Your Deployment

### 1. Test Frontend

Visit your Vercel URL and check:
- [ ] Homepage loads correctly
- [ ] Products display properly
- [ ] Navigation works
- [ ] Images load

### 2. Test API

Use curl or Postman:

```bash
# Health check
curl https://artisy-app-xxx.vercel.app/api/health

# Get products
curl https://artisy-app-xxx.vercel.app/api/products

# Get product by ID
curl https://artisy-app-xxx.vercel.app/api/products/1
```

### 3. Test Authentication

- [ ] Sign up with a new account
- [ ] Verify email (check inbox)
- [ ] Sign in
- [ ] Access protected pages

### 4. Test Shopping Flow

- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Proceed to checkout
- [ ] Complete payment (use test card: 4242 4242 4242 4242)
- [ ] Verify order appears in order history

### 5. Test Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook
3. View "Recent deliveries"
4. Verify events are being received (after test purchase)

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Solution: Run `npm install` locally and ensure package.json is up to date
- Commit and push changes

**Error: "Build exceeded maximum duration"**
- Solution: Upgrade Vercel plan or optimize build process

### Runtime Errors

**Error: "Environment variable not found"**
- Solution: Check all required env vars are set in Vercel dashboard
- Redeploy after adding variables

**API returns 500 errors**
- Solution: Check Vercel Function Logs (Deployments → Functions tab)
- Verify Supabase and Stripe credentials

### CORS Errors

**Error: "CORS policy blocked"**
- Solution: Update CORS configuration in `api/index.ts`:
  ```typescript
  app.use(cors({
    origin: process.env.VITE_SITE_URL,
    credentials: true
  }))
  ```

### Webhook Not Working

**Stripe events not received**
- Solution: 
  1. Verify webhook URL is correct
  2. Check webhook signing secret matches
  3. Test webhook from Stripe dashboard
  4. View Vercel Function Logs for errors

### Database Connection Issues

**Error: "Failed to connect to Supabase"**
- Solution:
  1. Verify Supabase URL and keys
  2. Check Supabase project is active
  3. Verify RLS policies allow service role access

## Domain Configuration (Optional)

### Add Custom Domain

1. **Go to Project Settings → Domains**
2. **Add your domain**: `yourdomain.com`
3. **Configure DNS**:
   - Type: `A`
   - Name: `@` or `www`
   - Value: (provided by Vercel)
4. **Wait for DNS propagation** (up to 48 hours)
5. **Update Environment Variables**:
   - Update `VITE_SITE_URL` to your custom domain
   - Update Stripe webhook URL
   - Update Supabase redirect URLs
6. **Redeploy**

## Monitoring and Maintenance

### Vercel Analytics

Enable Vercel Analytics for insights:
1. Go to Analytics tab
2. Click "Enable Analytics"

### View Logs

1. Go to Deployments tab
2. Click on latest deployment
3. Click "Functions" to see serverless function logs
4. Click "View Runtime Logs" for detailed logs

### Set Up Alerts (Pro Plan)

1. Go to Project Settings → Monitoring
2. Configure alerts for:
   - Build failures
   - Function errors
   - High response times

## Production Checklist

Before going live:

- [ ] All environment variables configured correctly
- [ ] Stripe webhook receiving events
- [ ] Test payment flow end-to-end
- [ ] Database tables created and populated
- [ ] RLS policies configured in Supabase
- [ ] Error handling tested
- [ ] Email verification working
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Switch to Stripe live keys (when ready)
- [ ] Update Supabase tier if needed

## Switching to Production Mode

When ready for real payments:

1. **Get Stripe Live Keys**
   - Go to Stripe Dashboard
   - Switch to "Live mode" toggle
   - Get live API keys from Developers → API keys

2. **Update Environment Variables**
   - Replace `VITE_STRIPE_PUBLISHABLE_KEY` with live publishable key
   - Replace `STRIPE_SECRET_KEY` with live secret key

3. **Update Webhook**
   - Create new webhook for live mode
   - Update `STRIPE_WEBHOOK_SECRET`

4. **Redeploy**

5. **Test with Small Transaction**
   - Use a real card (your own)
   - Verify payment processes correctly
   - Check order appears in database

## Support

If you encounter issues:

1. Check Vercel Function Logs
2. Review this deployment guide
3. Check API_README.md for API documentation
4. Create an issue in the GitHub repository

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Project GitHub Repository](https://github.com/your-repo)

## Summary

You should now have:
- ✅ Frontend deployed on Vercel
- ✅ Backend API running as serverless functions
- ✅ Database connected via Supabase
- ✅ Stripe payments integrated
- ✅ Webhooks configured and working
- ✅ Environment variables properly set

Congratulations! Your Artisy e-commerce platform is now live! 🎉
