import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * SituationChip — chip for assistant situation selection.
 */
export default function SituationChip({ label, selected, onClick }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 font-bn',
        selected ? 'bg-ai text-white' : 'glass-row text-ink'
      )}
    >
      {t(label)}
    </button>
  );
}
