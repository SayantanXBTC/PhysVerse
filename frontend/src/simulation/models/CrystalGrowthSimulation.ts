import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class CrystalGrowthSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'crystal-growth',
    name: 'Crystal Growth',
    description: 'Crystallization and lattice formation',
    category: 'Materials',
    difficulty: 'advanced',
    tags: ['crystal', 'lattice', 'growth', 'solid-state'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    intensity: { label: 'Intensity', type: 'number', default: 1, min: 0.1, max: 3, step: 0.1, description: 'Simulation intensity' }
  };

  private group: THREE.Group | null = null;
  private time = 0;

  initialize(scene: THREE.Scene, _params: Record<string, unknown>): void {
    this.time = 0;
    this.group = new THREE.Group();

    // Crystal lattice structure
    const atomGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const atomMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.5 });

    // Create cubic lattice
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        for (let z = -2; z <= 2; z++) {
          const atom = new THREE.Mesh(atomGeometry, atomMaterial);
          atom.position.set(x * 0.8, y * 0.8, z * 0.8);
          this.group.add(atom);
        }
      }
    }

    // Bonds between atoms
    const bondMaterial = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.3 });
    for (let i = 0; i < this.group.children.length; i++) {
      const atom1 = this.group.children[i];
      for (let j = i + 1; j < this.group.children.length; j++) {
        const atom2 = this.group.children[j];
        const distance = atom1.position.distanceTo(atom2.position);
        if (distance < 1) {
          const points = [atom1.position, atom2.position];
          const bondGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const bond = new THREE.Line(bondGeometry, bondMaterial);
          this.group.add(bond);
        }
      }
    }

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    this.group.rotation.y += delta * 0.5;
    this.group.rotation.x += delta * 0.2;
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
