import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Top bar used on all non-session learner screens: optional back/close on the
 * left, centered title, arbitrary right slot (streak chip, counter, settings…).
 * Pass `left` to render custom leading content (e.g. the home greeting).
 */
export function TopBar({ title, onBack, variant = 'back', right, left, className }) {
  const Icon = variant === 'close' ? X : ArrowLeft;
  const label = variant === 'close' ? 'Close' : 'Back';

  return (
    <header className={cn('flex h-14 items-center justify-between px-5', className)}>
      {left ? (
        <div className="flex shrink-0 items-center">{left}</div>
      ) : onBack ? (
        <button
          type="button"
          aria-label={label}
          onClick={onBack}
          className="-ml-2 flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
        >
          <Icon className="size-6" strokeWidth={2} />
        </button>
      ) : (
        <div className="w-12" />
      )}

      {title ? (
        <h1 className="min-w-0 flex-1 truncate px-3 text-center text-[16px] font-bold text-learn-ink">
          {title}
        </h1>
      ) : (
        <div className="flex-1" />
      )}

      <div className="flex shrink-0 items-center justify-end">{right}</div>
    </header>
  );
}
