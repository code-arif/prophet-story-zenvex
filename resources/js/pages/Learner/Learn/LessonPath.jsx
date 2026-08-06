import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Lock, Play, ChevronRight, Award } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 09 — পাঠ পথ / Lesson Path (Stitch, feature 1). Units as a ladder
 * with per-lesson status circles (done / current / locked), derived from
 * the learner's progress (Learner/LearnController@lessonPath).
 */
export default function LessonPath({ 
  level = 'A2', 
  units = [], 
  availableLevels = ['A1', 'A2', 'B1'],
  progressPercent = 0 
}) {
  const [activeLevel, setActiveLevel] = React.useState(level);
  const { t } = useI18n();

  const isLevelLocked = (lvl) => {
    // Determine locks based on subscriber's actual level (prop level)
    if (level === 'A1') {
      return lvl === 'A2' || lvl === 'B1';
    }
    if (level === 'A2') {
      return lvl === 'B1';
    }
    return false;
  };

  return (
    <LearnerShell title={t('পাঠ পথ')} showBack right={<LevelPill level={activeLevel} />}>
      <div className="mt-2 space-y-4">
        <Head title={t('পাঠ পথ')} />
        
        {/* Level chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {availableLevels.map((lvl) => (
            <Chip
              key={lvl}
              selected={activeLevel === lvl}
              lock={isLevelLocked(lvl)}
              onClick={() => {
                if (isLevelLocked(lvl)) return;
                setActiveLevel(lvl);
                router.visit(`/learn/lessons?level=${lvl}`, { preserveState: false, only: ['units', 'level', 'progressPercent'] });
              }}
            >
              {lvl}
            </Chip>
          ))}
        </div>

        {/* Units ladder */}
        <div className="space-y-4">
          {units.length === 0 ? (
            <p className="rounded-[20px] bg-white p-5 text-center text-[13px] text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              {t('এই লেভেলে কোনো পাঠ নেই')}
            </p>
          ) : (
            units.map((unit) => <UnitCard key={unit.id} unit={unit} />)
          )}
        </div>

        {/* Milestone card */}
        <div className="mt-6 rounded-[20px] bg-learn-primary p-5 text-white relative overflow-hidden shadow-md">
          {/* Background watermark badge */}
          <Award className="absolute right-[-10px] bottom-[-10px] size-28 text-white/10 -rotate-12 pointer-events-none" />

          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              {t('পরবর্তী মাইলফলক')}
            </span>
            <h3 className="mt-1 text-[18px] font-extrabold text-white">
              {t(`${activeLevel} প্রফিসিয়েন্সি সার্টিফিকেট`)}
            </h3>
            
            {/* Progress bar */}
            <div className="mt-4 h-2 w-full rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <p className="mt-3 text-[13px] font-medium text-white/90">
              {t('আপনি লেভেল {level} এর {pct}% পূর্ণ করেছেন!', { level: activeLevel, pct: toBnDigits(progressPercent) })}
            </p>
          </div>
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
  const { t } = useI18n();

  if (unit.status === 'locked') {
    return (
      <div className="rounded-[20px] border-2 border-dashed border-[#c3c6d5]/50 bg-[#F8F9FC]/80 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EAEAEA] text-[#A0A2B1] text-[14px] font-bold">
            {toBnDigits(unit.num)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-[#71737e]">{unit.titleEn}</span>
            <span className="block text-[13px] text-[#A0A2B1]">{unit.titleBn}</span>
          </span>
          <Lock className="size-5 shrink-0 text-[#A0A2B1]" strokeWidth={2} />
        </div>
        <p className="mt-4 text-center text-[13px] font-semibold text-[#71737e]/80">
          {t('Unit {n} শেষ করলে খুলে যাবে', { n: toBnDigits(unit.num - 1) })}
        </p>
      </div>
    );
  }

  const doneCount = unit.lessons.filter((l) => l.status === 'done').length;

  return (
    <div className="rounded-[20px] bg-white p-5 border border-black/5 shadow-sm">
      {/* Unit header */}
      <div className="flex items-center gap-3 pb-3">
        {unit.status === 'done' ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#12b886] text-white">
            <Check className="size-5" strokeWidth={2.5} />
          </span>
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-learn-primary text-white text-[14px] font-bold">
            {toBnDigits(unit.num)}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-bold text-learn-ink leading-tight">
            Unit {unit.num} — {unit.titleEn}
          </span>
          <span className="block text-[13px] text-learn-muted mt-0.5">{unit.titleBn}</span>
        </span>
        <span className="text-[14px] font-bold text-learn-primary">
          {toBnDigits(doneCount)}/{toBnDigits(unit.lessons.length)}
        </span>
      </div>

      {/* Lesson list */}
      <div className="mt-3 space-y-2">
        {unit.lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}

function LessonRow({ lesson }) {
  const { t } = useI18n();
  const isDone = lesson.status === 'done';
  const isCurrent = lesson.status === 'current';
  const isLocked = lesson.status === 'locked';

  const content = (
    <>
      {isDone ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#12b886] text-white">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      ) : isCurrent ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-learn-primary text-white">
          <Play className="size-3.5 fill-current ml-0.5" />
        </span>
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center text-[#9ca3af]">
          <Lock className="size-4.5" strokeWidth={2} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-[14px] font-bold leading-snug", isCurrent ? "text-learn-primary" : "text-learn-ink")}>
          {lesson.titleEn}
        </span>
        <span className={cn("block text-[12px] mt-0.5", isCurrent ? "text-learn-primary/80" : "text-learn-muted")}>
          {lesson.titleBn}
        </span>
      </span>
      <ChevronRight className={cn("size-5 shrink-0", isCurrent ? "text-learn-primary" : "text-learn-muted")} />
    </>
  );

  const rowClass = cn(
    'flex items-center gap-3 px-3 py-2.5 transition-all rounded-[14px]',
    isCurrent ? 'bg-[#EEF2FC]' : 'hover:bg-learn-bg',
    isLocked && 'opacity-55 cursor-not-allowed'
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
