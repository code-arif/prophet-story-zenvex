import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ProgressBar } from './ProgressBar';
import { toBnDigits } from '../lib/format';

/**
 * Session shell for focused full-screen flows (lessons, quiz, flashcards,
 * chat, reading). NO bottom navigation (design rule). Provides the close X,
 * centered title / segmented progress, right-side counter, and a single
 * primary action fixed at the bottom.
 */
export function SessionShell({
  title,
  onClose,
  progress = 0,
  segments = 0,
  counter,
  right,
  children,
  primaryAction,
  className,
}) {
  return (
    <div className={cn('flex min-h-dvh flex-col bg-learn-bg font-learn-bn text-learn-ink', className)}>
      <header className="sticky top-0 z-40 bg-learn-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-[960px] items-center justify-between px-5">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-ml-2 flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
          >
            <X className="size-6" strokeWidth={2} />
          </button>

          <div className="min-w-0 flex-1 px-3 text-center">
            {title ? (
              <h1 className="truncate text-[15px] font-bold">{title}</h1>
            ) : segments > 0 ? (
              <ProgressBar value={progress} segments={segments} className="mx-auto max-w-40" />
            ) : (
              <ProgressBar value={progress} className="mx-auto max-w-40" />
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end">
            {counter && (
              <span className="inline-flex h-8 items-center rounded-full bg-learn-primary-tint px-3 text-[13px] font-bold text-learn-primary">
                {toBnDigits(counter)}
              </span>
            )}
            {right}
          </div>
        </div>

        {(progress > 0 || segments > 0) && (
          <div className="mx-auto w-full max-w-[960px] px-5 pb-2">
            <ProgressBar value={progress} segments={segments} />
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-[960px] flex-1 px-5 pb-8">{children}</main>

      {primaryAction && (
        <footer className="sticky bottom-0 bg-learn-bg px-5 pb-6 pt-2">
          <div className="mx-auto w-full max-w-[960px]">{primaryAction}</div>
        </footer>
      )}
    </div>
  );
}
