import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * MoneyAtStakeStrip — amber warning strip showing outstanding money.
 * Variant 'none' hides the component entirely.
 */
export default function MoneyAtStakeStrip({ amount, variant = 'warning' }) {
  const { t } = useI18n();

  if (variant === 'none' || !amount) return null;

  return (
    <div className={cn(
      'glass-row flex items-center gap-3 px-4 py-3',
      variant === 'overdue' && 'border border-warn/30'
    )}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warn/10 text-warn">
        <AlertTriangle className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-warn font-bn">
          {t('টাকা বাকি আছে')}
        </p>
        <p className="text-[12px] text-muted font-bn">
          {t('আজকের দায়')}
        </p>
      </div>
      <span className="text-[18px] font-bold text-warn font-bn">
        ৳{amount}
      </span>
    </div>
  );
}
