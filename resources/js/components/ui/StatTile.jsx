import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Stat tile — easy rise Stitch design.
 * Compact tile with a large bold count and a 12px label.
 * Horizontal scroll strip variant. Amber numeral for overdue/warning.
 */
export function StatTile({ label, value, warn = false, className }) {
  return (
    <div className={cn('flex flex-col items-center gap-0.5', className)}>
      <span
        className={cn(
          'text-[20px] font-bold font-bn',
          warn ? 'text-warn' : 'text-ink'
        )}
      >
        {value}
      </span>
      <span className="text-[12px] text-muted text-center font-bn">{label}</span>
    </div>
  );
}
