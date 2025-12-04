import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class WaveSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'wave',
    name: 'Wave Motion',
    description: 'Sinusoidal wave propagation with adjustable frequency and amplitude',
    category: 'Waves',
    difficulty: 'intermediate',
    tags: ['wave', 'frequency', 'amplitude', 'sine']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    amplitude: {
      label: 'Amplitude',
      type: 'number',
      default: 2,
      min: 0.1,
      max: 5,
      step: 0.1,
      description: 'Wave amplitude in meters'
    },
    frequency: {
      label: 'Frequency',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      description: 'Wave frequency in Hz'
    },
    wavelength: {
      label: 'Wavelength',
      type: 'number',
      default: 4,
      min: 1,
      max: 10,
      step: 0.5,
      description: 'Wavelength in meters'
    },
    speed: {
      label: 'Wave Speed',
      type: 'number',
      default: 2,
      min: 0.5,
      max: 10,
      step: 0.5,
      description: 'Wave propagation speed'
    }
  };

  private waveMesh: THREE.Mesh | null = null;
  private time: number = 0;
  private params: Record<string, unknown> = {};
  private waveGeometry: THREE.PlaneGeometry | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.time = 0;

    const segments = 100;
    this.waveGeometry = new THREE.PlaneGeometry(20, 10, segments, segments);
    
    const waveMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6,
      wireframe: false,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    this.waveMesh = new THREE.Mesh(this.waveGeometry, waveMaterial);
    this.waveMesh.rotation.x = -Math.PI / 2;
    scene.add(this.waveMesh);

    this.updateWave();
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.waveMesh || !this.waveGeometry) return;

    this.time += delta;
    this.updateWave();
  }

  private updateWave(): void {
    if (!this.waveGeometry) return;

    const amplitude = this.params.amplitude as number || 2;
    const frequency = this.params.frequency as number || 1;
    const wavelength = this.params.wavelength as number || 4;

    const positions = this.waveGeometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      const waveX = amplitude * Math.sin((2 * Math.PI / wavelength) * x - 2 * Math.PI * frequency * this.time);
      const waveZ = amplitude * Math.sin((2 * Math.PI / wavelength) * z - 2 * Math.PI * frequency * this.time + Math.PI / 4);
      
      const y = (waveX + waveZ) * 0.5;
      positions.setY(i, y);
    }
    
    positions.needsUpdate = true;
    this.waveGeometry.computeVertexNormals();
  }

  reset(): void {
    this.time = 0;
    this.updateWave();
  }

  cleanup(): void {
    if (this.waveMesh) {
      this.waveMesh.parent?.remove(this.waveMesh);
      this.waveGeometry?.dispose();
      (this.waveMesh.material as THREE.Material).dispose();
      this.waveMesh = null;
      this.waveGeometry = null;
    }
  }

  exportData(): unknown {
    return {
      time: this.time,
      amplitude: this.params.amplitude,
      frequency: this.params.frequency
    };
  }
}
