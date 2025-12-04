# PhysVerse Quick Start Guide

Get PhysVerse running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed

## Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/physverse.git
cd physverse

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/physverse
JWT_SECRET=your-secret-key-min-32-characters-long
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in backend/.env
```

### 4. Start Development Servers

**Terminal 1** - Backend:
```bash
cd backend
npm run dev
```

**Terminal 2** - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Open Application

Visit: http://localhost:5173

## First Steps

1. **Sign Up** - Create a new account
2. **Create Simulation** - Click "New Simulation" in dashboard
3. **Choose Type** - Select from projectile, spring-mass, or orbit
4. **Adjust Parameters** - Use the sidebar controls
5. **Run** - Click play to start the simulation
6. **Save** - Save your simulation to the cloud

## Troubleshooting

**MongoDB connection error:**
```bash
# Make sure MongoDB is running
mongod
```

**Port already in use:**
```bash
# Change PORT in backend/.env to different port
PORT=5001
```

**Module not found:**
```bash
# Reinstall dependencies
npm install
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for development details
- See [API.md](docs/API.md) for API documentation
- Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design

## Need Help?

- Check the documentation in `/docs`
- Open an issue on GitHub
- Review existing issues and PRs

Happy simulating! 🚀
