import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class QuantumTunnelingSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'quantum-tunneling',
    name: 'Quantum Tunneling',
    description: 'Visualize quantum particles tunneling through energy barriers',
    category: 'Quantum',
    difficulty: 'advanced',
    tags: ['quantum', 'tunneling', 'wave-function', 'barrier'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    barrierHeight: {
      label: 'Barrier Height',
      type: 'number',
      default: 3,
      min: 1,
      max: 10,
      step: 0.5,
      description: 'Energy barrier height'
    },
    particleEnergy: {
      label: 'Particle Energy',
      type: 'number',
      default: 2,
      min: 0.5,
      max: 5,
      step: 0.1,
      description: 'Particle kinetic energy'
    },
    waveSpeed: {
      label: 'Wave Speed',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Wave packet speed'
    }
  };

  private barrier: THREE.Mesh | null = null;
  private particles: THREE.Points | null = null;
  private waveFunction: THREE.Line | null = null;
  private time = 0;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.time = 0;

    const barrierGeometry = new THREE.BoxGeometry(0.5, params.barrierHeight as number || 3, 4);
    const barrierMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.3
    });
    this.barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    scene.add(this.barrier);

    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = -5 + Math.random() * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      const color = new THREE.Color(0x4ecdc4);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.particles = new THREE.Points(geometry, material);
    scene.add(this.particles);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.particles) return;

    this.time += delta;
    const positions = (this.particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const speed = this.params.waveSpeed as number || 1;
    const barrierHeight = this.params.barrierHeight as number || 3;
    const particleEnergy = this.params.particleEnergy as number || 2;

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += speed * delta;

      if (positions[i * 3] > -0.5 && positions[i * 3] < 0.5) {
        const tunnelingProb = Math.exp(-barrierHeight / particleEnergy);
        if (Math.random() > tunnelingProb) {
          positions[i * 3] = -5 + Math.random() * 2;
        }
      }

      if (positions[i * 3] > 8) {
        positions[i * 3] = -5 + Math.random() * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      }
    }

    (this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  reset(): void {
    this.time = 0;
  }

  cleanup(): void {
    [this.barrier, this.particles, this.waveFunction].forEach(obj => {
      if (obj) {
        obj.parent?.remove(obj);
        if ('geometry' in obj) obj.geometry.dispose();
        if ('material' in obj) (obj.material as THREE.Material).dispose();
      }
    });
  }

  exportData(): unknown {
    return { time: this.time };
  }
}
