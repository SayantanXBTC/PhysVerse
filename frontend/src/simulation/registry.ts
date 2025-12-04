import { PhysicsSimulation } from './types';
// Free simulations
import { ProjectileSimulation } from './models/ProjectileSimulation';
import { SpringMassSimulation } from './models/SpringMassSimulation';
import { TwoBodyOrbitSimulation } from './models/TwoBodyOrbitSimulation';
import { WaveSimulation } from './models/WaveSimulation';
import { PendulumSimulation } from './models/PendulumSimulation';
import { SolarSystemSimulation } from './models/SolarSystemSimulation';
import { DoublePendulumSimulation } from './models/DoublePendulumSimulation';
import { ParticleSystemSimulation } from './models/ParticleSystemSimulation';
import { BouncingBallsSimulation } from './models/BouncingBallsSimulation';
import { RocketSimulation } from './models/RocketSimulation';
import { FluidSimulation } from './models/FluidSimulation';
import { FractalTreeSimulation } from './models/FractalTreeSimulation';
import { DNAHelixSimulation } from './models/DNAHelixSimulation';
import { MagneticFieldSimulation } from './models/MagneticFieldSimulation';
import { LorenzAttractorSimulation } from './models/LorenzAttractorSimulation';
// Premium simulations
import { QuantumTunnelingSimulation } from './models/QuantumTunnelingSimulation';
import { BlackHoleSimulation } from './models/BlackHoleSimulation';
import { TornadoSimulation } from './models/TornadoSimulation';
import { GalaxyCollisionSimulation } from './models/GalaxyCollisionSimulation';
import { ElectromagneticWaveSimulation } from './models/ElectromagneticWaveSimulation';
import { NewtonsCradleSimulation } from './models/NewtonsCradleSimulation';
import { GyroscopeSimulation } from './models/GyroscopeSimulation';
import { AtomicOrbitalSimulation } from './models/AtomicOrbitalSimulation';
import { SuperconductorSimulation } from './models/SuperconductorSimulation';
import { PlasmaSimulation } from './models/PlasmaSimulation';
import { RelativisticParticleSimulation } from './models/RelativisticParticleSimulation';
import { CrystalGrowthSimulation } from './models/CrystalGrowthSimulation';
import { QuantumEntanglementSimulation } from './models/QuantumEntanglementSimulation';
import { NBodyGravitySimulation } from './models/NBodyGravitySimulation';
import { SupernovaSimulation } from './models/SupernovaSimulation';
import { QuantumHarmonicOscillatorSimulation } from './models/QuantumHarmonicOscillatorSimulation';

class SimulationRegistry {
  private simulations: Map<string, () => PhysicsSimulation> = new Map();

  constructor() {
    // Free simulations
    this.register('projectile', () => new ProjectileSimulation());
    this.register('spring-mass', () => new SpringMassSimulation());
    this.register('two-body-orbit', () => new TwoBodyOrbitSimulation());
    this.register('wave', () => new WaveSimulation());
    this.register('pendulum', () => new PendulumSimulation());
    this.register('solar-system', () => new SolarSystemSimulation());
    this.register('double-pendulum', () => new DoublePendulumSimulation());
    this.register('particle-system', () => new ParticleSystemSimulation());
    this.register('bouncing-balls', () => new BouncingBallsSimulation());
    this.register('rocket', () => new RocketSimulation());
    this.register('fluid', () => new FluidSimulation());
    this.register('fractal-tree', () => new FractalTreeSimulation());
    this.register('dna-helix', () => new DNAHelixSimulation());
    this.register('magnetic-field', () => new MagneticFieldSimulation());
    this.register('lorenz-attractor', () => new LorenzAttractorSimulation());
    // Premium simulations (require login)
    this.register('quantum-tunneling', () => new QuantumTunnelingSimulation());
    this.register('black-hole', () => new BlackHoleSimulation());
    this.register('tornado', () => new TornadoSimulation());
    this.register('galaxy-collision', () => new GalaxyCollisionSimulation());
    this.register('em-wave', () => new ElectromagneticWaveSimulation());
    this.register('newtons-cradle', () => new NewtonsCradleSimulation());
    this.register('gyroscope', () => new GyroscopeSimulation());
    this.register('atomic-orbital', () => new AtomicOrbitalSimulation());
    this.register('superconductor', () => new SuperconductorSimulation());
    this.register('plasma', () => new PlasmaSimulation());
    this.register('relativistic', () => new RelativisticParticleSimulation());
    this.register('crystal-growth', () => new CrystalGrowthSimulation());
    this.register('entanglement', () => new QuantumEntanglementSimulation());
    this.register('n-body', () => new NBodyGravitySimulation());
    this.register('supernova', () => new SupernovaSimulation());
    this.register('quantum-oscillator', () => new QuantumHarmonicOscillatorSimulation());
  }

  register(id: string, factory: () => PhysicsSimulation): void {
    this.simulations.set(id, factory);
  }

  create(id: string): PhysicsSimulation | null {
    const factory = this.simulations.get(id);
    return factory ? factory() : null;
  }

  getAll(): PhysicsSimulation[] {
    return Array.from(this.simulations.values()).map(factory => factory());
  }

  getAllMetadata() {
    return this.getAll().map(sim => sim.metadata);
  }

  getFreeMetadata() {
    return this.getAll().filter(sim => !sim.metadata.premium).map(sim => sim.metadata);
  }

  getPremiumMetadata() {
    return this.getAll().filter(sim => sim.metadata.premium).map(sim => sim.metadata);
  }
}

export const simulationRegistry = new SimulationRegistry();
