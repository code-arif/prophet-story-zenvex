import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * IncomeChart — 12-column monthly income bar chart.
 * Each bar represents a month; current month highlighted.
 */
export default function IncomeChart({ months = [], currentMonth = 0 }) {
  const { t } = useI18n();
  const max = Math.max(...months.map((m) => m.amount), 1);

  return (
    <div className="glass px-4 py-4">
      <p className="mb-3 text-[14px] font-bold text-ink font-bn">{t('মাসিক আয়')}</p>
      <div className="flex items-end gap-1.5" style={{ height: 120 }}>
        {months.map((m, i) => {
          const h = max > 0 ? (m.amount / max) * 100 : 0;
          const isCurrent = i === currentMonth;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  'w-full rounded-t-md transition-all',
                  isCurrent ? 'bg-brand' : m.amount === 0 ? 'bg-border-rest' : 'bg-brand/30'
                )}
                style={{ height: `${Math.max(h, 4)}%` }}
              />
              <span className={cn(
                'text-[9px] font-bn',
                isCurrent ? 'font-bold text-brand' : 'text-muted'
              )}>
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
