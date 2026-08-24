import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * LedgerRow — single income/expense row in ledger.
 */
export default function LedgerRow({ entry }) {
  const { t } = useI18n();
  const isExpense = entry.type === 'expense';

  return (
    <div className="glass-row flex items-center gap-3 px-4 py-3">
      <div className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-[14px]',
        isExpense ? 'bg-warn/10 text-warn' : 'bg-success/10 text-success'
      )}>
        {isExpense ? '−' : '+'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink truncate font-bn">{t(entry.label)}</p>
        <p className="text-[12px] text-muted font-bn">{entry.date}</p>
      </div>
      <span className={cn(
        'text-[15px] font-bold font-bn',
        isExpense ? 'text-warn' : 'text-success'
      )}>
        {isExpense ? '−' : '+'}৳{entry.amount}
      </span>
    </div>
  );
}
