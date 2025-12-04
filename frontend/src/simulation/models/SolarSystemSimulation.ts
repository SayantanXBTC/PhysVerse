import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

interface PlanetData {
  name: string;
  color: number;
  size: number;
  distance: number;
  speed: number;
  tilt: number;
  hasRings?: boolean;
}

export class SolarSystemSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'solar-system',
    name: 'Solar System',
    description: 'Realistic solar system with labeled planets, accurate colors, and orbital mechanics demonstrating Kepler\'s laws',
    category: 'Astronomy',
    difficulty: 'intermediate',
    tags: ['planets', 'orbits', 'solar-system', 'astronomy', 'kepler']
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    timeScale: {
      label: 'Time Scale',
      type: 'number',
      default: 1,
      min: 0.1,
      max: 10,
      step: 0.1,
      description: 'Speed of orbital motion'
    },
    showOrbits: {
      label: 'Show Orbits',
      type: 'boolean',
      default: true,
      description: 'Display orbital paths'
    },
    planetSize: {
      label: 'Planet Size',
      type: 'number',
      default: 1,
      min: 0.5,
      max: 3,
      step: 0.1,
      description: 'Scale of planet sizes'
    }
  };

  private sun: THREE.Mesh | null = null;
  private sunGlow: THREE.Mesh | null = null;
  private starfield: THREE.Points | null = null;
  private planets: Array<{ 
    mesh: THREE.Mesh; 
    orbit: THREE.Line | null; 
    angle: number; 
    speed: number; 
    distance: number;
    name: string;
    trail: THREE.Line | null;
    trailPoints: THREE.Vector3[];
  }> = [];
  private time = 0;
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;

  private createStarfield(scene: THREE.Scene): void {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Random position in a sphere
      const radius = 100 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random star color (white to blue-white)
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.1, 0.2, 0.8 + Math.random() * 0.2);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(this.starfield);
  }

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;

    // Create the Sun with realistic glow
    const sunGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sunMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFDB813,
      emissive: 0xFDB813,
      emissiveIntensity: 1.5,
      metalness: 0,
      roughness: 1
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(this.sun);

    // Add sun glow/corona effect
    const glowGeometry = new THREE.SphereGeometry(1.3, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFAA00,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    this.sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(this.sunGlow);

    // Add starfield background
    this.createStarfield(scene);

    // Realistic planet data with actual names and colors - LARGER DISTANCES
    const planetData: PlanetData[] = [
      { name: 'Mercury', color: 0x8C7853, size: 0.2, distance: 4, speed: 4.15, tilt: 0.03 },
      { name: 'Venus', color: 0xFFC649, size: 0.3, distance: 6, speed: 1.62, tilt: 0.05 },
      { name: 'Earth', color: 0x4169E1, size: 0.32, distance: 8, speed: 1.0, tilt: 0.41 },
      { name: 'Mars', color: 0xCD5C5C, size: 0.24, distance: 10, speed: 0.53, tilt: 0.44 },
      { name: 'Jupiter', color: 0xDAA520, size: 0.7, distance: 14, speed: 0.084, tilt: 0.05 },
      { name: 'Saturn', color: 0xF4A460, size: 0.6, distance: 18, speed: 0.034, tilt: 0.47, hasRings: true },
      { name: 'Uranus', color: 0x4FD0E0, size: 0.45, distance: 22, speed: 0.012, tilt: 1.71 },
      { name: 'Neptune', color: 0x4169E1, size: 0.42, distance: 26, speed: 0.006, tilt: 0.49 }
    ];

    const sizeScale = params.planetSize as number || 1;

    planetData.forEach((data, index) => {
      // Create planet with enhanced visuals
      const geometry = new THREE.SphereGeometry(data.size * sizeScale, 64, 64);
      const material = new THREE.MeshStandardMaterial({ 
        color: data.color,
        metalness: 0.3,
        roughness: 0.7,
        emissive: data.color,
        emissiveIntensity: 0.05
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.rotation.z = data.tilt;
      scene.add(mesh);

      // Add subtle glow to each planet
      const glowGeometry = new THREE.SphereGeometry(data.size * sizeScale * 1.15, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: data.color,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      mesh.add(glow);

      // Add rings for Saturn with multiple bands
      if (data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
          data.size * sizeScale * 1.5, 
          data.size * sizeScale * 2.5, 
          128
        );
        const ringMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xC9B181,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        mesh.add(rings);

        // Add inner ring detail
        const innerRingGeometry = new THREE.RingGeometry(
          data.size * sizeScale * 1.3, 
          data.size * sizeScale * 1.45, 
          128
        );
        const innerRingMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xE5D4B5,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const innerRings = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
        innerRings.rotation.x = Math.PI / 2;
        mesh.add(innerRings);
      }

      // Create orbit path with gradient effect
      let orbit: THREE.Line | null = null;
      if (params.showOrbits) {
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        const colors = [];
        
        for (let i = 0; i <= 256; i++) {
          const angle = (i / 256) * Math.PI * 2;
          orbitPoints.push(new THREE.Vector3(
            Math.cos(angle) * data.distance,
            0,
            Math.sin(angle) * data.distance
          ));
          
          // Gradient color along orbit
          const color = new THREE.Color(data.color);
          const intensity = 0.3 + Math.sin(angle) * 0.2;
          colors.push(color.r * intensity, color.g * intensity, color.b * intensity);
        }
        
        orbitGeometry.setFromPoints(orbitPoints);
        orbitGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const orbitMaterial = new THREE.LineBasicMaterial({ 
          vertexColors: true,
          transparent: true,
          opacity: 0.5
        });
        orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbit);
      }

      this.planets.push({
        mesh,
        orbit,
        angle: (index / planetData.length) * Math.PI * 2,
        speed: data.speed,
        distance: data.distance,
        name: data.name,
        trail: null,
        trailPoints: []
      });
    });
  }

  update(delta: number, _state: SimulationState): void {
    const timeScale = this.params.timeScale as number || 1;
    this.time += delta * timeScale;

    // Animate sun rotation and pulsing glow
    if (this.sun) {
      this.sun.rotation.y += delta * 0.3;
    }
    if (this.sunGlow) {
      this.sunGlow.rotation.y -= delta * 0.2;
      // Pulsing effect
      const pulse = 1 + Math.sin(this.time * 2) * 0.05;
      this.sunGlow.scale.setScalar(pulse);
    }

    // Update planets
    this.planets.forEach((planet, index) => {
      // Update orbital position
      planet.angle += planet.speed * delta * timeScale * 0.1;
      planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
      planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
      
      // Rotate planet on its axis
      planet.mesh.rotation.y += delta * (1 + index * 0.2);

      // Update trail
      if (this.time % 0.1 < delta) { // Add point every 0.1 seconds
        planet.trailPoints.push(planet.mesh.position.clone());
        if (planet.trailPoints.length > 100) {
          planet.trailPoints.shift();
        }

        // Update trail line
        if (planet.trail && this.scene) {
          this.scene.remove(planet.trail);
          planet.trail.geometry.dispose();
          (planet.trail.material as THREE.Material).dispose();
        }

        if (planet.trailPoints.length > 1) {
          const trailGeometry = new THREE.BufferGeometry().setFromPoints(planet.trailPoints);
          
          // Create gradient trail that fades
          const colors = new Float32Array(planet.trailPoints.length * 3);
          const baseColor = (planet.mesh.material as THREE.MeshStandardMaterial).color;
          
          for (let i = 0; i < planet.trailPoints.length; i++) {
            const alpha = i / planet.trailPoints.length;
            colors[i * 3] = baseColor.r * alpha;
            colors[i * 3 + 1] = baseColor.g * alpha;
            colors[i * 3 + 2] = baseColor.b * alpha;
          }
          
          trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          
          const trailMaterial = new THREE.LineBasicMaterial({ 
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            linewidth: 2
          });
          planet.trail = new THREE.Line(trailGeometry, trailMaterial);
          if (this.scene) {
            this.scene.add(planet.trail);
          }
        }
      }
    });
  }

  reset(): void {
    this.time = 0;
    this.planets.forEach((planet, index) => {
      planet.angle = (index / this.planets.length) * Math.PI * 2;
      planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
      planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
    });
  }

  cleanup(): void {
    if (this.sun) {
      this.sun.parent?.remove(this.sun);
      this.sun.geometry.dispose();
      (this.sun.material as THREE.Material).dispose();
      this.sun = null;
    }

    if (this.sunGlow) {
      this.sunGlow.parent?.remove(this.sunGlow);
      this.sunGlow.geometry.dispose();
      (this.sunGlow.material as THREE.Material).dispose();
      this.sunGlow = null;
    }

    if (this.starfield) {
      this.starfield.parent?.remove(this.starfield);
      this.starfield.geometry.dispose();
      (this.starfield.material as THREE.Material).dispose();
      this.starfield = null;
    }

    this.planets.forEach(planet => {
      planet.mesh.parent?.remove(planet.mesh);
      planet.mesh.geometry.dispose();
      (planet.mesh.material as THREE.Material).dispose();
      
      if (planet.orbit) {
        planet.orbit.parent?.remove(planet.orbit);
        planet.orbit.geometry.dispose();
        (planet.orbit.material as THREE.Material).dispose();
      }

      if (planet.trail) {
        planet.trail.parent?.remove(planet.trail);
        planet.trail.geometry.dispose();
        (planet.trail.material as THREE.Material).dispose();
      }
    });

    this.planets = [];
  }

  exportData(): unknown {
    return {
      time: this.time,
      planetPositions: this.planets.map(p => ({
        name: p.name,
        angle: p.angle,
        position: p.mesh.position.toArray(),
        orbitalPeriod: (2 * Math.PI) / p.speed
      }))
    };
  }

  // Helper method to get planet info for UI display
  getPlanetInfo(): Array<{ name: string; distance: number; speed: number; position: THREE.Vector3 }> {
    return this.planets.map(p => ({
      name: p.name,
      distance: p.distance,
      speed: p.speed,
      position: p.mesh.position.clone()
    }));
  }
}
