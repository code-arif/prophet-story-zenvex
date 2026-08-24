import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

const STATES = [
  { key: 'all', label: 'সব' },
  { key: 'prospect', label: 'সম্ভাবনা' },
  { key: 'applied', label: 'প্রস্তাব' },
  { key: 'active', label: 'চলছে' },
  { key: 'done', label: 'সম্পন্ন' },
];

export default function StateFilter({ value = 'all', onChange }) {
  const { t } = useI18n();

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      {STATES.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onChange?.(s.key)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 font-bn',
            value === s.key
              ? 'bg-brand text-white'
              : 'glass-row text-ink'
          )}
        >
          {t(s.label)}
        </button>
      ))}
    </div>
  );
}
