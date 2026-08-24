import React from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { RingGauge } from '../../components/ui/RingGauge';
import FoundationRow from '../../components/learn/FoundationRow';
import ArtifactCard from '../../components/learn/ArtifactCard';

/**
 * Screen 06 — Learn Hub · শেখা
 * RingGauge + FoundationRows + ArtifactCards.
 */

const MOCK = {
  overallScore: 42,
  foundations: [
    { label: 'মার্কেটপ্লেস বোঝা', score: 65 },
    { label: 'প্রোফাইল তৈরি', score: 80 },
    { label: 'প্রস্তাব লেখা', score: 35 },
    { label: 'ক্লায়েন্ট যোগাযোগ', score: 28 },
    { label: 'পেমেন্ট সেটআপ', score: 45 },
  ],
  artifacts: [
    { title: 'Fiverr প্রোফাইল', subtitle: 'খসড়া — সম্পূর্ণ হয়নি', status: 'draft' },
    { title: 'প্রথম প্রস্তাব', subtitle: 'Rahim Corp — Landing page', status: 'active' },
    { title: 'পোর্টফোলিও', subtitle: '৩টি কাজের নমুনা', status: 'review' },
  ],
};

export default function LearnIndex() {
  const { t } = useI18n();
  const { overallScore, foundations, artifacts } = MOCK;

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="শেখা — ইজি রাইজ" />

      {/* Ring gauge */}
      <div className="glass mb-3 flex flex-col items-center px-4 py-5">
        <RingGauge value={overallScore} max={100} />
        <p className="mt-2 text-[14px] font-bold text-ink font-bn">{t('সামগ্রিক অগ্রগতি')}</p>
        <p className="text-[12px] text-muted font-bn">{overallScore}% {t('সম্পন্ন')}</p>
      </div>

      {/* Foundation rows */}
      <div className="mb-3">
        <p className="mb-2 text-[15px] font-bold text-ink font-bn">{t('ভিত্তি দক্ষতা')}</p>
        <div className="space-y-2">
          {foundations.map((f) => (
            <FoundationRow key={f.label} {...f} />
          ))}
        </div>
      </div>

      {/* Artifact cards */}
      <div className="mb-3">
        <p className="mb-2 text-[15px] font-bold text-ink font-bn">{t('আপনার কাজ')}</p>
        <div className="space-y-2">
          {artifacts.map((a) => (
            <ArtifactCard key={a.title} {...a} />
          ))}
        </div>
      </div>
    </div>
  );
}
