import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bell, Clock, ClipboardList, MessageCircle, Mic, Speaker } from 'lucide-react';
import LearnerShell from '../../layouts/LearnerShell';
import { StreakChip } from '../../components/StreakChip';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 07 — হোম / Home Hub (Stitch). The daily loop: today's lesson,
 * word of the day, due cards, weekly progress, suggestions, reminder.
 * Props come from the backend later; until then demo values render.
 */
export default function Home({ learner = { name: 'রিয়াদ', streak: 7 } }) {
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
        {/* Today's lesson — primary card */}
        <Link
          href="/learn/lessons"
          className="block rounded-[14px] bg-learn-primary p-4 text-white shadow-[0px_8px_20px_rgba(43,89,195,0.18)]"
        >
          <span className="text-[13px] font-semibold text-white/85">আজকের পড়া — দিন {toBnDigits(9)}</span>
          <p className="mt-1 text-[17px] font-bold">Unit 3: Daily Routine</p>
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: '60%' }} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <span className="inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-bold text-learn-primary">
              চালিয়ে যান
            </span>
          </div>
        </Link>

        {/* Word of the day + due cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/learn/vocabulary" className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <p className="text-[13px] font-semibold text-learn-muted">আজকের শব্দ</p>
            <p className="mt-1 text-[18px] font-bold text-learn-ink">reliable</p>
            <p className="text-[13px] text-learn-muted">নির্ভরযোগ্য</p>
            <span className="mt-2 inline-flex size-8 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary">
              <Speaker className="size-4" strokeWidth={2} />
            </span>
          </Link>
          <Link href="/learn/vocabulary/review" className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <p className="text-[13px] font-semibold text-learn-muted">পুনরাবৃত্তি বাকি</p>
            <p className="mt-1 text-[28px] font-bold leading-none text-learn-primary">{toBnDigits(12)}</p>
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
            {WEEK_SKILLS.map(({ bn, pct }) => (
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
          {SUGGESTIONS.map(({ href, Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex w-36 shrink-0 flex-col items-start gap-2 rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-learn-primary-tint text-learn-primary">
                <Icon className="size-4.5" strokeWidth={2} />
              </span>
              <span className="text-[13px] font-semibold text-learn-ink">{label}</span>
            </Link>
          ))}
        </div>

        {/* Reminder row */}
        <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <Clock className="size-5 shrink-0 text-learn-muted" strokeWidth={2} />
          <p className="flex-1 text-[13px] text-learn-ink">আগামীকাল রাত ৯টায় মনে করিয়ে দেব</p>
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
