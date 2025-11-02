import React from 'react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
}
export function Select({
  label,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>}
      <select className={`w-full px-3 py-2 border rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${error ? 'border-danger-500' : 'border-slate-300'} ${className}`} {...props}>
        {options.map(opt => <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>)}
      </select>
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>;
}