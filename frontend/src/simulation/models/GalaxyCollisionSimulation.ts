import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class GalaxyCollisionSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'galaxy-collision',
    name: 'Galaxy Collision',
    description: 'Two galaxies colliding and merging over time',
    category: 'Astrophysics',
    difficulty: 'advanced',
    tags: ['galaxy', 'collision', 'gravity', 'n-body'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    speed: {
      label: 'Collision Speed',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Speed of collision'
    },
    starsPerGalaxy: {
      label: 'Stars Per Galaxy',
      type: 'number',
      default: 150,
      min: 50,
      max: 300,
      step: 50,
      description: 'Number of stars in each galaxy'
    }
  };

  private stars: THREE.Points | null = null;
  private velocities: THREE.Vector3[] = [];
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    const starsPerGalaxy = params.starsPerGalaxy as number || 150;
    const count = starsPerGalaxy * 2;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.velocities = [];

    for (let g = 0; g < 2; g++) {
      const offsetX = g === 0 ? -5 : 5;
      const color = g === 0 ? new THREE.Color(0x4a90e2) : new THREE.Color(0xe24a4a);
      
      for (let i = 0; i < starsPerGalaxy; i++) {
        const idx = g * starsPerGalaxy + i;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 3;
        
        positions[idx * 3] = offsetX + Math.cos(angle) * radius;
        positions[idx * 3 + 1] = (Math.random() - 0.5) * 0.5;
        positions[idx * 3 + 2] = Math.sin(angle) * radius;

        colors[idx * 3] = color.r;
        colors[idx * 3 + 1] = color.g;
        colors[idx * 3 + 2] = color.b;

        const speed = Math.sqrt(1 / (radius + 1));
        this.velocities.push(new THREE.Vector3(
          g === 0 ? speed : -speed,
          0,
          -Math.sin(angle) * speed * (g === 0 ? 1 : -1)
        ));
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.stars = new THREE.Points(geometry, material);
    scene.add(this.stars);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.stars) return;

    const speed = this.params.speed as number || 1;
    const positions = (this.stars.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;

    for (let i = 0; i < this.velocities.length; i++) {
      positions[i * 3] += this.velocities[i].x * delta * speed;
      positions[i * 3 + 1] += this.velocities[i].y * delta * speed;
      positions[i * 3 + 2] += this.velocities[i].z * delta * speed;

      for (let j = 0; j < this.velocities.length; j++) {
        if (i === j) continue;
        const dx = positions[j * 3] - positions[i * 3];
        const dy = positions[j * 3 + 1] - positions[i * 3 + 1];
        const dz = positions[j * 3 + 2] - positions[i * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;
        
        if (dist < 5) {
          const force = 0.01 / (dist * dist);
          this.velocities[i].x += (dx / dist) * force;
          this.velocities[i].y += (dy / dist) * force;
          this.velocities[i].z += (dz / dist) * force;
        }
      }
    }

    (this.stars.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  reset(): void {}

  cleanup(): void {
    if (this.stars) {
      this.stars.parent?.remove(this.stars);
      this.stars.geometry.dispose();
      (this.stars.material as THREE.Material).dispose();
    }
  }

  exportData(): unknown {
    return { starCount: this.velocities.length };
  }
}
