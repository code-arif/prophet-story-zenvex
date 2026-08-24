import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { ChipStrip } from '../../components/ui/ChipStrip';
import { TodoChip } from '../../components/ui/TodoChip';
import { cn } from '../../lib/utils';

/**
 * Screen 07 — Marketplace Compare · মার্কেটপ্লেস তুলনা
 * ChipStrip + SegmentedControl + 5 sections + TODO chips.
 */

const MARKETPLACES = ['Fiverr', 'Upwork', 'Freelancer.com', 'PeoplePerHour', 'Toptal'];

const SECTIONS = [
  { label: 'ফি', key: 'fees' },
  { label: 'পেমেন্ট', key: 'payment' },
  { label: 'প্রতিযোগিতা', key: 'competition' },
  { label: 'শুরু', key: 'getting_started' },
  { label: 'রেটিং', key: 'ratings' },
];

const MOCK_DATA = {
  Fiverr: { fees: '২০% কমিশন', payment: '১৪ দিন হোল্ড', competition: 'বেশি', getting_started: 'সহজ', ratings: '৪.৭' },
  Upwork: { fees: '৫–২০% স্লাইডিং', payment: '১০ দিন', competition: 'মাঝারি', getting_started: 'মাঝারি', ratings: '৪.৫' },
  'Freelancer.com': { fees: '১০% বা $৫', payment: '১৪ দিন', competition: 'বেশি', getting_started: 'সহজ', ratings: '৪.৩' },
  PeoplePerHour: { fees: '৫–২০%', payment: '৭ দিন', competition: 'কম', getting_started: 'মাঝারি', ratings: '৪.৪' },
  Toptal: { fees: '০% (ক্লায়েন্ট)', payment: 'নির্দিষ্ট', competition: 'কঠিন', getting_started: 'কঠিন', ratings: '৪.৮' },
};

export default function MarketplaceCompare() {
  const { t } = useI18n();
  const [selected, setSelected] = useState(['Fiverr']);
  const [section, setSection] = useState(0);

  const toggle = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="মার্কেটপ্লেস তুলনা — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('মার্কেটপ্লেস তুলনা')}</h1>

      {/* Chip strip */}
      <div className="mb-3">
        <ChipStrip
          chips={MARKETPLACES.map((m) => ({ label: m, value: m }))}
          value={selected}
          onChange={toggle}
        />
      </div>

      {/* Section tabs */}
      <div className="mb-3 flex gap-1 rounded-2xl bg-white/60 p-1 overflow-x-auto scrollbar-none">
        {SECTIONS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setSection(i)}
            className={cn(
              'shrink-0 rounded-xl px-3 py-2 text-[12px] font-bold transition-all font-bn',
              section === i ? 'bg-brand text-white' : 'text-muted'
            )}
          >
            {t(s.label)}
          </button>
        ))}
      </div>

      {/* Comparison data */}
      <div className="space-y-2">
        {selected.map((m) => (
          <div key={m} className="glass-row px-4 py-3">
            <p className="mb-1 text-[14px] font-bold text-ink font-bn">{t(m)}</p>
            <p className="text-[13px] text-muted font-bn">
              {t(SECTIONS[section].label)}: <span className="font-semibold text-ink">{MOCK_DATA[m]?.[SECTIONS[section].key] || '—'}</span>
            </p>
          </div>
        ))}
      </div>

      {/* TODO chips */}
      <div className="mt-4 flex gap-2">
        <TodoChip />
        <TodoChip />
      </div>
    </div>
  );
}
