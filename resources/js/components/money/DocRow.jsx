import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * DocRow — single document readiness row.
 */
export default function DocRow({ doc }) {
  const { t } = useI18n();
  const isExpired = doc.status === 'expired';
  const isReady = doc.status === 'ready';

  return (
    <div className={cn(
      'glass-row flex items-center gap-3 px-4 py-3',
      isExpired && 'border border-warn/30'
    )}>
      <div className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
        isReady ? 'bg-success text-white' : isExpired ? 'bg-warn text-white' : 'bg-border-rest text-muted'
      )}>
        {isReady ? '✓' : isExpired ? '!' : '?'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink font-bn">{t(doc.name)}</p>
        {doc.expiry && (
          <p className={cn('text-[12px] font-bn', isExpired ? 'text-warn' : 'text-muted')}>
            {t('মেয়াদ')}: {doc.expiry}
          </p>
        )}
      </div>
    </div>
  );
}
