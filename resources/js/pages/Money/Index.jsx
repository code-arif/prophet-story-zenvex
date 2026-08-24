import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { StatTile } from '../../components/ui/StatTile';
import { FAB } from '../../components/ui/FAB';
import IncomeChart from '../../components/money/IncomeChart';

/**
 * Screen 22 — Money Hub · টাকা
 * 12-col chart + 4 tiles + 3 rows + FAB.
 */

const MOCK = {
  months: [
    { label: 'জান', amount: 15000 },
    { label: 'ফেব', amount: 22000 },
    { label: 'মার', amount: 18000 },
    { label: 'এপ্র', amount: 35000 },
    { label: 'মে', amount: 28000 },
    { label: 'জুন', amount: 42000 },
    { label: 'জুল', amount: 31000 },
    { label: 'আগ', amount: 38000 },
    { label: 'সেপ', amount: 0 },
    { label: 'অক্ট', amount: 0 },
    { label: 'নভে', amount: 0 },
    { label: 'ডিসে', amount: 0 },
  ],
  currentMonth: 7,
  tiles: [
    { label: 'এই মাস', value: '৩৮,০০০' },
    { label: 'গড়', value: '২৭,৫০০' },
    { label: 'সর্বোচ্চ', value: '৪২,০০০' },
    { label: 'মোট', value: '২,২৯,০০০' },
  ],
  rows: [
    { label: 'বকেয় পেমেন্ট', value: '৪২,৫০০', href: '/work/payments' },
    { label: 'সত্যিকারের ঘণ্টা-হার', value: '৳৬৬৭/ঘণ্টা', href: '/money/true-hourly' },
    { label: 'রানওয়ে', value: '৩.৫ মাস', href: '/money/runway' },
  ],
};

export default function MoneyIndex() {
  const { t } = useI18n();
  const { months, currentMonth, tiles, rows } = MOCK;

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="টাকা — ইজি রাইজ" />

      {/* Chart */}
      <div className="mb-3">
        <IncomeChart months={months} currentMonth={currentMonth} />
      </div>

      {/* Stat tiles */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        {tiles.map((s) => (
          <StatTile key={s.label} label={t(s.label)} value={s.value} />
        ))}
      </div>

      {/* Quick rows */}
      <div className="mb-3 space-y-2">
        {rows.map((r) => (
          <Link
            key={r.label}
            href={r.href}
            className="glass-row flex items-center justify-between px-4 py-3 transition-all active:scale-[0.98]"
          >
            <span className="text-[14px] font-semibold text-ink font-bn">{t(r.label)}</span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-brand font-bn">{r.value}</span>
              <span className="text-[13px] text-muted">▶</span>
            </div>
          </Link>
        ))}
      </div>

      <FAB onClick={() => {}} />
    </div>
  );
}
