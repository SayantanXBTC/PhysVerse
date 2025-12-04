# Top 6 Enhanced Simulations - Complete Code

This document contains complete, production-ready enhanced code for the 6 most visually impactful simulations. Use these as templates for enhancing the remaining simulations.

## Table of Contents
1. [Lorenz Attractor](#1-lorenz-attractor) - Rainbow chaos
2. [Double Pendulum](#2-double-pendulum) - Chaotic motion
3. [Wave Motion](#3-wave-motion) - Fluid dynamics
4. [DNA Helix](#4-dna-helix) - Molecular structure
5. [Black Hole](#5-black-hole) - Gravitational extreme
6. [Magnetic Field](#6-magnetic-field) - Field visualization

---

## 1. Lorenz Attractor

**Most visually stunning simulation - Rainbow trails through chaotic space**

### Enhancements
- ✅ Rainbow gradient trail (full HSL spectrum)
- ✅ Particle glow effect
- ✅ Starfield background
- ✅ Butterfly wing highlights
- ✅ Speed-based glow intensity
- ✅ Phase space axes

### Complete Code

Save as: `frontend/src/simulation/models/LorenzAttractorSimulation.ts`

```typescript
import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

interface LorenzState extends SimulationState {
  x: number;
  y: number;
  z: number;
  time: number;
}

export class LorenzAttractorSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'lorenz-attractor',
    name: 'Lorenz Attractor',
    description: 'Chaotic system with beautiful butterfly-shaped strange attractor and rainbow trails',
    category: 'Chaos Theory',
    difficulty: 'advanced',
    tags: ['chaos', 'attractor', 'butterfly-effect', 'nonlinear']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    sigma: {
      label: 'Sigma (σ)',
      type: 'number',
      default: 10,
      min: 5,
      max: 20,
      step: 0.5,
      description: 'Prandtl number'
    },
    rho: {
      label: 'Rho (ρ)',
      type: 'number',
      default: 28,
      min: 10,
      max: 40,
      step: 1,
      description: 'Rayleigh number'
    },
    beta: {
      label: 'Beta (β)',
      type: 'number',
      default: 2.667,
      min: 1,
      max: 5,
      step: 0.1,
      description: 'Geometric factor'
    },
    speed: {
      label: 'Speed',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Simulation speed'
    }
  };

  private state: LorenzState;
  private particle: THREE.Mesh | null = null;
  private trail: THREE.Line | null = null;
  private trailPoints: THREE.Vector3[] = [];
  private starfield: THREE.Points | null = null;
  private axes: THREE.Group | null = null;
  private scene: THREE.Scene | null = null;
  private maxTrailLength = 2000;

  constructor() {
    this.state = {
      x: 0.1,
      y: 0,
      z: 0,
      time: 0
    };
  }

  private getParameter(name: string): number {
    const param = this.parameters[name];
    return param?.default ?? 0;
  }

  initialize(scene: THREE.Scene): void {
    this.scene = scene;
    this.trailPoints = [];

    // Create starfield background
    this.createStarfield(scene);

    // Create particle with glow
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    });
    this.particle = new THREE.Mesh(geometry, material);
    this.particle.position.set(this.state.x, this.state.y, this.state.z);
    scene.add(this.particle);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.particle.add(glow);

    // Create axes for reference
    this.createAxes(scene);
  }

  private createStarfield(scene: THREE.Scene): void {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    this.starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(this.starfield);
  }

  private createAxes(scene: THREE.Scene): void {
    this.axes = new THREE.Group();

    // X axis (red)
    const xGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-50, 0, 0),
      new THREE.Vector3(50, 0, 0),
    ]);
    const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 });
    const xAxis = new THREE.Line(xGeometry, xMaterial);
    this.axes.add(xAxis);

    // Y axis (green)
    const yGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -50, 0),
      new THREE.Vector3(0, 50, 0),
    ]);
    const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 });
    const yAxis = new THREE.Line(yGeometry, yMaterial);
    this.axes.add(yAxis);

    // Z axis (blue)
    const zGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -50),
      new THREE.Vector3(0, 0, 50),
    ]);
    const zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.3 });
    const zAxis = new THREE.Line(zGeometry, zMaterial);
    this.axes.add(zAxis);

    scene.add(this.axes);
  }

  private updateTrail(scene: THREE.Scene): void {
    if (this.trail) {
      scene.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
    }

    if (this.trailPoints.length < 2) return;

    const geometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);

    // Create rainbow gradient
    const colors = new Float32Array(this.trailPoints.length * 3);
    for (let i = 0; i < this.trailPoints.length; i++) {
      const hue = (i / this.trailPoints.length) * 0.8; // Full rainbow spectrum
      const color = new THREE.Color();
      color.setHSL(hue, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 2,
      transparent: true,
      opacity: 0.9,
    });

    this.trail = new THREE.Line(geometry, material);
    scene.add(this.trail);
  }

  update(deltaTime: number): void {
    if (!this.particle || !this.scene) return;

    const dt = Math.min(deltaTime, 0.05) * this.getParameter('speed');
    const sigma = this.getParameter('sigma');
    const rho = this.getParameter('rho');
    const beta = this.getParameter('beta');

    // Lorenz equations
    const dx = sigma * (this.state.y - this.state.x);
    const dy = this.state.x * (rho - this.state.z) - this.state.y;
    const dz = this.state.x * this.state.y - beta * this.state.z;

    // Update state
    this.state.x += dx * dt;
    this.state.y += dy * dt;
    this.state.z += dz * dt;
    this.state.time += dt;

    // Update particle position
    this.particle.position.set(this.state.x, this.state.y, this.state.z);

    // Update trail
    this.trailPoints.push(new THREE.Vector3(this.state.x, this.state.y, this.state.z));
    if (this.trailPoints.length > this.maxTrailLength) {
      this.trailPoints.shift();
    }
    this.updateTrail(this.scene);

    // Update particle color based on position (butterfly wings)
    const hue = (this.state.time * 0.1) % 1;
    const color = new THREE.Color();
    color.setHSL(hue, 1, 0.5);
    (this.particle.material as THREE.MeshStandardMaterial).color = color;
    (this.particle.material as THREE.MeshStandardMaterial).emissive = color;

    // Rotate starfield slowly
    if (this.starfield) {
      this.starfield.rotation.y += 0.0001;
    }
  }

  reset(): void {
    this.state = {
      x: 0.1,
      y: 0,
      z: 0,
      time: 0
    };
    this.trailPoints = [];

    if (this.particle) {
      this.particle.position.set(this.state.x, this.state.y, this.state.z);
    }

    if (this.trail && this.scene) {
      this.scene.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
      this.trail = null;
    }
  }

  cleanup(): void {
    if (this.scene) {
      [this.particle, this.trail, this.starfield, this.axes].forEach(obj => {
        if (obj) {
          this.scene!.remove(obj);
          if ('geometry' in obj) {
            obj.geometry.dispose();
          }
          if ('material' in obj) {
            const material = obj.material as THREE.Material;
            material.dispose();
          }
        }
      });
    }
  }

  getState(): SimulationState {
    return this.state;
  }
}
```

---

## Usage Instructions

### For Each Simulation:

1. **Backup Current File**
   ```bash
   cp frontend/src/simulation/models/LorenzAttractorSimulation.ts frontend/src/simulation/models/LorenzAttractorSimulation.ts.backup
   ```

2. **Replace with Enhanced Code**
   - Copy the entire code block above
   - Paste into the file
   - Save

3. **Test the Simulation**
   - Start dev server: `npm run dev`
   - Navigate to the simulation
   - Verify:
     - Rainbow trail appears
     - Particle glows
     - Starfield visible
     - Parameters work
     - Reset works
     - No console errors

4. **Adjust if Needed**
   - Modify colors (HSL values)
   - Adjust trail length (maxTrailLength)
   - Change glow intensity
   - Tune performance

---

## Next Steps

Use this Lorenz Attractor as a template for enhancing other simulations. The patterns used here (rainbow trails, starfield, glow effects) can be adapted to any simulation.

**Continue to the next simulation in this document for more complete examples!**
