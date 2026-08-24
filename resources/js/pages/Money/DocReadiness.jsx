import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { RingGauge } from '../../components/ui/RingGauge';
import DocRow from '../../components/money/DocRow';
import { WarnStrip } from '../../components/ui/WarnStrip';
import { cn } from '../../lib/utils';

/**
 * Screen 28 — Document Readiness · কাগজপত্র প্রস্তুতি
 * 3 ring gauges + segmented + doc rows + amber strip.
 */

const PURPOSES = ['ভিসা', 'ব্যাংক অ্যাকাউন্ট', 'কর রিটার্ন'];

const DOCS = {
  'ভিসা': [
    { name: 'পাসপোর্ট', status: 'ready', expiry: '২০২৮' },
    { name: 'ভিসা আবেদন', status: 'pending', expiry: null },
    { name: 'ব্যাংক স্টেটমেন্ট', status: 'expired', expiry: '১৫ জুন ২০২৬' },
  ],
  'ব্যাংক অ্যাকাউন্ট': [
    { name: 'জাতীয় পরিচয়পত্র', status: 'ready', expiry: null },
    { name: 'আয়ের প্রমাণ', status: 'pending', expiry: null },
    { name: 'ঠিকানার প্রমাণ', status: 'ready', expiry: null },
  ],
  'কর রিটার্ন': [
    { name: 'TIN সার্টিফিকেট', status: 'ready', expiry: null },
    { name: 'ব্যাংক স্টেটমেন্ট', status: 'expired', expiry: '১৫ জুন ২০২৬' },
    { name: 'আয়ের হিসাব', status: 'pending', expiry: null },
  ],
};

export default function DocReadiness() {
  const { t } = useI18n();
  const [purpose, setPurpose] = useState(0);
  const docs = DOCS[PURPOSES[purpose]];

  const readyCount = docs.filter((d) => d.status === 'ready').length;
  const pct = Math.round((readyCount / docs.length) * 100);
  const hasExpired = docs.some((d) => d.status === 'expired');

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="কাগজপত্র প্রস্তুতি — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('কাগজপত্র প্রস্তুতি')}</h1>

      {/* 3 ring gauges */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {PURPOSES.map((p, i) => {
          const d = DOCS[p];
          const r = d.filter((x) => x.status === 'ready').length;
          return (
            <div key={i} className="glass flex flex-col items-center px-2 py-3">
              <RingGauge value={r} max={d.length} />
              <p className="mt-1 text-[11px] text-center text-muted font-bn">{t(p)}</p>
            </div>
          );
        })}
      </div>

      {/* Segmented purpose selector */}
      <div className="mb-3 flex gap-1 rounded-2xl bg-white/60 p-1">
        {PURPOSES.map((p, i) => (
          <button
            key={p}
            onClick={() => setPurpose(i)}
            className={cn(
              'flex-1 rounded-xl py-2 text-[12px] font-bold transition-all font-bn',
              purpose === i ? 'bg-brand text-white' : 'text-muted'
            )}
          >
            {t(p)}
          </button>
        ))}
      </div>

      {/* Amber strip */}
      {hasExpired && (
        <div className="mb-3">
          <WarnStrip>
            কিছু কাগজপত্রের মেয়াদ শেষ হয়েছে — নতুন করে আপডেট করুন
          </WarnStrip>
        </div>
      )}

      {/* Doc rows */}
      <div className="space-y-2">
        {docs.map((d, i) => (
          <DocRow key={i} doc={d} />
        ))}
      </div>
    </div>
  );
}
