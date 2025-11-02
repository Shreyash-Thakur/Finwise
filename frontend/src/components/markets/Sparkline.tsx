import React from 'react';
import { generateSparklinePath } from '../../lib/marketUtils';
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
export function Sparkline({
  data,
  width = 100,
  height = 30,
  color = '#2563EB',
  className = ''
}: SparklineProps) {
  const path = generateSparklinePath(data, width, height);
  const isPositive = data[data.length - 1] >= data[0];
  const strokeColor = color === 'auto' ? isPositive ? '#10B981' : '#EF4444' : color;
  return <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
}