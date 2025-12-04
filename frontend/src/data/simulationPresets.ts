import { SimulationType } from '@/types';

export interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  type: SimulationType;
  parameters: Record<string, any>;
  thumbnail?: string;
}

export const simulationPresets: SimulationPreset[] = [
  // Projectile Motion Presets
  {
    id: 'projectile-45deg',
    name: 'Optimal Launch Angle',
    description: '45° launch for maximum range',
    type: SimulationType.PROJECTILE,
    parameters: {
      velocity: 20,
      angle: 45,
      gravity: 9.8
    }
  },
  {
    id: 'projectile-moon',
    name: 'Moon Gravity',
    description: 'Projectile motion on the Moon',
    type: SimulationType.PROJECTILE,
    parameters: {
      velocity: 20,
      angle: 45,
      gravity: 1.62
    }
  },
  {
    id: 'projectile-jupiter',
    name: 'Jupiter Gravity',
    description: 'Projectile motion on Jupiter',
    type: SimulationType.PROJECTILE,
    parameters: {
      velocity: 20,
      angle: 45,
      gravity: 24.79
    }
  },
  {
    id: 'projectile-high-velocity',
    name: 'High Velocity Launch',
    description: 'Fast projectile with steep angle',
    type: SimulationType.PROJECTILE,
    parameters: {
      velocity: 50,
      angle: 60,
      gravity: 9.8
    }
  },

  // Spring-Mass Presets
  {
    id: 'spring-underdamped',
    name: 'Underdamped Oscillation',
    description: 'Light damping, multiple oscillations',
    type: SimulationType.SPRING_MASS,
    parameters: {
      mass: 1,
      springConstant: 10,
      damping: 0.1,
      displacement: 2
    }
  },
  {
    id: 'spring-critically-damped',
    name: 'Critically Damped',
    description: 'Returns to equilibrium without oscillation',
    type: SimulationType.SPRING_MASS,
    parameters: {
      mass: 1,
      springConstant: 10,
      damping: 6.32,
      displacement: 2
    }
  },
  {
    id: 'spring-overdamped',
    name: 'Overdamped System',
    description: 'Heavy damping, slow return',
    type: SimulationType.SPRING_MASS,
    parameters: {
      mass: 1,
      springConstant: 10,
      damping: 10,
      displacement: 2
    }
  },
  {
    id: 'spring-stiff',
    name: 'Stiff Spring',
    description: 'High spring constant, fast oscillation',
    type: SimulationType.SPRING_MASS,
    parameters: {
      mass: 1,
      springConstant: 50,
      damping: 0.1,
      displacement: 2
    }
  },

  // Two-Body Orbit Presets
  {
    id: 'orbit-circular',
    name: 'Circular Orbit',
    description: 'Perfect circular orbit',
    type: SimulationType.TWO_BODY_ORBIT,
    parameters: {
      mass1: 100,
      mass2: 1,
      distance: 10,
      velocity: 3.16
    }
  },
  {
    id: 'orbit-elliptical',
    name: 'Elliptical Orbit',
    description: 'Elongated elliptical path',
    type: SimulationType.TWO_BODY_ORBIT,
    parameters: {
      mass1: 100,
      mass2: 1,
      distance: 10,
      velocity: 2.5
    }
  },
  {
    id: 'orbit-escape',
    name: 'Escape Velocity',
    description: 'Body escapes gravitational pull',
    type: SimulationType.TWO_BODY_ORBIT,
    parameters: {
      mass1: 100,
      mass2: 1,
      distance: 10,
      velocity: 5
    }
  },
  {
    id: 'orbit-binary',
    name: 'Binary System',
    description: 'Two similar masses orbiting',
    type: SimulationType.TWO_BODY_ORBIT,
    parameters: {
      mass1: 50,
      mass2: 50,
      distance: 10,
      velocity: 4
    }
  }
];

export const getPresetsByType = (type: SimulationType): SimulationPreset[] => {
  return simulationPresets.filter(preset => preset.type === type);
};

export const getPresetById = (id: string): SimulationPreset | undefined => {
  return simulationPresets.find(preset => preset.id === id);
};
