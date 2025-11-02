import { useState, useEffect } from 'react';
import { PlusIcon, TrendingUpIcon, TargetIcon, SlidersIcon, RefreshCwIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { DonutChart } from '../components/charts/DonutChart';
import { GoalCard } from '../components/domain/GoalCard';
import { InsightCard } from '../components/domain/InsightCard';
import { UserDataForm } from '../components/forms/UserDataForm';
import { useAuth } from '../contexts/AuthContext';
import { goals } from '../data/seed';
import { fmtINR } from '../utils/formatters';

interface UserProfile {
  age: number;
  income: number;
  essentials: number;
  emi: number;
  dependents: number;
  incomeStability: string;
  emergencyMonths: string;
  primaryHorizon: string;
  selfTolerance: string;
  maxDrawdown: string;
  experience: string;
  liquidityNeed: string;
  taxBracket?: string;
  goals?: Array<{
    title: string;
    targetAmount: number;
    targetDate: string;
    priority?: string;
  }>;
}

interface FinancialPlan {
  riskScore: number;
  band: string;
  allocationPct: {
    equity: number;
    debt: number;
    gold: number;
    reits: number;
    crypto: number;
  };
  monthlyAmounts: {
    emergency: number;
    equity: number;
    debt: number;
    gold: number;
    reits: number;
    crypto: number;
  };
  notes: string[];
}
export function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setShowSetupForm(true);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // Profile doesn't exist, show setup form
        setShowSetupForm(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setUserProfile(result.data);
        await loadFinancialPlan();
      } else {
        setShowSetupForm(true);
      }
    } catch (err: any) {
      console.error('Failed to load user profile:', err);
      setError(err.message);
      setShowSetupForm(true);
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialPlan = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/profile/plan', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setFinancialPlan(result.data);
        }
      }
    } catch (err: any) {
      console.error('Failed to load financial plan:', err);
    }
  };

  const handleSetupComplete = async () => {
    setShowSetupForm(false);
    await loadUserProfile();
  };

  const handleComputePlan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/profile/compute-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setFinancialPlan(result.data);
        }
      }
    } catch (err: any) {
      console.error('Failed to compute plan:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Login Required</h2>
          <p className="text-slate-600 mb-6">Please log in to access your dashboard.</p>
          <Link to="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (showSetupForm || !userProfile) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Welcome to Your Financial Dashboard!
            </h1>
            <p className="text-lg text-slate-600">
              Let's set up your comprehensive financial profile to get personalized insights and recommendations.
            </p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <UserDataForm onComplete={handleSetupComplete} />
        </div>
      </PageContainer>
    );
  }

  // Calculate values from user profile
  const surplus = userProfile.income - userProfile.essentials - userProfile.emi;
  const emergencyRequired = userProfile.essentials * (parseFloat(userProfile.emergencyMonths.split('-')[0]) || 3);
  
  // Get current user info from token (simplified)
  const displayName = 'User'; // You can decode JWT token to get actual name
  
  // Create asset allocation data for chart
  const assetAllocationData = financialPlan ? [
    { name: 'Equity', value: financialPlan.allocationPct.equity, color: '#3B82F6' },
    { name: 'Debt', value: financialPlan.allocationPct.debt, color: '#10B981' },
    { name: 'Gold', value: financialPlan.allocationPct.gold, color: '#F59E0B' },
    { name: 'REITs', value: financialPlan.allocationPct.reits, color: '#8B5CF6' },
    { name: 'Crypto', value: financialPlan.allocationPct.crypto, color: '#EF4444' },
  ].filter(item => item.value > 0) : [];

  // Generate dynamic insights based on user data
  const dynamicInsights: Array<{
    id: string;
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
  }> = [
    {
      id: 'surplus-analysis',
      type: surplus > 0 ? 'success' : 'warning',
      title: surplus > 0 ? 'Positive Cash Flow' : 'Tight Budget',
      message: surplus > 0 
        ? `You have ${fmtINR(surplus)} available monthly for savings and investments.`
        : 'Consider reviewing your expenses to create more room for savings.'
    },
    {
      id: 'risk-profile',
      type: 'info',
      title: `${userProfile.selfTolerance} Risk Tolerance`,
      message: financialPlan 
        ? `Your risk assessment resulted in a ${financialPlan.band} portfolio with ${financialPlan.allocationPct.equity}% equity allocation.`
        : `Based on your ${userProfile.selfTolerance.toLowerCase()} risk tolerance, we'll create a suitable investment plan.`
    },
    {
      id: 'investment-horizon',
      type: 'info',
      title: `${userProfile.primaryHorizon} Investment Horizon`,
      message: `Your investment timeline of ${userProfile.primaryHorizon} helps determine the optimal asset allocation strategy.`
    }
  ];
  return (
    <PageContainer>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Hello, {displayName}! 👋
            </h1>
            <p className="text-slate-600 mt-1">
              Here's your personalized financial overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="primary" className="text-base px-4 py-2">
              {userProfile.selfTolerance} Risk
            </Badge>
            {financialPlan && (
              <Badge variant="success" className="text-base px-4 py-2">
                {financialPlan.band} Portfolio
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Monthly Income" 
            value={fmtINR(userProfile.income)} 
            icon={
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 text-primary-600" />
              </div>
            } 
          />
          <StatCard 
            label="Essential Expenses" 
            value={fmtINR(userProfile.essentials)} 
            subtext={`${(userProfile.essentials / userProfile.income * 100).toFixed(0)}% of income`} 
          />
          <StatCard 
            label="EMI/Loans" 
            value={fmtINR(userProfile.emi)} 
            subtext={`${(userProfile.emi / userProfile.income * 100).toFixed(0)}% of income`} 
          />
          <StatCard 
            label="Available Surplus" 
            value={fmtINR(surplus)} 
            subtext="For savings & investment" 
          />
        </div>
      </div>

      {/* Financial Plan Section */}
      {!financialPlan && (
        <div className="mb-8">
          <Card className="text-center p-8 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Generate Your Personalized Financial Plan
            </h3>
            <p className="text-slate-600 mb-6">
              Based on your comprehensive financial profile, we'll create a customized investment strategy and asset allocation plan.
            </p>
            <Button onClick={handleComputePlan} disabled={loading}>
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Compute My Financial Plan
            </Button>
          </Card>
        </div>
      )}

      {/* Charts Row */}
      {financialPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Asset Allocation */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Recommended Asset Allocation
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleComputePlan}
                disabled={loading}
              >
                <RefreshCwIcon className="w-4 h-4" />
              </Button>
            </div>
            <DonutChart data={assetAllocationData} />
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {assetAllocationData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-600">{item.name}</span>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Risk Score: {financialPlan.riskScore} • {financialPlan.band} Portfolio
            </p>
          </Card>

          {/* Monthly Allocation */}
          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Monthly Investment Plan
            </h2>
            <div className="space-y-4">
              {financialPlan.monthlyAmounts.emergency > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Emergency Fund</span>
                  <span className="text-lg font-bold text-warning-600">
                    {fmtINR(financialPlan.monthlyAmounts.emergency)}
                  </span>
                </div>
              )}
              {financialPlan.monthlyAmounts.equity > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Equity Investments</span>
                  <span className="text-lg font-bold text-primary-600">
                    {fmtINR(financialPlan.monthlyAmounts.equity)}
                  </span>
                </div>
              )}
              {financialPlan.monthlyAmounts.debt > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Debt Instruments</span>
                  <span className="text-lg font-bold text-success-600">
                    {fmtINR(financialPlan.monthlyAmounts.debt)}
                  </span>
                </div>
              )}
              {financialPlan.monthlyAmounts.gold > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Gold Investment</span>
                  <span className="text-lg font-bold text-yellow-600">
                    {fmtINR(financialPlan.monthlyAmounts.gold)}
                  </span>
                </div>
              )}
              {financialPlan.monthlyAmounts.reits > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">REITs</span>
                  <span className="text-lg font-bold text-purple-600">
                    {fmtINR(financialPlan.monthlyAmounts.reits)}
                  </span>
                </div>
              )}
              {financialPlan.monthlyAmounts.crypto > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Crypto (High Risk)</span>
                  <span className="text-lg font-bold text-red-600">
                    {fmtINR(financialPlan.monthlyAmounts.crypto)}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t text-sm text-slate-600">
              Total Investible Surplus: 
              <span className="font-semibold text-slate-900 ml-2">
                {fmtINR(surplus)}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Financial Plan Notes */}
      {financialPlan && financialPlan.notes && financialPlan.notes.length > 0 && (
        <div className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Personalized Recommendations
            </h2>
            <div className="space-y-3">
              {financialPlan.notes.map((note, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">{note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Goals Snapshot */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Your Goals</h2>
          <Link to="/goals">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.slice(0, 3).map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Insights & Alerts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Financial Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dynamicInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/goals">
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </Link>
            <Link to="/investments">
              <Button variant="secondary">
                <TargetIcon className="w-4 h-4 mr-2" />
                Add Investment
              </Button>
            </Link>
            <Link to="/simulator">
              <Button variant="ghost" className="border border-slate-300">
                <SlidersIcon className="w-4 h-4 mr-2" />
                Run Simulator
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}