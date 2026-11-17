import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  BookmarkCheck,
  Briefcase,
  Sparkles,
  X,
  Server,
  LogOut,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Stocks', href: '/stocks', icon: LineChart },
  { name: 'Watchlist', href: '/watchlist', icon: BookmarkCheck },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase, badge: 'Beta' },
  { name: 'AI Insights', href: '/ai-insights', icon: Sparkles, badge: 'Preview' },
];

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-dropdown z-10 flex flex-col justify-between p-4 animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm">
                SP
              </div>
              <span className="font-bold text-slate-900 text-sm">
                StockPilot <span className="text-emerald-600">AI</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="py-3 px-2 border-b border-slate-100 mb-3">
            <p className="text-xs font-semibold text-slate-900">{user?.name || 'Investor'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>

          {/* Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          'w-4 h-4',
                          isActive ? 'text-emerald-400' : 'text-slate-400'
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              API: 8081
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
