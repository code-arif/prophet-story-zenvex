import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Route, Library, BookMarked, BookOpenText } from 'lucide-react';
import LearnerShell from '../../../layouts/LearnerShell';
import { StreakChip } from '../../../components/StreakChip';
import { HubTile } from '../../../components/HubTile';

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
  return (
    <>
      <Head title="শিখুন" />
      <LearnerShell title="শিখুন" activeTab="learn" right={<StreakChip days={streak} />}>
      <div className="mt-2">
        {/* Level pill + change link */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 items-center rounded-full bg-learn-primary-tint px-4 text-[13px] font-bold text-learn-primary">
            আপনার লেভেল — {level}
          </span>
          <Link href="/welcome/placement" className="text-[13px] font-semibold text-learn-primary">
            বদলান
          </Link>
        </div>

        {/* Feature tiles */}
        <div className="mt-4 space-y-3">
          <HubTile
            href="/learn/lessons"
            icon={Route}
            tint="blue"
            title="পাঠ পথ"
            subtitle={`${nextUnit.en} — ${lessonRemaining}টি পাঠ বাকি`}
            progress={lessonProgress}
            badge="অফলাইন"
          />
          <HubTile
            href="/learn/vocabulary"
            icon={Library}
            tint="green"
            title="শব্দভাণ্ডার"
            subtitle={`${dueCards}টি কার্ড আজ পুনরাবৃত্তির জন্য প্রস্তুত`}
            progress={Math.min(100, dueCards * 8)}
            badge="অফলাইন"
          />
          <HubTile
            href="/learn/grammar"
            icon={BookMarked}
            tint="indigo"
            title="গ্রামার লাইব্রেরি"
            subtitle="নিয়ম, বাংলায় ব্যাখ্যা"
            badge="অফলাইন"
          />
          <HubTile
            href="/learn/reading"
            icon={BookOpenText}
            tint="teal"
            title="রিডিং প্র্যাকটিস"
            subtitle={`আপনার লেভেলের পাঠ্য (${level})`}
            progress={20}
            badge="অফলাইন"
          />
        </div>
      </div>
      </LearnerShell>
    </>
  );
}
