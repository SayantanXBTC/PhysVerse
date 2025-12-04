# PhysVerse Deployment Guide

## Overview

This guide covers deploying PhysVerse to production using:
- **Frontend**: Vercel
- **Backend**: Render or Railway
- **Database**: MongoDB Atlas

## Prerequisites

- GitHub account
- Vercel account
- Render or Railway account
- MongoDB Atlas account
- Domain name (optional)

## Database Setup (MongoDB Atlas)

### 1. Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click "Build a Database"
4. Choose "Shared" (free tier)
5. Select cloud provider and region
6. Name your cluster (e.g., "physverse-prod")
7. Click "Create Cluster"

### 2. Configure Network Access

1. Go to "Network Access" in sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### 3. Create Database User

1. Go to "Database Access" in sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and strong password
5. Set role to "Read and write to any database"
6. Click "Add User"

### 4. Get Connection String

1. Go to "Database" in sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your user password
6. Replace `<dbname>` with "physverse"

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/physverse?retryWrites=true&w=majority
```

## Backend Deployment (Render)

### 1. Prepare Repository

Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - **Name**: physverse-api
   - **Environment**: Node
   - **Region**: Choose closest to users
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. Set Environment Variables

Add these environment variables:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/physverse
JWT_SECRET=your-super-secret-production-key-min-32-chars
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Important**: Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://physverse-api.onrender.com`)

### 5. Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Backend Deployment (Railway - Alternative)

### 1. Create Project

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository

### 2. Configure Service

1. Select "backend" as root directory
2. Add environment variables (same as Render)
3. Railway will auto-detect Node.js

### 3. Deploy

Railway will automatically deploy on push to main branch.

## Frontend Deployment (Vercel)

### 1. Prepare Frontend

Update API URL for production in `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Or set it in Vercel dashboard.

### 2. Deploy to Vercel

#### Option A: Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### 3. Set Environment Variables

In Vercel project settings:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 4. Deploy

1. Click "Deploy"
2. Wait for deployment
3. Note your frontend URL (e.g., `https://physverse.vercel.app`)

### 5. Update Backend CORS

Update `FRONTEND_URL` in backend environment variables:
```
FRONTEND_URL=https://physverse.vercel.app
```

Redeploy backend if needed.

## Custom Domain (Optional)

### Vercel (Frontend)

1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### Render (Backend)

1. Go to service settings
2. Click "Custom Domain"
3. Add your API subdomain (e.g., api.yourdomain.com)
4. Configure DNS records

## Post-Deployment Checklist

- [ ] Backend health check responds
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Create simulation works
- [ ] Save simulation works
- [ ] Public gallery works
- [ ] 3D rendering works
- [ ] All simulation types work
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] CORS configured correctly

## Monitoring

### Render
- View logs in Render dashboard
- Set up health checks
- Configure alerts

### Vercel
- View deployment logs
- Monitor analytics
- Set up error tracking

### MongoDB Atlas
- Monitor database metrics
- Set up alerts for high usage
- Review slow queries

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url/api
```

## Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

1. Push to main branch
2. Service automatically rebuilds
3. New version goes live

### Preview Deployments

Vercel creates preview deployments for pull requests automatically.

## Troubleshooting

### Backend Issues

**Service won't start:**
- Check build logs
- Verify all dependencies installed
- Check environment variables

**Database connection fails:**
- Verify MongoDB URI
- Check network access settings
- Ensure database user exists

**CORS errors:**
- Verify FRONTEND_URL matches exactly
- Check CORS configuration
- Ensure no trailing slashes

### Frontend Issues

**API calls fail:**
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for errors

**Build fails:**
- Check for TypeScript errors
- Verify all dependencies installed
- Check build logs

**3D rendering issues:**
- Ensure WebGL is supported
- Check Three.js version
- Verify assets load correctly

## Scaling Considerations

### Database
- Upgrade to dedicated cluster for better performance
- Enable sharding for horizontal scaling
- Set up read replicas

### Backend
- Upgrade Render plan for more resources
- Enable auto-scaling
- Add Redis for caching
- Implement CDN for static assets

### Frontend
- Vercel automatically scales
- Enable edge caching
- Optimize bundle size
- Implement code splitting

## Security Best Practices

1. **Use strong secrets**
   - Generate random JWT_SECRET
   - Rotate secrets periodically

2. **Enable HTTPS**
   - Both Vercel and Render provide free SSL
   - Enforce HTTPS redirects

3. **Secure database**
   - Use strong passwords
   - Limit network access
   - Enable encryption at rest

4. **Rate limiting**
   - Already implemented in code
   - Consider adding Cloudflare

5. **Monitor logs**
   - Check for suspicious activity
   - Set up alerts

## Backup Strategy

### Database Backups
1. MongoDB Atlas provides automatic backups
2. Configure backup schedule
3. Test restore process

### Code Backups
- Code is in GitHub
- Tag releases
- Keep deployment history

## Cost Estimation

### Free Tier (Development)
- MongoDB Atlas: Free (512MB)
- Render: Free (750 hours/month)
- Vercel: Free (100GB bandwidth)

### Production (Estimated)
- MongoDB Atlas: $9-57/month
- Render: $7-25/month
- Vercel: Free-$20/month
- **Total**: ~$16-102/month

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Railway Documentation](https://docs.railway.app)
