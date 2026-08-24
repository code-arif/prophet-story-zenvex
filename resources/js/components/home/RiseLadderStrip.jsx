import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

/**
 * RiseLadderStrip — compact strip showing current ladder stage.
 * Links to full Rise Ladder screen.
 */
const STAGE_LABELS = {
  1: 'শুরু',
  2: 'প্রস্তুত',
  3: 'কাজ চলছে',
  4: 'ব্যবসা',
};

export default function RiseLadderStrip({ stage = 1 }) {
  const { t } = useI18n();

  return (
    <Link
      href="/home/ladder"
      className="glass-row flex items-center gap-3 px-4 py-3 transition-all active:scale-[0.98]"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
        <TrendingUp className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-ink font-bn">
          {t('রাইজ ল্যাডার')}
        </p>
        <p className="text-[12px] text-muted font-bn">
          {t('ধাপ')} {stage} — {STAGE_LABELS[stage] || ''}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {/* Mini step rail */}
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`size-2 rounded-full ${
              s <= stage ? 'bg-brand' : 'bg-border-rest'
            }`}
          />
        ))}
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted" />
    </Link>
  );
}
