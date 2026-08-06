import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, GraduationCap, Home as HomeIcon, Plane, Star, Search, ChevronRight, Play, Languages } from 'lucide-react';
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
export default function Vocabulary({ due = 12, decks = [], savedWordsCount = 23 }) {
  const { t } = useI18n();

  return (
    <LearnerShell
      title={t('শব্দভাণ্ডার')}
      showBack
      onBack={() => router.visit('/learn')}
      right={
        <button type="button" aria-label={t('খুঁজুন')} className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <Search className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-5 pb-6">
        <Head title={t('শব্দভাণ্ডার')} />
        
        {/* Hero due card */}
        <section className="rounded-[20px] border-l-[4px] border-learn-primary bg-white p-5 shadow-sm">
          <h2 className="text-[15px] font-bold text-learn-ink">{t('আজ পুনরাবৃত্তির জন্য প্রস্তুত')}</h2>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-[48px] font-extrabold leading-none text-learn-primary">{toBnDigits(due)}</span>
            <span className="text-[15px] font-semibold text-learn-muted">{t('টি কার্ড')}</span>
          </div>
          <p className="mt-2 text-[13px] text-learn-muted">{t('সময়মতো দেখলে শব্দ বেশিদিন মনে থাকে')}</p>
          
          <Link 
            href="/learn/vocabulary/review" 
            className="flex w-full h-12 items-center justify-center gap-1.5 rounded-[14px] bg-[#2b59c3] text-white font-bold text-[14px] transition-transform active:scale-[0.98] mt-4 shadow-sm"
          >
            {t('পুনরাবৃত্তি শুরু করুন')}
            <Play className="size-3.5 fill-current" />
          </Link>
        </section>

        {/* Decks */}
        <section>
          <h2 className="text-[16px] font-bold text-learn-ink mb-3">{t('ডেক')}</h2>
          <div className="grid grid-cols-2 gap-3.5">
            {decks.length === 0 ? (
              <p className="col-span-2 rounded-[20px] bg-white p-5 text-center text-[13px] text-learn-muted shadow-sm border border-black/5">
                {t('কোনো ডেক নেই')}
              </p>
            ) : (
              decks.map((deck) => <DeckCard key={deck.name} deck={deck} />)
            )}
          </div>
        </section>

        {/* Saved Words Card */}
        <Link 
          href="/learn/vocabulary/review?saved=true" 
          className="rounded-[20px] bg-white p-4 border border-black/5 shadow-sm flex items-center justify-between active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E5E0FF] text-[#6366F1]">
              <Star className="size-5 fill-current" />
            </span>
            <div>
              <span className="block text-[15px] font-bold text-learn-ink leading-tight">
                {t('আমার সংরক্ষিত শব্দ')}
              </span>
              <span className="block text-[13px] text-learn-muted mt-0.5">
                {t('{n}টি শব্দ', { n: toBnDigits(savedWordsCount) })}
              </span>
            </div>
          </div>
          <ChevronRight className="size-5 text-learn-muted shrink-0" />
        </Link>

        {/* Bottom promo banner */}
        <div className="rounded-[20px] bg-[#EEF2FC]/80 p-5 relative overflow-hidden mt-6">
          {/* Background watermark */}
          <Languages className="absolute right-[-10px] bottom-[-10px] size-24 text-learn-primary/10 pointer-events-none" />

          <div className="relative z-10 max-w-[85%]">
            <h3 className="text-[14px] font-bold text-learn-primary">{t('শব্দ শিখুন সহজে')}</h3>
            <p className="mt-1 text-[13px] text-learn-ink font-medium leading-relaxed">
              {t('প্রতিদিন নতুন ১০টি শব্দ আপনার ভোকাবুলারিকে করবে আরও শক্তিশালী।')}
            </p>
          </div>
        </div>
      </div>
    </LearnerShell>
  );
}

function DeckCard({ deck }) {
  const { t } = useI18n();
  const Icon = DECK_ICONS[deck.iconKey] || HomeIcon;

  return (
    <div className="rounded-[20px] bg-white p-5 border border-black/5 shadow-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FC] text-learn-primary">
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <p className="mt-3 text-[15px] font-bold text-learn-ink leading-tight">{deck.name}</p>
      <p className="mt-1 text-[13px] text-learn-muted">
        {t('{n}টি শব্দ', { n: toBnDigits(deck.words) })}
      </p>

      <div className="mt-3">
        <ProgressBar value={deck.progress || 0} className="h-1.5 bg-[#EAEAEA] rounded-full" />
        <p className={cn("mt-1.5 text-right text-[11px] font-bold", deck.progress && deck.progress > 0 ? "text-learn-primary" : "text-learn-muted")}>
          {deck.progress && deck.progress > 0 ? `${toBnDigits(deck.progress)}%` : t('শুরু করেননি')}
        </p>
      </div>
    </div>
  );
}
