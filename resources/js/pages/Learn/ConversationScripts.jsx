import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import ScriptBubble from '../../components/learn/ScriptBubble';
import { WarnStrip } from '../../components/ui/WarnStrip';
import { cn } from '../../lib/utils';

/**
 * Screen 11 — Conversation Scripts · কথোপকথন স্ক্রিপ্ট
 * 5 situations × 3 levels, PaleInset messages, avoid strip, CTA → 14.
 */

const SITUATIONS = [
  { label: 'চাকরির ইন্টারভিউ', key: 'interview' },
  { label: 'ক্লায়েন্ট কথোপকthon', key: 'client' },
  { label: 'ফোন কল', key: 'phone' },
  { label: 'মিটিং', key: 'meeting' },
  { label: 'সমস্যা সমাধান', key: 'problem' },
];

const LEVELS = ['শুরু', 'মাঝারি', 'উন্নত'];

const SCRIPTS = {
  interview: [
    { level: 'শুরু', messages: [
      { text: 'Good morning. My name is [Name].', isUser: false },
      { text: 'I am a graphic designer from Dhaka.', isUser: true },
      { text: 'I have 2 years of experience.', isUser: true },
    ]},
    { level: 'মাঝারি', messages: [
      { text: 'Tell me about your design process.', isUser: false },
      { text: 'I start with research, then create wireframes before final designs.', isUser: true },
      { text: 'I always deliver within the agreed timeline.', isUser: true },
    ]},
    { level: 'উন্নত', messages: [
      { text: 'How do you handle tight deadlines?', isUser: false },
      { text: 'I prioritize tasks, communicate proactively, and never compromise on quality.', isUser: true },
      { text: 'For example, I once delivered a rush project 2 hours early.', isUser: true },
    ]},
  ],
  client: [
    { level: 'শুরু', messages: [
      { text: 'Hello! Thank you for the project.', isUser: true },
      { text: 'I will start working today.', isUser: true },
      { text: 'You will receive the first draft soon.', isUser: true },
    ]},
    { level: 'মাঝারি', messages: [
      { text: 'Hi! I have reviewed your requirements.', isUser: true },
      { text: 'I have a few questions to ensure the best result.', isUser: true },
      { text: 'Can we schedule a quick call?', isUser: true },
    ]},
    { level: 'উন্নত', messages: [
      { text: 'Thank you for the brief. I have some suggestions.', isUser: true },
      { text: 'Based on your target audience, I recommend a more minimal approach.', isUser: true },
      { text: 'I have attached a mood board for your reference.', isUser: true },
    ]},
  ],
};

// Default scripts for other situations
const DEFAULT_SCRIPT = [
  { level: 'শুরু', messages: [
    { text: 'Hello, how can I help?', isUser: true },
    { text: 'I need assistance with my project.', isUser: false },
    { text: 'Sure, let me help you.', isUser: true },
  ]},
  { level: 'মাঝারি', messages: [
    { text: 'Let me understand your requirements better.', isUser: true },
    { text: 'I need this completed within 2 weeks.', isUser: false },
    { text: 'That works for me. I will keep you updated.', isUser: true },
  ]},
  { level: 'উন্নত', messages: [
    { text: 'I have analyzed the project scope.', isUser: true },
    { text: 'The timeline is tight, but achievable.', isUser: true },
    { text: 'I will send daily progress updates.', isUser: true },
  ]},
];

const AVOID = [
  'শুরুতেই দাম না বলে কাজের মান নিয়ে কথা বলুন',
  '"I am the best" — এ ধরনের দাবি এড়িয়ে চলুন',
  'ক্লায়েন্টের প্রোজেক্ট নিয়ে গবেষণা করে লিখুন',
];

export default function ConversationScripts() {
  const { t } = useI18n();
  const [situation, setSituation] = useState(0);
  const [level, setLevel] = useState(0);

  const key = SITUATIONS[situation].key;
  const scripts = SCRIPTS[key] || DEFAULT_SCRIPT;
  const currentScript = scripts[level] || scripts[0];

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="কথোপকথন স্ক্রিপ্ট — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('কথোপকথন স্ক্রিপ্ট')}</h1>

      {/* Situation selector */}
      <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-none">
        {SITUATIONS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setSituation(i)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 font-bn',
              situation === i ? 'bg-brand text-white' : 'glass-row text-ink'
            )}
          >
            {t(s.label)}
          </button>
        ))}
      </div>

      {/* Level tabs */}
      <div className="mb-3 flex gap-1 rounded-2xl bg-white/60 p-1">
        {LEVELS.map((l, i) => (
          <button
            key={l}
            onClick={() => setLevel(i)}
            className={cn(
              'flex-1 rounded-xl py-2 text-[12px] font-bold transition-all font-bn',
              level === i ? 'bg-brand text-white' : 'text-muted'
            )}
          >
            {t(l)}
          </button>
        ))}
      </div>

      {/* Script bubbles */}
      <div className="mb-3 space-y-2">
        {currentScript.messages.map((m, i) => (
          <ScriptBubble key={i} {...m} level={currentScript.level} />
        ))}
      </div>

      {/* Avoid strip */}
      <div className="mb-3">
        <WarnStrip>
          <p className="mb-1 text-[12px] font-bold text-warn font-bn">{t('এড়িয়ে চলুন')}</p>
          {AVOID.map((a, i) => (
            <p key={i} className="text-[11px] text-ink font-bn">• {t(a)}</p>
          ))}
        </WarnStrip>
      </div>

      {/* CTA to assistant */}
      <Link
        href="/assistant"
        className="flex h-12 w-full items-center justify-center rounded-[14px] bg-ai text-[14px] font-bold text-white active:scale-[0.98] font-bn"
      >
        {t('AI সঙ্গীকে জিজ্ঞাসা করুন')}
      </Link>
    </div>
  );
}
