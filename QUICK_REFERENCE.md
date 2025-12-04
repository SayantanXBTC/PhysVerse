# PhysVerse - Quick Reference Guide

## 🚀 New Simulation Engine - Quick Start

### Architecture Overview

```
PhysicsSimulation (Interface)
    ↓
SimulationEngine (Manager)
    ↓
SimulationRegistry (Factory)
    ↓
Your Simulation (Implementation)
```

### Adding a New Simulation (5 Minutes)

**1. Create simulation file:**
```typescript
// frontend/src/simulation/models/YourSimulation.ts
import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class YourSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'your-sim',
    name: 'Your Simulation',
    description: 'What it does',
    category: 'Category',
    difficulty: 'beginner',
    tags: ['tag1', 'tag2']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    param1: {
      label: 'Parameter 1',
      type: 'number',
      default: 10,
      min: 0,
      max: 100,
      step: 1,
      description: 'What this parameter does'
    }
  };

  private mesh: THREE.Mesh | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    // Create 3D objects
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);
  }

  update(delta: number, state: SimulationState): void {
    // Physics calculations
    if (this.mesh) {
      this.mesh.rotation.y += delta;
    }
  }

  reset(): void {
    // Reset to initial state
    if (this.mesh) {
      this.mesh.rotation.set(0, 0, 0);
    }
  }

  cleanup(): void {
    // Dispose resources
    if (this.mesh) {
      this.mesh.parent?.remove(this.mesh);
      this.mesh.geometry.dispose();
      (this.mesh.material as THREE.Material).dispose();
      this.mesh = null;
    }
  }
}
```

**2. Register it:**
```typescript
// frontend/src/simulation/registry.ts
import { YourSimulation } from './models/YourSimulation';

// In constructor:
this.register('your-sim', () => new YourSimulation());
```

**Done!** UI auto-generates, engine handles everything.

## 📋 Parameter Types

### Number (Slider + Input)
```typescript
paramName: {
  label: 'Display Name',
  type: 'number',
  default: 10,
  min: 0,
  max: 100,
  step: 0.5,
  description: 'Optional description'
}
```

### Boolean (Toggle)
```typescript
paramName: {
  label: 'Enable Feature',
  type: 'boolean',
  default: true,
  description: 'Optional description'
}
```

### Select (Dropdown)
```typescript
paramName: {
  label: 'Choose Option',
  type: 'select',
  default: 'option1',
  options: ['option1', 'option2', 'option3'],
  description: 'Optional description'
}
```

### Vector (X, Y, Z inputs)
```typescript
paramName: {
  label: 'Position',
  type: 'vector',
  default: new THREE.Vector3(0, 0, 0),
  description: 'Optional description'
}
```

## 🎨 Using the Engine

### In a Component
```typescript
import { simulationRegistry } from '@/simulation/registry';
import SimulationCanvas from '@/components/SimulationCanvas';

function MyComponent() {
  const [simulationId, setSimulationId] = useState('projectile');
  const [parameters, setParameters] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  return (
    <SimulationCanvas
      simulationId={simulationId}
      parameters={parameters}
      isRunning={isRunning}
    />
  );
}
```

### With Dynamic Controls
```typescript
import DynamicParameterControls from '@/simulation/ui/DynamicParameterControls';

const simulation = simulationRegistry.create(simulationId);

<DynamicParameterControls
  parameters={simulation.parameters}
  values={parameters}
  onChange={(key, value) => setParameters({...parameters, [key]: value})}
  disabled={isRunning}
/>
```

## 🔧 Common Patterns

### Accessing Parameters
```typescript
initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
  const velocity = params.velocity as number || 10;
  const enabled = params.enabled as boolean || false;
  // Use parameters
}
```

### Managing State
```typescript
private position: THREE.Vector3 = new THREE.Vector3();
private velocity: THREE.Vector3 = new THREE.Vector3();

update(delta: number, state: SimulationState): void {
  // Use state.time for time-based calculations
  // Use state.isPaused to check if paused
  // Store custom data in state.data
}
```

### Creating Trails
```typescript
private trail: THREE.Vector3[] = [];
private trailLine: THREE.Line | null = null;

update(delta: number, state: SimulationState): void {
  this.trail.push(this.position.clone());
  
  if (this.trail.length > 200) {
    this.trail.shift(); // Limit trail length
  }
  
  this.updateTrail(scene);
}

private updateTrail(scene: THREE.Scene): void {
  if (this.trailLine) {
    scene.remove(this.trailLine);
    this.trailLine.geometry.dispose();
  }
  
  const geometry = new THREE.BufferGeometry().setFromPoints(this.trail);
  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  this.trailLine = new THREE.Line(geometry, material);
  scene.add(this.trailLine);
}
```

### Proper Cleanup
```typescript
cleanup(): void {
  // Remove from scene
  if (this.mesh) {
    this.mesh.parent?.remove(this.mesh);
  }
  
  // Dispose geometries
  this.mesh?.geometry.dispose();
  
  // Dispose materials
  if (this.mesh?.material) {
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach(m => m.dispose());
    } else {
      this.mesh.material.dispose();
    }
  }
  
  // Clear references
  this.mesh = null;
}
```

## 📚 Available Simulations

### Projectile Motion
```typescript
simulationRegistry.create('projectile')
```
Parameters: velocity, angle, gravity

### Spring-Mass System
```typescript
simulationRegistry.create('spring-mass')
```
Parameters: mass, springConstant, damping, displacement

### Two-Body Orbit
```typescript
simulationRegistry.create('two-body-orbit')
```
Parameters: mass1, mass2, distance, velocity

## 🎯 Best Practices

### 1. Always Cleanup
```typescript
cleanup(): void {
  // Dispose ALL Three.js resources
  // Clear ALL references
  // Remove ALL event listeners
}
```

### 2. Limit Trail Length
```typescript
if (this.trail.length > 200) {
  this.trail.shift();
}
```

### 3. Clamp Delta Time
```typescript
update(delta: number, state: SimulationState): void {
  const dt = Math.min(delta, 0.1); // Prevent huge jumps
  // Use dt for calculations
}
```

### 4. Use Proper Types
```typescript
// Good
const velocity = params.velocity as number || 10;

// Bad
const velocity = params.velocity || 10; // Type unknown
```

### 5. Handle Edge Cases
```typescript
if (distance < 0.1) return; // Prevent division by zero
if (!this.mesh) return; // Check null
```

## 🐛 Troubleshooting

### Simulation Not Showing
- Check simulation ID matches registry
- Verify `initialize()` adds objects to scene
- Check browser console for errors

### Parameters Not Working
- Verify parameter schema is correct
- Check parameter types match usage
- Ensure `onChange` updates state

### Performance Issues
- Limit trail length
- Reduce geometry complexity
- Use `BufferGeometry` instead of `Geometry`
- Dispose unused resources

### Memory Leaks
- Always implement `cleanup()`
- Dispose all geometries and materials
- Remove all scene objects
- Clear all references

## 📞 Quick Commands

```bash
# Install dependencies
npm install react-hot-toast

# Run development
npm run dev

# Type check
npm run type-check

# Build
npm run build
```

## 🎓 Learning Path

1. **Study** `ProjectileSimulation.ts` - Complete reference
2. **Copy** as template for new simulation
3. **Modify** parameters and physics
4. **Register** in registry
5. **Test** in browser

## 💡 Pro Tips

- Use `console.log(state.time)` to debug timing
- Add `exportData()` for data analysis
- Use `getState()` for custom state
- Implement `exportData()` for CSV export
- Add metadata tags for searchability

---

**Everything you need to extend PhysVerse!** 🚀
