import { useState } from 'react';
import { Link } from 'react-router-dom';
import { simulationRegistry } from '@/simulation/registry';
import SimulationCanvas from '@/components/SimulationCanvas';
import DynamicParameterControls from '@/simulation/ui/DynamicParameterControls';
import { Play, Pause, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react';

export default function SimulationPreviewPage() {
  const [simulationId, setSimulationId] = useState('solar-system');
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [isRunning, setIsRunning] = useState(true);

  const simulation = simulationRegistry.create(simulationId);

  const handleSimulationChange = (newId: string) => {
    setSimulationId(newId);
    setIsRunning(false);
    const sim = simulationRegistry.create(newId);
    if (sim) {
      const defaultParams: Record<string, unknown> = {};
      Object.entries(sim.parameters).forEach(([key, param]) => {
        defaultParams[key] = param.default;
      });
      setParameters(defaultParams);
    }
  };

  const handleParameterChange = (key: string, value: unknown) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setIsRunning(false);
    if (simulation) {
      const defaultParams: Record<string, unknown> = {};
      Object.entries(simulation.parameters).forEach(([key, param]) => {
        defaultParams[key] = param.default;
      });
      setParameters(defaultParams);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="text-primary-400" size={24} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                Try PhysVerse
              </h1>
            </div>
          </div>

          <Link
            to="/signup"
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-primary-500/30"
          >
            Sign Up to Save
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <SimulationCanvas
            simulationId={simulationId}
            parameters={parameters}
            isRunning={isRunning}
          />
        </div>

        <div className="w-96 bg-gray-800/30 backdrop-blur-md border-l border-gray-700/50 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  isRunning
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                <span className="font-medium">{isRunning ? 'Pause' : 'Play'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Reset simulation"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Choose Simulation
              </label>
              <select
                value={simulationId}
                onChange={(e) => handleSimulationChange(e.target.value)}
                aria-label="Choose Simulation"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {simulationRegistry.getFreeMetadata().map((meta) => (
                  <option key={meta.id} value={meta.id}>
                    {meta.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                ⭐ 15 more premium simulations available when you sign up!
              </p>
            </div>

            {simulation && simulation.metadata && (
              <div className="p-4 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-lg border border-primary-500/20">
                <h3 className="text-sm font-semibold text-gray-200 mb-2">
                  {simulation.metadata.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {simulation.metadata.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {simulation.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                Parameters
              </h3>
              {simulation && (
                <DynamicParameterControls
                  parameters={simulation.parameters}
                  values={parameters}
                  onChange={handleParameterChange}
                  disabled={isRunning}
                />
              )}
            </div>

            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
              <p className="text-sm text-gray-300 text-center mb-3">
                Like what you see? Sign up to save and share your simulations!
              </p>
              <Link
                to="/signup"
                className="block w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 rounded-lg font-semibold text-center transition-all duration-300"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
