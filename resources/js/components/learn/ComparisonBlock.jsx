import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * ComparisonBlock — before/after comparison for profile review.
 */
export default function ComparisonBlock({ label, before, after, hasWarning }) {
  const { t } = useI18n();

  return (
    <div className="glass px-4 py-3">
      <p className="mb-2 text-[13px] font-bold text-ink font-bn">{t(label)}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-[11px] text-muted font-bn">{t('আগে')}</p>
          <div className="rounded-xl bg-border-rest/30 px-3 py-2">
            <p className="text-[13px] text-muted font-bn">{before || '—'}</p>
          </div>
        </div>
        <div>
          <p className="mb-1 text-[11px] text-muted font-bn">{t('পরে')}</p>
          <div className={cn('rounded-xl px-3 py-2', hasWarning ? 'bg-warn/10' : 'bg-success/10')}>
            <p className={cn('text-[13px] font-bn', hasWarning ? 'text-warn' : 'text-ink')}>
              {after || '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
