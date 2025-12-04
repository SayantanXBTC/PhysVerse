# PhysVerse - Complete Installation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Install](#quick-install)
3. [Manual Installation](#manual-installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)
7. [Verification](#verification)

## Prerequisites

### Required Software
- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org))
- **npm** 9.0.0 or higher (comes with Node.js)
- **MongoDB** 6.0 or higher ([Download](https://www.mongodb.com/try/download/community))
  - OR MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/downloads))

### Verify Prerequisites
```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 9.0.0 or higher
git --version     # Should show git version
mongod --version  # Should show MongoDB version (if using local)
```

## Quick Install

### Option 1: Automated Setup (Recommended)

**Windows:**
```cmd
git clone https://github.com/yourusername/physverse.git
cd physverse
setup.bat
```

**macOS/Linux:**
```bash
git clone https://github.com/yourusername/physverse.git
cd physverse
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies
- Create environment files
- Set up the project structure

### Option 2: One-Command Install

```bash
git clone https://github.com/yourusername/physverse.git && cd physverse && cd backend && npm install && cd ../frontend && npm install && cd ..
```

## Manual Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/physverse.git
cd physverse
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

**Expected output:**
```
added 150 packages in 30s
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

**Expected output:**
```
added 300 packages in 45s
```

### Step 4: Return to Root
```bash
cd ..
```

## Configuration

### Backend Configuration

Create `backend/.env` file:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/physverse
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/physverse

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# CORS
FRONTEND_URL=http://localhost:5173
```

**Generate Secure JWT Secret:**
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# macOS/Linux
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Configuration

Create `frontend/.env` file:
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### MongoDB Setup

#### Option A: Local MongoDB

1. **Start MongoDB:**
   ```bash
   # Windows
   mongod

   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is running:**
   ```bash
   mongosh
   # Should connect successfully
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string
6. Update `MONGODB_URI` in `backend/.env`

## Running the Application

### Start Backend Server

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
🌍 Environment: development
✅ MongoDB connected successfully
```

### Start Frontend Server

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.0.11  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### Access Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9

# OR change port in backend/.env
PORT=5001
```

#### 2. MongoDB Connection Failed

**Error:**
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is installed
- Check firewall settings

#### 3. Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Verify `FRONTEND_URL` in `backend/.env` matches frontend URL
- Ensure no trailing slashes
- Restart backend server

#### 5. TypeScript Errors

**Error:**
```
TS2307: Cannot find module '@/types'
```

**Solution:**
```bash
# Check tsconfig.json paths are correct
# Restart TypeScript server in IDE
# Rebuild project
npm run build
```

#### 6. Environment Variables Not Loading

**Solution:**
- Ensure `.env` files exist (not `.env.example`)
- Check file names are exactly `.env`
- Restart servers after changing `.env`
- Verify no spaces around `=` in `.env`

### Platform-Specific Issues

#### Windows

**PowerShell Execution Policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Path Issues:**
```cmd
# Use backslashes in Windows paths
cd backend\src
```

#### macOS

**Permission Denied:**
```bash
chmod +x setup.sh
sudo chown -R $USER /usr/local/lib/node_modules
```

#### Linux

**MongoDB Service:**
```bash
sudo systemctl enable mongod
sudo systemctl start mongod
sudo systemctl status mongod
```

## Verification

### Backend Health Check

Visit: `http://localhost:5000/api/health`

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-04T10:30:00.000Z"
}
```

### Frontend Loading

Visit: `http://localhost:5173`

**Expected:**
- Landing page loads
- No console errors
- Smooth animations

### Database Connection

```bash
mongosh
use physverse
db.stats()
```

**Expected:**
- Database exists
- No connection errors

### Full System Test

1. **Register new user:**
   - Go to `/signup`
   - Create account
   - Should redirect to dashboard

2. **Create simulation:**
   - Click "New Simulation"
   - Choose type
   - Adjust parameters
   - Click play
   - Should see 3D animation

3. **Save simulation:**
   - Click "Save"
   - Should see success message
   - Should appear in dashboard

## Next Steps

After successful installation:

1. **Read Documentation:**
   - [README.md](README.md) - Overview
   - [QUICKSTART.md](QUICKSTART.md) - Quick guide
   - [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) - Development

2. **Explore Features:**
   - Create different simulation types
   - Adjust parameters
   - Save and share simulations
   - Browse public gallery

3. **Development:**
   - Review code structure
   - Check API documentation
   - Understand architecture
   - Start customizing

4. **Deployment:**
   - See [DEPLOYMENT.md](docs/DEPLOYMENT.md)
   - Deploy to Vercel/Render
   - Set up MongoDB Atlas
   - Configure production environment

## Getting Help

If you encounter issues:

1. **Check Documentation:**
   - Review this guide
   - Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
   - Read [FAQ.md](docs/FAQ.md)

2. **Search Issues:**
   - GitHub Issues
   - Stack Overflow
   - MongoDB documentation

3. **Ask for Help:**
   - Open GitHub issue
   - Provide error messages
   - Include environment details
   - Share relevant code

## System Requirements

### Minimum
- CPU: Dual-core 2.0 GHz
- RAM: 4 GB
- Storage: 500 MB
- Browser: Chrome 90+, Firefox 88+, Safari 14+

### Recommended
- CPU: Quad-core 2.5 GHz
- RAM: 8 GB
- Storage: 1 GB
- Browser: Latest Chrome, Firefox, or Edge

## Development Tools (Optional)

### Recommended IDE
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - MongoDB for VS Code
  - Thunder Client (API testing)

### Useful Tools
- **MongoDB Compass** - Database GUI
- **Postman** - API testing
- **React DevTools** - Browser extension
- **Redux DevTools** - Browser extension

## Success Checklist

- [ ] Node.js installed and verified
- [ ] MongoDB running (local or Atlas)
- [ ] Repository cloned
- [ ] Dependencies installed (backend)
- [ ] Dependencies installed (frontend)
- [ ] Environment files configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Application accessible in browser
- [ ] Health check passes
- [ ] Can register user
- [ ] Can create simulation
- [ ] 3D rendering works

## Congratulations! 🎉

You've successfully installed PhysVerse! Start creating amazing physics simulations.

---

**Need help?** Open an issue on GitHub or check the documentation.
