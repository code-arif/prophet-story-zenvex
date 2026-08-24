import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * ComparisonCard — side-by-side true hourly rate comparison.
 */
export default function ComparisonCard({ labelA, rateA, labelB, rateB }) {
  const { t } = useI18n();
  const diff = rateA - rateB;
  const isHigher = diff > 0;

  return (
    <div className="glass px-4 py-4">
      <p className="mb-3 text-[14px] font-bold text-ink font-bn">{t('তুলনা')}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-[12px] text-muted font-bn">{t(labelA)}</p>
          <p className="text-[24px] font-bold text-brand font-bn">৳{rateA}</p>
        </div>
        <div className="text-center">
          <p className="text-[12px] text-muted font-bn">{t(labelB)}</p>
          <p className="text-[24px] font-bold text-muted font-bn">৳{rateB}</p>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className={`text-[13px] font-bold font-bn ${isHigher ? 'text-success' : 'text-warn'}`}>
          {isHigher ? '+' : ''}{diff}৳ {t('পার্থক্য')}
        </span>
      </div>
    </div>
  );
}
