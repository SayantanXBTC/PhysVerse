import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class ParticleSystemSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'particle-system',
    name: 'Particle System',
    description: 'Interactive particle system with gravity and collision dynamics',
    category: 'Particles',
    difficulty: 'intermediate',
    tags: ['particles', 'gravity', 'collision', 'dynamics']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    particleCount: {
      label: 'Particle Count',
      type: 'number',
      default: 100,
      min: 10,
      max: 500,
      step: 10,
      description: 'Number of particles'
    },
    gravity: {
      label: 'Gravity',
      type: 'number',
      default: 5,
      min: 0,
      max: 20,
      step: 0.5,
      description: 'Gravitational acceleration'
    },
    bounce: {
      label: 'Bounce Factor',
      type: 'number',
      default: 0.7,
      min: 0,
      max: 1,
      step: 0.05,
      description: 'Energy retained on bounce'
    },
    spread: {
      label: 'Initial Spread',
      type: 'number',
      default: 5,
      min: 1,
      max: 10,
      step: 0.5,
      description: 'Initial velocity spread'
    }
  };

  private particles: THREE.Points | null = null;
  private velocities: THREE.Vector3[] = [];
  private params: Record<string, unknown> = {};
  private geometry: THREE.BufferGeometry | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    const count = params.particleCount as number || 100;

    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.velocities = [];

    const spread = params.spread as number || 5;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 3 + 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      this.velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        Math.random() * spread,
        (Math.random() - 0.5) * spread
      ));
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.particles = new THREE.Points(this.geometry, material);
    scene.add(this.particles);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.particles || !this.geometry) return;

    const dt = Math.min(delta, 0.05);
    const gravity = this.params.gravity as number || 5;
    const bounce = this.params.bounce as number || 0.7;
    const positions = this.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < this.velocities.length; i++) {
      this.velocities[i].y -= gravity * dt;

      positions[i * 3] += this.velocities[i].x * dt;
      positions[i * 3 + 1] += this.velocities[i].y * dt;
      positions[i * 3 + 2] += this.velocities[i].z * dt;

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 0;
        this.velocities[i].y *= -bounce;
      }

      const radius = 8;
      if (Math.abs(positions[i * 3]) > radius) {
        positions[i * 3] = Math.sign(positions[i * 3]) * radius;
        this.velocities[i].x *= -bounce;
      }
      if (Math.abs(positions[i * 3 + 2]) > radius) {
        positions[i * 3 + 2] = Math.sign(positions[i * 3 + 2]) * radius;
        this.velocities[i].z *= -bounce;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  reset(): void {
    if (!this.geometry) return;

    const positions = this.geometry.attributes.position.array as Float32Array;
    const spread = this.params.spread as number || 5;

    for (let i = 0; i < this.velocities.length; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 3 + 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      this.velocities[i].set(
        (Math.random() - 0.5) * spread,
        Math.random() * spread,
        (Math.random() - 0.5) * spread
      );
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  cleanup(): void {
    if (this.particles) {
      this.particles.parent?.remove(this.particles);
      this.geometry?.dispose();
      (this.particles.material as THREE.Material).dispose();
      this.particles = null;
      this.geometry = null;
    }
  }

  exportData(): unknown {
    return {
      particleCount: this.velocities.length
    };
  }
}
