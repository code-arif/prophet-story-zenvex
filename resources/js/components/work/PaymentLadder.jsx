import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * PaymentLadder — expandable payment rows with status.
 */
export default function PaymentLadder({ payments = [] }) {
  const { t } = useI18n();

  if (!payments.length) {
    return (
      <div className="glass-row flex items-center gap-3 px-4 py-4">
        <p className="text-[14px] text-muted font-bn">{t('কোনো বকেয় নেই')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {payments.map((p, i) => (
        <div key={i} className="glass-row flex items-center gap-3 px-4 py-3">
          <div className={cn(
            'size-2.5 shrink-0 rounded-full',
            p.status === 'overdue' ? 'bg-warn' : p.status === 'paid' ? 'bg-success' : 'bg-brand'
          )} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink font-bn">{p.client}</p>
            <p className="text-[12px] text-muted font-bn">{p.deadline}</p>
          </div>
          <span className="text-[15px] font-bold text-ink font-bn">৳{p.amount}</span>
        </div>
      ))}
    </div>
  );
}
