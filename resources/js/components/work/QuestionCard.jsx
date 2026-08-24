import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * QuestionCard — screener question with yes/no toggle.
 */
export default function QuestionCard({ question, value, onChange, index }) {
  const { t } = useI18n();

  return (
    <div className="glass-row px-4 py-3">
      <div className="mb-2 flex items-start gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
          {index + 1}
        </span>
        <p className="text-[14px] font-semibold text-ink font-bn">{t(question)}</p>
      </div>
      <div className="flex gap-2 pl-8">
        <button
          type="button"
          onClick={() => onChange?.(true)}
          className={cn(
            'flex-1 rounded-full py-2 text-[13px] font-bold transition-all active:scale-95 font-bn',
            value === true ? 'bg-success text-white' : 'glass-row text-ink'
          )}
        >
          {t('হ্যাঁ')}
        </button>
        <button
          type="button"
          onClick={() => onChange?.(false)}
          className={cn(
            'flex-1 rounded-full py-2 text-[13px] font-bold transition-all active:scale-95 font-bn',
            value === false ? 'bg-warn text-white' : 'glass-row text-ink'
          )}
        >
          {t('না')}
        </button>
      </div>
    </div>
  );
}
