import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Check, Flame, Share2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 29 — অগ্রগতি ড্যাশবোর্ড / Progress Dashboard (Stitch, feature 11).
 * Four-skill bars, streak calendar, weekly minutes chart and the weakest-skill
 * suggestion. UI-phase demo data; bars/streak come from backend later.
 */
export default function Progress() {
  const [range, setRange] = React.useState('week');

  return (
    <LearnerShell
      showBack
      activeTab="profile"
      title="অগ্রগতি"
      right={
        <button type="button" aria-label="শেয়ার করুন" className="flex size-10 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <Share2 className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title="অগ্রগতি" />

        <SegmentedControl
          value={range}
          onChange={setRange}
          options={[
            { label: 'সপ্তাহ', value: 'week' },
            { label: 'মাস', value: 'month' },
            { label: 'সব সময়', value: 'all' },
          ]}
        />

        {/* Four skills */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="mb-3 text-[14px] font-semibold text-learn-ink">চার দক্ষতা</p>
          <div className="space-y-3">
            {SKILL_BASE[range].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-learn-ink">{s.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold text-learn-ink">{toBnDigits(s.value)}%</span>
                    <span
                      className={cn(
                        'rounded px-1 py-0.5 text-[11px] font-bold',
                        s.delta >= 0 ? 'bg-learn-success-tint text-learn-success' : 'bg-learn-danger-tint text-learn-danger'
                      )}
                    >
                      {s.delta >= 0 ? '+' : ''}{toBnDigits(s.delta)}
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-learn-structure">
                  <div className={cn('h-full rounded-full', s.tone)} style={{ width: `${s.value}%` }} />
                </div>
                {s.weakest && (
                  <span className="mt-1 inline-block rounded-full bg-learn-warn-tint px-2 py-0.5 text-[11px] font-bold text-learn-warn">
                    দুর্বলতম
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Streak calendar */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="flex items-center gap-2 text-[14px] font-semibold text-learn-ink">
            <Flame className="size-5 fill-learn-warn text-learn-warn" strokeWidth={2} />
            ৭ দিনের স্ট্রিক
          </p>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {WEEK.map((d, i) => (
              <div key={d.label} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full',
                    d.done && 'bg-learn-success text-white',
                    d.today && !d.done && 'bg-white ring-2 ring-learn-primary',
                    !d.done && !d.today && 'bg-learn-structure'
                  )}
                >
                  {d.done && <Check className="size-4" strokeWidth={3} />}
                </span>
                <span className="text-[11px] text-learn-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly minutes */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="mb-4 text-[14px] font-semibold text-learn-ink">সাপ্তাহিক সময়</p>
          <div className="flex h-32 items-end justify-between gap-2">
            {WEEKLY.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={cn('w-full max-w-[22px] rounded-t-md', d.active ? 'bg-learn-primary' : 'bg-learn-primary/30')}
                  style={{ height: `${(d.min / 30) * 96}px` }}
                />
                <span className="text-[10px] text-learn-muted">{d.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[13px] text-learn-muted">এই সপ্তাহে {toBnDigits(145)} মিনিট</p>
        </div>

        {/* Next step */}
        <div className="rounded-[14px] border-l-[3px] border-learn-warn bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="text-[14px] font-bold text-learn-ink">পরবর্তী পদক্ষেপ</p>
          <p className="mt-1 text-[13px] leading-relaxed text-learn-muted">
            বলা দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট উচ্চারণ স্টুডিওতে সময় দিন
          </p>
          <Link href="/practice/pronunciation" className={cn(buttonVariants({ size: 'sm' }), 'mt-3 w-full')}>
            শুরু করুন
          </Link>
        </div>

        <p className="text-center text-[12px] text-learn-muted">সব হিসাব আপনার ডিভাইসেই থাকে</p>
      </div>
    </LearnerShell>
  );
}

const SKILL_BASE = {
  week: [
    { label: 'পড়া', value: 72, delta: 5, tone: 'bg-learn-primary' },
    { label: 'শোনা', value: 61, delta: 3, tone: 'bg-learn-primary' },
    { label: 'লেখা', value: 54, delta: 1, tone: 'bg-learn-primary' },
    { label: 'বলা', value: 43, delta: 8, tone: 'bg-learn-warn', weakest: true },
  ],
  month: [
    { label: 'পড়া', value: 65, delta: 4, tone: 'bg-learn-primary' },
    { label: 'শোনা', value: 58, delta: -2, tone: 'bg-learn-primary' },
    { label: 'লেখা', value: 49, delta: 3, tone: 'bg-learn-primary' },
    { label: 'বলা', value: 40, delta: 6, tone: 'bg-learn-warn', weakest: true },
  ],
  all: [
    { label: 'পড়া', value: 60, delta: 2, tone: 'bg-learn-primary' },
    { label: 'শোনা', value: 52, delta: 1, tone: 'bg-learn-primary' },
    { label: 'লেখা', value: 45, delta: -1, tone: 'bg-learn-primary' },
    { label: 'বলা', value: 38, delta: 4, tone: 'bg-learn-warn', weakest: true },
  ],
};

const WEEK = [
  { label: 'শ', done: true },
  { label: 'র', done: true },
  { label: 'সো', done: true },
  { label: 'ম', done: true },
  { label: 'বু', done: true },
  { label: 'বৃ', done: false, today: true },
  { label: 'শু', done: false },
];

const WEEKLY = [
  { day: 'শ', min: 18 },
  { day: 'র', min: 26 },
  { day: 'সো', min: 22 },
  { day: 'ম', min: 30 },
  { day: 'বু', min: 24 },
  { day: 'বৃ', min: 16, active: true },
  { day: 'শু', min: 9 },
];
