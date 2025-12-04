import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class DNAHelixSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'dna-helix',
    name: 'DNA Double Helix',
    description: 'Animated DNA double helix structure with base pairs',
    category: 'Biology',
    difficulty: 'beginner',
    tags: ['dna', 'biology', 'helix', 'molecular']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    rotationSpeed: {
      label: 'Rotation Speed',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Helix rotation speed'
    },
    helixHeight: {
      label: 'Helix Height',
      type: 'number',
      default: 8,
      min: 4,
      max: 12,
      step: 1,
      description: 'Height of DNA strand'
    },
    basePairs: {
      label: 'Base Pairs',
      type: 'number',
      default: 20,
      min: 10,
      max: 40,
      step: 5,
      description: 'Number of base pairs'
    }
  };

  private helix: THREE.Group | null = null;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.helix = new THREE.Group();

    const height = params.helixHeight as number || 8;
    const pairs = params.basePairs as number || 20;
    const radius = 1.5;

    for (let i = 0; i < pairs; i++) {
      const y = (i / pairs) * height - height / 2;
      const angle = (i / pairs) * Math.PI * 4;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      const sphere1Geometry = new THREE.SphereGeometry(0.15, 16, 16);
      const sphere1Material = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
      const sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
      sphere1.position.set(x1, y, z1);
      this.helix.add(sphere1);

      const sphere2Geometry = new THREE.SphereGeometry(0.15, 16, 16);
      const sphere2Material = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
      sphere2.position.set(x2, y, z2);
      this.helix.add(sphere2);

      const bridgeGeometry = new THREE.CylinderGeometry(0.05, 0.05, radius * 2, 8);
      const bridgeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
      const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
      bridge.position.set(0, y, 0);
      bridge.rotation.z = Math.PI / 2;
      bridge.rotation.y = angle;
      this.helix.add(bridge);

      if (i < pairs - 1) {
        const nextY = ((i + 1) / pairs) * height - height / 2;
        const nextAngle = ((i + 1) / pairs) * Math.PI * 4;
        const nextX1 = Math.cos(nextAngle) * radius;
        const nextZ1 = Math.sin(nextAngle) * radius;

        const points1 = [
          new THREE.Vector3(x1, y, z1),
          new THREE.Vector3(nextX1, nextY, nextZ1)
        ];
        const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
        const material1 = new THREE.LineBasicMaterial({ color: 0x3b82f6 });
        const line1 = new THREE.Line(geometry1, material1);
        this.helix.add(line1);

        const nextX2 = Math.cos(nextAngle + Math.PI) * radius;
        const nextZ2 = Math.sin(nextAngle + Math.PI) * radius;
        const points2 = [
          new THREE.Vector3(x2, y, z2),
          new THREE.Vector3(nextX2, nextY, nextZ2)
        ];
        const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        const material2 = new THREE.LineBasicMaterial({ color: 0xef4444 });
        const line2 = new THREE.Line(geometry2, material2);
        this.helix.add(line2);
      }
    }

    scene.add(this.helix);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.helix) return;
    const speed = this.params.rotationSpeed as number || 1;
    this.helix.rotation.y += delta * speed;
  }

  reset(): void {
    if (this.helix) {
      this.helix.rotation.set(0, 0, 0);
    }
  }

  cleanup(): void {
    if (this.helix) {
      this.helix.children.forEach(child => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.helix.parent?.remove(this.helix);
      this.helix = null;
    }
  }

  exportData(): unknown {
    return { rotation: this.helix?.rotation.y || 0 };
  }
}
