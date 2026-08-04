import React from 'react';
import { Head } from '@inertiajs/react';
import { CalendarDays, Check, ChevronRight, Sparkles, WifiOff } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { StatusChip } from '../../../components/StatusChip';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 30 — AI স্টাডি প্ল্যান / AI Study Plan (Stitch, feature 9).
 * Setup state (level/goal/time) then the 30-day plan view with today's
 * checkable items and upcoming days. UI-phase demo; violet = AI surface.
 */
export default function StudyPlan() {
  const [planReady, setPlanReady] = React.useState(false);
  const [done, setDone] = React.useState(new Set([0, 1])); // today's items

  const toggle = (i) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <LearnerShell
      showBack
      activeTab="profile"
      title={
        <span className="inline-flex items-center gap-1.5">
          AI স্টাডি প্ল্যান
          <StatusChip tone="violet" icon={<Sparkles className="size-3" />}>AI</StatusChip>
        </span>
      }
      right={
        planReady ? (
          <button
            type="button"
            onClick={() => setPlanReady(false)}
            className="flex size-10 shrink-0 items-center rounded-full px-2 text-[13px] font-bold text-learn-ai transition-colors hover:bg-learn-ai-tint active:scale-95"
          >
            আবার তৈরি করুন
          </button>
        ) : undefined
      }
    >
      <div className="mt-2 space-y-4">
        <Head title="AI স্টাডি প্ল্যান" />

        {!planReady ? (
          <SetupView onCreate={() => setPlanReady(true)} />
        ) : (
          <PlanView done={done} onToggle={toggle} />
        )}
      </div>
    </LearnerShell>
  );
}

function SetupView({ onCreate }) {
  const rows = [
    { label: 'লেভেল', value: 'A2', options: ['A1', 'A2', 'B1'] },
    { label: 'লক্ষ্য', value: 'চাকরি', options: ['চাকরি', 'পরীক্ষা', 'বিদেশ যাত্রা', 'সাধারণ উন্নতি'] },
    { label: 'দৈনিক সময়', value: '২০ মিনিট', options: ['১০ মিনিট', '২০ মিনিট', '৩০ মিনিট', '৬০ মিনিট'] },
  ];
  const [values, setValues] = React.useState({ লেভেল: 'A2', লক্ষ্য: 'চাকরি', 'দৈনিক সময়': '২০ মিনিট' });
  const [open, setOpen] = React.useState(null);

  return (
    <>
      <div className="flex flex-col items-center pt-2 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-learn-ai-tint text-learn-ai">
          <CalendarDays className="size-11" strokeWidth={1.75} />
        </div>
        <h1 className="mt-4 text-[20px] font-bold text-learn-ink">৩০ দিনের পরিকল্পনা তৈরি করুন</h1>
        <p className="mt-1 text-[13px] text-learn-muted">একবার তৈরি হলে ইন্টারনেট ছাড়াই পুরো মাস চলবে</p>
      </div>

      <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
        {rows.map((r, i) => (
          <div key={r.label} className={cn(i > 0 && 'border-t border-learn-structure')}>
            <button
              type="button"
              onClick={() => setOpen(open === r.label ? null : r.label)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5"
              aria-expanded={open === r.label}
            >
              <span className="text-[14px] font-medium text-learn-ink">{r.label}</span>
              <span className="flex items-center gap-1">
                <span className="rounded-full bg-learn-bg px-3 py-1 text-[13px] font-semibold text-learn-ink">{values[r.label]}</span>
                <ChevronRight
                  className={cn('size-4 text-learn-muted transition-transform', open === r.label && 'rotate-90')}
                  strokeWidth={2}
                />
              </span>
            </button>
            {open === r.label && (
              <div className="flex flex-wrap gap-2 px-4 pb-3.5">
                {r.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setValues((v) => ({ ...v, [r.label]: opt }));
                      setOpen(null);
                    }}
                    className={cn(
                      'h-9 rounded-full px-3.5 text-[13px] font-semibold transition-colors',
                      values[r.label] === opt ? 'bg-learn-primary text-white' : 'bg-learn-bg text-learn-ink'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-[14px] bg-learn-warn-tint px-4 py-3 text-[13px] text-learn-warn">
        <WifiOff className="size-4 shrink-0" strokeWidth={2} />
        <span>তৈরি করার সময় একবার ইন্টারনেট লাগবে</span>
      </div>

      <button className={buttonVariants({ variant: 'ai', size: 'learner' })} onClick={onCreate}>
        <Sparkles className="size-4" strokeWidth={2} />
        পরিকল্পনা তৈরি করুন
      </button>
    </>
  );
}

function PlanView({ done, onToggle }) {
  return (
    <>
      {/* Today hero */}
      <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-bold text-learn-ink">দিন ৯ / ৩০</p>
          <span className="text-[13px] font-semibold text-learn-ai">{toBnDigits(30)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-learn-ai-tint">
          <div className="h-full rounded-full bg-learn-ai transition-all duration-500" style={{ width: '30%' }} />
        </div>

        <div className="mt-4 space-y-2.5">
          {TODAY.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => onToggle(i)}
              className={cn(
                'flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors',
                done.has(i) ? 'bg-learn-success-tint/60' : 'bg-learn-bg'
              )}
            >
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  done.has(i) ? 'border-learn-success bg-learn-success text-white' : 'border-learn-muted/40'
                )}
              >
                {done.has(i) && <Check className="size-3" strokeWidth={3.5} />}
              </span>
              <span className={cn('flex-1 text-[14px] font-semibold', done.has(i) ? 'text-learn-muted line-through' : 'text-learn-ink')}>
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming days */}
      <div>
        <p className="mb-2 text-[14px] font-semibold text-learn-ink">আগামী দিনগুলো</p>
        <div className="space-y-2.5">
          {UPCOMING.map((d) => (
            <div key={d.day} className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              {d.done ? (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-learn-success text-white">
                  <Check className="size-4" strokeWidth={3} />
                </span>
              ) : (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-learn-primary-tint text-[12px] font-bold text-learn-primary">
                  {toBnDigits(d.dayNum)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-learn-ink">দিন {toBnDigits(d.dayNum)}</p>
                <p className="truncate text-[12px] text-learn-muted">{d.summary}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-learn-muted" strokeWidth={2} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[12px] text-learn-muted">পরিকল্পনাটি আপনার ডিভাইসে সংরক্ষিত — অফলাইনেও খুলবে</p>
    </>
  );
}

const TODAY = [
  { title: 'Unit 3 · Lesson 2' },
  { title: '১০টি নতুন শব্দ' },
  { title: '৫ মিনিট উচ্চারণ' },
];

const UPCOMING = [
  { dayNum: 10, summary: 'Unit 3 · Lesson 3 + রিভিউ কুইজ', done: false },
  { dayNum: 11, summary: 'ফ্রেজবুক — চাকরির ইন্টারভিউ', done: false },
  { dayNum: 12, summary: 'Unit 4 · Lesson 1 + ১০টি শব্দ', done: true },
  { dayNum: 13, summary: 'লিসেনিং প্র্যাকটিস ১৫ মিনিট', done: true },
];
