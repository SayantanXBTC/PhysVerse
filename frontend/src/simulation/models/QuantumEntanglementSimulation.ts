import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

interface EntangledParticle {
  mesh: THREE.Mesh;
  glow: THREE.Mesh;
  spinState: THREE.Vector3;
  waveFunction: THREE.Points;
}

export class QuantumEntanglementSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'entanglement',
    name: 'Quantum Entanglement',
    description: 'Visualize spooky action at a distance with correlated quantum states and wave function collapse',
    category: 'Quantum',
    difficulty: 'advanced',
    tags: ['entanglement', 'quantum', 'bell', 'correlation', 'superposition'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    measurementRate: { 
      label: 'Measurement Rate', 
      type: 'number', 
      default: 1, 
      min: 0.1, 
      max: 3, 
      step: 0.1, 
      description: 'Frequency of quantum measurements' 
    },
    entanglementStrength: {
      label: 'Entanglement Strength',
      type: 'number',
      default: 1,
      min: 0.3,
      max: 1,
      step: 0.1,
      description: 'Degree of quantum correlation'
    }
  };

  private particles: EntangledParticle[] = [];
  private connectionLines: THREE.Line[] = [];
  private quantumField: THREE.Points | null = null;
  private time = 0;
  private measurementTimer = 0;
  private lastMeasurement: { spin1: THREE.Vector3; spin2: THREE.Vector3 } | null = null;
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;
    this.measurementTimer = 0;
    this.particles = [];
    this.connectionLines = [];

    // Create quantum field background
    const fieldGeometry = new THREE.BufferGeometry();
    const fieldPositions = new Float32Array(500 * 3);
    const fieldColors = new Float32Array(500 * 3);
    
    for (let i = 0; i < 500; i++) {
      fieldPositions[i * 3] = (Math.random() - 0.5) * 20;
      fieldPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      fieldPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.3);
      fieldColors[i * 3] = color.r;
      fieldColors[i * 3 + 1] = color.g;
      fieldColors[i * 3 + 2] = color.b;
    }
    
    fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
    fieldGeometry.setAttribute('color', new THREE.BufferAttribute(fieldColors, 3));
    
    const fieldMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    this.quantumField = new THREE.Points(fieldGeometry, fieldMaterial);
    scene.add(this.quantumField);

    // Create two entangled particles with advanced visuals
    for (let i = 0; i < 2; i++) {
      const x = i === 0 ? -4 : 4;
      const baseColor = i === 0 ? new THREE.Color(0xff3366) : new THREE.Color(0x3366ff);
      
      // Main particle
      const particleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const particleMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: baseColor,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(x, 0, 0);
      scene.add(particle);

      // Glow effect
      const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      particle.add(glow);

      // Wave function cloud
      const waveGeometry = new THREE.BufferGeometry();
      const wavePositions = new Float32Array(100 * 3);
      const waveColors = new Float32Array(100 * 3);
      
      for (let j = 0; j < 100; j++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 0.8 + Math.random() * 0.5;
        
        wavePositions[j * 3] = x + r * Math.sin(phi) * Math.cos(theta);
        wavePositions[j * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        wavePositions[j * 3 + 2] = r * Math.cos(phi);
        
        waveColors[j * 3] = baseColor.r;
        waveColors[j * 3 + 1] = baseColor.g;
        waveColors[j * 3 + 2] = baseColor.b;
      }
      
      waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
      waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));
      
      const waveMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      
      const waveFunction = new THREE.Points(waveGeometry, waveMaterial);
      scene.add(waveFunction);

      this.particles.push({
        mesh: particle,
        glow,
        spinState: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        waveFunction
      });
    }

    // Create entanglement connection with multiple lines
    for (let i = 0; i < 5; i++) {
      const points = [
        this.particles[0].mesh.position.clone(),
        this.particles[1].mesh.position.clone()
      ];
      const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const connectionMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(0.5 + i * 0.05, 0.8, 0.5),
        transparent: true,
        opacity: 0.3,
        linewidth: 2
      });
      const connection = new THREE.Line(connectionGeometry, connectionMaterial);
      scene.add(connection);
      this.connectionLines.push(connection);
    }
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.particles.length) return;
    
    const dt = Math.min(delta, 0.05);
    this.time += dt;
    this.measurementTimer += dt;
    
    const measurementRate = this.params.measurementRate as number || 1;
    const entanglementStrength = this.params.entanglementStrength as number || 1;
    
    // Quantum measurement events
    if (this.measurementTimer > 1 / measurementRate) {
      this.performMeasurement();
      this.measurementTimer = 0;
    }

    // Update particles
    this.particles.forEach((particle, idx) => {
      // Rotate particle
      particle.mesh.rotation.y += dt * 2;
      particle.mesh.rotation.x += dt * 1.5;
      
      // Pulsing glow
      const pulse = 1 + Math.sin(this.time * 3 + idx * Math.PI) * 0.2;
      particle.glow.scale.setScalar(pulse);
      
      // Update wave function (superposition visualization)
      const wavePositions = (particle.waveFunction.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const baseX = particle.mesh.position.x;
      
      for (let i = 0; i < wavePositions.length / 3; i++) {
        const angle = this.time * 2 + i * 0.1;
        const radius = 0.8 + Math.sin(angle) * 0.3;
        const theta = (i / (wavePositions.length / 3)) * Math.PI * 2 + this.time;
        const phi = Math.sin(this.time + i * 0.05) * Math.PI;
        
        wavePositions[i * 3] = baseX + radius * Math.sin(phi) * Math.cos(theta);
        wavePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        wavePositions[i * 3 + 2] = radius * Math.cos(phi);
      }
      
      (particle.waveFunction.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      
      // Spin visualization (correlated spins)
      if (this.lastMeasurement) {
        const targetSpin = idx === 0 ? this.lastMeasurement.spin1 : this.lastMeasurement.spin2;
        particle.spinState.lerp(targetSpin, dt * 2 * entanglementStrength);
      }
      
      // Apply spin rotation
      const spinAxis = particle.spinState.clone().normalize();
      particle.mesh.rotateOnAxis(spinAxis, dt * 3);
    });

    // Animate entanglement connections
    this.connectionLines.forEach((line, idx) => {
      const positions = (line.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const offset = Math.sin(this.time * 2 + idx * 0.5) * 0.3;
      
      positions[1] = offset;
      positions[4] = -offset;
      
      (line.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      
      // Pulsing opacity
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = 0.2 + Math.sin(this.time * 3 + idx * 0.8) * 0.15;
    });

    // Animate quantum field
    if (this.quantumField) {
      this.quantumField.rotation.y += dt * 0.1;
      const fieldPositions = (this.quantumField.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      
      for (let i = 0; i < fieldPositions.length / 3; i++) {
        fieldPositions[i * 3 + 1] += Math.sin(this.time * 2 + i * 0.1) * 0.01;
      }
      
      (this.quantumField.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  private performMeasurement(): void {
    // Simulate quantum measurement - collapse wave function
    const randomAxis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    
    // Entangled particles have opposite spins
    this.lastMeasurement = {
      spin1: randomAxis.clone(),
      spin2: randomAxis.clone().negate()
    };
    
    // Visual feedback - flash
    this.particles.forEach(particle => {
      const material = particle.mesh.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 3;
      setTimeout(() => {
        material.emissiveIntensity = 1.5;
      }, 100);
    });
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  cleanup(): void {
    this.particles.forEach(particle => {
      particle.mesh.parent?.remove(particle.mesh);
      particle.mesh.geometry.dispose();
      (particle.mesh.material as THREE.Material).dispose();
      particle.glow.geometry.dispose();
      (particle.glow.material as THREE.Material).dispose();
      particle.waveFunction.parent?.remove(particle.waveFunction);
      particle.waveFunction.geometry.dispose();
      (particle.waveFunction.material as THREE.Material).dispose();
    });
    
    this.connectionLines.forEach(line => {
      line.parent?.remove(line);
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    });
    
    if (this.quantumField) {
      this.quantumField.parent?.remove(this.quantumField);
      this.quantumField.geometry.dispose();
      (this.quantumField.material as THREE.Material).dispose();
    }
    
    this.particles = [];
    this.connectionLines = [];
  }

  exportData(): unknown {
    return {
      time: this.time,
      measurements: this.lastMeasurement ? {
        particle1Spin: this.lastMeasurement.spin1.toArray(),
        particle2Spin: this.lastMeasurement.spin2.toArray(),
        correlation: this.lastMeasurement.spin1.dot(this.lastMeasurement.spin2)
      } : null,
      entanglementStrength: this.params.entanglementStrength
    };
  }
}
