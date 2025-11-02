import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Basic Information
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  
  // Financial Details
  income: {
    type: Number,
    required: true,
    min: 0
  },
  
  essentials: {
    type: Number,
    required: true,
    min: 0
  },
  
  emi: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Stability and Risk Factors
  incomeStability: {
    type: String,
    enum: ['Very Stable', 'Stable', 'Variable', 'Highly Variable'],
    required: true
  },
  
  emergencyMonths: {
    type: String,
    enum: ['0', '1-2', '3-5', '6-9', '10+'],
    required: true
  },
  
  primaryHorizon: {
    type: String,
    enum: ['<1y', '1-3y', '3-5y', '5-10y', '>10y'],
    required: true
  },
  
  selfTolerance: {
    type: String,
    enum: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
    required: true
  },
  
  maxDrawdown: {
    type: String,
    enum: ['0-5%', '5-10%', '10-20%', '20-35%', '35%+'],
    required: true
  },
  
  experience: {
    type: String,
    enum: ['None', 'Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  
  liquidityNeed: {
    type: String,
    enum: ['Within 3 months', '3-12 months', '1-3 years', '>3 years (unlikely)'],
    required: true
  },
  
  // Goals
  goals: [{
    title: {
      type: String,
      required: true
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0
    },
    targetDate: {
      type: Date,
      required: true
    }
  }],
  
  // Optional Advanced Fields
  taxBracket: {
    type: String,
    enum: ['0%', '5%', '20%', '30%'],
    default: '20%'
  },
  
  dependents: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Computed Results Cache
  riskScoreCache: {
    type: Number,
    min: 0,
    max: 100
  },
  
  allocationCache: {
    riskScore: Number,
    band: {
      type: String,
      enum: ['Conservative', 'Moderately Conservative', 'Moderate', 'Moderately Aggressive', 'Aggressive']
    },
    allocationPct: {
      equity: Number,
      debt: Number,
      gold: Number,
      reit: Number,
      crypto: Number,
      cash: Number
    },
    monthlyAmounts: {
      equity: Number,
      debt: Number,
      gold: Number,
      reit: Number,
      crypto: Number,
      cash: Number
    },
    notes: [String]
  },
  
  lastComputedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ lastComputedAt: -1 });

// Virtual for savings capacity
ProfileSchema.virtual('savingsCapacity').get(function() {
  return this.income - this.essentials - this.emi;
});

// Virtual for DTI ratio
ProfileSchema.virtual('dtiRatio').get(function() {
  return this.income > 0 ? this.emi / this.income : 0;
});

export const Profile = mongoose.model('Profile', ProfileSchema);