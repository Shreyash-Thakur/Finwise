import { Link } from 'react-router-dom';
import { XIcon, HomeIcon, LayoutDashboardIcon, TargetIcon, SlidersIcon, NewspaperIcon, UserIcon, BarChart3Icon } from 'lucide-react';
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}
export function MobileNav({
  isOpen,
  onClose
}: MobileNavProps) {
  if (!isOpen) return null;
  return <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <span className="text-lg font-bold text-slate-900">Menu</span>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Close menu">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">
            <HomeIcon className="w-5 h-5" />
            Home
          </Link>
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">
            <LayoutDashboardIcon className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/goals" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">
            <TargetIcon className="w-5 h-5" />
            Goals
          </Link>
          <Link to="/simulator" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">
            <SlidersIcon className="w-5 h-5" />
            Simulator
          </Link>
          <Link to="/risk-planner" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">
            <UserIcon className="w-5 h-5" />
            Risk Planner
          </Link>
          <Link to="/investments" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">
            <BarChart3Icon className="w-5 h-5" />
            Markets
          </Link>
          <Link to="/news" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">
            <NewspaperIcon className="w-5 h-5" />
            News
          </Link>
        </nav>
      </div>
    </>;
}