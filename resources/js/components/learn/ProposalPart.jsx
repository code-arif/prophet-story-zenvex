import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * ProposalPart — single part of proposal structure with sample.
 */
export default function ProposalPart({ part, sample, index }) {
  const { t } = useI18n();

  return (
    <div className="glass-row px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
          {index + 1}
        </span>
        <p className="text-[14px] font-semibold text-ink font-bn">{t(part)}</p>
      </div>
      {sample && (
        <div className="ml-8 rounded-xl bg-inset-blue px-3 py-2">
          <p className="text-[13px] text-muted italic font-latin">{sample}</p>
        </div>
      )}
    </div>
  );
}
