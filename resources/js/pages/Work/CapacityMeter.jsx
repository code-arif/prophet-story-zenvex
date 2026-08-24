import React from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { ArcGauge } from '../../components/ui/ArcGauge';
import JobLoadRow from '../../components/work/JobLoadRow';
import SuggestionCard from '../../components/work/SuggestionCard';
import { Clock, TrendingDown, TrendingUp } from 'lucide-react';

/**
 * Screen 20 — Capacity Meter · ক্যাপাসিটি মিটার
 * Arc gauge + job load rows + suggestion cards.
 */

const MOCK = {
  used: 32,
  max: 40,
  jobs: [
    { name: 'E-commerce landing', hours: 15, capacity: 20 },
    { name: 'Logo package', hours: 8, capacity: 10 },
    { name: 'Blog posts', hours: 9, capacity: 10 },
  ],
  suggestions: [
    { icon: <TrendingDown className="size-4" />, text: '৩টি কাজ শেষ করুন, চাপ কমবে' },
    { icon: <Clock className="size-4" />, text: '৮ ঘণ্টা বাকি আছে এই সপ্তাহে' },
    { icon: <TrendingUp className="size-4" />, text: 'পরের সপ্তাহে ৫ ঘণ্টা ফাঁকা' },
  ],
};

export default function CapacityMeter() {
  const { t } = useI18n();
  const { used, max, jobs, suggestions } = MOCK;
  const pct = Math.round((used / max) * 100);

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="ক্যাপাসিটি মিটার — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('ক্যাপাসিটি মিটার')}</h1>

      {/* Arc gauge */}
      <div className="glass mb-3 flex flex-col items-center px-4 py-5">
        <ArcGauge value={used} max={max} />
        <p className="mt-2 text-[13px] text-muted font-bn">
          {used}/{max} {t('ঘণ্টা / সপ্তাহ')}
        </p>
        <p className={`text-[14px] font-bold font-bn ${pct > 90 ? 'text-warn' : 'text-brand'}`}>
          {pct}% {t('ব্যবহৃত')}
        </p>
      </div>

      {/* Job load */}
      <div className="mb-3">
        <p className="mb-2 text-[15px] font-bold text-ink font-bn">{t('কাজ অনুযায়ী')}</p>
        <div className="space-y-2">
          {jobs.map((j, i) => (
            <JobLoadRow key={i} job={j} />
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-3">
        <p className="mb-2 text-[15px] font-bold text-ink font-bn">{t('পরামর্শ')}</p>
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <SuggestionCard key={i} icon={s.icon} text={s.text} />
          ))}
        </div>
      </div>
    </div>
  );
}
