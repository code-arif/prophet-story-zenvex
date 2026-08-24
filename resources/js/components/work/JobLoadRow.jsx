import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * JobLoadRow — single job in capacity meter load list.
 */
export default function JobLoadRow({ job }) {
  const { t } = useI18n();
  const pct = job.capacity > 0 ? Math.min((job.hours / job.capacity) * 100, 100) : 0;

  return (
    <div className="glass-row flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink truncate font-bn">{job.name}</p>
        <p className="text-[12px] text-muted font-bn">{job.hours} ঘণ্টা / সপ্তাহ</p>
      </div>
      <div className="w-24">
        <div className="h-2 overflow-hidden rounded-full bg-border-rest">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              pct > 90 ? 'bg-warn' : 'bg-brand'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
