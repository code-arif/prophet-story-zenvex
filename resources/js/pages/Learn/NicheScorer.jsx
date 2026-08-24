import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { ScoreRing } from '../../components/ui/ScoreRing';
import NicheStrip from '../../components/learn/NicheStrip';

/**
 * Screen 08 — Niche Scorer · নিচ স্কোরার
 * StepperFields + ScoreRing + saved niches strip.
 */

const CRITERIA = [
  { label: 'আপনার দক্ষতা', max: 10 },
  { label: 'বাজারের চাহিদা', max: 10 },
  { label: 'প্রতিযোগিতা', max: 10 },
  { label: 'আয়ের সম্ভাবনা', max: 10 },
  { label: 'শেখার সহজতা', max: 10 },
];

const MOCK_NICHES = [
  { name: 'লোগো ডিজাইন', score: 78 },
  { name: 'ওয়েবসাইট ডিজাইন', score: 65 },
  { name: 'সোশ্যাল মিডিয়া', score: 52 },
];

export default function NicheScorer() {
  const { t } = useI18n();
  const [values, setValues] = useState([7, 8, 5, 8, 6]);
  const [niches, setNiches] = useState(MOCK_NICHES);

  const total = values.reduce((a, b) => a + b, 0);
  const maxTotal = CRITERIA.reduce((a, c) => a + c.max, 0);
  const score = Math.round((total / maxTotal) * 100);

  const update = (i, v) => {
    setValues((prev) => prev.map((x, j) => j === i ? Math.max(0, Math.min(10, v)) : x));
  };

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="নিচ স্কোরার — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('নিচ স্কোরার')}</h1>

      {/* Score ring */}
      <div className="glass mb-3 flex flex-col items-center px-4 py-5">
        <ScoreRing score={score} />
        <p className="mt-2 text-[14px] font-bold text-ink font-bn">{t('নিচ স্কোর')}</p>
      </div>

      {/* Stepper fields */}
      <div className="mb-3 space-y-2">
        {CRITERIA.map((c, i) => (
          <div key={i} className="glass-row flex items-center justify-between px-4 py-3">
            <span className="text-[14px] text-ink font-bn">{t(c.label)}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => update(i, values[i] - 1)}
                className="flex size-8 items-center justify-center rounded-full border border-border-rest text-muted active:scale-95"
              >−</button>
              <span className="min-w-[24px] text-center text-[16px] font-bold text-ink font-bn">{values[i]}</span>
              <button
                onClick={() => update(i, values[i] + 1)}
                className="flex size-8 items-center justify-center rounded-full border border-border-rest text-muted active:scale-95"
              >+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Saved niches strip */}
      <div className="mb-3">
        <p className="mb-2 text-[15px] font-bold text-ink font-bn">{t('সংরক্ষিত নিচ')}</p>
        <NicheStrip niches={niches} />
      </div>
    </div>
  );
}
