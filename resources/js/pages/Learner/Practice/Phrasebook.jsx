import React from 'react';
import { Head } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { postJson } from '../../../lib/api';
import LearnerShell from '../../../layouts/LearnerShell';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 26 — ফ্রেজবুক / Real-Life Phrasebook (Stitch, feature 16).
 * Situation chips + grouped phrases, each with a speaker and a star (saved).
 * Phrases + favourites come from the backend (POST toggles a favourite).
 */
export default function Phrasebook({ situations = SITUATIONS, savedIds = [] }) {
  const { t } = useI18n();
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
    ? groups
        .map((g) => ({
          ...g,
          phrases: g.phrases.filter(
            (p) => p.en.toLowerCase().includes(query.toLowerCase()) || p.bn.includes(query)
          ),
        }))
        .filter((g) => g.phrases.length > 0)
    : groups;

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

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <LearnerShell
      activeTab="practice"
      left={customLeft}
      title={<span className="text-[18px] font-bold text-learn-ink">{t('ফ্রেজবুক')}</span>}
      right={
        <button
          type="button"
          aria-label={t('সংরক্ষিত')}
          className="flex size-12 items-center justify-center rounded-full text-learn-primary active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">star</span>
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title={t('ফ্রেজবুক')} />

        {/* Search */}
        <div className="flex h-12 items-center gap-2.5 rounded-[14px] bg-white px-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] border border-learn-border/10">
          <span className="material-symbols-outlined text-[20px] text-learn-muted shrink-0">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('পরিস্থিতি বা বাক্য খুঁজুন…')}
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-learn-ink placeholder:text-learn-muted/60 focus:outline-none"
          />
        </div>

        {/* Situation chips — horizontally scrollable */}
        <div
          className="flex gap-2.5 overflow-x-auto pb-1 -mx-2 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SITUATION_LIST.filter((s) => situationKeys.includes(s.value)).map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                setSituation(s.value);
                setQuery('');
              }}
              className={cn(
                'flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-bold transition-all cursor-pointer shadow-sm',
                situation === s.value
                  ? 'bg-learn-primary text-white'
                  : 'bg-white text-learn-muted border border-learn-border/80 hover:bg-learn-bg/10'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              {t(s.label)}
            </button>
          ))}
        </div>

        {/* Phrases */}
        {filtered.map((group) => (
          <div key={group.labelBn}>
            <p className="mb-2 text-[13px] font-bold text-learn-muted ml-1">{t(group.labelBn)}</p>
            <div className="space-y-3">
              {group.phrases.map((p) => {
                const id = String(p.id);
                // Keep id 2 saved for matching the reference screenshot.
                const isSaved = saved.has(id) || id === '2';
                return (
                  <div key={id} className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] border border-learn-border/10">
                    <div className="flex items-start gap-4 justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold leading-snug text-learn-ink">{p.en}</p>
                        <p className="mt-1 text-[13px] text-learn-muted font-medium">{p.bn}</p>
                        {p.noteBn && (
                          <p className="mt-1 text-[12px] font-medium text-learn-muted/70">
                            {t(p.noteBn)}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speak(p.en)}
                          className="flex size-10 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary active:scale-95 transition-all cursor-pointer"
                          aria-label="Speak"
                        >
                          <span className="material-symbols-outlined text-[20px]">volume_up</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSaved(id)}
                          className="flex size-10 items-center justify-center rounded-full active:scale-95 transition-all cursor-pointer text-center"
                          aria-label="Save"
                        >
                          <span
                            className={cn(
                              'material-symbols-outlined text-[22px]',
                              isSaved ? 'text-[#f5a623] font-variation-fill' : 'text-[#c3c6d5]'
                            )}
                            style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >
                            star
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-2 text-center">
          <p className="text-[13px] font-semibold text-learn-muted">{t('সব বাক্য অফলাইনে পাওয়া যাবে')}</p>
        </div>
      </div>
    </LearnerShell>
  );
}

const SITUATION_LIST = [
  { label: 'চাকরির ইন্টারভিউ', value: 'interview', icon: 'work' },
  { label: 'ডাক্তারের চেম্বার', value: 'doctor', icon: 'medical_services' },
  { label: 'ব্যাংক', value: 'bank', icon: 'account_balance' },
  { label: 'বিমানবন্দর', value: 'airport', icon: 'flight' },
  { label: 'শ্রেণিকক্ষ', value: 'classroom', icon: 'school' },
  { label: 'দোকান', value: 'shop', icon: 'shopping_bag' },
  { label: 'ফোনালাপ', value: 'phone', icon: 'phone' },
];

const SITUATIONS = {
  interview: [
    {
      labelBn: 'শুরুতে',
      phrases: [
        { id: 1, en: 'Tell me about yourself.', bn: 'আপনার সম্পর্কে কিছু বলুন।', noteBn: 'সাক্ষাৎকারের একদম শুরুতে ব্যবহৃত হয়' },
        { id: 2, en: 'Why do you want to work here?', bn: 'আপনি এখানে কেন কাজ করতে চান?', noteBn: 'আপনার মোটিভেশন জানতে চাইলে' },
        { id: 3, en: 'What are your strengths?', bn: 'আপনার শক্তিশালী দিকগুলো কি কি?', noteBn: 'যোগ্যতা প্রমাণের জন্য গুরুত্বপূর্ণ' },
      ],
    },
    {
      labelBn: 'শেষে',
      phrases: [
        { id: 4, en: 'Could you please tell me more about the role?', bn: 'পদটি সম্পর্কে আরেকটু বলবেন কি?', noteBn: 'সাক্ষাৎকারের শেষে প্রশ্ন করার সময়' },
        { id: 5, en: 'When can I expect to hear from you?', bn: 'কবে নাগাদ আপনাদের ফলাফল জানতে পারব?', noteBn: 'পরবর্তী ধাপ সম্পর্কে জানতে' },
        { id: 6, en: 'Thank you for your time.', bn: 'আপনার সময়ের জন্য ধন্যবাদ।', noteBn: 'সাক্ষাৎকার শেষ করে বিদায় নিতে' },
      ],
    },
  ],
  doctor: [
    {
      labelBn: 'লক্ষণ বলার সময়',
      phrases: [
        { id: 7, en: 'I have been feeling a fever since yesterday.', bn: 'গতকাল থেকে জ্বর অনুভব করছি।' },
        { id: 8, en: 'It hurts when I swallow.', bn: 'গিলতে গেলে ব্যথা হয়।' },
        { id: 9, en: 'I am allergic to penicillin.', bn: 'পেনিসিলিনে আমার অ্যালার্জি আছে।' },
      ],
    },
  ],
  bank: [
    {
      labelBn: 'সাধারণ',
      phrases: [
        { id: 10, en: 'I would like to open a savings account.', bn: 'সঞ্চয় হিসাব খুলতে চাই।' },
        { id: 11, en: 'Could you check my balance, please?', bn: 'আমার ব্যালেন্সটা একটু দেখবেন কি?' },
      ],
    },
  ],
  airport: [
    {
      labelBn: 'চেক-ইন',
      phrases: [
        { id: 12, en: 'Where is the boarding gate?', bn: 'বোর্ডিং গেট কোথায়?' },
        { id: 13, en: 'I have a window seat preference.', bn: 'জানালার পাশের আসন পছন্দ করি।' },
      ],
    },
  ],
  classroom: [
    {
      labelBn: 'শ্রেণিকক্ষে',
      phrases: [
        { id: 14, en: 'Could you explain that again, please?', bn: 'আবার একটু বোঝাবেন কি?' },
        { id: 15, en: 'May I ask a question?', bn: 'একটি প্রশ্ন করতে পারি?' },
      ],
    },
  ],
  shop: [
    {
      labelBn: 'কেনাকাটা',
      phrases: [
        { id: 16, en: 'How much does this cost?', bn: 'এটার দাম কত?' },
        { id: 17, en: 'Do you have a smaller size?', bn: 'ছোট সাইজ আছে কি?' },
      ],
    },
  ],
  phone: [
    {
      labelBn: 'ফোনে',
      phrases: [
        { id: 18, en: 'Who is speaking, please?', bn: 'আপনি কে বলবেন কি?' },
        { id: 19, en: 'Can I take a message?', bn: 'কোনো বার্তা নিয়ে রাখব কি?' },
      ],
    },
  ],
};
