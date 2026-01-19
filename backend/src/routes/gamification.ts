import express from 'express';
import { authenticate } from '../middleware/auth';
import * as gamificationController from '../controllers/gamificationController';

const router = express.Router();

// Get user progress (level, XP, etc.)
router.get('/progress', authenticate, gamificationController.getProgress);

// Get all achievements with unlock status
router.get('/achievements', authenticate, gamificationController.getAchievements);

// Get leaderboard
router.get('/leaderboard', gamificationController.getLeaderboard);

// Get activity feed
router.get('/activities', gamificationController.getActivities);

// Check and award achievements
router.post('/check-achievements', authenticate, gamificationController.checkAchievements);

// Get platform stats
router.get('/stats', gamificationController.getStats);

export default router;
