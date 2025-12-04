import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class NewtonsCradleSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'newtons-cradle',
    name: "Newton's Cradle",
    description: 'Classic momentum and energy conservation demonstration',
    category: 'Mechanics',
    difficulty: 'beginner',
    tags: ['momentum', 'energy', 'collision', 'conservation'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    ballCount: { label: 'Number of Balls', type: 'number', default: 5, min: 3, max: 7, step: 1, description: 'Number of balls' },
    amplitude: { label: 'Swing Amplitude', type: 'number', default: 45, min: 10, max: 60, step: 5, description: 'Initial swing angle' }
  };

  private balls: THREE.Mesh[] = [];
  private angles: number[] = [];
  private velocities: number[] = [];
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    const count = params.ballCount as number || 5;
    const spacing = 1.1;

    for (let i = 0; i < count; i++) {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
      const ball = new THREE.Mesh(geometry, material);
      ball.position.x = (i - count / 2) * spacing;
      ball.position.y = -3;
      scene.add(ball);
      this.balls.push(ball);
      this.angles.push(i === 0 ? (params.amplitude as number || 45) * Math.PI / 180 : 0);
      this.velocities.push(0);
    }
  }

  update(delta: number, _state: SimulationState): void {
    const g = 9.8;
    const length = 3;

    for (let i = 0; i < this.balls.length; i++) {
      this.velocities[i] += -(g / length) * Math.sin(this.angles[i]) * delta;
      this.angles[i] += this.velocities[i] * delta;

      const x = (i - this.balls.length / 2) * 1.1 + length * Math.sin(this.angles[i]);
      const y = 2 - length * Math.cos(this.angles[i]);
      this.balls[i].position.set(x, y, 0);
    }

    for (let i = 0; i < this.balls.length - 1; i++) {
      if (Math.abs(this.balls[i].position.x - this.balls[i + 1].position.x) < 1) {
        const temp = this.velocities[i];
        this.velocities[i] = this.velocities[i + 1];
        this.velocities[i + 1] = temp;
      }
    }
  }

  reset(): void {
    this.angles = this.balls.map((_, i) => i === 0 ? (this.params.amplitude as number || 45) * Math.PI / 180 : 0);
    this.velocities = this.balls.map(() => 0);
  }

  cleanup(): void {
    this.balls.forEach(ball => {
      ball.parent?.remove(ball);
      ball.geometry.dispose();
      (ball.material as THREE.Material).dispose();
    });
  }

  exportData(): unknown {
    return { angles: this.angles };
  }
}
