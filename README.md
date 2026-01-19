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
- Vitest (testing framework)

### Backend
- Node.js + Express + TypeScript
- JWT authentication
- Zod validation
- RESTful API design
- Jest (testing framework)
- Winston (logging)

### Database
- MongoDB + Mongoose
- MongoDB Atlas (cloud hosting)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Vercel (frontend)
- Render/Railway (backend)
- Environment-based configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd PhySSS
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Environment Configuration**
```bash
# Backend (.env)
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Frontend (.env)
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URL
```

4. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Docker Setup (Alternative)

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test          # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run with coverage
```

### Backend Tests
```bash
cd backend
npm run test          # Run tests
npm run test:watch    # Run in watch mode
npm run test:coverage # Run with coverage
```

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm run build
npm start       # Start production server
```

## 🔧 Development Tools

- **Type Checking**: `npm run type-check`
- **Linting**: `npm run lint`
- **Performance Monitoring**: Built-in logging and metrics
- **Hot Reload**: Automatic reload on file changes

## 📚 API Documentation

The API follows RESTful conventions. Key endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/simulations` - Get user simulations
- `POST /api/simulations` - Create simulation
- `GET /api/public/simulations` - Browse public gallery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

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
