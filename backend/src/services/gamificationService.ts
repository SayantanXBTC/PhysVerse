import { User, IUser } from '../models/User';
import { Activity } from '../models/Activity';
import { ACHIEVEMENTS } from '../models/Achievement';

export class GamificationService {
  // XP required for each level (exponential growth)
  static getXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  // Calculate level from XP
  static getLevelFromXP(xp: number): number {
    let level = 1;
    let totalXP = 0;
    
    while (totalXP + this.getXPForLevel(level) <= xp) {
      totalXP += this.getXPForLevel(level);
      level++;
    }
    
    return level;
  }

  // Add XP and check for level up
  static async addXP(userId: string, xp: number, _reason: string): Promise<{ leveledUp: boolean; newLevel?: number; user: IUser }> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const oldLevel = user.level;
    user.xp += xp;
    const newLevel = this.getLevelFromXP(user.xp);

    const leveledUp = newLevel > oldLevel;
    if (leveledUp) {
      user.level = newLevel;
      
      // Create level up activity
      await Activity.create({
        userId: user._id,
        type: 'level_up',
        metadata: { level: newLevel }
      });
    }

    await user.save();

    return { leveledUp, newLevel: leveledUp ? newLevel : undefined, user };
  }

  // Check and award achievements
  static async checkAchievements(userId: string, stats: Record<string, number>): Promise<string[]> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const newAchievements: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (user.achievements.includes(achievement.id)) continue;

      let unlocked = false;

      switch (achievement.requirement.type) {
        case 'simulations_created':
          unlocked = stats.simulationsCreated >= achievement.requirement.value;
          break;
        case 'total_time':
          unlocked = stats.totalSimulationTime >= achievement.requirement.value;
          break;
        case 'challenges_completed':
          unlocked = stats.challengesCompleted >= achievement.requirement.value;
          break;
        case 'public_simulations':
          unlocked = stats.publicSimulations >= achievement.requirement.value;
          break;
        case 'login_streak':
          unlocked = stats.loginStreak >= achievement.requirement.value;
          break;
        case 'quantum_simulations':
          unlocked = stats.quantumSimulations >= achievement.requirement.value;
          break;
        case 'account_age':
          unlocked = true; // Early adopter - always unlocked
          break;
      }

      if (unlocked) {
        user.achievements.push(achievement.id);
        newAchievements.push(achievement.id);

        // Award XP
        await this.addXP(userId, achievement.xpReward, `Achievement: ${achievement.name}`);

        // Create activity
        await Activity.create({
          userId: user._id,
          type: 'achievement_unlocked',
          metadata: {
            achievementId: achievement.id,
            achievementName: achievement.name
          }
        });
      }
    }

    if (newAchievements.length > 0) {
      await user.save();
    }

    return newAchievements;
  }

  // Get user progress
  static async getUserProgress(userId: string): Promise<Record<string, number | string[]>> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const nextLevelXP = this.getXPForLevel(user.level + 1);
    
    // Calculate XP in current level
    let totalXPForCurrentLevel = 0;
    for (let i = 1; i < user.level; i++) {
      totalXPForCurrentLevel += this.getXPForLevel(i);
    }
    
    const xpInCurrentLevel = user.xp - totalXPForCurrentLevel;
    const xpProgress = (xpInCurrentLevel / nextLevelXP) * 100;

    return {
      level: user.level,
      xp: user.xp,
      xpInCurrentLevel,
      xpForNextLevel: nextLevelXP,
      xpProgress: Math.round(xpProgress),
      achievements: user.achievements,
      achievementCount: user.achievements.length,
      totalAchievements: ACHIEVEMENTS.length
    };
  }

  // Get leaderboard
  static async getLeaderboard(limit: number = 10): Promise<Array<Record<string, unknown>>> {
    const users = await User.find()
      .sort({ level: -1, xp: -1 })
      .limit(limit)
      .select('name avatar level xp achievements');

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      achievementCount: user.achievements.length
    }));
  }

  // Get recent activities
  static async getRecentActivities(limit: number = 20): Promise<Array<Record<string, unknown>>> {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name avatar');

    return activities.map(activity => {
      const userId = activity.userId as unknown as { name: string; avatar?: string };
      return {
        id: activity._id,
        type: activity.type,
        user: {
          name: userId.name,
          avatar: userId.avatar
        },
        metadata: activity.metadata,
        createdAt: activity.createdAt
      };
    });
  }

  // Get user activities
  static async getUserActivities(userId: string, limit: number = 50): Promise<Array<Record<string, unknown>>> {
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return activities.map(activity => ({
      id: activity._id,
      type: activity.type,
      metadata: activity.metadata,
      createdAt: activity.createdAt
    }));
  }
}
