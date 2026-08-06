import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Map, Library, BookOpen, FileText, GraduationCap } from 'lucide-react';
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
  rulesCount = 42,
  readingCount = 18,
}) {
  const { t } = useI18n();

  return (
    <>
      <Head title={t('শিখুন')} />
      <LearnerShell
        title={t('শিখুন')}
        activeTab="learn"
        right={<StreakChip days={streak} />}
      >
        <div className="mt-2 space-y-5">
          {/* Level Banner */}
          <div className="flex items-center justify-between rounded-[16px] bg-[#EEF2FC] border border-[#2b59c3]/15 px-4 py-3.5 shadow-[0_2px_8px_rgba(43,89,195,0.03)]">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="size-5 text-learn-primary" strokeWidth={2.2} />
              <span className="text-[14px] font-bold text-learn-primary">
                {t('আপনার লেভেল — {level}', { level })}
              </span>
            </div>
            <Link href="/welcome/placement" className="text-[14px] font-bold text-learn-primary underline decoration-2">
              {t('বদলান')}
            </Link>
          </div>

          {/* Feature tiles */}
          <div className="space-y-3">
            <HubTile
              href="/learn/lessons"
              icon={Map}
              tint="blue"
              title={t('পাঠ পথ')}
              subtitle={t('{unit} এর {n}টি পাঠ বাকি', { unit: nextUnit.bn || nextUnit.en || 'Unit 1', n: toBnDigits(lessonRemaining) })}
              progress={lessonProgress}
              badge={t('অফলাইন')}
              badgeTone="blue"
            />
            <HubTile
              href="/learn/vocabulary"
              icon={Library}
              tint="green"
              title={t('শব্দভাণ্ডার')}
              subtitle={t('{n}টি কার্ড আজ পুনরাবৃত্তির জন্য প্রস্তুত', { n: toBnDigits(dueCards) })}
              progress={Math.min(100, dueCards * 8)}
              badge={t('অফলাইন')}
              badgeTone="blue"
            />
            <HubTile
              href="/learn/grammar"
              icon={BookOpen}
              tint="indigo"
              title={t('গ্রামার লাইব্রেরি')}
              subtitle={t('{n}টি নিয়ম, বাংলায় ব্যাখ্যা', { n: toBnDigits(rulesCount) })}
              badge={t('অফলাইন')}
              badgeTone="blue"
            />
            <HubTile
              href="/learn/reading"
              icon={FileText}
              tint="teal"
              title={t('রিডিং প্র্যাকটিস')}
              subtitle={t('আপনার লেভেলের {n}টি পাঠ্য', { n: toBnDigits(readingCount) })}
              progress={20}
              badge={t('অফলাইন')}
              badgeTone="blue"
            />
          </div>

          {/* Today's Tips (আজকের টিপস) */}
          <div className="mt-6 pb-6">
            <h2 className="text-[16px] font-bold text-learn-ink mb-3">{t('আজকের টিপস')}</h2>
            <Link
              href="/learn/grammar"
              className="group relative block overflow-hidden rounded-[20px] bg-white border border-black/5 shadow-sm active:scale-[0.99] transition-all"
            >
              {/* Image container */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60"
                  alt={t('আজকের টিপস')}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Dark overlay gradient at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                  {t('প্রো টিপস')}
                </span>
                <h3 className="mt-2 text-[16px] font-extrabold leading-snug text-white tracking-tight">
                  {t("কখন 'The' ব্যবহার করবেন?")}
                </h3>
                <p className="mt-1 text-[12px] text-white/80 leading-normal">
                  {t('মাত্র ৩ মিনিটে শিখে নিন সহজ ৩টি নিয়ম।')}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </LearnerShell>
    </>
  );
}
