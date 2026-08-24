import React from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import ResultCard from '../../components/money/ResultCard';

/**
 * Screen 25 — Runway · রানওয়ে
 * Chart with dashed lines + 3 result cards + low-data variant.
 */

const MOCK = {
  monthlyExpense: 18000,
  savings: 65000,
  runway: 3.6,
  projection: [
    { month: 'সেপ', income: 38000, expense: 18000 },
    { month: 'অক্ট', income: 32000, expense: 18000 },
    { month: 'নভে', income: 28000, expense: 18000 },
    { month: 'ডিসে', income: 25000, expense: 18000 },
  ],
};

export default function Runway() {
  const { t } = useI18n();
  const { monthlyExpense, savings, runway, projection } = MOCK;
  const max = Math.max(...projection.map((p) => Math.max(p.income, p.expense)), 1);

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="রানওয়ে — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('রানওয়ে')}</h1>

      {/* Chart */}
      <div className="glass mb-3 px-4 py-4">
        <p className="mb-3 text-[14px] font-bold text-ink font-bn">{t('পূর্বাভাস')}</p>
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {projection.map((p, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              {/* Income bar (solid) */}
              <div
                className="w-full rounded-t-md bg-brand"
                style={{ height: `${(p.income / max) * 100}%` }}
              />
              {/* Expense line (dashed) */}
              <div
                className="w-full border-t-2 border-dashed border-warn"
                style={{ position: 'absolute', bottom: `${(p.expense / max) * 100}%` }}
              />
              <span className="text-[9px] text-muted font-bn">{p.month}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-[11px] font-bn">
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-brand" /> {t('আয়')}</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full border-2 border-dashed border-warn" /> {t('খরচ')}</span>
        </div>
      </div>

      {/* Result cards */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <ResultCard label="মাসিক খরচ" value={`৳${monthlyExpense}`} variant="default" />
        <ResultCard label="সঞ্চয়" value={`৳${savings}`} variant="success" />
        <ResultCard label="রানওয়ে" value={`${runway} মাস`} variant={runway < 3 ? 'warn' : 'brand'} />
      </div>
    </div>
  );
}
