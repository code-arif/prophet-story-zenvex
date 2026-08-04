import React from 'react';
import { cn } from '../lib/utils';

const TONES = {
  primary: 'border-learn-primary bg-learn-primary-tint text-learn-ink',
  ai: 'border-learn-ai bg-learn-ai-tint text-learn-ink',
  warn: 'border-learn-warn bg-learn-warn-tint text-learn-ink',
};

/** Callout box with a 3px left border — lesson explanations, reminders, tips. */
export function Callout({ tone = 'primary', title, children, className }) {
  return (
    <div className={cn('rounded-[14px] border-l-[3px] p-4', TONES[tone] || TONES.primary, className)}>
      {title && <p className="mb-1 text-[15px] font-bold">{title}</p>}
      <div className="text-[14px] leading-relaxed">{children}</div>
    </div>
  );
}
