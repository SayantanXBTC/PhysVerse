# PhysVerse — Modern 3D Physics Simulation Sandbox

A production-grade, real-time 3D physics simulation platform built with modern web technologies. Create, simulate, visualize, and share physics simulations directly in your browser.



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

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Git


1. **Sign Up**: Create an account at `/signup`
2. **Create Simulation**: Click "New Simulation" in dashboard
3. **Configure**: Adjust parameters using the sidebar controls
4. **Run**: Click play to start the simulation
5. **Save**: Save your simulation to the cloud
6. **Share**: Toggle public visibility to share with others

##  Simulation Types

### Projectile Motion
Simulate 3D projectile trajectories with gravity, initial velocity, and collision detection.

### Spring-Mass System
Visualize harmonic oscillation with Hooke's law, damping, and energy conservation.

### Two-Body Orbit
Explore Newtonian gravity with orbital mechanics and numerical integration.

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy from main branch

### Database (MongoDB Atlas)
1. Create cluster
2. Configure network access
3. Update connection string

