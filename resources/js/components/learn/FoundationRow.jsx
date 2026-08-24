import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * FoundationRow — single foundation skill row with label and score.
 */
export default function FoundationRow({ label, score, max = 100 }) {
  const { t } = useI18n();
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;

  return (
    <div className="glass-row flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink font-bn">{t(label)}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="h-2 overflow-hidden rounded-full bg-border-rest">
            <div
              className={cn('h-full rounded-full', pct >= 70 ? 'bg-success' : pct >= 40 ? 'bg-brand' : 'bg-warn')}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span className="text-[13px] font-bold text-ink font-bn w-8 text-right">{score}%</span>
      </div>
    </div>
  );
}
