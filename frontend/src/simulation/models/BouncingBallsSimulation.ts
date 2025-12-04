import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class BouncingBallsSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'bouncing-balls',
    name: 'Bouncing Balls',
    description: 'Multiple balls bouncing with realistic physics and collisions',
    category: 'Dynamics',
    difficulty: 'beginner',
    tags: ['collision', 'bounce', 'gravity', 'elastic']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    ballCount: {
      label: 'Number of Balls',
      type: 'number',
      default: 5,
      min: 1,
      max: 20,
      step: 1,
      description: 'Number of bouncing balls'
    },
    gravity: {
      label: 'Gravity',
      type: 'number',
      default: 9.8,
      min: 0,
      max: 30,
      step: 0.5,
      description: 'Gravitational acceleration'
    },
    elasticity: {
      label: 'Elasticity',
      type: 'number',
      default: 0.85,
      min: 0.1,
      max: 1,
      step: 0.05,
      description: 'Bounce coefficient'
    }
  };

  private balls: Array<{ mesh: THREE.Mesh; velocity: THREE.Vector3; radius: number }> = [];
  private floor: THREE.Mesh | null = null;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;

    const floorGeometry = new THREE.BoxGeometry(15, 0.2, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.position.y = -0.1;
    this.floor.receiveShadow = true;
    scene.add(this.floor);

    const count = params.ballCount as number || 5;
    const colors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899];

    for (let i = 0; i < count; i++) {
      const radius = 0.3 + Math.random() * 0.3;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({ 
        color: colors[i % colors.length],
        metalness: 0.3,
        roughness: 0.4
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        2 + i * 1.5,
        (Math.random() - 0.5) * 8
      );

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        Math.random() * 2,
        (Math.random() - 0.5) * 5
      );

      scene.add(mesh);
      this.balls.push({ mesh, velocity, radius });
    }
  }

  update(delta: number, _state: SimulationState): void {
    const dt = Math.min(delta, 0.05);
    const gravity = this.params.gravity as number || 9.8;
    const elasticity = this.params.elasticity as number || 0.85;

    this.balls.forEach(ball => {
      ball.velocity.y -= gravity * dt;
      ball.mesh.position.add(ball.velocity.clone().multiplyScalar(dt));

      if (ball.mesh.position.y - ball.radius < 0) {
        ball.mesh.position.y = ball.radius;
        ball.velocity.y *= -elasticity;
      }

      const boundary = 7;
      if (Math.abs(ball.mesh.position.x) > boundary) {
        ball.mesh.position.x = Math.sign(ball.mesh.position.x) * boundary;
        ball.velocity.x *= -elasticity;
      }
      if (Math.abs(ball.mesh.position.z) > boundary) {
        ball.mesh.position.z = Math.sign(ball.mesh.position.z) * boundary;
        ball.velocity.z *= -elasticity;
      }

      ball.mesh.rotation.x += ball.velocity.z * dt;
      ball.mesh.rotation.z -= ball.velocity.x * dt;
    });

    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        this.checkCollision(this.balls[i], this.balls[j]);
      }
    }
  }

  private checkCollision(ball1: typeof this.balls[0], ball2: typeof this.balls[0]): void {
    const diff = ball1.mesh.position.clone().sub(ball2.mesh.position);
    const distance = diff.length();
    const minDist = ball1.radius + ball2.radius;

    if (distance < minDist) {
      const normal = diff.normalize();
      const relativeVelocity = ball1.velocity.clone().sub(ball2.velocity);
      const speed = relativeVelocity.dot(normal);

      if (speed < 0) {
        const impulse = (2 * speed) / 2;
        ball1.velocity.sub(normal.clone().multiplyScalar(impulse));
        ball2.velocity.add(normal.clone().multiplyScalar(impulse));

        const overlap = minDist - distance;
        ball1.mesh.position.add(normal.clone().multiplyScalar(overlap / 2));
        ball2.mesh.position.sub(normal.clone().multiplyScalar(overlap / 2));
      }
    }
  }

  reset(): void {
    this.balls.forEach((ball, i) => {
      ball.mesh.position.set(
        (Math.random() - 0.5) * 8,
        2 + i * 1.5,
        (Math.random() - 0.5) * 8
      );
      ball.velocity.set(
        (Math.random() - 0.5) * 5,
        Math.random() * 2,
        (Math.random() - 0.5) * 5
      );
    });
  }

  cleanup(): void {
    this.balls.forEach(ball => {
      ball.mesh.parent?.remove(ball.mesh);
      ball.mesh.geometry.dispose();
      (ball.mesh.material as THREE.Material).dispose();
    });
    if (this.floor) {
      this.floor.parent?.remove(this.floor);
      this.floor.geometry.dispose();
      (this.floor.material as THREE.Material).dispose();
    }
    this.balls = [];
  }

  exportData(): unknown {
    return {
      balls: this.balls.map(b => ({
        position: b.mesh.position.toArray(),
        velocity: b.velocity.toArray()
      }))
    };
  }
}
