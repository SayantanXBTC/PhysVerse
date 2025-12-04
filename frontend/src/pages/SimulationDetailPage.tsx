import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';

interface SimulationDetail {
  id: string;
  name: string;
  description: string;
  explanation: string;
  keyPoints: string[];
  physicsLaw: string;
  equations: string[];
  realWorldApplications: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

const simulationsData: Record<string, SimulationDetail> = {
  'solar-system': {
    id: 'solar-system',
    name: 'Solar System',
    description: 'Planetary orbits and gravitational dynamics',
    explanation: 'This simulation demonstrates how planets orbit the Sun according to Kepler\'s laws and Newton\'s law of universal gravitation. Each planet follows an elliptical path with the Sun at one focus.',
    keyPoints: [
      'Planets move faster when closer to the Sun (Kepler\'s 2nd Law)',
      'Orbital periods increase with distance from the Sun',
      'Gravitational force decreases with the square of distance',
      'Conservation of angular momentum keeps orbits stable',
    ],
    physicsLaw: 'Newton\'s Law of Universal Gravitation: F = G(m₁m₂)/r²',
    equations: [
      'F = G(m₁m₂)/r² - Gravitational Force',
      'T² ∝ a³ - Kepler\'s Third Law',
      'v = √(GM/r) - Orbital Velocity',
    ],
    realWorldApplications: [
      'Satellite orbit calculations',
      'Space mission trajectory planning',
      'Predicting planetary positions',
      'Understanding tidal forces',
    ],
    difficulty: 'Intermediate',
    category: 'Celestial Mechanics',
  },
  'wave-motion': {
    id: 'wave-motion',
    name: 'Wave Motion',
    description: '3D wave dynamics and interference patterns',
    explanation: 'Waves are disturbances that transfer energy through space. This simulation shows how waves propagate, interfere, and create complex patterns through superposition.',
    keyPoints: [
      'Wave speed depends on medium properties',
      'Constructive and destructive interference',
      'Energy transfer without matter transfer',
      'Frequency and wavelength relationship',
    ],
    physicsLaw: 'Wave Equation: ∂²y/∂t² = v²(∂²y/∂x²)',
    equations: [
      'v = fλ - Wave Speed',
      'y = A sin(kx - ωt) - Wave Function',
      'E ∝ A² - Energy proportional to amplitude squared',
    ],
    realWorldApplications: [
      'Sound engineering and acoustics',
      'Seismic wave analysis',
      'Ocean wave prediction',
      'Electromagnetic wave transmission',
    ],
    difficulty: 'Beginner',
    category: 'Wave Physics',
  },
  'double-pendulum': {
    id: 'double-pendulum',
    name: 'Double Pendulum',
    description: 'Chaotic motion and sensitivity to initial conditions',
    explanation: 'The double pendulum is a classic example of chaotic dynamics. Small changes in initial conditions lead to dramatically different outcomes, demonstrating deterministic chaos.',
    keyPoints: [
      'Highly sensitive to initial conditions',
      'Unpredictable long-term behavior',
      'Energy transfer between pendulums',
      'Non-linear dynamics',
    ],
    physicsLaw: 'Lagrangian Mechanics with coupled equations of motion',
    equations: [
      'L = T - V - Lagrangian',
      'd/dt(∂L/∂θ̇) - ∂L/∂θ = 0 - Euler-Lagrange',
      'Chaotic for large amplitudes',
    ],
    realWorldApplications: [
      'Weather prediction models',
      'Stock market analysis',
      'Robotics and control systems',
      'Understanding chaos theory',
    ],
    difficulty: 'Advanced',
    category: 'Chaos Theory',
  },
  'rocket-launch': {
    id: 'rocket-launch',
    name: 'Rocket Launch',
    description: 'Thrust, drag, and multi-stage separation',
    explanation: 'Rockets work by expelling mass at high velocity (Newton\'s 3rd Law). This simulation includes realistic thrust profiles, atmospheric drag, and multi-stage separation.',
    keyPoints: [
      'Thrust must overcome gravity and drag',
      'Mass decreases as fuel burns',
      'Staging improves efficiency',
      'Atmospheric drag decreases with altitude',
    ],
    physicsLaw: 'Tsiolkovsky Rocket Equation: Δv = ve ln(m₀/mf)',
    equations: [
      'F = ma - Newton\'s 2nd Law',
      'Δv = ve ln(m₀/mf) - Rocket Equation',
      'Fd = ½ρv²CdA - Drag Force',
    ],
    realWorldApplications: [
      'Space launch vehicle design',
      'Missile trajectory calculations',
      'Satellite deployment',
      'Interplanetary missions',
    ],
    difficulty: 'Advanced',
    category: 'Aerospace Engineering',
  },
  'dna-helix': {
    id: 'dna-helix',
    name: 'DNA Helix',
    description: 'Molecular structure and double helix dynamics',
    explanation: 'DNA (Deoxyribonucleic Acid) forms a double helix structure with two complementary strands. This simulation shows the iconic twisted ladder structure with base pairs connecting the strands.',
    keyPoints: [
      'Double helix with 10 base pairs per turn',
      'Complementary base pairing (A-T, G-C)',
      'Right-handed helix with 3.4 nm pitch',
      'Antiparallel strands running in opposite directions',
    ],
    physicsLaw: 'Molecular Geometry: Helical structure with specific pitch and diameter',
    equations: [
      'Pitch = 3.4 nm per turn',
      'Diameter = 2 nm',
      'Base pairs per turn = 10',
    ],
    realWorldApplications: [
      'Genetic engineering and CRISPR',
      'DNA sequencing and analysis',
      'Drug design targeting DNA',
      'Understanding heredity and evolution',
    ],
    difficulty: 'Intermediate',
    category: 'Molecular Biology',
  },
  'fluid-dynamics': {
    id: 'fluid-dynamics',
    name: 'Fluid Dynamics',
    description: 'Particle-based fluid flow simulation',
    explanation: 'Fluid dynamics studies how liquids and gases move. This simulation uses particles to represent fluid flow, showing vortices, turbulence, and pressure variations according to the Navier-Stokes equations.',
    keyPoints: [
      'Pressure and velocity are inversely related',
      'Vortices form in turbulent flow',
      'Viscosity affects flow patterns',
      'Conservation of mass (continuity)',
    ],
    physicsLaw: 'Navier-Stokes Equations: ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + f',
    equations: [
      'Continuity: ∇·v = 0 (incompressible)',
      'Bernoulli: p + ½ρv² + ρgh = constant',
      'Reynolds Number: Re = ρvL/μ',
    ],
    realWorldApplications: [
      'Aircraft and vehicle aerodynamics',
      'Weather prediction and climate modeling',
      'Pipeline and pump design',
      'Ocean current analysis',
    ],
    difficulty: 'Advanced',
    category: 'Fluid Mechanics',
  },
  'lorenz-attractor': {
    id: 'lorenz-attractor',
    name: 'Lorenz Attractor',
    description: 'Chaotic system and strange attractor',
    explanation: 'The Lorenz attractor is a set of chaotic solutions to the Lorenz system of differential equations. It demonstrates how deterministic systems can exhibit unpredictable behavior - the famous "butterfly effect".',
    keyPoints: [
      'Sensitive dependence on initial conditions',
      'Never repeats the same path exactly',
      'Bounded but never settles to equilibrium',
      'Butterfly-shaped strange attractor',
    ],
    physicsLaw: 'Lorenz Equations: dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz',
    equations: [
      'dx/dt = σ(y - x)',
      'dy/dt = x(ρ - z) - y',
      'dz/dt = xy - βz',
    ],
    realWorldApplications: [
      'Weather prediction limitations',
      'Understanding chaos in nature',
      'Cryptography and random number generation',
      'Economic and population modeling',
    ],
    difficulty: 'Advanced',
    category: 'Chaos Theory',
  },
  'magnetic-field': {
    id: 'magnetic-field',
    name: 'Magnetic Field',
    description: 'Magnetic field lines and flux visualization',
    explanation: 'Magnetic fields are created by moving electric charges and magnetic materials. This simulation visualizes field lines, showing how they emerge from north poles and enter south poles, never crossing each other.',
    keyPoints: [
      'Field lines never cross',
      'Stronger field where lines are closer',
      'Field strength decreases with distance',
      'Magnetic flux is conserved',
    ],
    physicsLaw: 'Biot-Savart Law: B = (μ₀/4π) ∫ (I dl × r̂)/r²',
    equations: [
      'B = μ₀I/2πr - Field around wire',
      'Φ = BA - Magnetic flux',
      'F = qv × B - Lorentz force',
    ],
    realWorldApplications: [
      'Electric motors and generators',
      'MRI medical imaging',
      'Magnetic data storage',
      'Particle accelerators',
    ],
    difficulty: 'Intermediate',
    category: 'Electromagnetism',
  },
};

export default function SimulationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const simulation = id ? simulationsData[id] : null;

  if (!simulation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Simulation Not Found</h1>
          <Link to="/" className="text-red-400 hover:text-red-300">Return to Home</Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    Beginner: 'from-green-500 to-emerald-500',
    Intermediate: 'from-yellow-500 to-orange-500',
    Advanced: 'from-red-500 to-rose-500',
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-red-500/20 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/40 border border-red-500/30 rounded-full mb-4">
            <span className="text-red-300 text-sm font-semibold">{simulation.category}</span>
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
            {simulation.name}
          </h1>
          <p className="text-2xl text-gray-300 mb-6">{simulation.description}</p>
          <div className={`inline-block px-6 py-2 bg-gradient-to-r ${difficultyColors[simulation.difficulty]} rounded-full font-bold shadow-lg`}>
            {simulation.difficulty}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-16">
          <Link
            to="/preview"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl shadow-red-500/50 hover:scale-110"
          >
            <Play size={24} />
            Try This Simulation
          </Link>
        </div>

        {/* Explanation */}
        <div className="mb-12 p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-red-400" size={28} />
            <h2 className="text-3xl font-bold">How It Works</h2>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">{simulation.explanation}</p>
        </div>

        {/* Key Points */}
        <div className="mb-12 p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="text-red-400" size={28} />
            <h2 className="text-3xl font-bold">What to Observe</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {simulation.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-500/20 rounded-xl">
                <span className="text-red-400 text-xl font-bold">{index + 1}</span>
                <span className="text-gray-300">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Physics Law */}
        <div className="mb-12 p-8 bg-gradient-to-br from-red-950/30 to-black/50 border-2 border-red-500/40 rounded-3xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4 text-red-300">Governing Physics Law</h2>
          <p className="text-xl text-white font-mono bg-black/50 p-4 rounded-xl border border-red-500/30">
            {simulation.physicsLaw}
          </p>
        </div>

        {/* Equations */}
        <div className="mb-12 p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-red-400" size={28} />
            <h2 className="text-3xl font-bold">Key Equations</h2>
          </div>
          <div className="space-y-3">
            {simulation.equations.map((equation, index) => (
              <div key={index} className="p-4 bg-black/50 border border-red-500/20 rounded-xl">
                <p className="text-lg text-gray-200 font-mono">{equation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real World Applications */}
        <div className="p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6">Real-World Applications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {simulation.realWorldApplications.map((app, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-500/20 rounded-xl">
                <span className="text-red-400 text-xl">✓</span>
                <span className="text-gray-300">{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/preview"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl shadow-red-500/50 hover:scale-110"
          >
            <Play size={24} />
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
