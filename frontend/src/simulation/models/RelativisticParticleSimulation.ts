import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class RelativisticParticleSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'relativistic',
    name: 'Relativistic Particle',
    description: 'Particle accelerator demonstrating time dilation, length contraction, and relativistic effects',
    category: 'Relativity',
    difficulty: 'advanced',
    tags: ['relativity', 'speed-of-light', 'einstein', 'time-dilation', 'lorentz'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    velocity: { 
      label: 'Velocity (% of c)', 
      type: 'number', 
      default: 90, 
      min: 10, 
      max: 99.9, 
      step: 5, 
      description: 'Particle velocity as percentage of light speed' 
    },
    showClocks: {
      label: 'Show Time Dilation',
      type: 'boolean',
      default: true,
      description: 'Display time dilation clocks'
    },
    showTrail: {
      label: 'Show Spacetime Trail',
      type: 'boolean',
      default: true,
      description: 'Visualize particle path through spacetime'
    }
  };

  private acceleratorRing: THREE.Mesh | null = null;
  private particle: THREE.Mesh | null = null;
  private particleGlow: THREE.Mesh | null = null;
  private trail: THREE.Line | null = null;
  private trailPositions: THREE.Vector3[] = [];
  private restClock: THREE.Mesh | null = null;
  private movingClock: THREE.Mesh | null = null;
  private referenceFrame: THREE.Group | null = null;
  private time = 0;
  private properTime = 0;
  private angle = 0;
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;
  private readonly C = 299792458;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;
    this.properTime = 0;
    this.angle = 0;
    this.trailPositions = [];
    this.referenceFrame = new THREE.Group();

    const velocityPercent = params.velocity as number || 90;
    const showClocks = params.showClocks !== false;
    const showTrail = params.showTrail !== false;

    const ringGeometry = new THREE.TorusGeometry(5, 0.15, 32, 128);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a4a7a,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x1a2a4a,
      emissiveIntensity: 0.3
    });
    this.acceleratorRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.acceleratorRing.rotation.x = Math.PI / 2;
    this.referenceFrame.add(this.acceleratorRing);

    for (let i = 0; i < 16; i++) {
      const segmentAngle = (i / 16) * Math.PI * 2;
      const segmentGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.5);
      const segmentMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a6a9a,
        metalness: 0.8,
        roughness: 0.2
      });
      const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
      segment.position.set(Math.cos(segmentAngle) * 5, 0, Math.sin(segmentAngle) * 5);
      segment.lookAt(0, 0, 0);
      this.referenceFrame.add(segment);
    }

    const particleGeometry = new THREE.SphereGeometry(0.25, 64, 64);
    const particleMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      emissive: 0xff3366,
      emissiveIntensity: 2,
      metalness: 0.5,
      roughness: 0.2
    });
    this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
    this.particle.position.set(5, 0, 0);
    this.referenceFrame.add(this.particle);

    const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide
    });
    this.particleGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.particle.add(this.particleGlow);

    if (showTrail) {
      const trailGeometry = new THREE.BufferGeometry();
      const trailMaterial = new THREE.LineBasicMaterial({
        color: 0xff3366,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      this.trail = new THREE.Line(trailGeometry, trailMaterial);
      this.referenceFrame.add(this.trail);
    }

    if (showClocks) {
      const clockGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
      const restClockMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a9a4a,
        metalness: 0.6,
        roughness: 0.3
      });
      this.restClock = new THREE.Mesh(clockGeometry, restClockMaterial);
      this.restClock.position.set(-8, 0, 0);
      this.restClock.rotation.x = Math.PI / 2;
      
      const handGeometry = new THREE.BoxGeometry(0.05, 0.6, 0.05);
      const handMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const restHand = new THREE.Mesh(handGeometry, handMaterial);
      restHand.position.y = 0.15;
      restHand.userData = { type: 'rest' };
      this.restClock.add(restHand);
      this.referenceFrame.add(this.restClock);

      const movingClockMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6633,
        metalness: 0.6,
        roughness: 0.3
      });
      this.movingClock = new THREE.Mesh(clockGeometry.clone(), movingClockMaterial);
      this.movingClock.rotation.x = Math.PI / 2;
      this.movingClock.position.y = 1;
      
      const movingHand = new THREE.Mesh(handGeometry.clone(), handMaterial.clone());
      movingHand.position.y = 0.15;
      movingHand.userData = { type: 'moving' };
      this.movingClock.add(movingHand);
      this.particle.add(this.movingClock);
    }

    scene.add(this.referenceFrame);

    const light = new THREE.PointLight(0xffffff, 1, 50);
    light.position.set(0, 10, 0);
    scene.add(light);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.particle || !this.referenceFrame) return;

    const dt = Math.min(delta, 0.05);
    this.time += dt;

    const velocityPercent = this.params.velocity as number || 90;
    const beta = velocityPercent / 100;
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    
    this.properTime += dt / gamma;

    const angularVelocity = beta * 0.5;
    this.angle += angularVelocity * dt;

    this.particle.position.set(Math.cos(this.angle) * 5, 0, Math.sin(this.angle) * 5);

    const contractionFactor = 1 / gamma;
    const motionDirection = new THREE.Vector3(-Math.sin(this.angle), 0, Math.cos(this.angle));
    this.particle.scale.set(contractionFactor, 1, 1);
    this.particle.lookAt(
      this.particle.position.x + motionDirection.x,
      this.particle.position.y,
      this.particle.position.z + motionDirection.z
    );

    const dopplerFactor = Math.sqrt((1 - beta) / (1 + beta));
    const hue = 0.95 - (dopplerFactor - 0.1) * 0.5;
    const color = new THREE.Color().setHSL(Math.max(0, Math.min(1, hue)), 1, 0.5);
    (this.particle.material as THREE.MeshStandardMaterial).color = color;
    (this.particle.material as THREE.MeshStandardMaterial).emissive = color;

    if (this.particleGlow) {
      const pulse = 1 + Math.sin(this.time * 5) * 0.2;
      this.particleGlow.scale.setScalar(pulse * gamma * 0.5);
      (this.particleGlow.material as THREE.MeshBasicMaterial).color = color;
    }

    if (this.trail) {
      this.trailPositions.push(this.particle.position.clone());
      if (this.trailPositions.length > 100) {
        this.trailPositions.shift();
      }
      this.trail.geometry.setFromPoints(this.trailPositions);
    }

    if (this.restClock && this.movingClock) {
      const restHand = this.restClock.children[0] as THREE.Mesh;
      const movingHand = this.movingClock.children[0] as THREE.Mesh;
      restHand.rotation.z = -this.time * 2;
      movingHand.rotation.z = -this.properTime * 2;
    }

    this.referenceFrame.rotation.y += dt * 0.1;
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  cleanup(): void {
    if (this.referenceFrame) {
      this.referenceFrame.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        } else if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.referenceFrame.parent?.remove(this.referenceFrame);
    }
    this.trailPositions = [];
  }

  exportData(): unknown {
    const velocityPercent = this.params.velocity as number || 90;
    const beta = velocityPercent / 100;
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    
    return {
      time: this.time,
      properTime: this.properTime,
      velocity: beta * this.C,
      velocityPercent,
      gamma,
      timeDilation: gamma,
      lengthContraction: 1 / gamma,
      energy: gamma * 0.511,
      momentum: gamma * beta * 0.511
    };
  }
}
