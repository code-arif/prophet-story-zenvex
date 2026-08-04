import React from 'react';
import { cn } from '../lib/utils';

/**
 * Segmented control (Stitch design). tone="ai" uses violet for the active
 * segment (AI screens); tone="primary" uses the primary blue.
 * options: [{ label, value }]
 */
export function SegmentedControl({ options = [], value, onChange, tone = 'primary', className }) {
  const activeClass =
    tone === 'ai'
      ? 'bg-learn-ai text-white'
      : 'bg-learn-primary text-white';

  return (
    <div className={cn('flex rounded-[14px] bg-white p-1 ring-1 ring-learn-border', className)} role="tablist">
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-12 flex-1 rounded-[11px] text-[14px] font-semibold transition-all duration-150 active:scale-[0.98]',
              isActive ? activeClass : 'text-learn-muted'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
