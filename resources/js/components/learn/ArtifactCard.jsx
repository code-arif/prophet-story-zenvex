import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * ArtifactCard — personal artifact (proposal, profile, portfolio item).
 */
export default function ArtifactCard({ title, subtitle, status = 'draft', href }) {
  const { t } = useI18n();
  const statusColors = {
    draft: 'bg-border-rest text-muted',
    active: 'bg-success text-white',
    review: 'bg-warn text-white',
  };

  return (
    <div className="glass-row flex items-center gap-3 px-4 py-3 transition-all active:scale-[0.98]">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink font-bn">{t(title)}</p>
        {subtitle && <p className="text-[12px] text-muted font-bn">{t(subtitle)}</p>}
      </div>
      <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold font-bn', statusColors[status])}>
        {t(status === 'draft' ? 'খসড়া' : status === 'active' ? 'সক্রিয়' : 'পর্যালোচনা')}
      </span>
    </div>
  );
}
