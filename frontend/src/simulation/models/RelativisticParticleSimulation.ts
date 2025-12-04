import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class RelativisticParticleSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'relativistic',
    name: 'Relativistic Particle',
    description: 'Particle approaching speed of light',
    category: 'Relativity',
    difficulty: 'advanced',
    tags: ['relativity', 'speed-of-light', 'einstein', 'time-dilation'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    intensity: { label: 'Intensity', type: 'number', default: 1, min: 0.1, max: 3, step: 0.1, description: 'Simulation intensity' }
  };

  private group: THREE.Group | null = null;
  private time = 0;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.time = 0;
    this.group = new THREE.Group();

    // Particle
    const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.5
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = -5;
    this.group.add(particle);

    // Speed of light barrier
    const barrierGeometry = new THREE.PlaneGeometry(0.1, 10);
    const barrierMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.position.x = 5;
    this.group.add(barrier);

    // Trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.5 });
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(trail);

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    
    const particle = this.group.children[0] as THREE.Mesh;
    const velocity = 3;
    
    // Lorentz contraction visualization
    const gamma = 1 / Math.sqrt(1 - Math.pow(velocity / 10, 2));
    particle.scale.x = 1 / gamma;
    
    particle.position.x = -5 + (this.time * velocity) % 10;
    
    // Reset when reaching barrier
    if (particle.position.x > 4.5) {
      particle.position.x = -5;
    }
  }

  reset(): void {
    this.time = 0;
  }

  cleanup(): void {
    if (this.group) {
      this.group.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.group.parent?.remove(this.group);
    }
  }

  exportData(): unknown {
    return { time: this.time };
  }
}
