import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class AtomicOrbitalSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'atomic-orbital',
    name: 'Atomic Orbitals',
    description: 'Electron probability clouds in hydrogen atom',
    category: 'Quantum',
    difficulty: 'advanced',
    tags: ['orbital', 'electron', 'quantum', 'atom'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    principalQuantum: { 
      label: 'Principal Quantum Number (n)', 
      type: 'number', 
      default: 2, 
      min: 1, 
      max: 4, 
      step: 1, 
      description: 'Energy level' 
    },
    orbitalType: {
      label: 'Orbital Type',
      type: 'number',
      default: 0,
      min: 0,
      max: 2,
      step: 1,
      description: '0=s, 1=p, 2=d orbital'
    },
    rotationSpeed: {
      label: 'Rotation Speed',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Visualization speed'
    }
  };

  private group: THREE.Group | null = null;
  private electrons: THREE.Mesh[] = [];
  private time = 0;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.time = 0;
    this.group = new THREE.Group();
    this.electrons = [];

    const n = (params.principalQuantum as number) || 2;
    const orbitalType = (params.orbitalType as number) || 0;

    // Nucleus with glow
    const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const nucleusMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff3333, 
      emissive: 0xff0000, 
      emissiveIntensity: 1,
      metalness: 0.5,
      roughness: 0.2
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    this.group.add(nucleus);

    // Nucleus glow
    const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6666, 
      transparent: true, 
      opacity: 0.3 
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.group.add(glow);

    // Create orbital-specific visualization
    const radius = n * 1.5;
    
    if (orbitalType === 0) {
      // s-orbital (spherical)
      this.createSphereCloud(radius);
    } else if (orbitalType === 1) {
      // p-orbital (dumbbell)
      this.createDumbbellCloud(radius);
    } else {
      // d-orbital (cloverleaf)
      this.createCloverleafCloud(radius);
    }

    // Add electrons
    const electronCount = orbitalType === 0 ? 2 : (orbitalType === 1 ? 6 : 10);
    for (let i = 0; i < electronCount; i++) {
      const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const electronMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff,
        emissive: 0x0066ff,
        emissiveIntensity: 0.5
      });
      const electron = new THREE.Mesh(electronGeometry, electronMaterial);
      this.group.add(electron);
      this.electrons.push(electron);
    }

    scene.add(this.group);
  }

  private createSphereCloud(radius: number): void {
    if (!this.group) return;
    const cloudGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const cloudMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00aaff, 
      transparent: true, 
      opacity: 0.15,
      wireframe: true 
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.group.add(cloud);
  }

  private createDumbbellCloud(radius: number): void {
    if (!this.group) return;
    for (let side = -1; side <= 1; side += 2) {
      const lobeGeometry = new THREE.SphereGeometry(radius * 0.6, 32, 32);
      const lobeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff, 
        transparent: true, 
        opacity: 0.15,
        wireframe: true 
      });
      const lobe = new THREE.Mesh(lobeGeometry, lobeMaterial);
      lobe.position.y = side * radius * 0.7;
      lobe.scale.y = 1.5;
      this.group.add(lobe);
    }
  }

  private createCloverleafCloud(radius: number): void {
    if (!this.group) return;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const lobeGeometry = new THREE.SphereGeometry(radius * 0.5, 32, 32);
      const lobeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff, 
        transparent: true, 
        opacity: 0.15,
        wireframe: true 
      });
      const lobe = new THREE.Mesh(lobeGeometry, lobeMaterial);
      lobe.position.x = Math.cos(angle) * radius * 0.8;
      lobe.position.z = Math.sin(angle) * radius * 0.8;
      lobe.scale.set(0.8, 1.2, 0.8);
      this.group.add(lobe);
    }
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    
    const speed = 1;
    const n = 2;
    const radius = n * 1.5;

    // Animate electrons in orbital paths
    this.electrons.forEach((electron, i) => {
      const angle = this.time * speed + (i / this.electrons.length) * Math.PI * 2;
      const phase = (i / this.electrons.length) * Math.PI * 2;
      
      electron.position.x = Math.cos(angle) * radius * Math.cos(phase);
      electron.position.y = Math.sin(angle) * radius * 0.5;
      electron.position.z = Math.sin(angle) * radius * Math.sin(phase);
    });

    // Gentle rotation of entire system
    this.group.rotation.y += delta * 0.2;
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
