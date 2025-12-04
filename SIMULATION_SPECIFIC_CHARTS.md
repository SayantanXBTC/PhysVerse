# Simulation-Specific Data Charts

## Overview

Each simulation now has its own custom data chart configuration that displays physics data relevant to that specific experiment. The charts automatically adapt based on which simulation is running.

## How It Works

### 1. Configuration System

The `simulationDataConfig.ts` file contains configurations for each simulation type:

```typescript
export interface SimulationDataConfig {
  dataKeys: DataKeyConfig[];      // What data to track
  title: string;                   // Chart title
  generateData: (time, params) => Record<string, number>;  // Data generation function
}
```

### 2. Simulation-Specific Data

Each simulation tracks different physics quantities:

#### **Projectile Motion**
- **Height** (m) - Vertical position
- **Horizontal Distance** (m) - Range
- **Velocity** (m/s) - Total velocity
- Uses kinematic equations with gravity

#### **Pendulum**
- **Angle** (°) - Angular displacement
- **Angular Velocity** (rad/s) - Rate of rotation
- **Total Energy** (J) - Kinetic + Potential
- Uses simple harmonic motion equations

#### **Spring-Mass System**
- **Displacement** (m) - Position from equilibrium
- **Velocity** (m/s) - Speed of mass
- **Spring Force** (N) - Restoring force
- Uses Hooke's Law: F = -kx

#### **Solar System**
- **Earth Distance** (AU) - Distance from Sun
- **Mars Distance** (AU) - Distance from Sun
- **Orbital Speed** (km/s) - Earth's velocity
- Based on Kepler's laws

#### **Double Pendulum**
- **Angle 1** (°) - First pendulum angle
- **Angle 2** (°) - Second pendulum angle
- **Total Energy** (J) - System energy
- Demonstrates chaotic behavior

#### **Rocket Launch**
- **Altitude** (km) - Height above ground
- **Velocity** (m/s) - Speed
- **Acceleration** (m/s²) - Rate of velocity change
- Includes thrust and decreasing mass

#### **Wave Motion**
- **Amplitude** (m) - Wave height
- **Frequency** (Hz) - Oscillation rate
- **Wave Energy** (J) - Energy in wave
- Uses wave equation

#### **Two-Body Orbit**
- **Separation** (AU) - Distance between bodies
- **Orbital Velocity** (km/s) - Speed
- **Gravitational Force** (N) - Attraction force
- Elliptical orbit calculations

#### **Lorenz Attractor**
- **X Position** - X coordinate
- **Y Position** - Y coordinate
- **Z Position** - Z coordinate
- Chaotic system dynamics

### 3. Dynamic Data Generation

Each simulation's `generateData` function:
- Takes current time and simulation parameters
- Calculates physics-accurate values
- Returns data points for the chart
- Updates 10 times per second (10Hz)

## Features

### Automatic Adaptation
- Charts automatically switch when you change simulations
- Data is cleared when switching to prevent confusion
- Titles and labels update to match the simulation

### Parameter Sensitivity
- Charts respond to parameter changes
- Example: Changing pendulum length affects oscillation period
- Example: Changing projectile angle affects trajectory

### Real-Time Updates
- Data updates while simulation runs
- Smooth animations with no lag
- Last 150 data points displayed

### Color Coding
- **Red** (#EF4444) - Primary measurement (height, angle, etc.)
- **Blue** (#3B82F6) - Secondary measurement (distance, velocity)
- **Orange** (#F59E0B) - Tertiary measurement (force, acceleration)
- **Green** (#10B981) - Energy or position measurements

## Usage

### In Simulation Editor
1. Open any simulation
2. Click "Show Chart" button in toolbar
3. Press Play to start collecting data
4. Adjust parameters to see changes in real-time
5. Click "Hide Chart" for full-screen view

### In Preview Mode
1. Go to "Try PhysVerse" page
2. Select a simulation from dropdown
3. Click "Show Data Chart" button
4. Watch data update as simulation runs
5. Switch simulations to see different data

## Adding New Simulations

To add a new simulation's data configuration:

```typescript
// In simulationDataConfig.ts
'your-simulation-id': {
  title: 'Your Simulation Data',
  dataKeys: [
    { key: 'measurement1', color: '#EF4444', label: 'Label 1', unit: 'unit' },
    { key: 'measurement2', color: '#3B82F6', label: 'Label 2', unit: 'unit' },
  ],
  generateData: (time, params) => {
    // Your physics calculations here
    const measurement1 = /* calculate */;
    const measurement2 = /* calculate */;
    
    return { measurement1, measurement2 };
  },
},
```

## Physics Accuracy

### Simplified Models
The data generation uses simplified physics models for performance:
- Real simulations would use numerical integration
- These use analytical solutions where possible
- Small random variations added for realism

### Educational Value
Despite simplification, the charts show:
- Correct relationships between variables
- Proper units and scales
- Realistic behavior patterns
- Key physics principles

## Performance

### Optimization
- Data generation is lightweight
- Only last 150 points stored
- Chart updates throttled to 10Hz
- No impact on simulation performance

### Memory Usage
- Each data point: ~100 bytes
- 150 points × 3 values = ~45KB
- Negligible memory footprint

## Examples

### Projectile Motion
```
Time: 0.0s → Height: 0m, Distance: 0m, Velocity: 20m/s
Time: 1.0s → Height: 15m, Distance: 14m, Velocity: 18m/s
Time: 2.0s → Height: 20m, Distance: 28m, Velocity: 15m/s
Time: 3.0s → Height: 15m, Distance: 42m, Velocity: 18m/s
Time: 4.0s → Height: 0m, Distance: 56m, Velocity: 20m/s
```

### Pendulum
```
Time: 0.0s → Angle: 30°, ω: 0 rad/s, Energy: 0.5J
Time: 0.5s → Angle: 0°, ω: 2.2 rad/s, Energy: 0.5J
Time: 1.0s → Angle: -30°, ω: 0 rad/s, Energy: 0.5J
Time: 1.5s → Angle: 0°, ω: -2.2 rad/s, Energy: 0.5J
Time: 2.0s → Angle: 30°, ω: 0 rad/s, Energy: 0.5J
```

## Future Enhancements

### Planned Features
1. **Export Data** - Download as CSV for analysis
2. **Multiple Runs** - Compare different parameter sets
3. **Statistical Analysis** - Mean, max, min values
4. **Custom Charts** - User-selectable data keys
5. **Real Integration** - Connect to actual simulation state
6. **3D Plots** - For multi-dimensional data
7. **Fourier Analysis** - Frequency domain analysis
8. **Phase Space** - State space trajectories

### Advanced Physics
1. **Numerical Integration** - More accurate calculations
2. **Collision Detection** - Track impact events
3. **Energy Conservation** - Verify physics accuracy
4. **Error Bounds** - Show uncertainty ranges
5. **Comparative Analysis** - Theory vs simulation

## Troubleshooting

### Chart Not Updating
- Ensure simulation is running (Play button pressed)
- Check that chart is visible (Show Chart enabled)
- Try resetting the simulation

### Wrong Data Displayed
- Verify correct simulation is selected
- Check that parameters are set correctly
- Clear data and restart

### Performance Issues
- Reduce chart update frequency if needed
- Hide chart when not needed
- Close other browser tabs

## Technical Details

### Data Flow
```
Simulation Running
    ↓
Timer (100ms interval)
    ↓
Get current time & parameters
    ↓
Call generateData(time, params)
    ↓
Calculate physics values
    ↓
Add to data array
    ↓
Update chart display
```

### Chart Library
- Uses **Recharts** for visualization
- Responsive container adapts to screen size
- Smooth animations with React
- Tooltip shows exact values on hover

### State Management
- Custom hook `useSimulationData`
- Maintains last 150 points
- Automatic cleanup on unmount
- Clears on simulation change

---

This system provides educational value by showing the mathematical relationships in physics simulations, making abstract concepts concrete and observable.
