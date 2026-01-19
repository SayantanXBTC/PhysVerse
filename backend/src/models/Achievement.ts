import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'simulation' | 'social' | 'learning' | 'time' | 'special';
  xpReward: number;
  requirement: {
    type: string;
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievementSchema = new Schema<IAchievement>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['simulation', 'social', 'learning', 'time', 'special'],
    required: true
  },
  xpReward: {
    type: Number,
    required: true
  },
  requirement: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
});

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);

// Predefined achievements
export const ACHIEVEMENTS = [
  {
    id: 'first_simulation',
    name: 'First Steps',
    description: 'Create your first simulation',
    icon: '🎯',
    category: 'simulation',
    xpReward: 100,
    requirement: { type: 'simulations_created', value: 1 },
    rarity: 'common'
  },
  {
    id: 'simulation_master',
    name: 'Simulation Master',
    description: 'Create 10 simulations',
    icon: '🏆',
    category: 'simulation',
    xpReward: 500,
    requirement: { type: 'simulations_created', value: 10 },
    rarity: 'rare'
  },
  {
    id: 'time_traveler',
    name: 'Time Traveler',
    description: 'Spend 10 hours in simulations',
    icon: '⏰',
    category: 'time',
    xpReward: 300,
    requirement: { type: 'total_time', value: 10 },
    rarity: 'common'
  },
  {
    id: 'dedicated_physicist',
    name: 'Dedicated Physicist',
    description: 'Spend 100 hours in simulations',
    icon: '🔬',
    category: 'time',
    xpReward: 1000,
    requirement: { type: 'total_time', value: 100 },
    rarity: 'epic'
  },
  {
    id: 'challenge_beginner',
    name: 'Challenge Accepted',
    description: 'Complete your first challenge',
    icon: '🎖️',
    category: 'learning',
    xpReward: 200,
    requirement: { type: 'challenges_completed', value: 1 },
    rarity: 'common'
  },
  {
    id: 'challenge_master',
    name: 'Challenge Master',
    description: 'Complete all challenges',
    icon: '👑',
    category: 'learning',
    xpReward: 2000,
    requirement: { type: 'challenges_completed', value: 8 },
    rarity: 'legendary'
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Join PhysVerse in its early days',
    icon: '🌟',
    category: 'special',
    xpReward: 500,
    requirement: { type: 'account_age', value: 0 },
    rarity: 'epic'
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Share 5 simulations publicly',
    icon: '🦋',
    category: 'social',
    xpReward: 300,
    requirement: { type: 'public_simulations', value: 5 },
    rarity: 'rare'
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Log in for 7 consecutive days',
    icon: '🔥',
    category: 'time',
    xpReward: 400,
    requirement: { type: 'login_streak', value: 7 },
    rarity: 'rare'
  },
  {
    id: 'quantum_explorer',
    name: 'Quantum Explorer',
    description: 'Complete all quantum simulations',
    icon: '⚛️',
    category: 'learning',
    xpReward: 600,
    requirement: { type: 'quantum_simulations', value: 5 },
    rarity: 'epic'
  }
];
