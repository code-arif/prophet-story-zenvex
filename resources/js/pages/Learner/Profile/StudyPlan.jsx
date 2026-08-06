import React from 'react';
import { Head, router } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { postJson } from '../../../lib/api';
import LearnerShell from '../../../layouts/LearnerShell';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 30 — AI স্টাডি প্ল্যান / AI Study Plan (Stitch, feature 9).
 * Setup state (level/goal/time) then the 30-day plan view with today's
 * checkable items and upcoming days. The plan is generated and stored on
 * the server (POST /profile/study-plan/generate, toggle-task).
 */
export default function StudyPlan({
  planReady: initialPlanReady = false,
  level = 'A2',
  goal = 'চাকরি',
  dailyMinutes = 20,
  todayDay = null,
  todayTasks = [],
  doneItems = [],
  progressPercent = 0,
  upcoming = [],
}) {
  const [planReady, setPlanReady] = React.useState(initialPlanReady);
  const [done, setDone] = React.useState(() => new Set(doneItems));
  const { t } = useI18n();

  const toggle = (i) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    if (todayDay !== null) {
      postJson('/profile/study-plan/toggle-task', { day_number: todayDay, task_index: i }).catch(() => {});
    }
  };

  const generate = (values, onDone, onError) => {
    router.post('/profile/study-plan/generate', {
      level: values.level,
      goal: values.goal,
      dailyMinutes: values.minutes,
    }, {
      onFinish: () => onDone && onDone(),
      onError: () => onError && onError(),
    });
  };

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

  const customRight = planReady ? (
    <button
      type="button"
      onClick={() => setPlanReady(false)}
      className="flex h-12 w-auto whitespace-nowrap items-center rounded-full px-2 text-[13px] font-bold text-learn-ai transition-colors hover:bg-learn-ai-tint active:scale-95 cursor-pointer"
    >
      {t('আবার তৈরি করুন')}
    </button>
  ) : undefined;

  return (
    <LearnerShell
      activeTab="profile"
      left={customLeft}
      title={
        <span className="inline-flex items-center gap-1.5">
          <span className="text-[18px] font-bold text-learn-ink">{t('AI স্টাডি প্ল্যান')}</span>
          <span className="rounded-[6px] bg-learn-ai px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
            AI
          </span>
        </span>
      }
      right={customRight}
    >
      <div className="mt-2 space-y-4">
        <Head title={t('AI স্টাডি প্ল্যান')} />

        {!planReady ? (
          <SetupView
            initial={{ level, goal, minutes: dailyMinutes }}
            onCreate={generate}
          />
        ) : (
          <PlanView
            done={done}
            onToggle={toggle}
            todayDay={todayDay}
            todayTasks={todayTasks}
            progressPercent={progressPercent}
            upcoming={upcoming}
          />
        )}
      </div>
    </LearnerShell>
  );
}

function SetupView({ initial = {}, onCreate }) {
  const { t } = useI18n();
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState(null);

  const create = (values) => {
    if (generating) return;
    setError(null);
    setGenerating(true);
    onCreate(
      values,
      () => setGenerating(false),
      () => {
        setGenerating(false);
        setError(t('পরিকল্পনা তৈরি করা যায়নি — আবার চেষ্টা করুন।'));
      }
    );
  };

  const rows = [
    { label: 'লেভেল', value: initial.level || 'A2', options: [{ code: 'A1', label: 'A1' }, { code: 'A2', label: 'A2' }, { code: 'B1', label: 'B1' }] },
    { label: 'লক্ষ্য', value: initial.goal || 'চাকরি', options: [
      { code: 'চাকরি', label: 'চাকরি' },
      { code: 'পরীক্ষা', label: 'পরীক্ষা' },
      { code: 'বিদেশ যাত্রা', label: 'বিদেশ যাত্রা' },
      { code: 'সাধারণ উন্নতি', label: 'সাধারণ উন্নতি' },
    ] },
    { label: 'দৈনিক সময়', value: String(initial.minutes || 20), options: [
      { code: '10', label: '১০ মিনিট' },
      { code: '20', label: '২০ মিনিট' },
      { code: '30', label: '৩০ মিনিট' },
      { code: '60', label: '৬০ মিনিট' },
    ] },
  ];
  const [values, setValues] = React.useState({
    লেভেল: rows[0].value,
    লক্ষ্য: rows[1].value,
    'দৈনিক সময়': rows[2].value,
  });
  const [open, setOpen] = React.useState(null);

  return (
    <>
      <div className="flex flex-col items-center pt-2 text-center">
        <div className="relative flex size-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#f0edff] border-2 border-dashed border-[#7c6bf5]/45 animate-[spin_20s_linear_infinite]" />
          <span className="relative material-symbols-outlined text-[44px] text-[#7c6bf5]">calendar_today</span>
        </div>
        <h1 className="mt-4 text-[20px] font-bold text-learn-ink">{t('৩০ দিনের পরিকল্পনা তৈরি করুন')}</h1>
        <p className="mt-1 text-[13px] text-learn-muted">{t('একবার তৈরি হলে ইন্টারনেট ছাড়াই পুরো মাস চলবে')}</p>
      </div>

      <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
        {rows.map((r, i) => {
          const iconMap = {
            'লেভেল': 'leaderboard',
            'লক্ষ্য': 'work',
            'দৈনিক সময়': 'schedule'
          };
          const icon = iconMap[r.label] || 'info';
          const selectedOpt = r.options.find(o => o.code === values[r.label]);
          const displayLabel = selectedOpt ? selectedOpt.label : values[r.label];

          return (
            <div key={r.label} className={cn(i > 0 && 'border-t border-learn-structure')}>
              <button
                type="button"
                onClick={() => setOpen(open === r.label ? null : r.label)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 cursor-pointer hover:bg-learn-bg/50 transition-colors"
                aria-expanded={open === r.label}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-learn-ai">{icon}</span>
                  <span className="text-[16px] font-semibold text-learn-ink">{t(r.label)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded-full bg-learn-ai-tint px-3 py-1 text-[13px] font-semibold text-learn-ai">
                    {t(displayLabel)}
                  </span>
                  <span className={cn('material-symbols-outlined text-[20px] text-[#c3c6d5] transition-transform', open === r.label && 'rotate-90')}>
                    chevron_right
                  </span>
                </div>
              </button>
              {open === r.label && (
                <div className="flex flex-wrap gap-2 px-4 pb-3.5">
                  {r.options.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setValues((v) => ({ ...v, [r.label]: opt.code }));
                        setOpen(null);
                      }}
                      className={cn(
                        'h-12 rounded-full px-4 text-[13px] font-semibold transition-colors cursor-pointer',
                        values[r.label] === opt.code ? 'bg-learn-primary text-white' : 'bg-learn-bg text-learn-ink'
                      )}
                    >
                      {t(opt.label)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-[14px] bg-learn-warn-tint px-4 py-3 text-[13px] text-learn-warn">
        <span className="material-symbols-outlined text-[20px] shrink-0 text-[#f5a524]">wifi</span>
        <span>{t('তৈরি করার সময় একবার ইন্টারনেট লাগবে')}</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-[14px] bg-learn-danger-tint px-4 py-3 text-[13px] text-learn-danger">
          <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      <button
        disabled={generating}
        className={cn(
          'w-full h-[52px] flex items-center justify-center gap-2 rounded-[14px] bg-learn-ai hover:opacity-90 text-[16px] font-bold text-white active:scale-[0.98] transition-all cursor-pointer shadow-[0px_8px_20px_rgba(124,107,245,0.35)]',
          generating && 'opacity-70 cursor-not-allowed'
        )}
        onClick={() =>
          create({
            level: values.লেভেল,
            goal: values.লক্ষ্য,
            minutes: Number(values['দৈনিক সময়'] || '20') || 20,
          })
        }
      >
        {generating ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {t('AI পরিকল্পনা তৈরি হচ্ছে…')}
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px] font-variation-fill" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            {t('পরিকল্পনা তৈরি করুন')}
          </>
        )}
      </button>
    </>
  );
}

function PlanView({ done, onToggle, todayDay = 1, todayTasks = [], progressPercent = 0, upcoming = [] }) {
  const { t } = useI18n();

  const getTaskRoute = (title) => {
    if (!title) return null;
    const lower = title.toLowerCase();
    if (lower.includes('unit')) {
      return '/learn/lessons';
    }
    if (lower.includes('শব্দ') || lower.includes('vocabulary') || lower.includes('vocab')) {
      return '/learn/vocabulary';
    }
    if (lower.includes('উচ্চারণ') || lower.includes('pronunciation')) {
      return '/practice/pronunciation';
    }
    if (lower.includes('কুইজ') || lower.includes('টেস্ট') || lower.includes('quiz') || lower.includes('test')) {
      return '/practice/quiz';
    }
    if (lower.includes('লিসেনিং') || lower.includes('listening')) {
      return '/practice/listening';
    }
    if (lower.includes('ফ্রেজবুক') || lower.includes('phrasebook')) {
      return '/practice/phrasebook';
    }
    if (lower.includes('গ্রামার') || lower.includes('grammar')) {
      return '/learn/grammar';
    }
    if (lower.includes('রিডিং') || lower.includes('reading')) {
      return '/learn/reading';
    }
    if (lower.includes('লেখা') || lower.includes('writing')) {
      return '/practice/writing';
    }
    return null;
  };

  const handleTaskClick = (title) => {
    const route = getTaskRoute(title);
    if (route) {
      router.visit(route);
    }
  };

  return (
    <>
      {/* Today hero */}
      <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-bold text-learn-ink">{t('দিন {n} / ৩০', { n: toBnDigits(todayDay) })}</p>
          <span className="text-[13px] font-semibold text-learn-ai">{toBnDigits(progressPercent)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-learn-ai-tint">
          <div className="h-full rounded-full bg-learn-ai transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="mt-4 space-y-2.5">
          {todayTasks.map((item, i) => {
            const route = getTaskRoute(item.title);
            return (
              <div
                key={`${item.title}-${i}`}
                onClick={() => route && handleTaskClick(item.title)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-all group',
                  route ? 'cursor-pointer hover:bg-learn-primary-tint/10 active:scale-[0.99]' : '',
                  done.has(i) ? 'bg-learn-success-tint/60' : 'bg-learn-bg'
                )}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(i);
                  }}
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors cursor-pointer',
                    done.has(i) ? 'border-learn-success bg-learn-success text-white' : 'border-learn-muted/40'
                  )}
                >
                  {done.has(i) && <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>}
                </button>
                <span className={cn('flex-1 text-[14px] font-semibold', done.has(i) ? 'text-learn-muted line-through' : 'text-learn-ink')}>
                  {item.title}
                </span>
                {route && !done.has(i) && (
                  <span className="material-symbols-outlined text-[18px] text-learn-muted group-hover:text-learn-primary transition-colors">
                    chevron_right
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming days */}
      <div>
        <p className="mb-2 text-[14px] font-bold text-learn-ink ml-1">{t('আগামী দিনগুলো')}</p>
        <div className="space-y-2.5">
          {upcoming.map((d) => (
            <div key={d.dayNum} className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              {d.done ? (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-learn-success text-white">
                  <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                </span>
              ) : (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-learn-primary-tint text-[13px] font-bold text-learn-primary">
                  {toBnDigits(d.dayNum)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-learn-ink">{t('দিন {n}', { n: toBnDigits(d.dayNum) })}</p>
                <p className="truncate text-[13px] text-learn-muted">{d.summary}</p>
              </div>
              <span className="material-symbols-outlined text-[20px] shrink-0 text-learn-muted">chevron_right</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[13px] text-learn-muted mt-2">{t('পরিকল্পনাটি আপনার ডিভাইসে সংরক্ষিত — অফলাইনেও খুলবে')}</p>
    </>
  );
}

const TODAY = [
  { title: 'Unit 3 · Lesson 2' },
  { title: '১০টি নতুন শব্দ' },
  { title: '৫ মিনিট উচ্চারণ' },
];

const UPCOMING = [
  { dayNum: 10, summary: 'Unit 3 · Lesson 3 + রিভিউ কুইজ', done: false },
  { dayNum: 11, summary: 'ফ্রেজবুক — চাকরির ইন্টারভিউ', done: false },
  { dayNum: 12, summary: 'Unit 4 · Lesson 1 + ১০টি শব্দ', done: true },
  { dayNum: 13, summary: 'লিসেনিং প্র্যাকটিস ১৫ মিনিট', done: true },
];
