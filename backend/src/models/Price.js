import mongoose from 'mongoose';

const { Schema } = mongoose;

const priceSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    exchange: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    assetType: {
      type: String,
      enum: ['stock', 'crypto', 'mf', 'bond'],
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    open: {
      type: Number,
      min: 0,
    },
    high: {
      type: Number,
      min: 0,
    },
    low: {
      type: Number,
      min: 0,
    },
    close: {
      type: Number,
      min: 0,
    },
    volume: {
      type: Number,
      min: 0,
    },
    // Additional fields for mutual funds
    nav: {
      type: Number,
      min: 0,
    },
    amfiCode: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    change: {
      type: Number,
    },
    changePercent: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
priceSchema.index({ symbol: 1, exchange: 1, timestamp: -1 });
priceSchema.index({ assetType: 1, timestamp: -1 });
priceSchema.index({ symbol: 1, assetType: 1 });
priceSchema.index({ source: 1, timestamp: -1 });

// Ensure unique combination for real-time prices
priceSchema.index(
  { symbol: 1, exchange: 1, assetType: 1, timestamp: 1 },
  { unique: true, sparse: true }
);

export const Price = mongoose.model('Price', priceSchema);