import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, GraduationCap, Home as HomeIcon, Plane, Star, Search } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { ProgressBar } from '../../../components/ProgressBar';
import { buttonVariants } from '../../../components/ui/button';
import { useI18n } from '../../../lib/i18n';

const DECK_ICONS = {
  home: HomeIcon,
  briefcase: Briefcase,
  graduation: GraduationCap,
  plane: Plane,
  star: Star,
};

/**
 * Screen 13 — শব্দভাণ্ডার / Vocabulary Decks (Stitch, feature 2).
 * Hero due-count card + 2-col deck grid. Data comes from the backend.
 */
export default function Vocabulary({ due = 12, decks = [] }) {
  const { t } = useI18n();
  return (
    <LearnerShell
      title={t('শব্দভাণ্ডার')}
      showBack
      right={
        <button type="button" aria-label={t('খুঁজুন')} className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <Search className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-5">
        <Head title={t('শব্দভাণ্ডার')} />
        {/* Hero due card */}
        <section className="rounded-[14px] border-l-[3px] border-learn-primary bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <h2 className="text-[15px] font-bold text-learn-ink">{t('আজ পুনরাবৃত্তির জন্য প্রস্তুত')}</h2>
          <p className="mt-1">
            <span className="text-[40px] font-bold leading-none text-learn-primary">{toBnDigits(due)}</span>{' '}
            <span className="text-[15px] font-semibold text-learn-muted">{t('টি কার্ড')}</span>
          </p>
          <p className="mt-1 text-[13px] text-learn-muted">{t('সময়মতো দেখলে শব্দ বেশিদিন মনে থাকে')}</p>
          <Link href="/learn/vocabulary/review" className={cn(buttonVariants({ size: 'learner' }), 'mt-3')}>
            {t('পুনরাবৃত্তি শুরু করুন')}
          </Link>
        </section>

        {/* Decks */}
        <section>
          <h2 className="text-[16px] font-semibold text-learn-ink">{t('ডেক')}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {decks.length === 0 ? (
              <p className="col-span-2 rounded-[14px] bg-white p-4 text-center text-[13px] text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                {t('কোনো ডেক নেই')}
              </p>
            ) : (
              decks.map((deck) => <DeckCard key={deck.name} deck={deck} />)
            )}
          </div>
        </section>
      </div>
    </LearnerShell>
  );
}

function DeckCard({ deck }) {
  const { t } = useI18n();
  const Icon = DECK_ICONS[deck.iconKey] || HomeIcon;
  return (
    <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
      <span className={cn('flex size-9 items-center justify-center rounded-lg', deck.tintClass)}>
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <p className="mt-2 text-[14px] font-bold text-learn-ink">{deck.name}</p>
      {deck.footnote ? (
        <p className="mt-0.5 text-[13px] text-learn-muted">{deck.footnote}</p>
      ) : (
        <>
          <p className="mt-0.5 text-[13px] text-learn-muted">{t('{n}টি শব্দ', { n: toBnDigits(deck.words) })}</p>
          <ProgressBar value={deck.progress || 0} className="mt-2" />
        </>
      )}
    </div>
  );
}
