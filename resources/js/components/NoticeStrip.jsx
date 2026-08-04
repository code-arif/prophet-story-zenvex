import React from 'react';
import { WifiOff, Info, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const TONES = {
  warn: 'bg-learn-warn-tint text-learn-warn',
  info: 'bg-learn-primary-tint text-learn-info',
  ai: 'bg-learn-ai-tint text-learn-ai',
};

const ICONS = {
  warn: WifiOff,
  info: Info,
  ai: Sparkles,
};

/**
 * Full-width notice strip — amber "internet needed" notices, info strips.
 * Amber is reserved for connectivity; use tone="info" for informational strips.
 */
export function NoticeStrip({ tone = 'warn', icon, children, className, ...props }) {
  const Icon = icon || ICONS[tone] || ICONS.warn;
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-[14px] px-4 py-3 text-[13px] font-medium leading-relaxed',
        TONES[tone] || TONES.warn,
        className
      )}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
