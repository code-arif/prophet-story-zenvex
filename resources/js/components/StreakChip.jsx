import React from 'react';
import { cn } from '../lib/utils';
import { toBnDigits } from '../lib/format';
import { useI18n } from '../lib/i18n';

/** Streak chip: flame icon + "N দিন" (Stitch design). */
export function StreakChip({ days = 0, className }) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full bg-[#eaf0fc] px-3.5 text-[13px] font-bold text-learn-ink shadow-sm',
        className
      )}
    >
      <span
        className="material-symbols-outlined text-[18px] text-[#f5a524]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        whatshot
      </span>
      <span>{toBnDigits(days)} {t('দিন')}</span>
    </span>
  );
}
