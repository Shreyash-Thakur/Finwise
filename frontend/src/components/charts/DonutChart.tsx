import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
interface DonutChartProps {
  data: {
    name: string;
    value: number;
  }[];
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
}
const DEFAULT_COLORS = ['#2563EB', '#0D9488', '#8B5CF6', '#F59E0B', '#EF4444'];
export function DonutChart({
  data,
  colors = DEFAULT_COLORS,
  innerRadius = 60,
  outerRadius = 100
}: DonutChartProps) {
  return <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} dataKey="value">
          {data.map((_, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} contentStyle={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>;
}