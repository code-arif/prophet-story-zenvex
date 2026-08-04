import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { X, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { buttonVariants } from '../../../components/ui/button';
import { StatusChip } from '../../../components/StatusChip';
import { toBnDigits } from '../../../lib/format';
import {
  levelLabel,
  SKILL_ORDER,
  SKILL_LABELS,
  skillPercent,
  weakestSkill,
} from './placementLogic';

/**
 * Screen 06 — আপনার লেভেল / Placement Result (Stitch, features 15 + 11).
 * Hero level badge, per-skill bars with the weakest-skill amber tag, and the
 * violet AI study-plan card. NO bottom navigation.
 *
 * Props come from the server later; until then the component renders demo
 * values (A2, 8/15) so the screen is fully presentable.
 */
export default function PlacementResult({
  score = 8,
  total = 15,
  level = 'A2',
  bySkill = DEMO_BY_SKILL,
}) {
  const weakest = weakestSkill(bySkill);

  return (
    <div className="min-h-screen bg-learn-bg font-learn-bn text-learn-ink flex flex-col max-w-[390px] mx-auto relative overflow-x-hidden">
      <Head title="আপনার লেভেল" />

      {/* Close X top right */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-end px-5">
        <button
          type="button"
          aria-label="Close"
          onClick={() => window.history.back()}
          className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
        >
          <X className="size-6" strokeWidth={2} />
        </button>
      </header>

      <main className="flex-1 px-5 pb-10">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <div
            className="flex size-[140px] items-center justify-center rounded-full text-white"
            style={{ background: 'linear-gradient(135deg, #2B59C3 0%, #1E3F8F 100%)' }}
          >
            <span className="text-[44px] font-bold leading-none">{level}</span>
          </div>
          <h1 className="mt-5 text-[20px] font-bold">
            আপনার লেভেল — {levelLabel(level)} ({level})
          </h1>
          <p className="mt-1 text-[13px] text-learn-muted">
            {toBnDigits(total)}টির মধ্যে {toBnDigits(score)}টি সঠিক
          </p>
        </div>

        {/* Skill breakdown */}
        <section className="mt-7 rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <h2 className="text-[15px] font-bold">দক্ষতা অনুযায়ী ফল</h2>
          <div className="mt-4 space-y-3.5">
            {SKILL_ORDER.map((skill) => {
              const pct = skillPercent(bySkill, skill);
              const isWeakest = skill === weakest;
              return (
                <div key={skill} className="flex items-center gap-3">
                  <span className="w-8 shrink-0 text-[13px] font-medium text-learn-muted">
                    {SKILL_LABELS[skill]}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-learn-primary-tint">
                    <div
                      className={cn('h-full rounded-full', isWeakest ? 'bg-learn-warn' : 'bg-learn-primary')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={cn('w-10 shrink-0 text-right text-[13px] font-bold', isWeakest ? 'text-learn-warn' : 'text-learn-ink')}>
                    {toBnDigits(pct)}%
                  </span>
                  {isWeakest && (
                    <span className="shrink-0 rounded-full bg-learn-warn-tint px-2 py-0.5 text-[11px] font-bold text-learn-warn">
                      সবচেয়ে দুর্বল
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* AI study plan card (violet = AI only) */}
        <section className="mt-4 rounded-[14px] border-l-[3px] border-learn-ai bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <StatusChip tone="violet" icon={<Sparkles className="size-3.5" />}>AI</StatusChip>
          <h2 className="mt-2 text-[15px] font-bold">৩০ দিনের পরিকল্পনা তৈরি করুন</h2>
          <p className="mt-1 text-[13px] text-learn-muted">একবার তৈরি হলে ইন্টারনেট ছাড়াই চলবে</p>
          <Link href="/profile/study-plan" className={cn(buttonVariants({ variant: 'outlineViolet', size: 'learner' }), 'mt-3')}>
            পরিকল্পনা তৈরি করুন
          </Link>
        </section>
      </main>

      {/* Primary action */}
      <div className="px-5 pb-8">
        <Link href="/home" className={cn(buttonVariants({ size: 'learner' }))}>
          শেখা শুরু করুন
        </Link>
      </div>
    </div>
  );
}

// Demo breakdown until the backend provides real per-skill results.
// Speaking ends weakest via the tie-break rule (40% tied with writing).
const DEMO_BY_SKILL = {
  reading: { correct: 3, total: 5 },
  listening: { correct: 1, total: 2 },
  writing: { correct: 2, total: 5 },
  speaking: { correct: 2, total: 5 },
};
