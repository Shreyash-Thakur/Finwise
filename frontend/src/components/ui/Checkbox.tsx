import React from 'react';
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}
export function Checkbox({
  label,
  className = '',
  ...props
}: CheckboxProps) {
  return <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className={`w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-2 focus:ring-primary-500 ${className}`} {...props} />
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>;
}