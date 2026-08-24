import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * AgingBuckets — shows payment aging: current, 30-day, 60-day, 90-day+.
 */
export default function AgingBuckets({ buckets = [] }) {
  const { t } = useI18n();

  if (!buckets.length) return null;

  const colors = ['bg-brand', 'bg-warn', 'bg-warn', 'bg-danger'];

  return (
    <div className="glass px-4 py-4">
      <p className="mb-3 text-[14px] font-bold text-ink font-bn">{t('বয়স অনুযায়ী')}</p>
      <div className="flex gap-2">
        {buckets.map((b, i) => (
          <div key={i} className="flex-1 text-center">
            <div className={cn('mx-auto mb-1 h-2 rounded-full', colors[i] || 'bg-border-rest')}
                 style={{ width: '100%' }} />
            <p className="text-[11px] text-muted font-bn">{t(b.label)}</p>
            <p className="text-[13px] font-bold text-ink font-bn">৳{b.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
