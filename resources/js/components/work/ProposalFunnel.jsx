import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * ProposalFunnel — horizontal funnel showing sent → viewed → shortlisted → hired.
 */
export default function ProposalFunnel({ sent = 0, viewed = 0, shortlisted = 0, hired = 0 }) {
  const { t } = useI18n();
  const max = Math.max(sent, 1);

  const stages = [
    { label: 'পাঠানো', value: sent, pct: (sent / max) * 100 },
    { label: 'দেখা হয়েছে', value: viewed, pct: (viewed / max) * 100 },
    { label: 'ছোট তালিকা', value: shortlisted, pct: (shortlisted / max) * 100 },
    { label: 'নিয়োগ', value: hired, pct: (hired / max) * 100 },
  ];

  return (
    <div className="glass px-4 py-4">
      <p className="mb-3 text-[14px] font-bold text-ink font-bn">{t('প্রস্তাব ট্র্যাকার')}</p>
      <div className="space-y-3">
        {stages.map((s) => (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between text-[12px] font-bn">
              <span className="text-muted">{t(s.label)}</span>
              <span className="font-bold text-ink">{s.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border-rest">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
