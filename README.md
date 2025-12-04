# PhysVerse — Modern 3D Physics Simulation Sandbox

A production-grade, real-time 3D physics simulation platform built with modern web technologies. Create, simulate, visualize, and share physics simulations directly in your browser.

## 🚀 Features

### Core Capabilities
- **Real-time 3D Physics**: WebGL-powered simulations using Three.js and cannon-es
- **Multiple Simulation Types**: Projectile motion, spring-mass systems, orbital mechanics
- **Cloud Persistence**: Save and manage simulations with MongoDB
- **Public Gallery**: Browse and clone community simulations
- **Responsive UI**: Modern, dark-themed interface with Tailwind CSS

### Authentication & Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### Simulation Management
- Create, edit, delete simulations
- Real-time parameter adjustment
- Public/private visibility controls
- Shareable simulation links

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- react-three-fiber (Three.js React renderer)
- cannon-es (physics engine)
- Tailwind CSS
- React Query (data fetching)
- Zustand (state management)

### Backend
- Node.js + Express + TypeScript
- JWT authentication
- Zod validation
- RESTful API design

### Database
- MongoDB + Mongoose
- MongoDB Atlas (cloud hosting)

### DevOps
- Git/GitHub
- Vercel (frontend)
- Render/Railway (backend)
- Environment-based configuration

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/physverse.git
cd physverse

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/physverse
JWT_SECRET=your-secret-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📚 Project Structure

```
physverse/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-based modules
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configs
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   └── types/          # TypeScript types
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   └── validators/     # Zod schemas
│   └── package.json
└── docs/                   # Documentation
```

## 🎮 Usage

1. **Sign Up**: Create an account at `/signup`
2. **Create Simulation**: Click "New Simulation" in dashboard
3. **Configure**: Adjust parameters using the sidebar controls
4. **Run**: Click play to start the simulation
5. **Save**: Save your simulation to the cloud
6. **Share**: Toggle public visibility to share with others

## 🔬 Simulation Types

### Projectile Motion
Simulate 3D projectile trajectories with gravity, initial velocity, and collision detection.

### Spring-Mass System
Visualize harmonic oscillation with Hooke's law, damping, and energy conservation.

### Two-Body Orbit
Explore Newtonian gravity with orbital mechanics and numerical integration.

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy from main branch

### Database (MongoDB Atlas)
1. Create cluster
2. Configure network access
3. Update connection string

## 📖 API Documentation

See [API.md](./docs/API.md) for complete endpoint documentation.

## 🏗️ Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for design decisions and patterns.

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your own use.

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Built as a demonstration of modern full-stack development practices.

## 🙏 Acknowledgments

- Three.js community
- cannon-es physics engine
- React Three Fiber team
