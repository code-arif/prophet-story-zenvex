import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BottomSheet } from './BottomSheet';

/**
 * Dropdown chip — easy rise Stitch design.
 * Frosted pill with chevron that opens a BottomSheet selector.
 * Used for currency, channel, job type, marketplace selection.
 */
export function DropdownChip({
  label,
  value,
  options = [],
  onSelect,
  className,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'glass-row flex items-center gap-2 px-4 py-3 text-left active:scale-[0.98]',
          className
        )}
      >
        <span className="flex-1 truncate text-[14px] font-bn text-ink">
          {value || label}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted" strokeWidth={2} />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={label}>
        <div className="space-y-2 p-4">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'w-full rounded-[16px] px-4 py-3 text-left text-[15px] font-bn transition-all',
                  isSelected
                    ? 'bg-brand text-white font-semibold'
                    : 'bg-white/60 text-ink hover:bg-white/80'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}
