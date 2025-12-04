import * as THREE from 'three';
import { PhysicsSimulation, SimulationState } from '../types';

export class SimulationEngine {
  private simulation: PhysicsSimulation | null = null;
  private scene: THREE.Scene;
  private state: SimulationState;
  private isCleaningUp: boolean = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.state = {
      time: 0,
      isPaused: true,
      data: {}
    };
  }

  loadSimulation(simulation: PhysicsSimulation, params: Record<string, unknown>): void {
    // Prevent loading during cleanup
    if (this.isCleaningUp) return;

    // Clean up previous simulation safely
    if (this.simulation) {
      try {
        this.simulation.cleanup();
      } catch (error) {
        console.error('Error cleaning up previous simulation:', error);
      }
    }

    this.simulation = simulation;
    this.state = {
      time: 0,
      isPaused: true,
      data: {}
    };
    
    try {
      this.simulation.initialize(this.scene, params);
    } catch (error) {
      console.error('Error initializing simulation:', error);
      this.simulation = null;
    }
  }

  update(delta: number): void {
    if (!this.simulation || this.state.isPaused || this.isCleaningUp) return;

    try {
      this.state.time += delta;
      this.simulation.update(delta, this.state);
    } catch (error) {
      console.error('Error updating simulation:', error);
      this.pause();
    }
  }

  play(): void {
    this.state.isPaused = false;
  }

  pause(): void {
    this.state.isPaused = true;
  }

  reset(): void {
    if (this.simulation && !this.isCleaningUp) {
      try {
        this.state.time = 0;
        this.state.isPaused = true;
        this.simulation.reset();
      } catch (error) {
        console.error('Error resetting simulation:', error);
      }
    }
  }

  updateParameters(params: Record<string, unknown>): void {
    if (this.simulation && !this.isCleaningUp) {
      try {
        this.simulation.cleanup();
        this.simulation.initialize(this.scene, params);
        this.state.time = 0;
      } catch (error) {
        console.error('Error updating parameters:', error);
      }
    }
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  exportData(): unknown {
    try {
      return this.simulation?.exportData?.() || null;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  cleanup(): void {
    this.isCleaningUp = true;
    this.pause();
    
    if (this.simulation) {
      try {
        this.simulation.cleanup();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
      this.simulation = null;
    }
    
    this.isCleaningUp = false;
  }
}
