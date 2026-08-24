import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Violet inset block — easy rise Stitch design.
 * #F3EFFF background, violet left accent. Used ONLY on the assistant
 * screen for draft blocks and generation controls.
 */
export function VioletInset({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-inset-violet p-3 border-l-4 border-ai',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
