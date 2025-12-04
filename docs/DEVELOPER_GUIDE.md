# PhysVerse Developer Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas account)
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/physverse.git
cd physverse
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment variables**

Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/physverse
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Start development servers**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Project Structure

### Backend Structure
```
backend/src/
├── controllers/     # Business logic and request handling
├── models/          # Mongoose schemas and models
├── routes/          # Express route definitions
├── middleware/      # Custom middleware (auth, validation)
├── validators/      # Zod validation schemas
├── utils/           # Helper functions
├── config/          # Configuration files
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```

### Frontend Structure
```
frontend/src/
├── components/      # Reusable React components
├── pages/           # Page components (routes)
├── services/        # API service layer
├── store/           # State management (Zustand)
├── lib/             # Utilities and configurations
├── types/           # TypeScript type definitions
├── App.tsx          # Root component
└── main.tsx         # Application entry point
```

## Code Standards

### TypeScript
- Use strict mode
- Define explicit types for function parameters and returns
- Avoid `any` type unless absolutely necessary
- Use interfaces for object shapes
- Use enums for fixed sets of values

### React
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop typing
- Avoid inline styles (use Tailwind classes)

### Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase (e.g., `SimulationCanvas.tsx`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Interfaces**: PascalCase with `I` prefix (e.g., `IUser`)
- **Types**: PascalCase (e.g., `SimulationType`)

### Code Organization
- One component per file
- Group related files in folders
- Keep files under 300 lines
- Extract complex logic into separate functions
- Use barrel exports (index.ts) for cleaner imports

## Common Commands

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Adding a New Simulation Type

1. **Update types** (`frontend/src/types/index.ts`):
```typescript
export enum SimulationType {
  PROJECTILE = 'projectile',
  SPRING_MASS = 'spring-mass',
  TWO_BODY_ORBIT = 'two-body-orbit',
  NEW_SIMULATION = 'new-simulation'  // Add here
}
```

2. **Create simulation component** (`frontend/src/components/simulations/NewSimulation.tsx`):
```typescript
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  parameters: Record<string, any>;
  isRunning: boolean;
}

export default function NewSimulation({ parameters, isRunning }: Props) {
  // Implement physics and rendering
  return (
    <>
      {/* 3D objects */}
    </>
  );
}
```

3. **Add to SimulationCanvas** (`frontend/src/components/SimulationCanvas.tsx`):
```typescript
import NewSimulation from './simulations/NewSimulation';

// In render:
{type === SimulationType.NEW_SIMULATION && (
  <NewSimulation parameters={parameters} isRunning={isRunning} />
)}
```

4. **Add controls** (`frontend/src/components/SimulationControls.tsx`):
```typescript
// Add to select options
<option value={SimulationType.NEW_SIMULATION}>New Simulation</option>

// Add parameter controls
{type === SimulationType.NEW_SIMULATION && (
  <div className="space-y-4">
    {/* Parameter inputs */}
  </div>
)}
```

5. **Update backend validator** (`backend/src/validators/simulation.ts`):
```typescript
type: z.enum([
  SimulationType.PROJECTILE,
  SimulationType.SPRING_MASS,
  SimulationType.TWO_BODY_ORBIT,
  SimulationType.NEW_SIMULATION  // Add here
])
```

## API Integration

### Making API Calls

Use the service layer:
```typescript
// In a component
import { simulationService } from '@/services/simulationService';
import { useMutation } from '@tanstack/react-query';

const createMutation = useMutation({
  mutationFn: () => simulationService.create(name, type, parameters),
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  }
});
```

### Adding New Endpoints

1. **Create controller** (`backend/src/controllers/`):
```typescript
export const newEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    // Implementation
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Error message' });
  }
};
```

2. **Add route** (`backend/src/routes/`):
```typescript
router.get('/new-endpoint', authenticate, newEndpoint);
```

3. **Add to service** (`frontend/src/services/`):
```typescript
async newEndpoint(): Promise<Data> {
  const { data } = await api.get<{ data: Data }>('/new-endpoint');
  return data.data;
}
```

## Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Create simulation
- [ ] Edit simulation parameters
- [ ] Save simulation
- [ ] Delete simulation
- [ ] Toggle public/private
- [ ] View public gallery
- [ ] Run each simulation type
- [ ] Test on different browsers
- [ ] Test responsive design

### API Testing with cURL

Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Create simulation:
```bash
curl -X POST http://localhost:5000/api/simulations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test","type":"projectile","parameters":{"velocity":20,"angle":45,"gravity":9.8}}'
```

## Debugging

### Backend Debugging
- Check console logs in terminal
- Use `console.log()` for quick debugging
- Check MongoDB with MongoDB Compass
- Verify JWT tokens at jwt.io
- Use Postman/Insomnia for API testing

### Frontend Debugging
- Use React DevTools browser extension
- Check browser console for errors
- Use Network tab to inspect API calls
- Use React Query DevTools
- Check Three.js scene with browser DevTools

### Common Issues

**MongoDB connection failed:**
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access (if using Atlas)

**CORS errors:**
- Check FRONTEND_URL in backend .env
- Verify CORS configuration in backend

**JWT errors:**
- Check JWT_SECRET matches
- Verify token is being sent in headers
- Check token expiration

**3D rendering issues:**
- Check browser WebGL support
- Verify Three.js version compatibility
- Check console for Three.js warnings

## Performance Tips

### Frontend
- Limit trail lengths in simulations
- Use `useMemo` for expensive calculations
- Debounce parameter updates
- Optimize Three.js geometries
- Use proper React keys in lists

### Backend
- Add database indexes
- Use lean queries when possible
- Implement pagination for large datasets
- Cache frequently accessed data
- Use connection pooling

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Configure network access
3. Create database user
4. Get connection string
5. Update backend .env

## Contributing Guidelines

1. Create a feature branch
2. Make changes with clear commits
3. Test thoroughly
4. Update documentation
5. Submit pull request

## Resources

- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
