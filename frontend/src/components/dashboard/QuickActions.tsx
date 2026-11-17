import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { PlusCircle, Search, BookmarkCheck, Sparkles, PieChart } from 'lucide-react';

interface QuickActionsProps {
  onOpenAddStock: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenAddStock }) => {
  return (
    <Card
      title="Quick Actions"
      subtitle="Frequently used workflow shortcuts"
      padding="md"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenAddStock}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-subtle transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Add Stock</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Register ticker</span>
        </button>

        <Link
          to="/stocks"
          className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-subtle transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Explore Market</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Search listings</span>
        </Link>

        <Link
          to="/watchlist"
          className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-subtle transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-100/70 text-sky-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-800">My Watchlist</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Track favourites</span>
        </Link>

        <Link
          to="/ai-insights"
          className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-subtle transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-800">AI Analysis</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Smart insights</span>
        </Link>
      </div>
    </Card>
  );
};
