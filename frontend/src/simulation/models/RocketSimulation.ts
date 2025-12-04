import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class RocketSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'rocket',
    name: 'Rocket Launch',
    description: 'Rocket launch with thrust, gravity, and atmospheric drag',
    category: 'Aerospace',
    difficulty: 'intermediate',
    tags: ['rocket', 'thrust', 'drag', 'aerospace']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    thrust: {
      label: 'Thrust Force',
      type: 'number',
      default: 25,
      min: 10,
      max: 50,
      step: 1,
      description: 'Rocket thrust in Newtons'
    },
    mass: {
      label: 'Rocket Mass',
      type: 'number',
      default: 2,
      min: 0.5,
      max: 10,
      step: 0.5,
      description: 'Mass in kg'
    },
    drag: {
      label: 'Air Resistance',
      type: 'number',
      default: 0.1,
      min: 0,
      max: 1,
      step: 0.05,
      description: 'Drag coefficient'
    }
  };

  private rocket: THREE.Group | null = null;
  private particles: THREE.Points | null = null;
  private velocity = new THREE.Vector3();
  private position = new THREE.Vector3(0, 0.5, 0);
  private params: Record<string, unknown> = {};
  private particlePositions: Float32Array | null = null;
  private particleVelocities: THREE.Vector3[] = [];

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.velocity.set(0, 0, 0);
    this.position.set(0, 0.5, 0);

    this.rocket = new THREE.Group();
    
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    this.rocket.add(body);

    const coneGeometry = new THREE.ConeGeometry(0.2, 0.5, 16);
    const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.y = 1.75;
    this.rocket.add(cone);

    const finGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.3);
    const finMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      const angle = (i / 4) * Math.PI * 2;
      fin.position.x = Math.cos(angle) * 0.2;
      fin.position.z = Math.sin(angle) * 0.2;
      fin.position.y = 0.2;
      fin.rotation.y = angle;
      this.rocket.add(fin);
    }

    scene.add(this.rocket);

    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(particleCount * 3);
    this.particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      this.particlePositions[i * 3] = 0;
      this.particlePositions[i * 3 + 1] = -10;
      this.particlePositions[i * 3 + 2] = 0;
      this.particleVelocities.push(new THREE.Vector3());
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    const material = new THREE.PointsMaterial({ 
      color: 0xff6600,
      size: 0.2,
      transparent: true,
      opacity: 0.8
    });
    this.particles = new THREE.Points(geometry, material);
    scene.add(this.particles);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.rocket || !this.particles || !this.particlePositions) return;

    const dt = Math.min(delta, 0.05);
    const thrust = this.params.thrust as number || 25;
    const mass = this.params.mass as number || 2;
    const drag = this.params.drag as number || 0.1;
    const gravity = 9.8;

    const thrustForce = thrust / mass;
    const dragForce = drag * this.velocity.lengthSq();
    
    this.velocity.y += (thrustForce - gravity - dragForce) * dt;
    this.position.add(this.velocity.clone().multiplyScalar(dt));

    if (this.position.y < 0.5) {
      this.position.y = 0.5;
      this.velocity.y = 0;
    }

    this.rocket.position.copy(this.position);
    this.rocket.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;

    for (let i = 0; i < this.particleVelocities.length; i++) {
      if (Math.random() < 0.3) {
        this.particlePositions[i * 3] = this.position.x + (Math.random() - 0.5) * 0.2;
        this.particlePositions[i * 3 + 1] = this.position.y - 0.5;
        this.particlePositions[i * 3 + 2] = this.position.z + (Math.random() - 0.5) * 0.2;
        
        this.particleVelocities[i].set(
          (Math.random() - 0.5) * 2,
          -thrust * 0.2 - Math.random() * 5,
          (Math.random() - 0.5) * 2
        );
      }

      this.particleVelocities[i].y -= gravity * dt * 0.5;
      this.particlePositions[i * 3] += this.particleVelocities[i].x * dt;
      this.particlePositions[i * 3 + 1] += this.particleVelocities[i].y * dt;
      this.particlePositions[i * 3 + 2] += this.particleVelocities[i].z * dt;

      if (this.particlePositions[i * 3 + 1] < 0) {
        this.particlePositions[i * 3 + 1] = -10;
      }
    }

    (this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  reset(): void {
    this.velocity.set(0, 0, 0);
    this.position.set(0, 0.5, 0);
    if (this.rocket) {
      this.rocket.position.copy(this.position);
      this.rocket.rotation.set(0, 0, 0);
    }
  }

  cleanup(): void {
    if (this.rocket) {
      this.rocket.parent?.remove(this.rocket);
      this.rocket.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
    }
    if (this.particles) {
      this.particles.parent?.remove(this.particles);
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
  }

  exportData(): unknown {
    return {
      position: this.position.toArray(),
      velocity: this.velocity.toArray()
    };
  }
}
