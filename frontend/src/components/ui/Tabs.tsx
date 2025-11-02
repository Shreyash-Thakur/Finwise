import React, { useState } from 'react';
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}
interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}
export function Tabs({
  tabs,
  defaultTab
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  return <div>
      {/* Tab Headers */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'}`}>
              {tab.label}
            </button>)}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>;
}