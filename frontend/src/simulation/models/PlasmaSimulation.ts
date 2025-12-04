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
    power: { 
      label: 'Power (W)', 
      type: 'number', 
      default: 1000, 
      min: 100, 
      max: 5000, 
      step: 100, 
      description: 'Plasma power' 
    },
    density: {
      label: 'Particle Density',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Plasma density'
    },
    magneticConfinement: {
      label: 'Magnetic Confinement',
      type: 'boolean',
      default: true,
      description: 'Enable magnetic confinement'
    }
  };

  private group: THREE.Group | null = null;
  private particles: THREE.Points | null = null;
  private velocities: THREE.Vector3[] = [];
  private time = 0;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.time = 0;
    this.group = new THREE.Group();
    this.velocities = [];

    const density = (params.density as number) || 1;
    const particleCount = Math.floor(300 * density);
    const hasMagneticConfinement = params.magneticConfinement !== false;

    // Magnetic confinement coils (tokamak-style)
    if (hasMagneticConfinement) {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const coilGeometry = new THREE.TorusGeometry(4, 0.2, 16, 32);
        const coilMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x888888,
          metalness: 0.8,
          roughness: 0.2
        });
        const coil = new THREE.Mesh(coilGeometry, coilMaterial);
        coil.rotation.y = angle;
        coil.rotation.x = Math.PI / 2;
        this.group.add(coil);
      }
    }

    // Plasma particles (ions and electrons)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Start in toroidal shape
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 3 + (Math.random() - 0.5) * 0.5;
      const height = (Math.random() - 0.5) * 0.8;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Alternate between ions (red/orange) and electrons (blue/cyan)
      const isIon = i % 2 === 0;
      const color = isIon ? 
        new THREE.Color().setHSL(0.05 + Math.random() * 0.05, 1, 0.6) : 
        new THREE.Color().setHSL(0.55 + Math.random() * 0.05, 1, 0.6);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Initial velocities
      const speed = 0.5 + Math.random() * 0.5;
      this.velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed * 0.3,
        (Math.random() - 0.5) * speed
      ));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.group.add(this.particles);

    // Plasma glow
    const glowGeometry = new THREE.TorusGeometry(3, 1, 16, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6600, 
      transparent: true, 
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.group.add(glow);

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group || !this.particles) return;
    this.time += delta;
    
    const positions = (this.particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const dt = Math.min(delta, 0.02);

    for (let i = 0; i < this.velocities.length; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      
      // Toroidal magnetic confinement
      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);
      const targetRadius = 3;
      
      // Magnetic force toward toroidal center
      const radialForce = (targetRadius - radius) * 2;
      this.velocities[i].x += Math.cos(angle) * radialForce * dt;
      this.velocities[i].z += Math.sin(angle) * radialForce * dt;
      
      // Vertical confinement
      this.velocities[i].y += -y * 3 * dt;
      
      // Toroidal flow
      const isIon = i % 2 === 0;
      const flowSpeed = isIon ? 2 : -2;
      this.velocities[i].x += -Math.sin(angle) * flowSpeed * dt;
      this.velocities[i].z += Math.cos(angle) * flowSpeed * dt;
      
      // Thermal motion
      this.velocities[i].x += (Math.random() - 0.5) * 0.5 * dt;
      this.velocities[i].y += (Math.random() - 0.5) * 0.3 * dt;
      this.velocities[i].z += (Math.random() - 0.5) * 0.5 * dt;
      
      // Damping
      this.velocities[i].multiplyScalar(0.98);
      
      // Update positions
      positions[i * 3] += this.velocities[i].x * dt;
      positions[i * 3 + 1] += this.velocities[i].y * dt;
      positions[i * 3 + 2] += this.velocities[i].z * dt;
    }

    (this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    
    // Animate glow
    const glow = this.group.children.find(child => 
      child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry
    );
    if (glow && glow instanceof THREE.Mesh) {
      glow.rotation.y += delta * 0.5;
      const material = glow.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(this.time * 3) * 0.05;
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
