import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Progress bar — easy rise Stitch design.
 * Horizontal bar with filled portion. #1D6FF2 normal, #D97706 over capacity.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  over = false,
  className,
  ...props
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-border-rest', className)}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-300',
          over ? 'bg-warn' : 'bg-brand'
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
