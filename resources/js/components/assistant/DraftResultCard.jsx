import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * DraftResultCard — AI draft result with copy action.
 */
export default function DraftResultCard({ draft, onCopy }) {
  const { t } = useI18n();

  if (!draft) return null;

  return (
    <div className="rounded-2xl bg-inset-violet px-4 py-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13px] font-bold text-ai font-bn">{t('AI খসড়া')}</p>
        <button
          onClick={onCopy}
          className="text-[12px] text-ai font-semibold font-bn active:scale-95"
        >
          {t('কপি করুন')}
        </button>
      </div>
      <p className="text-[14px] text-ink leading-relaxed font-bn whitespace-pre-wrap">{draft}</p>
    </div>
  );
}
