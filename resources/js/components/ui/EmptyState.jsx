import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Empty state — easy rise Stitch design.
 * Illustration/icon + Bangla text + primary action.
 * Green tick variant for success empty states.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default', // 'default' | 'success'
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 text-center',
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'flex size-16 items-center justify-center rounded-full',
            variant === 'success' ? 'bg-success/10 text-success' : 'bg-border-rest text-muted'
          )}
        >
          {icon}
        </div>
      )}
      <p className="text-[15px] font-semibold text-ink font-bn">{title}</p>
      {description && (
        <p className="max-w-[260px] text-[13px] text-muted font-bn">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
