import { apiClient } from './api';

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserFinancialProfile {
  id?: string;
  userId: string;
  monthlyIncome: number;
  fixedExpenses: number;
  currentSavings: number;
  emergencyFundTarget: number;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive' | 'Very Aggressive';
  age: number;
  dependents: number;
  existingDebt: number;
  investmentExperience: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialPlan {
  monthlyAllocation: {
    needs: number;
    emergencyFund: number;
    debtRepayment: number;
    investments: number;
    discretionary: number;
  };
  assetAllocation: {
    equity: number;
    debt: number;
    gold: number;
    reits: number;
  };
  recommendations: string[];
  projections: {
    emergencyFundCompletion: string;
    goalAchievement: {
      [key: string]: {
        timeline: string;
        monthlyRequired: number;
      };
    };
  };
}

class UserProfileService {
  private baseUrl = '/api/user/profile';

  async getProfile(): Promise<ApiResponse<UserFinancialProfile>> {
    return apiClient.get<UserFinancialProfile>(`${this.baseUrl}/financial`);
  }

  async createProfile(profile: Omit<UserFinancialProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<UserFinancialProfile>> {
    return apiClient.post<UserFinancialProfile>(`${this.baseUrl}/financial`, profile);
  }

  async updateProfile(profile: Partial<UserFinancialProfile>): Promise<ApiResponse<UserFinancialProfile>> {
    return apiClient.put<UserFinancialProfile>(`${this.baseUrl}/financial`, profile);
  }

  async generatePlan(): Promise<ApiResponse<FinancialPlan>> {
    return apiClient.get<FinancialPlan>(`${this.baseUrl}/financial-plan`);
  }

  async updateRiskProfile(riskProfile: UserFinancialProfile['riskProfile']): Promise<ApiResponse<UserFinancialProfile>> {
    return apiClient.put<UserFinancialProfile>(`${this.baseUrl}/risk-profile`, { riskProfile });
  }

  // Helper method to calculate basic allocations locally
  static calculateBasicAllocation(income: number, expenses: number, riskProfile: string) {
    const surplus = income - expenses;
    
    // Basic 50/30/20 rule with modifications based on risk profile
    const baseAllocation = {
      needs: expenses,
      emergencyFund: Math.min(surplus * 0.2, surplus * 0.4), // Max 40% to emergency fund
      investments: 0,
      debtRepayment: 0,
      discretionary: surplus * 0.1, // 10% for discretionary spending
    };

    // Adjust investment allocation based on risk profile
    const remainingSurplus = surplus - baseAllocation.emergencyFund - baseAllocation.discretionary;
    
    if (remainingSurplus > 0) {
      baseAllocation.investments = remainingSurplus * 0.8; // 80% of remaining to investments
      baseAllocation.debtRepayment = remainingSurplus * 0.2; // 20% to debt repayment
    }

    // Asset allocation based on risk profile
    const assetAllocation = {
      Conservative: { equity: 20, debt: 70, gold: 5, reits: 5 },
      Moderate: { equity: 50, debt: 40, gold: 5, reits: 5 },
      Aggressive: { equity: 70, debt: 20, gold: 5, reits: 5 },
      'Very Aggressive': { equity: 80, debt: 10, gold: 5, reits: 5 },
    };

    return {
      monthlyAllocation: baseAllocation,
      assetAllocation: assetAllocation[riskProfile as keyof typeof assetAllocation] || assetAllocation.Moderate,
    };
  }
}

export const userProfileService = new UserProfileService();