import mongoose from 'mongoose';

const { Schema } = mongoose;

const holdingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'LinkedAccount',
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    originalSymbol: {
      type: String,
      required: true,
      trim: true,
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
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    avgPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentPrice: {
      type: Number,
      min: 0,
    },
    marketValue: {
      type: Number,
      min: 0,
    },
    totalInvested: {
      type: Number,
      required: true,
      min: 0,
    },
    pnl: {
      type: Number,
    },
    pnlPercent: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    sector: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    firstPurchaseDate: {
      type: Date,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    priceLastUpdatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate derived values
holdingSchema.pre('save', function(next) {
  // Calculate total invested
  this.totalInvested = this.quantity * this.avgPrice;
  
  // Calculate market value and P&L if current price is available
  if (this.currentPrice != null) {
    this.marketValue = this.quantity * this.currentPrice;
    this.pnl = this.marketValue - this.totalInvested;
    this.pnlPercent = this.totalInvested > 0 
      ? (this.pnl / this.totalInvested) * 100 
      : 0;
  }
  
  this.lastUpdated = new Date();
  next();
});

// Indexes for performance
holdingSchema.index({ userId: 1, assetType: 1 });
holdingSchema.index({ userId: 1, accountId: 1 });
holdingSchema.index({ symbol: 1, exchange: 1 });
holdingSchema.index({ assetType: 1, symbol: 1 });
holdingSchema.index({ userId: 1, marketValue: -1 }); // For portfolio sorting

// Ensure unique combination per user + account + symbol + exchange
holdingSchema.index(
  { userId: 1, accountId: 1, symbol: 1, exchange: 1 },
  { unique: true }
);

export const Holding = mongoose.model('Holding', holdingSchema);