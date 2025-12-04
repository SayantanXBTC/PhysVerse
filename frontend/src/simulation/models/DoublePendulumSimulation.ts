import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class DoublePendulumSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'double-pendulum',
    name: 'Double Pendulum (Chaos)',
    description: 'Chaotic motion of a double pendulum demonstrating sensitive dependence on initial conditions',
    category: 'Chaos',
    difficulty: 'advanced',
    tags: ['chaos', 'pendulum', 'nonlinear', 'butterfly-effect']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    length1: {
      label: 'First Length',
      type: 'number',
      default: 2,
      min: 0.5,
      max: 5,
      step: 0.1,
      description: 'Length of first pendulum'
    },
    length2: {
      label: 'Second Length',
      type: 'number',
      default: 2,
      min: 0.5,
      max: 5,
      step: 0.1,
      description: 'Length of second pendulum'
    },
    mass1: {
      label: 'First Mass',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      description: 'Mass of first bob (kg)'
    },
    mass2: {
      label: 'Second Mass',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      description: 'Mass of second bob (kg)'
    },
    angle1: {
      label: 'Initial Angle 1',
      type: 'number',
      default: 90,
      min: 0,
      max: 180,
      step: 1,
      description: 'Initial angle of first pendulum'
    },
    angle2: {
      label: 'Initial Angle 2',
      type: 'number',
      default: 90,
      min: 0,
      max: 180,
      step: 1,
      description: 'Initial angle of second pendulum'
    }
  };

  private pivot: THREE.Mesh | null = null;
  private rod1: THREE.Line | null = null;
  private rod2: THREE.Line | null = null;
  private bob1: THREE.Mesh | null = null;
  private bob2: THREE.Mesh | null = null;
  private trail: THREE.Line | null = null;
  private trailPoints: THREE.Vector3[] = [];
  private angle1 = 0;
  private angle2 = 0;
  private velocity1 = 0;
  private velocity2 = 0;
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.scene = scene;
    this.params = params;
    this.angle1 = (params.angle1 as number || 90) * Math.PI / 180;
    this.angle2 = (params.angle2 as number || 90) * Math.PI / 180;
    this.velocity1 = 0;
    this.velocity2 = 0;

    const pivotGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const pivotMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    this.pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
    this.pivot.position.set(0, 5, 0);
    scene.add(this.pivot);

    const rodMaterial = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 2 });
    const rod1Geometry = new THREE.BufferGeometry();
    this.rod1 = new THREE.Line(rod1Geometry, rodMaterial);
    scene.add(this.rod1);

    const rod2Geometry = new THREE.BufferGeometry();
    this.rod2 = new THREE.Line(rod2Geometry, rodMaterial);
    scene.add(this.rod2);

    const bob1Size = 0.2 + (params.mass1 as number || 1) * 0.1;
    const bob1Geometry = new THREE.SphereGeometry(bob1Size, 32, 32);
    const bob1Material = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    this.bob1 = new THREE.Mesh(bob1Geometry, bob1Material);
    scene.add(this.bob1);

    const bob2Size = 0.2 + (params.mass2 as number || 1) * 0.1;
    const bob2Geometry = new THREE.SphereGeometry(bob2Size, 32, 32);
    const bob2Material = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    this.bob2 = new THREE.Mesh(bob2Geometry, bob2Material);
    scene.add(this.bob2);

    this.updatePositions();
    this.trailPoints = [];
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.bob1 || !this.bob2) return;

    const dt = Math.min(delta, 0.01);
    const g = 9.8;
    const l1 = this.params.length1 as number || 2;
    const l2 = this.params.length2 as number || 2;
    const m1 = this.params.mass1 as number || 1;
    const m2 = this.params.mass2 as number || 1;

    for (let i = 0; i < 5; i++) {
      const num1 = -g * (2 * m1 + m2) * Math.sin(this.angle1);
      const num2 = -m2 * g * Math.sin(this.angle1 - 2 * this.angle2);
      const num3 = -2 * Math.sin(this.angle1 - this.angle2) * m2;
      const num4 = this.velocity2 * this.velocity2 * l2 + this.velocity1 * this.velocity1 * l1 * Math.cos(this.angle1 - this.angle2);
      const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * this.angle1 - 2 * this.angle2));
      const accel1 = (num1 + num2 + num3 * num4) / den;

      const num5 = 2 * Math.sin(this.angle1 - this.angle2);
      const num6 = this.velocity1 * this.velocity1 * l1 * (m1 + m2);
      const num7 = g * (m1 + m2) * Math.cos(this.angle1);
      const num8 = this.velocity2 * this.velocity2 * l2 * m2 * Math.cos(this.angle1 - this.angle2);
      const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * this.angle1 - 2 * this.angle2));
      const accel2 = (num5 * (num6 + num7 + num8)) / den2;

      this.velocity1 += accel1 * dt / 5;
      this.velocity2 += accel2 * dt / 5;
      this.angle1 += this.velocity1 * dt / 5;
      this.angle2 += this.velocity2 * dt / 5;
    }

    this.updatePositions();

    if (this.trailPoints.length < 500) {
      this.trailPoints.push(this.bob2.position.clone());
      if (this.trailPoints.length > 1) {
        this.updateTrail();
      }
    } else {
      this.trailPoints.shift();
      this.trailPoints.push(this.bob2.position.clone());
      this.updateTrail();
    }
  }

  private updatePositions(): void {
    if (!this.bob1 || !this.bob2 || !this.rod1 || !this.rod2) return;

    const l1 = this.params.length1 as number || 2;
    const l2 = this.params.length2 as number || 2;

    const x1 = l1 * Math.sin(this.angle1);
    const y1 = 5 - l1 * Math.cos(this.angle1);
    const x2 = x1 + l2 * Math.sin(this.angle2);
    const y2 = y1 - l2 * Math.cos(this.angle2);

    this.bob1.position.set(x1, y1, 0);
    this.bob2.position.set(x2, y2, 0);

    const rod1Points = [new THREE.Vector3(0, 5, 0), new THREE.Vector3(x1, y1, 0)];
    this.rod1.geometry.setFromPoints(rod1Points);

    const rod2Points = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)];
    this.rod2.geometry.setFromPoints(rod2Points);
  }

  private updateTrail(): void {
    if (!this.scene) return;

    if (this.trail) {
      this.scene.remove(this.trail);
      this.trail.geometry.dispose();
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.6
    });
    this.trail = new THREE.Line(geometry, material);
    this.scene.add(this.trail);
  }

  reset(): void {
    this.angle1 = (this.params.angle1 as number || 90) * Math.PI / 180;
    this.angle2 = (this.params.angle2 as number || 90) * Math.PI / 180;
    this.velocity1 = 0;
    this.velocity2 = 0;
    this.trailPoints = [];
    if (this.trail && this.scene) {
      this.scene.remove(this.trail);
      this.trail = null;
    }
    this.updatePositions();
  }

  cleanup(): void {
    [this.pivot, this.bob1, this.bob2, this.rod1, this.rod2, this.trail].forEach(obj => {
      if (obj) {
        obj.parent?.remove(obj);
        if ('geometry' in obj) obj.geometry.dispose();
        if ('material' in obj) (obj.material as THREE.Material).dispose();
      }
    });
  }

  exportData(): unknown {
    return {
      angle1: this.angle1,
      angle2: this.angle2,
      velocity1: this.velocity1,
      velocity2: this.velocity2
    };
  }
}
