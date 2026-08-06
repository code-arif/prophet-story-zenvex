import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Briefcase, Clock3, GraduationCap, Plane, Target, TrendingUp, UserRound } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { Button } from '../../../components/ui/button';
import { Chip } from '../../../components/Chip';
import { ProgressBar } from '../../../components/ProgressBar';
import { useI18n, getGuestLanguage } from '../../../lib/i18n';

/**
 * Screen 04 — আপনার সম্পর্কে / Profile Setup (Stitch).
 * Collects name, learning goal and daily minutes. NO bottom navigation.
 *
 * Mobile keeps the original 390px-centered column; on md+ (tablet/desktop) it
 * becomes a wide two-column layout: a brand panel + a form card.
 *
 * Skipping is dynamic — POST /welcome/profile/skip:
 *  - first run (not onboarded): skip onboarding → home (no level yet;
 *    the placement test is offered later from the home screen);
 *  - already onboarded (editing later): back home.
 * The profile can be completed any time from /welcome/profile.
 */
export default function ProfileSetup({ onNext, existing = {}, onboarded = false }) {
  const [name, setName] = React.useState(existing.name || '');
  const [goal, setGoal] = React.useState(existing.goal || null);
  const [minutes, setMinutes] = React.useState(existing.dailyMinutes || null);
  const [saving, setSaving] = React.useState(false);
  const [skipping, setSkipping] = React.useState(false);
  const { t } = useI18n();

  const canContinue = name.trim().length > 0 && goal !== null && minutes !== null;

  const title = onboarded ? t('আপনার প্রোফাইল সম্পূর্ণ করুন') : t('আপনার সম্পর্কে একটু বলুন');

  const handleNext = () => {
    // Carry the guest's landing-page language choice into their profile so
    // the whole onboarding + app follow it (server persists app_language).
    const payload = {
      name: name.trim(),
      goal,
      dailyMinutes: minutes,
      appLanguage: getGuestLanguage() || undefined,
    };
    if (onNext) {
      onNext(payload);
      return;
    }
    setSaving(true);
    // The server redirects: placement test (first run) or home (later edits).
    router.post('/welcome/profile', payload, {
      onError: () => setSaving(false),
    });
  };

  const handleSkip = () => {
    if (onNext) {
      onNext({});
      return;
    }
    if (skipping) return;
    setSkipping(true);
    // Server decides: first run → placement; editing later → home.
    router.post('/welcome/profile/skip');
  };

  const primaryAction = (
    <Button size="learner" disabled={!canContinue || saving} onClick={handleNext}>
      {saving ? t('সংরক্ষণ হচ্ছে…') : onboarded ? t('সংরক্ষণ করুন') : t('পরের ধাপ')}
    </Button>
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-learn-bg font-learn-bn text-learn-ink">
      <Head title={onboarded ? t('প্রোফাইল সম্পূর্ণ করুন') : t('আপনার সম্পর্কে')} />

      {/* Top bar */}
      <header className="sticky top-0 z-40 mx-auto flex h-14 w-full max-w-[390px] items-center justify-between bg-learn-bg px-5 md:max-w-6xl md:px-8">
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
          disabled={skipping}
          className={cn(
            'text-[14px] font-semibold text-learn-muted transition-colors hover:text-learn-ink',
            skipping && 'cursor-default opacity-60'
          )}
        >
          {onboarded ? t('বাতিল') : t('এড়িয়ে যান')}
        </button>
      </header>

      {/* 3-step progress — step 1 of 3 (onboarding only, hidden when editing later) */}
      {!onboarded && (
        <div className="mx-auto w-full max-w-[390px] px-5 md:max-w-6xl md:px-8">
          {/* On md+ the bar aligns with the form card column (right grid track). */}
          <div className="md:grid md:grid-cols-[0.9fr_1.1fr] md:gap-12">
            <div className="hidden md:block" aria-hidden="true" />
            <div className="md:mx-8">
              <ProgressBar value={33} segments={3} />
            </div>
          </div>
        </div>
      )}

      {/* Body — single column on mobile, two columns (brand + form) on md+ */}
      <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col md:grid md:max-w-6xl md:flex-none md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-12 md:px-8 md:py-6">
        {/* Brand panel — desktop only */}
        <aside className="hidden md:flex md:flex-col md:gap-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-learn-primary-tint px-3.5 py-1.5 text-[13px] font-bold text-learn-primary">
            <UserRound className="size-4" strokeWidth={2.2} />
            {onboarded ? t('প্রোফাইল') : t('ধাপ ১/৩ — প্রোফাইল')}
          </span>

          <div>
            <h2 className="text-[30px] font-extrabold leading-[40px] tracking-tight text-learn-ink">{title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-learn-muted">
              {onboarded
                ? t('নাম, লক্ষ্য আর দৈনিক সময় যোগ করলে আমরা আপনার জন্য আরও ভালো শেখার পরিকল্পনা সাজিয়ে দেব।')
                : t('নাম, লক্ষ্য আর দৈনিক সময় জানালে আমরা আপনার শেখার পথ বানিয়ে দেব — আপনার গতিতে।')}
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { Icon: UserRound, label: 'আপনার নাম', desc: 'কেমন করে ডাকব আপনাকে' },
              { Icon: Target, label: 'আপনার লক্ষ্য', desc: 'চাকরি, পরীক্ষা, বিদেশ যাত্রা বা সাধারণ উন্নতি' },
              { Icon: Clock3, label: 'দৈনিক সময়', desc: '১০ থেকে ৬০ মিনিট — আপনার সুবিধামতো' },
            ].map(({ Icon, label, desc }) => (
              <li key={label} className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-learn-primary-tint text-learn-primary">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-learn-ink">{t(label)}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-learn-muted">{t(desc)}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* Decorative card */}
          <div className="relative mt-2 overflow-hidden rounded-[20px] bg-learn-primary p-5 text-white shadow-[0_14px_34px_rgba(43,89,195,0.25)]">
            <div className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-white/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-14 -left-8 size-28 rounded-full bg-white/5" aria-hidden="true" />
            <p className="relative text-[15px] font-bold">{t('মাত্র ১ মিনিটেই শেষ')}</p>
            <p className="relative mt-1 text-[13px] leading-relaxed text-white/80">
              {t('পরের ধাপে লেভেল পরীক্ষা, তারপর ৩০ দিনের শেখার পরিকল্পনা।')}
            </p>
          </div>
        </aside>

        {/* Form */}
        <main className="flex-1 px-5 pb-10 pt-6 md:px-0 md:pb-0 md:pt-0">
          <div className="md:rounded-[24px] md:border md:border-learn-border md:bg-white md:p-8 md:shadow-[0px_12px_32px_rgba(20,23,43,0.06)]">
            {/* Mobile heading (desktop shows the headline in the brand panel) */}
            <h1 className="text-[22px] font-bold leading-[30px] md:hidden">{title}</h1>

            {/* Name */}
            <section className="mt-7 md:mt-0">
              <label className="text-[14px] font-semibold" htmlFor="name">{t('নাম')}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('আপনার নাম')}
                className="mt-2 h-12 w-full rounded-[14px] border border-learn-border bg-white px-4 text-[15px] placeholder:text-learn-muted/60 focus:border-learn-primary focus:outline-none focus:ring-1 focus:ring-learn-primary"
              />
            </section>

            {/* Goal */}
            <section className="mt-6">
              <label className="text-[14px] font-semibold">{t('আপনার লক্ষ্য')}</label>
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
                      <span className="block text-[15px] font-bold">{t(bn)}</span>
                      <span className="block text-[13px] text-learn-muted">{en}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Daily minutes */}
            <section className="mt-6">
              <label className="text-[14px] font-semibold">{t('প্রতিদিন কত সময় দিতে পারবেন')}</label>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
                {MINUTES.map((m) => (
                  <Chip key={m} selected={minutes === m} onClick={() => setMinutes(m)}>
                    {toBnDigits(m)} {t('মিনিট')}
                  </Chip>
                ))}
              </div>
            </section>

            {/* Primary action — desktop (inside the card) */}
            <div className="mt-7 hidden md:block">{primaryAction}</div>
          </div>
        </main>
      </div>

      {/* Primary action — mobile (bottom bar, unchanged) */}
      <div className="mx-auto w-full max-w-[390px] px-5 pb-8 md:hidden">{primaryAction}</div>
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
