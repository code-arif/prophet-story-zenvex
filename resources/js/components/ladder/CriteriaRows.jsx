import React from 'react';
import { Check, Circle } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * CriteriaRows — list of criteria for a ladder stage.
 * Each row shows met (green check) or unmet (hollow circle).
 */
export default function CriteriaRows({ criteria = [] }) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      {criteria.map((item, i) => (
        <div
          key={i}
          className={cn(
            'glass-row flex items-center gap-3 px-4 py-3',
            item.met && 'border border-success/20'
          )}
        >
          {item.met ? (
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <Check className="size-3.5" strokeWidth={3} />
            </div>
          ) : (
            <Circle className="size-6 shrink-0 text-outline-inactive" strokeWidth={2} />
          )}
          <div className="min-w-0 flex-1">
            <p className={cn(
              'text-[14px] font-semibold font-bn',
              item.met ? 'text-success' : 'text-ink'
            )}>
              {item.label}
            </p>
            {item.detail && (
              <p className="text-[12px] text-muted font-bn">{item.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
