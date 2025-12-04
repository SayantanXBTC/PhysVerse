import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

interface Body {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  trail: THREE.Vector3[];
  trailLine: THREE.Line | null;
}

export class TwoBodyOrbitSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'two-body-orbit',
    name: 'Two-Body Orbit',
    description: 'Newtonian gravity simulation with orbital mechanics',
    category: 'Gravity',
    difficulty: 'advanced',
    tags: ['gravity', 'orbit', 'newton', 'celestial']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    mass1: {
      label: 'Mass 1',
      type: 'number',
      default: 100,
      min: 1,
      max: 1000,
      step: 10,
      description: 'Mass of first body in kg'
    },
    mass2: {
      label: 'Mass 2',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 100,
      step: 0.5,
      description: 'Mass of second body in kg'
    },
    distance: {
      label: 'Initial Distance',
      type: 'number',
      default: 10,
      min: 1,
      max: 30,
      step: 0.5,
      description: 'Initial distance in meters'
    },
    velocity: {
      label: 'Orbital Velocity',
      type: 'number',
      default: 5,
      min: 0.1,
      max: 20,
      step: 0.1,
      description: 'Initial orbital velocity in m/s'
    }
  };

  private body1: Body | null = null;
  private body2: Body | null = null;
  private G: number = 1;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    const mass1 = params.mass1 as number || 100;
    const mass2 = params.mass2 as number || 1;
    const distance = params.distance as number || 10;
    const velocity = params.velocity as number || 5;

    const size1 = Math.max(0.5, Math.log(mass1 + 1) * 0.3);
    const size2 = Math.max(0.3, Math.log(mass2 + 1) * 0.3);

    const geometry1 = new THREE.SphereGeometry(size1, 32, 32);
    const material1 = new THREE.MeshStandardMaterial({ 
      color: 0xfbbf24,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.4
    });
    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.set(0, 0, 0);
    mesh1.castShadow = true;
    scene.add(mesh1);

    this.body1 = {
      mesh: mesh1,
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      mass: mass1,
      trail: [new THREE.Vector3(0, 0, 0)],
      trailLine: null
    };

    const geometry2 = new THREE.SphereGeometry(size2, 32, 32);
    const material2 = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6,
      metalness: 0.3,
      roughness: 0.4
    });
    const mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.set(distance, 0, 0);
    mesh2.castShadow = true;
    scene.add(mesh2);

    this.body2 = {
      mesh: mesh2,
      position: new THREE.Vector3(distance, 0, 0),
      velocity: new THREE.Vector3(0, velocity, 0),
      mass: mass2,
      trail: [new THREE.Vector3(distance, 0, 0)],
      trailLine: null
    };

    this.updateTrails(scene);
  }

  update(delta: number, state: SimulationState): void {
    if (!this.body1 || !this.body2) return;

    const dt = Math.min(delta, 0.05);

    const r = this.body2.position.clone().sub(this.body1.position);
    const distance = r.length();

    if (distance < 0.1) return;

    const forceMagnitude = (this.G * this.body1.mass * this.body2.mass) / (distance * distance);
    const forceDirection = r.normalize();
    const force = forceDirection.multiplyScalar(forceMagnitude);

    const acc1 = force.clone().divideScalar(this.body1.mass);
    const acc2 = force.clone().divideScalar(this.body2.mass).negate();

    this.body1.velocity.add(acc1.multiplyScalar(dt));
    this.body2.velocity.add(acc2.multiplyScalar(dt));

    this.body1.position.add(this.body1.velocity.clone().multiplyScalar(dt));
    this.body2.position.add(this.body2.velocity.clone().multiplyScalar(dt));

    this.body1.mesh.position.copy(this.body1.position);
    this.body2.mesh.position.copy(this.body2.position);

    if (this.body1.trail.length < 500) {
      this.body1.trail.push(this.body1.position.clone());
      this.body2.trail.push(this.body2.position.clone());
    } else {
      this.body1.trail.shift();
      this.body2.trail.shift();
      this.body1.trail.push(this.body1.position.clone());
      this.body2.trail.push(this.body2.position.clone());
    }

    if (state.time % 0.1 < dt) {
      this.updateTrails(this.body1.mesh.parent as THREE.Scene);
    }
  }

  private updateTrails(scene: THREE.Scene): void {
    if (!this.body1 || !this.body2) return;

    if (this.body1.trailLine) {
      scene.remove(this.body1.trailLine);
      this.body1.trailLine.geometry.dispose();
    }
    if (this.body2.trailLine) {
      scene.remove(this.body2.trailLine);
      this.body2.trailLine.geometry.dispose();
    }

    const geometry1 = new THREE.BufferGeometry().setFromPoints(this.body1.trail);
    const material1 = new THREE.LineBasicMaterial({ 
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.4
    });
    this.body1.trailLine = new THREE.Line(geometry1, material1);
    scene.add(this.body1.trailLine);

    const geometry2 = new THREE.BufferGeometry().setFromPoints(this.body2.trail);
    const material2 = new THREE.LineBasicMaterial({ 
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.4
    });
    this.body2.trailLine = new THREE.Line(geometry2, material2);
    scene.add(this.body2.trailLine);
  }

  reset(): void {
    const distance = this.params.distance as number || 10;
    const velocity = this.params.velocity as number || 5;

    if (this.body1 && this.body2) {
      this.body1.position.set(0, 0, 0);
      this.body1.velocity.set(0, 0, 0);
      this.body1.trail = [new THREE.Vector3(0, 0, 0)];
      this.body1.mesh.position.copy(this.body1.position);

      this.body2.position.set(distance, 0, 0);
      this.body2.velocity.set(0, velocity, 0);
      this.body2.trail = [new THREE.Vector3(distance, 0, 0)];
      this.body2.mesh.position.copy(this.body2.position);

      this.updateTrails(this.body1.mesh.parent as THREE.Scene);
    }
  }

  cleanup(): void {
    const cleanupBody = (body: Body | null) => {
      if (!body) return;
      
      body.mesh.parent?.remove(body.mesh);
      body.mesh.geometry.dispose();
      (body.mesh.material as THREE.Material).dispose();
      
      if (body.trailLine) {
        body.trailLine.parent?.remove(body.trailLine);
        body.trailLine.geometry.dispose();
        (body.trailLine.material as THREE.Material).dispose();
      }
    };

    cleanupBody(this.body1);
    cleanupBody(this.body2);
    this.body1 = null;
    this.body2 = null;
  }

  exportData(): unknown {
    return {
      body1: {
        position: this.body1?.position.toArray(),
        velocity: this.body1?.velocity.toArray(),
        trail: this.body1?.trail.map(p => p.toArray())
      },
      body2: {
        position: this.body2?.position.toArray(),
        velocity: this.body2?.velocity.toArray(),
        trail: this.body2?.trail.map(p => p.toArray())
      }
    };
  }
}
