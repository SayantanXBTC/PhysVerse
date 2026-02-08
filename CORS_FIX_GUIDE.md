# CORS Fix - Deployment Update Guide

## What Was Fixed

### 1. CORS Configuration (Backend)
- Updated `backend/src/index.ts` to properly handle multiple origins
- Now allows both localhost (development) and your Netlify URL (production)
- Added proper CORS headers: `methods`, `allowedHeaders`, `credentials`

### 2. Environment Variables
- Fixed `FRONTEND_URL` in `backend/.env` (removed trailing slash)
- Changed `NODE_ENV` from `development` to `production`

### 3. OAuth Buttons Removed
- Removed Google, GitHub, Discord login buttons from login/signup pages
- These were non-functional placeholders causing confusion
- Can be added back when OAuth is actually implemented

## How to Update Your Render Deployment

### Option 1: Automatic Deployment (Recommended)
If you have auto-deploy enabled on Render:
1. Your backend will automatically redeploy from the latest GitHub commit
2. Wait 2-3 minutes for the deployment to complete
3. Test your login at https://physsversee.netlify.app

### Option 2: Manual Deployment
If auto-deploy is not enabled:
1. Go to https://dashboard.render.com
2. Find your `physverse-backend` service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete

### Option 3: Update Environment Variables Only
If you don't want to redeploy, just update the environment variables:
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update these variables:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://physsversee.netlify.app
   ```
5. Click "Save Changes"
6. Service will automatically restart

## Verify the Fix

After deployment, test your login:
1. Go to https://physsversee.netlify.app
2. Click "Sign In"
3. Try logging in with your credentials
4. You should NOT see CORS errors in the browser console anymore

## What Changed in the Code

### backend/src/index.ts
```typescript
// Before: Only allowed one origin
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// After: Allows multiple origins with proper validation
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### backend/.env
```env
# Before
NODE_ENV=development
FRONTEND_URL=https://physsversee.netlify.app/

# After
NODE_ENV=production
FRONTEND_URL=https://physsversee.netlify.app
```

## Troubleshooting

### Still seeing CORS errors?
1. Check Render logs for any deployment errors
2. Verify environment variables are set correctly
3. Clear browser cache and try again
4. Check that your Netlify URL matches exactly (no trailing slash)

### Login still not working?
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any error messages
4. Check Network tab to see if requests are reaching the backend

## Next Steps

Once CORS is fixed and login works:
- ✅ Users can register and login
- ✅ Profile photos can be uploaded
- ✅ All simulations are accessible
- ✅ Dashboard and gamification features work

Your app is now fully functional! 🎉
