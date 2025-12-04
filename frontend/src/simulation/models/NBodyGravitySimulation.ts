import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class NBodyGravitySimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'n-body',
    name: 'N-Body Gravity',
    description: 'Multiple bodies with gravitational interactions',
    category: 'Astrophysics',
    difficulty: 'advanced',
    tags: ['n-body', 'gravity', 'chaos', 'orbital'],
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

    // Create multiple bodies with random positions and velocities
    const bodyCount = 8;
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff, 0xff8800];

    for (let i = 0; i < bodyCount; i++) {
      const size = 0.2 + Math.random() * 0.3;
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      const material = new THREE.MeshStandardMaterial({ color: colors[i] });
      const body = new THREE.Mesh(geometry, material);
      
      const angle = (i / bodyCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 2;
      body.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      );
      
      this.group.add(body);
    }

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    
    // Simple orbital motion
    this.group.children.forEach((body, i) => {
      const speed = 0.5 + i * 0.1;
      const radius = body.position.length();
      const angle = Math.atan2(body.position.z, body.position.x) + delta * speed / radius;
      
      body.position.x = Math.cos(angle) * radius;
      body.position.z = Math.sin(angle) * radius;
    });
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
