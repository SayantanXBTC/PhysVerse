import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { simulationService } from '@/services/simulationService';
import { simulationRegistry } from '@/simulation/registry';
import {
  Plus,
  Trash2,
  Eye,
  Globe,
  Lock,
  Calendar,
  Sparkles,
  Beaker,
  Search,
  Clock,
  Grid3x3,
  List
} from 'lucide-react';
import { Simulation } from '@/types';
import LiveSimulationPreview, { type PreviewVariant } from '@/components/LiveSimulationPreview';
import { useAuthStore } from '@/store/authStore';

const PREVIEW_MAP: Record<string, PreviewVariant> = {
  projectile: 'projectile',
  rocket: 'rocket',
  'spring-mass': 'spring',
  wave: 'wave',
  pendulum: 'pendulum',
  'double-pendulum': 'pendulum',
  'two-body-orbit': 'orbit',
  'solar-system': 'solar',
  'dna-helix': 'dna',
  fluid: 'fluid',
  'lorenz-attractor': 'lorenz',
  'magnetic-field': 'magnetic'
};

type Filter = 'all' | 'public' | 'private';
type Sort = 'recent' | 'oldest' | 'name';
type View = 'grid' | 'list';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ['simulations'],
    queryFn: simulationService.getAll
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('recent');
  const [view, setView] = useState<View>('grid');

  const deleteMutation = useMutation({
    mutationFn: simulationService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['simulations'] })
  });

  const handleDelete = (id: string) => {
    if (confirm('Delete this simulation? This cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const getMeta = (type: string) => simulationRegistry.create(type)?.metadata;

  const stats = useMemo(() => {
    const publicCount = simulations.filter((s) => s.isPublic).length;
    const uniqueTypes = new Set(simulations.map((s) => s.type)).size;
    const latest = simulations.reduce<Simulation | null>((acc, s) => {
      if (!acc) return s;
      return new Date(s.updatedAt || s.createdAt) > new Date(acc.updatedAt || acc.createdAt) ? s : acc;
    }, null);
    return {
      total: simulations.length,
      public: publicCount,
      private: simulations.length - publicCount,
      types: uniqueTypes,
      latest
    };
  }, [simulations]);

  const filtered = useMemo(() => {
    let list = simulations.slice();
    if (filter === 'public') list = list.filter((s) => s.isPublic);
    if (filter === 'private') list = list.filter((s) => !s.isPublic);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
      );
    }
    if (sort === 'recent') {
      list.sort(
        (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );
    } else if (sort === 'oldest') {
      list.sort(
        (a, b) => new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime()
      );
    } else if (sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [simulations, filter, search, sort]);

  return (
    <div className="min-h-screen bg-[#08080A] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-rose-950/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-400/80 mb-2">
              Workspace
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight [text-wrap:balance]">
              {user?.name ? `${user.name.split(' ')[0]}'s Lab` : 'My Lab'}
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Private workspace. Iterate on experiments, publish to gallery.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {stats.latest && (
              <Link
                to={`/simulation/${stats.latest._id}`}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <Clock size={14} />
                Continue last
              </Link>
            )}
            <Link
              to="/simulation/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold text-white transition-colors shadow-lg shadow-red-950/40"
            >
              <Plus size={16} />
              <span>New Simulation</span>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Beaker, label: 'Total', value: stats.total, tone: 'red' },
            { icon: Globe, label: 'Public', value: stats.public, tone: 'emerald' },
            { icon: Lock, label: 'Private', value: stats.private, tone: 'neutral' },
            { icon: Sparkles, label: 'Types Explored', value: stats.types, tone: 'red' }
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-xl border border-white/[0.06] bg-[#0e0e10] flex items-center gap-3"
            >
              <div
                className={`p-2 rounded-lg border ${
                  s.tone === 'red'
                    ? 'bg-red-500/10 border-red-500/25 text-red-400'
                    : s.tone === 'emerald'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-white/[0.04] border-white/10 text-gray-400'
                }`}
              >
                <s.icon size={14} />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white tabular-nums leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your simulations…"
              className="w-full pl-10 pr-3 py-2 bg-[#0e0e10] border border-white/[0.08] focus:border-red-500/50 rounded-lg text-sm placeholder-gray-500 outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(['all', 'public', 'private'] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                    : 'bg-white/[0.03] text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
            <div className="w-px h-6 bg-white/10 mx-1" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort"
              className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-md text-xs text-gray-300 font-medium outline-none appearance-none cursor-pointer"
            >
              <option value="recent" className="bg-[#0e0e10]">Most recent</option>
              <option value="oldest" className="bg-[#0e0e10]">Oldest</option>
              <option value="name" className="bg-[#0e0e10]">Name A–Z</option>
            </select>
            <div className="flex bg-white/[0.03] border border-white/10 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={`p-1.5 ${view === 'grid' ? 'text-red-300 bg-red-500/10' : 'text-gray-500 hover:text-white'}`}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
              >
                <Grid3x3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={`p-1.5 ${view === 'list' ? 'text-red-300 bg-red-500/10' : 'text-gray-500 hover:text-white'}`}
                aria-label="List view"
                aria-pressed={view === 'list'}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-red-500 border-t-transparent mb-4" />
            <p className="text-gray-400 text-sm">Loading simulations…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] p-14 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
              <Sparkles className="text-red-400" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {search || filter !== 'all' ? 'Nothing matches' : 'No simulations yet'}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              {search || filter !== 'all'
                ? 'Try a different search or filter.'
                : 'Start your first experiment. Every save lands here.'}
            </p>
            {!search && filter === 'all' && (
              <Link
                to="/simulation/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold text-white transition-colors"
              >
                <Plus size={16} />
                Create first simulation
              </Link>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((sim) => (
              <SimCard
                key={sim._id}
                sim={sim}
                meta={getMeta(sim.type)}
                onDelete={handleDelete}
                deleting={deleteMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] divide-y divide-white/[0.06] overflow-hidden">
            {filtered.map((sim) => (
              <SimRow
                key={sim._id}
                sim={sim}
                meta={getMeta(sim.type)}
                onDelete={handleDelete}
                deleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SimCard({
  sim,
  meta,
  onDelete,
  deleting
}: {
  sim: Simulation;
  meta: ReturnType<typeof simulationRegistry.create> extends infer T ? (T extends null | undefined ? undefined : T extends { metadata: infer M } ? M : undefined) : undefined;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const preview = PREVIEW_MAP[sim.type];
  return (
    <article className="group relative rounded-2xl border border-white/[0.06] hover:border-red-500/40 bg-[#0e0e10] overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-950/50">
      <div className="relative aspect-[16/9] overflow-hidden bg-black">
        {preview ? (
          <LiveSimulationPreview variant={preview} intensity={1.8} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-950/40 to-black flex items-center justify-center">
            <Beaker className="text-red-500/40" size={40} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3">
          {sim.isPublic ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-sm rounded text-emerald-300 text-[10px] font-mono uppercase tracking-widest">
              <Globe size={10} /> Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/[0.08] border border-white/15 backdrop-blur-sm rounded text-gray-300 text-[10px] font-mono uppercase tracking-widest">
              <Lock size={10} /> Private
            </span>
          )}
        </div>
        {meta?.category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/30 backdrop-blur-sm rounded text-red-300 text-[10px] font-mono uppercase tracking-widest">
              {meta.category}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white leading-tight truncate group-hover:text-red-300 transition-colors">
            {sim.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {meta?.name || sim.type.replace(/-/g, ' ')}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 tabular-nums">
          <Calendar size={11} />
          <time dateTime={new Date(sim.createdAt).toISOString()}>
            {new Date(sim.createdAt).toLocaleDateString()}
          </time>
        </div>
        {meta?.tags && meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {meta.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.08] text-gray-400 text-[10px] font-mono rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <Link
            to={`/simulation/${sim._id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Eye size={13} />
            Open
          </Link>
          <button
            type="button"
            onClick={() => onDelete(sim._id)}
            disabled={deleting}
            className="p-2 bg-white/[0.03] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 rounded-lg text-gray-500 hover:text-red-400 transition-colors disabled:opacity-40"
            aria-label={`Delete ${sim.name}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

function SimRow({
  sim,
  meta,
  onDelete,
  deleting
}: {
  sim: Simulation;
  meta: any;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const preview = PREVIEW_MAP[sim.type];
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-white/[0.02] transition-colors">
      <div className="relative shrink-0 w-24 h-14 rounded-md overflow-hidden bg-black border border-white/[0.06]">
        {preview && <LiveSimulationPreview variant={preview} intensity={1.8} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white truncate">{sim.name}</h3>
          {sim.isPublic ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-emerald-300 text-[9px] font-mono uppercase tracking-widest">
              <Globe size={9} /> Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/[0.04] border border-white/10 rounded text-gray-400 text-[9px] font-mono uppercase tracking-widest">
              <Lock size={9} /> Private
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 truncate mt-0.5">
          {meta?.name || sim.type.replace(/-/g, ' ')} · {new Date(sim.createdAt).toLocaleDateString()}
        </p>
      </div>
      <Link
        to={`/simulation/${sim._id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-md transition-colors"
      >
        <Eye size={12} /> Open
      </Link>
      <button
        type="button"
        onClick={() => onDelete(sim._id)}
        disabled={deleting}
        className="p-1.5 hover:bg-red-500/15 border border-transparent hover:border-red-500/40 rounded-md text-gray-500 hover:text-red-400 transition-colors disabled:opacity-40"
        aria-label={`Delete ${sim.name}`}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
