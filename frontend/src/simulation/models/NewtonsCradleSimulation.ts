import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class NewtonsCradleSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'newtons-cradle',
    name: "Newton's Cradle",
    description: 'Classic momentum and energy conservation demonstration with realistic physics',
    category: 'Mechanics',
    difficulty: 'beginner',
    tags: ['momentum', 'energy', 'collision', 'conservation'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    ballCount: { label: 'Number of Balls', type: 'number', default: 5, min: 3, max: 7, step: 1, description: 'Number of balls' },
    amplitude: { label: 'Swing Amplitude', type: 'number', default: 45, min: 10, max: 70, step: 5, description: 'Initial swing angle (degrees)' },
    damping: { label: 'Air Resistance', type: 'number', default: 0.998, min: 0.99, max: 1.0, step: 0.001, description: 'Energy damping factor' }
  };

  private balls: THREE.Mesh[] = [];
  private strings: THREE.Line[] = [];
  private frame: THREE.Group | null = null;
  private angles: number[] = [];
  private velocities: number[] = [];
  private params: Record<string, unknown> = {};
  private readonly ballRadius = 0.5;
  private readonly stringLength = 4;
  private readonly pivotY = 5;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    const count = params.ballCount as number || 5;
    const spacing = this.ballRadius * 2.02; // Slight gap for realistic contact

    // Create frame structure
    this.frame = new THREE.Group();
    const frameGeometry = new THREE.BoxGeometry(count * spacing + 2, 0.3, 0.3);
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2c1810, 
      metalness: 0.3,
      roughness: 0.7 
    });
    const topBar = new THREE.Mesh(frameGeometry, frameMaterial);
    topBar.position.y = this.pivotY;
    this.frame.add(topBar);

    // Add support pillars
    const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.15, this.pivotY + 1, 16);
    const leftPillar = new THREE.Mesh(pillarGeometry, frameMaterial);
    leftPillar.position.set(-(count * spacing + 2) / 2, this.pivotY / 2 - 0.5, 0);
    const rightPillar = new THREE.Mesh(pillarGeometry, frameMaterial);
    rightPillar.position.set((count * spacing + 2) / 2, this.pivotY / 2 - 0.5, 0);
    this.frame.add(leftPillar, rightPillar);

    scene.add(this.frame);

    // Create balls with realistic materials
    for (let i = 0; i < count; i++) {
      const xPos = (i - (count - 1) / 2) * spacing;
      
      // Ball geometry with high detail
      const geometry = new THREE.SphereGeometry(this.ballRadius, 64, 64);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.0
      });
      const ball = new THREE.Mesh(geometry, material);
      
      // Initial position
      const angle = i === 0 ? (params.amplitude as number || 45) * Math.PI / 180 : 0;
      ball.position.x = xPos + this.stringLength * Math.sin(angle);
      ball.position.y = this.pivotY - this.stringLength * Math.cos(angle);
      ball.position.z = 0;
      
      ball.castShadow = true;
      ball.receiveShadow = true;
      scene.add(ball);
      this.balls.push(ball);
      
      // Create string (wire)
      const stringMaterial = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
      const stringGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xPos, this.pivotY, 0),
        ball.position.clone()
      ]);
      const string = new THREE.Line(stringGeometry, stringMaterial);
      scene.add(string);
      this.strings.push(string);
      
      this.angles.push(angle);
      this.velocities.push(0);
    }

    // Add base platform
    const baseGeometry = new THREE.BoxGeometry(count * spacing + 3, 0.2, 2);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.2,
      roughness: 0.8
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.5;
    base.receiveShadow = true;
    scene.add(base);

    // Enhanced lighting for metallic balls
    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 10, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);
  }

  update(delta: number, _state: SimulationState): void {
    const g = 9.81;
    const damping = this.params.damping as number || 0.998;
    const count = this.balls.length;
    const spacing = this.ballRadius * 2.02;

    // Update physics for each ball
    for (let i = 0; i < count; i++) {
      // Pendulum physics
      const angularAcceleration = -(g / this.stringLength) * Math.sin(this.angles[i]);
      this.velocities[i] += angularAcceleration * delta;
      this.velocities[i] *= damping; // Apply damping
      this.angles[i] += this.velocities[i] * delta;

      // Update ball position
      const xBase = (i - (count - 1) / 2) * spacing;
      const x = xBase + this.stringLength * Math.sin(this.angles[i]);
      const y = this.pivotY - this.stringLength * Math.cos(this.angles[i]);
      this.balls[i].position.set(x, y, 0);

      // Update string
      const positions = this.strings[i].geometry.attributes.position;
      positions.setXYZ(1, x, y, 0);
      positions.needsUpdate = true;
    }

    // Collision detection and response (elastic collision)
    for (let i = 0; i < count - 1; i++) {
      const distance = this.balls[i + 1].position.x - this.balls[i].position.x;
      const minDistance = this.ballRadius * 2;

      if (distance < minDistance && distance > 0) {
        // Elastic collision - exchange velocities
        const v1 = this.velocities[i];
        const v2 = this.velocities[i + 1];
        
        // Perfect elastic collision (equal masses)
        this.velocities[i] = v2;
        this.velocities[i + 1] = v1;

        // Separate balls slightly to prevent sticking
        const overlap = minDistance - distance;
        this.angles[i] -= overlap / (2 * this.stringLength);
        this.angles[i + 1] += overlap / (2 * this.stringLength);
      }
    }
  }

  reset(): void {
    const amplitude = (this.params.amplitude as number || 45) * Math.PI / 180;
    this.angles = this.balls.map((_, i) => i === 0 ? amplitude : 0);
    this.velocities = this.balls.map(() => 0);
  }

  cleanup(): void {
    this.balls.forEach(ball => {
      ball.parent?.remove(ball);
      ball.geometry.dispose();
      (ball.material as THREE.Material).dispose();
    });
    this.strings.forEach(string => {
      string.parent?.remove(string);
      string.geometry.dispose();
      (string.material as THREE.Material).dispose();
    });
    if (this.frame) {
      this.frame.parent?.remove(this.frame);
    }
  }

  exportData(): unknown {
    return { 
      angles: this.angles,
      velocities: this.velocities,
      totalMomentum: this.velocities.reduce((sum, v) => sum + v, 0)
    };
  }
}
