import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Status chip — easy rise Stitch design.
 * Small pill: grey (awaiting), azure (active), blue-grey (delivered),
 * amber (due), green (closed).
 */
const VARIANTS = {
  default: 'bg-border-rest text-muted',
  active: 'bg-brand/10 text-brand',
  delivered: 'bg-slate-200 text-slate-600',
  due: 'bg-warn/10 text-warn',
  closed: 'bg-success/10 text-success',
};

export function StatusChip({ variant = 'default', children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold font-bn',
        VARIANTS[variant] || VARIANTS.default,
        className
      )}
    >
      {children}
    </span>
  );
}
