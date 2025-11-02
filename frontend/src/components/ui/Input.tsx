import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>}
      <input className={`w-full px-3 py-2 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${error ? 'border-danger-500' : 'border-slate-300'} ${className}`} {...props} />
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
    </div>;
}