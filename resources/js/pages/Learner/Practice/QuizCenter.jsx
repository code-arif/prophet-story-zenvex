import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, History, Timer } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { buttonVariants } from '../../../components/ui/button';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 24 — কুইজ ও টেস্ট সেন্টার / Quiz & Test Center (Stitch, feature 8).
 * Quick quiz, topic test, and timed level test entry points plus recent
 * results. Quizzes + results come from the backend.
 */
export default function QuizCenter({ quizzes = [], recentResults = [], topics = ['Tense', 'Article', 'Preposition', 'Vocabulary'] }) {
  const [topic, setTopic] = React.useState(topics[0] || 'Tense');

  const { t } = useI18n();
  const quick = quizzes.find((q) => q.kind === 'quick');
  const topicQuizzes = quizzes.filter((q) => q.kind === 'topic');
  const levelQuiz = quizzes.find((q) => q.kind === 'level');
  const quickHref = quick?.href || '/practice/quiz/session';
  const topicHref = topicQuizzes[0]?.href || '/practice/quiz/session';
  const levelHref = levelQuiz?.href || '/practice/quiz/session';
  return (
    <LearnerShell
      showBack
      activeTab="practice"
      title={t('কুইজ ও টেস্ট সেন্টার')}
      right={
        <button type="button" aria-label={t('ইতিহাস')} className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <History className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title={t('কুইজ ও টেস্ট সেন্টার')} />

        {/* Quick quiz */}
        <div className="rounded-[14px] border-l-[3px] border-learn-primary bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="text-[16px] font-bold text-learn-ink">{t('কুইক কুইজ')}</p>
          <p className="mt-0.5 text-[13px] text-learn-muted">{quick?.descriptionBn || t('১০টি প্রশ্ন · ৩ মিনিট · মিশ্র বিষয়')}</p>
          <Link href={quickHref} className={cn(buttonVariants({ size: 'sm' }), 'mt-3 w-full')}>
            {t('শুরু করুন')}
          </Link>
        </div>

        {/* Topic test */}
        <div className="rounded-[14px] border-l-[3px] border-learn-indigo bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="text-[16px] font-bold text-learn-ink">{t('টপিক টেস্ট')}</p>
          <p className="mt-0.5 text-[13px] text-learn-muted">{topicQuizzes[0]?.descriptionBn || t('২০টি প্রশ্ন · নির্দিষ্ট বিষয়ে')}</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {topics.map((t) => (
              <Chip key={t} selected={topic === t} onClick={() => setTopic(t)}>{t}</Chip>
            ))}
          </div>
          <Link href={topicHref} className={cn(buttonVariants({ variant: 'outlineBlue', size: 'sm' }), 'mt-3 w-full')}>
            {t('বিষয় বেছে শুরু করুন')}
          </Link>
        </div>

        {/* Level test */}
        <div className="rounded-[14px] border-l-[3px] border-learn-warn bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[16px] font-bold text-learn-ink">{t('লেভেল টেস্ট')}</p>
              <p className="mt-0.5 text-[13px] text-learn-muted">{levelQuiz?.descriptionBn || t('৩০টি প্রশ্ন · সময় বাঁধা ২০ মিনিট')}</p>
            </div>              <span className="flex shrink-0 items-center gap-1 rounded-full bg-learn-warn-tint px-2 py-0.5 text-[13px] font-bold text-learn-warn">
              <Timer className="size-3" strokeWidth={2} />
              {t('লেভেল বদলাতে পারে')}
            </span>
          </div>
          <Link href={levelHref} className={cn(buttonVariants({ variant: 'outlineBlue', size: 'sm' }), 'mt-3 w-full')}>
            {t('পরীক্ষা দিন')}
          </Link>
        </div>

        {/* Recent results */}
        {recentResults.length > 0 && (
          <div>
            <p className="mb-2 text-[14px] font-semibold text-learn-ink">{t('সাম্প্রতিক ফল')}</p>
            <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              {recentResults.map((r, i) => (
                <div
                  key={r.name + r.date}
                  className={cn('flex items-center gap-3 px-4 py-3.5', i > 0 && 'border-t border-learn-structure')}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-learn-ink">{r.name}</p>
                    <p className="text-[13px] text-learn-muted">{r.date}</p>
                  </div>
                  <span className={cn('rounded-full px-2.5 py-1 text-[13px] font-bold', r.pillClass)}>
                    {r.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </LearnerShell>
  );
}

const RESULTS = [
  { name: 'কুইক কুইজ — মিশ্র', date: 'গতকাল', score: '৮/১০', pillClass: 'bg-learn-success-tint text-learn-success' },
  { name: 'টপিক টেস্ট — Article', date: '৩ দিন আগে', score: '১২/২০', pillClass: 'bg-learn-warn-tint text-learn-warn' },
  { name: 'কুইক কুইজ — Tense', date: '৫ দিন আগে', score: '৫/১০', pillClass: 'bg-learn-danger-tint text-learn-danger' },
];
