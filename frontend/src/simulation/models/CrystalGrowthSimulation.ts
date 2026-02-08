import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class CrystalGrowthSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'crystal-growth',
    name: 'Crystal Growth',
    description: 'Dynamic crystallization with multiple lattice structures and realistic growth patterns',
    category: 'Materials',
    difficulty: 'advanced',
    tags: ['crystal', 'lattice', 'growth', 'solid-state', 'nucleation'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    latticeType: {
      label: 'Lattice Type',
      type: 'number',
      default: 0,
      min: 0,
      max: 3,
      step: 1,
      description: 'Crystal structure (0=Cubic, 1=Hexagonal, 2=Diamond, 3=FCC)'
    },
    growthRate: {
      label: 'Growth Rate',
      type: 'number',
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
      description: 'Speed of crystal growth'
    },
    temperature: {
      label: 'Temperature',
      type: 'number',
      default: 300,
      min: 100,
      max: 500,
      step: 50,
      description: 'Temperature (affects vibration)'
    },
    showBonds: {
      label: 'Show Bonds',
      type: 'boolean',
      default: true,
      description: 'Display atomic bonds'
    }
  };

  private group: THREE.Group | null = null;
  private atoms: THREE.InstancedMesh | null = null;
  private bonds: THREE.LineSegments | null = null;
  private time = 0;
  private growthProgress = 0;
  private atomPositions: THREE.Vector3[] = [];
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.time = 0;
    this.growthProgress = 0;
    this.params = params;
    this.scene = scene;
    this.group = new THREE.Group();
    this.atomPositions = [];

    const latticeType = params.latticeType as number || 0;
    const showBonds = params.showBonds !== false;

    // Generate lattice positions based on type
    this.generateLattice(latticeType);

    // Create instanced atoms
    const atomGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const atomMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ddff,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x0088aa,
      emissiveIntensity: 0.3
    });

    this.atoms = new THREE.InstancedMesh(atomGeometry, atomMaterial, this.atomPositions.length);
    this.atoms.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    
    // Initially hide all atoms (will grow in)
    const matrix = new THREE.Matrix4();
    matrix.makeScale(0, 0, 0);
    for (let i = 0; i < this.atomPositions.length; i++) {
      this.atoms.setMatrixAt(i, matrix);
    }
    
    this.group.add(this.atoms);

    // Create bonds
    if (showBonds) {
      this.createBonds();
    }

    scene.add(this.group);
  }

  private generateLattice(type: number): void {
    const size = 3;
    const spacing = 0.8;

    switch (type) {
      case 0: // Simple Cubic
        for (let x = -size; x <= size; x++) {
          for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
              this.atomPositions.push(new THREE.Vector3(x * spacing, y * spacing, z * spacing));
            }
          }
        }
        break;

      case 1: // Hexagonal
        for (let layer = -size; layer <= size; layer++) {
          const layerY = layer * spacing * 0.8;
          for (let row = -size; row <= size; row++) {
            for (let col = -size; col <= size; col++) {
              const x = col * spacing + (row % 2) * spacing * 0.5;
              const z = row * spacing * 0.866; // sqrt(3)/2
              if (Math.abs(x) <= size * spacing && Math.abs(z) <= size * spacing) {
                this.atomPositions.push(new THREE.Vector3(x, layerY, z));
              }
            }
          }
        }
        break;

      case 2: // Diamond
        for (let x = -size; x <= size; x++) {
          for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
              this.atomPositions.push(new THREE.Vector3(x * spacing, y * spacing, z * spacing));
              // Add tetrahedral positions
              if ((x + y + z) % 2 === 0) {
                this.atomPositions.push(new THREE.Vector3(
                  x * spacing + spacing * 0.25,
                  y * spacing + spacing * 0.25,
                  z * spacing + spacing * 0.25
                ));
              }
            }
          }
        }
        break;

      case 3: // Face-Centered Cubic (FCC)
        for (let x = -size; x <= size; x++) {
          for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
              // Corner atoms
              this.atomPositions.push(new THREE.Vector3(x * spacing, y * spacing, z * spacing));
              // Face-centered atoms
              if (x < size) this.atomPositions.push(new THREE.Vector3(x * spacing + spacing * 0.5, y * spacing, z * spacing));
              if (y < size) this.atomPositions.push(new THREE.Vector3(x * spacing, y * spacing + spacing * 0.5, z * spacing));
              if (z < size) this.atomPositions.push(new THREE.Vector3(x * spacing, y * spacing, z * spacing + spacing * 0.5));
            }
          }
        }
        break;
    }
  }

  private createBonds(): void {
    const bondPositions: number[] = [];
    const bondThreshold = 1.0; // Maximum distance for bond

    for (let i = 0; i < this.atomPositions.length; i++) {
      for (let j = i + 1; j < this.atomPositions.length; j++) {
        const distance = this.atomPositions[i].distanceTo(this.atomPositions[j]);
        if (distance < bondThreshold) {
          bondPositions.push(
            this.atomPositions[i].x, this.atomPositions[i].y, this.atomPositions[i].z,
            this.atomPositions[j].x, this.atomPositions[j].y, this.atomPositions[j].z
          );
        }
      }
    }

    const bondGeometry = new THREE.BufferGeometry();
    bondGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bondPositions, 3));

    const bondMaterial = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.3
    });

    this.bonds = new THREE.LineSegments(bondGeometry, bondMaterial);
    this.group?.add(this.bonds);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group || !this.atoms) return;
    
    this.time += delta;
    const growthRate = this.params.growthRate as number || 1;
    const temperature = this.params.temperature as number || 300;
    
    // Growth animation
    this.growthProgress += delta * growthRate * 0.5;
    const visibleAtoms = Math.min(this.atomPositions.length, Math.floor(this.growthProgress * this.atomPositions.length));

    // Update atom instances
    const matrix = new THREE.Matrix4();
    const tempMatrix = new THREE.Matrix4();
    
    for (let i = 0; i < this.atomPositions.length; i++) {
      const pos = this.atomPositions[i];
      const distFromCenter = pos.length();
      const growthThreshold = this.growthProgress * 8;

      if (distFromCenter < growthThreshold) {
        // Atom is visible and growing
        const growthFactor = Math.min(1, (growthThreshold - distFromCenter) * 0.5);
        const scale = growthFactor * (1 + Math.sin(this.time * 3 + i) * 0.05);
        
        // Thermal vibration based on temperature
        const vibration = (temperature / 300) * 0.02;
        const offsetX = Math.sin(this.time * 5 + i * 0.1) * vibration;
        const offsetY = Math.cos(this.time * 5 + i * 0.2) * vibration;
        const offsetZ = Math.sin(this.time * 5 + i * 0.3) * vibration;

        matrix.makeTranslation(pos.x + offsetX, pos.y + offsetY, pos.z + offsetZ);
        tempMatrix.makeScale(scale, scale, scale);
        matrix.multiply(tempMatrix);
      } else {
        // Atom not yet grown
        matrix.makeScale(0, 0, 0);
      }

      this.atoms.setMatrixAt(i, matrix);
    }

    this.atoms.instanceMatrix.needsUpdate = true;

    // Rotate entire crystal
    this.group.rotation.y += delta * 0.3;
    this.group.rotation.x = Math.sin(this.time * 0.5) * 0.2;

    // Pulse bonds
    if (this.bonds) {
      const material = this.bonds.material as THREE.LineBasicMaterial;
      material.opacity = 0.25 + Math.sin(this.time * 2) * 0.1;
    }
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  cleanup(): void {
    if (this.atoms) {
      this.atoms.parent?.remove(this.atoms);
      this.atoms.geometry.dispose();
      (this.atoms.material as THREE.Material).dispose();
      this.atoms = null;
    }

    if (this.bonds) {
      this.bonds.parent?.remove(this.bonds);
      this.bonds.geometry.dispose();
      (this.bonds.material as THREE.Material).dispose();
      this.bonds = null;
    }

    if (this.group) {
      this.group.parent?.remove(this.group);
      this.group = null;
    }

    this.atomPositions = [];
  }

  exportData(): unknown {
    const latticeType = this.params.latticeType as number || 0;
    const latticeNames = ['Simple Cubic', 'Hexagonal', 'Diamond', 'Face-Centered Cubic'];
    
    return {
      time: this.time,
      latticeType: latticeNames[latticeType],
      atomCount: this.atomPositions.length,
      growthProgress: (this.growthProgress * 100).toFixed(1) + '%',
      temperature: this.params.temperature
    };
  }
}
