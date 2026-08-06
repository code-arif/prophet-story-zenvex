import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Route, Library, BookMarked, BookOpenText } from 'lucide-react';
import LearnerShell from '../../../layouts/LearnerShell';
import { StreakChip } from '../../../components/StreakChip';
import { HubTile } from '../../../components/HubTile';
import { toBnDigits } from '../../../lib/format';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 08 — শিখুন / Learn Hub (Stitch). Shallow directory to the four
 * structured learning surfaces. Progress values come from the backend.
 */
export default function LearnIndex({
  level = 'A2',
  lessonProgress = 60,
  lessonRemaining = 3,
  nextUnit = { en: '', bn: '' },
  dueCards = 0,
  streak = 0,
}) {
  const { t } = useI18n();

  return (
    <>
      <Head title={t('শিখুন')} />
      <LearnerShell title={t('শিখুন')} activeTab="learn" right={<StreakChip days={streak} />}>
      <div className="mt-2">
        {/* Level pill + change link */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 items-center rounded-full bg-learn-primary-tint px-4 text-[13px] font-bold text-learn-primary">
            {t('আপনার লেভেল — {level}', { level })}
          </span>
          <Link href="/welcome/placement" className="text-[13px] font-semibold text-learn-primary">
            {t('বদলান')}
          </Link>
        </div>

        {/* Feature tiles */}
        <div className="mt-4 space-y-3">
          <HubTile
            href="/learn/lessons"
            icon={Route}
            tint="blue"
            title={t('পাঠ পথ')}
            subtitle={`${nextUnit.en} — ${t('{n}টি পাঠ বাকি', { n: toBnDigits(lessonRemaining) })}`}
            progress={lessonProgress}
            badge={t('অফলাইন')}
          />
          <HubTile
            href="/learn/vocabulary"
            icon={Library}
            tint="green"
            title={t('শব্দভাণ্ডার')}
            subtitle={t('{n}টি কার্ড আজ পুনরাবৃত্তির জন্য প্রস্তুত', { n: toBnDigits(dueCards) })}
            progress={Math.min(100, dueCards * 8)}
            badge={t('অফলাইন')}
          />
          <HubTile
            href="/learn/grammar"
            icon={BookMarked}
            tint="indigo"
            title={t('গ্রামার লাইব্রেরি')}
            subtitle={t('নিয়ম, বাংলায় ব্যাখ্যা')}
            badge={t('অফলাইন')}
          />
          <HubTile
            href="/learn/reading"
            icon={BookOpenText}
            tint="teal"
            title={t('রিডিং প্র্যাকটিস')}
            subtitle={t('আপনার লেভেলের পাঠ্য ({level})', { level })}
            progress={20}
            badge={t('অফলাইন')}
          />
        </div>
      </div>
      </LearnerShell>
    </>
  );
}
