import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class WaveSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'wave',
    name: 'Wave Motion',
    description: 'Beautiful 3D wave propagation with dynamic colors and smooth animation',
    category: 'Waves',
    difficulty: 'beginner',
    tags: ['wave', 'frequency', 'amplitude', 'sine', 'ocean']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    amplitude: {
      label: 'Amplitude',
      type: 'number',
      default: 1.5,
      min: 0.5,
      max: 3,
      step: 0.1,
      description: 'Wave height'
    },
    frequency: {
      label: 'Frequency',
      type: 'number',
      default: 0.8,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Wave frequency'
    },
    wavelength: {
      label: 'Wavelength',
      type: 'number',
      default: 3,
      min: 1,
      max: 8,
      step: 0.5,
      description: 'Distance between wave peaks'
    },
    speed: {
      label: 'Wave Speed',
      type: 'number',
      default: 1.5,
      min: 0.5,
      max: 5,
      step: 0.5,
      description: 'Propagation speed'
    }
  };

  private waveMesh: THREE.Mesh | null = null;
  private wireframeMesh: THREE.LineSegments | null = null;
  private particleSystem: THREE.Points | null = null;
  private time: number = 0;
  private params: Record<string, unknown> = {};
  private waveGeometry: THREE.PlaneGeometry | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.time = 0;

    // Create high-resolution wave surface
    const segments = 120;
    const size = 25;
    this.waveGeometry = new THREE.PlaneGeometry(size, size, segments, segments);
    
    // Main wave mesh with gradient material
    const waveMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00d4ff,
      emissive: 0x0066ff,
      emissiveIntensity: 0.2,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      flatShading: false
    });
    
    this.waveMesh = new THREE.Mesh(this.waveGeometry, waveMaterial);
    this.waveMesh.rotation.x = -Math.PI / 2.2; // Slight tilt for better view
    this.waveMesh.position.y = 0;
    this.waveMesh.castShadow = true;
    this.waveMesh.receiveShadow = true;
    scene.add(this.waveMesh);

    // Add wireframe overlay for aesthetic detail
    const wireframeGeometry = new THREE.PlaneGeometry(size, size, segments / 2, segments / 2);
    this.wireframeMesh = new THREE.LineSegments(
      new THREE.WireframeGeometry(wireframeGeometry),
      new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2 })
    );
    this.wireframeMesh.rotation.x = -Math.PI / 2.2;
    this.wireframeMesh.position.y = 0.05;
    scene.add(this.wireframeMesh);

    // Add particle effects on wave peaks
    this.createParticleSystem(scene);

    this.updateWave();
  }

  private createParticleSystem(scene: THREE.Scene): void {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const color = new THREE.Color();
      color.setHSL(0.5 + Math.random() * 0.1, 1, 0.7);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(this.particleSystem);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.waveMesh || !this.waveGeometry) return;

    const speed = this.params.speed as number || 1.5;
    this.time += delta * speed;
    this.updateWave();
    this.updateParticles();
  }

  private updateWave(): void {
    if (!this.waveGeometry) return;

    const amplitude = this.params.amplitude as number || 1.5;
    const frequency = this.params.frequency as number || 0.8;
    const wavelength = this.params.wavelength as number || 3;

    const positions = this.waveGeometry.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      // Create complex wave pattern with multiple components
      const wave1 = Math.sin((2 * Math.PI / wavelength) * x - 2 * Math.PI * frequency * this.time);
      const wave2 = Math.sin((2 * Math.PI / (wavelength * 1.5)) * z - 2 * Math.PI * frequency * this.time * 0.7);
      const wave3 = Math.sin((2 * Math.PI / (wavelength * 0.8)) * (x + z) - 2 * Math.PI * frequency * this.time * 1.3);
      
      const y = amplitude * (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
      positions.setY(i, y);

      // Dynamic color based on height
      const normalizedHeight = (y / amplitude + 1) / 2; // 0 to 1
      const color = new THREE.Color();
      color.setHSL(0.55 + normalizedHeight * 0.1, 0.9, 0.4 + normalizedHeight * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    positions.needsUpdate = true;
    this.waveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.waveGeometry.computeVertexNormals();

    // Update wireframe to match
    if (this.wireframeMesh && this.wireframeMesh.geometry) {
      const wirePositions = (this.wireframeMesh.geometry as THREE.BufferGeometry).attributes.position;
      if (wirePositions) {
        for (let i = 0; i < Math.min(wirePositions.count, positions.count); i++) {
          wirePositions.setY(i, positions.getY(i));
        }
        wirePositions.needsUpdate = true;
      }
    }

    // Update material color with subtle animation
    if (this.waveMesh) {
      const material = this.waveMesh.material as THREE.MeshStandardMaterial;
      const hue = 0.52 + Math.sin(this.time * 0.5) * 0.05;
      material.color.setHSL(hue, 1, 0.5);
      material.emissive.setHSL(hue, 1, 0.3);
    }
  }

  private updateParticles(): void {
    if (!this.particleSystem) return;

    const positions = this.particleSystem.geometry.attributes.position;
    const amplitude = this.params.amplitude as number || 1.5;
    const wavelength = this.params.wavelength as number || 3;
    const frequency = this.params.frequency as number || 0.8;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      
      // Make particles follow wave peaks
      const wave = Math.sin((2 * Math.PI / wavelength) * x - 2 * Math.PI * frequency * this.time);
      const y = amplitude * wave + 0.5;
      
      positions.setY(i, y);
    }
    
    positions.needsUpdate = true;

    // Rotate particle system slowly
    this.particleSystem.rotation.y += 0.001;
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

    if (this.wireframeMesh) {
      this.wireframeMesh.parent?.remove(this.wireframeMesh);
      this.wireframeMesh.geometry.dispose();
      (this.wireframeMesh.material as THREE.Material).dispose();
      this.wireframeMesh = null;
    }

    if (this.particleSystem) {
      this.particleSystem.parent?.remove(this.particleSystem);
      this.particleSystem.geometry.dispose();
      (this.particleSystem.material as THREE.Material).dispose();
      this.particleSystem = null;
    }
  }

  exportData(): unknown {
    return {
      time: this.time,
      amplitude: this.params.amplitude,
      frequency: this.params.frequency,
      wavelength: this.params.wavelength,
      waveEquation: `y = A·sin(2π/λ·x - 2π·f·t)`
    };
  }
}
