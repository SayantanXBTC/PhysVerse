import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class SuperconductorSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'superconductor',
    name: 'Superconductor',
    description: 'Magnetic levitation and Meissner effect',
    category: 'Condensed Matter',
    difficulty: 'advanced',
    tags: ['superconductor', 'levitation', 'magnetic', 'quantum'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    temperature: { 
      label: 'Temperature (K)', 
      type: 'number', 
      default: 4, 
      min: 1, 
      max: 20, 
      step: 1, 
      description: 'Temperature in Kelvin' 
    },
    magneticField: {
      label: 'Magnetic Field Strength',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'External magnetic field'
    }
  };

  private group: THREE.Group | null = null;
  private fieldLines: THREE.Line[] = [];
  private time = 0;
  private criticalTemp = 9.2; // Kelvin

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.time = 0;
    this.group = new THREE.Group();
    this.fieldLines = [];

    const temp = (params.temperature as number) || 4;
    const isSuperconduct = temp < this.criticalTemp;

    // Superconductor disk with frost effect
    const diskGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.4, 64);
    const diskMaterial = new THREE.MeshStandardMaterial({ 
      color: isSuperconduct ? 0x1976d2 : 0x666666,
      metalness: 0.9, 
      roughness: 0.1,
      emissive: isSuperconduct ? 0x0d47a1 : 0x000000,
      emissiveIntensity: isSuperconduct ? 0.3 : 0
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.position.y = -0.2;
    this.group.add(disk);

    // Cold vapor effect
    if (isSuperconduct) {
      const vaporGeometry = new THREE.SphereGeometry(2.8, 32, 32);
      const vaporMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xaaddff, 
        transparent: true, 
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      const vapor = new THREE.Mesh(vaporGeometry, vaporMaterial);
      vapor.position.y = -0.2;
      vapor.scale.y = 0.3;
      this.group.add(vapor);
    }

    // Levitating magnet
    const magnetGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.8);
    const magnetMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd32f2f,
      metalness: 0.7,
      roughness: 0.3
    });
    const magnet = new THREE.Mesh(magnetGeometry, magnetMaterial);
    magnet.position.y = isSuperconduct ? 2 : 0.5;
    this.group.add(magnet);

    // Magnetic field lines showing Meissner effect
    const fieldStrength = (params.magneticField as number) || 1;
    const lineCount = Math.floor(12 * fieldStrength);
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const points = [];
      
      for (let j = 0; j < 30; j++) {
        const t = j / 29;
        let radius, y;
        
        if (isSuperconduct) {
          // Field lines expelled (Meissner effect)
          if (t < 0.3) {
            radius = 0.6 + t * 2;
            y = 2 - t * 3;
          } else {
            radius = 1.2 + (t - 0.3) * 2;
            y = 1.1 - (t - 0.3) * 4 + Math.sin((t - 0.3) * Math.PI) * 0.8;
          }
        } else {
          // Normal field lines pass through
          radius = 0.6 + t * 1.5;
          y = 2 - t * 4;
        }
        
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ));
      }
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: isSuperconduct ? 0x00ff88 : 0x888888,
        transparent: true, 
        opacity: 0.6 
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.group.add(line);
      this.fieldLines.push(line);
    }

    scene.add(this.group);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.group) return;
    this.time += delta;
    
    const magnet = this.group.children.find(child => 
      child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry
    );
    
    if (magnet) {
      // Gentle levitation oscillation
      const baseY = magnet.position.y > 1 ? 2 : 0.5;
      magnet.position.y = baseY + Math.sin(this.time * 1.5) * 0.08;
      magnet.rotation.y += delta * 0.5;
      magnet.rotation.x = Math.sin(this.time * 0.8) * 0.1;
    }

    // Animate vapor if present
    const vapor = this.group.children.find(child => 
      child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry
    );
    if (vapor && vapor instanceof THREE.Mesh) {
      vapor.rotation.y += delta * 0.3;
      const material = vapor.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(this.time * 2) * 0.05;
    }
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
