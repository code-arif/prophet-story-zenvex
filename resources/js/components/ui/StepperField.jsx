import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Stepper field — easy rise Stitch design.
 * Label + compact numeric stepper (decrement/increment).
 * Value rendered in Bangla digits. Used in onboarding, niche scorer,
 * rate calculator, settings, and true hourly.
 */
export function StepperField({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  prefix = '',
  suffix = '',
  className,
}) {
  const canDec = value > min;
  const canInc = value < max;

  return (
    <div className={cn('glass-row flex items-center justify-between px-4 py-3', className)}>
      <span className="text-[14px] text-ink font-bn">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => canDec && onChange(value - step)}
          disabled={!canDec}
          className={cn(
            'flex size-8 items-center justify-center rounded-full border border-border-rest active:scale-95',
            canDec ? 'text-muted' : 'text-outline-inactive cursor-not-allowed'
          )}
          aria-label="Decrease"
        >
          −
        </button>
        <span className="min-w-[60px] text-center text-[16px] font-bold text-ink font-bn">
          {prefix}{value}{suffix}
        </span>
        <button
          type="button"
          onClick={() => canInc && onChange(value + step)}
          disabled={!canInc}
          className={cn(
            'flex size-8 items-center justify-center rounded-full border border-border-rest active:scale-95',
            canInc ? 'text-muted' : 'text-outline-inactive cursor-not-allowed'
          )}
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
}
