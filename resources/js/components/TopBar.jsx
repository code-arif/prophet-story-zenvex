import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, X, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Top bar — easy rise Stitch design.
 * Translucent frosted strip with screen title (bold Bangla, left) and
 * settings gear icon (right, #64748B). Back chevron on sub-screens.
 * Settings is NOT a tab — it's a gear on every screen's top bar.
 */
export function TopBar({ title, onBack, variant = 'back', right, left, showSettings = true, className }) {
  const Icon = variant === 'close' ? X : ArrowLeft;
  const label = variant === 'close' ? 'Close' : 'Back';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center justify-between px-5',
        'bg-white/90 backdrop-blur-[18px]',
        'border-b border-white/40',
        className
      )}
    >
      {left ? (
        <div className="flex shrink-0 items-center">{left}</div>
      ) : onBack ? (
        <button
          type="button"
          aria-label={label}
          onClick={onBack}
          className="-ml-2 flex size-12 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 active:scale-95"
        >
          <Icon className="size-6" strokeWidth={2} />
        </button>
      ) : (
        <div className="w-12" />
      )}

      {title ? (
        <h1 className="min-w-0 flex-1 truncate px-3 text-center font-bn text-[16px] font-bold text-ink">
          {title}
        </h1>
      ) : (
        <div className="flex-1" />
      )}

      <div className="flex shrink-0 items-center justify-end gap-1">
        {right}
        {showSettings && (
          <Link
            href="/settings"
            aria-label="সেটিংস"
            className="flex size-12 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 active:scale-95"
          >
            <Settings className="size-6" strokeWidth={2} />
          </Link>
        )}
      </div>
    </header>
  );
}
