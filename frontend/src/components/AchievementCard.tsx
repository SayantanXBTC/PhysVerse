import { Lock, Star, CheckCircle } from 'lucide-react';

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

const rarityStyle: Record<Achievement['rarity'], { badge: string; icon: string; ring: string }> = {
  common: {
    badge: 'bg-white/[0.04] text-gray-300 border-white/15',
    icon: 'from-gray-600 to-gray-800',
    ring: 'border-white/10'
  },
  rare: {
    badge: 'bg-red-500/10 text-red-300 border-red-500/25',
    icon: 'from-red-600 to-red-800',
    ring: 'border-red-500/25'
  },
  epic: {
    badge: 'bg-rose-500/15 text-rose-200 border-rose-500/35',
    icon: 'from-rose-600 to-red-900',
    ring: 'border-rose-500/35'
  },
  legendary: {
    badge: 'bg-amber-500/15 text-amber-200 border-amber-500/40',
    icon: 'from-amber-500 to-red-700',
    ring: 'border-amber-500/40'
  }
};

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const s = rarityStyle[achievement.rarity];
  const unlocked = achievement.unlocked;

  return (
    <article
      className={`relative rounded-2xl border p-5 transition-all duration-200 ${
        unlocked
          ? `bg-[#0e0e10] ${s.ring} hover:border-red-500/50`
          : 'bg-[#0a0a0c] border-white/[0.04] opacity-60'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${
            unlocked
              ? `bg-gradient-to-br ${s.icon} border-white/10 shadow-lg shadow-red-950/40`
              : 'bg-black/40 border-white/[0.06]'
          }`}
        >
          {unlocked ? achievement.icon : <Lock size={20} className="text-gray-600" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-bold text-white leading-tight">{achievement.name}</h3>
            <span
              className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border ${s.badge}`}
            >
              {achievement.rarity}
            </span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-3 [text-wrap:pretty]">
            {achievement.description}
          </p>

          <div className="flex items-center justify-between text-[11px]">
            <div className="inline-flex items-center gap-1 font-mono text-red-300 tabular-nums">
              <Star size={11} fill="currentColor" />
              <span className="font-bold">{achievement.xpReward}</span>
              <span className="text-gray-500">XP</span>
            </div>
            <span className="font-mono uppercase tracking-widest text-gray-500 text-[10px]">
              {achievement.category}
            </span>
          </div>

          {unlocked && achievement.unlockedAt && (
            <div className="mt-3 pt-3 border-t border-white/[0.06] inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <CheckCircle size={10} />
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
