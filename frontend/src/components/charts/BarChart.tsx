import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
interface BarChartProps {
  data: any[];
  dataKeys: {
    key: string;
    name: string;
    color: string;
  }[];
  xAxisKey: string;
  stacked?: boolean;
}
export function BarChart({
  data,
  dataKeys,
  xAxisKey,
  stacked = false
}: BarChartProps) {
  return <ResponsiveContainer width="100%" height={300}>
      <RechartsBar data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xAxisKey} tick={{
        fill: '#64748b',
        fontSize: 12
      }} stroke="#cbd5e1" />
        <YAxis tick={{
        fill: '#64748b',
        fontSize: 12
      }} stroke="#cbd5e1" />
        <Tooltip contentStyle={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }} formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
        <Legend />
        {dataKeys.map(dk => <Bar key={dk.key} dataKey={dk.key} name={dk.name} fill={dk.color} stackId={stacked ? 'stack' : undefined} />)}
      </RechartsBar>
    </ResponsiveContainer>;
}