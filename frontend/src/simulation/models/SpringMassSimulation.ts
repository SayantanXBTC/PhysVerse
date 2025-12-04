import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class SpringMassSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'spring-mass',
    name: 'Spring-Mass System',
    description: 'Harmonic oscillation with damping using Hooke\'s law',
    category: 'Oscillations',
    difficulty: 'intermediate',
    tags: ['spring', 'oscillation', 'damping', 'hooke']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    mass: {
      label: 'Mass',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 10,
      step: 0.1,
      description: 'Mass in kg'
    },
    springConstant: {
      label: 'Spring Constant',
      type: 'number',
      default: 10,
      min: 1,
      max: 100,
      step: 0.5,
      description: 'Spring constant k in N/m'
    },
    damping: {
      label: 'Damping Coefficient',
      type: 'number',
      default: 0.1,
      min: 0,
      max: 20,
      step: 0.1,
      description: 'Damping coefficient'
    },
    displacement: {
      label: 'Initial Displacement',
      type: 'number',
      default: 2,
      min: 0.1,
      max: 5,
      step: 0.1,
      description: 'Initial displacement in meters'
    }
  };

  private mass: THREE.Mesh | null = null;
  private spring: THREE.Line | null = null;
  private anchor: THREE.Mesh | null = null;
  private equilibriumLine: THREE.Line | null = null;
  private position: number = 0;
  private velocity: number = 0;
  private anchorY: number = 5;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.position = params.displacement as number || 2;
    this.velocity = 0;

    const anchorGeometry = new THREE.BoxGeometry(1, 0.2, 1);
    const anchorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x666666,
      metalness: 0.5,
      roughness: 0.5
    });
    this.anchor = new THREE.Mesh(anchorGeometry, anchorMaterial);
    this.anchor.position.set(0, this.anchorY, 0);
    scene.add(this.anchor);

    const massGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const massMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xef4444,
      metalness: 0.3,
      roughness: 0.4
    });
    this.mass = new THREE.Mesh(massGeometry, massMaterial);
    this.mass.position.set(0, this.anchorY - this.position, 0);
    this.mass.castShadow = true;
    scene.add(this.mass);

    this.updateSpring(scene);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2, this.anchorY, 0),
      new THREE.Vector3(2, this.anchorY, 0)
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x4b5563,
      transparent: true,
      opacity: 0.3
    });
    this.equilibriumLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(this.equilibriumLine);
  }

  update(delta: number, state: SimulationState): void {
    if (!this.mass) return;

    const dt = Math.min(delta, 0.05);
    const mass = this.params.mass as number || 1;
    const k = this.params.springConstant as number || 10;
    const damping = this.params.damping as number || 0.1;

    const springForce = -k * this.position;
    const dampingForce = -damping * this.velocity;
    const totalForce = springForce + dampingForce;
    const acceleration = totalForce / mass;

    this.velocity += acceleration * dt;
    this.position += this.velocity * dt;

    this.mass.position.y = this.anchorY - this.position;
    this.updateSpring(this.mass.parent as THREE.Scene);
  }

  private updateSpring(scene: THREE.Scene): void {
    if (this.spring) {
      scene.remove(this.spring);
      this.spring.geometry.dispose();
    }

    const points = [
      new THREE.Vector3(0, this.anchorY, 0),
      new THREE.Vector3(0, this.anchorY - this.position, 0)
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 3 });
    this.spring = new THREE.Line(geometry, material);
    scene.add(this.spring);
  }

  reset(): void {
    this.position = this.params.displacement as number || 2;
    this.velocity = 0;
    
    if (this.mass) {
      this.mass.position.y = this.anchorY - this.position;
      this.updateSpring(this.mass.parent as THREE.Scene);
    }
  }

  cleanup(): void {
    if (this.mass) {
      this.mass.parent?.remove(this.mass);
      this.mass.geometry.dispose();
      (this.mass.material as THREE.Material).dispose();
      this.mass = null;
    }
    if (this.spring) {
      this.spring.parent?.remove(this.spring);
      this.spring.geometry.dispose();
      (this.spring.material as THREE.Material).dispose();
      this.spring = null;
    }
    if (this.anchor) {
      this.anchor.parent?.remove(this.anchor);
      this.anchor.geometry.dispose();
      (this.anchor.material as THREE.Material).dispose();
      this.anchor = null;
    }
    if (this.equilibriumLine) {
      this.equilibriumLine.parent?.remove(this.equilibriumLine);
      this.equilibriumLine.geometry.dispose();
      (this.equilibriumLine.material as THREE.Material).dispose();
      this.equilibriumLine = null;
    }
  }

  exportData(): unknown {
    return {
      position: this.position,
      velocity: this.velocity,
      energy: 0.5 * (this.params.mass as number) * this.velocity * this.velocity +
              0.5 * (this.params.springConstant as number) * this.position * this.position
    };
  }
}
