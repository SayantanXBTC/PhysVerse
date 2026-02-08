# Render Backend - CORS Fix Deployment

## The Issue
Your backend on Render is still running the OLD code without the CORS fix. You need to redeploy it.

## Solution: Update Render Environment Variables & Redeploy

### Step 1: Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Find and click on your `physverse-backend` service

### Step 2: Update Environment Variables
Click on **Environment** in the left sidebar, then add/update these variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://bhattacharjeesayantan86_db_user:zEWubEXHQCDhrDSc@cluster0.nchfe4r.mongodb.net/physverse?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
NODE_ENV=production
FRONTEND_URL=https://physsversee.netlify.app
```

**IMPORTANT:** Make sure there's NO trailing slash on `FRONTEND_URL`!

### Step 3: Trigger Manual Deploy
1. Go to **Manual Deploy** section (top right)
2. Click **Deploy latest commit**
3. Wait 3-5 minutes for deployment to complete

### Step 4: Verify Backend is Running
Open this URL in your browser:
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

### Step 5: Test CORS
After deployment completes:
1. Go to https://physsversee.netlify.app
2. Try to login
3. CORS error should be gone!

## Why This Happened

Your backend code was updated in GitHub, but Render needs to:
1. Pull the latest code from GitHub
2. Use the correct environment variables
3. Rebuild and restart the service

## Alternative: Enable Auto-Deploy

To avoid this in the future:
1. In Render dashboard, go to your service
2. Click **Settings**
3. Scroll to **Build & Deploy**
4. Make sure **Auto-Deploy** is set to **Yes**
5. Set branch to `main`

This way, every time you push to GitHub, Render will automatically redeploy.

## Quick Checklist

- [ ] Updated `FRONTEND_URL` environment variable (no trailing slash)
- [ ] Set `NODE_ENV=production`
- [ ] Triggered manual deploy
- [ ] Waited for deployment to complete (check logs)
- [ ] Verified `/api/health` endpoint works
- [ ] Tested login from Netlify site
- [ ] No more CORS errors!
