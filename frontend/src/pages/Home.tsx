import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircleIcon, TrendingUpIcon, TargetIcon, PieChartIcon, PlusIcon, WalletIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DonutChart } from '../components/charts/DonutChart';
import { NewsCard } from '../components/domain/NewsCard';
import { useAuth } from '../contexts/AuthContext';
import { user, plan, news } from '../data/seed';
import { allocationArray } from '../data/derived';
import { fmtINR } from '../utils/formatters';
export function Home() {
  const { user: currentUser } = useAuth();

  // If user is logged in, show personalized content
  if (currentUser) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Welcome Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {currentUser.name || currentUser.email}!
            </h1>
            <p className="text-primary-100 mb-4">
              Ready to take control of your financial future?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-slate-100">
                  Go to Dashboard
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="lg" className="border-2 border-white text-white hover:bg-white/10">
                  Complete Financial Profile
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/goals">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <TargetIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Set Goals</h3>
                    <p className="text-sm text-slate-600">Define your financial objectives</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/investments">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <WalletIcon className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Add Portfolio</h3>
                    <p className="text-sm text-slate-600">Track your investments</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/simulator">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <TrendingUpIcon className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Simulate</h3>
                    <p className="text-sm text-slate-600">Test scenarios</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <PlusIcon className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Add Income</h3>
                  <p className="text-sm text-slate-600">Set monthly income</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Getting Started */}
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Take Risk Assessment</h4>
                    <p className="text-sm text-slate-600">Complete our risk profiling to get personalized recommendations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Set Your Income & Expenses</h4>
                    <p className="text-sm text-slate-600">Input your monthly income and fixed expenses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Define Your Goals</h4>
                    <p className="text-sm text-slate-600">Set financial goals and track your progress</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Latest News */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Market Updates</h2>
            <Link to="/news">
              <Button variant="ghost">
                View All
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.slice(0, 3).map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Show landing page for non-logged in users
  return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Take Control of Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Financial Future
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Transform your monthly income into a clear, actionable plan across
            needs, emergency fund, debt repayment, and smart multi-asset
            investing. Plan your goals, track progress, and simulate scenarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/simulator">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto border border-slate-300">
                Try Simulator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Preview Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Monthly Income</p>
                <p className="text-3xl font-bold text-slate-900">
                  {fmtINR(plan.monthlyIncome)}
                </p>
                <p className="text-sm text-success-600 mt-2">
                  Allocated across 5 categories
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Emergency Fund</p>
                <p className="text-3xl font-bold text-slate-900">
                  {user.emergencyMonthsCurrent}/{user.emergencyMonthsTarget}{' '}
                  months
                </p>
                <p className="text-sm text-warning-600 mt-2">
                  {(user.emergencyMonthsTarget - user.emergencyMonthsCurrent).toFixed(1)}{' '}
                  months to target
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Asset Allocation</p>
                <p className="text-3xl font-bold text-slate-900">
                  {plan.allocationPct.equity}% Equity
                </p>
                <p className="text-sm text-secondary-600 mt-2">
                  {user.riskProfile} risk profile
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How FinWise Works
          </h2>
          <p className="text-lg text-slate-600">
            Three simple steps to financial clarity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Enter Your Details
            </h3>
            <p className="text-slate-600">
              Share your monthly income, fixed expenses, existing debt, and
              financial goals. Complete a quick risk profile assessment.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-secondary-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Get Your Plan
            </h3>
            <p className="text-slate-600">
              FinWise generates a clear monthly allocation across needs,
              emergency fund, debt repayment, and multi-asset SIPs tailored to
              your risk profile.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Track & Simulate
            </h3>
            <p className="text-slate-600">
              Monitor your progress, track goals, and run "what-if" scenarios to
              see how changes in income or expenses affect your plan.
            </p>
          </div>
        </div>
      </section>

      {/* Chart Teasers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Visualize Your Financial Journey
          </h2>
          <p className="text-lg text-slate-600">
            Clear charts and insights to track your progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Asset Allocation
            </h3>
            <DonutChart data={allocationArray} />
            <p className="text-sm text-slate-600 mt-4">
              Understand your investment mix across equity, debt, gold, and
              REITs.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Monthly Breakdown
            </h3>
            <div className="space-y-3 py-8">
              {Object.entries(plan.splitMonthly).map(([key, value]) => <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 capitalize">
                    {key}
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {fmtINR(value)}
                  </span>
                </div>)}
            </div>
            <p className="text-sm text-slate-600 mt-4">
              See exactly where your money goes each month across all
              categories.
            </p>
          </Card>
        </div>
      </section>

      {/* Latest News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Latest Updates
            </h2>
            <p className="text-slate-600 mt-1">
              Stay informed with market news and insights
            </p>
          </div>
          <Link to="/news">
            <Button variant="ghost">
              View All
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.slice(0, 3).map(article => <NewsCard key={article.id} article={article} />)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-lg mb-8 text-primary-50">
            Join thousands of users who have taken control of their finances
            with FinWise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-slate-100 w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/simulator">
              <Button variant="ghost" size="lg" className="border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Try Simulator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
}