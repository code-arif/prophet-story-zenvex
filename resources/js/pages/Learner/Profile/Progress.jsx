import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { BottomSheet } from '../../../components/BottomSheet';
import { useI18n } from '../../../lib/i18n';
import { Facebook, X, MessageCircle, Copy, Check } from 'lucide-react';

/**
 * Screen 29 — অগ্রগতি ড্যাশবোর্ড / Progress Dashboard (Stitch, feature 11).
 * Four-skill bars, streak calendar, weekly minutes chart and the weakest-skill
 * suggestion. All numbers come from the learner's progress logs.
 */
export default function Progress({
  range = 'all',
  skills = SKILL_BASE,
  streak = 7,
  week = WEEK,
  weekly = WEEKLY,
  weeklyMinutes = 145,
  weakestBn = 'বলা',
  nextStepHref = '/practice/pronunciation',
}) {
  const [shareOpen, setShareOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const copyTimer = React.useRef(null);
  const { t } = useI18n();
  const { settings } = usePage().props;
  const brandName = settings?.brandName || 'Learn English';

  const currentSkills = Array.isArray(skills) ? skills : [];
  const pctOf = (label) => {
    const row = currentSkills.find((s) => s.label === label);
    return row ? toBnDigits(row.value) : '0';
  };

  /** Switch the time range — server-side partial reload keeps the weakest-skill hint in sync. */
  const handleRangeChange = (value) => {
    if (value === range) return;
    router.visit('/profile/progress', {
      preserveState: true,
      only: ['skills', 'weakestBn', 'nextStepHref', 'range'],
      data: { range: value }, // Inertia 2: GET data is merged into the query string
    });
  };

  /** Human-readable progress summary shared on social media. */
  const buildShareText = () =>
    t(
      'আমি {app}-এ ইংরেজি শিখছি! 🔥 {streak} দিনের স্ট্রিক, এই সপ্তাহে {minutes} মিনিট অনুশীলন করেছি। পড়া {r}%, শোনা {l}%, লেখা {w}%, বলা {s}% — তুমিও শুরু করো!',
      {
        app: brandName,
        streak: toBnDigits(streak),
        minutes: toBnDigits(weeklyMinutes),
        r: pctOf('পড়া'),
        l: pctOf('শোনা'),
        w: pctOf('লেখা'),
        s: pctOf('বলা'),
      }
    );

  /** Share via the native sheet when available, else open the share sheet. */
  const handleShare = async () => {
    const shareData = {
      title: t('আমার শেখার অগ্রগতি'),
      text: buildShareText(),
      url: window.location.origin, // public landing — recipients need no login
    };
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return; // user closed the sheet
      }
    }
    setShareOpen(true);
  };

  /** Open the given network's share intent in a new tab. */
  const shareTo = (network) => {
    const text = buildShareText();
    const url = window.location.origin; // public landing — recipients need no login
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };
    window.open(links[network], '_blank', 'noopener,noreferrer,width=640,height=640');
    setShareOpen(false);
  };

  /** Copy the progress summary (+ link) to the clipboard. */
  const copyShare = async () => {
    const text = `${buildShareText()}\n${window.location.origin}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard failures
    }
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

  const customRight = (
    <button
      type="button"
      aria-label={t('শেয়ার করুন')}
      onClick={handleShare}
      className="-mr-2 flex size-12 items-center justify-center rounded-full text-learn-primary hover:bg-learn-primary/10 active:scale-95 transition-all cursor-pointer"
    >
      <span className="material-symbols-outlined text-[24px]">share</span>
    </button>
  );

  const bnDayName = (day) => {
    const mapping = {
      'শ': 'শনি',
      'র': 'রবি',
      'সো': 'সোম',
      'ম': 'মঙ্গল',
      'বু': 'বুধ',
      'বৃ': 'বৃহ',
      'শু': 'শুক্র'
    };
    return mapping[day] || day;
  };

  const getNextStepText = (skill) => {
    const skillName = skill || 'বলা';
    if (skillName === 'পড়া') {
      return t('পড়া দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট রিডিং প্র্যাকটিসে সময় দিন');
    } else if (skillName === 'শোনা') {
      return t('শোনা দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট লিসেনিং প্র্যাকটিসে সময় দিন');
    } else if (skillName === 'লেখা') {
      return t('লেখা দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট রাইটিং ডেস্কে সময় দিন');
    } else {
      return t('বলা দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট উচ্চারণ স্টুডিওতে সময় দিন');
    }
  };

  return (
    <LearnerShell
      activeTab="profile"
      title={<span className="text-[18px] font-bold text-learn-primary">{t('অগ্রগতি')}</span>}
      left={customLeft}
      right={customRight}
    >
      <div className="mt-2 space-y-4">
        <Head title={t('অগ্রগতি')} />

        <SegmentedControl
          value={range}
          onChange={handleRangeChange}
          tone="light"
          options={[
            { label: t('সব সময়'), value: 'all' },
            { label: t('সপ্তাহ'), value: 'week' },
            { label: t('মাস'), value: 'month' },
          ]}
        />

        {/* Four skills */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="mb-3 text-[14px] font-bold text-learn-ink">{t('চার দক্ষতা')}</p>
          <div className="space-y-3">
            {skills.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-learn-ink">{t(s.label)}</span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[11px] font-bold',
                        s.delta >= 0 ? 'bg-learn-success-tint text-learn-success' : 'bg-learn-danger-tint text-learn-danger'
                      )}
                    >
                      {s.delta >= 0 ? '+' : ''}{toBnDigits(s.delta)}%
                    </span>
                  </div>
                  <span className="font-bold text-learn-ink">{toBnDigits(s.value)}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-learn-structure">
                  <div className={cn('h-full rounded-full', s.tone)} style={{ width: `${s.value}%` }} />
                </div>
                {s.weakest && (
                  <span className="mt-1 inline-block rounded-full bg-learn-warn-tint px-2 py-0.5 text-[11px] font-bold text-learn-warn">
                    {t('দুর্বলতম')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Streak calendar */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center gap-2 text-[15px] font-bold text-learn-ink">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#FEF4E1] text-[#F5A524]">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>whatshot</span>
            </div>
            <span>{t('{n} দিনের স্ট্রিক', { n: toBnDigits(streak) })}</span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {week.map((d, i) => {
              const displayLabel = d.label === 'বৃ' ? 'বি' : d.label;
              return (
                <div key={d.label} className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full',
                      d.done ? 'bg-learn-success text-white' :
                      d.today ? 'bg-white border-2 border-learn-primary text-learn-primary font-bold' :
                      'bg-[#eaf0fc]'
                    )}
                  >
                    {d.done ? (
                      <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                    ) : d.today ? (
                      <span className="text-[13px] font-bold">{displayLabel}</span>
                    ) : null}
                  </span>
                  <span className="text-[13px] text-learn-muted">{displayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly minutes */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-learn-ink">{t('সাপ্তাহিক সময়')}</p>
              <p className="text-[13px] font-bold text-learn-primary mt-1">
                {t('এই সপ্তাহে {n} মিনিট', { n: toBnDigits(weeklyMinutes) })}
              </p>
            </div>
            <span className="material-symbols-outlined text-[20px] text-learn-muted">show_chart</span>
          </div>
          <div className="flex h-32 items-end justify-between gap-2 mt-4">
            {weekly.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={cn('w-full max-w-[22px] rounded-t-md', d.active ? 'bg-learn-primary' : 'bg-learn-primary/30')}
                  style={{ height: `${Math.min(96, (d.min / Math.max(1, weeklyMinutes)) * 96)}px` }}
                />
                <span className="text-[13px] text-learn-muted">{bnDayName(d.day)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next step */}
        <div className="rounded-[14px] border-l-[4px] border-learn-warn bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-learn-warn" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            <p className="text-[14px] font-bold text-learn-ink">{t('পরবর্তী পদক্ষেপ')}</p>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-learn-muted">
            {getNextStepText(weakestBn)}
          </p>
          <Link
            href={nextStepHref}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-learn-primary text-[15px] font-bold text-white hover:bg-learn-primary-dark active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{t('শুরু করুন')}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <p className="text-center text-[13px] text-learn-muted">{t('সব হিসাব আপনার ডিভাইতেই থাকে')}</p>
      </div>

      {/* Share sheet (fallback when the native Web Share API is unavailable) */}
      <BottomSheet open={shareOpen} onOpenChange={setShareOpen} title={t('শেয়ার করুন')}>
        {/* Preview of the shared text */}
        <div className="rounded-[14px] bg-learn-bg p-4 ring-1 ring-learn-border">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[18px] text-learn-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              trending_up
            </span>
            <p className="text-[13px] font-bold text-learn-ink">{t('আমার শেখার অগ্রগতি')}</p>
          </div>
          <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-learn-muted">
            {buildShareText()}
          </p>
        </div>

        {/* Social networks */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { key: 'facebook', label: 'Facebook', icon: <Facebook className="size-[18px]" />, bg: 'bg-[#1877F2]' },
            { key: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="size-[18px]" />, bg: 'bg-[#25D366]' },
            { key: 'x', label: 'X', icon: <X className="size-[18px]" />, bg: 'bg-[#14171A]' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => shareTo(opt.key)}
              className="flex flex-col items-center gap-2 rounded-[14px] py-3 ring-1 ring-learn-border transition-all hover:bg-learn-bg active:scale-[0.97] cursor-pointer"
            >
              <span className={cn('flex size-12 items-center justify-center rounded-full text-white shadow-sm', opt.bg)}>
                {opt.icon}
              </span>
              <span className="text-[12px] font-bold text-learn-ink">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Copy to clipboard */}
        <button
          type="button"
          onClick={copyShare}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-learn-primary-tint text-[14px] font-bold text-learn-primary transition-all hover:bg-learn-primary/15 active:scale-[0.98] cursor-pointer"
        >
          {copied ? <Check className="size-[18px]" /> : <Copy className="size-[18px]" />}
          <span>{copied ? t('কপি হয়েছে!') : t('কপি করুন')}</span>
        </button>
      </BottomSheet>
    </LearnerShell>
  );
}

const SKILL_BASE = [
  { label: 'পড়া', value: 60, delta: 2, tone: 'bg-learn-primary' },
  { label: 'শোনা', value: 52, delta: 1, tone: 'bg-learn-primary' },
  { label: 'লেখা', value: 45, delta: -1, tone: 'bg-learn-primary' },
  { label: 'বলা', value: 38, delta: 4, tone: 'bg-learn-warn', weakest: true },
];

const WEEK = [
  { label: 'শ', done: true },
  { label: 'র', done: true },
  { label: 'সো', done: true },
  { label: 'ম', done: true },
  { label: 'বু', done: true },
  { label: 'বৃ', done: false, today: true },
  { label: 'শু', done: false },
];

const WEEKLY = [
  { day: 'শ', min: 18 },
  { day: 'র', min: 26 },
  { day: 'সো', min: 22 },
  { day: 'ম', min: 30 },
  { day: 'বু', min: 24 },
  { day: 'বৃ', min: 16, active: true },
  { day: 'শু', min: 9 },
];
