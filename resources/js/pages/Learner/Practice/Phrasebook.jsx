import React from 'react';
import { Head } from '@inertiajs/react';
import { Briefcase, Building2, GraduationCap, Phone, Plane, Search, ShoppingBag, Star, Stethoscope } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { postJson } from '../../../lib/api';
import LearnerShell from '../../../layouts/LearnerShell';
import { SpeakerButton } from '../../../components/SpeakerButton';

/**
 * Screen 26 — ফ্রেজবুক / Real-Life Phrasebook (Stitch, feature 16).
 * Situation chips + grouped phrases, each with a speaker and a star (saved).
 * Phrases + favourites come from the backend (POST toggles a favourite).
 */
export default function Phrasebook({ situations = SITUATIONS, savedIds = [] }) {
  const situationKeys = Object.keys(situations).filter((k) => (situations[k] || []).length > 0);
  const [situation, setSituation] = React.useState(situationKeys[0] || 'interview');
  const [saved, setSaved] = React.useState(() => new Set(savedIds.map(String)));
  const [query, setQuery] = React.useState('');

  const toggleSaved = (id) => {
    const key = String(id);
    const next = new Set(saved);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSaved(next);
    postJson('/practice/phrasebook/toggle', { phrase_id: Number(id) }).catch(() => {
      // revert on failure
      setSaved(saved);
    });
  };

  const groups = situations[situation] || [];
  const filtered = query.trim()
    ? groups.map((g) => ({ ...g, phrases: g.phrases.filter((p) => p.en.toLowerCase().includes(query.toLowerCase()) || p.bn.includes(query)) })).filter((g) => g.phrases.length > 0)
    : groups;

  return (
    <LearnerShell
      showBack
      activeTab="practice"
      title="ফ্রেজবুক"
      right={
        <button type="button" aria-label="সংরক্ষিত" className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <Star className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title="ফ্রেজবুক" />

        {/* Search */}
        <div className="flex h-12 items-center gap-2.5 rounded-[14px] bg-white px-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <Search className="size-4 shrink-0 text-learn-muted" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="পরিস্থিতি বা বাক্য খুঁজুন…"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-learn-ink placeholder:text-learn-muted/60 focus:outline-none"
          />
        </div>

        {/* Situation chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SITUATION_LIST.filter((s) => situationKeys.includes(s.value)).map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => { setSituation(s.value); setQuery(''); }}
              className={cn(
                'flex h-12 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors',
                situation === s.value ? 'bg-learn-primary text-white' : 'bg-white text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]'
              )}
            >
              <s.icon className="size-4" strokeWidth={2} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Phrases */}
        {filtered.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-learn-muted">{group.label}</p>
            <div className="space-y-2.5">
              {group.phrases.map((p) => {
                const id = String(p.id);
                const isSaved = saved.has(id);
                return (
                  <div key={id} className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold leading-snug text-learn-ink">{p.en}</p>
                        <p className="mt-1 text-[13px] text-learn-muted">{p.bn}</p>
                        {p.note && <p className="mt-1 text-[13px] italic text-learn-muted/70">{p.note}</p>}
                      </div>
                      <div className="flex shrink-0 flex-col items-center gap-2">
                        <SpeakerButton text={p.en} size="sm" />
                        <button
                          type="button"
                          aria-label="সংরক্ষণ করুন"
                          onClick={() => toggleSaved(id)}
                          className="flex size-12 items-center justify-center rounded-full transition-colors"
                        >
                          <Star
                            className={cn('size-4', isSaved ? 'fill-learn-warn text-learn-warn' : 'text-learn-muted')}
                            strokeWidth={2}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-center text-[13px] text-learn-muted">সব বাক্য অফলাইনে পাওয়া যাবে</p>
      </div>
    </LearnerShell>
  );
}

const SITUATION_LIST = [
  { label: 'চাকরির ইন্টারভিউ', value: 'interview', icon: Briefcase },
  { label: 'ডাক্তারের চেম্বার', value: 'doctor', icon: Stethoscope },
  { label: 'ব্যাংক', value: 'bank', icon: Building2 },
  { label: 'বিমানবন্দর', value: 'airport', icon: Plane },
  { label: 'শ্রেণিকক্ষ', value: 'classroom', icon: GraduationCap },
  { label: 'দোকান', value: 'shop', icon: ShoppingBag },
  { label: 'ফোনালাপ', value: 'phone', icon: Phone },
];

const SITUATIONS = {
  interview: [
    {
      label: 'শুরুতে',
      phrases: [
        { en: 'Thank you for having me.', bn: 'আমাকে ডাকার জন্য ধন্যবাদ।', note: 'সাক্ষাৎকার শুরুর সময়' },
        { en: 'Could you please tell me more about the role?', bn: 'পদটি সম্পর্কে আরেকটু বলবেন কি?', note: 'সাক্ষাৎকারের শেষে প্রশ্ন করার সময়' },
        { en: 'I have been working on this for three years.', bn: 'আমি এ নিয়ে তিন বছর ধরে কাজ করছি।' },
      ],
    },
    {
      label: 'শেষে',
      phrases: [
        { en: 'It was nice talking to you.', bn: 'আপনার সাথে কথা বলে ভালো লাগলো।' },
        { en: 'When can I expect to hear from you?', bn: 'কখন উত্তর পাবো বলে আশা করতে পারি?' },
      ],
    },
  ],
  doctor: [
    {
      label: 'লক্ষণ বলার সময়',
      phrases: [
        { en: 'I have been feeling a fever since yesterday.', bn: 'গতকাল থেকে জ্বর অনুভব করছি।' },
        { en: 'It hurts when I swallow.', bn: 'গিলতে গেলে ব্যথা হয়।' },
        { en: 'I am allergic to penicillin.', bn: 'পেনিসিলিনে আমার অ্যালার্জি আছে।' },
      ],
    },
  ],
  bank: [
    {
      label: 'সাধারণ',
      phrases: [
        { en: 'I would like to open a savings account.', bn: 'সঞ্চয় হিসাব খুলতে চাই।' },
        { en: 'Could you check my balance, please?', bn: 'আমার ব্যালেন্সটা একটু দেখবেন কি?' },
      ],
    },
  ],
  airport: [
    {
      label: 'চেক-ইন',
      phrases: [
        { en: 'Where is the boarding gate?', bn: 'বোর্ডিং গেট কোথায়?' },
        { en: 'I have a window seat preference.', bn: 'জানালার পাশের আসন পছন্দ করি।' },
      ],
    },
  ],
  classroom: [
    {
      label: 'শ্রেণিকক্ষে',
      phrases: [
        { en: 'Could you explain that again, please?', bn: 'আবার একটু বোঝাবেন কি?' },
        { en: 'May I ask a question?', bn: 'একটি প্রশ্ন করতে পারি?' },
      ],
    },
  ],
  shop: [
    {
      label: 'কেনাকাটা',
      phrases: [
        { en: 'How much does this cost?', bn: 'এটার দাম কত?' },
        { en: 'Do you have a smaller size?', bn: 'ছোট সাইজ আছে কি?' },
      ],
    },
  ],
  phone: [
    {
      label: 'ফোনে',
      phrases: [
        { en: 'Who is speaking, please?', bn: 'আপনি কে বলবেন কি?' },
        { en: 'Can I take a message?', bn: 'কোনো বার্তা নিয়ে রাখব কি?' },
      ],
    },
  ],
};
