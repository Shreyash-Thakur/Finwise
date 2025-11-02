import mongoose from 'mongoose';

const { Schema } = mongoose;

const watchlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    symbols: [{
      symbol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },
      exchange: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },
      assetType: {
        type: String,
        enum: ['stock', 'crypto', 'mf', 'bond'],
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

watchlistSchema.index({ userId: 1, isDefault: 1 });
watchlistSchema.index({ userId: 1, name: 1 });

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);