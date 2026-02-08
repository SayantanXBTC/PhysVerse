import * as THREE from 'three';
import { PhysicsSimulation, SimulationParameterDefinition, SimulationState, SimulationMetadata } from '../types';

export class MagneticFieldSimulation implements PhysicsSimulation {
  metadata: SimulationMetadata = {
    id: 'magnetic-field',
    name: 'Magnetic Field',
    description: 'Interactive magnetic field visualization with adjustable magnet position and realistic field lines',
    category: 'Electromagnetism',
    difficulty: 'intermediate',
    tags: ['magnetism', 'field', 'physics', 'electromagnetism', 'dipole'],
    premium: true
  };

  parameters: Record<string, SimulationParameterDefinition> = {
    strength: {
      label: 'Field Strength',
      type: 'number',
      default: 1.5,
      min: 0.5,
      max: 3,
      step: 0.1,
      description: 'Magnetic field strength'
    },
    magnetX: {
      label: 'Magnet X Position',
      type: 'number',
      default: 0,
      min: -3,
      max: 3,
      step: 0.5,
      description: 'Horizontal position of magnet'
    },
    magnetY: {
      label: 'Magnet Y Position',
      type: 'number',
      default: 0,
      min: -2,
      max: 2,
      step: 0.5,
      description: 'Vertical position of magnet'
    },
    magnetAngle: {
      label: 'Magnet Angle',
      type: 'number',
      default: 90,
      min: 0,
      max: 180,
      step: 15,
      description: 'Magnet orientation (degrees)'
    },
    lineCount: {
      label: 'Field Lines',
      type: 'number',
      default: 24,
      min: 12,
      max: 48,
      step: 4,
      description: 'Number of field lines'
    },
    showCompass: {
      label: 'Show Compass Needles',
      type: 'boolean',
      default: true,
      description: 'Display compass needles in field'
    }
  };

  private magnet: THREE.Group | null = null;
  private fieldLines: THREE.Line[] = [];
  private compassNeedles: THREE.Group[] = [];
  private time = 0;
  private params: Record<string, unknown> = {};
  private scene: THREE.Scene | null = null;

  initialize(scene: THREE.Scene, params: Record<string, unknown>): void {
    this.params = params;
    this.scene = scene;
    this.time = 0;
    this.compassNeedles = [];

    const magnetX = params.magnetX as number || 0;
    const magnetY = params.magnetY as number || 0;
    const magnetAngle = ((params.magnetAngle as number || 90) * Math.PI) / 180;

    this.magnet = new THREE.Group();

    // North pole (red)
    const northGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32);
    const northMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff3333,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0xff0000,
      emissiveIntensity: 0.2
    });
    const north = new THREE.Mesh(northGeometry, northMaterial);
    north.position.y = 0.75;
    this.magnet.add(north);

    // South pole (blue)
    const southGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32);
    const southMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3333ff,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x0000ff,
      emissiveIntensity: 0.2
    });
    const south = new THREE.Mesh(southGeometry, southMaterial);
    south.position.y = -0.75;
    this.magnet.add(south);

    // Label markers
    const labelGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const nLabel = new THREE.Mesh(labelGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    nLabel.position.y = 1.6;
    this.magnet.add(nLabel);

    const sLabel = new THREE.Mesh(labelGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    sLabel.position.y = -1.6;
    this.magnet.add(sLabel);

    // Position and orient magnet
    this.magnet.position.set(magnetX, magnetY, 0);
    this.magnet.rotation.z = magnetAngle - Math.PI / 2;

    scene.add(this.magnet);

    this.createFieldLines(scene);
    
    if (params.showCompass !== false) {
      this.createCompassNeedles(scene);
    }
  }

  private createFieldLines(scene: THREE.Scene): void {
    const lineCount = this.params.lineCount as number || 24;
    const strength = this.params.strength as number || 1.5;
    const magnetX = this.params.magnetX as number || 0;
    const magnetY = this.params.magnetY as number || 0;
    const magnetAngle = ((this.params.magnetAngle as number || 90) * Math.PI) / 180;

    // Calculate north and south pole positions
    const poleDistance = 1.5;
    const northPos = new THREE.Vector3(
      magnetX + Math.cos(magnetAngle) * poleDistance,
      magnetY + Math.sin(magnetAngle) * poleDistance,
      0
    );
    const southPos = new THREE.Vector3(
      magnetX - Math.cos(magnetAngle) * poleDistance,
      magnetY - Math.sin(magnetAngle) * poleDistance,
      0
    );

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 0.35;
      
      // Start points around north pole
      const startX = northPos.x + Math.cos(angle) * radius;
      const startY = northPos.y + Math.sin(angle) * radius;
      const startZ = Math.sin(angle * 2) * 0.2;

      const points: THREE.Vector3[] = [];
      let x = startX;
      let y = startY;
      let z = startZ;

      // Trace field line using dipole field equations
      for (let j = 0; j < 150; j++) {
        points.push(new THREE.Vector3(x, y, z));

        // Vector from south pole
        const dx_s = x - southPos.x;
        const dy_s = y - southPos.y;
        const dz_s = z - southPos.z;
        const dist_s = Math.sqrt(dx_s * dx_s + dy_s * dy_s + dz_s * dz_s);

        // Vector from north pole
        const dx_n = x - northPos.x;
        const dy_n = y - northPos.y;
        const dz_n = z - northPos.z;
        const dist_n = Math.sqrt(dx_n * dx_n + dy_n * dy_n + dz_n * dz_n);

        if (dist_s > 12 || dist_n > 12) break;

        // Magnetic dipole field (superposition of two monopoles)
        const fieldX = (dx_n / Math.pow(dist_n + 0.1, 3)) - (dx_s / Math.pow(dist_s + 0.1, 3));
        const fieldY = (dy_n / Math.pow(dist_n + 0.1, 3)) - (dy_s / Math.pow(dist_s + 0.1, 3));
        const fieldZ = (dz_n / Math.pow(dist_n + 0.1, 3)) - (dz_s / Math.pow(dist_s + 0.1, 3));

        const fieldMag = Math.sqrt(fieldX * fieldX + fieldY * fieldY + fieldZ * fieldZ);
        if (fieldMag < 0.001) break;

        // Normalize and step
        const step = strength * 0.08;
        x += (fieldX / fieldMag) * step;
        y += (fieldY / fieldMag) * step;
        z += (fieldZ / fieldMag) * step;

        // Check if reached south pole
        if (dist_s < 0.5) break;
      }

      if (points.length > 5) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Color gradient from north (red) to south (blue)
        const colors = new Float32Array(points.length * 3);
        for (let j = 0; j < points.length; j++) {
          const t = j / points.length;
          const color = new THREE.Color().setHSL(0.6 - t * 0.6, 0.8, 0.5);
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({ 
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
          linewidth: 2
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        this.fieldLines.push(line);
      }
    }
  }

  private createCompassNeedles(scene: THREE.Scene): void {
    const magnetX = this.params.magnetX as number || 0;
    const magnetY = this.params.magnetY as number || 0;
    const magnetAngle = ((this.params.magnetAngle as number || 90) * Math.PI) / 180;

    const poleDistance = 1.5;
    const northPos = new THREE.Vector3(
      magnetX + Math.cos(magnetAngle) * poleDistance,
      magnetY + Math.sin(magnetAngle) * poleDistance,
      0
    );
    const southPos = new THREE.Vector3(
      magnetX - Math.cos(magnetAngle) * poleDistance,
      magnetY - Math.sin(magnetAngle) * poleDistance,
      0
    );

    // Create grid of compass needles
    for (let x = -6; x <= 6; x += 1.5) {
      for (let y = -4; y <= 4; y += 1.5) {
        // Skip if too close to magnet
        const distToMagnet = Math.sqrt((x - magnetX) ** 2 + (y - magnetY) ** 2);
        if (distToMagnet < 2) continue;

        const needleGroup = new THREE.Group();
        
        // Calculate field direction at this point
        const dx_n = x - northPos.x;
        const dy_n = y - northPos.y;
        const dist_n = Math.sqrt(dx_n * dx_n + dy_n * dy_n);
        
        const dx_s = x - southPos.x;
        const dy_s = y - southPos.y;
        const dist_s = Math.sqrt(dx_s * dx_s + dy_s * dy_s);

        const fieldX = (dx_n / Math.pow(dist_n + 0.1, 3)) - (dx_s / Math.pow(dist_s + 0.1, 3));
        const fieldY = (dy_n / Math.pow(dist_n + 0.1, 3)) - (dy_s / Math.pow(dist_s + 0.1, 3));
        
        const fieldAngle = Math.atan2(fieldY, fieldX);

        // Needle geometry
        const needleGeometry = new THREE.ConeGeometry(0.08, 0.3, 8);
        const needleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const needle = new THREE.Mesh(needleGeometry, needleMaterial);
        needle.rotation.z = -Math.PI / 2;
        needle.position.x = 0.15;
        needleGroup.add(needle);

        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.rotation.x = Math.PI / 2;
        needleGroup.add(base);

        needleGroup.position.set(x, y, 0);
        needleGroup.rotation.z = fieldAngle;
        
        scene.add(needleGroup);
        this.compassNeedles.push(needleGroup);
      }
    }
  }

  update(delta: number, _state: SimulationState): void {
    this.time += delta;

    // Gentle rotation for visualization
    if (this.magnet) {
      this.magnet.rotation.y = Math.sin(this.time * 0.3) * 0.2;
    }

    // Animate field lines with flowing effect
    this.fieldLines.forEach((line, idx) => {
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = 0.6 + Math.sin(this.time * 2 + idx * 0.3) * 0.2;
    });
  }

  reset(): void {
    if (this.scene) {
      this.cleanup();
      this.initialize(this.scene, this.params);
    }
  }

  cleanup(): void {
    if (this.magnet) {
      this.magnet.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.magnet.parent?.remove(this.magnet);
      this.magnet = null;
    }

    this.fieldLines.forEach(line => {
      line.parent?.remove(line);
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    });
    this.fieldLines = [];

    this.compassNeedles.forEach(needle => {
      needle.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      needle.parent?.remove(needle);
    });
    this.compassNeedles = [];
  }

  exportData(): unknown {
    const magnetX = this.params.magnetX as number || 0;
    const magnetY = this.params.magnetY as number || 0;
    const magnetAngle = this.params.magnetAngle as number || 90;
    const strength = this.params.strength as number || 1.5;

    return {
      time: this.time,
      magnetPosition: { x: magnetX, y: magnetY },
      magnetAngle,
      fieldStrength: strength,
      fieldLineCount: this.fieldLines.length,
      compassNeedleCount: this.compassNeedles.length
    };
  }
}
