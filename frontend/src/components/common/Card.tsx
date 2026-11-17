import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      children,
      title,
      subtitle,
      action,
      padding = 'md',
      hoverEffect = false,
      ...props
    },
    ref
  ) => {
    const paddings = {
      none: '',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-xl border border-slate-200/80 shadow-subtle transition-all',
          hoverEffect && 'hover:shadow-card hover:border-slate-300',
          paddings[padding],
          className
        )}
        {...props}
      >
        {(title || action) && (
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
            <div>
              {typeof title === 'string' ? (
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                  {title}
                </h3>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
