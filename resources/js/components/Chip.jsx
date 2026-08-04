import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Selectable pill chip — filters, levels, topics, speeds (Stitch design).
 * Selected = filled primary with white text; unselected = white with border.
 */
export function Chip({ selected = false, icon, lock = false, children, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-all duration-150 active:scale-95',
        selected
          ? 'bg-learn-primary text-white'
          : 'bg-white text-learn-ink ring-1 ring-learn-border',
        lock && 'opacity-60',
        className
      )}
      {...props}
    >
      {icon}
      {children}
      {lock && <Lock className="size-3.5" />}
    </button>
  );
}
