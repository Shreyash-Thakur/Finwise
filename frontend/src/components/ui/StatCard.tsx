import React from 'react';
import { Card } from './Card';
interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}
export function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  trendValue
}: StatCardProps) {
  const trendColors = {
    up: 'text-success-600',
    down: 'text-danger-600',
    neutral: 'text-slate-600'
  };
  return <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {subtext && <p className="text-sm text-slate-500 mt-1">{subtext}</p>}
          {trend && trendValue && <p className={`text-sm mt-1 ${trendColors[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>}
        </div>
        {icon && <div className="ml-4">{icon}</div>}
      </div>
    </Card>;
}