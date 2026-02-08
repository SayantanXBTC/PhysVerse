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
    efScale: {
      label: 'EF Scale',
      type: 'number',
      default: 3,
      min: 0,
      max: 5,
      step: 1,
      description: 'Enhanced Fujita Scale (0-5)'
    },
    height: {
      label: 'Height (m)',
      type: 'number',
      default: 500,
      min: 200,
      max: 1000,
      step: 100,
      description: 'Tornado funnel height in meters'
    },
    showLightning: {
      label: 'Lightning',
      type: 'boolean',
      default: true,
      description: 'Show electrical discharge'
    }
  };

  private dustParticles: THREE.Points | null = null;
  private debrisParticles: THREE.Points | null = null;
  private funnel: THREE.Mesh | null = null;
  private ground: THREE.Mesh | null = null;
  private debrisData: DebrisParticle[] = [];
  private satelliteVortices: THREE.Mesh[] = [];
  private lightning: THREE.Line[] = [];
  private cloudLayer: THREE.Mesh | null = null;
  private params: Record<string, unknown> = {};
  private time = 0;
  private lightningTimer = 0;
  private scene: THREE.Scene | null = null;
  private readonly SCALE_FACTOR = 0.02; // Convert meters to scene units

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;
    this.debrisData = [];
    this.satelliteVortices = [];
    this.lightning = [];
    this.lightningTimer = 0;

    const efScale = params.efScale as number || 3;
    const heightMeters = params.height as number || 500;
    const height = heightMeters * this.SCALE_FACTOR;
    const showLightning = params.showLightning !== false;
    
    // EF Scale wind speeds (m/s)
    const windSpeeds = [29, 38, 50, 61, 74, 89]; // EF0-EF5
    const windSpeed = windSpeeds[Math.min(efScale, 5)];
    const strength = windSpeed * 0.1; // Scale for visualization
    
    const debrisCount = 100 + efScale * 30;

    // Ground plane with texture
    const groundGeometry = new THREE.CircleGeometry(15, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a4a2a,
      roughness: 0.95,
      metalness: 0.05
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.1;
    this.ground.receiveShadow = true;
    scene.add(this.ground);

    // Atmospheric cloud layer
    const cloudGeometry = new THREE.CylinderGeometry(6, 8, 2, 32, 1, true);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0x505050,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    this.cloudLayer = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.cloudLayer.position.y = height + 1;
    scene.add(this.cloudLayer);

    // Main tornado funnel with rotating texture
    const funnelGeometry = new THREE.CylinderGeometry(0.2, 2.5, height, 64, 32, true);
    const funnelMaterial = new THREE.MeshStandardMaterial({
      color: 0x707070,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    this.funnel = new THREE.Mesh(funnelGeometry, funnelMaterial);
    this.funnel.position.y = height / 2;
    this.funnel.castShadow = true;
    scene.add(this.funnel);

    // Satellite vortices (smaller tornadoes around main)
    for (let i = 0; i < 2; i++) {
      const angle = (i / 2) * Math.PI * 2;
      const distance = 4 + Math.random();
      const satHeight = height * (0.3 + Math.random() * 0.3);
      
      const satGeometry = new THREE.CylinderGeometry(0.1, 0.8, satHeight, 32, 16, true);
      const satMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const satellite = new THREE.Mesh(satGeometry, satMaterial);
      satellite.position.set(
        Math.cos(angle) * distance,
        satHeight / 2,
        Math.sin(angle) * distance
      );
      satellite.userData = { angle, distance, baseHeight: satHeight };
      scene.add(satellite);
      this.satelliteVortices.push(satellite);
    }

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
    this.lightningTimer += dt;
    
    const efScale = this.params.efScale as number || 3;
    const windSpeeds = [29, 38, 50, 61, 74, 89];
    const windSpeed = windSpeeds[Math.min(efScale, 5)];
    const strength = windSpeed * 0.1;
    const heightMeters = this.params.height as number || 500;
    const height = heightMeters * this.SCALE_FACTOR;
    const showLightning = this.params.showLightning !== false;

    // Lightning strikes
    if (showLightning && this.lightningTimer > 1 + Math.random() * 2) {
      this.createLightning();
      this.lightningTimer = 0;
    }

    // Update existing lightning
    this.lightning = this.lightning.filter(bolt => {
      const material = bolt.material as THREE.LineBasicMaterial;
      material.opacity -= dt * 3;
      if (material.opacity <= 0) {
        bolt.parent?.remove(bolt);
        bolt.geometry.dispose();
        material.dispose();
        return false;
      }
      return true;
    });

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

    // Animate satellite vortices
    this.satelliteVortices.forEach((satellite, idx) => {
      const userData = satellite.userData as { angle: number; distance: number; baseHeight: number };
      userData.angle += dt * strength * 0.2;
      satellite.position.x = Math.cos(userData.angle) * userData.distance;
      satellite.position.z = Math.sin(userData.angle) * userData.distance;
      satellite.rotation.y += dt * strength * 0.5;
    });

    // Animate cloud layer
    if (this.cloudLayer) {
      this.cloudLayer.rotation.y += dt * 0.1;
      const material = this.cloudLayer.material as THREE.MeshStandardMaterial;
      material.opacity = 0.35 + Math.sin(this.time) * 0.05;
    }
  }

  private createLightning(): void {
    if (!this.scene) return;

    const startY = (this.params.height as number || 500) * this.SCALE_FACTOR;
    const points: THREE.Vector3[] = [];
    
    // Start from cloud
    let currentPos = new THREE.Vector3(
      (Math.random() - 0.5) * 4,
      startY,
      (Math.random() - 0.5) * 4
    );
    points.push(currentPos.clone());

    // Jagged path to ground
    const segments = 8;
    for (let i = 0; i < segments; i++) {
      currentPos = currentPos.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        -startY / segments,
        (Math.random() - 0.5) * 0.5
      ));
      points.push(currentPos);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xaaccff,
      transparent: true,
      opacity: 1,
      linewidth: 3
    });
    const bolt = new THREE.Line(geometry, material);
    this.scene.add(bolt);
    this.lightning.push(bolt);
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
    if (this.cloudLayer) {
      this.cloudLayer.parent?.remove(this.cloudLayer);
      this.cloudLayer.geometry.dispose();
      (this.cloudLayer.material as THREE.Material).dispose();
    }
    this.satelliteVortices.forEach(sat => {
      sat.parent?.remove(sat);
      sat.geometry.dispose();
      (sat.material as THREE.Material).dispose();
    });
    this.lightning.forEach(bolt => {
      bolt.parent?.remove(bolt);
      bolt.geometry.dispose();
      (bolt.material as THREE.Material).dispose();
    });
    this.debrisData = [];
    this.satelliteVortices = [];
    this.lightning = [];
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
