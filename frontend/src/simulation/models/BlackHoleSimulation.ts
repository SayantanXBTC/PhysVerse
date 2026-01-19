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
  private eventHorizon: THREE.Mesh | null = null;
  private accretionDisk: THREE.Points | null = null;
  private jets: THREE.Points[] = [];
  private gravitationalLens: THREE.Mesh | null = null;
  private velocities: THREE.Vector3[] = [];
  private params: Record<string, unknown> = {};
  private time = 0;
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;
    
    const mass = params.mass as number || 5;
    const schwarzschildRadius = mass * 0.1;

    // Black hole singularity (pure black sphere)
    const bhGeometry = new THREE.SphereGeometry(schwarzschildRadius, 32, 32);
    const bhMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      side: THREE.DoubleSide
    });
    this.blackHole = new THREE.Mesh(bhGeometry, bhMaterial);
    scene.add(this.blackHole);

    // Event horizon with distortion effect
    const horizonGeometry = new THREE.SphereGeometry(schwarzschildRadius * 1.5, 32, 32);
    const horizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a0a00,
      transparent: true,
      opacity: 0.8,
      side: THREE.BackSide
    });
    this.eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    scene.add(this.eventHorizon);

    // Multiple glow layers for depth
    for (let i = 0; i < 3; i++) {
      const glowGeometry = new THREE.SphereGeometry(schwarzschildRadius * (2 + i * 0.5), 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.05 + i * 0.02, 1, 0.4),
        transparent: true,
        opacity: 0.15 - i * 0.04,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      scene.add(glow);
    }

    // Gravitational lensing ring
    const lensGeometry = new THREE.TorusGeometry(schwarzschildRadius * 3, 0.1, 16, 100);
    const lensMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    this.gravitationalLens = new THREE.Mesh(lensGeometry, lensMaterial);
    this.gravitationalLens.rotation.x = Math.PI / 2;
    scene.add(this.gravitationalLens);

    // Accretion disk with temperature gradient
    const count = params.particleCount as number || 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    this.velocities = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = schwarzschildRadius * 2 + Math.random() * 6;
      const height = (Math.random() - 0.5) * (0.3 + (radius - schwarzschildRadius * 2) * 0.05);
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Temperature-based color (hotter near black hole)
      const temp = 1 - ((radius - schwarzschildRadius * 2) / 6);
      const color = new THREE.Color();
      if (temp > 0.7) {
        color.setHSL(0.15, 1, 0.5 + temp * 0.3); // White-hot
      } else if (temp > 0.4) {
        color.setHSL(0.08, 1, 0.5); // Orange
      } else {
        color.setHSL(0.02, 1, 0.4); // Red
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.1 + temp * 0.15;

      // Keplerian orbital velocity
      const speed = Math.sqrt(mass / radius) * 1.5;
      this.velocities.push(new THREE.Vector3(
        -Math.sin(angle) * speed,
        (Math.random() - 0.5) * 0.1,
        Math.cos(angle) * speed
      ));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.accretionDisk = new THREE.Points(geometry, material);
    scene.add(this.accretionDisk);

    // Relativistic jets (matter ejected perpendicular to disk)
    for (let j = 0; j < 2; j++) {
      const jetGeometry = new THREE.BufferGeometry();
      const jetPositions = new Float32Array(50 * 3);
      const jetColors = new Float32Array(50 * 3);
      
      for (let i = 0; i < 50; i++) {
        const height = (i / 50) * 8 * (j === 0 ? 1 : -1);
        const spread = (i / 50) * 0.3;
        
        jetPositions[i * 3] = (Math.random() - 0.5) * spread;
        jetPositions[i * 3 + 1] = height;
        jetPositions[i * 3 + 2] = (Math.random() - 0.5) * spread;
        
        const intensity = 1 - (i / 50);
        const jetColor = new THREE.Color().setHSL(0.55, 0.8, 0.4 + intensity * 0.3);
        jetColors[i * 3] = jetColor.r;
        jetColors[i * 3 + 1] = jetColor.g;
        jetColors[i * 3 + 2] = jetColor.b;
      }
      
      jetGeometry.setAttribute('position', new THREE.BufferAttribute(jetPositions, 3));
      jetGeometry.setAttribute('color', new THREE.BufferAttribute(jetColors, 3));
      
      const jetMaterial = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      
      const jet = new THREE.Points(jetGeometry, jetMaterial);
      scene.add(jet);
      this.jets.push(jet);
    }
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.accretionDisk) return;

    const dt = Math.min(delta, 0.05);
    this.time += dt;
    const mass = this.params.mass as number || 5;
    const schwarzschildRadius = mass * 0.1;
    const positions = (this.accretionDisk.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const colors = (this.accretionDisk.geometry.attributes.color as THREE.BufferAttribute).array as Float32Array;

    // Update accretion disk particles
    for (let i = 0; i < this.velocities.length; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);

      // Particle crossed event horizon - respawn
      if (dist < schwarzschildRadius * 1.5) {
        const angle = Math.random() * Math.PI * 2;
        const radius = schwarzschildRadius * 2 + Math.random() * 6;
        const height = (Math.random() - 0.5) * (0.3 + (radius - schwarzschildRadius * 2) * 0.05);
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
        
        const speed = Math.sqrt(mass / radius) * 1.5;
        this.velocities[i].set(
          -Math.sin(angle) * speed,
          (Math.random() - 0.5) * 0.1,
          Math.cos(angle) * speed
        );
        continue;
      }

      // Gravitational acceleration with relativistic effects
      const force = (mass * 15) / (dist * dist);
      const relativisticFactor = 1 + (schwarzschildRadius * 2 / dist); // Stronger near horizon
      
      this.velocities[i].x -= (x / dist) * force * dt * relativisticFactor;
      this.velocities[i].y -= (y / dist) * force * dt * 0.2; // Flatten to disk
      this.velocities[i].z -= (z / dist) * force * dt * relativisticFactor;

      // Frame dragging effect (spacetime rotation)
      const frameDrag = 0.3 / (dist * dist);
      const perpX = -z;
      const perpZ = x;
      this.velocities[i].x += perpX * frameDrag * dt;
      this.velocities[i].z += perpZ * frameDrag * dt;

      // Update position
      positions[i * 3] += this.velocities[i].x * dt;
      positions[i * 3 + 1] += this.velocities[i].y * dt;
      positions[i * 3 + 2] += this.velocities[i].z * dt;

      // Update color based on temperature (closer = hotter)
      const temp = 1 - ((dist - schwarzschildRadius * 2) / 6);
      const color = new THREE.Color();
      if (temp > 0.7) {
        color.setHSL(0.15, 1, 0.5 + temp * 0.3);
      } else if (temp > 0.4) {
        color.setHSL(0.08, 1, 0.5);
      } else {
        color.setHSL(0.02, 1, 0.4);
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    (this.accretionDisk.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.accretionDisk.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    // Rotate black hole and event horizon
    if (this.blackHole) {
      this.blackHole.rotation.y += dt * 0.5;
    }
    if (this.eventHorizon) {
      this.eventHorizon.rotation.y += dt * 0.5;
      const pulse = 1 + Math.sin(this.time * 2) * 0.05;
      this.eventHorizon.scale.setScalar(pulse);
    }

    // Animate gravitational lensing ring
    if (this.gravitationalLens) {
      this.gravitationalLens.rotation.z += dt * 0.3;
      const material = this.gravitationalLens.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(this.time * 3) * 0.05;
    }

    // Animate relativistic jets
    this.jets.forEach((jet, idx) => {
      const jetPositions = (jet.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      
      for (let i = 0; i < jetPositions.length / 3; i++) {
        const baseHeight = (i / (jetPositions.length / 3)) * 8 * (idx === 0 ? 1 : -1);
        const wobble = Math.sin(this.time * 2 + i * 0.2) * 0.1;
        jetPositions[i * 3] = (Math.random() - 0.5) * (0.3 + wobble);
        jetPositions[i * 3 + 1] = baseHeight;
        jetPositions[i * 3 + 2] = (Math.random() - 0.5) * (0.3 + wobble);
      }
      
      (jet.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    });
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  cleanup(): void {
    if (this.blackHole) {
      this.blackHole.parent?.remove(this.blackHole);
      this.blackHole.geometry.dispose();
      (this.blackHole.material as THREE.Material).dispose();
    }
    if (this.eventHorizon) {
      this.eventHorizon.parent?.remove(this.eventHorizon);
      this.eventHorizon.geometry.dispose();
      (this.eventHorizon.material as THREE.Material).dispose();
    }
    if (this.gravitationalLens) {
      this.gravitationalLens.parent?.remove(this.gravitationalLens);
      this.gravitationalLens.geometry.dispose();
      (this.gravitationalLens.material as THREE.Material).dispose();
    }
    if (this.accretionDisk) {
      this.accretionDisk.parent?.remove(this.accretionDisk);
      this.accretionDisk.geometry.dispose();
      (this.accretionDisk.material as THREE.Material).dispose();
    }
    this.jets.forEach(jet => {
      jet.parent?.remove(jet);
      jet.geometry.dispose();
      (jet.material as THREE.Material).dispose();
    });
    this.jets = [];
  }

  exportData(): unknown {
    return { particleCount: this.velocities.length };
  }
}
