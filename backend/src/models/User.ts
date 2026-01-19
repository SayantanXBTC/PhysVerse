import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  
  // OAuth fields
  oauthProvider?: 'google' | 'github' | 'discord' | 'local';
  oauthId?: string;
  
  // Gamification
  level: number;
  xp: number;
  achievements: string[];
  badges: string[];
  
  // Personalization
  favoriteTopics: string[];
  theme: 'dark' | 'light' | 'auto';
  customTheme?: {
    primary: string;
    secondary: string;
  };
  
  // Activity
  lastLogin?: Date;
  loginCount: number;
  totalSimulationTime: number;
  onboardingCompleted: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  passwordHash: {
    type: String,
    required: function(this: IUser) {
      return this.oauthProvider === 'local' || !this.oauthProvider;
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  socialLinks: {
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  
  // OAuth
  oauthProvider: {
    type: String,
    enum: ['google', 'github', 'discord', 'local'],
    default: 'local'
  },
  oauthId: {
    type: String,
    sparse: true
  },
  
  // Gamification
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  badges: [{
    type: String
  }],
  
  // Personalization
  favoriteTopics: [{
    type: String
  }],
  theme: {
    type: String,
    enum: ['dark', 'light', 'auto'],
    default: 'dark'
  },
  customTheme: {
    primary: { type: String, default: '#ef4444' },
    secondary: { type: String, default: '#f43f5e' }
  },
  
  // Activity
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  totalSimulationTime: {
    type: Number,
    default: 0
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for OAuth lookups
userSchema.index({ oauthProvider: 1, oauthId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
