# Chart Data Reference - What Each Simulation Shows

## Quick Reference Table

| Simulation | Data 1 (Red) | Data 2 (Blue) | Data 3 (Orange/Green) |
|------------|--------------|---------------|----------------------|
| **Projectile** | Height (m) | Horizontal Distance (m) | Velocity (m/s) |
| **Pendulum** | Angle (°) | Angular Velocity (rad/s) | Total Energy (J) |
| **Spring-Mass** | Displacement (m) | Velocity (m/s) | Spring Force (N) |
| **Solar System** | Earth Distance (AU) | Mars Distance (AU) | Orbital Speed (km/s) |
| **Double Pendulum** | Angle 1 (°) | Angle 2 (°) | Total Energy (J) |
| **Rocket** | Altitude (km) | Velocity (m/s) | Acceleration (m/s²) |
| **Wave** | Amplitude (m) | Frequency (Hz) | Wave Energy (J) |
| **Two-Body Orbit** | Separation (AU) | Orbital Velocity (km/s) | Gravitational Force (N) |
| **Lorenz Attractor** | X Position | Y Position | Z Position |

---

## Detailed Descriptions

### 🎯 Projectile Motion
**Chart Title:** "Projectile Motion Data"

**What You'll See:**
- **Height (Red)**: Parabolic curve showing vertical position
- **Horizontal Distance (Blue)**: Linear increase until landing
- **Velocity (Green)**: Decreases at peak, increases on descent

**Key Observations:**
- Height peaks at mid-flight
- Velocity minimum at highest point
- Symmetric trajectory (up = down time)

**Physics:**
- Uses kinematic equations: h = v₀t - ½gt²
- Affected by gravity (9.81 m/s²)
- Responds to angle and initial velocity parameters

---

### 🔄 Pendulum
**Chart Title:** "Pendulum Oscillation Data"

**What You'll See:**
- **Angle (Red)**: Sinusoidal oscillation
- **Angular Velocity (Orange)**: 90° phase shift from angle
- **Total Energy (Green)**: Constant (conservation of energy)

**Key Observations:**
- Regular periodic motion
- Energy stays constant (no friction)
- Velocity maximum at bottom, zero at extremes

**Physics:**
- Simple harmonic motion: θ = θ₀cos(ωt)
- Period depends on length: T = 2π√(L/g)
- Energy: E = ½mL²ω² + mgL(1-cosθ)

---

### 🔗 Spring-Mass System
**Chart Title:** "Spring-Mass System Data"

**What You'll See:**
- **Displacement (Red)**: Oscillation around equilibrium
- **Velocity (Blue)**: 90° out of phase with displacement
- **Spring Force (Orange)**: Proportional to displacement

**Key Observations:**
- Force maximum at maximum displacement
- Velocity maximum at equilibrium
- Periodic motion with constant frequency

**Physics:**
- Hooke's Law: F = -kx
- Angular frequency: ω = √(k/m)
- Energy oscillates between kinetic and potential

---

### 🌍 Solar System
**Chart Title:** "Orbital Mechanics Data"

**What You'll See:**
- **Earth Distance (Blue)**: Constant at 1 AU
- **Mars Distance (Red)**: Constant at 1.52 AU
- **Orbital Speed (Green)**: Earth's velocity ~30 km/s

**Key Observations:**
- Circular orbits (simplified)
- Different orbital periods
- Speed inversely related to distance

**Physics:**
- Kepler's Third Law: T² ∝ a³
- Orbital velocity: v = √(GM/r)
- Gravitational force: F = GMm/r²

---

### 🎭 Double Pendulum
**Chart Title:** "Chaotic Dynamics Data"

**What You'll See:**
- **Angle 1 (Red)**: Chaotic oscillation
- **Angle 2 (Blue)**: Different chaotic pattern
- **Total Energy (Green)**: Nearly constant with small fluctuations

**Key Observations:**
- Unpredictable motion
- No repeating pattern
- Sensitive to initial conditions

**Physics:**
- Coupled differential equations
- Lagrangian mechanics
- Demonstrates deterministic chaos

---

### 🚀 Rocket Launch
**Chart Title:** "Rocket Flight Data"

**What You'll See:**
- **Altitude (Red)**: Increasing curve
- **Velocity (Blue)**: Accelerating upward
- **Acceleration (Orange)**: Increases as mass decreases

**Key Observations:**
- Acceleration increases (mass decreases)
- Velocity grows exponentially
- Altitude follows quadratic curve

**Physics:**
- Tsiolkovsky equation: Δv = vₑln(m₀/mf)
- Thrust vs gravity and drag
- Mass decreases as fuel burns

---

### 🌊 Wave Motion
**Chart Title:** "Wave Propagation Data"

**What You'll See:**
- **Amplitude (Red)**: Oscillating wave height
- **Frequency (Blue)**: Constant oscillation rate
- **Wave Energy (Green)**: Proportional to amplitude²

**Key Observations:**
- Periodic oscillation
- Energy proportional to amplitude squared
- Frequency determines oscillation speed

**Physics:**
- Wave equation: ∂²y/∂t² = v²(∂²y/∂x²)
- Wave speed: v = fλ
- Energy: E ∝ A²f²

---

### 🌌 Two-Body Orbit
**Chart Title:** "Two-Body System Data"

**What You'll See:**
- **Separation (Red)**: Varying distance (elliptical orbit)
- **Orbital Velocity (Blue)**: Faster when closer
- **Gravitational Force (Orange)**: Stronger when closer

**Key Observations:**
- Elliptical orbit variations
- Velocity inversely related to distance
- Force follows inverse square law

**Physics:**
- Kepler's laws of planetary motion
- Conservation of angular momentum
- Gravitational force: F = Gm₁m₂/r²

---

### 🦋 Lorenz Attractor
**Chart Title:** "Lorenz Attractor Data"

**What You'll See:**
- **X Position (Red)**: Chaotic oscillation
- **Y Position (Blue)**: Different chaotic pattern
- **Z Position (Green)**: Bounded chaotic motion

**Key Observations:**
- Strange attractor behavior
- Never repeats exactly
- Butterfly effect demonstration

**Physics:**
- Lorenz equations (simplified)
- Chaotic system dynamics
- Sensitive dependence on initial conditions

---

## How to Use This Reference

### For Students:
1. **Before Running**: Read what data to expect
2. **During Simulation**: Watch for the patterns described
3. **After Running**: Compare your observations with descriptions
4. **Experiment**: Change parameters and see how data changes

### For Teachers:
1. **Lesson Planning**: Use descriptions for lecture content
2. **Demonstrations**: Show expected vs actual behavior
3. **Assignments**: Ask students to explain observed patterns
4. **Assessment**: Test understanding of relationships

### For Developers:
1. **Adding Simulations**: Follow the pattern in existing configs
2. **Testing**: Verify data matches physics equations
3. **Debugging**: Check if data makes physical sense
4. **Documentation**: Update this reference for new simulations

---

## Parameter Effects

### How Parameters Change the Data:

**Projectile:**
- ↑ Initial Velocity → ↑ Max Height, ↑ Range
- ↑ Angle → ↑ Max Height, ↓ Range (until 45°)

**Pendulum:**
- ↑ Length → ↓ Frequency, ↑ Period
- ↑ Initial Angle → ↑ Max Velocity

**Spring-Mass:**
- ↑ Spring Constant → ↑ Frequency, ↑ Force
- ↑ Mass → ↓ Frequency

**Rocket:**
- ↑ Thrust → ↑ Acceleration, ↑ Final Velocity
- ↑ Initial Mass → ↓ Acceleration

---

## Units Reference

| Unit | Meaning | Common Range |
|------|---------|--------------|
| m | meters | 0-100 |
| km | kilometers | 0-1000 |
| m/s | meters per second | 0-100 |
| km/s | kilometers per second | 0-50 |
| m/s² | meters per second squared | 0-20 |
| ° | degrees | -180 to 180 |
| rad/s | radians per second | -10 to 10 |
| J | joules (energy) | 0-100 |
| N | newtons (force) | -100 to 100 |
| Hz | hertz (frequency) | 0-10 |
| AU | astronomical units | 0-10 |

---

## Troubleshooting Data Issues

### Data Looks Wrong?
1. Check simulation is running (not paused)
2. Verify correct simulation selected
3. Reset and try again
4. Check parameter values are reasonable

### Chart Not Updating?
1. Ensure "Show Chart" is enabled
2. Press Play button
3. Wait a few seconds for data collection
4. Try refreshing the page

### Values Too Large/Small?
1. This is normal - different simulations use different scales
2. Check the units in the legend
3. Zoom in/out if needed
4. Compare with expected ranges above

---

This reference helps you understand what physics data each simulation tracks and why it matters!
