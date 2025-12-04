import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class TornadoSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'tornado',
    name: 'Tornado Vortex',
    description: 'Swirling tornado with particle dynamics',
    category: 'Weather',
    difficulty: 'intermediate',
    tags: ['tornado', 'vortex', 'weather', 'fluid'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    strength: {
      label: 'Vortex Strength',
      type: 'number',
      default: 5,
      min: 1,
      max: 10,
      step: 0.5,
      description: 'Tornado strength'
    },
    height: {
      label: 'Height',
      type: 'number',
      default: 8,
      min: 4,
      max: 12,
      step: 1,
      description: 'Tornado height'
    }
  };

  private particles: THREE.Points | null = null;
  private velocities: THREE.Vector3[] = [];
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    const count = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.velocities = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * (params.height as number || 8);
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const color = new THREE.Color().setHSL(0.6, 0.5, 0.5 + Math.random() * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      this.velocities.push(new THREE.Vector3());
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });

    this.particles = new THREE.Points(geometry, material);
    scene.add(this.particles);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.particles) return;

    const strength = this.params.strength as number || 5;
    const height = this.params.height as number || 8;
    const positions = (this.particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;

    for (let i = 0; i < this.velocities.length; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const radius = Math.sqrt(x * x + z * z);

      const angle = Math.atan2(z, x);
      const tangentX = -Math.sin(angle);
      const tangentZ = Math.cos(angle);

      const vortexStrength = strength * (1 - radius / 4);
      this.velocities[i].x = tangentX * vortexStrength - x * 0.1;
      this.velocities[i].y = (height - y) * 0.5;
      this.velocities[i].z = tangentZ * vortexStrength - z * 0.1;

      positions[i * 3] += this.velocities[i].x * delta;
      positions[i * 3 + 1] += this.velocities[i].y * delta;
      positions[i * 3 + 2] += this.velocities[i].z * delta;

      if (y > height || radius > 4) {
        const newAngle = Math.random() * Math.PI * 2;
        const newRadius = Math.random() * 2;
        positions[i * 3] = Math.cos(newAngle) * newRadius;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(newAngle) * newRadius;
      }
    }

    (this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  reset(): void {}

  cleanup(): void {
    if (this.particles) {
      this.particles.parent?.remove(this.particles);
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
  }

  exportData(): unknown {
    return { particleCount: this.velocities.length };
  }
}
