import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class FractalTreeSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'fractal-tree',
    name: 'Fractal Tree',
    description: 'Growing fractal tree with recursive branching patterns',
    category: 'Fractals',
    difficulty: 'intermediate',
    tags: ['fractal', 'recursion', 'nature', 'growth']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    depth: {
      label: 'Recursion Depth',
      type: 'number',
      default: 8,
      min: 3,
      max: 12,
      step: 1,
      description: 'Number of branch generations'
    },
    angle: {
      label: 'Branch Angle',
      type: 'number',
      default: 25,
      min: 10,
      max: 45,
      step: 1,
      description: 'Angle between branches (degrees)'
    },
    lengthRatio: {
      label: 'Length Ratio',
      type: 'number',
      default: 0.7,
      min: 0.5,
      max: 0.9,
      step: 0.05,
      description: 'Branch length reduction factor'
    },
    branches: {
      label: 'Branches per Node',
      type: 'number',
      default: 2,
      min: 2,
      max: 4,
      step: 1,
      description: 'Number of branches at each split'
    }
  };

  private tree: THREE.Group | null = null;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.tree = new THREE.Group();
    scene.add(this.tree);
    this.buildTree();
  }

  private buildTree(): void {
    if (!this.tree) return;

    while (this.tree.children.length > 0) {
      const child = this.tree.children[0];
      this.tree.remove(child);
      if (child instanceof THREE.Line) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    }

    const depth = this.params.depth as number || 8;
    const angle = ((this.params.angle as number || 25) * Math.PI) / 180;
    const lengthRatio = this.params.lengthRatio as number || 0.7;
    const branchCount = this.params.branches as number || 2;

    this.drawBranch(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0),
      2,
      depth,
      angle,
      lengthRatio,
      branchCount
    );
  }

  private drawBranch(
    start: THREE.Vector3,
    direction: THREE.Vector3,
    length: number,
    depth: number,
    angle: number,
    lengthRatio: number,
    branchCount: number
  ): void {
    if (depth === 0 || !this.tree) return;

    const end = start.clone().add(direction.clone().multiplyScalar(length));

    const hue = (1 - depth / (this.params.depth as number || 8)) * 0.3;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.5);

    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ 
      color,
      linewidth: depth * 0.5
    });
    const line = new THREE.Line(geometry, material);
    this.tree.add(line);

    if (depth > 1) {
      for (let i = 0; i < branchCount; i++) {
        const rotationAngle = angle * (i - (branchCount - 1) / 2);
        const axis = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
        const newDirection = direction.clone().applyAxisAngle(axis, rotationAngle);
        
        const randomAxis = new THREE.Vector3(0, 1, 0);
        const randomRotation = (Math.random() - 0.5) * Math.PI * 2;
        newDirection.applyAxisAngle(randomAxis, randomRotation);

        this.drawBranch(
          end,
          newDirection.normalize(),
          length * lengthRatio,
          depth - 1,
          angle,
          lengthRatio,
          branchCount
        );
      }
    }
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.tree) return;
    this.tree.rotation.y += delta * 0.2;
  }

  reset(): void {
    this.buildTree();
  }

  cleanup(): void {
    if (this.tree) {
      this.tree.children.forEach(child => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.tree.parent?.remove(this.tree);
      this.tree = null;
    }
  }

  exportData(): unknown {
    return {
      depth: this.params.depth,
      branchCount: this.tree?.children.length || 0
    };
  }
}
