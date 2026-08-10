import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 29 — অগ্রগতি ড্যাশবোর্ড / Progress Dashboard (Stitch, feature 11).
 * Four-skill bars, streak calendar, weekly minutes chart and the weakest-skill
 * suggestion. All numbers come from the learner's progress logs.
 */
export default function Progress({
  skills = SKILL_BASE,
  streak = 7,
  week = WEEK,
  weekly = WEEKLY,
  weeklyMinutes = 145,
  weakestBn = 'বলা',
  nextStepHref = '/practice/pronunciation',
}) {
  const [range, setRange] = React.useState('all');
  const { t } = useI18n();

  const customLeft = (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="-ml-2 flex size-12 items-center justify-center rounded-full text-learn-primary active:scale-95 transition-transform cursor-pointer"
      aria-label="Back"
    >
      <span className="material-symbols-outlined text-[24px]">arrow_back</span>
    </button>
  );

  const customRight = (
    <button
      type="button"
      aria-label={t('শেয়ার করুন')}
      className="-mr-2 flex size-12 items-center justify-center rounded-full text-learn-primary active:scale-95 transition-transform cursor-pointer"
    >
      <span className="material-symbols-outlined text-[24px]">share</span>
    </button>
  );

  const bnDayName = (day) => {
    const mapping = {
      'শ': 'শনি',
      'র': 'রবি',
      'সো': 'সোম',
      'ম': 'মঙ্গল',
      'বু': 'বুধ',
      'বৃ': 'বৃহ',
      'শু': 'শুক্র'
    };
    return mapping[day] || day;
  };

  const getNextStepText = (skill) => {
    const skillName = skill || 'বলা';
    if (skillName === 'পড়া') {
      return t('পড়া দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট রিডিং প্র্যাকটিসে সময় দিন');
    } else if (skillName === 'শোনা') {
      return t('শোনা দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট লিসেনিং প্র্যাকটিসে সময় দিন');
    } else if (skillName === 'লেখা') {
      return t('লেখা দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট রাইটিং ডেস্কে সময় দিন');
    } else {
      return t('বলা দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট উচ্চারণ স্টুডিওতে সময় দিন');
    }
  };

  return (
    <LearnerShell
      activeTab="profile"
      title={<span className="text-[18px] font-bold text-learn-primary">{t('অগ্রগতি')}</span>}
      left={customLeft}
      right={customRight}
    >
      <div className="mt-2 space-y-4">
        <Head title={t('অগ্রগতি')} />

        <SegmentedControl
          value={range}
          onChange={setRange}
          tone="light"
          options={[
            { label: t('সব সময়'), value: 'all' },
            { label: t('সপ্তাহ'), value: 'week' },
            { label: t('মাস'), value: 'month' },
          ]}
        />

        {/* Four skills */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="mb-3 text-[14px] font-bold text-learn-ink">{t('চার দক্ষতা')}</p>
          <div className="space-y-3">
            {(skills[range] || skills.week).map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-learn-ink">{t(s.label)}</span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[11px] font-bold',
                        s.delta >= 0 ? 'bg-learn-success-tint text-learn-success' : 'bg-learn-danger-tint text-learn-danger'
                      )}
                    >
                      {s.delta >= 0 ? '+' : ''}{toBnDigits(s.delta)}%
                    </span>
                  </div>
                  <span className="font-bold text-learn-ink">{toBnDigits(s.value)}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-learn-structure">
                  <div className={cn('h-full rounded-full', s.tone)} style={{ width: `${s.value}%` }} />
                </div>
                {s.weakest && (
                  <span className="mt-1 inline-block rounded-full bg-learn-warn-tint px-2 py-0.5 text-[11px] font-bold text-learn-warn">
                    {t('দুর্বলতম')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Streak calendar */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center gap-2 text-[15px] font-bold text-learn-ink">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#FEF4E1] text-[#F5A524]">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>whatshot</span>
            </div>
            <span>{t('{n} দিনের স্ট্রিক', { n: toBnDigits(streak) })}</span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {week.map((d, i) => {
              const displayLabel = d.label === 'বৃ' ? 'বি' : d.label;
              return (
                <div key={d.label} className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full',
                      d.done ? 'bg-learn-success text-white' :
                      d.today ? 'bg-white border-2 border-learn-primary text-learn-primary font-bold' :
                      'bg-[#eaf0fc]'
                    )}
                  >
                    {d.done ? (
                      <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                    ) : d.today ? (
                      <span className="text-[13px] font-bold">{displayLabel}</span>
                    ) : null}
                  </span>
                  <span className="text-[13px] text-learn-muted">{displayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly minutes */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-learn-ink">{t('সাপ্তাহিক সময়')}</p>
              <p className="text-[13px] font-bold text-learn-primary mt-1">
                {t('এই সপ্তাহে {n} মিনিট', { n: toBnDigits(weeklyMinutes) })}
              </p>
            </div>
            <span className="material-symbols-outlined text-[20px] text-learn-muted">show_chart</span>
          </div>
          <div className="flex h-32 items-end justify-between gap-2 mt-4">
            {weekly.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={cn('w-full max-w-[22px] rounded-t-md', d.active ? 'bg-learn-primary' : 'bg-learn-primary/30')}
                  style={{ height: `${Math.min(96, (d.min / Math.max(1, weeklyMinutes)) * 96)}px` }}
                />
                <span className="text-[13px] text-learn-muted">{bnDayName(d.day)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next step */}
        <div className="rounded-[14px] border-l-[4px] border-learn-warn bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-learn-warn" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            <p className="text-[14px] font-bold text-learn-ink">{t('পরবর্তী পদক্ষেপ')}</p>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-learn-muted">
            {getNextStepText(weakestBn)}
          </p>
          <Link
            href={nextStepHref}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-learn-primary text-[15px] font-bold text-white hover:bg-learn-primary-dark active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{t('শুরু করুন')}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <p className="text-center text-[13px] text-learn-muted">{t('সব হিসাব আপনার ডিভাইতেই থাকে')}</p>
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
