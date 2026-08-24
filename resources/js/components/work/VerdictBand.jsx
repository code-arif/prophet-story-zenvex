import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * VerdictBand — shows green/amber/red verdict for client screener.
 */
export default function VerdictBand({ verdict = 'unknown', label }) {
  const { t } = useI18n();

  const config = {
    safe: { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success' },
    caution: { bg: 'bg-warn/10', border: 'border-warn/30', text: 'text-warn' },
    danger: { bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger' },
    unknown: { bg: 'bg-border-rest/30', border: 'border-border-rest', text: 'text-muted' },
  };

  const c = config[verdict] || config.unknown;

  return (
    <div className={cn('rounded-2xl border px-4 py-3', c.bg, c.border)}>
      <p className={cn('text-[14px] font-bold font-bn', c.text)}>
        {label || t(verdict === 'safe' ? 'নিরাপদ' : verdict === 'caution' ? 'সতর্ক' : verdict === 'danger' ? 'বিপদজনক' : 'অজানা')}
      </p>
    </div>
  );
}
