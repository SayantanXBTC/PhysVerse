import mongoose, { Document, Schema } from 'mongoose';
import { SimulationParameters, SimulationType } from '../types';

export interface ISimulation extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: SimulationType;
  parameters: SimulationParameters;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const simulationSchema = new Schema<ISimulation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(SimulationType)
  },
  parameters: {
    type: Schema.Types.Mixed,
    required: true,
    default: {}
  },
  isPublic: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

simulationSchema.index({ userId: 1, createdAt: -1 });
simulationSchema.index({ isPublic: 1, createdAt: -1 });

simulationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Simulation = mongoose.model<ISimulation>('Simulation', simulationSchema);
