import React from 'react';
import { cn } from '../../lib/utils';
import { Plus } from 'lucide-react';

/**
 * Floating action button — easy rise Stitch design.
 * 56px, #1D6FF2, white plus icon.
 * Position: fixed bottom-right above nav (24px gap).
 */
export function FAB({ onClick, label, className, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'fixed bottom-24 right-5 z-30 flex size-14 items-center justify-center rounded-full',
        'bg-brand text-white shadow-[0_8px_20px_rgba(29,111,242,0.35)]',
        'transition-all hover:scale-105 active:scale-95 lg:bottom-8',
        className
      )}
      {...props}
    >
      <Plus className="size-6" strokeWidth={2.5} />
    </button>
  );
}
