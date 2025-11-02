import React from 'react';
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}
export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'md'
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, value / max * 100));
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    danger: 'bg-danger-600'
  };
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };
  return <div className="w-full">
      {(label || showPercentage) && <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showPercentage && <span className="text-sm text-slate-600">
              {percentage.toFixed(0)}%
            </span>}
        </div>}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300`} style={{
        width: `${percentage}%`
      }} />
      </div>
    </div>;
}