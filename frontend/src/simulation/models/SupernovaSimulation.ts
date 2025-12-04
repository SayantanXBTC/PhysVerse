import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class SupernovaSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'supernova',
    name: 'Supernova Explosion',
    description: 'Stellar explosion and shockwave propagation',
    category: 'Astrophysics',
    difficulty: 'advanced',
    tags: ['supernova', 'explosion', 'star', 'shockwave'],
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

    // Central star
    const starGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const starMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 1
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    this.group.add(star);

    // Explosion particles
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
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
    
    const star = this.group.children[0] as THREE.Mesh;
    const particles = this.group.children[1] as THREE.Points;
    const positions = (particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;

    // Pulsing star before explosion
    if (this.time < 2) {
      star.scale.setScalar(1 + Math.sin(this.time * 10) * 0.2);
    } else {
      star.scale.setScalar(0.1);
      
      // Expanding shockwave
      for (let i = 0; i < positions.length / 3; i++) {
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI;
        const speed = 2 + Math.random() * 3;
        const t = (this.time - 2) * speed;
        
        positions[i * 3] = Math.sin(angle2) * Math.cos(angle1) * t;
        positions[i * 3 + 1] = Math.cos(angle2) * t;
        positions[i * 3 + 2] = Math.sin(angle2) * Math.sin(angle1) * t;
      }
      
      (particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // Reset after explosion
    if (this.time > 5) {
      this.time = 0;
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
