# Quick Enhancement Reference Card

## 🎯 Copy-Paste Code Snippets

### 1. Add Gradient Trail
```typescript
private trail: THREE.Line | null = null;
private trailPoints: THREE.Vector3[] = [];

private updateTrail(scene: THREE.Scene): void {
  if (this.trail) {
    scene.remove(this.trail);
    this.trail.geometry.dispose();
    (this.trail.material as THREE.Material).dispose();
  }
  if (this.trailPoints.length < 2) return;

  const geometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
  const colors = new Float32Array(this.trailPoints.length * 3);
  
  for (let i = 0; i < this.trailPoints.length; i++) {
    const alpha = i / this.trailPoints.length;
    const color = new THREE.Color();
    color.setHSL(alpha * 0.7, 1, 0.5); // Adjust hue multiplier for different colors
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });
  
  this.trail = new THREE.Line(geometry, material);
  scene.add(this.trail);
}

// In update():
this.trailPoints.push(position.clone());
if (this.trailPoints.length > 200) this.trailPoints.shift();
this.updateTrail(this.scene);
```

### 2. Add Glow Effect
```typescript
// After creating your main mesh:
const glowGeometry = mainMesh.geometry.clone();
const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000, // Match main color
  transparent: true,
  opacity: 0.3,
  side: THREE.BackSide,
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
glow.scale.multiplyScalar(1.2);
mainMesh.add(glow);
```

### 3. Add Starfield
```typescript
private starfield: THREE.Points | null = null;

private createStarfield(scene: THREE.Scene): void {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMaterial = new THREE.PointsMaterial({
    size: 0.2,
    color: 0xffffff,
  });
  
  this.starfield = new THREE.Points(starGeometry, starMaterial);
  scene.add(this.starfield);
}

// In initialize():
this.createStarfield(scene);
```

### 4. Add Ground Grid
```typescript
private grid: THREE.GridHelper | null = null;

// In initialize():
this.grid = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
this.grid.position.y = 0;
scene.add(this.grid);

// In cleanup():
if (this.grid) {
  this.scene!.remove(this.grid);
  this.grid.geometry.dispose();
  (this.grid.material as THREE.Material).dispose();
}
```

### 5. Add Velocity Arrow
```typescript
private velocityArrow: THREE.ArrowHelper | null = null;

// In initialize():
const direction = velocity.clone().normalize();
const length = velocity.length() * 0.5; // Scale factor
this.velocityArrow = new THREE.ArrowHelper(
  direction,
  position,
  length,
  0x00ff00, // Green
  0.5, // Head length
  0.3  // Head width
);
scene.add(this.velocityArrow);

// In update():
if (this.velocityArrow) {
  const direction = velocity.clone().normalize();
  const length = velocity.length() * 0.5;
  this.velocityArrow.setDirection(direction);
  this.velocityArrow.setLength(length, 0.5, 0.3);
  this.velocityArrow.position.copy(position);
}

// In cleanup():
if (this.velocityArrow) {
  this.scene!.remove(this.velocityArrow);
  this.velocityArrow.dispose();
}
```

### 6. Color by Speed
```typescript
// In update():
const speed = velocity.length();
const maxSpeed = 50; // Adjust based on your simulation
const speedRatio = Math.min(speed / maxSpeed, 1);

const color = new THREE.Color();
color.setHSL(0.6 - speedRatio * 0.6, 1, 0.5); // Blue to Red

const material = mesh.material as THREE.MeshStandardMaterial;
material.color = color;
material.emissive = color.clone().multiplyScalar(0.5);
material.emissiveIntensity = 0.3 + speedRatio * 0.7;
```

### 7. High-Res Geometry
```typescript
// Instead of:
const geometry = new THREE.SphereGeometry(1, 8, 8);

// Use:
const geometry = new THREE.SphereGeometry(1, 32, 32);

// For circles/rings:
const geometry = new THREE.RingGeometry(0.5, 1, 32);

// For cylinders:
const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
```

### 8. Proper Cleanup Template
```typescript
cleanup(): void {
  if (this.scene) {
    // Remove and dispose all meshes
    [this.mesh1, this.mesh2, this.grid, this.starfield].forEach(obj => {
      if (obj) {
        this.scene!.remove(obj);
        if ('geometry' in obj) {
          obj.geometry.dispose();
        }
        if ('material' in obj) {
          const material = obj.material as THREE.Material;
          material.dispose();
        }
      }
    });
    
    // Dispose arrows
    if (this.arrow) {
      this.scene.remove(this.arrow);
      this.arrow.dispose();
    }
    
    // Dispose trails
    if (this.trail) {
      this.scene.remove(this.trail);
      this.trail.geometry.dispose();
      (this.trail.material as THREE.Material).dispose();
    }
  }
}
```

## 🎨 Color Schemes

### Rainbow (Full Spectrum)
```typescript
color.setHSL(alpha * 0.8, 1, 0.5); // 0.8 = most of rainbow
```

### Blue to Red (Speed)
```typescript
color.setHSL(0.6 - ratio * 0.6, 1, 0.5); // 0.6=blue, 0=red
```

### Green to Yellow (Energy)
```typescript
color.setHSL(0.3 - ratio * 0.15, 1, 0.5); // 0.3=green, 0.15=yellow
```

### Purple to Pink (Quantum)
```typescript
color.setHSL(0.8 - ratio * 0.1, 1, 0.5); // 0.8=purple, 0.7=pink
```

### Orange to Red (Heat)
```typescript
color.setHSL(0.1 - ratio * 0.1, 1, 0.5); // 0.1=orange, 0=red
```

## 📏 Common Values

### Trail Lengths
- Simple motion: 50-100 points
- Complex paths: 200-500 points
- Chaotic systems: 1000-2000 points

### Glow Opacity
- Subtle: 0.2
- Normal: 0.3-0.4
- Strong: 0.5-0.6

### Emissive Intensity
- Dim: 0.3
- Normal: 0.5
- Bright: 0.8-1.0

### Geometry Segments
- Low quality: 8-16
- Normal: 16-24
- High quality: 32
- Ultra: 64 (use sparingly)

### Starfield
- Count: 1000-2000 stars
- Size: 0.1-0.3
- Spread: 200 units

## ⚡ Performance Tips

### If FPS drops:
1. Reduce trail length: 2000 → 500
2. Lower geometry segments: 32 → 16
3. Reduce particle count: 1000 → 500
4. Simplify materials: Standard → Basic
5. Limit glow effects: Remove outer glow

### Memory Management:
- Always dispose geometries
- Always dispose materials
- Remove from scene before disposing
- Clear arrays in reset()

## 🔍 Quick Debug

### Trail not showing?
```typescript
console.log('Trail points:', this.trailPoints.length);
console.log('Trail object:', this.trail);
```

### Colors wrong?
```typescript
console.log('HSL:', hue, saturation, lightness);
console.log('RGB:', color.r, color.g, color.b);
```

### Performance issues?
```typescript
console.log('FPS:', 1 / deltaTime);
console.log('Trail length:', this.trailPoints.length);
```

## 📋 Enhancement Checklist

For each simulation:
- [ ] High-res geometries (32 segments)
- [ ] Gradient trail with colors
- [ ] Glow effect on main object
- [ ] Background (grid or starfield)
- [ ] Velocity/force arrows
- [ ] Color by speed/energy
- [ ] Proper cleanup method
- [ ] Test all parameters
- [ ] Test reset function
- [ ] Check console for errors
- [ ] Verify 60 FPS

## 🚀 Quick Start

1. Open simulation file
2. Add private properties for new objects
3. Copy-paste patterns from above
4. Call in initialize()
5. Update in update()
6. Clean in cleanup()
7. Test!

---

**Keep this file open while enhancing simulations for quick reference!**
