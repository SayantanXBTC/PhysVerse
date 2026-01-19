import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'simulation_created' | 'simulation_shared' | 'challenge_completed' | 'achievement_unlocked' | 'level_up' | 'login';
  metadata: {
    simulationId?: string;
    simulationName?: string;
    achievementId?: string;
    achievementName?: string;
    level?: number;
    challengeId?: string;
    challengeName?: string;
  };
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['simulation_created', 'simulation_shared', 'challenge_completed', 'achievement_unlocked', 'level_up', 'login'],
    required: true
  },
  metadata: {
    simulationId: String,
    simulationName: String,
    achievementId: String,
    achievementName: String,
    level: Number,
    challengeId: String,
    challengeName: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
