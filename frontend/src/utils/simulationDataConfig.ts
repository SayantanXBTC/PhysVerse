// Configuration for simulation-specific data tracking and visualization

export interface DataKeyConfig {
  key: string;
  color: string;
  label: string;
  unit: string;
}

export interface SimulationDataConfig {
  dataKeys: DataKeyConfig[];
  title: string;
  generateData: (time: number, params?: Record<string, unknown>) => Record<string, number>;
}

export const simulationDataConfigs: Record<string, SimulationDataConfig> = {
  'projectile': {
    title: 'Projectile Motion Data',
    dataKeys: [
      { key: 'height', color: '#EF4444', label: 'Height', unit: 'm' },
      { key: 'horizontalDistance', color: '#3B82F6', label: 'Horizontal Distance', unit: 'm' },
      { key: 'velocity', color: '#10B981', label: 'Velocity', unit: 'm/s' },
    ],
    generateData: (time, params) => {
      const g = 9.81;
      const v0 = (params?.initialVelocity as number) || 20;
      const angle = ((params?.angle as number) || 45) * Math.PI / 180;
      const vx = v0 * Math.cos(angle);
      const vy = v0 * Math.sin(angle);
      
      const height = Math.max(0, vy * time - 0.5 * g * time * time);
      const horizontalDistance = vx * time;
      const velocity = Math.sqrt(vx * vx + Math.pow(vy - g * time, 2));
      
      return { height, horizontalDistance, velocity };
    },
  },
  
  'pendulum': {
    title: 'Pendulum Oscillation Data',
    dataKeys: [
      { key: 'angle', color: '#EF4444', label: 'Angle', unit: '°' },
      { key: 'angularVelocity', color: '#F59E0B', label: 'Angular Velocity', unit: 'rad/s' },
      { key: 'energy', color: '#10B981', label: 'Total Energy', unit: 'J' },
    ],
    generateData: (time, params) => {
      const length = (params?.length as number) || 2;
      const initialAngle = ((params?.initialAngle as number) || 30) * Math.PI / 180;
      const g = 9.81;
      const omega = Math.sqrt(g / length);
      
      const angle = initialAngle * Math.cos(omega * time) * 180 / Math.PI;
      const angularVelocity = -initialAngle * omega * Math.sin(omega * time);
      const energy = 0.5 * length * length * angularVelocity * angularVelocity + 
                     g * length * (1 - Math.cos(angle * Math.PI / 180));
      
      return { angle, angularVelocity, energy };
    },
  },
  
  'spring-mass': {
    title: 'Spring-Mass System Data',
    dataKeys: [
      { key: 'displacement', color: '#EF4444', label: 'Displacement', unit: 'm' },
      { key: 'velocity', color: '#3B82F6', label: 'Velocity', unit: 'm/s' },
      { key: 'force', color: '#F59E0B', label: 'Spring Force', unit: 'N' },
    ],
    generateData: (time, params) => {
      const k = (params?.springConstant as number) || 10;
      const m = (params?.mass as number) || 1;
      const A = (params?.amplitude as number) || 2;
      const omega = Math.sqrt(k / m);
      
      const displacement = A * Math.cos(omega * time);
      const velocity = -A * omega * Math.sin(omega * time);
      const force = -k * displacement;
      
      return { displacement, velocity, force };
    },
  },
  
  'solar-system': {
    title: 'Orbital Mechanics Data',
    dataKeys: [
      { key: 'earthDistance', color: '#3B82F6', label: 'Earth Distance', unit: 'AU' },
      { key: 'marsDistance', color: '#EF4444', label: 'Mars Distance', unit: 'AU' },
      { key: 'orbitalSpeed', color: '#10B981', label: 'Earth Speed', unit: 'km/s' },
    ],
    generateData: (_time) => {
      const earthOrbit = 1; // AU
      const marsOrbit = 1.52;
      const orbitalSpeed = 29.78; // km/s for Earth
      
      const earthDistance = earthOrbit;
      const marsDistance = marsOrbit;
      
      return { earthDistance, marsDistance, orbitalSpeed };
    },
  },
  
  'double-pendulum': {
    title: 'Chaotic Dynamics Data',
    dataKeys: [
      { key: 'angle1', color: '#EF4444', label: 'Angle 1', unit: '°' },
      { key: 'angle2', color: '#3B82F6', label: 'Angle 2', unit: '°' },
      { key: 'totalEnergy', color: '#10B981', label: 'Total Energy', unit: 'J' },
    ],
    generateData: (time) => {
      // Simplified chaotic behavior
      const angle1 = 45 * Math.sin(time * 2.1) * Math.cos(time * 0.7);
      const angle2 = 30 * Math.cos(time * 1.8) * Math.sin(time * 1.3);
      const totalEnergy = 10 + Math.random() * 0.5; // Small fluctuations
      
      return { angle1, angle2, totalEnergy };
    },
  },
  
  'rocket': {
    title: 'Rocket Flight Data',
    dataKeys: [
      { key: 'altitude', color: '#EF4444', label: 'Altitude', unit: 'km' },
      { key: 'velocity', color: '#3B82F6', label: 'Velocity', unit: 'm/s' },
      { key: 'acceleration', color: '#F59E0B', label: 'Acceleration', unit: 'm/s²' },
    ],
    generateData: (time) => {
      const thrust = 1000; // N
      const mass = 100 - time * 2; // Decreasing mass
      const g = 9.81;
      
      const acceleration = Math.max(0, (thrust / Math.max(mass, 10)) - g);
      const velocity = Math.min(200, acceleration * time);
      const altitude = 0.5 * acceleration * time * time / 1000; // Convert to km
      
      return { altitude, velocity, acceleration };
    },
  },
  
  'wave': {
    title: 'Wave Propagation Data',
    dataKeys: [
      { key: 'amplitude', color: '#EF4444', label: 'Amplitude', unit: 'm' },
      { key: 'frequency', color: '#3B82F6', label: 'Frequency', unit: 'Hz' },
      { key: 'energy', color: '#10B981', label: 'Wave Energy', unit: 'J' },
    ],
    generateData: (time, params) => {
      const f = (params?.frequency as number) || 2;
      const A = (params?.amplitude as number) || 1;
      
      const amplitude = A * Math.abs(Math.sin(2 * Math.PI * f * time));
      const frequency = f;
      const energy = 0.5 * A * A * f * f;
      
      return { amplitude, frequency, energy };
    },
  },
  
  'two-body-orbit': {
    title: 'Two-Body System Data',
    dataKeys: [
      { key: 'separation', color: '#EF4444', label: 'Separation', unit: 'AU' },
      { key: 'orbitalVelocity', color: '#3B82F6', label: 'Orbital Velocity', unit: 'km/s' },
      { key: 'gravitationalForce', color: '#F59E0B', label: 'Gravitational Force', unit: 'N' },
    ],
    generateData: (time, params) => {
      const a = (params?.semiMajorAxis as number) || 1;
      const e = (params?.eccentricity as number) || 0.2;
      
      const theta = time * 0.5;
      const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
      const separation = r;
      const orbitalVelocity = 30 / Math.sqrt(r);
      const gravitationalForce = 1 / (r * r);
      
      return { separation, orbitalVelocity, gravitationalForce };
    },
  },
  
  'lorenz-attractor': {
    title: 'Lorenz Attractor Data',
    dataKeys: [
      { key: 'x', color: '#EF4444', label: 'X Position', unit: '' },
      { key: 'y', color: '#3B82F6', label: 'Y Position', unit: '' },
      { key: 'z', color: '#10B981', label: 'Z Position', unit: '' },
    ],
    generateData: (time) => {
      // Simplified Lorenz attractor behavior
      const x = 10 * Math.sin(time * 0.5);
      const y = 15 * Math.cos(time * 0.7);
      const z = 20 + 10 * Math.sin(time * 0.3);
      
      return { x, y, z };
    },
  },

  'particle-system': {
    title: 'Particle System Data',
    dataKeys: [
      { key: 'particleCount', color: '#EF4444', label: 'Active Particles', unit: '' },
      { key: 'averageVelocity', color: '#3B82F6', label: 'Avg Velocity', unit: 'm/s' },
      { key: 'systemEnergy', color: '#10B981', label: 'System Energy', unit: 'J' },
    ],
    generateData: (time) => {
      const particleCount = 50 + Math.sin(time * 0.5) * 20;
      const averageVelocity = 5 + Math.cos(time * 0.8) * 2;
      const systemEnergy = particleCount * averageVelocity * 0.5;
      
      return { particleCount, averageVelocity, systemEnergy };
    },
  },

  'bouncing-balls': {
    title: 'Bouncing Balls Data',
    dataKeys: [
      { key: 'maxHeight', color: '#EF4444', label: 'Max Height', unit: 'm' },
      { key: 'impactVelocity', color: '#3B82F6', label: 'Impact Velocity', unit: 'm/s' },
      { key: 'kineticEnergy', color: '#10B981', label: 'Kinetic Energy', unit: 'J' },
    ],
    generateData: (time, params) => {
      const restitution = (params?.restitution as number) || 0.8;
      const g = 9.81;
      
      const maxHeight = 5 * Math.pow(restitution, Math.floor(time / 2));
      const impactVelocity = Math.sqrt(2 * g * maxHeight);
      const kineticEnergy = 0.5 * impactVelocity * impactVelocity;
      
      return { maxHeight, impactVelocity, kineticEnergy };
    },
  },

  'fluid': {
    title: 'Fluid Dynamics Data',
    dataKeys: [
      { key: 'flowVelocity', color: '#EF4444', label: 'Flow Velocity', unit: 'm/s' },
      { key: 'pressure', color: '#3B82F6', label: 'Pressure', unit: 'Pa' },
      { key: 'vorticity', color: '#F59E0B', label: 'Vorticity', unit: '1/s' },
    ],
    generateData: (time, params) => {
      const viscosity = (params?.viscosity as number) || 0.001;
      
      const flowVelocity = 2 + Math.sin(time * 0.5) * 0.5;
      const pressure = 101325 + flowVelocity * 1000;
      const vorticity = flowVelocity / viscosity * 0.01;
      
      return { flowVelocity, pressure, vorticity };
    },
  },

  'fractal-tree': {
    title: 'Fractal Growth Data',
    dataKeys: [
      { key: 'branchCount', color: '#EF4444', label: 'Branch Count', unit: '' },
      { key: 'treeHeight', color: '#10B981', label: 'Tree Height', unit: 'm' },
      { key: 'complexity', color: '#F59E0B', label: 'Complexity', unit: '' },
    ],
    generateData: (time, params) => {
      const iterations = Math.min((params?.iterations as number) || 5, 10);
      
      const branchCount = Math.pow(2, Math.min(iterations, time / 2));
      const treeHeight = 10 * (1 - Math.pow(0.7, iterations));
      const complexity = branchCount * treeHeight / 10;
      
      return { branchCount, treeHeight, complexity };
    },
  },

  'dna-helix': {
    title: 'DNA Helix Data',
    dataKeys: [
      { key: 'helixAngle', color: '#EF4444', label: 'Helix Angle', unit: '°' },
      { key: 'basePairs', color: '#3B82F6', label: 'Base Pairs', unit: '' },
      { key: 'pitch', color: '#10B981', label: 'Helix Pitch', unit: 'nm' },
    ],
    generateData: (time) => {
      const helixAngle = (time * 36) % 360; // 10 base pairs per turn
      const basePairs = 20;
      const pitch = 3.4; // nm per turn
      
      return { helixAngle, basePairs, pitch };
    },
  },

  'magnetic-field': {
    title: 'Magnetic Field Data',
    dataKeys: [
      { key: 'fieldStrength', color: '#EF4444', label: 'Field Strength', unit: 'T' },
      { key: 'flux', color: '#3B82F6', label: 'Magnetic Flux', unit: 'Wb' },
      { key: 'fieldLines', color: '#10B981', label: 'Field Lines', unit: '' },
    ],
    generateData: (time, params) => {
      const current = (params?.current as number) || 1;
      
      const fieldStrength = current * 0.001 * (1 + Math.sin(time * 0.5) * 0.2);
      const flux = fieldStrength * Math.PI * 0.01; // Area = 0.01 m²
      const fieldLines = Math.floor(fieldStrength * 1000);
      
      return { fieldStrength, flux, fieldLines };
    },
  },

  'quantum-tunneling': {
    title: 'Quantum Tunneling Data',
    dataKeys: [
      { key: 'probability', color: '#EF4444', label: 'Tunneling Probability', unit: '%' },
      { key: 'waveAmplitude', color: '#3B82F6', label: 'Wave Amplitude', unit: '' },
      { key: 'barrierPenetration', color: '#F59E0B', label: 'Barrier Penetration', unit: 'nm' },
    ],
    generateData: (time, params) => {
      const barrierHeight = (params?.barrierHeight as number) || 5;
      const energy = (params?.particleEnergy as number) || 3;
      
      const probability = Math.exp(-(barrierHeight - energy)) * 100;
      const waveAmplitude = Math.cos(time * 2) * Math.exp(-time * 0.1);
      const barrierPenetration = probability / 10;
      
      return { probability, waveAmplitude, barrierPenetration };
    },
  },

  'black-hole': {
    title: 'Black Hole Data',
    dataKeys: [
      { key: 'eventHorizon', color: '#EF4444', label: 'Event Horizon', unit: 'km' },
      { key: 'accretionRate', color: '#F59E0B', label: 'Accretion Rate', unit: 'M☉/yr' },
      { key: 'hawkingRadiation', color: '#3B82F6', label: 'Hawking Radiation', unit: 'W' },
    ],
    generateData: (time, params) => {
      const mass = (params?.mass as number) || 10; // Solar masses
      
      const eventHorizon = 2.95 * mass; // Schwarzschild radius in km
      const accretionRate = 0.1 * (1 + Math.sin(time * 0.3) * 0.5);
      const hawkingRadiation = 1e-28 / (mass * mass); // Simplified
      
      return { eventHorizon, accretionRate, hawkingRadiation };
    },
  },

  'tornado': {
    title: 'Tornado Dynamics Data',
    dataKeys: [
      { key: 'windSpeed', color: '#EF4444', label: 'Wind Speed', unit: 'km/h' },
      { key: 'pressure', color: '#3B82F6', label: 'Core Pressure', unit: 'hPa' },
      { key: 'rotationRate', color: '#F59E0B', label: 'Rotation Rate', unit: 'rpm' },
    ],
    generateData: (time, params) => {
      const intensity = (params?.intensity as number) || 3; // EF scale
      
      const windSpeed = 100 * intensity * (1 + Math.sin(time * 0.8) * 0.3);
      const pressure = 1013 - intensity * 50 - Math.cos(time * 0.5) * 20;
      const rotationRate = intensity * 20 * (1 + Math.cos(time * 1.2) * 0.2);
      
      return { windSpeed, pressure, rotationRate };
    },
  },

  'galaxy-collision': {
    title: 'Galaxy Collision Data',
    dataKeys: [
      { key: 'separation', color: '#EF4444', label: 'Galaxy Separation', unit: 'kpc' },
      { key: 'starFormation', color: '#10B981', label: 'Star Formation Rate', unit: 'M☉/yr' },
      { key: 'tidalForce', color: '#F59E0B', label: 'Tidal Force', unit: 'N' },
    ],
    generateData: (time) => {
      const separation = Math.max(10, 100 - time * 5);
      const starFormation = 10 * Math.exp(-separation / 50);
      const tidalForce = 1e20 / (separation * separation);
      
      return { separation, starFormation, tidalForce };
    },
  },

  'em-wave': {
    title: 'Electromagnetic Wave Data',
    dataKeys: [
      { key: 'electricField', color: '#EF4444', label: 'Electric Field', unit: 'V/m' },
      { key: 'magneticField', color: '#3B82F6', label: 'Magnetic Field', unit: 'T' },
      { key: 'intensity', color: '#F59E0B', label: 'Intensity', unit: 'W/m²' },
    ],
    generateData: (time, params) => {
      const frequency = (params?.frequency as number) || 1e9; // Hz
      const amplitude = (params?.amplitude as number) || 1;
      
      const electricField = amplitude * Math.sin(2 * Math.PI * frequency * time * 1e-9);
      const magneticField = electricField / 3e8; // c = E/B
      const intensity = 0.5 * amplitude * amplitude / 377; // Free space impedance
      
      return { electricField, magneticField, intensity };
    },
  },

  'newtons-cradle': {
    title: "Newton's Cradle Data",
    dataKeys: [
      { key: 'momentum', color: '#EF4444', label: 'Total Momentum', unit: 'kg⋅m/s' },
      { key: 'kineticEnergy', color: '#10B981', label: 'Kinetic Energy', unit: 'J' },
      { key: 'collisionForce', color: '#F59E0B', label: 'Collision Force', unit: 'N' },
    ],
    generateData: (_time) => {
      const period = 2;
      const phase = (_time % period) / period;
      
      const momentum = 5; // Conserved
      const kineticEnergy = 10 * Math.abs(Math.sin(Math.PI * phase));
      const collisionForce = phase < 0.1 || phase > 0.9 ? 100 : 0;
      
      return { momentum, kineticEnergy, collisionForce };
    },
  },

  'gyroscope': {
    title: 'Gyroscope Data',
    dataKeys: [
      { key: 'angularMomentum', color: '#EF4444', label: 'Angular Momentum', unit: 'kg⋅m²/s' },
      { key: 'precessionRate', color: '#3B82F6', label: 'Precession Rate', unit: 'rad/s' },
      { key: 'spinRate', color: '#10B981', label: 'Spin Rate', unit: 'rpm' },
    ],
    generateData: (_time, params) => {
      const spinRate = (params?.spinRate as number) || 3000;
      
      const angularMomentum = spinRate * 0.01; // Simplified
      const precessionRate = 9.81 / angularMomentum;
      
      return { angularMomentum, precessionRate, spinRate };
    },
  },

  'atomic-orbital': {
    title: 'Atomic Orbital Data',
    dataKeys: [
      { key: 'probability', color: '#EF4444', label: 'Electron Probability', unit: '%' },
      { key: 'energy', color: '#3B82F6', label: 'Energy Level', unit: 'eV' },
      { key: 'radius', color: '#10B981', label: 'Orbital Radius', unit: 'pm' },
    ],
    generateData: (time, params) => {
      const n = (params?.principalQuantum as number) || 1;
      
      const probability = 100 * Math.exp(-time * 0.1) * Math.abs(Math.sin(time * 2));
      const energy = -13.6 / (n * n);
      const radius = 52.9 * n * n; // Bohr radius in pm
      
      return { probability, energy, radius };
    },
  },

  'superconductor': {
    title: 'Superconductor Data',
    dataKeys: [
      { key: 'resistance', color: '#EF4444', label: 'Resistance', unit: 'Ω' },
      { key: 'current', color: '#3B82F6', label: 'Current', unit: 'A' },
      { key: 'magneticField', color: '#F59E0B', label: 'Magnetic Field', unit: 'T' },
    ],
    generateData: (_time, params) => {
      const temperature = (params?.temperature as number) || 4; // Kelvin
      const criticalTemp = 9.2; // Kelvin
      
      const resistance = temperature > criticalTemp ? 0.1 : 0;
      const current = temperature <= criticalTemp ? 100 : 10;
      const magneticField = current * 0.001;
      
      return { resistance, current, magneticField };
    },
  },

  'plasma': {
    title: 'Plasma Physics Data',
    dataKeys: [
      { key: 'temperature', color: '#EF4444', label: 'Temperature', unit: 'K' },
      { key: 'density', color: '#3B82F6', label: 'Particle Density', unit: 'm⁻³' },
      { key: 'debyeLength', color: '#10B981', label: 'Debye Length', unit: 'mm' },
    ],
    generateData: (time, params) => {
      const power = (params?.power as number) || 1000;
      
      const temperature = 10000 + power * 5 + Math.sin(time * 0.5) * 1000;
      const density = 1e16 * (1 + Math.cos(time * 0.8) * 0.2);
      const debyeLength = 743 * Math.sqrt(temperature / density) * 1e6; // Convert to mm
      
      return { temperature, density, debyeLength };
    },
  },

  'relativistic': {
    title: 'Relativistic Particle Data',
    dataKeys: [
      { key: 'velocity', color: '#EF4444', label: 'Velocity', unit: 'c' },
      { key: 'gamma', color: '#3B82F6', label: 'Lorentz Factor', unit: '' },
      { key: 'mass', color: '#10B981', label: 'Relativistic Mass', unit: 'm₀' },
    ],
    generateData: (time, params) => {
      const acceleration = (params?.acceleration as number) || 0.1;
      
      const velocity = Math.min(0.99, acceleration * time);
      const gamma = 1 / Math.sqrt(1 - velocity * velocity);
      const mass = gamma;
      
      return { velocity, gamma, mass };
    },
  },

  'crystal-growth': {
    title: 'Crystal Growth Data',
    dataKeys: [
      { key: 'crystalSize', color: '#EF4444', label: 'Crystal Size', unit: 'μm' },
      { key: 'growthRate', color: '#3B82F6', label: 'Growth Rate', unit: 'μm/s' },
      { key: 'nucleationSites', color: '#10B981', label: 'Nucleation Sites', unit: '' },
    ],
    generateData: (time, params) => {
      const supersaturation = (params?.supersaturation as number) || 1.5;
      
      const crystalSize = 10 * Math.sqrt(time * supersaturation);
      const growthRate = 5 * supersaturation / Math.sqrt(time + 1);
      const nucleationSites = Math.floor(20 * supersaturation);
      
      return { crystalSize, growthRate, nucleationSites };
    },
  },

  'entanglement': {
    title: 'Quantum Entanglement Data',
    dataKeys: [
      { key: 'correlation', color: '#EF4444', label: 'Correlation', unit: '' },
      { key: 'fidelity', color: '#3B82F6', label: 'Fidelity', unit: '%' },
      { key: 'concurrence', color: '#10B981', label: 'Concurrence', unit: '' },
    ],
    generateData: (_time) => {
      const correlation = Math.cos(_time * 0.5);
      const fidelity = 95 + Math.sin(_time * 0.3) * 5;
      const concurrence = Math.abs(correlation);
      
      return { correlation, fidelity, concurrence };
    },
  },

  'n-body': {
    title: 'N-Body Gravity Data',
    dataKeys: [
      { key: 'totalEnergy', color: '#EF4444', label: 'Total Energy', unit: 'J' },
      { key: 'centerOfMass', color: '#3B82F6', label: 'Center of Mass', unit: 'm' },
      { key: 'virial', color: '#10B981', label: 'Virial Ratio', unit: '' },
    ],
    generateData: (time, params) => {
      const bodies = (params?.numberOfBodies as number) || 5;
      
      const totalEnergy = -bodies * 10 * (1 + Math.sin(time * 0.2) * 0.1);
      const centerOfMass = Math.sin(time * 0.3) * 2;
      const virial = 2; // Virial theorem: 2K + U = 0
      
      return { totalEnergy, centerOfMass, virial };
    },
  },

  'supernova': {
    title: 'Supernova Data',
    dataKeys: [
      { key: 'luminosity', color: '#EF4444', label: 'Luminosity', unit: 'L☉' },
      { key: 'shockwaveRadius', color: '#3B82F6', label: 'Shockwave Radius', unit: 'AU' },
      { key: 'ejectaMass', color: '#F59E0B', label: 'Ejected Mass', unit: 'M☉' },
    ],
    generateData: (time) => {
      const luminosity = 1e9 * Math.exp(-time / 10);
      const shockwaveRadius = 0.1 * time * time;
      const ejectaMass = 5 * (1 - Math.exp(-time / 5));
      
      return { luminosity, shockwaveRadius, ejectaMass };
    },
  },

  'quantum-oscillator': {
    title: 'Quantum Harmonic Oscillator Data',
    dataKeys: [
      { key: 'energy', color: '#EF4444', label: 'Energy Level', unit: 'ℏω' },
      { key: 'probability', color: '#3B82F6', label: 'Position Probability', unit: '%' },
      { key: 'uncertainty', color: '#10B981', label: 'Position Uncertainty', unit: 'nm' },
    ],
    generateData: (time, params) => {
      const n = (params?.quantumNumber as number) || 0;
      
      const energy = n + 0.5;
      const probability = 100 * Math.exp(-time * 0.1) * Math.abs(Math.sin(time * (n + 1)));
      const uncertainty = Math.sqrt(n + 0.5) * 0.1;
      
      return { energy, probability, uncertainty };
    },
  },
};

// Default configuration for simulations not explicitly defined
export const defaultDataConfig: SimulationDataConfig = {
  title: 'Simulation Data',
  dataKeys: [
    { key: 'velocity', color: '#EF4444', label: 'Velocity', unit: 'm/s' },
    { key: 'energy', color: '#F59E0B', label: 'Energy', unit: 'J' },
    { key: 'position', color: '#10B981', label: 'Position', unit: 'm' },
  ],
  generateData: (time) => ({
    velocity: Math.sin(time) * 10 + Math.random() * 2,
    energy: Math.cos(time) * 5 + 15 + Math.random(),
    position: Math.sin(time * 0.5) * 20 + Math.random(),
  }),
};

export function getSimulationDataConfig(simulationId: string): SimulationDataConfig {
  return simulationDataConfigs[simulationId] || defaultDataConfig;
}
