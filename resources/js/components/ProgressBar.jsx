import React from 'react';
import { cn } from '../lib/utils';

const FILLS = {
  primary: 'bg-learn-primary',
  success: 'bg-learn-success',
  warn: 'bg-learn-warn',
  ai: 'bg-learn-ai',
};

/**
 * Progress indicator with two variants:
 * - segments > 0  → segmented (e.g. 5-part lesson progress)
 * - segments === 0 → thin linear bar
 * `value` is a percentage 0–100.
 */
export function ProgressBar({ value = 0, segments = 0, tone = 'primary', className }) {
  const clamped = Math.max(0, Math.min(100, value));
  const fill = FILLS[tone] || FILLS.primary;

  if (segments > 0) {
    const count = Math.max(1, segments);
    const filled = Math.round((clamped / 100) * count);
    return (
      <div className={cn('flex gap-1.5', className)} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              i < filled ? fill : 'bg-learn-border'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-learn-border', className)} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn('h-full rounded-full transition-all duration-300', fill)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
