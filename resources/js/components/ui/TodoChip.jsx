import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Todo chip — easy rise Stitch design.
 * #D97706 chip reading "TODO — যাচাই বাকি" with 11px caption.
 * Used for unverified regulatory figures (marketplace, incentive, channels).
 */
export function TodoChip({ caption, className }) {
  return (
    <div className={cn('flex flex-col items-end gap-0.5', className)}>
      <span className="inline-flex items-center rounded-full bg-warn/10 px-2.5 py-0.5 text-[11px] font-bold text-warn font-bn">
        TODO — যাচাই বাকি
      </span>
      {caption && (
        <span className="text-[11px] text-muted font-bn">{caption}</span>
      )}
    </div>
  );
}
