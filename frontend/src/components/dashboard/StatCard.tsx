import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../common/Card';
import { DemoBadge } from '../common/DemoBadge';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  isDemo?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  isDemo = false,
}) => {
  return (
    <Card padding="md" hoverEffect className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {title}
            </p>
            {isDemo && <DemoBadge size="sm" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums mt-1">
            {value}
          </h2>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md text-[11px]',
                isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
