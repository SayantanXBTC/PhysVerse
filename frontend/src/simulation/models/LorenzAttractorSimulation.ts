import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class LorenzAttractorSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'lorenz-attractor',
    name: 'Lorenz Attractor (Chaos)',
    description: 'Beautiful chaotic system forming butterfly-shaped strange attractor',
    category: 'Chaos',
    difficulty: 'advanced',
    tags: ['chaos', 'attractor', 'butterfly', 'nonlinear']
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
      max: 50,
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
    trailLength: {
      label: 'Trail Length',
      type: 'number',
      default: 2000,
      min: 500,
      max: 5000,
      step: 500,
      description: 'Number of trail points'
    }
  };

  private trail: THREE.Line | null = null;
  private particle: THREE.Mesh | null = null;
  private x = 0.1;
  private y = 0;
  private z = 0;
  private points: THREE.Vector3[] = [];
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.scene = scene;
    this.params = params;
    this.x = 0.1;
    this.y = 0;
    this.z = 0;
    this.points = [];

    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.5
    });
    this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(this.particle);
  }

  update(_delta: number, _state: SimulationState): void {
    if (!this.particle || !this.scene) return;

    const dt = 0.005;
    const sigma = this.params.sigma as number || 10;
    const rho = this.params.rho as number || 28;
    const beta = this.params.beta as number || 2.667;
    const maxLength = this.params.trailLength as number || 2000;

    const dx = sigma * (this.y - this.x);
    const dy = this.x * (rho - this.z) - this.y;
    const dz = this.x * this.y - beta * this.z;

    this.x += dx * dt;
    this.y += dy * dt;
    this.z += dz * dt;

    const scale = 0.15;
    this.particle.position.set(this.x * scale, this.z * scale, this.y * scale);

    this.points.push(this.particle.position.clone());

    if (this.points.length > maxLength) {
      this.points.shift();
    }

    if (this.trail) {
      this.scene.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    const colors = new Float32Array(this.points.length * 3);
    
    for (let i = 0; i < this.points.length; i++) {
      const t = i / this.points.length;
      const color = new THREE.Color();
      color.setHSL(t * 0.7 + 0.5, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({ 
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    this.trail = new THREE.Line(geometry, material);
    this.scene.add(this.trail);
  }

  reset(): void {
    this.x = 0.1;
    this.y = 0;
    this.z = 0;
    this.points = [];
    
    if (this.trail && this.scene) {
      this.scene.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
      this.trail = null;
    }
  }

  cleanup(): void {
    if (this.particle) {
      this.particle.parent?.remove(this.particle);
      this.particle.geometry.dispose();
      (this.particle.material as THREE.Material).dispose();
    }
    if (this.trail) {
      this.trail.parent?.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
    }
  }

  exportData(): unknown {
    return { x: this.x, y: this.y, z: this.z, pointCount: this.points.length };
  }
}
