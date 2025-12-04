import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class PlasmaSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'plasma',
    name: 'Plasma Physics',
    description: 'Ionized gas with electromagnetic interactions',
    category: 'Plasma',
    difficulty: 'advanced',
    tags: ['plasma', 'ionization', 'electromagnetic', 'fusion'],
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

    // Plasma particles (ions and electrons)
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Alternate between ions (red) and electrons (blue)
      const color = i % 2 === 0 ? new THREE.Color(0xff4444) : new THREE.Color(0x4444ff);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    this.group.add(particles);

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    
    const particles = this.group.children[0] as THREE.Points;
    const positions = (particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;

    for (let i = 0; i < positions.length / 3; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);
      
      // Swirling motion
      const newAngle = angle + delta * (i % 2 === 0 ? 1 : -1);
      positions[i * 3] = Math.cos(newAngle) * radius;
      positions[i * 3 + 2] = Math.sin(newAngle) * radius;
      positions[i * 3 + 1] += Math.sin(this.time * 2 + i) * delta * 2;

      // Wrap around
      if (Math.abs(positions[i * 3 + 1]) > 3) {
        positions[i * 3 + 1] *= -1;
      }
    }

    (particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
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
