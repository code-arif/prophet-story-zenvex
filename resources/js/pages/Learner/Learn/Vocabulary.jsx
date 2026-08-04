import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, GraduationCap, Home as HomeIcon, Plane, Star, Search } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { ProgressBar } from '../../../components/ProgressBar';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 13 — শব্দভাণ্ডার / Vocabulary Decks (Stitch, feature 2).
 * Hero due-count card + 2-col deck grid.
 */
export default function Vocabulary({ due = 12 }) {
  return (
    <LearnerShell
      title="শব্দভাণ্ডার"
      showBack
      right={
        <button type="button" aria-label="খুঁজুন" className="flex size-10 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <Search className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-5">
        <Head title="শব্দভাণ্ডার" />
        {/* Hero due card */}
        <section className="rounded-[14px] border-l-[3px] border-learn-primary bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <h2 className="text-[15px] font-bold text-learn-ink">আজ পুনরাবৃত্তির জন্য প্রস্তুত</h2>
          <p className="mt-1">
            <span className="text-[40px] font-bold leading-none text-learn-primary">{toBnDigits(due)}</span>{' '}
            <span className="text-[15px] font-semibold text-learn-muted">টি কার্ড</span>
          </p>
          <p className="mt-1 text-[13px] text-learn-muted">সময়মতো দেখলে শব্দ বেশিদিন মনে থাকে</p>
          <Link href="/learn/vocabulary/review" className={cn(buttonVariants({ size: 'learner' }), 'mt-3')}>
            পুনরাবৃত্তি শুরু করুন
          </Link>
        </section>

        {/* Decks */}
        <section>
          <h2 className="text-[16px] font-semibold text-learn-ink">ডেক</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {DECKS.map((deck) => (
              <DeckCard key={deck.name} deck={deck} />
            ))}
          </div>
        </section>
      </div>
    </LearnerShell>
  );
}

function DeckCard({ deck }) {
  return (
    <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
      <span className={cn('flex size-9 items-center justify-center rounded-lg', deck.tintClass)}>
        <deck.Icon className="size-5" strokeWidth={2} />
      </span>
      <p className="mt-2 text-[14px] font-bold text-learn-ink">{deck.name}</p>
      {typeof deck.progress === 'number' ? (
        <>
          <p className="mt-0.5 text-[12px] text-learn-muted">{toBnDigits(deck.words)}টি শব্দ</p>
          <ProgressBar value={deck.progress} className="mt-2" />
        </>
      ) : (
        <p className="mt-0.5 text-[12px] text-learn-muted">{deck.footnote}</p>
      )}
    </div>
  );
}

const DECKS = [
  { name: 'দৈনন্দিন জীবন', words: 85, progress: 60, Icon: HomeIcon, tintClass: 'bg-learn-primary-tint text-learn-primary' },
  { name: 'চাকরির ইন্টারভিউ', words: 64, progress: 25, Icon: Briefcase, tintClass: 'bg-[#EEF1FF] text-[#6366F1]' },
  { name: 'একাডেমিক শব্দ', words: 120, progress: 10, Icon: GraduationCap, tintClass: 'bg-[#DDF3EC] text-[#0D9488]' },
  { name: 'ভ্রমণ ও বিমানবন্দর', words: 48, footnote: 'শুরু করেননি', Icon: Plane, tintClass: 'bg-learn-warn-tint text-learn-warn' },
  { name: 'আমার সংরক্ষিত শব্দ', words: 23, footnote: '★ সংরক্ষিত', Icon: Star, tintClass: 'bg-learn-ai-tint text-learn-ai' },
];
