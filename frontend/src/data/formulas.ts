export interface Formula {
  id: string;
  name: string;
  formula: string;
  latex: string;
  description: string;
  variables: { symbol: string; meaning: string; unit: string }[];
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  applications: string[];
}

export const formulas: Formula[] = [
  // MECHANICS (15 formulas)
  {
    id: '1',
    name: "Newton's Second Law",
    formula: 'F = ma',
    latex: 'F = ma',
    description: 'The force acting on an object is equal to its mass times its acceleration',
    variables: [
      { symbol: 'F', meaning: 'Force', unit: 'N (Newtons)' },
      { symbol: 'm', meaning: 'Mass', unit: 'kg' },
      { symbol: 'a', meaning: 'Acceleration', unit: 'm/s²' }
    ],
    category: 'Mechanics',
    difficulty: 'basic',
    applications: ['Projectile motion', 'Rocket propulsion', 'Vehicle dynamics']
  },
  {
    id: '2',
    name: "Newton's First Law",
    formula: 'ΣF = 0 ⟹ v = constant',
    latex: '\\sum F = 0 \\implies v = \\text{constant}',
    description: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a net force',
    variables: [
      { symbol: 'ΣF', meaning: 'Sum of forces', unit: 'N' },
      { symbol: 'v', meaning: 'Velocity', unit: 'm/s' }
    ],
    category: 'Mechanics',
    difficulty: 'basic',
    applications: ['Inertial reference frames', 'Equilibrium', 'Statics']
  },
  {
    id: '3',
    name: "Newton's Third Law",
    formula: 'F₁₂ = -F₂₁',
    latex: 'F_{12} = -F_{21}',
    description: 'For every action, there is an equal and opposite reaction',
    variables: [
      { symbol: 'F₁₂', meaning: 'Force on object 1 by object 2', unit: 'N' },
      { symbol: 'F₂₁', meaning: 'Force on object 2 by object 1', unit: 'N' }
    ],
    category: 'Mechanics',
    difficulty: 'basic',
    applications: ['Rocket propulsion', 'Walking', 'Collisions']
  },
  {
    id: '4',
    name: 'Momentum',
    formula: 'p = mv',
    latex: 'p = mv',
    description: 'The product of mass and velocity',
    variables: [
      { symbol: 'p', meaning: 'Momentum', unit: 'kg⋅m/s' },
      { symbol: 'm', meaning: 'Mass', unit: 'kg' },
      { symbol: 'v', meaning: 'Velocity', unit: 'm/s' }
    ],
    category: 'Mechanics',
    difficulty: 'basic',
    applications: ['Collisions', 'Conservation laws', 'Particle physics']
  },
  {
    id: '5',
    name: 'Impulse-Momentum Theorem',
    formula: 'J = Δp = FΔt',
    latex: 'J = \\Delta p = F\\Delta t',
    description: 'Impulse equals the change in momentum',
    variables: [
      { symbol: 'J', meaning: 'Impulse', unit: 'N⋅s' },
      { symbol: 'Δp', meaning: 'Change in momentum', unit: 'kg⋅m/s' },
      { symbol: 'F', meaning: 'Force', unit: 'N' },
      { symbol: 'Δt', meaning: 'Time interval', unit: 's' }
    ],
    category: 'Mechanics',
    difficulty: 'intermediate',
    applications: ['Car crashes', 'Sports', 'Rocket thrust']
  },
  {
    id: '6',
    name: 'Work',
    formula: 'W = F⋅d⋅cosθ',
    latex: 'W = F \\cdot d \\cdot \\cos\\theta',
    description: 'Work done by a force over a distance',
    variables: [
      { symbol: 'W', meaning: 'Work', unit: 'J (Joules)' },
      { symbol: 'F', meaning: 'Force', unit: 'N' },
      { symbol: 'd', meaning: 'Displacement', unit: 'm' },
      { symbol: 'θ', meaning: 'Angle between F and d', unit: 'radians' }
    ],
    category: 'Mechanics',
    difficulty: 'basic',
    applications: ['Lifting objects', 'Friction', 'Energy transfer']
  },
  {
    id: '7',
    name: 'Power',
    formula: 'P = W/t = F⋅v',
    latex: 'P = \\frac{W}{t} = F \\cdot v',
    description: 'Rate of doing work or energy transfer',
    variables: [
      { symbol: 'P', meaning: 'Power', unit: 'W (Watts)' },
      { symbol: 'W', meaning: 'Work', unit: 'J' },
      { symbol: 't', meaning: 'Time', unit: 's' },
      { symbol: 'F', meaning: 'Force', unit: 'N' },
      { symbol: 'v', meaning: 'Velocity', unit: 'm/s' }
    ],
    category: 'Mechanics',
    difficulty: 'basic',
    applications: ['Engines', 'Electric motors', 'Human metabolism']
  },
  {
    id: '8',
    name: 'Kinetic Energy',
    formula: 'KE = ½mv²',
    latex: 'KE = \\frac{1}{2}mv^2',
    description: 'The energy possessed by an object due to its motion',
    variables: [
      { symbol: 'KE', meaning: 'Kinetic Energy', unit: 'J' },
      { symbol: 'm', meaning: 'Mass', unit: 'kg' },
      { symbol: 'v', meaning: 'Velocity', unit: 'm/s' }
    ],
    category: 'Energy',
    difficulty: 'basic',
    applications: ['Collision analysis', 'Energy conservation', 'Particle physics']
  },
  {
    id: '9',
    name: 'Potential Energy (Gravitational)',
    formula: 'PE = mgh',
    latex: 'PE = mgh',
    description: 'Gravitational potential energy near Earth surface',
    variables: [
      { symbol: 'PE', meaning: 'Potential Energy', unit: 'J' },
      { symbol: 'm', meaning: 'Mass', unit: 'kg' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: '9.81 m/s²' },
      { symbol: 'h', meaning: 'Height', unit: 'm' }
    ],
    category: 'Energy',
    difficulty: 'basic',
    applications: ['Roller coasters', 'Hydroelectric dams', 'Falling objects']
  },
  {
    id: '10',
    name: 'Elastic Potential Energy',
    formula: 'PE = ½kx²',
    latex: 'PE = \\frac{1}{2}kx^2',
    description: 'Energy stored in a spring or elastic material',
    variables: [
      { symbol: 'PE', meaning: 'Potential Energy', unit: 'J' },
      { symbol: 'k', meaning: 'Spring constant', unit: 'N/m' },
      { symbol: 'x', meaning: 'Displacement from equilibrium', unit: 'm' }
    ],
    category: 'Energy',
    difficulty: 'basic',
    applications: ['Springs', 'Bungee jumping', 'Shock absorbers']
  },
  {
    id: '11',
    name: "Hooke's Law",
    formula: 'F = -kx',
    latex: 'F = -kx',
    description: 'Force exerted by a spring is proportional to displacement',
    variables: [
      { symbol: 'F', meaning: 'Restoring force', unit: 'N' },
      { symbol: 'k', meaning: 'Spring constant', unit: 'N/m' },
      { symbol: 'x', meaning: 'Displacement', unit: 'm' }
    ],
    category: 'Mechanics',
    difficulty: 'basic',
    applications: ['Springs', 'Elastic materials', 'Oscillations']
  },
  {
    id: '12',
    name: 'Centripetal Acceleration',
    formula: 'a = v²/r',
    latex: 'a = \\frac{v^2}{r}',
    description: 'Acceleration toward the center in circular motion',
    variables: [
      { symbol: 'a', meaning: 'Centripetal acceleration', unit: 'm/s²' },
      { symbol: 'v', meaning: 'Tangential velocity', unit: 'm/s' },
      { symbol: 'r', meaning: 'Radius', unit: 'm' }
    ],
    category: 'Mechanics',
    difficulty: 'intermediate',
    applications: ['Circular motion', 'Satellites', 'Centrifuges']
  },
  {
    id: '13',
    name: 'Centripetal Force',
    formula: 'F = mv²/r',
    latex: 'F = \\frac{mv^2}{r}',
    description: 'Force required to keep an object moving in a circle',
    variables: [
      { symbol: 'F', meaning: 'Centripetal force', unit: 'N' },
      { symbol: 'm', meaning: 'Mass', unit: 'kg' },
      { symbol: 'v', meaning: 'Velocity', unit: 'm/s' },
      { symbol: 'r', meaning: 'Radius', unit: 'm' }
    ],
    category: 'Mechanics',
    difficulty: 'intermediate',
    applications: ['Banked curves', 'Planetary orbits', 'Washing machines']
  },
  {
    id: '14',
    name: 'Torque',
    formula: 'τ = r × F = rF sinθ',
    latex: '\\tau = r \\times F = rF \\sin\\theta',
    description: 'Rotational force causing angular acceleration',
    variables: [
      { symbol: 'τ', meaning: 'Torque', unit: 'N⋅m' },
      { symbol: 'r', meaning: 'Lever arm', unit: 'm' },
      { symbol: 'F', meaning: 'Force', unit: 'N' },
      { symbol: 'θ', meaning: 'Angle', unit: 'radians' }
    ],
    category: 'Mechanics',
    difficulty: 'intermediate',
    applications: ['Wrenches', 'Gears', 'Motors']
  },
  {
    id: '15',
    name: 'Angular Momentum',
    formula: 'L = Iω = r × p',
    latex: 'L = I\\omega = r \\times p',
    description: 'Rotational analog of linear momentum',
    variables: [
      { symbol: 'L', meaning: 'Angular momentum', unit: 'kg⋅m²/s' },
      { symbol: 'I', meaning: 'Moment of inertia', unit: 'kg⋅m²' },
      { symbol: 'ω', meaning: 'Angular velocity', unit: 'rad/s' }
    ],
    category: 'Mechanics',
    difficulty: 'intermediate',
    applications: ['Gyroscopes', 'Figure skating', 'Planetary motion']
  },
  // GRAVITY (5 formulas)
  {
    id: '16',
    name: 'Universal Gravitation',
    formula: 'F = G(m₁m₂)/r²',
    latex: 'F = G\\frac{m_1 m_2}{r^2}',
    description: 'The gravitational force between two masses',
    variables: [
      { symbol: 'F', meaning: 'Gravitational Force', unit: 'N' },
      { symbol: 'G', meaning: 'Gravitational Constant', unit: '6.674×10⁻¹¹ N⋅m²/kg²' },
      { symbol: 'm₁, m₂', meaning: 'Masses', unit: 'kg' },
      { symbol: 'r', meaning: 'Distance between centers', unit: 'm' }
    ],
    category: 'Gravity',
    difficulty: 'intermediate',
    applications: ['Orbital mechanics', 'Planetary motion', 'Satellite trajectories']
  },
  {
    id: '17',
    name: 'Gravitational Potential Energy',
    formula: 'U = -Gm₁m₂/r',
    latex: 'U = -G\\frac{m_1 m_2}{r}',
    description: 'Gravitational potential energy between two masses',
    variables: [
      { symbol: 'U', meaning: 'Potential energy', unit: 'J' },
      { symbol: 'G', meaning: 'Gravitational constant', unit: '6.674×10⁻¹¹ N⋅m²/kg²' },
      { symbol: 'm₁, m₂', meaning: 'Masses', unit: 'kg' },
      { symbol: 'r', meaning: 'Distance', unit: 'm' }
    ],
    category: 'Gravity',
    difficulty: 'intermediate',
    applications: ['Escape velocity', 'Orbital energy', 'Gravitational binding']
  },
  {
    id: '18',
    name: 'Escape Velocity',
    formula: 'v = √(2GM/r)',
    latex: 'v = \\sqrt{\\frac{2GM}{r}}',
    description: 'Minimum velocity to escape gravitational field',
    variables: [
      { symbol: 'v', meaning: 'Escape velocity', unit: 'm/s' },
      { symbol: 'G', meaning: 'Gravitational constant', unit: '6.674×10⁻¹¹ N⋅m²/kg²' },
      { symbol: 'M', meaning: 'Mass of body', unit: 'kg' },
      { symbol: 'r', meaning: 'Distance from center', unit: 'm' }
    ],
    category: 'Gravity',
    difficulty: 'advanced',
    applications: ['Rocket launches', 'Black holes', 'Planetary escape']
  },
  {
    id: '19',
    name: 'Orbital Velocity',
    formula: 'v = √(GM/r)',
    latex: 'v = \\sqrt{\\frac{GM}{r}}',
    description: 'Velocity needed for circular orbit',
    variables: [
      { symbol: 'v', meaning: 'Orbital velocity', unit: 'm/s' },
      { symbol: 'G', meaning: 'Gravitational constant', unit: '6.674×10⁻¹¹ N⋅m²/kg²' },
      { symbol: 'M', meaning: 'Central mass', unit: 'kg' },
      { symbol: 'r', meaning: 'Orbital radius', unit: 'm' }
    ],
    category: 'Gravity',
    difficulty: 'advanced',
    applications: ['Satellites', 'Space stations', 'Planetary orbits']
  },
  {
    id: '20',
    name: "Kepler's Third Law",
    formula: 'T² = (4π²/GM)r³',
    latex: 'T^2 = \\frac{4\\pi^2}{GM}r^3',
    description: 'Orbital period squared is proportional to radius cubed',
    variables: [
      { symbol: 'T', meaning: 'Orbital period', unit: 's' },
      { symbol: 'G', meaning: 'Gravitational constant', unit: '6.674×10⁻¹¹ N⋅m²/kg²' },
      { symbol: 'M', meaning: 'Central mass', unit: 'kg' },
      { symbol: 'r', meaning: 'Semi-major axis', unit: 'm' }
    ],
    category: 'Gravity',
    difficulty: 'advanced',
    applications: ['Planetary motion', 'Exoplanet detection', 'Binary stars']
  },
  // WAVES & OSCILLATIONS (8 formulas)
  {
    id: '21',
    name: 'Wave Equation',
    formula: 'v = fλ',
    latex: 'v = f\\lambda',
    description: 'Relates wave speed, frequency, and wavelength',
    variables: [
      { symbol: 'v', meaning: 'Wave speed', unit: 'm/s' },
      { symbol: 'f', meaning: 'Frequency', unit: 'Hz' },
      { symbol: 'λ', meaning: 'Wavelength', unit: 'm' }
    ],
    category: 'Waves',
    difficulty: 'basic',
    applications: ['Sound waves', 'Light waves', 'Water waves']
  },
  {
    id: '22',
    name: 'Pendulum Period',
    formula: 'T = 2π√(L/g)',
    latex: 'T = 2\\pi\\sqrt{\\frac{L}{g}}',
    description: 'Period of a simple pendulum for small angles',
    variables: [
      { symbol: 'T', meaning: 'Period', unit: 's' },
      { symbol: 'L', meaning: 'Length', unit: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: '9.81 m/s²' }
    ],
    category: 'Waves',
    difficulty: 'basic',
    applications: ['Clocks', 'Seismology', 'Oscillations']
  },
  {
    id: '23',
    name: 'Spring-Mass Period',
    formula: 'T = 2π√(m/k)',
    latex: 'T = 2\\pi\\sqrt{\\frac{m}{k}}',
    description: 'Period of oscillation for spring-mass system',
    variables: [
      { symbol: 'T', meaning: 'Period', unit: 's' },
      { symbol: 'm', meaning: 'Mass', unit: 'kg' },
      { symbol: 'k', meaning: 'Spring constant', unit: 'N/m' }
    ],
    category: 'Waves',
    difficulty: 'intermediate',
    applications: ['Shock absorbers', 'Seismometers', 'Harmonic oscillators']
  },
  {
    id: '24',
    name: 'Doppler Effect',
    formula: 'f′ = f(v±v₀)/(v∓vₛ)',
    latex: 'f\' = f\\frac{v \\pm v_0}{v \\mp v_s}',
    description: 'Frequency shift due to relative motion',
    variables: [
      { symbol: 'f′', meaning: 'Observed frequency', unit: 'Hz' },
      { symbol: 'f', meaning: 'Source frequency', unit: 'Hz' },
      { symbol: 'v', meaning: 'Wave speed', unit: 'm/s' },
      { symbol: 'v₀', meaning: 'Observer velocity', unit: 'm/s' },
      { symbol: 'vₛ', meaning: 'Source velocity', unit: 'm/s' }
    ],
    category: 'Waves',
    difficulty: 'advanced',
    applications: ['Radar', 'Astronomy', 'Medical ultrasound']
  },
  {
    id: '25',
    name: 'Sound Intensity',
    formula: 'I = P/(4πr²)',
    latex: 'I = \\frac{P}{4\\pi r^2}',
    description: 'Sound intensity decreases with distance squared',
    variables: [
      { symbol: 'I', meaning: 'Intensity', unit: 'W/m²' },
      { symbol: 'P', meaning: 'Power', unit: 'W' },
      { symbol: 'r', meaning: 'Distance', unit: 'm' }
    ],
    category: 'Waves',
    difficulty: 'intermediate',
    applications: ['Acoustics', 'Speaker design', 'Noise pollution']
  },
  {
    id: '26',
    name: 'Resonance Frequency',
    formula: 'f₀ = 1/(2π√(LC))',
    latex: 'f_0 = \\frac{1}{2\\pi\\sqrt{LC}}',
    description: 'Natural frequency of LC circuit',
    variables: [
      { symbol: 'f₀', meaning: 'Resonance frequency', unit: 'Hz' },
      { symbol: 'L', meaning: 'Inductance', unit: 'H' },
      { symbol: 'C', meaning: 'Capacitance', unit: 'F' }
    ],
    category: 'Waves',
    difficulty: 'advanced',
    applications: ['Radio tuning', 'Filters', 'Oscillators']
  },
  {
    id: '27',
    name: 'Beat Frequency',
    formula: 'f_beat = |f₁ - f₂|',
    latex: 'f_{beat} = |f_1 - f_2|',
    description: 'Frequency of beats from two interfering waves',
    variables: [
      { symbol: 'f_beat', meaning: 'Beat frequency', unit: 'Hz' },
      { symbol: 'f₁', meaning: 'First frequency', unit: 'Hz' },
      { symbol: 'f₂', meaning: 'Second frequency', unit: 'Hz' }
    ],
    category: 'Waves',
    difficulty: 'intermediate',
    applications: ['Tuning instruments', 'Interference', 'Signal processing']
  },
  {
    id: '28',
    name: 'Standing Wave Frequency',
    formula: 'f_n = nv/(2L)',
    latex: 'f_n = \\frac{nv}{2L}',
    description: 'Frequencies of standing waves in a string',
    variables: [
      { symbol: 'f_n', meaning: 'nth harmonic frequency', unit: 'Hz' },
      { symbol: 'n', meaning: 'Harmonic number', unit: 'dimensionless' },
      { symbol: 'v', meaning: 'Wave speed', unit: 'm/s' },
      { symbol: 'L', meaning: 'Length', unit: 'm' }
    ],
    category: 'Waves',
    difficulty: 'intermediate',
    applications: ['Musical instruments', 'Resonance', 'Acoustics']
  },
  // THERMODYNAMICS (7 formulas)
  {
    id: '29',
    name: 'Ideal Gas Law',
    formula: 'PV = nRT',
    latex: 'PV = nRT',
    description: 'Relates pressure, volume, and temperature of an ideal gas',
    variables: [
      { symbol: 'P', meaning: 'Pressure', unit: 'Pa' },
      { symbol: 'V', meaning: 'Volume', unit: 'm³' },
      { symbol: 'n', meaning: 'Amount of substance', unit: 'mol' },
      { symbol: 'R', meaning: 'Gas constant', unit: '8.314 J/(mol⋅K)' },
      { symbol: 'T', meaning: 'Temperature', unit: 'K' }
    ],
    category: 'Thermodynamics',
    difficulty: 'basic',
    applications: ['Gas behavior', 'Engine cycles', 'Atmospheric science']
  },
  {
    id: '30',
    name: 'First Law of Thermodynamics',
    formula: 'ΔU = Q - W',
    latex: '\\Delta U = Q - W',
    description: 'Energy conservation: change in internal energy equals heat added minus work done',
    variables: [
      { symbol: 'ΔU', meaning: 'Change in internal energy', unit: 'J' },
      { symbol: 'Q', meaning: 'Heat added to system', unit: 'J' },
      { symbol: 'W', meaning: 'Work done by system', unit: 'J' }
    ],
    category: 'Thermodynamics',
    difficulty: 'intermediate',
    applications: ['Heat engines', 'Refrigerators', 'Energy systems']
  },
  {
    id: '31',
    name: 'Heat Transfer',
    formula: 'Q = mcΔT',
    latex: 'Q = mc\\Delta T',
    description: 'Heat required to change temperature',
    variables: [
      { symbol: 'Q', meaning: 'Heat energy', unit: 'J' },
      { symbol: 'm', meaning: 'Mass', unit: 'kg' },
      { symbol: 'c', meaning: 'Specific heat capacity', unit: 'J/(kg⋅K)' },
      { symbol: 'ΔT', meaning: 'Temperature change', unit: 'K' }
    ],
    category: 'Thermodynamics',
    difficulty: 'basic',
    applications: ['Heating systems', 'Calorimetry', 'Climate']
  },
  {
    id: '32',
    name: 'Carnot Efficiency',
    formula: 'η = 1 - T_c/T_h',
    latex: '\\eta = 1 - \\frac{T_c}{T_h}',
    description: 'Maximum theoretical efficiency of heat engine',
    variables: [
      { symbol: 'η', meaning: 'Efficiency', unit: 'dimensionless' },
      { symbol: 'T_c', meaning: 'Cold reservoir temperature', unit: 'K' },
      { symbol: 'T_h', meaning: 'Hot reservoir temperature', unit: 'K' }
    ],
    category: 'Thermodynamics',
    difficulty: 'advanced',
    applications: ['Heat engines', 'Power plants', 'Refrigeration']
  },
  {
    id: '33',
    name: 'Stefan-Boltzmann Law',
    formula: 'P = σAT⁴',
    latex: 'P = \\sigma AT^4',
    description: 'Power radiated by a black body',
    variables: [
      { symbol: 'P', meaning: 'Power radiated', unit: 'W' },
      { symbol: 'σ', meaning: 'Stefan-Boltzmann constant', unit: '5.67×10⁻⁸ W/(m²⋅K⁴)' },
      { symbol: 'A', meaning: 'Surface area', unit: 'm²' },
      { symbol: 'T', meaning: 'Temperature', unit: 'K' }
    ],
    category: 'Thermodynamics',
    difficulty: 'advanced',
    applications: ['Star luminosity', 'Thermal radiation', 'Climate modeling']
  },
  {
    id: '34',
    name: 'Entropy Change',
    formula: 'ΔS = Q/T',
    latex: '\\Delta S = \\frac{Q}{T}',
    description: 'Change in entropy for reversible process',
    variables: [
      { symbol: 'ΔS', meaning: 'Change in entropy', unit: 'J/K' },
      { symbol: 'Q', meaning: 'Heat transferred', unit: 'J' },
      { symbol: 'T', meaning: 'Temperature', unit: 'K' }
    ],
    category: 'Thermodynamics',
    difficulty: 'advanced',
    applications: ['Thermodynamic processes', 'Information theory', 'Statistical mechanics']
  },
  {
    id: '35',
    name: 'Thermal Conductivity',
    formula: 'Q/t = kA(ΔT/d)',
    latex: '\\frac{Q}{t} = kA\\frac{\\Delta T}{d}',
    description: 'Rate of heat transfer through a material',
    variables: [
      { symbol: 'Q/t', meaning: 'Heat transfer rate', unit: 'W' },
      { symbol: 'k', meaning: 'Thermal conductivity', unit: 'W/(m⋅K)' },
      { symbol: 'A', meaning: 'Cross-sectional area', unit: 'm²' },
      { symbol: 'ΔT', meaning: 'Temperature difference', unit: 'K' },
      { symbol: 'd', meaning: 'Thickness', unit: 'm' }
    ],
    category: 'Thermodynamics',
    difficulty: 'intermediate',
    applications: ['Insulation', 'Heat exchangers', 'Building design']
  },
  // ELECTROMAGNETISM (10 formulas)
  {
    id: '36',
    name: "Coulomb's Law",
    formula: 'F = k(q₁q₂)/r²',
    latex: 'F = k\\frac{q_1 q_2}{r^2}',
    description: 'Electric force between two charges',
    variables: [
      { symbol: 'F', meaning: 'Electric force', unit: 'N' },
      { symbol: 'k', meaning: 'Coulomb constant', unit: '8.99×10⁹ N⋅m²/C²' },
      { symbol: 'q₁, q₂', meaning: 'Charges', unit: 'C' },
      { symbol: 'r', meaning: 'Distance', unit: 'm' }
    ],
    category: 'Electromagnetism',
    difficulty: 'basic',
    applications: ['Electrostatics', 'Atomic structure', 'Particle interactions']
  },
  {
    id: '37',
    name: 'Electric Field',
    formula: 'E = F/q = kQ/r²',
    latex: 'E = \\frac{F}{q} = k\\frac{Q}{r^2}',
    description: 'Electric field strength at a point',
    variables: [
      { symbol: 'E', meaning: 'Electric field', unit: 'N/C or V/m' },
      { symbol: 'F', meaning: 'Force', unit: 'N' },
      { symbol: 'q', meaning: 'Test charge', unit: 'C' },
      { symbol: 'Q', meaning: 'Source charge', unit: 'C' },
      { symbol: 'r', meaning: 'Distance', unit: 'm' }
    ],
    category: 'Electromagnetism',
    difficulty: 'basic',
    applications: ['Capacitors', 'Electric fields', 'Particle accelerators']
  },
  {
    id: '38',
    name: 'Electric Potential',
    formula: 'V = kQ/r',
    latex: 'V = k\\frac{Q}{r}',
    description: 'Electric potential due to a point charge',
    variables: [
      { symbol: 'V', meaning: 'Electric potential', unit: 'V (Volts)' },
      { symbol: 'k', meaning: 'Coulomb constant', unit: '8.99×10⁹ N⋅m²/C²' },
      { symbol: 'Q', meaning: 'Charge', unit: 'C' },
      { symbol: 'r', meaning: 'Distance', unit: 'm' }
    ],
    category: 'Electromagnetism',
    difficulty: 'intermediate',
    applications: ['Voltage', 'Batteries', 'Electric circuits']
  },
  {
    id: '39',
    name: "Ohm's Law",
    formula: 'V = IR',
    latex: 'V = IR',
    description: 'Voltage equals current times resistance',
    variables: [
      { symbol: 'V', meaning: 'Voltage', unit: 'V' },
      { symbol: 'I', meaning: 'Current', unit: 'A (Amperes)' },
      { symbol: 'R', meaning: 'Resistance', unit: 'Ω (Ohms)' }
    ],
    category: 'Electromagnetism',
    difficulty: 'basic',
    applications: ['Circuits', 'Electronics', 'Power systems']
  },
  {
    id: '40',
    name: 'Electric Power',
    formula: 'P = IV = I²R = V²/R',
    latex: 'P = IV = I^2R = \\frac{V^2}{R}',
    description: 'Power dissipated in an electric circuit',
    variables: [
      { symbol: 'P', meaning: 'Power', unit: 'W' },
      { symbol: 'I', meaning: 'Current', unit: 'A' },
      { symbol: 'V', meaning: 'Voltage', unit: 'V' },
      { symbol: 'R', meaning: 'Resistance', unit: 'Ω' }
    ],
    category: 'Electromagnetism',
    difficulty: 'basic',
    applications: ['Power consumption', 'Heating elements', 'Energy efficiency']
  },
  {
    id: '41',
    name: 'Capacitance',
    formula: 'C = Q/V',
    latex: 'C = \\frac{Q}{V}',
    description: 'Charge stored per unit voltage',
    variables: [
      { symbol: 'C', meaning: 'Capacitance', unit: 'F (Farads)' },
      { symbol: 'Q', meaning: 'Charge', unit: 'C' },
      { symbol: 'V', meaning: 'Voltage', unit: 'V' }
    ],
    category: 'Electromagnetism',
    difficulty: 'intermediate',
    applications: ['Capacitors', 'Energy storage', 'Filters']
  },
  {
    id: '42',
    name: 'Magnetic Force on Moving Charge',
    formula: 'F = qvB sinθ',
    latex: 'F = qvB \\sin\\theta',
    description: 'Force on a charged particle in magnetic field',
    variables: [
      { symbol: 'F', meaning: 'Magnetic force', unit: 'N' },
      { symbol: 'q', meaning: 'Charge', unit: 'C' },
      { symbol: 'v', meaning: 'Velocity', unit: 'm/s' },
      { symbol: 'B', meaning: 'Magnetic field', unit: 'T (Tesla)' },
      { symbol: 'θ', meaning: 'Angle', unit: 'radians' }
    ],
    category: 'Electromagnetism',
    difficulty: 'intermediate',
    applications: ['Particle accelerators', 'Mass spectrometers', 'Cyclotrons']
  },
  {
    id: '43',
    name: "Faraday's Law of Induction",
    formula: 'ε = -dΦ/dt',
    latex: '\\varepsilon = -\\frac{d\\Phi}{dt}',
    description: 'Induced EMF from changing magnetic flux',
    variables: [
      { symbol: 'ε', meaning: 'Induced EMF', unit: 'V' },
      { symbol: 'Φ', meaning: 'Magnetic flux', unit: 'Wb (Weber)' },
      { symbol: 't', meaning: 'Time', unit: 's' }
    ],
    category: 'Electromagnetism',
    difficulty: 'advanced',
    applications: ['Generators', 'Transformers', 'Induction motors']
  },
  {
    id: '44',
    name: 'Magnetic Field of Wire',
    formula: 'B = μ₀I/(2πr)',
    latex: 'B = \\frac{\\mu_0 I}{2\\pi r}',
    description: 'Magnetic field around a current-carrying wire',
    variables: [
      { symbol: 'B', meaning: 'Magnetic field', unit: 'T' },
      { symbol: 'μ₀', meaning: 'Permeability of free space', unit: '4π×10⁻⁷ T⋅m/A' },
      { symbol: 'I', meaning: 'Current', unit: 'A' },
      { symbol: 'r', meaning: 'Distance from wire', unit: 'm' }
    ],
    category: 'Electromagnetism',
    difficulty: 'intermediate',
    applications: ['Electromagnets', 'Magnetic fields', 'Current sensors']
  },
  {
    id: '45',
    name: "Maxwell's Equations (Gauss's Law)",
    formula: '∇⋅E = ρ/ε₀',
    latex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}',
    description: 'Electric field divergence relates to charge density',
    variables: [
      { symbol: '∇⋅E', meaning: 'Divergence of electric field', unit: 'V/m²' },
      { symbol: 'ρ', meaning: 'Charge density', unit: 'C/m³' },
      { symbol: 'ε₀', meaning: 'Permittivity of free space', unit: '8.854×10⁻¹² F/m' }
    ],
    category: 'Electromagnetism',
    difficulty: 'advanced',
    applications: ['Electromagnetic waves', 'Electric fields', 'Capacitors']
  },
  // QUANTUM MECHANICS (8 formulas)
  {
    id: '46',
    name: "Planck's Energy Equation",
    formula: 'E = hf',
    latex: 'E = hf',
    description: 'Energy of a photon',
    variables: [
      { symbol: 'E', meaning: 'Energy', unit: 'J' },
      { symbol: 'h', meaning: 'Planck constant', unit: '6.626×10⁻³⁴ J⋅s' },
      { symbol: 'f', meaning: 'Frequency', unit: 'Hz' }
    ],
    category: 'Quantum',
    difficulty: 'basic',
    applications: ['Photoelectric effect', 'Photons', 'Quantum mechanics']
  },
  {
    id: '47',
    name: 'de Broglie Wavelength',
    formula: 'λ = h/p',
    latex: '\\lambda = \\frac{h}{p}',
    description: 'Wavelength of a particle',
    variables: [
      { symbol: 'λ', meaning: 'Wavelength', unit: 'm' },
      { symbol: 'h', meaning: 'Planck constant', unit: '6.626×10⁻³⁴ J⋅s' },
      { symbol: 'p', meaning: 'Momentum', unit: 'kg⋅m/s' }
    ],
    category: 'Quantum',
    difficulty: 'intermediate',
    applications: ['Electron diffraction', 'Wave-particle duality', 'Quantum mechanics']
  },
  {
    id: '48',
    name: 'Heisenberg Uncertainty Principle',
    formula: 'ΔxΔp ≥ ℏ/2',
    latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}',
    description: 'Fundamental limit on precision of position and momentum',
    variables: [
      { symbol: 'Δx', meaning: 'Position uncertainty', unit: 'm' },
      { symbol: 'Δp', meaning: 'Momentum uncertainty', unit: 'kg⋅m/s' },
      { symbol: 'ℏ', meaning: 'Reduced Planck constant', unit: '1.055×10⁻³⁴ J⋅s' }
    ],
    category: 'Quantum',
    difficulty: 'advanced',
    applications: ['Quantum mechanics', 'Measurement limits', 'Atomic physics']
  },
  {
    id: '49',
    name: "Schrödinger Equation",
    formula: 'iℏ∂ψ/∂t = Ĥψ',
    latex: 'i\\hbar\\frac{\\partial\\psi}{\\partial t} = \\hat{H}\\psi',
    description: 'Fundamental equation of quantum mechanics',
    variables: [
      { symbol: 'i', meaning: 'Imaginary unit', unit: 'dimensionless' },
      { symbol: 'ℏ', meaning: 'Reduced Planck constant', unit: '1.055×10⁻³⁴ J⋅s' },
      { symbol: 'ψ', meaning: 'Wave function', unit: 'varies' },
      { symbol: 'Ĥ', meaning: 'Hamiltonian operator', unit: 'J' }
    ],
    category: 'Quantum',
    difficulty: 'advanced',
    applications: ['Quantum tunneling', 'Atomic orbitals', 'Particle behavior']
  },
  {
    id: '50',
    name: 'Photoelectric Effect',
    formula: 'KE_max = hf - φ',
    latex: 'KE_{max} = hf - \\phi',
    description: 'Maximum kinetic energy of ejected electrons',
    variables: [
      { symbol: 'KE_max', meaning: 'Maximum kinetic energy', unit: 'J' },
      { symbol: 'h', meaning: 'Planck constant', unit: '6.626×10⁻³⁴ J⋅s' },
      { symbol: 'f', meaning: 'Frequency of light', unit: 'Hz' },
      { symbol: 'φ', meaning: 'Work function', unit: 'J' }
    ],
    category: 'Quantum',
    difficulty: 'intermediate',
    applications: ['Solar cells', 'Photomultipliers', 'Quantum mechanics']
  },
  {
    id: '51',
    name: 'Bohr Model Energy Levels',
    formula: 'E_n = -13.6eV/n²',
    latex: 'E_n = -\\frac{13.6\\text{eV}}{n^2}',
    description: 'Energy levels of hydrogen atom',
    variables: [
      { symbol: 'E_n', meaning: 'Energy of nth level', unit: 'eV' },
      { symbol: 'n', meaning: 'Principal quantum number', unit: 'dimensionless' }
    ],
    category: 'Quantum',
    difficulty: 'intermediate',
    applications: ['Atomic spectra', 'Hydrogen atom', 'Quantum transitions']
  },
  {
    id: '52',
    name: 'Compton Scattering',
    formula: 'Δλ = (h/m_ec)(1-cosθ)',
    latex: '\\Delta\\lambda = \\frac{h}{m_e c}(1-\\cos\\theta)',
    description: 'Wavelength shift in photon-electron collision',
    variables: [
      { symbol: 'Δλ', meaning: 'Wavelength shift', unit: 'm' },
      { symbol: 'h', meaning: 'Planck constant', unit: '6.626×10⁻³⁴ J⋅s' },
      { symbol: 'm_e', meaning: 'Electron mass', unit: '9.109×10⁻³¹ kg' },
      { symbol: 'c', meaning: 'Speed of light', unit: '3×10⁸ m/s' },
      { symbol: 'θ', meaning: 'Scattering angle', unit: 'radians' }
    ],
    category: 'Quantum',
    difficulty: 'advanced',
    applications: ['X-ray scattering', 'Particle physics', 'Medical imaging']
  },
  {
    id: '53',
    name: 'Quantum Tunneling Probability',
    formula: 'T ≈ e^(-2κL)',
    latex: 'T \\approx e^{-2\\kappa L}',
    description: 'Probability of particle tunneling through barrier',
    variables: [
      { symbol: 'T', meaning: 'Transmission coefficient', unit: 'dimensionless' },
      { symbol: 'κ', meaning: 'Decay constant', unit: '1/m' },
      { symbol: 'L', meaning: 'Barrier width', unit: 'm' }
    ],
    category: 'Quantum',
    difficulty: 'advanced',
    applications: ['Quantum tunneling', 'STM microscopy', 'Nuclear fusion']
  },
  // RELATIVITY (5 formulas)
  {
    id: '54',
    name: "Einstein's Mass-Energy Equivalence",
    formula: 'E = mc²',
    latex: 'E = mc^2',
    description: 'Energy and mass are interchangeable',
    variables: [
      { symbol: 'E', meaning: 'Energy', unit: 'J' },
      { symbol: 'm', meaning: 'Mass', unit: 'kg' },
      { symbol: 'c', meaning: 'Speed of light', unit: '3×10⁸ m/s' }
    ],
    category: 'Relativity',
    difficulty: 'intermediate',
    applications: ['Nuclear reactions', 'Particle physics', 'Cosmology']
  },
  {
    id: '55',
    name: 'Lorentz Factor',
    formula: 'γ = 1/√(1-v²/c²)',
    latex: '\\gamma = \\frac{1}{\\sqrt{1-\\frac{v^2}{c^2}}}',
    description: 'Time dilation and length contraction factor',
    variables: [
      { symbol: 'γ', meaning: 'Lorentz factor', unit: 'dimensionless' },
      { symbol: 'v', meaning: 'Velocity', unit: 'm/s' },
      { symbol: 'c', meaning: 'Speed of light', unit: '3×10⁸ m/s' }
    ],
    category: 'Relativity',
    difficulty: 'advanced',
    applications: ['Particle accelerators', 'GPS satellites', 'Cosmic rays']
  },
  {
    id: '56',
    name: 'Time Dilation',
    formula: 'Δt = γΔt₀',
    latex: '\\Delta t = \\gamma \\Delta t_0',
    description: 'Time passes slower for moving objects',
    variables: [
      { symbol: 'Δt', meaning: 'Time in stationary frame', unit: 's' },
      { symbol: 'γ', meaning: 'Lorentz factor', unit: 'dimensionless' },
      { symbol: 'Δt₀', meaning: 'Proper time', unit: 's' }
    ],
    category: 'Relativity',
    difficulty: 'advanced',
    applications: ['GPS corrections', 'Particle lifetimes', 'Twin paradox']
  },
  {
    id: '57',
    name: 'Length Contraction',
    formula: 'L = L₀/γ',
    latex: 'L = \\frac{L_0}{\\gamma}',
    description: 'Moving objects appear shorter',
    variables: [
      { symbol: 'L', meaning: 'Contracted length', unit: 'm' },
      { symbol: 'L₀', meaning: 'Proper length', unit: 'm' },
      { symbol: 'γ', meaning: 'Lorentz factor', unit: 'dimensionless' }
    ],
    category: 'Relativity',
    difficulty: 'advanced',
    applications: ['Particle physics', 'Cosmic rays', 'Relativity experiments']
  },
  {
    id: '58',
    name: 'Relativistic Energy',
    formula: 'E = γmc²',
    latex: 'E = \\gamma mc^2',
    description: 'Total energy of a moving particle',
    variables: [
      { symbol: 'E', meaning: 'Total energy', unit: 'J' },
      { symbol: 'γ', meaning: 'Lorentz factor', unit: 'dimensionless' },
      { symbol: 'm', meaning: 'Rest mass', unit: 'kg' },
      { symbol: 'c', meaning: 'Speed of light', unit: '3×10⁸ m/s' }
    ],
    category: 'Relativity',
    difficulty: 'advanced',
    applications: ['Particle accelerators', 'High-energy physics', 'Cosmology']
  },
  // OPTICS (5 formulas)
  {
    id: '59',
    name: 'Snell\'s Law',
    formula: 'n₁sinθ₁ = n₂sinθ₂',
    latex: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2',
    description: 'Refraction of light at interface',
    variables: [
      { symbol: 'n₁, n₂', meaning: 'Refractive indices', unit: 'dimensionless' },
      { symbol: 'θ₁', meaning: 'Incident angle', unit: 'radians' },
      { symbol: 'θ₂', meaning: 'Refracted angle', unit: 'radians' }
    ],
    category: 'Optics',
    difficulty: 'basic',
    applications: ['Lenses', 'Prisms', 'Fiber optics']
  },
  {
    id: '60',
    name: 'Thin Lens Equation',
    formula: '1/f = 1/d_o + 1/d_i',
    latex: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}',
    description: 'Relates focal length to object and image distances',
    variables: [
      { symbol: 'f', meaning: 'Focal length', unit: 'm' },
      { symbol: 'd_o', meaning: 'Object distance', unit: 'm' },
      { symbol: 'd_i', meaning: 'Image distance', unit: 'm' }
    ],
    category: 'Optics',
    difficulty: 'intermediate',
    applications: ['Cameras', 'Telescopes', 'Microscopes']
  },
  {
    id: '61',
    name: 'Magnification',
    formula: 'm = -d_i/d_o = h_i/h_o',
    latex: 'm = -\\frac{d_i}{d_o} = \\frac{h_i}{h_o}',
    description: 'Image size relative to object size',
    variables: [
      { symbol: 'm', meaning: 'Magnification', unit: 'dimensionless' },
      { symbol: 'd_i', meaning: 'Image distance', unit: 'm' },
      { symbol: 'd_o', meaning: 'Object distance', unit: 'm' },
      { symbol: 'h_i', meaning: 'Image height', unit: 'm' },
      { symbol: 'h_o', meaning: 'Object height', unit: 'm' }
    ],
    category: 'Optics',
    difficulty: 'intermediate',
    applications: ['Microscopes', 'Telescopes', 'Magnifying glasses']
  },
  {
    id: '62',
    name: 'Diffraction Grating',
    formula: 'd sinθ = mλ',
    latex: 'd \\sin\\theta = m\\lambda',
    description: 'Constructive interference condition for gratings',
    variables: [
      { symbol: 'd', meaning: 'Grating spacing', unit: 'm' },
      { symbol: 'θ', meaning: 'Diffraction angle', unit: 'radians' },
      { symbol: 'm', meaning: 'Order number', unit: 'dimensionless' },
      { symbol: 'λ', meaning: 'Wavelength', unit: 'm' }
    ],
    category: 'Optics',
    difficulty: 'intermediate',
    applications: ['Spectroscopy', 'Wavelength measurement', 'Optical instruments']
  },
  {
    id: '63',
    name: 'Rayleigh Criterion',
    formula: 'θ_min = 1.22λ/D',
    latex: '\\theta_{min} = \\frac{1.22\\lambda}{D}',
    description: 'Minimum resolvable angle for circular aperture',
    variables: [
      { symbol: 'θ_min', meaning: 'Minimum angle', unit: 'radians' },
      { symbol: 'λ', meaning: 'Wavelength', unit: 'm' },
      { symbol: 'D', meaning: 'Aperture diameter', unit: 'm' }
    ],
    category: 'Optics',
    difficulty: 'advanced',
    applications: ['Telescope resolution', 'Microscope limits', 'Optical imaging']
  }
];
