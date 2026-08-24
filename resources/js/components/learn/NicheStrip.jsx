import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * NicheStrip — horizontal strip of saved niches.
 */
export default function NicheStrip({ niches = [] }) {
  const { t } = useI18n();

  if (!niches.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      {niches.map((n, i) => (
        <div key={i} className="glass-row shrink-0 px-3 py-2">
          <p className="text-[12px] font-semibold text-ink font-bn">{t(n.name)}</p>
          <p className="text-[11px] text-brand font-bold font-bn">{n.score}%</p>
        </div>
      ))}
    </div>
  );
}
