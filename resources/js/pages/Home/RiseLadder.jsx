import React from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import LadderRail from '../../components/ladder/LadderRail';
import CriteriaRows from '../../components/ladder/CriteriaRows';
import NextStepsCard from '../../components/ladder/NextStepsCard';

/**
 * Screen 05 — Rise Ladder · রাইজ ল্যাডার
 * Shows current stage, criteria for each stage, and next steps.
 * No bottom navigation (handled by LearnerShell).
 */

const MOCK = {
  currentStage: 2,
  stages: [
    {
      n: 1,
      label: 'শুরু',
      criteria: [
        { label: 'প্রোফাইল সম্পূর্ণ', met: true, detail: 'নাম, ফোন, স্কিল দেওয়া হয়েছে' },
        { label: 'প্রথম কাজের চেষ্টা', met: true, detail: 'প্রস্তাব পাঠানো হয়েছে' },
        { label: '১টি কাজ সম্পন্ন', met: false, detail: 'এখনো কোনো কাজ শেষ হয়নি' },
      ],
    },
    {
      n: 2,
      label: 'প্রস্তুত',
      criteria: [
        { label: '৩টি কাজ সম্পন্ন', met: false, detail: '১/৩ সম্পন্ন' },
        { label: 'প্রোফাইল ৭০%+', met: true, detail: 'প্রোফাইল ৮৫% সম্পূর্ণ' },
        { label: 'রেটিং ৪.০+', met: false, detail: 'এখনো কোনো রেটিং নেই' },
      ],
    },
    {
      n: 3,
      label: 'কাজ চলছে',
      criteria: [
        { label: '১০+ কাজ সম্পন্ন', met: false, detail: '' },
        { label: 'নিয়মিত কাজ', met: false, detail: 'সপ্তাহে ৩+ দিন' },
        { label: 'ক্লায়েন্ট ফিডব্যাক', met: false, detail: '৩+ পজিটিভ রিভিউ' },
      ],
    },
    {
      n: 4,
      label: 'ব্যবসা',
      criteria: [
        { label: '২৫+ কাজ সম্পন্ন', met: false, detail: '' },
        { label: 'নিজের দল', met: false, detail: '' },
        { label: 'মাসিক আয় লক্ষ্য', met: false, detail: '' },
      ],
    },
  ],
  nextSteps: [
    { label: 'প্রথম কাজ খুঁজুন', href: '/work' },
    { label: 'প্রোফাইল সম্পূর্ণ করুন', href: '/learn/checklist' },
  ],
};

export default function RiseLadder() {
  const { t } = useI18n();
  const { currentStage, stages, nextSteps } = MOCK;

  const currentStageData = stages.find((s) => s.n === currentStage) || stages[0];

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="রাইজ ল্যাডার — ইজি রাইজ" />

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-ink font-bn">{t('রাইজ ল্যাডার')}</h1>
        <p className="text-[14px] text-muted font-bn">
          {t('ধাপ')} {currentStage} — {currentStageData.label}
        </p>
      </div>

      {/* Ladder rail */}
      <div className="glass mb-3 p-4">
        <LadderRail currentStage={currentStage} />
      </div>

      {/* Current stage criteria */}
      <div className="mb-3">
        <h2 className="mb-2 text-[15px] font-bold text-ink font-bn">
          {currentStageData.label} — {t('শর্তাবলী')}
        </h2>
        <CriteriaRows criteria={currentStageData.criteria} />
      </div>

      {/* Next steps */}
      <div className="mb-3">
        <NextStepsCard steps={nextSteps} />
      </div>
    </div>
  );
}
