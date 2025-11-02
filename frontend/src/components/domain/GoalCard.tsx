import React from 'react';
import { TargetIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { fmtINR, shortDate } from '../../utils/formatters';
interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    target: number;
    saved: number;
    deadline: string;
    sip: number;
    priority: string;
    category: string;
  };
  onClick?: () => void;
}
export function GoalCard({
  goal,
  onClick
}: GoalCardProps) {
  const progress = goal.saved / goal.target * 100;
  const priorityVariant = goal.priority === 'High' ? 'danger' : goal.priority === 'Medium' ? 'warning' : 'default';
  return <Card className="cursor-pointer hover:shadow-lg transition-shadow" padding="md">
      <div onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <TargetIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{goal.name}</h3>
              <p className="text-xs text-slate-500">{goal.category}</p>
            </div>
          </div>
          <Badge variant={priorityVariant}>{goal.priority}</Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium text-slate-900">
                {fmtINR(goal.saved)} / {fmtINR(goal.target)}
              </span>
            </div>
            <ProgressBar value={progress} max={100} showPercentage={false} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-slate-600">
              <CalendarIcon className="w-4 h-4" />
              <span>{shortDate(goal.deadline)}</span>
            </div>
            <div className="flex items-center gap-1 text-primary-600 font-medium">
              <TrendingUpIcon className="w-4 h-4" />
              <span>{fmtINR(goal.sip)}/mo</span>
            </div>
          </div>
        </div>
      </div>
    </Card>;
}