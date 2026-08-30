import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Crown, TrendingUp, Award, RefreshCw } from 'lucide-react';
import { gamificationService } from '../services/gamificationService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: gamificationService.getLeaderboard,
    refetchInterval: 15000,
    refetchIntervalInBackground: true
  });

  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }
  }, [data]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, style: 'text-amber-300 bg-amber-500/10 border-amber-500/40' };
    if (rank === 2) return { icon: Medal, style: 'text-gray-200 bg-white/[0.06] border-white/25' };
    if (rank === 3) return { icon: Medal, style: 'text-orange-300 bg-orange-500/10 border-orange-500/30' };
    return { icon: null, style: '' };
  };

  const getRowStyle = (rank: number) => {
    if (rank === 1) return 'border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#0e0e10] to-[#0e0e10]';
    if (rank === 2) return 'border-white/15 bg-gradient-to-r from-white/[0.04] via-[#0e0e10] to-[#0e0e10]';
    if (rank === 3) return 'border-orange-500/30 bg-gradient-to-r from-orange-950/30 via-[#0e0e10] to-[#0e0e10]';
    return 'border-white/[0.06] bg-[#0e0e10]';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading leaderboard..." />
      </div>
    );
  }

  const leaderboard = (data as any)?.leaderboard || [];

  return (
    <div className="min-h-screen bg-[#08080A] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-900/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-rose-950/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-400/80 mb-2 inline-flex items-center gap-2">
            <Trophy size={11} /> Rankings
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight [text-wrap:balance]">
            Leaderboard
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Global XP standings. Updated live every 15s.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[11px] font-mono uppercase tracking-widest text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300">Live</span>
            <span className="text-gray-700">·</span>
            <span>updated {getTimeAgo(lastUpdate)}</span>
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              aria-label="Refresh leaderboard"
              className="ml-1 p-0.5 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {leaderboard.length > 0 ? (
          <ol className="space-y-2.5">
            {leaderboard.map((user: any, index: number) => {
              const rank = index + 1;
              const badge = getRankBadge(rank);
              const initials = (user.name || 'U')
                .split(' ')
                .map((s: string) => s[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <li
                  key={user.id || index}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-colors hover:border-red-500/40 ${getRowStyle(rank)}`}
                >
                  <div className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border ${
                    rank <= 3 ? badge.style : 'bg-white/[0.03] border-white/10'
                  }`}>
                    {badge.icon ? (
                      <badge.icon size={18} />
                    ) : (
                      <span className="font-mono font-bold text-gray-400 tabular-nums text-sm">
                        {String(rank).padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-xs sm:text-sm font-bold text-white overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                      {user.name || 'Unknown'}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] font-mono text-gray-500 tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp size={10} /> LVL {user.level || 1}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Award size={10} /> {user.achievements?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg sm:text-xl font-black text-white tabular-nums leading-none">
                      {(user.xp || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-red-400/80 mt-1">XP</div>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] p-14 text-center">
            <Trophy className="mx-auto mb-4 text-gray-700" size={40} />
            <h3 className="text-xl font-bold mb-1">No rankings yet</h3>
            <p className="text-sm text-gray-500">Earn XP to appear on the board.</p>
          </div>
        )}
      </div>
    </div>
  );
}
