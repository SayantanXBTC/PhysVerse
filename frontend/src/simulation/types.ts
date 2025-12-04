import * as THREE from 'three';

export type ParameterType = 'number' | 'boolean' | 'vector' | 'select';

export interface SimulationParameterDefinition {
  label: string;
  type: ParameterType;
  default: number | boolean | THREE.Vector3 | string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description?: string;
}

export interface SimulationMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  premium?: boolean;
}

export interface SimulationState {
  time: number;
  isPaused: boolean;
  data: Record<string, unknown>;
}

export interface PhysicsSimulation {
  metadata: SimulationMetadata;
  parameters: Record<string, SimulationParameterDefinition>;
  
  initialize(scene: THREE.Scene, params: Record<string, unknown>): void;
  update(delta: number, state: SimulationState): void;
  reset(): void;
  cleanup(): void;
  
  getState?(): Record<string, unknown>;
  exportData?(): unknown;
}

export interface SimulationDataPoint {
  time: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  energy?: number;
  [key: string]: unknown;
}
