import * as THREE from 'three';
import { PhysicsSimulation, SimulationState } from '../types';

export class SimulationEngine {
  private simulation: PhysicsSimulation | null = null;
  private scene: THREE.Scene;
  private state: SimulationState;
  private lastTime: number = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.state = {
      time: 0,
      isPaused: true,
      data: {}
    };
  }

  loadSimulation(simulation: PhysicsSimulation, params: Record<string, unknown>): void {
    if (this.simulation) {
      this.simulation.cleanup();
    }

    this.simulation = simulation;
    this.state = {
      time: 0,
      isPaused: true,
      data: {}
    };
    
    this.simulation.initialize(this.scene, params);
  }

  update(delta: number): void {
    if (!this.simulation || this.state.isPaused) return;

    this.state.time += delta;
    this.simulation.update(delta, this.state);
  }

  play(): void {
    this.state.isPaused = false;
  }

  pause(): void {
    this.state.isPaused = true;
  }

  reset(): void {
    if (this.simulation) {
      this.state.time = 0;
      this.state.isPaused = true;
      this.simulation.reset();
    }
  }

  updateParameters(params: Record<string, unknown>): void {
    if (this.simulation) {
      this.simulation.cleanup();
      this.simulation.initialize(this.scene, params);
      this.state.time = 0;
    }
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  exportData(): unknown {
    return this.simulation?.exportData?.() || null;
  }

  cleanup(): void {
    if (this.simulation) {
      this.simulation.cleanup();
      this.simulation = null;
    }
  }
}
