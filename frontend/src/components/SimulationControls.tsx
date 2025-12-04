import { SimulationType } from '@/types';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  type: SimulationType;
  setType: (type: SimulationType) => void;
  parameters: Record<string, any>;
  setParameters: (params: Record<string, any>) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  isNew: boolean;
}

export default function SimulationControls({
  type,
  setType,
  parameters,
  setParameters,
  isRunning,
  setIsRunning,
  isNew
}: Props) {
  const updateParameter = (key: string, value: unknown) => {
    setParameters({ ...parameters, [key]: value });
  };

  const getDefaultParameters = (simType: SimulationType) => {
    switch (simType) {
      case SimulationType.PROJECTILE:
        return { velocity: 20, angle: 45, gravity: 9.8 };
      case SimulationType.SPRING_MASS:
        return { mass: 1, springConstant: 10, damping: 0.1, displacement: 2 };
      case SimulationType.TWO_BODY_ORBIT:
        return { mass1: 100, mass2: 1, distance: 10, velocity: 5 };
      default:
        return {};
    }
  };

  const handleTypeChange = (newType: SimulationType) => {
    setType(newType);
    setParameters(getDefaultParameters(newType));
    setIsRunning(false);
  };

  const handleReset = () => {
    setParameters(getDefaultParameters(type));
    setIsRunning(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Simulation Controls</h2>
        
        {/* Playback Controls */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
            aria-label={isRunning ? "Pause simulation" : "Start simulation"}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={handleReset}
            className="btn btn-secondary flex items-center justify-center"
            aria-label="Reset simulation"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Simulation Type */}
      {isNew && (
        <div>
          <label 
            htmlFor="simulation-type-select" 
            className="block text-sm font-medium mb-2"
          >
            Simulation Type
          </label>
          <select
            id="simulation-type-select"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as SimulationType)}
            className="input"
          >
            <option value={SimulationType.PROJECTILE}>Projectile Motion</option>
            <option value={SimulationType.SPRING_MASS}>Spring-Mass System</option>
            <option value={SimulationType.TWO_BODY_ORBIT}>Two-Body Orbit</option>
          </select>
        </div>
      )}

      {/* Parameters */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Parameters</h3>
        
        {type === SimulationType.PROJECTILE && (
          <div className="space-y-4">
            <div>
              <label htmlFor="param-velocity" className="block text-sm mb-2">Initial Velocity (m/s)</label>
              <input
                id="param-velocity"
                type="number"
                value={parameters.velocity || 20}
                onChange={(e) => updateParameter('velocity', parseFloat(e.target.value))}
                className="input"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="param-angle" className="block text-sm mb-2">Launch Angle (degrees)</label>
              <input
                id="param-angle"
                type="number"
                value={parameters.angle || 45}
                onChange={(e) => updateParameter('angle', parseFloat(e.target.value))}
                className="input"
                step="1"
                min="0"
                max="90"
              />
            </div>
            <div>
              <label htmlFor="param-gravity" className="block text-sm mb-2">Gravity (m/s²)</label>
              <input
                id="param-gravity"
                type="number"
                value={parameters.gravity || 9.8}
                onChange={(e) => updateParameter('gravity', parseFloat(e.target.value))}
                className="input"
                step="0.1"
              />
            </div>
          </div>
        )}

        {type === SimulationType.SPRING_MASS && (
          <div className="space-y-4">
            <div>
              <label htmlFor="param-mass" className="block text-sm mb-2">Mass (kg)</label>
              <input
                id="param-mass"
                type="number"
                value={parameters.mass || 1}
                onChange={(e) => updateParameter('mass', parseFloat(e.target.value))}
                className="input"
                step="0.1"
                min="0.1"
              />
            </div>
            <div>
              <label htmlFor="param-spring" className="block text-sm mb-2">Spring Constant (N/m)</label>
              <input
                id="param-spring"
                type="number"
                value={parameters.springConstant || 10}
                onChange={(e) => updateParameter('springConstant', parseFloat(e.target.value))}
                className="input"
                step="0.5"
              />
            </div>
            <div>
              <label htmlFor="param-damping" className="block text-sm mb-2">Damping Coefficient</label>
              <input
                id="param-damping"
                type="number"
                value={parameters.damping || 0.1}
                onChange={(e) => updateParameter('damping', parseFloat(e.target.value))}
                className="input"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="param-displacement" className="block text-sm mb-2">Initial Displacement (m)</label>
              <input
                id="param-displacement"
                type="number"
                value={parameters.displacement || 2}
                onChange={(e) => updateParameter('displacement', parseFloat(e.target.value))}
                className="input"
                step="0.1"
              />
            </div>
          </div>
        )}

        {type === SimulationType.TWO_BODY_ORBIT && (
          <div className="space-y-4">
            <div>
              <label htmlFor="param-mass1" className="block text-sm mb-2">Mass 1 (kg)</label>
              <input
                id="param-mass1"
                type="number"
                value={parameters.mass1 || 100}
                onChange={(e) => updateParameter('mass1', parseFloat(e.target.value))}
                className="input"
                step="10"
              />
            </div>
            <div>
              <label htmlFor="param-mass2" className="block text-sm mb-2">Mass 2 (kg)</label>
              <input
                id="param-mass2"
                type="number"
                value={parameters.mass2 || 1}
                onChange={(e) => updateParameter('mass2', parseFloat(e.target.value))}
                className="input"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="param-distance" className="block text-sm mb-2">Initial Distance (m)</label>
              <input
                id="param-distance"
                type="number"
                value={parameters.distance || 10}
                onChange={(e) => updateParameter('distance', parseFloat(e.target.value))}
                className="input"
                step="0.5"
              />
            </div>
            <div>
              <label htmlFor="param-orb-velocity" className="block text-sm mb-2">Orbital Velocity (m/s)</label>
              <input
                id="param-orb-velocity"
                type="number"
                value={parameters.velocity || 5}
                onChange={(e) => updateParameter('velocity', parseFloat(e.target.value))}
                className="input"
                step="0.1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}