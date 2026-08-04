import React from 'react';
import { cn } from '../lib/utils';

const TONES = {
  default: 'bg-learn-primary-tint text-learn-primary',
  danger: 'bg-learn-danger-tint text-learn-danger',
  warn: 'bg-learn-warn-tint text-learn-warn',
  success: 'bg-learn-success-tint text-learn-success',
  ai: 'bg-learn-ai-tint text-learn-ai',
};

/** Compact stat pill used in result summaries (e.g. "৫টি ভুল", "স্তর: A2"). */
export function StatPill({ label, tone = 'default', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 items-center rounded-full px-3 text-[13px] font-bold',
        TONES[tone] || TONES.default,
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
}
