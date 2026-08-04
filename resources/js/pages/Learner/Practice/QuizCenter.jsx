import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, History, Timer } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 24 — কুইজ ও টেস্ট সেন্টার / Quiz & Test Center (Stitch, feature 8).
 * Quick quiz, topic test, and timed level test entry points plus recent
 * results. UI-phase demo data; quizzes start below (screen 25).
 */
export default function QuizCenter() {
  const [topic, setTopic] = React.useState('Tense');
  return (
    <LearnerShell
      showBack
      activeTab="practice"
      title="কুইজ ও টেস্ট সেন্টার"
      right={
        <button type="button" aria-label="ইতিহাস" className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <History className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title="কুইজ ও টেস্ট সেন্টার" />

        {/* Quick quiz */}
        <div className="rounded-[14px] border-l-[3px] border-learn-primary bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="text-[16px] font-bold text-learn-ink">কুইক কুইজ</p>
          <p className="mt-0.5 text-[13px] text-learn-muted">১০টি প্রশ্ন · ৩ মিনিট · মিশ্র বিষয়</p>
          <Link href="/practice/quiz/session" className={cn(buttonVariants({ size: 'sm' }), 'mt-3 w-full')}>
            শুরু করুন
          </Link>
        </div>

        {/* Topic test */}
        <div className="rounded-[14px] border-l-[3px] border-learn-indigo bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="text-[16px] font-bold text-learn-ink">টপিক টেস্ট</p>
          <p className="mt-0.5 text-[13px] text-learn-muted">২০টি প্রশ্ন · নির্দিষ্ট বিষয়ে</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {['Tense', 'Article', 'Preposition', 'Vocabulary'].map((t) => (
              <Chip key={t} selected={topic === t} onClick={() => setTopic(t)}>{t}</Chip>
            ))}
          </div>
          <Link href="/practice/quiz/session" className={cn(buttonVariants({ variant: 'outlineBlue', size: 'sm' }), 'mt-3 w-full')}>
            বিষয় বেছে শুরু করুন
          </Link>
        </div>

        {/* Level test */}
        <div className="rounded-[14px] border-l-[3px] border-learn-warn bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[16px] font-bold text-learn-ink">লেভেল টেস্ট</p>
              <p className="mt-0.5 text-[13px] text-learn-muted">৩০টি প্রশ্ন · সময় বাঁধা ২০ মিনিট</p>
            </div>              <span className="flex shrink-0 items-center gap-1 rounded-full bg-learn-warn-tint px-2 py-0.5 text-[13px] font-bold text-learn-warn">
              <Timer className="size-3" strokeWidth={2} />
              লেভেল বদলাতে পারে
            </span>
          </div>
          <Link href="/practice/quiz/session" className={cn(buttonVariants({ variant: 'outlineBlue', size: 'sm' }), 'mt-3 w-full')}>
            পরীক্ষা দিন
          </Link>
        </div>

        {/* Recent results */}
        <div>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">সাম্প্রতিক ফল</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            {RESULTS.map((r, i) => (
              <div
                key={r.name}
                className={cn('flex items-center gap-3 px-4 py-3.5', i > 0 && 'border-t border-learn-structure')}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-learn-ink">{r.name}</p>
                  <p className="text-[13px] text-learn-muted">{r.date}</p>
                </div>
                <span className={cn('rounded-full px-2.5 py-1 text-[13px] font-bold', r.pillClass)}>
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LearnerShell>
  );
}

const RESULTS = [
  { name: 'কুইক কুইজ — মিশ্র', date: 'গতকাল', score: '৮/১০', pillClass: 'bg-learn-success-tint text-learn-success' },
  { name: 'টপিক টেস্ট — Article', date: '৩ দিন আগে', score: '১২/২০', pillClass: 'bg-learn-warn-tint text-learn-warn' },
  { name: 'কুইক কুইজ — Tense', date: '৫ দিন আগে', score: '৫/১০', pillClass: 'bg-learn-danger-tint text-learn-danger' },
];
