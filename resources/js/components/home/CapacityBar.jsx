import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * CapacityBar — horizontal bar showing weekly load.
 * Green if under 80%, amber if 80–100%, red if over.
 */
export default function CapacityBar({ used, max }) {
  const { t } = useI18n();
  const pct = max > 0 ? Math.min((used / max) * 100, 120) : 0;
  const isOver = pct > 100;
  const isHigh = pct >= 80;

  const barColor = isOver
    ? 'bg-warn'
    : isHigh
      ? 'bg-warn'
      : 'bg-brand';

  return (
    <div className="glass-row px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-ink font-bn">
          {t('সপ্তাহের কাজ')}
        </span>
        <span className={cn(
          'text-[13px] font-bold font-bn',
          isOver ? 'text-warn' : isHigh ? 'text-warn' : 'text-brand'
        )}>
          {used}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border-rest">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
