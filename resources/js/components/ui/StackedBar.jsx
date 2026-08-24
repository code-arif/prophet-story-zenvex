import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Stacked bar — easy rise Stitch design.
 * Horizontal bar with proportional segments.
 * Used for aging buckets (Money), pipeline states.
 */
export function StackedBar({ segments = [], className }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className={cn('flex h-2 w-full overflow-hidden rounded-full', className)}>
      {segments.map((seg, i) => {
        const pct = total > 0 ? (seg.value / total) * 100 : 0;
        return (
          <div
            key={i}
            className={cn('h-full transition-all', seg.color)}
            style={{ width: `${pct}%` }}
            title={seg.label}
          />
        );
      })}
    </div>
  );
}
