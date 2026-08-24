import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * ResultCard — shows a computed result with label and value.
 */
export default function ResultCard({ label, value, sub, variant = 'default' }) {
  const { t } = useI18n();
  const colors = {
    default: 'text-ink',
    success: 'text-success',
    warn: 'text-warn',
    brand: 'text-brand',
  };

  return (
    <div className="glass flex flex-col items-center px-4 py-4">
      <p className="text-[12px] text-muted font-bn">{t(label)}</p>
      <p className={`text-[24px] font-bold font-bn ${colors[variant] || 'text-ink'}`}>{value}</p>
      {sub && <p className="text-[12px] text-muted font-bn">{t(sub)}</p>}
    </div>
  );
}
