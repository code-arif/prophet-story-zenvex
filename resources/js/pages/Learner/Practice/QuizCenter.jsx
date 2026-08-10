import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { BottomSheet } from '../../../components/BottomSheet';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 24 — কুইজ ও টেস্ট সেন্টার / Quiz & Test Center (Stitch, feature 8).
 * Quick quiz, topic test, and timed level test entry points plus recent
 * results. Quizzes + results come from the backend.
 */
export default function QuizCenter({ quizzes = [], recentResults = [], history = [], topics = ['Tense', 'Article', 'Preposition', 'Vocabulary'] }) {
  const [topic, setTopic] = React.useState(topics[0] || 'Tense');
  const [historyOpen, setHistoryOpen] = React.useState(false);

  const { t } = useI18n();
  const quick = quizzes.find((q) => q.kind === 'quick');
  const topicQuizzes = quizzes.filter((q) => q.kind === 'topic');
  const levelQuiz = quizzes.find((q) => q.kind === 'level');

  const quickHref = quick?.href || '/practice/quiz/session';
  
  // Dynamically direct to the specific quiz for the selected topic
  const selectedTopicQuiz = topicQuizzes.find((q) => q.topic === topic) || topicQuizzes[0];
  const topicHref = selectedTopicQuiz?.href || '/practice/quiz/session';

  const levelHref = levelQuiz?.href || '/practice/quiz/session';

  const displayResults = recentResults.length > 0 ? recentResults : RESULTS;

  const customLeft = (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="-ml-2 flex size-12 items-center justify-center rounded-full text-learn-primary active:scale-95 transition-transform cursor-pointer"
      aria-label="Back"
    >
      <span className="material-symbols-outlined text-[24px]">arrow_back</span>
    </button>
  );

  return (
    <LearnerShell
      activeTab="practice"
      left={customLeft}
      title={<span className="text-[18px] font-bold text-learn-ink">{t('কুইজ ও টেস্ট সেন্টার')}</span>}
      right={
        <button
          type="button"
          aria-label={t('ইতিহাস')}
          onClick={() => setHistoryOpen(true)}
          className="flex size-12 items-center justify-center rounded-full text-learn-primary hover:bg-learn-primary/10 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">history</span>
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title={t('কুইজ ও টেস্ট সেন্টার')} />

        {/* Quick quiz */}
        <div className="flex items-center justify-between gap-4 rounded-[14px] border-l-[4px] border-learn-primary bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-bold text-learn-ink">{t('কুইক কুইজ')}</p>
            <p className="mt-1 text-[13px] font-semibold text-learn-muted">
              {quick?.descriptionBn || t('১০টি প্রশ্ন · ৩ মিনিট · মিশ্র বিষয়')}
            </p>
          </div>
          <Link
            href={quickHref}
            className="shrink-0 flex items-center justify-center h-10 px-5 rounded-[10px] bg-learn-primary text-[14px] font-bold text-white shadow-[0px_4px_10px_rgba(43,89,195,0.15)] hover:bg-learn-primary-dark active:scale-95 transition-all"
          >
            {t('শুরু করুন')}
          </Link>
        </div>

        {/* Topic test */}
        <div className="rounded-[14px] border-l-[4px] border-[#7C6BF5] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] space-y-3">
          <div>
            <p className="text-[16px] font-bold text-learn-ink">{t('টপিক টেস্ট')}</p>
            <p className="mt-1 text-[13px] font-semibold text-learn-muted">
              {topicQuizzes[0]?.descriptionBn || t('২০টি প্রশ্ন · নির্দিষ্ট বিষয়ে')}
            </p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {topics.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTopic(item)}
                className={cn(
                  'h-8 px-4 rounded-full text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap',
                  topic === item
                    ? 'bg-[#eef1ff] text-[#7c6bf5]'
                    : 'bg-learn-structure/60 text-learn-muted hover:bg-learn-structure'
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <Link
            href={topicHref}
            className="flex h-10 w-full items-center justify-center rounded-[10px] border border-learn-primary bg-white text-[14px] font-bold text-learn-primary hover:bg-learn-primary/5 active:scale-[0.98] transition-all"
          >
            {t('বিষয় বেছে শুরু করুন')}
          </Link>
        </div>

        {/* Level test */}
        <div className="rounded-[14px] border-l-[4px] border-[#f5a623] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] space-y-3">
          <div>
            <p className="text-[16px] font-bold text-learn-ink">{t('লেভেল টেস্ট')}</p>
            <p className="mt-1 text-[13px] font-semibold text-learn-muted">
              {levelQuiz?.descriptionBn || t('৩০টি প্রশ্ন · সময় বাঁধা ২০ মিনিট')}
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 rounded-[6px] bg-[#fff8eb] px-2.5 py-1 text-[12px] font-bold text-[#f5a623] w-fit">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>{t('লেভেল বদলাতে পারে')}</span>
          </div>

          <Link
            href={levelHref}
            className="flex h-10 w-full items-center justify-center rounded-[10px] border border-[#f5a623] bg-white text-[14px] font-bold text-[#f5a623] hover:bg-[#fff8eb]/30 active:scale-[0.98] transition-all"
          >
            {t('পরীক্ষা দিন')}
          </Link>
        </div>

        {/* Recent results */}
        {displayResults.length > 0 && (
          <div>
            <p className="mb-2 text-[14px] font-bold text-learn-ink ml-1">{t('সাম্প্রতিক ফল')}</p>
            <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              {displayResults.map((r, i) => (
                <div
                  key={r.name + r.date}
                  className={cn('flex items-center justify-between gap-3 px-4 py-3.5', i > 0 && 'border-t border-learn-structure')}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-learn-ink">{r.name}</p>
                    <p className="text-[12px] text-learn-muted mt-0.5">{toBnDigits(r.date)}</p>
                  </div>
                  <span className={cn('rounded-full px-3 py-1 text-[13px] font-bold shrink-0', r.pillClass)}>
                    {toBnDigits(r.score)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full quiz history (top-bar History button) */}
      <BottomSheet open={historyOpen} onOpenChange={setHistoryOpen} title={t('ইতিহাস')}>
        {history.length > 0 ? (
          <div className="-mx-1 max-h-[52vh] overflow-y-auto px-1">
            {history.map((r, i) => (
              <div
                key={i}
                className={cn('flex items-center justify-between gap-3 py-3', i > 0 && 'border-t border-learn-structure')}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-learn-ink">{r.name}</p>
                  <p className="mt-0.5 text-[12px] text-learn-muted">{toBnDigits(r.date)}</p>
                </div>
                <span className={cn('shrink-0 rounded-full px-3 py-1 text-[13px] font-bold', r.pillClass)}>
                  {toBnDigits(r.score)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-[40px] text-learn-muted">history_toggle_off</span>
            <p className="mt-2 text-[14px] font-bold text-learn-ink">{t('এখনো কোনো কুইজ দেওয়া হয়নি')}</p>
            <p className="mt-1 text-[13px] text-learn-muted">{t('কুইজ দিলে এখানে ফলাফল দেখতে পাবেন')}</p>
          </div>
        )}
      </BottomSheet>
    </LearnerShell>
  );
}

const RESULTS = [
  { name: 'কুইক কুইজ', date: '১২ অক্টোবর, ২০২৪', score: '৮/১০', pillClass: 'bg-learn-success-tint text-learn-success' },
  { name: 'টপিক টেস্ট', date: '১০ অক্টোবর, ২০২৪', score: '১২/২০', pillClass: 'bg-[#fff8eb] text-[#f5a623]' },
  { name: 'কুইক কুইজ', date: '০৮ অক্টোবর, ২০২৪', score: '৫/১০', pillClass: 'bg-learn-danger-tint text-learn-danger' },
];
