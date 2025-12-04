import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

interface Star {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  galaxyId: number;
}

export class GalaxyCollisionSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'galaxy-collision',
    name: 'Galaxy Collision',
    description: 'Spectacular collision of two spiral galaxies with realistic gravitational interactions and stunning visual effects',
    category: 'Astrophysics',
    difficulty: 'advanced',
    tags: ['galaxy', 'collision', 'gravity', 'n-body', 'spiral', 'cosmic'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    speed: {
      label: 'Collision Speed',
      type: 'number',
      default: 1.2,
      min: 0.3,
      max: 3,
      step: 0.1,
      description: 'Speed of galactic collision'
    },
    starsPerGalaxy: {
      label: 'Stars Per Galaxy',
      type: 'number',
      default: 200,
      min: 100,
      max: 400,
      step: 50,
      description: 'Number of stars in each galaxy'
    },
    spiralArms: {
      label: 'Spiral Arms',
      type: 'number',
      default: 3,
      min: 2,
      max: 5,
      step: 1,
      description: 'Number of spiral arms per galaxy'
    }
  };

  private stars: THREE.Points | null = null;
  private glowStars: THREE.Points | null = null;
  private cores: THREE.Mesh[] = [];
  private starData: Star[] = [];
  private params: Record<string, unknown> = {};
  private time: number = 0;
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;
    this.starData = [];
    
    const starsPerGalaxy = params.starsPerGalaxy as number || 200;
    const spiralArms = params.spiralArms as number || 3;
    const count = starsPerGalaxy * 2;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Create two spiral galaxies
    for (let g = 0; g < 2; g++) {
      const offsetX = g === 0 ? -8 : 8;
      const offsetZ = g === 0 ? 2 : -2;
      const baseColor = g === 0 ? new THREE.Color(0x4a9eff) : new THREE.Color(0xff6b4a);
      const direction = g === 0 ? 1 : -1;
      
      // Create galactic core
      const coreGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const coreMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: baseColor,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.set(offsetX, 0, offsetZ);
      scene.add(core);
      this.cores.push(core);

      // Add core glow
      const glowGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      core.add(glow);
      
      // Generate spiral galaxy structure
      for (let i = 0; i < starsPerGalaxy; i++) {
        const idx = g * starsPerGalaxy + i;
        
        // Spiral arm distribution
        const armIndex = Math.floor(Math.random() * spiralArms);
        const armAngle = (armIndex / spiralArms) * Math.PI * 2;
        const spiralTightness = 0.5;
        const radius = Math.pow(Math.random(), 0.7) * 5; // More stars near center
        const angle = armAngle + radius * spiralTightness + (Math.random() - 0.5) * 0.8;
        
        const x = offsetX + Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * (0.3 + radius * 0.1); // Thicker disk at edges
        const z = offsetZ + Math.sin(angle) * radius;
        
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        // Color variation based on distance from center
        const distanceRatio = radius / 5;
        const starColor = baseColor.clone();
        starColor.lerp(new THREE.Color(0xffffff), distanceRatio * 0.3);
        
        colors[idx * 3] = starColor.r;
        colors[idx * 3 + 1] = starColor.g;
        colors[idx * 3 + 2] = starColor.b;

        // Size variation
        sizes[idx] = 0.08 + Math.random() * 0.15 + (1 - distanceRatio) * 0.1;

        // Orbital velocity (Keplerian motion)
        const orbitalSpeed = Math.sqrt(1 / (radius + 0.5)) * 0.8;
        const tangentAngle = angle + Math.PI / 2;
        
        this.starData.push({
          position: new THREE.Vector3(x, y, z),
          velocity: new THREE.Vector3(
            Math.cos(tangentAngle) * orbitalSpeed * direction + (g === 0 ? 0.3 : -0.3),
            (Math.random() - 0.5) * 0.05,
            Math.sin(tangentAngle) * orbitalSpeed * direction
          ),
          mass: 1 + Math.random() * 0.5,
          galaxyId: g
        });
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Main star particles with custom shader-like appearance
    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: this.createStarTexture()
    });

    this.stars = new THREE.Points(geometry, material);
    scene.add(this.stars);

    // Add glow layer
    const glowGeometry = geometry.clone();
    const glowMaterial = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    this.glowStars = new THREE.Points(glowGeometry, glowMaterial);
    scene.add(this.glowStars);
  }

  private createStarTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.stars || !this.glowStars) return;

    const speed = this.params.speed as number || 1.2;
    const dt = Math.min(delta * speed, 0.05);
    this.time += dt;

    const positions = (this.stars.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const colors = (this.stars.geometry.attributes.color as THREE.BufferAttribute).array as Float32Array;
    const G = 0.015; // Gravitational constant

    // Update star positions with N-body gravity (optimized)
    for (let i = 0; i < this.starData.length; i++) {
      const star = this.starData[i];
      const acceleration = new THREE.Vector3();

      // Calculate gravitational forces (only nearby stars for performance)
      for (let j = 0; j < this.starData.length; j++) {
        if (i === j) continue;
        
        const other = this.starData[j];
        const dx = other.position.x - star.position.x;
        const dy = other.position.y - star.position.y;
        const dz = other.position.z - star.position.z;
        const distSq = dx * dx + dy * dy + dz * dz + 0.1; // Softening
        const dist = Math.sqrt(distSq);
        
        if (dist < 8) { // Only calculate for nearby stars
          const force = (G * other.mass) / distSq;
          acceleration.x += (dx / dist) * force;
          acceleration.y += (dy / dist) * force;
          acceleration.z += (dz / dist) * force;
        }
      }

      // Update velocity and position
      star.velocity.add(acceleration.multiplyScalar(dt));
      star.velocity.multiplyScalar(0.999); // Slight damping
      star.position.add(star.velocity.clone().multiplyScalar(dt));

      // Update buffer
      positions[i * 3] = star.position.x;
      positions[i * 3 + 1] = star.position.y;
      positions[i * 3 + 2] = star.position.z;

      // Dynamic color based on velocity (shows energy)
      const speed = star.velocity.length();
      const energyColor = new THREE.Color();
      energyColor.setHSL(
        star.galaxyId === 0 ? 0.6 : 0.02,
        0.8 + Math.min(speed * 0.2, 0.2),
        0.5 + Math.min(speed * 0.1, 0.3)
      );
      colors[i * 3] = energyColor.r;
      colors[i * 3 + 1] = energyColor.g;
      colors[i * 3 + 2] = energyColor.b;
    }

    (this.stars.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.stars.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    // Update glow layer
    if (this.glowStars) {
      const glowPositions = (this.glowStars.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      glowPositions.set(positions);
      (this.glowStars.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (this.glowStars.geometry.attributes.color as THREE.BufferAttribute).array.set(colors);
      (this.glowStars.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    // Animate cores with pulsing effect
    this.cores.forEach((core, idx) => {
      const pulse = 1 + Math.sin(this.time * 2 + idx * Math.PI) * 0.1;
      core.scale.setScalar(pulse);
      core.rotation.y += dt * 0.5;
    });

    // Rotate entire system slowly for cinematic effect
    if (this.stars) {
      this.stars.rotation.y += dt * 0.02;
    }
    if (this.glowStars) {
      this.glowStars.rotation.y += dt * 0.02;
    }
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  cleanup(): void {
    if (this.stars) {
      this.stars.parent?.remove(this.stars);
      this.stars.geometry.dispose();
      (this.stars.material as THREE.Material).dispose();
      this.stars = null;
    }

    if (this.glowStars) {
      this.glowStars.parent?.remove(this.glowStars);
      this.glowStars.geometry.dispose();
      (this.glowStars.material as THREE.Material).dispose();
      this.glowStars = null;
    }

    this.cores.forEach(core => {
      core.parent?.remove(core);
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
    });
    this.cores = [];
    this.starData = [];
  }

  exportData(): unknown {
    return {
      starCount: this.starData.length,
      time: this.time,
      galaxies: [
        {
          id: 0,
          stars: this.starData.filter(s => s.galaxyId === 0).length,
          centerOfMass: this.calculateCenterOfMass(0)
        },
        {
          id: 1,
          stars: this.starData.filter(s => s.galaxyId === 1).length,
          centerOfMass: this.calculateCenterOfMass(1)
        }
      ]
    };
  }

  private calculateCenterOfMass(galaxyId: number): THREE.Vector3 {
    const stars = this.starData.filter(s => s.galaxyId === galaxyId);
    const com = new THREE.Vector3();
    stars.forEach(s => com.add(s.position));
    return com.divideScalar(stars.length);
  }
}
