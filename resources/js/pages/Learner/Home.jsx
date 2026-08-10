import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, BookOpen, Check, Clock, ClipboardList, Flame, GraduationCap, MessageCircle, Mic, Pencil, Sparkles, Speaker, Target, Trophy, UserRound, Volume2 } from 'lucide-react';
import LearnerShell from '../../layouts/LearnerShell';
import { StreakChip } from '../../components/StreakChip';
import { ScoreRing } from '../../components/ScoreRing';
import { BottomSheet } from '../../components/BottomSheet';
import { RevealOnScroll } from '../../components/RevealOnScroll';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { toBnDigits } from '../../lib/format';
import { cn } from '../../lib/utils';
import { useI18n } from '../../lib/i18n';

const SUGGESTION_ICONS = {
  '/practice/pronunciation': Mic,
  '/practice/quiz': ClipboardList,
  '/practice/phrasebook': MessageCircle,
};

/**
 * Screen 07 — হোম / Home Hub (Stitch). The daily loop: today's lesson,
 * word of the day, due cards, weekly progress, suggestions, reminder.
 * All values come from the backend (Learner/HomeController).
 */
export default function Home({
  learner = { name: 'রিয়াদ', streak: 7, level: 'A2' },
  today = { day: 9, unit: 'Unit 3: Daily Routine', titleEn: 'Telling the Time', progress: 60, lessonId: null },
  wordOfDay = { word: 'reliable', bn: 'নির্ভরযোগ্য' },
  dueCards = 12,
  weekSkills = WEEK_SKILLS,
  weeklyMinutes = 0,
  weeklyGoal = 105,
  dailyMinutes = 15,
  weekBar = WEEK_BAR,
  stats = { lessons: 0, words: 0, quizzes: 0, aiChats: 0, totalMinutes: 0 },
  studyPlan = { generated: false, focus: null, progress: 0, upcoming: [] },
  focusSkill = { href: '/ai/voice', label: 'ভয়েস কোচে কথা বলুন', detail: 'উচ্চারণ আর সাবলীলতা বাড়াতে' },
  suggestions = SUGGESTIONS,
  reminder = { enabled: true, time: '21:00' },
  profileIncomplete = false,
}) {
  const { t } = useI18n();
  const [goalOpen, setGoalOpen] = React.useState(false);
  const weeklyPct = weeklyGoal > 0 ? Math.min(100, Math.round((weeklyMinutes / weeklyGoal) * 100)) : 0;
  const maxMin = Math.max(1, ...weekBar.map((b) => b.min));
  const todayFocus = studyPlan.focus;
  const doneTasks = (todayFocus?.tasks || []).filter((task) => task.done).length;
  const totalTasks = (todayFocus?.tasks || []).length;

  const setGoal = (min) => {
    setGoalOpen(false);
    router.post('/profile/goal', { dailyMinutes: min });
  };

  return (
    <>
      <Head title={t('হোম')} />
      <LearnerShell
      activeTab="home"
      left={
        <div className="leading-tight">
          <p className="text-[13px] text-learn-muted">{t(greeting())}</p>
          <p className="text-[16px] font-bold text-learn-ink">{learner.name}</p>
        </div>
      }
      right={
        <div className="flex items-center">
          <StreakChip days={learner.streak} />
          <Link
            href="/profile/settings"
            aria-label="বিজ্ঞপ্তি"
            className="ml-1 flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
          >
            <Bell className="size-5" strokeWidth={2} />
          </Link>
        </div>
      }
    >
      <div className="mt-2 space-y-4">
        {/* Onboarding incomplete — one combined card with the missing steps */}
        {profileIncomplete ? (
          <div className="rounded-[14px] border border-learn-warn/40 bg-learn-warn-tint p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-learn-warn ring-1 ring-learn-warn/25">
                <UserRound className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-learn-ink">{t('আপনার প্রোফাইল এখনো সম্পূর্ণ হয়নি')}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-learn-muted">
                  {t('নাম, লক্ষ্য আর লেভেল ঠিক করতে মাত্র ২ মিনিট লাগবে।')}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/welcome/profile"
                className="flex h-11 flex-1 items-center justify-center rounded-full bg-learn-primary px-4 text-[13px] font-bold text-white transition-all duration-150 hover:bg-learn-primary-dark active:scale-[0.98]"
              >
                {t('প্রোফাইল সম্পূর্ণ করুন')}
              </Link>
              {!learner.level && (
                <Link
                  href="/welcome/placement"
                  className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-learn-primary/30 bg-white px-4 text-[13px] font-bold text-learn-primary transition-all duration-150 hover:border-learn-primary/60 active:scale-[0.98]"
                >
                  <GraduationCap className="size-4" strokeWidth={2} />
                  {t('লেভেল পরীক্ষা দিন')}
                </Link>
              )}
            </div>
          </div>
        ) : !learner.level ? (
          <Link
            href="/welcome/placement"
            className="block rounded-[14px] border border-learn-primary/30 bg-learn-primary-tint p-4 transition-all duration-150 hover:border-learn-primary/60 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-learn-primary text-white">
                <GraduationCap className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-learn-ink">{t('আপনার লেভেল এখনো ঠিক হয়নি')}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-learn-muted">
                  {t('৫ মিনিটের পরীক্ষা দিয়ে লেভেল নির্ধারণ করুন')}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-learn-primary px-3.5 py-1.5 text-[13px] font-bold text-white">
                {t('পরীক্ষা দিন')}
              </span>
            </div>
          </Link>
        ) : null}

        {/* Today's lesson — primary card */}
        {today ? (
          <Link
            href={today.lessonId ? `/learn/lessons/${today.lessonId}` : '/learn/lessons'}
            className="block rounded-[14px] bg-learn-primary p-4 text-white shadow-[0px_8px_20px_rgba(43,89,195,0.18)]"
          >
            <span className="text-[13px] font-semibold text-white/85">
              {t('আজকের পড়া — দিন {n}', { n: toBnDigits(today.day) })}
            </span>
            <p className="mt-1 text-[17px] font-bold">{today.unit}</p>
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white" style={{ width: `${Math.max(6, today.progress)}%` }} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-bold text-learn-primary">
                {t('চালিয়ে যান')}
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/learn/lessons"
            className="block rounded-[14px] bg-learn-primary p-4 text-white shadow-[0px_8px_20px_rgba(43,89,195,0.18)]"
          >
            <span className="text-[13px] font-semibold text-white/85">{t('আজকের পড়া')}</span>
            <p className="mt-1 text-[17px] font-bold">{t('শেখা শুরু করুন')}</p>
            <div className="mt-4 flex justify-end">
              <span className="inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-bold text-learn-primary">
                {t('লেসন দেখুন')}
              </span>
            </div>
          </Link>
        )}

        {/* Lifetime stats grid — animated counters with staggered reveal */}
        <div className="grid grid-cols-4 gap-2">
          {STAT_CARDS({ stats }).map(({ Icon, label, value, tone }, idx) => (
            <RevealOnScroll key={label} delay={idx * 80}>
              <div className="flex flex-col items-center gap-1 rounded-[14px] bg-white px-1 py-3 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                <span
                  className="flex size-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: tone.bg, color: tone.fg }}
                >
                  <Icon className="size-4" strokeWidth={2} />
                </span>
                <span className="text-[17px] font-bold leading-none text-learn-ink">
                  <AnimatedCounter value={value} duration={700} />
                </span>
                <span className="text-[11px] leading-tight text-learn-muted">{label}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Weekly activity ring + 7-day bar — always visible; zero state for new learners */}
        <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center gap-4 p-4">
            <ScoreRing value={weeklyPct} size={92} stroke={9} tone="primary">
              <span className="text-[20px] font-bold text-learn-ink">{toBnDigits(weeklyMinutes)}</span>
              <span className="text-[11px] text-learn-muted">{t('মিনিট')}</span>
            </ScoreRing>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-learn-ink">{t('এই সপ্তাহের পড়ালেখা')}</h2>
                <button
                  type="button"
                  onClick={() => setGoalOpen(true)}
                  className="flex size-8 items-center justify-center rounded-full text-learn-muted transition-colors hover:bg-black/5 hover:text-learn-primary active:scale-90"
                  aria-label={t('দৈনিক লক্ষ্য পরিবর্তন')}
                >
                  <Pencil className="size-4" strokeWidth={2} />
                </button>
              </div>
              <p className="mt-0.5 text-[13px] leading-relaxed text-learn-muted">
                {weeklyMinutes === 0
                  ? t('লক্ষ্য {goal} মিনিট — প্রথম লেসন দিয়ে শুরু করুন', { goal: toBnDigits(weeklyGoal) })
                  : t('লক্ষ্য {goal} মিনিট — এখন {pct}%', { goal: toBnDigits(weeklyGoal), pct: toBnDigits(weeklyPct) })}
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-learn-border">
                <div
                  className="h-full rounded-full bg-learn-primary transition-all duration-500"
                  style={{ width: `${Math.max(4, weeklyPct)}%` }}
                />
              </div>
              {weeklyMinutes === 0 && (
                <Link
                  href="/learn/lessons"
                  className="mt-3 inline-flex h-8 items-center rounded-full bg-learn-primary px-3.5 text-[12px] font-bold text-white transition-all duration-150 hover:bg-learn-primary-dark active:scale-[0.97]"
                >
                  {t('শুরু করুন')}
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 border-t border-black/5 px-4 pb-4 pt-3">
            {weekBar.map(({ day, min, active }) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-14 w-full items-end justify-center">
                  <div
                    className={active
                      ? 'w-3 rounded-full bg-learn-primary'
                      : 'w-3 rounded-full bg-learn-primary/25'}
                    style={{ height: `${Math.max(8, (min / maxMin) * 100)}%` }}
                  />
                </div>
                <span className={active ? 'text-[11px] font-bold text-learn-primary' : 'text-[11px] text-learn-muted'}>
                  {toBnDigits(min)}
                </span>
                <span className="text-[11px] text-learn-muted">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart focus suggestion (weakest skill) */}
        <Link
          href={focusSkill.href}
          className="flex items-center gap-3 rounded-[14px] border border-learn-ai/30 bg-learn-ai-tint p-4 transition-all duration-150 hover:border-learn-ai/50 active:scale-[0.99]"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-learn-ai text-white">
            <Sparkles className="size-5" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-learn-ink">{t('বাড়ানোর টিপস')}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-learn-muted">{focusSkill.detail}</p>
          </div>
          <span className="shrink-0 rounded-full bg-learn-ai px-3.5 py-1.5 text-[13px] font-bold text-white">
            {focusSkill.label}
          </span>
        </Link>

        {/* AI study plan focus — always visible */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          {studyPlan.generated ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-learn-ink">{t('আজকের স্টাডি প্ল্যান')}</h2>
                <Link href="/profile/study-plan" className="text-[13px] font-semibold text-learn-primary">
                  {t('সম্পূর্ণ দেখুন')}
                </Link>
              </div>
              {todayFocus ? (
                <>
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-learn-primary-tint p-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-learn-primary text-white">
                      <Target className="size-5" strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-learn-ink">
                        {t('দিন {n}', { n: toBnDigits(todayFocus.day_number) })} — {todayFocus.summary}
                      </p>
                      {totalTasks > 0 && (
                        <p className="mt-0.5 text-[12px] text-learn-muted">
                          {toBnDigits(doneTasks)}/{toBnDigits(totalTasks)} {t('কাজ সম্পন্ন')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-learn-border">
                      <div className="h-full rounded-full bg-learn-ai transition-all duration-500" style={{ width: `${Math.max(4, studyPlan.progress)}%` }} />
                    </div>
                    <span className="text-[13px] font-bold text-learn-ai">{toBnDigits(studyPlan.progress)}%</span>
                  </div>
                  {studyPlan.upcoming.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {studyPlan.upcoming.map((d) => (
                        <div key={d.dayNum} className="flex items-center gap-2 rounded-lg bg-black/[0.03] px-3 py-2">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-learn-ai-tint text-[11px] font-bold text-learn-ai">
                            {toBnDigits(d.dayNum)}
                          </span>
                          <span className="truncate text-[13px] text-learn-ink">{d.summary}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : todayFocus === null && studyPlan.progress > 0 ? (
                <p className="mt-3 text-[13px] text-learn-muted">{t('৩০ দিনের প্ল্যান শেষ!')}</p>
              ) : (
                <Link
                  href="/profile/study-plan"
                  className="mt-0 flex items-center gap-3 rounded-xl border border-dashed border-learn-primary/40 p-3"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-learn-primary-tint text-learn-primary">
                    <GraduationCap className="size-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-learn-ink">{t('নিজস্ব স্টাডি প্ল্যান তৈরি করুন')}</p>
                    <p className="text-[12px] text-learn-muted">{t('৩০ দিনের AI–নির্ধারিত রুটিন')}</p>
                  </div>
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/profile/study-plan"
              className="flex items-center gap-3"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-learn-ai-tint text-learn-ai">
                <GraduationCap className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-learn-ink">{t('এখনো কোনো স্টাডি প্ল্যান নেই')}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-learn-muted">
                  {t('AI আপনার জন্য ৩০ দিনের রুটিন তৈরি করবে — আপনার লেভেল আর লক্ষ্য অনুযায়ী')}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-learn-ai px-3.5 py-1.5 text-[13px] font-bold text-white">
                {t('তৈরি করুন')}
              </span>
            </Link>
          )}
        </div>

        {/* Word of the day + due cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/learn/vocabulary" className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <p className="text-[13px] font-semibold text-learn-muted">{t('আজকের শব্দ')}</p>
            <p className="mt-1 text-[18px] font-bold text-learn-ink">{wordOfDay.word}</p>
            <p className="text-[13px] text-learn-muted">{wordOfDay.bn}</p>
            <span className="mt-2 inline-flex size-8 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary">
              <Speaker className="size-4" strokeWidth={2} />
            </span>
          </Link>
          <Link href="/learn/vocabulary/review" className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            {dueCards > 0 ? (
              <>
                <p className="text-[13px] font-semibold text-learn-muted">{t('পুনরাবৃত্তি বাকি')}</p>
                <p className="mt-1 text-[28px] font-bold leading-none text-learn-primary">{toBnDigits(dueCards)}</p>
                <p className="mt-1 text-[13px] text-learn-muted">{t('টি কার্ড')}</p>
                <span className="mt-2 inline-block text-[13px] font-semibold text-learn-primary">{t('শুরু')}</span>
              </>
            ) : (
              <div className="flex flex-col items-center py-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-learn-success-tint text-learn-success">
                  <Check className="size-4" strokeWidth={2.5} />
                </span>
                <p className="mt-2 text-[13px] font-semibold text-learn-success">{t('সব পড়া শেষ')}</p>
                <p className="text-[12px] text-learn-muted">{t('নতুন শব্দ যোগ করুন')}</p>
              </div>
            )}
          </Link>
        </div>

        {/* Weekly progress skills — always visible; hint line when all scores are 0 */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-learn-ink">{t('এই সপ্তাহের অগ্রগতি')}</h2>
            <Link href="/profile/progress" className="text-[13px] font-semibold text-learn-primary">
              {t('বিস্তারিত')}
            </Link>
          </div>
          {weekSkills.every((s) => s.pct === 0) && (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-learn-primary-tint px-3 py-2.5 text-[13px] leading-relaxed text-learn-primary">
              <GraduationCap className="size-4 shrink-0" strokeWidth={2} />
              {t('এখনো কোনো স্কোর নেই — পড়া, শোনা, বলা, লেখা এখানে দেখাবে')}
            </p>
          )}
          <div className="mt-4 flex items-end justify-between px-2">
            {weekSkills.map(({ bn, pct }) => (
              <div key={bn} className="flex flex-col items-center gap-1.5">
                <div className="flex h-16 items-end">
                  <div
                    className={cn('w-2.5 rounded-full', pct > 0 ? 'bg-learn-primary' : 'bg-learn-primary/20')}
                    style={{ height: `${Math.max(8, pct)}%` }}
                  />
                </div>
                <span className="text-[13px] text-learn-muted">{bn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions strip */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {suggestions.map(({ href, Icon, label }) => {
            const SugIcon = Icon || SUGGESTION_ICONS[href] || Speaker;
            return (
              <Link
                key={href}
                href={href}
                className="flex w-36 shrink-0 flex-col items-start gap-2 rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-learn-primary-tint text-learn-primary">
                  <SugIcon className="size-4.5" strokeWidth={2} />
                </span>
                <span className="text-[13px] font-semibold text-learn-ink">{t(label)}</span>
              </Link>
            );
          })}
        </div>

        {/* Reminder row */}
        <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <Clock className="size-5 shrink-0 text-learn-muted" strokeWidth={2} />
          <p className="flex-1 text-[13px] text-learn-ink">
            {reminder.enabled
              ? t('প্রতিদিন {time}টায় মনে করিয়ে দেব', { time: toBnDigits(reminder.time || '21:00') })
              : t('রিমাইন্ডার বন্ধ আছে — সেটিংসে চালু করুন')}
          </p>
          <Link href="/profile/settings" className="text-[13px] font-semibold text-learn-primary">
            {t('বদলান')}
          </Link>
        </div>
        {/* Daily goal picker */}
        <BottomSheet open={goalOpen} onOpenChange={setGoalOpen} title={t('দৈনিক পড়ার লক্ষ্য')}>
          <p className="mb-3 text-[13px] text-learn-muted">{t('প্রতিদিন কত মিনিট পড়তে চান?')}</p>
          <div className="grid grid-cols-3 gap-2">
            {GOAL_OPTIONS.map((m) => {
              const selected = toBnDigits(m) === toBnDigits(dailyMinutes);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setGoal(m)}
                  className={selected
                    ? 'flex h-12 items-center justify-center rounded-[12px] bg-learn-primary text-[15px] font-bold text-white transition-colors active:scale-[0.97]'
                    : 'flex h-12 items-center justify-center rounded-[12px] bg-learn-primary-tint text-[15px] font-semibold text-learn-primary transition-colors hover:bg-learn-primary/15 active:scale-[0.97]'
                  }
                >
                  {toBnDigits(m)} {t('মি')}
                </button>
              );
            })}
          </div>
        </BottomSheet>
      </div>
      </LearnerShell>
    </>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'শুভ সকাল';
  if (h < 16) return 'শুভ দুপুর';
  return 'শুভ সন্ধ্যা';
}

const WEEK_SKILLS = [
  { bn: 'পড়া', pct: 70 },
  { bn: 'শোনা', pct: 55 },
  { bn: 'বলা', pct: 40 },
  { bn: 'লেখা', pct: 50 },
];

const SUGGESTIONS = [
  { href: '/practice/pronunciation', Icon: Mic, label: 'উচ্চারণ ২ মিনিট' },
  { href: '/practice/quiz', Icon: ClipboardList, label: 'একটি কুইজ' },
  { href: '/practice/phrasebook', Icon: MessageCircle, label: 'ফ্রেজবুক দেখুন' },
];

const WEEK_BAR = [
  { day: 'শ', min: 20, active: false },
  { day: 'র', min: 35, active: false },
  { day: 'সো', min: 15, active: false },
  { day: 'ম', min: 45, active: true },
  { day: 'বু', min: 0, active: false },
  { day: 'বৃ', min: 0, active: false },
  { day: 'শু', min: 0, active: false },
];

function STAT_CARDS({ stats }) {
  const cards = [
    { Icon: BookOpen, label: 'লেসন', value: stats.lessons, tone: { bg: '#eaf0fc', fg: '#2B59C3' } },
    { Icon: Volume2, label: 'শব্দ', value: stats.words, tone: { bg: '#f0edff', fg: '#7C6BF5' } },
    { Icon: Trophy, label: 'কুইজ', value: stats.quizzes, tone: { bg: '#e6f6ef', fg: '#17A673' } },
    { Icon: Flame, label: 'এআই চ্যাট', value: stats.aiChats, tone: { bg: '#fef0e6', fg: '#f5a524' } },
  ];
  // Raw numbers — AnimatedCounter converts to Bengali digits internally.
  return cards.map(({ Icon, label, value, tone }) => ({ Icon, label, value, tone }));
}

const GOAL_OPTIONS = [5, 10, 15, 20, 30, 45, 60];
