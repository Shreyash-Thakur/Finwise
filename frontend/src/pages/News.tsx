import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { IndexCard } from '../components/domain/IndexCard';
import { NewsCard } from '../components/domain/NewsCard';
import { indices, news } from '../data/seed';
export function News() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };
  return <PageContainer title="News & Insights" description="Stay updated with market trends and financial education">
      {/* Market Indices */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Market Indices
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((index, idx) => <IndexCard key={idx} index={index} />)}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <Card className="mb-8 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Subscribe to FinWise Insights
          </h2>
          <p className="text-slate-600 mb-6">
            Get weekly market updates, investment tips, and financial education
            delivered to your inbox
          </p>

          {subscribed ? <div className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-center justify-center gap-2">
              <CheckIcon className="w-5 h-5 text-success-600" />
              <p className="text-success-700 font-medium">
                You're subscribed to FinWise Insights!
              </p>
            </div> : <form onSubmit={handleSubscribe} className="flex gap-3">
              <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1" required />
              <Button type="submit">Subscribe</Button>
            </form>}
        </div>
      </Card>

      {/* News Feed */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Latest Updates
        </h2>
        <div className="space-y-4">
          {news.map(article => <NewsCard key={article.id} article={article} />)}
        </div>
      </div>

      {/* Educational Snippets */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Financial Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-slate-900 mb-2">
              What is an Emergency Fund?
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              An emergency fund is a financial safety net covering 3-6 months of
              essential expenses. It protects you from unexpected costs like
              medical emergencies or job loss.
            </p>
            <p className="text-sm text-primary-600 font-medium">
              Recommended: 6 months of expenses
            </p>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 mb-2">
              Debt vs Equity: The Basics
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Equity investments (stocks) offer higher returns but more
              volatility. Debt investments (bonds, FDs) provide stability with
              lower returns. A balanced portfolio includes both.
            </p>
            <p className="text-sm text-primary-600 font-medium">
              Balance based on risk tolerance
            </p>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 mb-2">
              Understanding SIPs
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Systematic Investment Plans (SIPs) let you invest fixed amounts
              regularly. This averages out market volatility and builds wealth
              through compounding over time.
            </p>
            <p className="text-sm text-primary-600 font-medium">
              Start small, stay consistent
            </p>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 mb-2">
              Risk Profiling
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Your risk profile determines asset allocation. Conservative
              investors prefer debt, while aggressive investors favor equity.
              Moderate balances both for steady growth.
            </p>
            <p className="text-sm text-primary-600 font-medium">
              Align with your goals & timeline
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>;
}