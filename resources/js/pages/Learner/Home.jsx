import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bell, Clock, ClipboardList, GraduationCap, MessageCircle, Mic, Speaker, UserRound } from 'lucide-react';
import LearnerShell from '../../layouts/LearnerShell';
import { StreakChip } from '../../components/StreakChip';
import { toBnDigits } from '../../lib/format';

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
  suggestions = SUGGESTIONS,
  reminder = { enabled: true, text: 'আগামীকাল রাত ৯টায় মনে করিয়ে দেব' },
  profileIncomplete = false,
}) {
  return (
    <>
      <Head title="হোম" />
      <LearnerShell
      activeTab="home"
      left={
        <div className="leading-tight">
          <p className="text-[13px] text-learn-muted">{greeting()}</p>
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
                <p className="text-[14px] font-bold text-learn-ink">আপনার প্রোফাইল এখনো সম্পূর্ণ হয়নি</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-learn-muted">
                  নাম, লক্ষ্য আর লেভেল ঠিক করতে মাত্র ২ মিনিট লাগবে।
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/welcome/profile"
                className="flex h-11 flex-1 items-center justify-center rounded-full bg-learn-primary px-4 text-[13px] font-bold text-white transition-all duration-150 hover:bg-learn-primary-dark active:scale-[0.98]"
              >
                প্রোফাইল সম্পূর্ণ করুন
              </Link>
              {!learner.level && (
                <Link
                  href="/welcome/placement"
                  className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-learn-primary/30 bg-white px-4 text-[13px] font-bold text-learn-primary transition-all duration-150 hover:border-learn-primary/60 active:scale-[0.98]"
                >
                  <GraduationCap className="size-4" strokeWidth={2} />
                  লেভেল পরীক্ষা দিন
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
                <p className="text-[14px] font-bold text-learn-ink">আপনার লেভেল এখনো ঠিক হয়নি</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-learn-muted">
                  ৫ মিনিটের পরীক্ষা দিয়ে লেভেল নির্ধারণ করুন
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-learn-primary px-3.5 py-1.5 text-[13px] font-bold text-white">
                পরীক্ষা দিন
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
            <span className="text-[13px] font-semibold text-white/85">আজকের পড়া — দিন {toBnDigits(today.day)}</span>
            <p className="mt-1 text-[17px] font-bold">{today.unit}</p>
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white" style={{ width: `${Math.max(6, today.progress)}%` }} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-bold text-learn-primary">
                চালিয়ে যান
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/learn/lessons"
            className="block rounded-[14px] bg-learn-primary p-4 text-white shadow-[0px_8px_20px_rgba(43,89,195,0.18)]"
          >
            <span className="text-[13px] font-semibold text-white/85">আজকের পড়া</span>
            <p className="mt-1 text-[17px] font-bold">শেখা শুরু করুন</p>
            <div className="mt-4 flex justify-end">
              <span className="inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-bold text-learn-primary">
                লেসন দেখুন
              </span>
            </div>
          </Link>
        )}

        {/* Word of the day + due cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/learn/vocabulary" className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <p className="text-[13px] font-semibold text-learn-muted">আজকের শব্দ</p>
            <p className="mt-1 text-[18px] font-bold text-learn-ink">{wordOfDay.word}</p>
            <p className="text-[13px] text-learn-muted">{wordOfDay.bn}</p>
            <span className="mt-2 inline-flex size-8 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary">
              <Speaker className="size-4" strokeWidth={2} />
            </span>
          </Link>
          <Link href="/learn/vocabulary/review" className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <p className="text-[13px] font-semibold text-learn-muted">পুনরাবৃত্তি বাকি</p>
            <p className="mt-1 text-[28px] font-bold leading-none text-learn-primary">{toBnDigits(dueCards)}</p>
            <p className="mt-1 text-[13px] text-learn-muted">টি কার্ড</p>
            <span className="mt-2 inline-block text-[13px] font-semibold text-learn-primary">শুরু</span>
          </Link>
        </div>

        {/* Weekly progress */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-learn-ink">এই সপ্তাহের অগ্রগতি</h2>
            <Link href="/profile/progress" className="text-[13px] font-semibold text-learn-primary">
              বিস্তারিত
            </Link>
          </div>
          <div className="mt-4 flex items-end justify-between px-2">
            {weekSkills.map(({ bn, pct }) => (
              <div key={bn} className="flex flex-col items-center gap-1.5">
                <div className="flex h-16 items-end">
                  <div
                    className="w-2.5 rounded-full bg-learn-primary"
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
                <span className="text-[13px] font-semibold text-learn-ink">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Reminder row */}
        <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <Clock className="size-5 shrink-0 text-learn-muted" strokeWidth={2} />
          <p className="flex-1 text-[13px] text-learn-ink">{reminder.text}</p>
          <Link href="/profile/settings" className="text-[13px] font-semibold text-learn-primary">
            বদলান
          </Link>
        </div>
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
