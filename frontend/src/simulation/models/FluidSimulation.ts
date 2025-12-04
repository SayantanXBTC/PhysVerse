import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class FluidSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'fluid',
    name: 'Fluid Dynamics',
    description: 'Simplified fluid simulation with particle-based dynamics',
    category: 'Fluids',
    difficulty: 'advanced',
    tags: ['fluid', 'particles', 'viscosity', 'pressure']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    viscosity: {
      label: 'Viscosity',
      type: 'number',
      default: 0.5,
      min: 0.1,
      max: 2,
      step: 0.1,
      description: 'Fluid thickness'
    },
    particleCount: {
      label: 'Particle Count',
      type: 'number',
      default: 200,
      min: 50,
      max: 500,
      step: 50,
      description: 'Number of fluid particles'
    },
    pressure: {
      label: 'Pressure',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Internal pressure'
    }
  };

  private particles: THREE.Points | null = null;
  private velocities: THREE.Vector3[] = [];
  private geometry: THREE.BufferGeometry | null = null;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    const count = params.particleCount as number || 200;

    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 4 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const color = new THREE.Color(0x3b82f6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      this.velocities.push(new THREE.Vector3(0, 0, 0));
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });

    this.particles = new THREE.Points(this.geometry, material);
    scene.add(this.particles);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.particles || !this.geometry) return;

    const dt = Math.min(delta, 0.02);
    const viscosity = this.params.viscosity as number || 0.5;
    const pressure = this.params.pressure as number || 1;
    const positions = this.geometry.attributes.position.array as Float32Array;
    const gravity = 9.8;

    for (let i = 0; i < this.velocities.length; i++) {
      this.velocities[i].y -= gravity * dt;

      let forceX = 0, forceY = 0, forceZ = 0;

      for (let j = 0; j < this.velocities.length; j++) {
        if (i === j) continue;

        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 0.5 && dist > 0.01) {
          const force = pressure * (0.5 - dist) / dist;
          forceX += dx * force;
          forceY += dy * force;
          forceZ += dz * force;
        }
      }

      this.velocities[i].x += forceX * dt;
      this.velocities[i].y += forceY * dt;
      this.velocities[i].z += forceZ * dt;

      this.velocities[i].multiplyScalar(1 - viscosity * dt);

      positions[i * 3] += this.velocities[i].x * dt;
      positions[i * 3 + 1] += this.velocities[i].y * dt;
      positions[i * 3 + 2] += this.velocities[i].z * dt;

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 0;
        this.velocities[i].y *= -0.3;
      }

      const boundary = 6;
      if (Math.abs(positions[i * 3]) > boundary) {
        positions[i * 3] = Math.sign(positions[i * 3]) * boundary;
        this.velocities[i].x *= -0.5;
      }
      if (Math.abs(positions[i * 3 + 2]) > boundary) {
        positions[i * 3 + 2] = Math.sign(positions[i * 3 + 2]) * boundary;
        this.velocities[i].z *= -0.5;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  reset(): void {
    if (!this.geometry) return;

    const positions = this.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < this.velocities.length; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 4 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      this.velocities[i].set(0, 0, 0);
    }
    this.geometry.attributes.position.needsUpdate = true;
  }

  cleanup(): void {
    if (this.particles) {
      this.particles.parent?.remove(this.particles);
      this.geometry?.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
  }

  exportData(): unknown {
    return { particleCount: this.velocities.length };
  }
}
