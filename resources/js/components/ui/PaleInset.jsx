import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Pale inset block — easy rise Stitch design.
 * #EDF3FF background, 12px radius. For English sample messages,
 * inline code, and explanation blocks. Copy icon slot at top-right.
 */
export function PaleInset({ children, className, ...props }) {
  return (
    <div
      className={cn('rounded-xl bg-inset-blue p-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}
