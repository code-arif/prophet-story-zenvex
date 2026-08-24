import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * PlanTask — single task in 90-day plan.
 */
export default function PlanTask({ task, day }) {
  const { t } = useI18n();

  return (
    <div className="glass-row flex items-center gap-3 px-4 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
        {day}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink font-bn">{t(task.title)}</p>
        {task.detail && <p className="text-[12px] text-muted font-bn">{t(task.detail)}</p>}
      </div>
    </div>
  );
}
