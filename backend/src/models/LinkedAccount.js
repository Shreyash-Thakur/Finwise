import mongoose from 'mongoose';

const { Schema } = mongoose;

const linkedAccountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['zerodha', 'groww', 'wallet', 'bank'],
      required: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    accountId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    encryptedAccessToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    encryptedRefreshToken: {
      type: String,
      select: false,
    },
    // Wallet specific
    walletAddress: {
      type: String,
      trim: true,
    },
    chainId: {
      type: String,
      trim: true,
      index: true,
    },
    // Metadata
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastSyncAt: {
      type: Date,
    },
    syncStatus: {
      type: String,
      enum: ['pending', 'success', 'error'],
      default: 'pending',
      index: true,
    },
    syncError: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
linkedAccountSchema.index({ userId: 1, type: 1 });
linkedAccountSchema.index({ userId: 1, isActive: 1 });
linkedAccountSchema.index({ type: 1, provider: 1 });
linkedAccountSchema.index({ walletAddress: 1 }, { sparse: true });

// Ensure unique combination of user + provider + accountId
linkedAccountSchema.index(
  { userId: 1, provider: 1, accountId: 1 },
  { unique: true }
);

export const LinkedAccount = mongoose.model('LinkedAccount', linkedAccountSchema);