import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class FractalTreeSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'fractal-tree',
    name: 'Fractal Tree',
    description: 'Realistic growing tree with bark texture, leaves, and natural branching patterns',
    category: 'Fractals',
    difficulty: 'intermediate',
    tags: ['fractal', 'recursion', 'nature', 'growth', 'organic'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    depth: {
      label: 'Recursion Depth',
      type: 'number',
      default: 9,
      min: 4,
      max: 12,
      step: 1,
      description: 'Number of branch generations'
    },
    angle: {
      label: 'Branch Angle',
      type: 'number',
      default: 28,
      min: 15,
      max: 45,
      step: 1,
      description: 'Angle between branches (degrees)'
    },
    lengthRatio: {
      label: 'Length Ratio',
      type: 'number',
      default: 0.72,
      min: 0.5,
      max: 0.9,
      step: 0.02,
      description: 'Branch length reduction factor'
    },
    showLeaves: {
      label: 'Show Leaves',
      type: 'boolean',
      default: true,
      description: 'Display leaves on branches'
    },
    season: {
      label: 'Season',
      type: 'number',
      default: 1,
      min: 0,
      max: 3,
      step: 1,
      description: 'Season (0=Spring, 1=Summer, 2=Autumn, 3=Winter)'
    }
  };

  private tree: THREE.Group | null = null;
  private leaves: THREE.InstancedMesh | null = null;
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.tree = new THREE.Group();
    scene.add(this.tree);
    this.buildTree();
  }

  private buildTree(): void {
    if (!this.tree) return;

    // Clear existing tree
    while (this.tree.children.length > 0) {
      const child = this.tree.children[0];
      this.tree.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    }

    if (this.leaves) {
      this.leaves.parent?.remove(this.leaves);
      this.leaves.geometry.dispose();
      (this.leaves.material as THREE.Material).dispose();
      this.leaves = null;
    }

    const depth = this.params.depth as number || 9;
    const angle = ((this.params.angle as number || 28) * Math.PI) / 180;
    const lengthRatio = this.params.lengthRatio as number || 0.72;
    const showLeaves = this.params.showLeaves !== false;
    const season = this.params.season as number || 1;

    // Prepare leaf instances if needed
    const leafPositions: THREE.Vector3[] = [];
    const leafRotations: THREE.Euler[] = [];

    this.drawBranch(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0),
      2.5,
      depth,
      angle,
      lengthRatio,
      0,
      leafPositions,
      leafRotations
    );

    // Create instanced leaves
    if (showLeaves && season !== 3 && leafPositions.length > 0) {
      const leafGeometry = new THREE.PlaneGeometry(0.15, 0.2);
      
      // Season colors
      let leafColor: THREE.Color;
      switch (season) {
        case 0: // Spring - light green
          leafColor = new THREE.Color(0x90ee90);
          break;
        case 1: // Summer - dark green
          leafColor = new THREE.Color(0x228b22);
          break;
        case 2: // Autumn - orange/red
          leafColor = new THREE.Color(0xff8c00);
          break;
        default:
          leafColor = new THREE.Color(0x228b22);
      }

      const leafMaterial = new THREE.MeshStandardMaterial({
        color: leafColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        roughness: 0.8
      });

      this.leaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, leafPositions.length);
      
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < leafPositions.length; i++) {
        matrix.makeRotationFromEuler(leafRotations[i]);
        matrix.setPosition(leafPositions[i]);
        this.leaves.setMatrixAt(i, matrix);
      }
      
      this.scene?.add(this.leaves);
    }
  }

  private drawBranch(
    start: THREE.Vector3,
    direction: THREE.Vector3,
    length: number,
    depth: number,
    angle: number,
    lengthRatio: number,
    parentRadius: number,
    leafPositions: THREE.Vector3[],
    leafRotations: THREE.Euler[]
  ): void {
    if (depth === 0 || !this.tree) return;

    const end = start.clone().add(direction.clone().multiplyScalar(length));

    // Calculate branch thickness (tapers with depth)
    const maxDepth = this.params.depth as number || 9;
    const radiusRatio = depth / maxDepth;
    const radius = Math.max(0.02, 0.15 * radiusRatio);

    // Create cylindrical branch with bark texture
    const segments = Math.max(6, Math.floor(radius * 40));
    const branchGeometry = new THREE.CylinderGeometry(
      radius * 0.8, // Top radius (tapers)
      parentRadius || radius, // Bottom radius
      length,
      segments,
      1
    );

    // Bark color - brown with variation
    const barkColor = new THREE.Color().setHSL(
      0.08 + Math.random() * 0.02,
      0.4 + Math.random() * 0.2,
      0.2 + Math.random() * 0.1
    );

    const branchMaterial = new THREE.MeshStandardMaterial({
      color: barkColor,
      roughness: 0.9,
      metalness: 0.1
    });

    const branch = new THREE.Mesh(branchGeometry, branchMaterial);
    
    // Position and orient the branch
    branch.position.copy(start).add(direction.clone().multiplyScalar(length / 2));
    branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    
    this.tree.add(branch);

    // Add leaves at branch tips
    if (depth <= 3 && this.params.showLeaves !== false) {
      const leafCount = Math.floor(3 + Math.random() * 4);
      for (let i = 0; i < leafCount; i++) {
        const leafPos = end.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.3
        ));
        leafPositions.push(leafPos);
        leafRotations.push(new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI
        ));
      }
    }

    // Recursive branching
    if (depth > 1) {
      const branchCount = depth > 6 ? 2 : (depth > 3 ? 3 : 4); // More branches at tips
      
      for (let i = 0; i < branchCount; i++) {
        // Natural branching angles with variation
        const baseAngle = angle + (Math.random() - 0.5) * 0.3;
        const rotationAngle = baseAngle * (i - (branchCount - 1) / 2);
        
        // Create perpendicular axis for rotation
        const axis = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
        if (axis.length() < 0.1) {
          axis.set(1, 0, 0);
        }
        
        const newDirection = direction.clone().applyAxisAngle(axis, rotationAngle);
        
        // Add twist around the branch
        const twistAngle = (i / branchCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        newDirection.applyAxisAngle(direction, twistAngle);
        
        // Slight upward bias (trees grow up)
        newDirection.y += 0.1;
        newDirection.normalize();

        // Slight delay in branch position for natural look
        const branchStart = end.clone().add(direction.clone().multiplyScalar(-length * 0.1));

        this.drawBranch(
          branchStart,
          newDirection,
          length * (lengthRatio + (Math.random() - 0.5) * 0.1),
          depth - 1,
          angle,
          lengthRatio,
          radius * 0.8,
          leafPositions,
          leafRotations
        );
      }
    }
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.tree) return;
    this.tree.rotation.y += delta * 0.2;
  }



  cleanup(): void {
    if (this.tree) {
      this.tree.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.tree.parent?.remove(this.tree);
      this.tree = null;
    }
    if (this.leaves) {
      this.leaves.parent?.remove(this.leaves);
      this.leaves.geometry.dispose();
      (this.leaves.material as THREE.Material).dispose();
      this.leaves = null;
    }
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  exportData(): unknown {
    return {
      depth: this.params.depth,
      branchCount: this.tree?.children.length || 0
    };
  }
}
