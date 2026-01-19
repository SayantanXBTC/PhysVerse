import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

interface DebrisParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  size: number;
  type: number;
}

export class TornadoSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'tornado',
    name: 'Tornado Vortex',
    description: 'Realistic tornado simulation with debris, multiple vortices, and atmospheric effects',
    category: 'Weather',
    difficulty: 'intermediate',
    tags: ['tornado', 'vortex', 'weather', 'fluid', 'atmospheric'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    strength: {
      label: 'Vortex Strength',
      type: 'number',
      default: 5,
      min: 1,
      max: 10,
      step: 0.5,
      description: 'Tornado wind speed (EF scale)'
    },
    height: {
      label: 'Height',
      type: 'number',
      default: 10,
      min: 4,
      max: 15,
      step: 1,
      description: 'Tornado funnel height'
    },
    debris: {
      label: 'Debris Amount',
      type: 'number',
      default: 150,
      min: 50,
      max: 300,
      step: 50,
      description: 'Amount of debris particles'
    }
  };

  private dustParticles: THREE.Points | null = null;
  private debrisParticles: THREE.Points | null = null;
  private funnel: THREE.Mesh | null = null;
  private ground: THREE.Mesh | null = null;
  private debrisData: DebrisParticle[] = [];
  private params: Record<string, unknown> = {};
  private time = 0;
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;
    this.debrisData = [];

    const height = params.height as number || 10;
    const debrisCount = params.debris as number || 150;

    // Ground plane
    const groundGeometry = new THREE.CircleGeometry(15, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a5a3a,
      roughness: 0.9,
      metalness: 0.1
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.1;
    this.ground.receiveShadow = true;
    scene.add(this.ground);

    // Tornado funnel (semi-transparent cone)
    const funnelGeometry = new THREE.CylinderGeometry(0.3, 2.5, height, 32, 20, true);
    const funnelMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      wireframe: false
    });
    this.funnel = new THREE.Mesh(funnelGeometry, funnelMaterial);
    this.funnel.position.y = height / 2;
    scene.add(this.funnel);

    // Dust/air particles (main vortex visualization)
    const dustCount = 500;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 4;
      const y = Math.random() * height;
      
      dustPositions[i * 3] = Math.cos(angle) * radius;
      dustPositions[i * 3 + 1] = y;
      dustPositions[i * 3 + 2] = Math.sin(angle) * radius;

      // Color gradient from brown (ground) to gray (sky)
      const heightRatio = y / height;
      const color = new THREE.Color();
      color.setHSL(0.1, 0.3, 0.3 + heightRatio * 0.4);
      dustColors[i * 3] = color.r;
      dustColors[i * 3 + 1] = color.g;
      dustColors[i * 3 + 2] = color.b;

      dustSizes[i] = 0.08 + Math.random() * 0.12;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(this.dustParticles);

    // Debris particles (larger objects)
    const debrisGeometry = new THREE.BufferGeometry();
    const debrisPositions = new Float32Array(debrisCount * 3);
    const debrisColors = new Float32Array(debrisCount * 3);
    const debrisSizes = new Float32Array(debrisCount);

    for (let i = 0; i < debrisCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 3;
      const y = Math.random() * height * 0.7;
      
      debrisPositions[i * 3] = Math.cos(angle) * radius;
      debrisPositions[i * 3 + 1] = y;
      debrisPositions[i * 3 + 2] = Math.sin(angle) * radius;

      // Varied debris colors (wood, metal, etc.)
      const debrisType = Math.floor(Math.random() * 3);
      const color = new THREE.Color();
      if (debrisType === 0) color.setHex(0x8b4513); // Wood
      else if (debrisType === 1) color.setHex(0x708090); // Metal
      else color.setHex(0xa0522d); // Dirt/rock
      
      debrisColors[i * 3] = color.r;
      debrisColors[i * 3 + 1] = color.g;
      debrisColors[i * 3 + 2] = color.b;

      debrisSizes[i] = 0.15 + Math.random() * 0.25;

      this.debrisData.push({
        position: new THREE.Vector3(debrisPositions[i * 3], debrisPositions[i * 3 + 1], debrisPositions[i * 3 + 2]),
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        size: debrisSizes[i],
        type: debrisType
      });
    }

    debrisGeometry.setAttribute('position', new THREE.BufferAttribute(debrisPositions, 3));
    debrisGeometry.setAttribute('color', new THREE.BufferAttribute(debrisColors, 3));
    debrisGeometry.setAttribute('size', new THREE.BufferAttribute(debrisSizes, 1));

    const debrisMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    this.debrisParticles = new THREE.Points(debrisGeometry, debrisMaterial);
    scene.add(this.debrisParticles);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.dustParticles || !this.debrisParticles) return;

    const dt = Math.min(delta, 0.05);
    this.time += dt;
    
    const strength = this.params.strength as number || 5;
    const height = this.params.height as number || 10;

    // Update dust particles (smooth vortex motion)
    const dustPositions = (this.dustParticles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    
    for (let i = 0; i < dustPositions.length / 3; i++) {
      const x = dustPositions[i * 3];
      const y = dustPositions[i * 3 + 1];
      const z = dustPositions[i * 3 + 2];
      const radius = Math.sqrt(x * x + z * z);

      // Rankine vortex model (solid body rotation inside, potential flow outside)
      const coreRadius = 1.5;
      let tangentialSpeed;
      if (radius < coreRadius) {
        tangentialSpeed = strength * (radius / coreRadius);
      } else {
        tangentialSpeed = strength * (coreRadius / radius);
      }

      const angle = Math.atan2(z, x);
      const tangentX = -Math.sin(angle) * tangentialSpeed;
      const tangentZ = Math.cos(angle) * tangentialSpeed;

      // Inward spiral + upward motion
      const inwardSpeed = strength * 0.15 * (1 - radius / 5);
      const upwardSpeed = strength * 0.3 * (1 - y / height);

      dustPositions[i * 3] += (tangentX - x * inwardSpeed * 0.1) * dt;
      dustPositions[i * 3 + 1] += upwardSpeed * dt;
      dustPositions[i * 3 + 2] += (tangentZ - z * inwardSpeed * 0.1) * dt;

      // Respawn particles that exit
      if (y > height || radius > 5) {
        const newAngle = Math.random() * Math.PI * 2;
        const newRadius = 2 + Math.random() * 2;
        dustPositions[i * 3] = Math.cos(newAngle) * newRadius;
        dustPositions[i * 3 + 1] = Math.random() * 2;
        dustPositions[i * 3 + 2] = Math.sin(newAngle) * newRadius;
      }
    }

    (this.dustParticles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // Update debris with physics
    const debrisPositions = (this.debrisParticles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    
    this.debrisData.forEach((debris, i) => {
      const radius = Math.sqrt(debris.position.x * debris.position.x + debris.position.z * debris.position.z);
      const angle = Math.atan2(debris.position.z, debris.position.x);

      // Vortex forces
      const coreRadius = 1.5;
      let tangentialSpeed;
      if (radius < coreRadius) {
        tangentialSpeed = strength * (radius / coreRadius) * 1.2;
      } else {
        tangentialSpeed = strength * (coreRadius / radius) * 1.2;
      }

      const tangentX = -Math.sin(angle) * tangentialSpeed;
      const tangentZ = Math.cos(angle) * tangentialSpeed;

      // Forces
      const inwardForce = strength * 0.2;
      const upwardForce = strength * 0.4 * (1 - debris.position.y / height);
      const gravity = -9.8 * 0.5;

      debris.velocity.x = tangentX - debris.position.x * inwardForce * 0.1;
      debris.velocity.y += (upwardForce + gravity) * dt;
      debris.velocity.z = tangentZ - debris.position.z * inwardForce * 0.1;

      // Drag
      debris.velocity.multiplyScalar(0.98);

      // Update position
      debris.position.add(debris.velocity.clone().multiplyScalar(dt));

      // Ground collision
      if (debris.position.y < 0.2) {
        debris.position.y = 0.2;
        debris.velocity.y *= -0.3;
      }

      // Respawn if too far
      if (debris.position.y > height * 1.2 || radius > 6) {
        const newAngle = Math.random() * Math.PI * 2;
        const newRadius = 1 + Math.random() * 2;
        debris.position.set(
          Math.cos(newAngle) * newRadius,
          Math.random() * 2,
          Math.sin(newAngle) * newRadius
        );
        debris.velocity.set(0, 0, 0);
      }

      // Update buffer
      debrisPositions[i * 3] = debris.position.x;
      debrisPositions[i * 3 + 1] = debris.position.y;
      debrisPositions[i * 3 + 2] = debris.position.z;
    });

    (this.debrisParticles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // Animate funnel (wobble and rotation)
    if (this.funnel) {
      this.funnel.rotation.y += dt * strength * 0.3;
      const wobble = Math.sin(this.time * 2) * 0.1;
      this.funnel.position.x = wobble;
      this.funnel.position.z = Math.cos(this.time * 2) * 0.1;
    }
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  cleanup(): void {
    if (this.dustParticles) {
      this.dustParticles.parent?.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
      (this.dustParticles.material as THREE.Material).dispose();
    }
    if (this.debrisParticles) {
      this.debrisParticles.parent?.remove(this.debrisParticles);
      this.debrisParticles.geometry.dispose();
      (this.debrisParticles.material as THREE.Material).dispose();
    }
    if (this.funnel) {
      this.funnel.parent?.remove(this.funnel);
      this.funnel.geometry.dispose();
      (this.funnel.material as THREE.Material).dispose();
    }
    if (this.ground) {
      this.ground.parent?.remove(this.ground);
      this.ground.geometry.dispose();
      (this.ground.material as THREE.Material).dispose();
    }
    this.debrisData = [];
  }

  exportData(): unknown {
    return {
      time: this.time,
      debrisCount: this.debrisData.length,
      averageHeight: this.debrisData.reduce((sum, d) => sum + d.position.y, 0) / this.debrisData.length,
      vortexStrength: this.params.strength
    };
  }
}
