import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class BlackHoleSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'black-hole',
    name: 'Black Hole Accretion',
    description: 'Matter spiraling into a black hole with gravitational lensing',
    category: 'Astrophysics',
    difficulty: 'advanced',
    tags: ['black-hole', 'gravity', 'relativity', 'accretion'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    mass: {
      label: 'Black Hole Mass',
      type: 'number',
      default: 5,
      min: 1,
      max: 10,
      step: 0.5,
      description: 'Mass of the black hole'
    },
    particleCount: {
      label: 'Particle Count',
      type: 'number',
      default: 200,
      min: 50,
      max: 500,
      step: 50,
      description: 'Number of particles'
    }
  };

  private blackHole: THREE.Mesh | null = null;
  private accretionDisk: THREE.Points | null = null;
  private velocities: THREE.Vector3[] = [];
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;

    const bhGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const bhMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.blackHole = new THREE.Mesh(bhGeometry, bhMaterial);
    scene.add(this.blackHole);

    const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6b00,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const count = params.particleCount as number || 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.velocities = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const temp = 1 - (radius / 8);
      const color = new THREE.Color();
      color.setHSL(0.05 + temp * 0.1, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      const speed = Math.sqrt(1 / radius) * 2;
      this.velocities.push(new THREE.Vector3(
        -Math.sin(angle) * speed,
        0,
        Math.cos(angle) * speed
      ));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.accretionDisk = new THREE.Points(geometry, material);
    scene.add(this.accretionDisk);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.accretionDisk) return;

    const mass = this.params.mass as number || 5;
    const positions = (this.accretionDisk.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;

    for (let i = 0; i < this.velocities.length; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);

      if (dist < 0.6) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 5;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
        
        const speed = Math.sqrt(1 / radius) * 2;
        this.velocities[i].set(
          -Math.sin(angle) * speed,
          0,
          Math.cos(angle) * speed
        );
        continue;
      }

      const force = (mass * 10) / (dist * dist);
      this.velocities[i].x -= (x / dist) * force * delta;
      this.velocities[i].y -= (y / dist) * force * delta * 0.1;
      this.velocities[i].z -= (z / dist) * force * delta;

      positions[i * 3] += this.velocities[i].x * delta;
      positions[i * 3 + 1] += this.velocities[i].y * delta;
      positions[i * 3 + 2] += this.velocities[i].z * delta;
    }

    (this.accretionDisk.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  reset(): void {
    // Reset handled in initialize
  }

  cleanup(): void {
    if (this.blackHole) {
      this.blackHole.parent?.remove(this.blackHole);
      this.blackHole.geometry.dispose();
      (this.blackHole.material as THREE.Material).dispose();
    }
    if (this.accretionDisk) {
      this.accretionDisk.parent?.remove(this.accretionDisk);
      this.accretionDisk.geometry.dispose();
      (this.accretionDisk.material as THREE.Material).dispose();
    }
  }

  exportData(): unknown {
    return { particleCount: this.velocities.length };
  }
}
