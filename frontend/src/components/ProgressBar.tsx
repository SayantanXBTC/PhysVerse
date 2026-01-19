import { TrendingUp } from 'lucide-react';

interface ProgressBarProps {
  level: number;
  xp: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  xpProgress: number;
}

export default function ProgressBar({ level, xp, xpInCurrentLevel, xpForNextLevel, xpProgress }: ProgressBarProps) {
  return (
    <div className="glass-red p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/50">
            <span className="text-2xl font-black text-white">{level}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Level {level}</h3>
            <p className="text-sm text-gray-400">{xp.toLocaleString()} Total XP</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <TrendingUp size={20} />
          <span className="text-sm font-semibold">{xpProgress}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600 transition-all duration-500 ease-out relative"
            style={{ width: `${xpProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{xpInCurrentLevel.toLocaleString()} XP</span>
          <span>{xpForNextLevel.toLocaleString()} XP to Level {level + 1}</span>
        </div>
      </div>
    </div>
  );
}
