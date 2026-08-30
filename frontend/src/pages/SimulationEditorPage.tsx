import { useState, useEffect, useMemo } from 'react';
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
import {
  Save,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Globe,
  Lock,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function SimulationEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !id || id === 'new' || id === 'undefined';

  const [name, setName] = useState('New Simulation');
  const [simulationId, setSimulationId] = useState('projectile');
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [isPublic, setIsPublic] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [chartKey, setChartKey] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
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
      // Auto-run saved sim after brief mount delay
      const t = setTimeout(() => setIsRunning(true), 250);
      return () => clearTimeout(t);
    }
  }, [savedSimulation]);

  useEffect(() => {
    // Skip param reset when loading a saved sim — savedSimulation effect handles it
    if (savedSimulation && savedSimulation.type === simulationId) return;
    const sim = simulationRegistry.create(simulationId);
    if (sim) {
      const defaultParams: Record<string, unknown> = {};
      Object.entries(sim.parameters).forEach(([key, param]) => {
        defaultParams[key] = param.default;
      });
      setParameters(defaultParams);
      clearData();
      setChartKey((prev) => prev + 1);
    }
  }, [simulationId, clearData, savedSimulation]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (isNew) {
        return simulationService.create(name, simulationId as string, parameters, isPublic);
      }
      return simulationService.update(id!, { name, parameters, isPublic });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      setSaveState('saved');
      toast.success('Simulation saved');
      setTimeout(() => setSaveState('idle'), 2000);
      if (isNew && data?._id) {
        navigate(`/simulation/${data._id}`);
      }
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      const msg = error?.response?.data?.error || error?.message || 'Failed to save simulation';
      setSaveState('error');
      toast.error(msg);
      setTimeout(() => setSaveState('idle'), 3000);
    }
  });

  const handleSave = () => {
    setSaveState('saving');
    saveMutation.mutate();
  };

  const handleParameterChange = (key: string, value: unknown) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setIsRunning(false);
    clearData();
    setChartKey((prev) => prev + 1);
    if (simulation) {
      const defaultParams: Record<string, unknown> = {};
      Object.entries(simulation.parameters).forEach(([key, param]) => {
        defaultParams[key] = param.default;
      });
      setParameters(defaultParams);
    }
  };

  const dataConfig = getSimulationDataConfig(simulationId);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const time = chartData.length * 0.1;
      const simulationData = dataConfig.generateData(time, parameters);
      addDataPoint({ time: parseFloat(time.toFixed(2)), ...simulationData });
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, chartData.length, addDataPoint, simulationId, parameters, dataConfig]);

  const simTime = useMemo(() => (chartData.length * 0.1).toFixed(2), [chartData.length]);

  const status = isRunning ? 'RUNNING' : chartData.length > 0 ? 'PAUSED' : 'READY';
  const statusColor =
    status === 'RUNNING' ? 'text-emerald-400' : status === 'PAUSED' ? 'text-amber-400' : 'text-gray-400';
  const statusDot =
    status === 'RUNNING' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : status === 'PAUSED' ? 'bg-amber-400' : 'bg-gray-500';

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#08080A]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-red-500 border-t-transparent mb-3" />
          <p className="text-gray-400 text-sm">Preparing simulation…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#08080A] text-white">
      <header className="relative z-10 border-b border-white/[0.06] bg-[#0c0c0f]/95 backdrop-blur-xl px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/[0.05] rounded-md text-gray-400 hover:text-white transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={16} />
            </button>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-0 flex-1 max-w-md px-3 py-1.5 bg-transparent hover:bg-white/[0.04] focus:bg-white/[0.06] border border-transparent hover:border-white/10 focus:border-red-500/50 rounded-md text-sm font-medium focus:outline-none transition-colors"
              placeholder="Simulation name"
            />
            {simulation && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-300 text-xs font-mono uppercase tracking-widest rounded border border-red-500/20">
                {simulation.metadata.name}
              </span>
            )}
            <span className={`hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest ${statusColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
              {status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowChart(!showChart);
                setChartKey((prev) => prev + 1);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                showChart
                  ? 'bg-red-500/10 text-red-300 border border-red-500/25'
                  : 'bg-white/[0.03] text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
              }`}
              aria-pressed={showChart}
            >
              <BarChart3 size={13} />
              <span className="hidden sm:inline">{showChart ? 'Chart' : 'Chart'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isPublic
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                  : 'bg-white/[0.03] text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
              }`}
              aria-pressed={isPublic}
            >
              {isPublic ? <Globe size={13} /> : <Lock size={13} />}
              <span className="hidden sm:inline">{isPublic ? 'Public' : 'Private'}</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all disabled:cursor-not-allowed ${
                saveState === 'saved'
                  ? 'bg-emerald-500 text-white'
                  : saveState === 'error'
                  ? 'bg-red-700 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950/50'
              }`}
            >
              {saveState === 'saving' ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : saveState === 'saved' ? (
                <>
                  <Check size={13} /> Saved
                </>
              ) : saveState === 'error' ? (
                <>
                  <AlertCircle size={13} /> Retry
                </>
              ) : (
                <>
                  <Save size={13} /> Save
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden min-h-0">
        <div className="flex-1 relative flex flex-col overflow-hidden bg-[#050507] min-h-[50vh] lg:min-h-0">
          <div className={`relative ${showChart ? 'flex-1' : 'h-full'} overflow-hidden transition-all duration-300 min-h-[280px]`}>
            <SimulationCanvas simulationId={simulationId} parameters={parameters} isRunning={isRunning} />

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-md">
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot} animate-pulse`} />
                <span className={`text-[10px] font-mono uppercase tracking-widest ${statusColor}`}>{status}</span>
                {simulation && (
                  <>
                    <span className="w-px h-3 bg-white/15" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300">
                      {simulation.metadata.name}
                    </span>
                  </>
                )}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-3 px-2.5 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-md">
                <div className="text-right">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gray-500 leading-none">t</div>
                  <div className="text-xs font-mono tabular-nums text-red-300 leading-tight mt-0.5">{simTime}s</div>
                </div>
                <span className="w-px h-6 bg-white/15" />
                <div className="text-right">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gray-500 leading-none">pts</div>
                  <div className="text-xs font-mono tabular-nums text-gray-200 leading-tight mt-0.5">{chartData.length}</div>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-mono uppercase tracking-widest text-gray-500">
                drag · orbit · scroll · zoom
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out flex-shrink-0 border-t border-white/[0.06] bg-[#0a0a0c] ${
              showChart ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="h-[320px] sm:h-[380px] lg:h-96 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity size={13} className="text-red-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Live Data</span>
                </div>
                <span className="font-mono text-[10px] text-gray-500 tabular-nums">
                  {chartData.length}/150 samples
                </span>
              </div>
              <div className="h-[calc(100%-24px)]">
                <SimulationDataChart
                  key={chartKey}
                  data={chartData}
                  dataKeys={dataConfig.dataKeys.map((dk) => ({
                    key: dk.key,
                    color: dk.color,
                    label: `${dk.label} (${dk.unit})`
                  }))}
                  title={dataConfig.title}
                  maxPoints={150}
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-96 lg:shrink-0 bg-[#0a0a0c] border-t lg:border-t-0 lg:border-l border-white/[0.06] lg:overflow-y-auto">
          <div className="p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Playback</p>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${statusColor}`}>{status}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-lg font-semibold text-sm transition-all ${
                    isRunning
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50'
                  }`}
                >
                  {isRunning ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isRunning ? 'Pause' : 'Run'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-11 w-11 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  aria-label="Reset simulation"
                  title="Reset"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="sim-type" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
                Simulation Type
              </label>
              <select
                id="sim-type"
                value={simulationId}
                onChange={(e) => {
                  setSimulationId(e.target.value);
                  setIsRunning(false);
                }}
                aria-label="Simulation Type"
                className="w-full h-10 px-3 bg-black/40 border border-white/10 focus:border-red-500/60 rounded-md text-sm focus:outline-none transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                <optgroup label="Free">
                  {simulationRegistry.getFreeMetadata().map((meta) => (
                    <option key={meta.id} value={meta.id} className="bg-[#0a0a0c]">
                      {meta.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Premium ⭐">
                  {simulationRegistry.getPremiumMetadata().map((meta) => (
                    <option key={meta.id} value={meta.id} className="bg-[#0a0a0c]">
                      {meta.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {simulation && simulation.metadata && (
              <div className="border border-white/[0.06] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  aria-expanded={aboutOpen}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">About</span>
                  {aboutOpen ? <ChevronUp size={13} className="text-gray-500" /> : <ChevronDown size={13} className="text-gray-500" />}
                </button>
                {aboutOpen && (
                  <div className="p-4 space-y-3 border-t border-white/[0.04]">
                    <p className="text-xs text-gray-300 leading-relaxed [text-wrap:pretty]">
                      {simulation.metadata.description}
                    </p>
                    {simulation.metadata.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {simulation.metadata.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.08] text-gray-400 text-[10px] font-mono rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Parameters</p>
                {isRunning && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                    Paused while running
                  </span>
                )}
              </div>
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
        </aside>
      </div>

      <PerformanceMonitor />
    </div>
  );
}
