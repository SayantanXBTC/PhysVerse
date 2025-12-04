import * as THREE from 'three';
import { PhysicsSimulation, SimulationState, SimulationParameterDefinition } from '../types';

interface ProjectileState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  time: number;
  hasLanded: boolean;
}

export class ProjectileSimulation implements PhysicsSimulation {
  metadata = {
    id: 'projectile',
    name: 'Projectile Motion',
    description: 'Simulate projectile motion with gravity, air resistance, and trajectory visualization',
    category: 'mechanics',
    difficulty: 'beginner' as const,
    tags: ['physics', 'kinematics', 'trajectory'],
  };
  
  parameters: Record<string, SimulationParameterDefinition> = {
    initialVelocity: {
      label: 'Initial Velocity (m/s)',
      type: 'number',
      default: 20,
      min: 5,
      max: 50,
      step: 1,
    },
    angle: {
      label: 'Launch Angle (degrees)',
      type: 'number',
      default: 45,
      min: 0,
      max: 90,
      step: 5,
    },
    gravity: {
      label: 'Gravity (m/s²)',
      type: 'number',
      default: 9.81,
      min: 1,
      max: 20,
      step: 0.1,
    },
    airResistance: {
      label: 'Air Resistance',
      type: 'number',
      default: 0.01,
      min: 0,
      max: 0.1,
      step: 0.01,
    },
  };
  
  private state: ProjectileState;
  private currentParams: Record<string, unknown> = {};
  private projectile: THREE.Mesh | null = null;
  private trail: THREE.Line | null = null;
  private trailPoints: THREE.Vector3[] = [];
  private velocityArrow: THREE.ArrowHelper | null = null;
  private grid: THREE.GridHelper | null = null;
  private impactMarker: THREE.Mesh | null = null;
  private scene: THREE.Scene | null = null;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): ProjectileState {
    const angleRad = (this.getParameter('angle') * Math.PI) / 180;
    const v0 = this.getParameter('initialVelocity');
    
    return {
      time: 0,
      position: new THREE.Vector3(0, 0.5, 0),
      velocity: new THREE.Vector3(
        v0 * Math.cos(angleRad),
        v0 * Math.sin(angleRad),
        0
      ),
      hasLanded: false,
    };
  }

  private getParameter(name: string): number {
    return (this.currentParams[name] as number) ?? (this.parameters[name]?.default as number) ?? 0;
  }

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.currentParams = params;
    this.scene = scene;
    this.state = this.getInitialState();
    this.trailPoints = [];

    // Create ground grid
    this.grid = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
    this.grid.position.y = 0;
    scene.add(this.grid);

    // Create projectile with glow
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      emissive: 0xff2222,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.4,
    });
    this.projectile = new THREE.Mesh(geometry, material);
    this.projectile.position.copy(this.state.position);
    this.projectile.castShadow = true;
    scene.add(this.projectile);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.projectile.add(glow);

    // Create velocity arrow
    const direction = this.state.velocity.clone().normalize();
    const length = this.state.velocity.length() / 5;
    this.velocityArrow = new THREE.ArrowHelper(
      direction,
      this.state.position,
      length,
      0x00ff00,
      0.5,
      0.3
    );
    scene.add(this.velocityArrow);

    // Initialize trail
    this.updateTrail(scene);
  }

  private updateTrail(scene: THREE.Scene): void {
    if (this.trail) {
      scene.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
    }

    if (this.trailPoints.length < 2) return;

    const geometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
    
    // Create gradient colors
    const colors = new Float32Array(this.trailPoints.length * 3);
    for (let i = 0; i < this.trailPoints.length; i++) {
      const alpha = i / this.trailPoints.length;
      const color = new THREE.Color();
      color.setHSL(0.1 - alpha * 0.1, 1, 0.5); // Orange to red gradient
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 2,
      transparent: true,
      opacity: 0.8,
    });

    this.trail = new THREE.Line(geometry, material);
    scene.add(this.trail);
  }

  update(deltaTime: number, _state: SimulationState): void {
    if (!this.projectile || !this.scene || this.state.hasLanded) return;

    const dt = Math.min(deltaTime, 0.05);
    const g = this.getParameter('gravity');
    const k = this.getParameter('airResistance');

    // Apply forces
    const speed = this.state.velocity.length();
    const dragForce = this.state.velocity.clone().multiplyScalar(-k * speed);
    const acceleration = new THREE.Vector3(
      dragForce.x,
      -g + dragForce.y,
      dragForce.z
    );

    // Update velocity and position
    this.state.velocity.add(acceleration.multiplyScalar(dt));
    this.state.position.add(this.state.velocity.clone().multiplyScalar(dt));
    this.state.time += dt;

    // Check ground collision
    if (this.state.position.y <= 0.5) {
      this.state.position.y = 0.5;
      this.state.hasLanded = true;
      
      // Create impact marker
      if (!this.impactMarker) {
        const markerGeometry = new THREE.RingGeometry(0.5, 1, 32);
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        this.impactMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.impactMarker.rotation.x = -Math.PI / 2;
        this.impactMarker.position.copy(this.state.position);
        this.impactMarker.position.y = 0.01;
        this.scene.add(this.impactMarker);
      }
    }

    // Update visuals
    this.projectile.position.copy(this.state.position);

    // Update trail
    this.trailPoints.push(this.state.position.clone());
    if (this.trailPoints.length > 100) {
      this.trailPoints.shift();
    }
    this.updateTrail(this.scene);

    // Update velocity arrow
    if (this.velocityArrow && !this.state.hasLanded) {
      const direction = this.state.velocity.clone().normalize();
      const length = this.state.velocity.length() / 5;
      this.velocityArrow.setDirection(direction);
      this.velocityArrow.setLength(length, 0.5, 0.3);
      this.velocityArrow.position.copy(this.state.position);
    }

    // Color by speed
    const speedRatio = speed / this.getParameter('initialVelocity');
    const color = new THREE.Color();
    color.setHSL(0.6 - speedRatio * 0.6, 1, 0.5); // Blue to red
    (this.projectile.material as THREE.MeshStandardMaterial).color = color;
    (this.projectile.material as THREE.MeshStandardMaterial).emissive = color.multiplyScalar(0.5);
  }

  reset(): void {
    this.state = this.getInitialState();
    this.trailPoints = [];
    
    if (this.projectile) {
      this.projectile.position.copy(this.state.position);
    }
    
    if (this.impactMarker && this.scene) {
      this.scene.remove(this.impactMarker);
      this.impactMarker.geometry.dispose();
      (this.impactMarker.material as THREE.Material).dispose();
      this.impactMarker = null;
    }
    
    if (this.trail && this.scene) {
      this.scene.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
      this.trail = null;
    }
  }

  cleanup(): void {
    if (this.scene) {
      if (this.projectile) {
        this.scene.remove(this.projectile);
        this.projectile.geometry.dispose();
        (this.projectile.material as THREE.Material).dispose();
      }
      if (this.trail) {
        this.scene.remove(this.trail);
        this.trail.geometry.dispose();
        (this.trail.material as THREE.Material).dispose();
      }
      if (this.velocityArrow) {
        this.scene.remove(this.velocityArrow);
        this.velocityArrow.dispose();
      }
      if (this.grid) {
        this.scene.remove(this.grid);
        this.grid.geometry.dispose();
        (this.grid.material as THREE.Material).dispose();
      }
      if (this.impactMarker) {
        this.scene.remove(this.impactMarker);
        this.impactMarker.geometry.dispose();
        (this.impactMarker.material as THREE.Material).dispose();
      }
    }
  }

  getState(): Record<string, unknown> {
    return {
      position: this.state.position,
      velocity: this.state.velocity,
      time: this.state.time,
      hasLanded: this.state.hasLanded,
    };
  }

  exportData() {
    return {
      trajectory: this.trailPoints.map(p => ({ x: p.x, y: p.y, z: p.z })),
      finalPosition: { x: this.state.position.x, y: this.state.position.y, z: this.state.position.z },
      finalVelocity: { x: this.state.velocity.x, y: this.state.velocity.y, z: this.state.velocity.z },
      totalTime: this.state.time,
      hasLanded: this.state.hasLanded,
    };
  }
}