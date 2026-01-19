import { Lock, Star } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date | null;
}

interface AchievementCardProps {
  achievement: Achievement;
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-600'
};

const rarityBorders = {
  common: 'border-gray-500/30',
  rare: 'border-blue-500/30',
  epic: 'border-purple-500/30',
  legendary: 'border-yellow-500/30'
};

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div
      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
        achievement.unlocked
          ? `bg-gradient-to-br ${rarityColors[achievement.rarity]}/20 ${rarityBorders[achievement.rarity]} hover:scale-105`
          : 'bg-gray-900/50 border-gray-700/30 opacity-60'
      }`}
    >
      {/* Rarity Badge */}
      <div className="absolute top-3 right-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white shadow-lg`}
        >
          {achievement.rarity.toUpperCase()}
        </span>
      </div>

      {/* Icon */}
      <div className="flex items-center justify-center mb-4">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
            achievement.unlocked
              ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} shadow-lg`
              : 'bg-gray-800'
          }`}
        >
          {achievement.unlocked ? achievement.icon : <Lock size={32} className="text-gray-600" />}
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2 text-white">{achievement.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>

        {/* XP Reward */}
        <div className="flex items-center justify-center gap-2 text-yellow-400">
          <Star size={16} fill="currentColor" />
          <span className="font-bold">{achievement.xpReward} XP</span>
        </div>

        {/* Category */}
        <div className="mt-3">
          <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400">
            {achievement.category}
          </span>
        </div>

        {/* Unlocked Status */}
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <p className="text-xs text-green-400">
              ✓ Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
