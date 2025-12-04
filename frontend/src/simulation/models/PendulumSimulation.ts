import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class PendulumSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'pendulum',
    name: 'Simple Pendulum',
    description: 'Classic pendulum motion with gravity and angular dynamics',
    category: 'Oscillations',
    difficulty: 'beginner',
    tags: ['pendulum', 'gravity', 'oscillation', 'angular']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    length: {
      label: 'Pendulum Length',
      type: 'number',
      default: 3,
      min: 0.5,
      max: 10,
      step: 0.1,
      description: 'Length of pendulum in meters'
    },
    angle: {
      label: 'Initial Angle',
      type: 'number',
      default: 45,
      min: 0,
      max: 90,
      step: 1,
      description: 'Initial angle in degrees'
    },
    gravity: {
      label: 'Gravity',
      type: 'number',
      default: 9.8,
      min: 0.1,
      max: 50,
      step: 0.1,
      description: 'Gravitational acceleration in m/s²'
    },
    damping: {
      label: 'Air Resistance',
      type: 'number',
      default: 0.01,
      min: 0,
      max: 0.5,
      step: 0.01,
      description: 'Air resistance coefficient'
    }
  };

  private pivot: THREE.Mesh | null = null;
  private rod: THREE.Mesh | null = null;
  private bob: THREE.Mesh | null = null;
  private trail: THREE.Line | null = null;
  private trailPoints: THREE.Vector3[] = [];
  private angle: number = 0;
  private angularVelocity: number = 0;
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.scene = scene;
    this.params = params;
    const initialAngle = (params.angle as number || 45) * Math.PI / 180;
    this.angle = initialAngle;
    this.angularVelocity = 0;

    const pivotGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const pivotMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    this.pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
    this.pivot.position.set(0, 5, 0);
    scene.add(this.pivot);

    const length = params.length as number || 3;
    const rodGeometry = new THREE.CylinderGeometry(0.05, 0.05, length, 8);
    const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    this.rod = new THREE.Mesh(rodGeometry, rodMaterial);
    scene.add(this.rod);

    const bobGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const bobMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xef4444,
      metalness: 0.3,
      roughness: 0.4
    });
    this.bob = new THREE.Mesh(bobGeometry, bobMaterial);
    this.bob.castShadow = true;
    scene.add(this.bob);

    this.updatePositions();
    this.trailPoints = [this.bob.position.clone()];
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.bob || !this.rod) return;

    const dt = Math.min(delta, 0.05);
    const length = this.params.length as number || 3;
    const gravity = this.params.gravity as number || 9.8;
    const damping = this.params.damping as number || 0.01;

    const angularAcceleration = -(gravity / length) * Math.sin(this.angle) - damping * this.angularVelocity;
    this.angularVelocity += angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;

    this.updatePositions();

    if (this.trailPoints.length < 200) {
      this.trailPoints.push(this.bob.position.clone());
      this.updateTrail();
    }
  }

  private updatePositions(): void {
    if (!this.bob || !this.rod || !this.pivot) return;

    const length = this.params.length as number || 3;
    const x = length * Math.sin(this.angle);
    const y = 5 - length * Math.cos(this.angle);

    this.bob.position.set(x, y, 0);

    this.rod.position.set(x / 2, 5 - length * Math.cos(this.angle) / 2, 0);
    this.rod.rotation.z = this.angle;
    this.rod.scale.y = 1;
  }

  private updateTrail(): void {
    if (!this.scene) return;
    
    if (this.trail) {
      this.scene.remove(this.trail);
      this.trail.geometry.dispose();
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
    const material = new THREE.LineBasicMaterial({ 
      color: 0xef4444,
      transparent: true,
      opacity: 0.5
    });
    this.trail = new THREE.Line(geometry, material);
    this.scene.add(this.trail);
  }

  reset(): void {
    const initialAngle = (this.params.angle as number || 45) * Math.PI / 180;
    this.angle = initialAngle;
    this.angularVelocity = 0;
    this.trailPoints = [];
    this.updatePositions();
    if (this.bob) {
      this.trailPoints = [this.bob.position.clone()];
    }
  }

  cleanup(): void {
    [this.pivot, this.rod, this.bob, this.trail].forEach(obj => {
      if (obj) {
        obj.parent?.remove(obj);
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      }
    });
    this.pivot = null;
    this.rod = null;
    this.bob = null;
    this.trail = null;
  }

  exportData(): unknown {
    return {
      angle: this.angle,
      angularVelocity: this.angularVelocity,
      trail: this.trailPoints.map(p => p.toArray())
    };
  }
}
