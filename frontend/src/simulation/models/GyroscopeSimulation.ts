import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class GyroscopeSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'gyroscope',
    name: 'Gyroscope Precession',
    description: 'Spinning gyroscope demonstrating angular momentum',
    category: 'Mechanics',
    difficulty: 'advanced',
    tags: ['gyroscope', 'angular-momentum', 'precession', 'rotation'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    spinSpeed: { label: 'Spin Speed', type: 'number', default: 10, min: 1, max: 20, step: 1, description: 'Rotation speed' },
    mass: { label: 'Mass', type: 'number', default: 1, min: 0.5, max: 3, step: 0.1, description: 'Gyroscope mass' }
  };

  private gyroscope: THREE.Group | null = null;
  private angle = 0;
  private tilt = 0.3;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.gyroscope = new THREE.Group();

    const diskGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const diskMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.z = Math.PI / 2;
    this.gyroscope.add(disk);

    const axleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const axleMaterial = new THREE.MeshStandardMaterial({ color: 0x95a5a6 });
    const axle = new THREE.Mesh(axleGeometry, axleMaterial);
    axle.rotation.z = Math.PI / 2;
    this.gyroscope.add(axle);

    this.gyroscope.rotation.z = this.tilt;
    scene.add(this.gyroscope);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.gyroscope) return;

    const spinSpeed = this.params.spinSpeed as number || 10;
    this.angle += delta * spinSpeed;
    this.gyroscope.rotation.x = this.angle;
    this.gyroscope.rotation.y += delta * 0.5;
  }

  reset(): void {
    this.angle = 0;
    if (this.gyroscope) {
      this.gyroscope.rotation.set(0, 0, this.tilt);
    }
  }

  cleanup(): void {
    if (this.gyroscope) {
      this.gyroscope.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.gyroscope.parent?.remove(this.gyroscope);
    }
  }

  exportData(): unknown {
    return { angle: this.angle };
  }
}
