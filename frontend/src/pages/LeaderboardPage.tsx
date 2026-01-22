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
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    refetchIntervalInBackground: true,
  });

  // Update last update time when data changes
  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }
  }, [data]);

  // Manual refresh function
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={32} />;
      case 2:
        return <Medal className="text-gray-300" size={28} />;
      case 3:
        return <Medal className="text-orange-400" size={28} />;
      default:
        return <span className="text-2xl font-black text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-600/30 to-orange-600/30 border-yellow-500/50';
      case 2:
        return 'from-gray-600/30 to-gray-700/30 border-gray-400/50';
      case 3:
        return 'from-orange-600/30 to-amber-600/30 border-orange-500/50';
      default:
        return 'from-gray-900/50 to-black/50 border-gray-700/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading leaderboard..." />
      </div>
    );
  }

  const leaderboard = (data as any)?.leaderboard || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-5xl mx-auto container-mobile py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-4 sm:mb-6">
            <Trophy className="text-yellow-400" size={16} />
            <span className="text-yellow-300 text-xs sm:text-sm font-medium">Global Rankings</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-yellow-400 via-orange-300 to-red-500 bg-clip-text text-transparent animate-gradient">
            Leaderboard
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Compete with physicists worldwide and climb the ranks
          </p>

          {/* Real-time Update Status */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 px-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-xs sm:text-sm font-medium">Live Updates</span>
            </div>
            
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full transition-colors disabled:opacity-50 touch-target"
            >
              <RefreshCw className={`w-4 h-4 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-blue-300 text-xs sm:text-sm font-medium">
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
            
            <div className="text-xs text-gray-500">
              Updated {getTimeAgo(lastUpdate)}
            </div>
          </div>
        </div>

        {leaderboard.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-white">Rankings</h2>
            
            {leaderboard.map((user: any, index: number) => (
              <div
                key={user.id || index}
                className={`flex items-center card-responsive bg-gradient-to-r ${getRankBg(index + 1)} backdrop-blur-sm border rounded-xl sm:rounded-2xl hover:scale-[1.02] transition-all duration-300 group`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-6 flex-shrink-0">
                  {getRankIcon(index + 1)}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm sm:text-xl font-black text-white">{user.name?.charAt(0) || '?'}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 ml-3 sm:ml-4 min-w-0">
                  <h3 className="text-sm sm:text-lg font-bold text-white group-hover:text-yellow-300 transition-colors truncate">
                    {user.name || 'Unknown User'}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} />
                      Level {user.level || 1}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={12} />
                      {user.achievements?.length || 0} achievements
                    </span>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-2xl font-black text-white mb-1">
                    {(user.xp || 0).toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">XP</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <Trophy className="mx-auto mb-4 text-gray-600" size={48} />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">No rankings yet</h3>
            <p className="text-gray-500">Be the first to climb the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}