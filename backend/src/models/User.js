import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Password required only if not using Google OAuth
      },
      minlength: 8,
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true, // Allow null but enforce uniqueness when present
      index: true,
    },
    dateOfBirth: {
      type: Date,
    },
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true,
      index: true,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    // Google OAuth fields
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    googleAccessToken: {
      type: String,
      select: false,
    },
    googleRefreshToken: {
      type: String,
      select: false,
    },
    refreshTokens: [{
      type: String,
      select: false,
    }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.refreshTokens;
        return ret;
      },
    },
  }
);

// Indexes for performance
userSchema.index({ email: 1, kycStatus: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);