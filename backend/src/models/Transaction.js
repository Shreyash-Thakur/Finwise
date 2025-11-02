import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema(
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
      index: true,
    },
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.000001,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    fees: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactionDate: {
      type: Date,
      required: true,
      index: true,
    },
    externalTransactionId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, symbol: 1, transactionDate: -1 });
transactionSchema.index({ accountId: 1, transactionDate: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);