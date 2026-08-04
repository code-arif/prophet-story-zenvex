import React from 'react';
import { cn } from '../lib/utils';

const TONES = {
  grey: 'bg-white text-learn-muted ring-1 ring-learn-border',
  blue: 'bg-learn-primary-tint text-learn-primary',
  green: 'bg-learn-success-tint text-learn-success',
  amber: 'bg-learn-warn-tint text-learn-warn',
  violet: 'bg-learn-ai-tint text-learn-ai',
  red: 'bg-learn-danger-tint text-learn-danger',
};

/**
 * Honest status badges — offline / "ইন্টারনেট লাগবে" / completed / level / AI.
 * tone follows the strict color-role rules in DESIGN_SYSTEM.md.
 */
export function StatusChip({ tone = 'grey', icon, children, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold leading-none',
        TONES[tone] || TONES.grey,
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
