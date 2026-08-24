import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * MonthHeader — collapsible month header for ledger.
 */
export default function MonthHeader({ month, total, expanded, onToggle }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onToggle}
      className="glass-row flex w-full items-center justify-between px-4 py-3 active:scale-[0.98]"
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          'text-[13px] transition-transform',
          expanded ? 'rotate-90' : ''
        )}>▶</span>
        <span className="text-[14px] font-bold text-ink font-bn">{t(month)}</span>
      </div>
      <span className="text-[14px] font-bold text-brand font-bn">৳{total}</span>
    </button>
  );
}
