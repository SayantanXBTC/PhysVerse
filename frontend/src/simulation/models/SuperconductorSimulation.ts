import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class SuperconductorSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'superconductor',
    name: 'Superconductor',
    description: 'Magnetic levitation and Meissner effect',
    category: 'Condensed Matter',
    difficulty: 'advanced',
    tags: ['superconductor', 'levitation', 'magnetic', 'quantum'],
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

    // Superconductor disk
    const diskGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
    const diskMaterial = new THREE.MeshStandardMaterial({ color: 0x2196f3, metalness: 0.8, roughness: 0.2 });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    this.group.add(disk);

    // Levitating magnet
    const magnetGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.5);
    const magnetMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const magnet = new THREE.Mesh(magnetGeometry, magnetMaterial);
    magnet.position.y = 1.5;
    this.group.add(magnet);

    // Magnetic field lines (Meissner effect)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const points = [];
      for (let j = 0; j < 20; j++) {
        const t = j / 19;
        const radius = 0.5 + t * 1.5;
        const y = 1.5 - t * 2 + Math.sin(t * Math.PI) * 0.5;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ));
      }
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.group.add(line);
    }

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    const magnet = this.group.children[1];
    if (magnet) {
      magnet.position.y = 1.5 + Math.sin(this.time * 2) * 0.1;
      magnet.rotation.y += delta;
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
