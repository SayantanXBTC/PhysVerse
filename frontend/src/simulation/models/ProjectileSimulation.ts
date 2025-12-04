import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class ProjectileSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'projectile',
    name: 'Projectile Motion',
    description: '3D projectile motion with gravity and collision detection',
    category: 'Kinematics',
    difficulty: 'beginner',
    tags: ['gravity', 'trajectory', 'collision']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    velocity: {
      label: 'Initial Velocity',
      type: 'number',
      default: 20,
      min: 1,
      max: 100,
      step: 0.5,
      description: 'Initial velocity in m/s'
    },
    angle: {
      label: 'Launch Angle',
      type: 'number',
      default: 45,
      min: 0,
      max: 90,
      step: 1,
      description: 'Launch angle in degrees'
    },
    gravity: {
      label: 'Gravity',
      type: 'number',
      default: 9.8,
      min: 0.1,
      max: 50,
      step: 0.1,
      description: 'Gravitational acceleration in m/s²'
    }
  };

  private ball: THREE.Mesh | null = null;
  private trail: THREE.Line | null = null;
  private ground: THREE.Mesh | null = null;
  private position: THREE.Vector3 = new THREE.Vector3();
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private trailPoints: THREE.Vector3[] = [];
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    const velocity = params.velocity as number || 20;
    const angle = params.angle as number || 45;
    const angleRad = (angle * Math.PI) / 180;

    this.position.set(0, 0.5, 0);
    this.velocity.set(
      velocity * Math.cos(angleRad),
      velocity * Math.sin(angleRad),
      0
    );

    this.trailPoints = [this.position.clone()];

    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6,
      metalness: 0.3,
      roughness: 0.4
    });
    this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.ball.position.copy(this.position);
    this.ball.castShadow = true;
    scene.add(this.ball);

    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.1,
      roughness: 0.8
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    scene.add(this.ground);

    this.updateTrail(scene);
  }

  update(delta: number, state: SimulationState): void {
    if (!this.ball) return;

    const gravity = this.params.gravity as number || 9.8;
    const dt = Math.min(delta, 0.1);

    this.velocity.y -= gravity * dt;
    this.position.add(this.velocity.clone().multiplyScalar(dt));

    if (this.position.y <= 0.5) {
      this.position.y = 0.5;
      this.velocity.y = 0;
      this.velocity.x *= 0.8;
    }

    this.ball.position.copy(this.position);

    if (this.trailPoints.length < 200) {
      this.trailPoints.push(this.position.clone());
      this.updateTrail(this.ball.parent as THREE.Scene);
    }
  }

  private updateTrail(scene: THREE.Scene): void {
    if (this.trail) {
      scene.remove(this.trail);
      this.trail.geometry.dispose();
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.6
    });
    this.trail = new THREE.Line(geometry, material);
    scene.add(this.trail);
  }

  reset(): void {
    this.position.set(0, 0.5, 0);
    const velocity = this.params.velocity as number || 20;
    const angle = this.params.angle as number || 45;
    const angleRad = (angle * Math.PI) / 180;
    
    this.velocity.set(
      velocity * Math.cos(angleRad),
      velocity * Math.sin(angleRad),
      0
    );
    
    this.trailPoints = [this.position.clone()];
    
    if (this.ball) {
      this.ball.position.copy(this.position);
      this.updateTrail(this.ball.parent as THREE.Scene);
    }
  }

  cleanup(): void {
    if (this.ball) {
      this.ball.parent?.remove(this.ball);
      this.ball.geometry.dispose();
      (this.ball.material as THREE.Material).dispose();
      this.ball = null;
    }
    if (this.trail) {
      this.trail.parent?.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
      this.trail = null;
    }
    if (this.ground) {
      this.ground.parent?.remove(this.ground);
      this.ground.geometry.dispose();
      (this.ground.material as THREE.Material).dispose();
      this.ground = null;
    }
  }

  exportData(): unknown {
    return {
      trailPoints: this.trailPoints.map(p => ({ x: p.x, y: p.y, z: p.z })),
      finalPosition: { x: this.position.x, y: this.position.y, z: this.position.z },
      finalVelocity: { x: this.velocity.x, y: this.velocity.y, z: this.velocity.z }
    };
  }
}
