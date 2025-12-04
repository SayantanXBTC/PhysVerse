import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class ElectromagneticWaveSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'em-wave',
    name: 'Electromagnetic Wave',
    description: 'Propagating EM wave showing E and B field oscillations',
    category: 'Electromagnetism',
    difficulty: 'intermediate',
    tags: ['electromagnetic', 'wave', 'field', 'light'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    frequency: {
      label: 'Frequency',
      type: 'number',
      default: 2,
      min: 0.5,
      max: 5,
      step: 0.5,
      description: 'Wave frequency'
    },
    amplitude: {
      label: 'Amplitude',
      type: 'number',
      default: 2,
      min: 0.5,
      max: 4,
      step: 0.5,
      description: 'Wave amplitude'
    }
  };

  private eField: THREE.Group | null = null;
  private bField: THREE.Group | null = null;
  private time = 0;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.time = 0;
    this.eField = new THREE.Group();
    this.bField = new THREE.Group();

    for (let i = 0; i < 20; i++) {
      const x = i - 10;
      const eArrow = this.createArrow(0xff0000);
      eArrow.position.set(x, 0, 0);
      this.eField.add(eArrow);

      const bArrow = this.createArrow(0x0000ff);
      bArrow.position.set(x, 0, 0);
      bArrow.rotation.z = Math.PI / 2;
      this.bField.add(bArrow);
    }

    scene.add(this.eField);
    scene.add(this.bField);
  }

  private createArrow(color: number): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const material = new THREE.MeshStandardMaterial({ color });
    return new THREE.Mesh(geometry, material);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.eField || !this.bField) return;

    this.time += delta;
    const freq = this.params.frequency as number || 2;
    const amp = this.params.amplitude as number || 2;

    this.eField.children.forEach((arrow, i) => {
      const x = i - 10;
      const y = amp * Math.sin(freq * this.time - x * 0.5);
      arrow.scale.y = Math.abs(y);
      arrow.position.y = y / 2;
    });

    this.bField.children.forEach((arrow, i) => {
      const x = i - 10;
      const z = amp * Math.sin(freq * this.time - x * 0.5);
      arrow.scale.y = Math.abs(z);
      arrow.position.z = z / 2;
    });
  }

  reset(): void {
    this.time = 0;
  }

  cleanup(): void {
    [this.eField, this.bField].forEach(group => {
      if (group) {
        group.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        group.parent?.remove(group);
      }
    });
  }

  exportData(): unknown {
    return { time: this.time };
  }
}
