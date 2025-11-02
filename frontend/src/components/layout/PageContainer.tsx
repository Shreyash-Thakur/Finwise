import React from 'react';
interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}
export function PageContainer({
  children,
  title,
  description,
  action
}: PageContainerProps) {
  return <div className="min-h-screen bg-slate-50">
      {title && <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
              </div>
              {action && <div>{action}</div>}
            </div>
          </div>
        </div>}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>;
}