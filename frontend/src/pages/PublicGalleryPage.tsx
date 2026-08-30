import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { simulationService } from '@/services/simulationService';
import { simulationRegistry } from '@/simulation/registry';
import { Simulation, User } from '@/types';
import { Eye, User as UserIcon, Calendar, Search, Sparkles, Globe, Compass } from 'lucide-react';
import LiveSimulationPreview, { type PreviewVariant } from '@/components/LiveSimulationPreview';

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

type Sort = 'newest' | 'oldest' | 'name';

export default function PublicGalleryPage() {
  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ['public-simulations'],
    queryFn: simulationService.getPublic
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<Sort>('newest');

  const categories = useMemo(() => {
    const set = new Set<string>();
    simulations.forEach((s) => {
      const meta = simulationRegistry.create(s.type)?.metadata;
      if (meta?.category) set.add(meta.category);
    });
    return ['all', ...Array.from(set)];
  }, [simulations]);

  const filtered = useMemo(() => {
    let list = simulations.slice();
    if (category !== 'all') {
      list = list.filter((s) => simulationRegistry.create(s.type)?.metadata?.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => {
        const author = typeof s.userId === 'object' ? (s.userId as User).name : '';
        return (
          s.name.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          author.toLowerCase().includes(q)
        );
      });
    }
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [simulations, category, search, sort]);

  const contributors = useMemo(() => {
    const set = new Set<string>();
    simulations.forEach((s) => {
      if (typeof s.userId === 'object') set.add((s.userId as User)._id);
    });
    return set.size;
  }, [simulations]);

  return (
    <div className="min-h-screen bg-[#08080A] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-900/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-rose-950/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-400/80 mb-2 inline-flex items-center gap-2">
            <Compass size={11} /> Community
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight [text-wrap:balance]">
            Public Gallery
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl">
            Experiments shared by the community. Open, remix, learn.
          </p>

          <div className="mt-5 inline-flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-widest">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/25 rounded-full text-red-300">
              <Globe size={11} />
              <span className="text-white font-bold tabular-nums text-sm">{simulations.length}</span>
              Shared
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-gray-400">
              <UserIcon size={11} />
              <span className="text-white font-bold tabular-nums text-sm">{contributors}</span>
              Creators
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-gray-400">
              <Sparkles size={11} />
              <span className="text-white font-bold tabular-nums text-sm">{Math.max(0, categories.length - 1)}</span>
              Categories
            </span>
          </div>
        </header>

        <div className="mb-6 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, author, or type…"
              className="w-full pl-10 pr-3 py-2 bg-[#0e0e10] border border-white/[0.08] focus:border-red-500/50 rounded-lg text-sm placeholder-gray-500 outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  category === c
                    ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                    : 'bg-white/[0.03] text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {c[0].toUpperCase() + c.slice(1)}
              </button>
            ))}
            <div className="w-px h-6 bg-white/10 mx-1" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort"
              className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-md text-xs text-gray-300 font-medium outline-none appearance-none cursor-pointer"
            >
              <option value="newest" className="bg-[#0e0e10]">Newest</option>
              <option value="oldest" className="bg-[#0e0e10]">Oldest</option>
              <option value="name" className="bg-[#0e0e10]">Name A–Z</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-red-500 border-t-transparent mb-4" />
            <p className="text-gray-400 text-sm">Loading gallery…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] p-14 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
              <Eye className="text-red-400" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {search || category !== 'all' ? 'Nothing matches' : 'Gallery is empty'}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              {search || category !== 'all'
                ? 'Try clearing filters or a different search.'
                : 'Be the first to publish an experiment.'}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              Go to workspace
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((sim: Simulation) => {
              const author = typeof sim.userId === 'object' ? (sim.userId as User) : null;
              const meta = simulationRegistry.create(sim.type)?.metadata;
              const preview = PREVIEW_MAP[sim.type];
              const initials = (author?.name || 'U')
                .split(' ')
                .map((s) => s[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <article
                  key={sim._id}
                  className="group relative rounded-2xl border border-white/[0.06] hover:border-red-500/40 bg-[#0e0e10] overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-950/50"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-black">
                    {preview && <LiveSimulationPreview variant={preview} intensity={1.8} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                    {meta?.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/30 backdrop-blur-sm rounded text-red-300 text-[10px] font-mono uppercase tracking-widest">
                          {meta.category}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-sm rounded text-emerald-300 text-[10px] font-mono uppercase tracking-widest">
                        <Globe size={10} /> Public
                      </span>
                    </div>
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

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {author?.avatar ? (
                            <img src={author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            initials
                          )}
                        </div>
                        <span className="text-xs text-gray-400 truncate">
                          {author?.name || 'Anonymous'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-gray-500 tabular-nums shrink-0">
                        <Calendar size={10} />
                        {new Date(sim.createdAt).toLocaleDateString()}
                      </div>
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

                    <Link
                      to={`/simulation/${sim._id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors mt-1"
                    >
                      <Eye size={13} />
                      View Simulation
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
