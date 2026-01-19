import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

interface EjectaParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  temperature: number;
}

export class SupernovaSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'supernova',
    name: 'Supernova Explosion',
    description: 'Spectacular stellar death with core collapse, shockwave, and remnant formation',
    category: 'Astrophysics',
    difficulty: 'advanced',
    tags: ['supernova', 'explosion', 'star', 'shockwave', 'neutron-star'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    explosionEnergy: {
      label: 'Explosion Energy',
      type: 'number',
      default: 1.5,
      min: 0.5,
      max: 3,
      step: 0.1,
      description: 'Supernova energy (10^44 J)'
    },
    stellarMass: {
      label: 'Stellar Mass',
      type: 'number',
      default: 15,
      min: 8,
      max: 30,
      step: 1,
      description: 'Progenitor star mass (solar masses)'
    }
  };

  private star: THREE.Mesh | null = null;
  private core: THREE.Mesh | null = null;
  private ejecta: THREE.Points | null = null;
  private shockwave: THREE.Mesh | null = null;
  private neutrinos: THREE.Points | null = null;
  private ejectaData: EjectaParticle[] = [];
  private params: Record<string, unknown> = {};
  private time = 0;
  private phase: 'pre-collapse' | 'collapse' | 'explosion' | 'remnant' = 'pre-collapse';
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;
    this.phase = 'pre-collapse';
    this.ejectaData = [];

    const mass = params.stellarMass as number || 15;
    const starRadius = Math.pow(mass / 15, 0.8) * 2;

    // Progenitor star (red supergiant)
    const starGeometry = new THREE.SphereGeometry(starRadius, 64, 64);
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff4500,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.9
    });
    this.star = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(this.star);

    // Star glow
    const glowGeometry = new THREE.SphereGeometry(starRadius * 1.3, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.star.add(glow);

    // Neutron star core (initially hidden)
    const coreGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 3,
      metalness: 1,
      roughness: 0
    });
    this.core = new THREE.Mesh(coreGeometry, coreMaterial);
    this.core.visible = false;
    scene.add(this.core);

    // Ejecta particles
    const ejectaCount = 500;
    const ejectaGeometry = new THREE.BufferGeometry();
    const ejectaPositions = new Float32Array(ejectaCount * 3);
    const ejectaColors = new Float32Array(ejectaCount * 3);
    const ejectaSizes = new Float32Array(ejectaCount);

    for (let i = 0; i < ejectaCount; i++) {
      ejectaPositions[i * 3] = 0;
      ejectaPositions[i * 3 + 1] = 0;
      ejectaPositions[i * 3 + 2] = 0;

      const color = new THREE.Color(0xff0000);
      ejectaColors[i * 3] = color.r;
      ejectaColors[i * 3 + 1] = color.g;
      ejectaColors[i * 3 + 2] = color.b;

      ejectaSizes[i] = 0.1 + Math.random() * 0.2;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 2 + Math.random() * 4;

      this.ejectaData.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.cos(phi) * speed,
          Math.sin(phi) * Math.sin(theta) * speed
        ),
        mass: 1 + Math.random() * 2,
        temperature: 10000
      });
    }

    ejectaGeometry.setAttribute('position', new THREE.BufferAttribute(ejectaPositions, 3));
    ejectaGeometry.setAttribute('color', new THREE.BufferAttribute(ejectaColors, 3));
    ejectaGeometry.setAttribute('size', new THREE.BufferAttribute(ejectaSizes, 1));

    const ejectaMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.ejecta = new THREE.Points(ejectaGeometry, ejectaMaterial);
    scene.add(this.ejecta);

    // Shockwave sphere
    const shockGeometry = new THREE.SphereGeometry(1, 32, 32);
    const shockMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.shockwave = new THREE.Mesh(shockGeometry, shockMaterial);
    this.shockwave.visible = false;
    scene.add(this.shockwave);

    // Neutrino burst
    const neutrinoGeometry = new THREE.BufferGeometry();
    const neutrinoPositions = new Float32Array(200 * 3);
    const neutrinoColors = new Float32Array(200 * 3);

    for (let i = 0; i < 200; i++) {
      neutrinoPositions[i * 3] = 0;
      neutrinoPositions[i * 3 + 1] = 0;
      neutrinoPositions[i * 3 + 2] = 0;

      const color = new THREE.Color(0x00ffff);
      neutrinoColors[i * 3] = color.r;
      neutrinoColors[i * 3 + 1] = color.g;
      neutrinoColors[i * 3 + 2] = color.b;
    }

    neutrinoGeometry.setAttribute('position', new THREE.BufferAttribute(neutrinoPositions, 3));
    neutrinoGeometry.setAttribute('color', new THREE.BufferAttribute(neutrinoColors, 3));

    const neutrinoMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.neutrinos = new THREE.Points(neutrinoGeometry, neutrinoMaterial);
    scene.add(this.neutrinos);
  }

  update(delta: number, _state: SimulationState): void {
    if (!this.star) return;

    const dt = Math.min(delta, 0.05);
    this.time += dt;
    const energy = this.params.explosionEnergy as number || 1.5;

    // Phase 1: Pre-collapse (0-2s) - Star pulsates
    if (this.time < 2) {
      this.phase = 'pre-collapse';
      const pulse = 1 + Math.sin(this.time * 8) * 0.15;
      this.star.scale.setScalar(pulse);
      const material = this.star.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.5 + Math.sin(this.time * 10) * 0.5;
    }
    // Phase 2: Core collapse (2-3s) - Star shrinks rapidly
    else if (this.time < 3) {
      this.phase = 'collapse';
      const collapseProgress = (this.time - 2);
      this.star.scale.setScalar(1 - collapseProgress * 0.9);
      const material = this.star.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 3 + collapseProgress * 5;
      material.color.setHSL(0.05 - collapseProgress * 0.05, 1, 0.5);
    }
    // Phase 3: Explosion (3-4s) - Massive energy release
    else if (this.time < 4) {
      this.phase = 'explosion';
      
      if (this.time === 3 || (this.time > 3 && this.time < 3.1)) {
        this.star.visible = false;
        if (this.core) this.core.visible = true;
        if (this.shockwave) this.shockwave.visible = true;
      }

      const explosionTime = this.time - 3;
      
      // Shockwave expansion
      if (this.shockwave) {
        this.shockwave.scale.setScalar(1 + explosionTime * 8 * energy);
        const material = this.shockwave.material as THREE.MeshBasicMaterial;
        material.opacity = 0.6 * (1 - explosionTime);
      }

      // Ejecta expansion
      if (this.ejecta) {
        const positions = (this.ejecta.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        const colors = (this.ejecta.geometry.attributes.color as THREE.BufferAttribute).array as Float32Array;

        this.ejectaData.forEach((particle, i) => {
          particle.position.add(particle.velocity.clone().multiplyScalar(dt * energy));
          particle.temperature *= 0.98;

          positions[i * 3] = particle.position.x;
          positions[i * 3 + 1] = particle.position.y;
          positions[i * 3 + 2] = particle.position.z;

          // Color based on temperature
          const temp = particle.temperature / 10000;
          const color = new THREE.Color();
          if (temp > 0.8) color.setHex(0xffffff);
          else if (temp > 0.5) color.setHex(0xffaa00);
          else if (temp > 0.3) color.setHex(0xff4400);
          else color.setHex(0xff0000);

          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        });

        (this.ejecta.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        (this.ejecta.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      }

      // Neutrino burst
      if (this.neutrinos) {
        const neutrinoPositions = (this.neutrinos.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        
        for (let i = 0; i < neutrinoPositions.length / 3; i++) {
          const theta = (i / (neutrinoPositions.length / 3)) * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const speed = 15;
          const t = explosionTime * speed;
          
          neutrinoPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * t;
          neutrinoPositions[i * 3 + 1] = Math.cos(phi) * t;
          neutrinoPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * t;
        }
        
        (this.neutrinos.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }

      // Neutron star core rotation
      if (this.core) {
        this.core.rotation.y += dt * 20;
        const pulse = 1 + Math.sin(this.time * 30) * 0.2;
        this.core.scale.setScalar(pulse);
      }
    }
    // Phase 4: Remnant (4s+) - Expanding nebula
    else {
      this.phase = 'remnant';
      
      if (this.ejecta) {
        const positions = (this.ejecta.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        
        this.ejectaData.forEach((particle, i) => {
          particle.velocity.multiplyScalar(0.995); // Gradual slowdown
          particle.position.add(particle.velocity.clone().multiplyScalar(dt));
          
          positions[i * 3] = particle.position.x;
          positions[i * 3 + 1] = particle.position.y;
          positions[i * 3 + 2] = particle.position.z;
        });
        
        (this.ejecta.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }

      // Pulsar rotation
      if (this.core) {
        this.core.rotation.y += dt * 15;
      }
    }

    // Reset after full cycle
    if (this.time > 10) {
      this.reset();
    }
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  cleanup(): void {
    if (this.star) {
      this.star.parent?.remove(this.star);
      this.star.geometry.dispose();
      (this.star.material as THREE.Material).dispose();
    }
    if (this.core) {
      this.core.parent?.remove(this.core);
      this.core.geometry.dispose();
      (this.core.material as THREE.Material).dispose();
    }
    if (this.ejecta) {
      this.ejecta.parent?.remove(this.ejecta);
      this.ejecta.geometry.dispose();
      (this.ejecta.material as THREE.Material).dispose();
    }
    if (this.shockwave) {
      this.shockwave.parent?.remove(this.shockwave);
      this.shockwave.geometry.dispose();
      (this.shockwave.material as THREE.Material).dispose();
    }
    if (this.neutrinos) {
      this.neutrinos.parent?.remove(this.neutrinos);
      this.neutrinos.geometry.dispose();
      (this.neutrinos.material as THREE.Material).dispose();
    }
    this.ejectaData = [];
  }

  exportData(): unknown {
    return {
      time: this.time,
      phase: this.phase,
      ejectaCount: this.ejectaData.length,
      averageEjectaSpeed: this.ejectaData.reduce((sum, p) => sum + p.velocity.length(), 0) / this.ejectaData.length,
      totalEnergy: this.params.explosionEnergy
    };
  }
}
