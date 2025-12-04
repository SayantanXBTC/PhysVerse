import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { simulationRegistry } from '@/simulation/registry';
import SimulationCanvas from '@/components/SimulationCanvas';
import DynamicParameterControls from '@/simulation/ui/DynamicParameterControls';
import SimulationDataChart from '@/components/SimulationDataChart';
import { useSimulationData } from '@/hooks/useSimulationData';
import { getSimulationDataConfig } from '@/utils/simulationDataConfig';
import { Play, Pause, RotateCcw, ArrowLeft, Sparkles, BarChart3 } from 'lucide-react';

export default function SimulationPreviewPage() {
  const [simulationId, setSimulationId] = useState('projectile');
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [chartKey, setChartKey] = useState(0); // Force re-render of chart
  const { data: chartData, addDataPoint, clearData } = useSimulationData(150);

  const simulation = simulationRegistry.create(simulationId);

  const handleSimulationChange = (newId: string) => {
    setSimulationId(newId);
    setIsRunning(false);
    clearData();
    setChartKey(prev => prev + 1); // Force chart re-render
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
    clearData();
    setChartKey(prev => prev + 1); // Force chart re-render
    if (simulation) {
      const defaultParams: Record<string, unknown> = {};
      Object.entries(simulation.parameters).forEach(([key, param]) => {
        defaultParams[key] = param.default;
      });
      setParameters(defaultParams);
    }
  };

  // Get simulation-specific data configuration
  const dataConfig = getSimulationDataConfig(simulationId);

  // Collect simulation-specific data
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      const time = chartData.length * 0.1;
      const simulationData = dataConfig.generateData(time, parameters);
      
      addDataPoint({
        time: parseFloat(time.toFixed(2)),
        ...simulationData,
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, chartData.length, addDataPoint, simulationId, parameters, dataConfig]);

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Red glow background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
      </div>

      <div className="relative bg-black/80 backdrop-blur-xl border-b-2 border-red-500/30 px-6 py-4 shadow-lg shadow-red-900/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 rounded-lg transition-all duration-300"
              aria-label="Back to home"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="text-red-400 animate-pulse" size={24} />
              <h1 className="text-2xl font-black bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                Try PhysVerse
              </h1>
            </div>
          </div>

          <Link
            to="/signup"
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 hover:scale-105"
          >
            Sign Up to Save
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <div className={showChart ? 'flex-1 overflow-hidden' : 'h-full overflow-hidden'}>
            <SimulationCanvas
              simulationId={simulationId}
              parameters={parameters}
              isRunning={isRunning}
            />
          </div>
          
          {showChart && (
            <div className="h-96 flex-shrink-0 p-4 bg-black/80 border-t-2 border-red-500/30">
              <SimulationDataChart
                key={chartKey}
                data={chartData}
                dataKeys={dataConfig.dataKeys.map(dk => ({
                  key: dk.key,
                  color: dk.color,
                  label: `${dk.label} (${dk.unit})`,
                }))}
                title={dataConfig.title}
                maxPoints={150}
              />
            </div>
          )}
        </div>

        <div className="w-96 bg-black/60 backdrop-blur-xl border-l-2 border-red-500/30 overflow-y-auto shadow-2xl shadow-red-900/20">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    isRunning
                      ? 'bg-red-950/40 text-red-400 border-2 border-red-500/40 hover:bg-red-900/50 hover:border-red-500/60 hover:scale-105'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-500/40 hover:scale-105'
                  }`}
                >
                  {isRunning ? <Pause size={20} /> : <Play size={20} />}
                  <span>{isRunning ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 bg-red-950/40 hover:bg-red-900/60 border-2 border-red-500/30 hover:border-red-500/60 rounded-xl transition-all duration-300 hover:scale-105"
                  aria-label="Reset simulation"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setShowChart(!showChart);
                  setChartKey(prev => prev + 1); // Force chart re-render when toggling
                }}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  showChart
                    ? 'bg-red-500/20 text-red-300 border-2 border-red-500/40 hover:bg-red-500/30'
                    : 'bg-black/40 text-gray-400 border-2 border-gray-700/40 hover:border-red-500/30'
                }`}
              >
                <BarChart3 size={18} />
                <span>{showChart ? 'Hide Data Chart' : 'Show Data Chart'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-200">
                Choose Simulation
              </label>
              <select
                value={simulationId}
                onChange={(e) => handleSimulationChange(e.target.value)}
                aria-label="Choose Simulation"
                className="w-full px-4 py-3 bg-black/60 border-2 border-red-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/60 backdrop-blur-sm transition-all duration-300 font-semibold"
              >
                {simulationRegistry.getFreeMetadata().map((meta) => (
                  <option key={meta.id} value={meta.id} className="bg-black">
                    {meta.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-400 mt-2 font-semibold">
                ⭐ 15 more premium simulations available when you sign up!
              </p>
            </div>

            {simulation && simulation.metadata && (
              <div className="p-4 bg-gradient-to-br from-red-950/40 to-black/60 rounded-xl border-2 border-red-500/30 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-white mb-2">
                  {simulation.metadata.name}
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {simulation.metadata.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {simulation.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-lg font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-black text-white mb-4">
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

            <div className="p-5 bg-gradient-to-br from-red-950/50 to-black/60 rounded-xl border-2 border-red-500/40 backdrop-blur-sm shadow-lg shadow-red-900/30">
              <p className="text-sm text-gray-200 text-center mb-4 font-semibold">
                Like what you see? <span className="text-red-400">Sign up</span> to save and share your simulations!
              </p>
              <Link
                to="/signup"
                className="block w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-bold text-center transition-all duration-300 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 hover:scale-105"
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
