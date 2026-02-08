# Netlify Environment Variable Fix

## The Problem
Your frontend is calling the wrong URL:
- ❌ Current: `https://physverse-backend.onrender.com/auth/login`
- ✅ Should be: `https://physverse-backend.onrender.com/api/auth/login`

The `/api/` prefix is missing!

## The Solution

### Option 1: Update Netlify Environment Variable (Recommended)

1. Go to https://app.netlify.com
2. Select your site: `physsversee`
3. Go to **Site settings** → **Environment variables**
4. Look for `VITE_API_URL`
5. If it exists, update it to:
   ```
   VITE_API_URL=https://physverse-backend.onrender.com/api
   ```
6. If it doesn't exist, click **Add a variable**:
   - Key: `VITE_API_URL`
   - Value: `https://physverse-backend.onrender.com/api`
7. Click **Save**
8. Go to **Deploys** tab
9. Click **Trigger deploy** → **Clear cache and deploy site**

### Option 2: Redeploy from GitHub (After pushing changes)

I've updated your `.env.production` file. Now:

1. Push the changes to GitHub (I'll do this for you)
2. Netlify will automatically redeploy
3. The new environment variable will be used

## Verification

After redeployment, check:
1. Open https://physsversee.netlify.app
2. Open DevTools (F12) → Network tab
3. Try to login
4. Check the request URL - it should now be:
   ```
   https://physverse-backend.onrender.com/api/auth/login
   ```

## Why This Happened

Netlify builds use `.env.production` file OR environment variables set in Netlify dashboard. The placeholder value wasn't updated during deployment.

## Quick Test

You can test if the backend is working by visiting:
```
https://physverse-backend.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-02-08T..."
}
```
