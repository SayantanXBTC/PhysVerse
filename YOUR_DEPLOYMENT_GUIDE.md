#  Your Simplified Deployment Guide

Since you already have MongoDB set up, here's your streamlined deployment order:

---

##  What You Already Have

- MongoDB Atlas cluster 
- MongoDB URI in backend/.env 
- Code pushed to GitHub 

---

##  Your Deployment Order

```
Step 1: Deploy Frontend to Netlify (Get URL)
   
Step 2: Update Backend .env with Netlify URL
   
Step 3: Deploy Backend to Render
   
Step 4: Update Frontend .env with Render URL
   
Step 5: Redeploy Frontend to Netlify
```

---

## Step 1: Deploy Frontend to Netlify (First)

### Why First?
You need the Netlify URL to put in backend FRONTEND_URL environment variable for CORS.

### Instructions:

1. **Go to Netlify**
   - Visit: https://app.netlify.com
   - Sign in with GitHub

2. **Create New Site**
   - Click "Add new site"  "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your PhysVerse repository

3. **Configure Build**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Add Environment Variables**
   - Click "Show advanced"  "New variable"
   - Add TEMPORARY backend URL (we'll update this later):
   ```
   VITE_API_URL=https://physverse-backend.onrender.com/api
   VITE_APP_NAME=PhysVerse
   ```
   (Use a placeholder for now, we'll update after Render deployment)

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes

6. **Copy Your Netlify URL**
   - You'll get something like: `https://sparkly-unicorn-123456.netlify.app`
   - **SAVE THIS URL!** You need it for Step 2

---

## Step 2: Update Backend Environment Variables

### Update Your Local Backend .env

1. **Open:** `backend/.env`

2. **Update FRONTEND_URL:**
   ```env
   FRONTEND_URL=https://your-actual-netlify-url.netlify.app
   ```
   (Replace with your actual Netlify URL from Step 1)

3. **Verify All Variables Are Set:**
   ```env
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=mongodb+srv://... (your existing URI)
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=noreply@physverse.com
   FRONTEND_URL=https://your-netlify-url.netlify.app
   ```

4. **Commit and Push:**
   ```bash
   git add backend/.env
   git commit -m "Update FRONTEND_URL for production"
   git push origin main
   ```

---

## Step 3: Deploy Backend to Render

1. **Go to Render**
   - Visit: https://dashboard.render.com
   - Sign in with GitHub

2. **Create Web Service**
   - Click "New +"  "Web Service"
   - Connect your GitHub repository
   - Select PhysVerse

3. **Configure Service**
   ```
   Name: physverse-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free (or Starter $7/month)
   ```

4. **Add Environment Variables**
   
   Copy these from your `backend/.env` file:
   
   ```
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=[your existing MongoDB URI]
   JWT_SECRET=[your JWT secret]
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=[your email]
   EMAIL_PASS=[your Gmail app password]
   EMAIL_FROM=noreply@physverse.com
   FRONTEND_URL=[your Netlify URL from Step 1]
   ```

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Watch logs for: " MongoDB connected successfully"

6. **Copy Your Render URL**
   - You'll get: `https://physverse-backend-xxxx.onrender.com`
   - **SAVE THIS URL!** You need it for Step 4

7. **Test Backend**
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should see: `{"status":"ok",...}`

---

## Step 4: Update Frontend Environment Variables

### Update Netlify Environment Variables

1. **Go to Netlify Dashboard**
   - Click on your site
   - Go to "Site settings"  "Environment variables"

2. **Update VITE_API_URL**
   - Find `VITE_API_URL`
   - Click "Edit"
   - Update to your actual Render URL:
   ```
   VITE_API_URL=https://your-actual-backend.onrender.com/api
   ```
   - Click "Save"

---

## Step 5: Redeploy Frontend

1. **Trigger Redeploy**
   - In Netlify, go to "Deploys"
   - Click "Trigger deploy"  "Deploy site"
   - Or just push a small change to GitHub

2. **Wait for Build**
   - Takes 2-3 minutes
   - Check deploy log for success

---

##  Final Testing

### Test 1: Frontend Loads
- Visit your Netlify URL
- Page should load without errors
- Open Console (F12) - no errors

### Test 2: Backend Connection
- Click "Try It Now - Free!"
- Fill registration form
- Submit
- Should successfully create account

### Test 3: Full Flow
1. Sign up with test account
2. Verify you can log in
3. Check landing page shows "Welcome, [Name]"
4. Try a simulation
5. Upload profile photo
6. Sign out and sign back in

### Test 4: Check CORS
- Open Console (F12)
- Should see NO CORS errors
- API calls should succeed

---

##  Quick Reference

### Your URLs

```
Frontend (Netlify):
https://your-site.netlify.app

Backend (Render):
https://your-backend.onrender.com

API Health Check:
https://your-backend.onrender.com/api/health

MongoDB:
Already configured 
```

### Environment Variables Summary

**Backend (Render):**
```
NODE_ENV=production
PORT=5001
MONGODB_URI=[your existing URI]
JWT_SECRET=[your secret]
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[your email]
EMAIL_PASS=[your app password]
EMAIL_FROM=noreply@physverse.com
FRONTEND_URL=[your Netlify URL]
```

**Frontend (Netlify):**
```
VITE_API_URL=[your Render URL]/api
VITE_APP_NAME=PhysVerse
```

---

##  Common Issues

### Issue: CORS Error
**Symptom:** Console shows "CORS policy" error

**Fix:**
1. Check FRONTEND_URL in Render matches Netlify URL exactly
2. No trailing slash
3. Redeploy backend after fixing

### Issue: Can't Connect to Backend
**Symptom:** "Failed to fetch" errors

**Fix:**
1. Check VITE_API_URL in Netlify
2. Must end with `/api`
3. Redeploy frontend after fixing

### Issue: MongoDB Connection Failed
**Symptom:** Backend logs show "MongoError"

**Fix:**
1. Verify MongoDB URI is correct in Render
2. Check IP whitelist includes 0.0.0.0/0
3. Test connection string locally first

---

##  Deployment Checklist

- [ ] Step 1: Frontend deployed to Netlify
- [ ] Step 1: Netlify URL copied
- [ ] Step 2: Backend .env updated with Netlify URL
- [ ] Step 3: Backend deployed to Render
- [ ] Step 3: All environment variables added to Render
- [ ] Step 3: Render URL copied
- [ ] Step 4: Netlify environment variables updated with Render URL
- [ ] Step 5: Frontend redeployed
- [ ] Test: Registration works
- [ ] Test: Login works
- [ ] Test: Simulations work
- [ ] Test: No CORS errors

---

##  Done!

When all tests pass, your app is live!

**Total Time:** ~25 minutes

**Cost:** $0-7/month (Free tier or Render Starter)

---

**Need Help?**
- Check the troubleshooting section above
- Review Render/Netlify logs
- Test locally first if issues persist
