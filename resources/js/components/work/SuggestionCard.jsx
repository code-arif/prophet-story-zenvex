import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * SuggestionCard — capacity suggestion with icon, text, and optional CTA.
 */
export default function SuggestionCard({ icon, text, cta }) {
  const { t } = useI18n();

  return (
    <div className="glass-row flex items-center gap-3 px-4 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
        {icon}
      </div>
      <p className="flex-1 text-[13px] text-ink font-bn">{t(text)}</p>
      {cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-[12px] font-bold text-white active:scale-95 font-bn"
        >
          {t(cta.label)}
        </button>
      )}
    </div>
  );
}
