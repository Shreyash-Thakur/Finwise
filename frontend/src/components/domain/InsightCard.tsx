import React from 'react';
import { AlertCircleIcon, InfoIcon, CheckCircleIcon } from 'lucide-react';
import { Card } from '../ui/Card';
interface InsightCardProps {
  insight: {
    id: string;
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
  };
}
export function InsightCard({
  insight
}: InsightCardProps) {
  const config = {
    warning: {
      icon: AlertCircleIcon,
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-600',
      borderColor: 'border-warning-200'
    },
    info: {
      icon: InfoIcon,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      borderColor: 'border-primary-200'
    },
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
      borderColor: 'border-success-200'
    }
  };
  const {
    icon: Icon,
    bgColor,
    iconColor,
    borderColor
  } = config[insight.type];
  return <Card className={`${bgColor} border ${borderColor}`} padding="md">
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className="font-medium text-slate-900 mb-1">{insight.title}</h4>
          <p className="text-sm text-slate-700">{insight.message}</p>
        </div>
      </div>
    </Card>;
}