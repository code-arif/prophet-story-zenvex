import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Briefcase, GraduationCap, Plane, TrendingUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { Button } from '../../../components/ui/button';
import { Chip } from '../../../components/Chip';
import { ProgressBar } from '../../../components/ProgressBar';

/**
 * Screen 04 — আপনার সম্পর্কে / Profile Setup (Stitch).
 * Collects name, learning goal and daily minutes. NO bottom navigation.
 * Backend lands later: this screen keeps local state and calls
 * `onNext(data)` (default: navigate to /welcome/placement).
 */
export default function ProfileSetup({ onNext }) {
  const [name, setName] = React.useState('');
  const [goal, setGoal] = React.useState(null);
  const [minutes, setMinutes] = React.useState(null);

  const canContinue = name.trim().length > 0 && goal !== null && minutes !== null;

  const handleNext = () => {
    const payload = { name: name.trim(), goal, dailyMinutes: minutes };
    if (onNext) {
      onNext(payload);
      return;
    }
    router.visit('/welcome/placement');
  };

  const handleSkip = () => {
    if (onNext) {
      onNext({});
      return;
    }
    router.visit('/welcome/placement');
  };

  return (
    <div className="min-h-screen bg-learn-bg font-learn-bn text-learn-ink flex flex-col max-w-[390px] mx-auto relative overflow-x-hidden">
      <Head title="আপনার সম্পর্কে" />

      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-learn-bg px-5">
        <button
          type="button"
          aria-label="Back"
          onClick={() => window.history.back()}
          className="-ml-2 flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[14px] font-semibold text-learn-muted"
        >
          এড়িয়ে যান
        </button>
      </header>

      {/* 3-step progress — step 1 of 3 */}
      <div className="px-5">
        <ProgressBar value={33} segments={3} />
      </div>

      <main className="flex-1 px-5 pb-10 pt-6">
        <h1 className="text-[22px] font-bold leading-[30px]">আপনার সম্পর্কে একটু বলুন</h1>

        {/* Name */}
        <section className="mt-7">
          <label className="text-[14px] font-semibold" htmlFor="name">নাম</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম"
            className="mt-2 h-12 w-full rounded-[14px] border border-learn-border bg-white px-4 text-[15px] placeholder:text-learn-muted/60 focus:border-learn-primary focus:outline-none focus:ring-1 focus:ring-learn-primary"
          />
        </section>

        {/* Goal */}
        <section className="mt-6">
          <label className="text-[14px] font-semibold">আপনার লক্ষ্য</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {GOALS.map(({ key, bn, en, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setGoal(key)}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-[14px] bg-white p-4 text-left shadow-[0px_4px_12px_rgba(20,23,43,0.04)] transition-all duration-150 active:scale-[0.98]',
                  goal === key
                    ? 'border-2 border-learn-primary bg-learn-primary-tint'
                    : 'border border-transparent'
                )}
              >
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-xl',
                    goal === key ? 'bg-learn-primary text-white' : 'bg-learn-primary-tint text-learn-primary'
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold">{bn}</span>
                  <span className="block text-[12px] text-learn-muted">{en}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Daily minutes */}
        <section className="mt-6">
          <label className="text-[14px] font-semibold">প্রতিদিন কত সময় দিতে পারবেন</label>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {MINUTES.map((m) => (
              <Chip key={m} selected={minutes === m} onClick={() => setMinutes(m)}>
                {toBnDigits(m)} মিনিট
              </Chip>
            ))}
          </div>
        </section>
      </main>

      {/* Primary action */}
      <div className="px-5 pb-8">
        <Button size="learner" disabled={!canContinue} onClick={handleNext}>
          পরের ধাপ
        </Button>
      </div>
    </div>
  );
}

const GOALS = [
  { key: 'job', bn: 'চাকরি', en: 'Job', Icon: Briefcase },
  { key: 'exam', bn: 'পরীক্ষা', en: 'Exam', Icon: GraduationCap },
  { key: 'travel', bn: 'বিদেশ যাত্রা', en: 'Travel', Icon: Plane },
  { key: 'general', bn: 'সাধারণ উন্নতি', en: 'General', Icon: TrendingUp },
];

const MINUTES = [10, 20, 30, 60];
