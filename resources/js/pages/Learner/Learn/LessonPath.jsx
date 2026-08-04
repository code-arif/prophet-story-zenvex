import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Check, Lock, Play } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';

/**
 * Screen 09 — পাঠ পথ / Lesson Path (Stitch, feature 1). Units as a ladder
 * with per-lesson status circles (done / current / locked), derived from
 * progress. UI-phase demo data — statuses come from the backend later.
 */
export default function LessonPath({ level = 'A2', units = UNITS }) {
  return (
    <LearnerShell title="পাঠ পথ" showBack right={<LevelPill level={level} />}>
      <div className="mt-2">
        <Head title="পাঠ পথ" />
        {/* Level chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip onClick={() => {}}>A1</Chip>
          <Chip selected>A2</Chip>
          <Chip lock>B1</Chip>
        </div>

        {/* Units ladder */}
        <div className="mt-4 space-y-3">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </LearnerShell>
  );
}

function LevelPill({ level }) {
  return (
    <span className="inline-flex h-8 items-center rounded-full bg-learn-primary-tint px-3 text-[13px] font-bold text-learn-primary">
      {level}
    </span>
  );
}

function UnitCard({ unit }) {
  if (unit.status === 'locked') {
    return (
      <div className="rounded-[14px] bg-white p-4 opacity-80 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-learn-structure text-learn-muted">
            <Lock className="size-4" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-learn-ink">{unit.titleEn}</span>
            <span className="block text-[13px] text-learn-muted">{unit.titleBn}</span>
          </span>
          <Lock className="size-4 shrink-0 text-learn-muted" strokeWidth={2} />
        </div>
        <p className="mt-3 text-center text-[12px] text-learn-muted">Unit {toBnDigits(unit.num - 1)} শেষ করলে খুলে যাবে</p>
      </div>
    );
  }

  const doneCount = unit.lessons.filter((l) => l.status === 'done').length;

  return (
    <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
      {/* Unit header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        {unit.status === 'done' ? (
          <span className="flex size-9 items-center justify-center rounded-full bg-learn-success text-white">
            <Check className="size-4" strokeWidth={2.5} />
          </span>
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-learn-primary text-white text-[13px] font-bold">
            {toBnDigits(unit.num)}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-bold text-learn-ink">
            Unit {unit.num} — {unit.titleEn}
          </span>
          <span className="block text-[13px] text-learn-muted">{unit.titleBn}</span>
        </span>
        <span className="text-[13px] font-semibold text-learn-muted">
          {toBnDigits(doneCount)}/{toBnDigits(unit.lessons.length)}
        </span>
      </div>

      {/* Lesson rows */}
      <div className="mt-2">
        {unit.lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}

function LessonRow({ lesson }) {
  const isDone = lesson.status === 'done';
  const isCurrent = lesson.status === 'current';
  const isLocked = lesson.status === 'locked';

  const content = (
    <>
      {isDone ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-learn-success text-white">
          <Check className="size-3.5" strokeWidth={2.5} />
        </span>
      ) : isCurrent ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-learn-primary text-white">
          <Play className="size-3.5 fill-current" />
        </span>
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-learn-structure text-learn-muted">
          <Lock className="size-3.5" strokeWidth={2} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold text-learn-ink">{lesson.titleEn}</span>
        <span className="block text-[12px] text-learn-muted">{lesson.titleBn}</span>
      </span>
      {!isLocked && <span className="material-symbols-outlined text-[20px] text-learn-muted">chevron_right</span>}
    </>
  );

  const rowClass = cn(
    'flex items-center gap-3 px-4 py-3 transition-colors',
    isCurrent && 'bg-learn-primary-tint',
    isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-learn-primary-tint/60'
  );

  if (isLocked) {
    return <div className={rowClass}>{content}</div>;
  }

  return (
    <Link href={`/learn/lessons/${lesson.id}`} className={rowClass}>
      {content}
    </Link>
  );
}

// ── UI-phase demo curriculum (A2 level) ──
const UNITS = [
  {
    id: 'A2-U1',
    num: 1,
    titleEn: 'Introducing Yourself',
    titleBn: 'নিজের পরিচয়',
    status: 'done',
    lessons: [
      { id: 'A2-U1-L1', titleEn: 'Be Verbs — am / is / are', titleBn: 'am/is/are এর ব্যবহার', status: 'done' },
      { id: 'A2-U1-L2', titleEn: 'Subject Pronouns', titleBn: 'কর্তৃবাচক সর্বনাম', status: 'done' },
      { id: 'A2-U1-L3', titleEn: 'Questions with What / Who', titleBn: 'What/Who দিয়ে প্রশ্ন', status: 'done' },
      { id: 'A2-U1-L4', titleEn: 'Possessives', titleBn: 'অধিকারবাচক শব্দ', status: 'done' },
      { id: 'A2-U1-L5', titleEn: 'Review Check', titleBn: 'পুনরালোচনা', status: 'done' },
    ],
  },
  {
    id: 'A2-U2',
    num: 2,
    titleEn: 'Family & Friends',
    titleBn: 'পরিবার ও বন্ধু',
    status: 'done',
    lessons: [
      { id: 'A2-U2-L1', titleEn: 'Have / Has', titleBn: 'have/has এর ব্যবহার', status: 'done' },
      { id: 'A2-U2-L2', titleEn: 'Family Vocabulary', titleBn: 'পরিবারের শব্দভাণ্ডার', status: 'done' },
      { id: 'A2-U2-L3', titleEn: 'Descriptions', titleBn: 'কাউকে বর্ণনা করা', status: 'done' },
      { id: 'A2-U2-L4', titleEn: 'Comparisons', titleBn: 'তুলনা করা', status: 'done' },
      { id: 'A2-U2-L5', titleEn: 'Review Check', titleBn: 'পুনরালোচনা', status: 'done' },
    ],
  },
  {
    id: 'A2-U3',
    num: 3,
    titleEn: 'Daily Routine',
    titleBn: 'দৈনন্দিন রুটিন',
    status: 'current',
    lessons: [
      { id: 'A2-U3-L1', titleEn: 'Present Simple — Daily Habits', titleBn: 'প্রতিদিনের অভ্যাস', status: 'done' },
      { id: 'A2-U3-L2', titleEn: 'Adverbs of Frequency', titleBn: 'always/usually/sometimes', status: 'done' },
      { id: 'A2-U3-L3', titleEn: 'Telling the Time', titleBn: 'সময় বলা', status: 'current' },
      { id: 'A2-U3-L4', titleEn: 'Prepositions of Time', titleBn: 'in/on/at এর ব্যবহার', status: 'locked' },
      { id: 'A2-U3-L5', titleEn: 'Review Check', titleBn: 'পুনরালোচনা', status: 'locked' },
    ],
  },
  {
    id: 'A2-U4',
    num: 4,
    titleEn: 'Food & Shopping',
    titleBn: 'খাবার ও কেনাকাটা',
    status: 'locked',
    lessons: [],
  },
];
