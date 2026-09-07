import { useState } from 'react';
import { Flame, Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toBnDigits } from '../../lib/format';

/**
 * LogTodayButton - Quick-action to log today's family reading session.
 *
 * A lightweight button that POSTs to /family-reading/log. After logging,
 * it shows a checkmark and the updated streak count. Idempotent — calling
 * multiple times in the same day does nothing extra.
 *
 * @param {{ streak: number, today_logged: boolean }} familyStreak
 * @param {'standard'|'kid'} variant
 * @param {number|null} chapterId  Current chapter (optional reference).
 * @param {string} className
 * @param {function} onLogged  Callback after successful log (receives new streak data).
 */
export default function LogTodayButton({
  familyStreak,
  variant = 'standard',
  chapterId = null,
  className,
  onLogged,
}) {
  const [logged, setLogged] = useState(familyStreak?.today_logged ?? false);
  const [streak, setStreak] = useState(familyStreak?.streak ?? 0);
  const [loading, setLoading] = useState(false);

  const isKid = variant === 'kid';

  const handleLog = async () => {
    if (logged || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/family-reading/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': decodeURIComponent(
            document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '',
          ),
        },
        body: JSON.stringify(
          chapterId ? { chapter_id: chapterId } : {},
        ),
      });

      if (res.ok) {
        const data = await res.json();
        setLogged(true);
        setStreak(data.streak ?? streak);
        onLogged?.(data);
      }
    } catch {
      // Silent fail — best-effort logging.
    } finally {
      setLoading(false);
    }
  };

  if (logged) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[13px] font-bold shadow-xs',
          isKid
            ? 'border-kid/25 bg-kid/10 text-kid'
            : 'border-success/25 bg-success/10 text-success',
          className,
        )}
      >
        <Check className="size-4 shrink-0" strokeWidth={2.8} />
        <span>আজকের পড়া লগ হয়েছে</span>
        {streak > 0 && (
          <>
            <span className={isKid ? 'text-kid/30' : 'text-success/30'}>|</span>
            <Flame className="size-3.5 shrink-0" strokeWidth={2.4} />
            <span className="font-black">{toBnDigits(streak)} দিন</span>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLog}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[13px] font-bold shadow-xs transition-all active:scale-[0.97] disabled:opacity-50 cursor-pointer',
        isKid
          ? 'border-kid/25 bg-kid/10 text-kid hover:bg-kid/20'
          : 'border-accent/25 bg-accent/10 text-accent hover:bg-accent/20',
        className,
      )}
    >
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" />
      ) : (
        <Flame className="size-4 shrink-0" strokeWidth={2.4} />
      )}
      <span>আজকের পড়া লগ করুন</span>
    </button>
  );
}
