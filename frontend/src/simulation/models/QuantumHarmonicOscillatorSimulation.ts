import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class QuantumHarmonicOscillatorSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'quantum-oscillator',
    name: 'Quantum Harmonic Oscillator',
    description: 'Quantum energy levels and wave functions',
    category: 'Quantum',
    difficulty: 'advanced',
    tags: ['quantum', 'oscillator', 'energy-levels', 'wave-function'],
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

    // Potential well (parabola)
    const wellPoints = [];
    for (let x = -3; x <= 3; x += 0.1) {
      wellPoints.push(new THREE.Vector3(x, x * x * 0.5, 0));
    }
    const wellGeometry = new THREE.BufferGeometry().setFromPoints(wellPoints);
    const wellMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const well = new THREE.Line(wellGeometry, wellMaterial);
    this.group.add(well);

    // Energy levels
    for (let n = 0; n < 5; n++) {
      const energy = (n + 0.5) * 0.8;
      const levelGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, energy, 0),
        new THREE.Vector3(2, energy, 0)
      ]);
      const levelMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5
      });
      const level = new THREE.Line(levelGeometry, levelMaterial);
      this.group.add(level);
    }

    // Wave function visualization
    const waveGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const waveMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff00ff,
      transparent: true,
      opacity: 0.7
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    this.group.add(wave);

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    
    const wave = this.group.children[this.group.children.length - 1] as THREE.Mesh;
    const amplitude = 2;
    const frequency = 1;
    
    wave.position.x = amplitude * Math.sin(frequency * this.time);
    wave.position.y = wave.position.x * wave.position.x * 0.5;
    
    // Pulsing to show probability density
    const scale = 1 + Math.abs(Math.sin(this.time * 3)) * 0.5;
    wave.scale.set(scale, scale, scale);
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
