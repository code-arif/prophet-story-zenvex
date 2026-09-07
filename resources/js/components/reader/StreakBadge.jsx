import { Flame } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toBnDigits } from '../../lib/format';

/**
 * StreakBadge - Displays the current consecutive-day family reading streak.
 *
 * A small, non-intrusive badge showing the streak count. Intended to be
 * placed in the Library header or reader chrome without cluttering the
 * reading experience.
 *
 * @param {number} streak  Consecutive days (0 = no streak).
 * @param {'standard'|'kid'} variant
 * @param {string} className
 */
export default function StreakBadge({
  streak = 0,
  variant = 'standard',
  className,
}) {
  if (streak <= 0) {
    return null;
  }

  const isKid = variant === 'kid';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-black shadow-sm border',
        isKid
          ? 'bg-kid/10 text-kid border-kid/25'
          : 'bg-accent/10 text-accent border-accent/25',
        className,
      )}
    >
      <Flame
        className={cn(
          'size-4 shrink-0',
          streak >= 7 ? 'text-urgent animate-pulse' : '',
        )}
        strokeWidth={2.4}
      />
      <span>
        {toBnDigits(streak)} দিনের ধারাবাহিক পড়া
      </span>
    </div>
  );
}
