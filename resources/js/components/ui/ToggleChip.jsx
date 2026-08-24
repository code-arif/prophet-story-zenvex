import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Toggle chip — easy rise Stitch design.
 * Two or three frosted chips, one active at a time.
 * Active: #1D6FF2 (or violet for assistant context).
 * Used for assistant detail level, proposal structure view, filters.
 */
export function ToggleChip({
  options = [],
  value,
  onChange,
  variant = 'default', // 'default' | 'ai'
  className,
}) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto scrollbar-none', className)}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'shrink-0 rounded-[9999px] px-4 py-2 text-[13px] font-semibold font-bn transition-all',
              isActive
                ? variant === 'ai'
                  ? 'bg-ai text-white'
                  : 'bg-brand text-white'
                : 'glass text-ink'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
