import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bookmark } from 'lucide-react';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { StatusChip } from '../../../components/StatusChip';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 15 — রিডিং প্র্যাকটিস / Reading List (Stitch, feature 6).
 * Filter chips + graded passage cards. Data comes from the backend.
 */
export default function Reading({ passages = [], myLevel = 'A2' }) {
  const [filter, setFilter] = React.useState('my-level');

  const { t } = useI18n();
  const visible = passages.filter((p) => {
    if (filter === 'my-level') return p.level === myLevel;
    if (filter === 'short') return p.words < 150;
    if (filter === 'long') return p.words >= 200;
    if (filter === 'read') return p.completed;
    return true;
  });

  return (
    <LearnerShell title={t('রিডিং প্র্যাকটিস')} showBack>
      <div className="mt-2">
        <Head title={t('রিডিং প্র্যাকটিস')} />
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip selected={filter === 'my-level'} onClick={() => setFilter('my-level')}>{t('আমার লেভেল ({level})', { level: myLevel })}</Chip>
          <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>{t('সব')}</Chip>
          <Chip selected={filter === 'short'} onClick={() => setFilter('short')}>{t('ছোট')}</Chip>
          <Chip selected={filter === 'long'} onClick={() => setFilter('long')}>{t('বড়')}</Chip>
          <Chip selected={filter === 'read'} onClick={() => setFilter('read')}>{t('পড়া হয়েছে')}</Chip>
        </div>

        {/* Passage cards */}
        <div className="mt-4 space-y-3">
          {visible.length === 0 && (
            <p className="rounded-[14px] bg-white p-4 text-center text-[13px] text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              {t('এই ফিল্টারে কোনো পাঠ্য নেই')}
            </p>
          )}
          {visible.map((p) => (
            <Link
              key={p.id}
              href={`/learn/reading/${p.id}`}
              className="block rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] font-bold text-learn-ink">{p.titleEn}</p>
                <Bookmark className="size-4 shrink-0 text-learn-muted" strokeWidth={2} />
              </div>
              <p className="mt-1 text-[13px] text-learn-muted">{p.summaryBn}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[13px] text-learn-muted">
                <StatusChip tone="blue">{p.level}</StatusChip>
                <span className="flex items-center gap-1.5">
                  <span className="size-0.5 rounded-full bg-learn-muted" />
                  {toBnDigits(p.words)} {t('শব্দ')}
                </span>
                {p.completed ? (
                  <span className="flex items-center gap-1.5">
                    <span className="size-0.5 rounded-full bg-learn-muted" />
                    <StatusChip tone="green">{t('সম্পন্ন')} — {toBnDigits(p.correct)}/৫</StatusChip>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="size-0.5 rounded-full bg-learn-muted" />
                    {toBnDigits(p.minutes)} {t('মিনিট')}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-[13px] text-learn-muted">{t('সব পাঠ্য অফলাইনে পড়া যাবে')}</p>
      </div>
    </LearnerShell>
  );
}

// ── UI-phase demo passages (feature 6 ships data/reading.json later) ──
const PASSAGES = [
  { id: 'r1', level: 'A2', titleEn: 'A Day at the Post Office', summaryBn: 'চিঠি পাঠানোর সময়ের কথোপকথন', words: 180, minutes: 3, completed: true, correct: 4 },
  { id: 'r2', level: 'A2', titleEn: 'Rahim’s Morning Routine', summaryBn: 'সকালের রুটিনের বর্ণনা', words: 120, minutes: 2, completed: false },
  { id: 'r3', level: 'A2', titleEn: 'Shopping for Vegetables', summaryBn: 'বাজারে কেনাকাটা', words: 210, minutes: 4, completed: false },
  { id: 'r4', level: 'B1', titleEn: 'The Dhaka Metro', summaryBn: 'মেট্রোরেল নিয়ে একটি লেখা', words: 260, minutes: 5, completed: false },
  { id: 'r5', level: 'A2', titleEn: 'A Letter from a Friend', summaryBn: 'বন্ধুর চিঠি', words: 140, minutes: 3, completed: false },
];
