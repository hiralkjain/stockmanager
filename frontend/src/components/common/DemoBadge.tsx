import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DemoBadgeProps {
  label?: string;
  tooltip?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  label = 'Demo Preview',
  tooltip = 'Feature layout ready for future backend integration. Data shown is illustrative.',
  size = 'sm',
  className,
}) => {
  return (
    <span
      title={tooltip}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-medium select-none border cursor-help transition-colors',
        'bg-slate-100/90 text-slate-600 border-slate-300 hover:bg-slate-200/80',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        className
      )}
    >
      <Sparkles className="w-3 h-3 text-slate-500" />
      <span>{label}</span>
      <Info className="w-2.5 h-2.5 text-slate-400 opacity-80" />
    </span>
  );
};
