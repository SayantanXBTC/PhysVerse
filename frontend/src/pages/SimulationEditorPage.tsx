import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulationService } from '@/services/simulationService';
import { simulationRegistry } from '@/simulation/registry';
import SimulationCanvas from '@/components/SimulationCanvas';
import DynamicParameterControls from '@/simulation/ui/DynamicParameterControls';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import SimulationDataChart from '@/components/SimulationDataChart';
import { useSimulationData } from '@/hooks/useSimulationData';
import { getSimulationDataConfig } from '@/utils/simulationDataConfig';
import { Save, ArrowLeft, Play, Pause, RotateCcw, Globe, Lock, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SimulationEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [name, setName] = useState('New Simulation');
  const [simulationId, setSimulationId] = useState('projectile');
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [isPublic, setIsPublic] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [chartKey, setChartKey] = useState(0); // Force re-render of chart
  const { data: chartData, addDataPoint, clearData } = useSimulationData(150);

  const simulation = simulationRegistry.create(simulationId);

  const { data: savedSimulation, isLoading } = useQuery({
    queryKey: ['simulation', id],
    queryFn: () => simulationService.getById(id!),
    enabled: !isNew && !!id
  });

  useEffect(() => {
    if (savedSimulation) {
      setName(savedSimulation.name);
      setSimulationId(savedSimulation.type);
      setParameters(savedSimulation.parameters);
      setIsPublic(savedSimulation.isPublic);
    }
  }, [savedSimulation]);

  useEffect(() => {
    const sim = simulationRegistry.create(simulationId);
    if (sim) {
      const defaultParams: Record<string, unknown> = {};
      Object.entries(sim.parameters).forEach(([key, param]) => {
        defaultParams[key] = param.default;
      });
      setParameters(defaultParams);
      clearData(); // Clear chart data when switching simulations
      setChartKey(prev => prev + 1); // Force chart re-render
    }
  }, [simulationId, clearData]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (isNew) {
        return simulationService.create(name, simulationId as string, parameters, isPublic);
      } else {
        return simulationService.update(id!, { name, parameters, isPublic });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      toast.success('Simulation saved successfully');
      if (isNew) {
        navigate(`/simulation/${data._id}`);
      }
    },
    onError: (error: unknown) => {
      console.error('Save error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to save simulation';
      toast.error(errorMessage);
    }
  });

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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-400">Loading simulation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-w-md"
              placeholder="Simulation name"
            />
            {simulation && (
              <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full border border-primary-500/20">
                {simulation.metadata.name}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowChart(!showChart);
                setChartKey(prev => prev + 1); // Force chart re-render when toggling
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showChart 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'bg-gray-700/50 text-gray-400 border border-gray-700'
              }`}
            >
              <BarChart3 size={18} />
              <span className="text-sm">{showChart ? 'Hide Chart' : 'Show Chart'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPublic 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-gray-700/50 text-gray-400 border border-gray-700'
              }`}
            >
              {isPublic ? <Globe size={18} /> : <Lock size={18} />}
              <span className="text-sm">{isPublic ? 'Public' : 'Private'}</span>
            </button>
            <button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saveMutation.isPending ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <div className={showChart ? 'flex-1 overflow-hidden' : 'h-full overflow-hidden'}>
            <SimulationCanvas
              simulationId={simulationId}
              parameters={parameters}
              isRunning={isRunning}
            />
          </div>
          
          {showChart && (
            <div className="h-96 flex-shrink-0 p-4 bg-gray-900/50 border-t border-gray-700/50">
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
                Simulation Type
              </label>
              <select
                value={simulationId}
                onChange={(e) => {
                  setSimulationId(e.target.value);
                  setIsRunning(false);
                }}
                aria-label="Simulation Type"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <optgroup label="Free Simulations">
                  {simulationRegistry.getFreeMetadata().map((meta) => (
                    <option key={meta.id} value={meta.id}>
                      {meta.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Premium Simulations ⭐">
                  {simulationRegistry.getPremiumMetadata().map((meta) => (
                    <option key={meta.id} value={meta.id}>
                      {meta.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {simulation && simulation.metadata && (
              <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-200 mb-2">
                  About This Simulation
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
          </div>
        </div>
      </div>

      <PerformanceMonitor />
    </div>
  );
}
