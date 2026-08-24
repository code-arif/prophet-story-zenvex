import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import MoneyAtStakeStrip from '../../components/home/MoneyAtStakeStrip';
import CapacityBar from '../../components/home/CapacityBar';
import TodayJobsList from '../../components/home/TodayJobsList';
import RiseLadderStrip from '../../components/home/RiseLadderStrip';

/**
 * Screen 04 — Today Hub · আজ
 * The daily driver screen. Shows: money at stake, capacity, today's jobs, rise ladder strip.
 * No bottom navigation (handled by LearnerShell).
 */

// Mock props for UI phase — replaced by controller later
const MOCK = {
  jobsDue: 3,
  moneyOwed: '১২,৫০০',
  weeklyLoad: { used: 28, max: 40 },
  ladderStage: 2,
  todayJobs: [
    { id: 1, name: 'Landing page redesign', deadline: 'আজ রাত ১০টা', status: 'due' },
    { id: 2, name: 'Logo variant delivery', deadline: 'আগামীকাল', status: 'due' },
    { id: 3, name: 'Client revision — homepage', deadline: 'অতিপার!', status: 'overdue' },
  ],
};

export default function Today() {
  const { t } = useI18n();
  const data = MOCK;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t('শুভ সকাল') :
    hour < 17 ? t('শুভ দুপুর') :
    t('শুভ সন্ধ্যা');

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="আজ — ইজি রাইজ" />

      {/* Greeting */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-ink font-bn">{greeting}</h1>
        <p className="text-[14px] text-muted font-bn">
          {t('আজকের হিসাব')}
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="glass flex flex-col items-center px-3 py-4">
          <span className="text-[28px] font-bold text-brand font-bn">{data.jobsDue}</span>
          <span className="text-[12px] text-muted font-bn">{t('কাজ বাকি')}</span>
        </div>
        <div className="glass flex flex-col items-center px-3 py-4">
          <span className="text-[28px] font-bold text-warn font-bn">৳{data.moneyOwed}</span>
          <span className="text-[12px] text-muted font-bn">{t('টাকা বাকি')}</span>
        </div>
      </div>

      {/* Money at stake strip */}
      <div className="mb-3">
        <MoneyAtStakeStrip amount={data.moneyOwed} variant="warning" />
      </div>

      {/* Capacity bar */}
      <div className="mb-3">
        <CapacityBar used={data.weeklyLoad.used} max={data.weeklyLoad.max} />
      </div>

      {/* Today's jobs */}
      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-ink font-bn">{t('আজকের কাজ')}</h2>
          <Link href="/work" className="text-[13px] text-brand font-semibold font-bn">
            {t('সব দেখুন')}
          </Link>
        </div>
        <TodayJobsList jobs={data.todayJobs} />
      </div>

      {/* Rise ladder strip */}
      <div className="mb-3">
        <RiseLadderStrip stage={data.ladderStage} />
      </div>
    </div>
  );
}
