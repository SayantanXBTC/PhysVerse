import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Crown, TrendingUp, Award } from 'lucide-react';
import { gamificationService } from '../services/gamificationService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: gamificationService.getLeaderboard,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

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

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
            <Trophy className="text-yellow-400" size={20} />
            <span className="text-yellow-300 text-sm font-medium">Global Rankings</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Top physicists ranked by level, XP, and achievements
          </p>
        </div>

        {/* Top 3 Podium */}
        {data?.leaderboard && data.leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-12 animate-scaleIn">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-2xl shadow-gray-500/50 overflow-hidden border-4 border-gray-300">
                  {data.leaderboard[1].avatar ? (
                    <img src={data.leaderboard[1].avatar} alt={data.leaderboard[1].name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-white">{data.leaderboard[1].name.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
                  <span className="text-xl font-black text-white">2</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 text-center">{data.leaderboard[1].name}</h3>
              <p className="text-sm text-gray-400 mb-2">Level {data.leaderboard[1].level}</p>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <Award size={14} />
                <span>{data.leaderboard[1].achievementCount}</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-2xl shadow-yellow-500/50 overflow-hidden border-4 border-yellow-300 animate-pulse">
                  {data.leaderboard[0].avatar ? (
                    <img src={data.leaderboard[0].avatar} alt={data.leaderboard[0].name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-white">{data.leaderboard[0].name.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <Crown className="text-yellow-400 animate-bounce" size={48} />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
                  <span className="text-2xl font-black text-white">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 text-center">{data.leaderboard[0].name}</h3>
              <p className="text-sm text-gray-400 mb-2">Level {data.leaderboard[0].level}</p>
              <div className="flex items-center gap-1 text-yellow-400">
                <Award size={16} />
                <span className="font-bold">{data.leaderboard[0].achievementCount}</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-orange-500/50 overflow-hidden border-4 border-orange-300">
                  {data.leaderboard[2].avatar ? (
                    <img src={data.leaderboard[2].avatar} alt={data.leaderboard[2].name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-white">{data.leaderboard[2].name.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
                  <span className="text-xl font-black text-white">3</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 text-center">{data.leaderboard[2].name}</h3>
              <p className="text-sm text-gray-400 mb-2">Level {data.leaderboard[2].level}</p>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <Award size={14} />
                <span>{data.leaderboard[2].achievementCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="glass-red rounded-2xl overflow-hidden animate-slideInUp">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-red-400" size={24} />
              All Rankings
            </h2>
          </div>

          <div className="divide-y divide-gray-700/50">
            {data?.leaderboard?.map((user: any) => (
              <div
                key={user.userId}
                className={`p-6 bg-gradient-to-r ${getRankBg(user.rank)} hover:scale-[1.02] transition-all duration-300 border-l-4`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-16 flex items-center justify-center">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black text-white">{user.name.charAt(0)}</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-400">
                        Level <span className="font-bold text-white">{user.level}</span>
                      </span>
                      <span className="text-sm text-gray-400">
                        <span className="font-bold text-yellow-400">{user.xp.toLocaleString()}</span> XP
                      </span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Award size={14} className="text-yellow-400" />
                        <span className="font-bold text-white">{user.achievementCount}</span>
                      </span>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="hidden md:block">
                    <div className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-full">
                      <span className="text-sm font-bold text-white">Lvl {user.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {(!data?.leaderboard || data.leaderboard.length === 0) && (
          <div className="text-center py-20">
            <Trophy className="mx-auto mb-4 text-gray-600" size={64} />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No rankings yet</h3>
            <p className="text-gray-500">Be the first to climb the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}
