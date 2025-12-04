import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class MagneticFieldSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'magnetic-field',
    name: 'Magnetic Field',
    description: 'Visualize magnetic field lines around a bar magnet',
    category: 'Electromagnetism',
    difficulty: 'intermediate',
    tags: ['magnetism', 'field', 'physics', 'electromagnetism']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    strength: {
      label: 'Field Strength',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Magnetic field strength'
    },
    lineCount: {
      label: 'Field Lines',
      type: 'number',
      default: 20,
      min: 10,
      max: 50,
      step: 5,
      description: 'Number of field lines'
    },
    animate: {
      label: 'Animate',
      type: 'boolean',
      default: true,
      description: 'Animate field lines'
    }
  };

  private magnet: THREE.Group | null = null;
  private fieldLines: THREE.Line[] = [];
  private time = 0;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.time = 0;

    this.magnet = new THREE.Group();

    const northGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const northMaterial = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const north = new THREE.Mesh(northGeometry, northMaterial);
    north.position.y = 1;
    this.magnet.add(north);

    const southGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const southMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const south = new THREE.Mesh(southGeometry, southMaterial);
    south.position.y = -1;
    this.magnet.add(south);

    scene.add(this.magnet);

    this.createFieldLines(scene);
  }

  private createFieldLines(scene: THREE.Scene): void {
    const lineCount = this.params.lineCount as number || 20;
    const strength = this.params.strength as number || 1;

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 0.3;
      const startX = Math.cos(angle) * radius;
      const startZ = Math.sin(angle) * radius;

      const points: THREE.Vector3[] = [];
      let x = startX;
      let y = 2;
      let z = startZ;

      for (let j = 0; j < 100; j++) {
        points.push(new THREE.Vector3(x, y, z));

        const dx = x;
        const dy = y;
        const dz = z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist > 8) break;

        const fieldX = (3 * dx * dy) / Math.pow(dist, 5);
        const fieldY = (2 * dy * dy - dx * dx - dz * dz) / Math.pow(dist, 5);
        const fieldZ = (3 * dz * dy) / Math.pow(dist, 5);

        x += fieldX * strength * 0.1;
        y += fieldY * strength * 0.1;
        z += fieldZ * strength * 0.1;

        if (y < -2 && Math.abs(x) < 0.5 && Math.abs(z) < 0.5) break;
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0x10b981,
        transparent: true,
        opacity: 0.6
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      this.fieldLines.push(line);
    }
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.magnet) return;

    this.time += delta;

    if (this.params.animate) {
      this.magnet.rotation.y += delta * 0.5;
      const rotationY = this.magnet.rotation.y;
      
      this.fieldLines.forEach(line => {
        line.rotation.y = rotationY;
      });
    }
  }

  reset(): void {
    this.time = 0;
    if (this.magnet) {
      this.magnet.rotation.set(0, 0, 0);
    }
    this.fieldLines.forEach(line => {
      line.rotation.set(0, 0, 0);
    });
  }

  cleanup(): void {
    if (this.magnet) {
      this.magnet.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.magnet.parent?.remove(this.magnet);
      this.magnet = null;
    }

    this.fieldLines.forEach(line => {
      line.parent?.remove(line);
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    });
    this.fieldLines = [];
  }

  exportData(): unknown {
    return { time: this.time };
  }
}
