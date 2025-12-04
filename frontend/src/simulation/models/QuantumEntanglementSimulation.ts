import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class QuantumEntanglementSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'entanglement',
    name: 'Quantum Entanglement',
    description: 'Spooky action at a distance visualization',
    category: 'Quantum',
    difficulty: 'advanced',
    tags: ['entanglement', 'quantum', 'bell', 'correlation'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    intensity: { label: 'Intensity', type: 'number', default: 1, min: 0.1, max: 3, step: 0.1, description: 'Simulation intensity' }
  };

  private group: THREE.Group | null = null;
  private time = 0;
  private params: Record<string, unknown> = {};

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.time = 0;
    this.group = new THREE.Group();

    // Two entangled particles
    const particle1Geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particle1Material = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    const particle1 = new THREE.Mesh(particle1Geometry, particle1Material);
    particle1.position.x = -3;
    this.group.add(particle1);

    const particle2Geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const particle2Material = new THREE.MeshStandardMaterial({ 
      color: 0x0000ff,
      emissive: 0x0000ff,
      emissiveIntensity: 0.5
    });
    const particle2 = new THREE.Mesh(particle2Geometry, particle2Material);
    particle2.position.x = 3;
    this.group.add(particle2);

    // Entanglement connection
    const points = [particle1.position, particle2.position];
    const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const connectionMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5
    });
    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
    this.group.add(connection);

    // Quantum state indicators (spinning arrows)
    for (let i = 0; i < 2; i++) {
      const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
      const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.x = i === 0 ? -3 : 3;
      arrow.position.y = 0.8;
      this.group.add(arrow);
    }

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    
    // Synchronized rotation (entanglement)
    const arrow1 = this.group.children[3] as THREE.Mesh;
    const arrow2 = this.group.children[4] as THREE.Mesh;
    
    arrow1.rotation.y = this.time * 2;
    arrow2.rotation.y = -this.time * 2; // Opposite spin
    
    // Pulsing effect
    const scale = 1 + Math.sin(this.time * 3) * 0.2;
    arrow1.scale.set(scale, scale, scale);
    arrow2.scale.set(scale, scale, scale);
  }

  reset(): void {
    this.time = 0;
  }

  cleanup(): void {
    if (this.group) {
      this.group.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.group.parent?.remove(this.group);
    }
  }

  exportData(): unknown {
    return { time: this.time };
  }
}
