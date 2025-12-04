import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class AtomicOrbitalSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'atomic-orbital',
    name: 'Atomic Orbitals',
    description: 'Electron probability clouds in hydrogen atom',
    category: 'Quantum',
    difficulty: 'advanced',
    tags: ['orbital', 'electron', 'quantum', 'atom'],
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

    // Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const nucleusMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    this.group.add(nucleus);

    // Electron cloud (probability density)
    const cloudGeometry = new THREE.SphereGeometry(2, 32, 32);
    const cloudMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00aaff, 
      transparent: true, 
      opacity: 0.2,
      wireframe: true 
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.group.add(cloud);

    // Orbital paths
    for (let i = 0; i < 3; i++) {
      const orbitGeometry = new THREE.TorusGeometry(1 + i * 0.7, 0.02, 16, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x4444ff, transparent: true, opacity: 0.3 });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2 + (i * Math.PI / 6);
      this.group.add(orbit);
    }

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    this.group.rotation.y += delta * 0.5;
    this.group.rotation.x = Math.sin(this.time * 0.3) * 0.2;
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
