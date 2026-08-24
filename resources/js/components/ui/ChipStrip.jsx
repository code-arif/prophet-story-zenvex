import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Horizontal scrollable chip strip — easy rise Stitch design.
 * Frosted pills with icons, selectable. Selected chip: #1D6FF2 fill.
 * Used for marketplace tabs, job types, channels, periods.
 */
export function ChipStrip({ chips = [], value, onChange, className }) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto scrollbar-thin pb-1',
        className
      )}
    >
      {chips.map((chip) => {
        const isActive = chip.value === value;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onChange?.(chip.value)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 font-bn',
              isActive
                ? 'bg-brand text-white'
                : 'glass-row text-ink'
            )}
          >
            {chip.icon && <span className="size-4">{chip.icon}</span>}
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
