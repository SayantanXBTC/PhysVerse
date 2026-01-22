import { Response } from 'express';
import { GamificationService } from '../services/gamificationService';
import { ACHIEVEMENTS } from '../models/Achievement';
import { User } from '../models/User';
import { Simulation } from '../models/Simulation';

export const getProgress = async (req: any, res: Response): Promise<Response | void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const progress = await GamificationService.getUserProgress(userId);
    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
};

export const getAchievements = async (req: any, res: Response): Promise<Response | void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const achievements = ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: user.achievements.includes(achievement.id),
      unlockedAt: user.achievements.includes(achievement.id) ? new Date() : null
    }));

    res.json({ achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
};

export const getLeaderboard = async (_req: any, res: Response): Promise<void> => {
  try {
    const leaderboard = await GamificationService.getLeaderboard(50);
    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

export const getActivities = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 20;

    let activities;
    if (userId && req.query.user === 'me') {
      activities = await GamificationService.getUserActivities(userId, limit);
    } else {
      activities = await GamificationService.getRecentActivities(limit);
    }

    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
};

export const checkAchievements = async (req: any, res: Response): Promise<Response | void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user stats
    const user = await User.findById(userId);
    const simulations = await Simulation.find({ userId });
    
    const stats = {
      simulationsCreated: simulations.length,
      totalSimulationTime: user?.totalSimulationTime || 0,
      challengesCompleted: 0, // TODO: Implement challenge tracking
      publicSimulations: simulations.filter(s => s.isPublic).length,
      loginStreak: 1, // TODO: Implement streak tracking
      quantumSimulations: simulations.filter(s => 
        s.name.toLowerCase().includes('quantum')
      ).length
    };

    const newAchievements = await GamificationService.checkAchievements(userId, stats);
    
    res.json({ 
      newAchievements,
      message: newAchievements.length > 0 
        ? `Unlocked ${newAchievements.length} new achievement(s)!` 
        : 'No new achievements'
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
};

export const getStats = async (_req: any, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSimulations = await Simulation.countDocuments();
    const onlineUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
    });

    res.json({
      totalUsers,
      totalSimulations,
      onlineUsers
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};
