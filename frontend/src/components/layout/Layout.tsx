import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import {
  LayoutDashboard,
  LineChart,
  BookmarkCheck,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Slideout Mobile Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Bottom Navigation for Mobile Devices */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-slate-900 font-semibold' : 'text-slate-500'
            )
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/stocks"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-slate-900 font-semibold' : 'text-slate-500'
            )
          }
        >
          <LineChart className="w-5 h-5 mb-0.5" />
          <span>Stocks</span>
        </NavLink>
        <NavLink
          to="/watchlist"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-slate-900 font-semibold' : 'text-slate-500'
            )
          }
        >
          <BookmarkCheck className="w-5 h-5 mb-0.5" />
          <span>Watchlist</span>
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-slate-900 font-semibold' : 'text-slate-500'
            )
          }
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span>Portfolio</span>
        </NavLink>
        <NavLink
          to="/ai-insights"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-slate-900 font-semibold' : 'text-slate-500'
            )
          }
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>AI Insights</span>
        </NavLink>
      </nav>
    </div>
  );
};
