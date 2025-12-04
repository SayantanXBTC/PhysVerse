import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class RocketSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'rocket',
    name: 'Rocket Launch',
    description: 'Realistic multi-stage rocket launch with atmospheric effects, thrust vectoring, and detailed physics',
    category: 'Aerospace',
    difficulty: 'intermediate',
    tags: ['rocket', 'thrust', 'drag', 'aerospace', 'orbital-mechanics']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    thrust: {
      label: 'Thrust Force (kN)',
      type: 'number',
      default: 18,
      min: 12,
      max: 50,
      step: 2,
      description: 'Main engine thrust in kilonewtons'
    },
    mass: {
      label: 'Rocket Mass (kg)',
      type: 'number',
      default: 2.5,
      min: 1,
      max: 8,
      step: 0.5,
      description: 'Total rocket mass'
    },
    drag: {
      label: 'Drag Coefficient',
      type: 'number',
      default: 0.08,
      min: 0,
      max: 0.3,
      step: 0.02,
      description: 'Atmospheric drag coefficient'
    },
    fuelBurnRate: {
      label: 'Fuel Burn Rate',
      type: 'number',
      default: 0.2,
      min: 0.05,
      max: 0.8,
      step: 0.05,
      description: 'Rate of fuel consumption'
    },
    windSpeed: {
      label: 'Wind Speed (m/s)',
      type: 'number',
      default: 2,
      min: 0,
      max: 15,
      step: 1,
      description: 'Crosswind affecting trajectory'
    },
    launchAngle: {
      label: 'Launch Angle (°)',
      type: 'number',
      default: 90,
      min: 80,
      max: 90,
      step: 1,
      description: 'Initial launch angle from vertical'
    }
  };

  private rocket: THREE.Group | null = null;
  private exhaustParticles: THREE.Points | null = null;
  private smokeParticles: THREE.Points | null = null;
  private flames: THREE.Group | null = null;
  private launchPad: THREE.Group | null = null;
  private atmosphere: THREE.Mesh | null = null;
  private velocity = new THREE.Vector3();
  private position = new THREE.Vector3(0, 1, 0);
  private rotation = new THREE.Euler();
  private params: Record<string, unknown> = {};
  private exhaustPositions: Float32Array | null = null;
  private exhaustVelocities: THREE.Vector3[] = [];
  private smokePositions: Float32Array | null = null;
  private smokeVelocities: THREE.Vector3[] = [];
  private smokeAges: number[] = [];
  private fuel = 100;
  private time = 0;
  private scene: THREE.Scene | null = null;
  private stage = 1;
  private maxStages = 2;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.velocity.set(0, 0, 0);
    this.position.set(0, 1, 0);
    this.fuel = 100;
    this.time = 0;
    this.stage = 1;
    
    const launchAngle = (params.launchAngle as number || 90) * Math.PI / 180;
    this.rotation.set(0, 0, Math.PI / 2 - launchAngle);

    // Create launch pad
    this.createLaunchPad(scene);

    // Create rocket
    this.createRocket(scene);

    // Create particle systems
    this.createExhaustParticles(scene);
    this.createSmokeParticles(scene);
    this.createFlames(scene);

    // Create atmosphere effect
    this.createAtmosphere(scene);
  }

  private createLaunchPad(scene: THREE.Scene): void {
    this.launchPad = new THREE.Group();

    // Platform
    const platformGeometry = new THREE.CylinderGeometry(2, 2.5, 0.3, 8);
    const platformMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x444444,
      metalness: 0.8,
      roughness: 0.3
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = 0.15;
    this.launchPad.add(platform);

    // Support towers
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const towerGeometry = new THREE.BoxGeometry(0.2, 3, 0.2);
      const towerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x666666,
        metalness: 0.7,
        roughness: 0.4
      });
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.x = Math.cos(angle) * 2;
      tower.position.z = Math.sin(angle) * 2;
      tower.position.y = 1.5;
      this.launchPad.add(tower);
    }

    scene.add(this.launchPad);
  }

  private createRocket(scene: THREE.Scene): void {
    this.rocket = new THREE.Group();
    
    // Stage 2 (top)
    const stage2Geometry = new THREE.CylinderGeometry(0.18, 0.2, 0.8, 16);
    const stage2Material = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x222222,
      emissiveIntensity: 0.1
    });
    const stage2 = new THREE.Mesh(stage2Geometry, stage2Material);
    stage2.position.y = 1.4;
    this.rocket.add(stage2);

    // Stage 1 (bottom)
    const stage1Geometry = new THREE.CylinderGeometry(0.2, 0.22, 1, 16);
    const stage1Material = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      metalness: 0.7,
      roughness: 0.2
    });
    const stage1 = new THREE.Mesh(stage1Geometry, stage1Material);
    stage1.position.y = 0.5;
    this.rocket.add(stage1);

    // Nose cone
    const coneGeometry = new THREE.ConeGeometry(0.18, 0.6, 16);
    const coneMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff4444,
      metalness: 0.5,
      roughness: 0.4,
      emissive: 0xff0000,
      emissiveIntensity: 0.2
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.y = 2.1;
    this.rocket.add(cone);

    // Fins with metallic look
    const finGeometry = new THREE.BoxGeometry(0.05, 0.5, 0.4);
    const finMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.1
    });
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      const angle = (i / 4) * Math.PI * 2;
      fin.position.x = Math.cos(angle) * 0.22;
      fin.position.z = Math.sin(angle) * 0.22;
      fin.position.y = 0.15;
      fin.rotation.y = angle;
      this.rocket.add(fin);
    }

    // Engine nozzles
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const nozzleGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.3, 8);
      const nozzleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0xff4400,
        emissiveIntensity: 0.3
      });
      const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
      nozzle.position.x = Math.cos(angle) * 0.12;
      nozzle.position.z = Math.sin(angle) * 0.12;
      nozzle.position.y = -0.15;
      this.rocket.add(nozzle);
    }

    // Add glow effect
    const glowGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 1;
    this.rocket.add(glow);

    this.rocket.position.copy(this.position);
    this.rocket.rotation.copy(this.rotation);
    scene.add(this.rocket);
  }

  private createExhaustParticles(scene: THREE.Scene): void {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    this.exhaustPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.exhaustVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      this.exhaustPositions[i * 3] = 0;
      this.exhaustPositions[i * 3 + 1] = -10;
      this.exhaustPositions[i * 3 + 2] = 0;
      this.exhaustVelocities.push(new THREE.Vector3());

      // Gradient from white-hot to orange
      const t = Math.random();
      const color = new THREE.Color();
      color.setHSL(0.05 + t * 0.05, 1, 0.5 + t * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.exhaustPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ 
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.exhaustParticles = new THREE.Points(geometry, material);
    scene.add(this.exhaustParticles);
  }

  private createSmokeParticles(scene: THREE.Scene): void {
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    this.smokePositions = new Float32Array(particleCount * 3);
    this.smokeVelocities = [];
    this.smokeAges = [];

    for (let i = 0; i < particleCount; i++) {
      this.smokePositions[i * 3] = 0;
      this.smokePositions[i * 3 + 1] = -10;
      this.smokePositions[i * 3 + 2] = 0;
      this.smokeVelocities.push(new THREE.Vector3());
      this.smokeAges.push(0);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.smokePositions, 3));
    
    const material = new THREE.PointsMaterial({ 
      color: 0x888888,
      size: 0.5,
      transparent: true,
      opacity: 0.4
    });
    this.smokeParticles = new THREE.Points(geometry, material);
    scene.add(this.smokeParticles);
  }

  private createFlames(scene: THREE.Scene): void {
    this.flames = new THREE.Group();

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const flameGeometry = new THREE.ConeGeometry(0.1, 0.6, 8);
      const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.8
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.x = Math.cos(angle) * 0.12;
      flame.position.z = Math.sin(angle) * 0.12;
      flame.position.y = -0.6;
      flame.rotation.x = Math.PI;
      this.flames.add(flame);
    }

    scene.add(this.flames);
  }

  private createAtmosphere(scene: THREE.Scene): void {
    const geometry = new THREE.SphereGeometry(50, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide
    });
    this.atmosphere = new THREE.Mesh(geometry, material);
    scene.add(this.atmosphere);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.rocket || !this.exhaustParticles || !this.exhaustPositions) return;

    const dt = Math.min(delta, 0.05);
    this.time += dt;

    const thrust = (this.params.thrust as number || 18) * 800; // Convert to Newtons (reduced multiplier)
    const mass = (this.params.mass as number || 2.5) - (this.fuel / 100) * 0.4; // Mass decreases with fuel
    const drag = this.params.drag as number || 0.08;
    const burnRate = this.params.fuelBurnRate as number || 0.2;
    const windSpeed = this.params.windSpeed as number || 2;
    const gravity = 9.81;

    // Fuel consumption (slower)
    if (this.fuel > 0) {
      this.fuel -= burnRate * dt * 8;
      if (this.fuel <= 0) {
        this.fuel = 0;
      }
    }

    // Stage separation
    if (this.fuel <= 50 && this.stage === 1) {
      this.stage = 2;
      // Visual effect for stage separation could be added here
    }

    // Physics calculations
    const thrustForce = this.fuel > 0 ? thrust / mass : 0;
    const speed = this.velocity.length();
    const dragForce = drag * speed * speed;
    const altitude = this.position.y;
    const atmosphericDensity = Math.max(0, 1 - altitude / 50); // Decreases with altitude

    // Apply forces
    const thrustDirection = new THREE.Vector3(0, 1, 0).applyEuler(this.rotation);
    const acceleration = thrustDirection.multiplyScalar(thrustForce);
    acceleration.y -= gravity;
    acceleration.sub(this.velocity.clone().normalize().multiplyScalar(dragForce * atmosphericDensity));
    
    // Wind effect (decreases with altitude)
    acceleration.x += windSpeed * atmosphericDensity * 0.1;

    this.velocity.add(acceleration.multiplyScalar(dt));
    this.position.add(this.velocity.clone().multiplyScalar(dt));

    // Ground collision
    if (this.position.y < 1) {
      this.position.y = 1;
      this.velocity.y = Math.max(0, this.velocity.y);
    }

    // Gradual tilt for gravity turn (slower)
    if (this.position.y > 8 && this.fuel > 0) {
      this.rotation.z += dt * 0.02;
    }

    // Update rocket position and rotation with smooth interpolation
    this.rocket.position.lerp(this.position, 0.8);
    this.rocket.rotation.copy(this.rotation);
    
    // Gentle wobble effect
    this.rocket.rotation.x = Math.sin(this.time * 2) * 0.015;
    this.rocket.rotation.y += dt * 0.3;

    // Update flames with smooth animation
    if (this.flames && this.fuel > 0) {
      this.flames.position.copy(this.position);
      this.flames.rotation.copy(this.rotation);
      this.flames.children.forEach((flame, i) => {
        const scale = 0.8 + Math.sin(this.time * 8 + i) * 0.25;
        const length = scale * (thrustForce / 8000);
        flame.scale.set(scale, Math.max(0.5, length), scale);
      });
      this.flames.visible = true;
    } else if (this.flames) {
      this.flames.visible = false;
    }

    // Update exhaust particles
    this.updateExhaustParticles(dt, thrustForce);

    // Update smoke particles
    this.updateSmokeParticles(dt);
  }

  private updateExhaustParticles(dt: number, thrustForce: number): void {
    if (!this.exhaustPositions || this.fuel <= 0) return;

    for (let i = 0; i < this.exhaustVelocities.length; i++) {
      // Spawn new particles (more controlled)
      if (Math.random() < 0.4 && this.fuel > 0) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.12;
        const exhaustDir = new THREE.Vector3(0, -1, 0).applyEuler(this.rotation);
        
        this.exhaustPositions[i * 3] = this.position.x + Math.cos(angle) * radius;
        this.exhaustPositions[i * 3 + 1] = this.position.y - 0.3;
        this.exhaustPositions[i * 3 + 2] = this.position.z + Math.sin(angle) * radius;
        
        this.exhaustVelocities[i].copy(exhaustDir).multiplyScalar(thrustForce / 6000);
        this.exhaustVelocities[i].x += (Math.random() - 0.5) * 2;
        this.exhaustVelocities[i].z += (Math.random() - 0.5) * 2;
      }

      // Update particle physics (smoother)
      this.exhaustVelocities[i].y -= 9.81 * dt * 0.25;
      this.exhaustVelocities[i].multiplyScalar(0.98); // Add damping
      this.exhaustPositions[i * 3] += this.exhaustVelocities[i].x * dt;
      this.exhaustPositions[i * 3 + 1] += this.exhaustVelocities[i].y * dt;
      this.exhaustPositions[i * 3 + 2] += this.exhaustVelocities[i].z * dt;

      // Reset particles that fall too low
      if (this.exhaustPositions[i * 3 + 1] < 0) {
        this.exhaustPositions[i * 3 + 1] = -10;
      }
    }

    (this.exhaustParticles!.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  private updateSmokeParticles(dt: number): void {
    if (!this.smokePositions || this.position.y < 3) return;

    for (let i = 0; i < this.smokeVelocities.length; i++) {
      this.smokeAges[i] += dt;

      // Spawn new smoke
      if (Math.random() < 0.2 && this.fuel > 0 && this.smokeAges[i] > 1) {
        this.smokePositions[i * 3] = this.position.x + (Math.random() - 0.5) * 0.3;
        this.smokePositions[i * 3 + 1] = this.position.y - 0.5;
        this.smokePositions[i * 3 + 2] = this.position.z + (Math.random() - 0.5) * 0.3;
        
        this.smokeVelocities[i].set(
          (Math.random() - 0.5) * 2,
          -2 + Math.random(),
          (Math.random() - 0.5) * 2
        );
        this.smokeAges[i] = 0;
      }

      // Smoke rises and disperses
      this.smokeVelocities[i].y += dt * 0.5;
      this.smokePositions[i * 3] += this.smokeVelocities[i].x * dt;
      this.smokePositions[i * 3 + 1] += this.smokeVelocities[i].y * dt;
      this.smokePositions[i * 3 + 2] += this.smokeVelocities[i].z * dt;
    }

    (this.smokeParticles!.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  reset(): void {
    this.velocity.set(0, 0, 0);
    this.position.set(0, 1, 0);
    this.fuel = 100;
    this.time = 0;
    this.stage = 1;
    
    const launchAngle = (this.params.launchAngle as number || 90) * Math.PI / 180;
    this.rotation.set(0, 0, Math.PI / 2 - launchAngle);
    
    if (this.rocket) {
      this.rocket.position.copy(this.position);
      this.rocket.rotation.copy(this.rotation);
    }
  }

  cleanup(): void {
    const cleanupMesh = (mesh: THREE.Object3D) => {
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    };

    if (this.rocket) {
      this.rocket.traverse(cleanupMesh);
      this.rocket.parent?.remove(this.rocket);
    }
    if (this.launchPad) {
      this.launchPad.traverse(cleanupMesh);
      this.launchPad.parent?.remove(this.launchPad);
    }
    if (this.exhaustParticles) {
      this.exhaustParticles.parent?.remove(this.exhaustParticles);
      this.exhaustParticles.geometry.dispose();
      (this.exhaustParticles.material as THREE.Material).dispose();
    }
    if (this.smokeParticles) {
      this.smokeParticles.parent?.remove(this.smokeParticles);
      this.smokeParticles.geometry.dispose();
      (this.smokeParticles.material as THREE.Material).dispose();
    }
    if (this.flames) {
      this.flames.traverse(cleanupMesh);
      this.flames.parent?.remove(this.flames);
    }
    if (this.atmosphere) {
      this.atmosphere.parent?.remove(this.atmosphere);
      this.atmosphere.geometry.dispose();
      (this.atmosphere.material as THREE.Material).dispose();
    }
  }

  exportData(): unknown {
    return {
      position: this.position.toArray(),
      velocity: this.velocity.toArray(),
      altitude: this.position.y,
      speed: this.velocity.length(),
      fuel: this.fuel,
      stage: this.stage,
      time: this.time
    };
  }
}
