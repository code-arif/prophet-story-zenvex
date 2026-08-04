import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

/** Localized empty state — never render a blank list (design rule). */
export function EmptyState({ icon, message, hint, actionLabel, onAction, className }) {
  const Icon = icon || Inbox;
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary">
        <Icon className="size-8" strokeWidth={1.75} />
      </div>
      <p className="text-[15px] font-semibold text-learn-ink">{message}</p>
      {hint && <p className="mt-1.5 text-[13px] leading-relaxed text-learn-muted">{hint}</p>}
      {actionLabel && onAction && (
        <Button variant="soft" size="learner" className="mt-6 max-w-64" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
