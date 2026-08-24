import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';
import ComparisonCard from '../../components/money/ComparisonCard';

/**
 * Screen 24 — True Hourly · সত্যিকারের ঘণ্টা-হার
 * Job selector + 5 steppers + comparison card.
 */

const JOBS = [
  { id: 1, name: 'E-commerce landing' },
  { id: 2, name: 'Logo package' },
  { id: 3, name: 'Blog posts' },
];

const MOCK = {
  earnings: 15000,
  hours: { actual: 22, planned: 20 },
  expenses: { tools: 500, internet: 800, transport: 300 },
};

function StepperField({ label, value, onChange }) {
  const { t } = useI18n();
  return (
    <div className="glass-row flex items-center justify-between px-4 py-3">
      <span className="text-[14px] text-ink font-bn">{t(label)}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 100))}
          className="flex size-8 items-center justify-center rounded-full border border-border-rest text-muted active:scale-95"
        >−</button>
        <span className="min-w-[60px] text-center text-[16px] font-bold text-ink font-bn">৳{value}</span>
        <button
          onClick={() => onChange(value + 100)}
          className="flex size-8 items-center justify-center rounded-full border border-border-rest text-muted active:scale-95"
        >+</button>
      </div>
    </div>
  );
}

export default function TrueHourly() {
  const { t } = useI18n();
  const [selectedJob, setSelectedJob] = useState(1);
  const [data, setData] = useState(MOCK);

  const totalExpenses = data.expenses.tools + data.expenses.internet + data.expenses.transport;
  const netEarnings = data.earnings - totalExpenses;
  const trueHourly = data.hours.actual > 0 ? Math.round(netEarnings / data.hours.actual) : 0;
  const plannedHourly = data.hours.planned > 0 ? Math.round(data.earnings / data.hours.planned) : 0;

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="সত্যিকারের ঘণ্টা-হার — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('সত্যিকারের ঘণ্টা-হার')}</h1>

      {/* Job selector */}
      <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-none">
        {JOBS.map((j) => (
          <button
            key={j.id}
            onClick={() => setSelectedJob(j.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 font-bn',
              selectedJob === j.id ? 'bg-brand text-white' : 'glass-row text-ink'
            )}
          >
            {t(j.name)}
          </button>
        ))}
      </div>

      {/* Earnings */}
      <div className="mb-3">
        <StepperField
          label="আয়"
          value={data.earnings}
          onChange={(v) => setData((p) => ({ ...p, earnings: v }))}
        />
      </div>

      {/* Hours */}
      <div className="mb-3 space-y-2">
        <div className="glass-row flex items-center justify-between px-4 py-3">
          <span className="text-[14px] text-ink font-bn">{t('প্রকৃত সময়')}</span>
          <span className="text-[16px] font-bold text-ink font-bn">{data.hours.actual} {t('ঘণ্টা')}</span>
        </div>
        <div className="glass-row flex items-center justify-between px-4 py-3">
          <span className="text-[14px] text-ink font-bn">{t('পরিকল্পিত সময়')}</span>
          <span className="text-[16px] font-bold text-muted font-bn">{data.hours.planned} {t('ঘণ্টা')}</span>
        </div>
      </div>

      {/* Expenses */}
      <div className="mb-3 space-y-2">
        <StepperField
          label="টুলস"
          value={data.expenses.tools}
          onChange={(v) => setData((p) => ({ ...p, expenses: { ...p.expenses, tools: v } }))}
        />
        <StepperField
          label="ইন্টারনেট"
          value={data.expenses.internet}
          onChange={(v) => setData((p) => ({ ...p, expenses: { ...p.expenses, internet: v } }))}
        />
        <StepperField
          label="যাতায়াত"
          value={data.expenses.transport}
          onChange={(v) => setData((p) => ({ ...p, expenses: { ...p.expenses, transport: v } }))}
        />
      </div>

      {/* Comparison */}
      <div className="mb-3">
        <ComparisonCard
          labelA="সত্যিকারের"
          rateA={trueHourly}
          labelB="পরিকল্পিত"
          rateB={plannedHourly}
        />
      </div>
    </div>
  );
}
