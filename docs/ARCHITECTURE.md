# PhysVerse Architecture

## Overview

PhysVerse is built as a modern, scalable full-stack application following industry best practices and clean architecture principles.

## Technology Stack

### Frontend
- **React 18** - UI library with hooks and functional components
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **cannon-es** - Physics engine
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Architecture Patterns

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── SimulationCanvas.tsx
│   │   ├── SimulationControls.tsx
│   │   └── simulations/     # Simulation-specific components
│   │       ├── ProjectileSimulation.tsx
│   │       ├── SpringMassSimulation.tsx
│   │       └── TwoBodyOrbitSimulation.tsx
│   ├── pages/               # Route pages
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── SimulationEditorPage.tsx
│   │   └── PublicGalleryPage.tsx
│   ├── services/            # API service layer
│   │   ├── authService.ts
│   │   └── simulationService.ts
│   ├── store/               # Global state management
│   │   └── authStore.ts
│   ├── lib/                 # Utilities and configs
│   │   └── api.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
```

**Key Principles:**
- **Feature-based organization** - Related code grouped together
- **Separation of concerns** - UI, logic, and data layers separated
- **Composable components** - Small, reusable building blocks
- **Type safety** - Strong typing throughout
- **Predictable state** - Centralized state management

### Backend Architecture

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   └── simulationController.ts
│   ├── models/              # Database models
│   │   ├── User.ts
│   │   └── Simulation.ts
│   ├── routes/              # API routes
│   │   ├── auth.ts
│   │   ├── simulations.ts
│   │   └── public.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts
│   │   └── validate.ts
│   ├── validators/          # Zod schemas
│   │   ├── auth.ts
│   │   └── simulation.ts
│   ├── utils/               # Utility functions
│   │   └── jwt.ts
│   ├── config/              # Configuration
│   │   └── database.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── index.ts             # Application entry point
```

**Key Principles:**
- **Layered architecture** - Routes → Controllers → Services → Models
- **Middleware pattern** - Authentication, validation, error handling
- **Schema validation** - Input validation with Zod
- **Error handling** - Consistent error responses
- **Security first** - JWT, bcrypt, helmet, rate limiting

## Data Flow

### Authentication Flow
1. User submits credentials
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Frontend includes token in subsequent requests
7. Backend middleware validates token

### Simulation CRUD Flow
1. User creates/edits simulation
2. Frontend sends request with JWT token
3. Backend validates token and ownership
4. Backend performs database operation
5. Backend returns updated data
6. Frontend updates UI via React Query cache

### Real-time Simulation Flow
1. User adjusts parameters in controls
2. State updates trigger re-render
3. SimulationCanvas receives new parameters
4. Physics engine calculates next frame
5. Three.js renders updated scene
6. Process repeats at 60 FPS

## Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique, indexed),
  passwordHash: string,
  createdAt: Date
}
```

### Simulation Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed, ref: User),
  name: string,
  type: enum ['projectile', 'spring-mass', 'two-body-orbit'],
  parameters: Object,
  isPublic: boolean (indexed),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- User: email (unique)
- Simulation: userId, isPublic, createdAt
- Compound: (userId, createdAt), (isPublic, createdAt)

## Security Measures

1. **Authentication**
   - JWT tokens with expiration
   - Secure password hashing (bcrypt, 10 rounds)
   - Token validation middleware

2. **Authorization**
   - User can only access own simulations
   - Public simulations accessible to all
   - Protected routes on frontend and backend

3. **Input Validation**
   - Zod schemas for all inputs
   - Type checking with TypeScript
   - Sanitization of user data

4. **API Security**
   - Helmet for security headers
   - CORS configuration
   - Rate limiting (100 req/15min)
   - Error message sanitization

5. **Environment Variables**
   - Secrets stored in .env
   - Different configs for dev/prod
   - No hardcoded credentials

## Performance Optimizations

### Frontend
- Code splitting with React Router
- React Query caching
- Memoization of expensive calculations
- Efficient Three.js rendering
- Debounced parameter updates
- Trail length limits

### Backend
- Database indexing
- Connection pooling
- Efficient queries with projections
- Rate limiting to prevent abuse

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT tokens)
- Database can be sharded by userId
- Frontend served via CDN

### Vertical Scaling
- Efficient algorithms
- Optimized database queries
- Resource limits on simulations

## Deployment Architecture

```
┌─────────────┐
│   Vercel    │  Frontend (Static)
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────┐
│   Render    │  Backend API
└──────┬──────┘
       │
       │ MongoDB Protocol
       │
┌──────▼──────┐
│ MongoDB     │  Database
│   Atlas     │
└─────────────┘
```

## Design Decisions

### Why React Three Fiber?
- Declarative 3D graphics
- React component model
- Better performance than vanilla Three.js
- Easier state management

### Why MongoDB?
- Flexible schema for parameters
- Easy to scale
- Good for rapid development
- JSON-like documents

### Why JWT?
- Stateless authentication
- Scalable across servers
- Industry standard
- Easy to implement

### Why TypeScript?
- Type safety prevents bugs
- Better IDE support
- Self-documenting code
- Easier refactoring

### Why Zustand over Redux?
- Simpler API
- Less boilerplate
- Better TypeScript support
- Sufficient for our needs

## Future Enhancements

1. **Real-time Collaboration**
   - Socket.io integration
   - Shared simulation sessions
   - Live parameter updates

2. **Advanced Features**
   - Data export (CSV, JSON)
   - Graphs and charts
   - Custom simulation builder
   - Simulation templates

3. **Performance**
   - WebGL2 optimizations
   - Web Workers for physics
   - Progressive loading
   - Caching strategies

4. **Social Features**
   - Comments on simulations
   - Likes and favorites
   - User profiles
   - Simulation collections
