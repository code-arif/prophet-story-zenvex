import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * Screen 03 — Starting Setup · শুরুর তথ্য
 * Onboarding. No bottom navigation.
 * Collects: current stage, weekly hours, minimum rate, currency.
 * All data powers later features (Capacity Meter, True Hourly, Rise Ladder).
 */

const STAGES = [
  { value: 'not_started', label: 'এখনো শুরু করিনি' },
  { value: 'first_job', label: 'প্রথম কাজের চেষ্টা করছি' },
  { value: 'regular', label: 'নিয়মিত কাজ পাচ্ছি' },
  { value: 'team', label: 'নিজের দল আছে' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
];

export default function ProfileSetup() {
  const { t } = useI18n();
  const form = useForm({
    stage: 'first_job',
    weeklyHours: 25,
    minRate: 800,
    currency: 'USD',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/welcome/profile', {
      onFinish: () => {},
    });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-bg-from via-[#F0F0FF] to-bg-to">
      <Head title="শুরুর তথ্য — ইজি রাইজ" />

      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-brand/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-ai/20 blur-[120px]" />

      <main className="relative z-10 flex min-h-dvh flex-col px-5 py-12">
        {/* Back + progress */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex size-12 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 active:scale-95"
          >
            <ArrowLeft className="size-6" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <div className="h-1 overflow-hidden rounded-full bg-border-rest">
              <div className="h-full w-3/4 rounded-full bg-brand" />
            </div>
          </div>
          <Link href="/home" className="text-[14px] text-muted font-bn">
            {t('পরে করব')}
          </Link>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="glass-tall flex-1 p-5">
            {/* Section 1: Current stage */}
            <Section label={t('আপনি এখন কোথায়?')}>
              <div className="flex flex-col gap-2">
                {STAGES.map((stage) => (
                  <RadioRow
                    key={stage.value}
                    selected={form.data.stage === stage.value}
                    onClick={() => form.setData('stage', stage.value)}
                    label={stage.label}
                  />
                ))}
              </div>
            </Section>

            <Divider />

            {/* Section 2: Weekly hours */}
            <Section label={t('সপ্তাহে কত ঘণ্টা কাজ করতে পারবেন?')}>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => form.setData('weeklyHours', Math.max(5, form.data.weeklyHours - 5))}
                  className="flex size-10 items-center justify-center rounded-full border border-border-rest text-muted transition-colors hover:bg-black/5 active:scale-95"
                >
                  <Minus className="size-4" />
                </button>
                <span className="min-w-[60px] text-center text-[28px] font-bold text-brand font-bn">
                  {form.data.weeklyHours}
                </span>
                <button
                  type="button"
                  onClick={() => form.setData('weeklyHours', Math.min(70, form.data.weeklyHours + 5))}
                  className="flex size-10 items-center justify-center rounded-full border border-border-rest text-muted transition-colors hover:bg-black/5 active:scale-95"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              {/* Slider */}
              <input
                type="range"
                min={5}
                max={70}
                step={5}
                value={form.data.weeklyHours}
                onChange={(e) => form.setData('weeklyHours', +e.target.value)}
                className="mt-3 w-full accent-brand"
              />
            </Section>

            <Divider />

            {/* Section 3: Minimum rate */}
            <Section
              label={t('সর্বনিম্ন গ্রহণযোগ্য ঘণ্টা-হার')}
              hint={t('এর নিচে নামলে অ্যাপ চিহ্ন দেখাবে')}
            >
              <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-border-rest bg-white transition-colors focus-within:border-brand">
                <span className="flex h-full items-center border-r border-border-rest bg-inset-blue px-3.5 text-[15px] font-semibold text-ink font-bn">
                  ৳
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.data.minRate}
                  onChange={(e) => form.setData('minRate', +e.target.value)}
                  className="w-full bg-transparent px-4 py-2.5 text-[18px] font-bold text-ink focus:outline-none"
                />
              </div>
            </Section>

            <Divider />

            {/* Section 4: Currency */}
            <Section label={t('প্রধান মুদ্রা')}>
              <div className="flex gap-2">
                {CURRENCIES.map((cur) => (
                  <button
                    key={cur.value}
                    type="button"
                    onClick={() => form.setData('currency', cur.value)}
                    className={cn(
                      'flex-1 rounded-full py-2.5 text-[14px] font-bold transition-all active:scale-95 font-bn',
                      form.data.currency === cur.value
                        ? 'bg-brand text-white'
                        : 'glass-row text-ink'
                    )}
                  >
                    {cur.label}
                  </button>
                ))}
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div className="mt-4">
            <p className="mb-3 text-center text-[13px] text-muted font-bn">
              {t('সব তথ্য আপনার ডিভাইসেই থাকে, পরে বদলানো যাবে')}
            </p>
            <button
              type="submit"
              disabled={form.processing}
              className="flex h-14 w-full items-center justify-center rounded-[18px] bg-brand text-[17px] font-bold text-white shadow-[0_8px_20px_rgba(29,111,242,0.25)] transition-all hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50 font-bn"
            >
              {form.processing ? 'সংরক্ষণ হচ্ছে…' : t('সংরক্ষণ করে এগোন')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Section({ label, hint, children }) {
  return (
    <div className="mb-1">
      <p className="mb-2 text-[14px] font-semibold text-ink font-bn">{label}</p>
      {hint && <p className="mb-2 text-[12px] text-muted font-bn">{hint}</p>}
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-4 h-px bg-border-rest" />;
}

function RadioRow({ selected, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98]',
        selected
          ? 'border-2 border-brand bg-inset-blue'
          : 'border border-border-rest bg-white'
      )}
    >
      {/* Radio circle */}
      <div
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
          selected ? 'border-brand' : 'border-outline-inactive'
        )}
      >
        {selected && <div className="size-2.5 rounded-full bg-brand" />}
      </div>
      <span className="text-[15px] font-semibold text-ink font-bn">{label}</span>
    </button>
  );
}
