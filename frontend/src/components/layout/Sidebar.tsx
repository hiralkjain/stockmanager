import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  BookmarkCheck,
  Briefcase,
  Sparkles,
  Server,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Stocks',
    href: '/stocks',
    icon: LineChart,
    badge: null,
  },
  {
    name: 'Watchlist',
    href: '/watchlist',
    icon: BookmarkCheck,
    badge: null,
  },
  {
    name: 'Portfolio',
    href: '/portfolio',
    icon: Briefcase,
    badge: 'Beta',
  },
  {
    name: 'AI Insights',
    href: '/ai-insights',
    icon: Sparkles,
    badge: 'Preview',
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white min-h-[calc(100vh-4rem)]">
      {/* Navigation Section */}
      <div className="flex-1 px-3 py-6 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </p>
        </div>

        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-700'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-mono font-medium',
                      isActive
                        ? 'bg-slate-800 text-emerald-300'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Backend Integration Status Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-subtle">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              API Gateway
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono truncate">
            http://localhost:8081
          </p>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Spring Boot 3</span>
            <span>REST API</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
