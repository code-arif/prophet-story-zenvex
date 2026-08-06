import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { toBnDigits } from '../lib/format';
import { useI18n } from '../lib/i18n';

/** Streak chip: flame icon + "N দিন" on a light amber pill (Stitch design). */
export function StreakChip({ days = 0, className }) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        'inline-flex h-8 items-center gap-1 rounded-full bg-learn-warn-tint px-3 text-[13px] font-bold text-learn-warn',
        className
      )}
    >
      <Flame className="size-4" strokeWidth={2} />
      {toBnDigits(days)} {t('দিন')}
    </span>
  );
}
