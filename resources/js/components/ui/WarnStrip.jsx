import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Warn strip — easy rise Stitch design.
 * Amber-tinted frosted strip with #D97706 icon and Bangla text.
 * Used for scope guard alerts, channel warnings, screener results.
 */
export function WarnStrip({ icon, children, action, className }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl bg-warn/5 border border-warn/20 p-3',
        className
      )}
    >
      {icon && (
        <span className="shrink-0 text-warn">{icon}</span>
      )}
      <p className="flex-1 text-[13px] text-ink font-bn">{children}</p>
      {action && (
        <div className="shrink-0">{action}</div>
      )}
    </div>
  );
}
