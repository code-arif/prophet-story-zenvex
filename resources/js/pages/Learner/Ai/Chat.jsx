import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Bot, Mic, Send, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { postJson } from '../../../lib/api';
import { SessionShell } from '../../../components/SessionShell';
import { StatusChip } from '../../../components/StatusChip';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 18 — কথোপকথন / AI Chat Session (Stitch, feature 13). Full-screen
 * session: violet AI bubbles + learner bubbles, inline correction cards,
 * hint chips, mic + send input. Messages are persisted per subscriber via
 * the backend (POST /ai/chat/send) — the server grades mistakes with the
 * rule-based engine and returns the updated conversation.
 */
export default function AiChat({
  scenario = { id: null, slug: 'open-chat', bn: 'মুক্ত আলাপ', en: 'Open chat' },
  messages: initialMessages = [],
  sessionId = null,
}) {
  const [messages, setMessages] = React.useState(initialMessages);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const { t } = useI18n();

  const send = async () => {
    const text = input.trim();
    if (!text || typing || !scenario.id) return;
    setTyping(true);
    setInput('');
    setMessages((m) => [...m, { role: 'learner', text }]);
    try {
      const res = await postJson('/ai/chat/send', { message: text, scenario_id: scenario.id });
      setMessages(res.messages || []);
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: t('দুঃখিত, কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।') }]);
    } finally {
      setTyping(false);
    }
  };

  const endSession = async () => {
    try {
      await postJson('/ai/chat/reset', { scenario_id: scenario.id });
    } catch {
      // non-blocking — still navigate away
    }
    router.visit('/ai');
  };

  const hints = SCENARIO_HINTS[scenario.slug] || [
    { label: 'শব্দ খুঁজে পাচ্ছি না', fill: 'Could you repeat that?' },
    { label: 'আরেকবার বলুন', fill: 'Could you say that again?' },
  ];

  return (
    <SessionShell
      title={
        <span className="block leading-tight">
          <span className="block text-[15px] font-bold">{t(scenario.bn)}</span>
          <span className="block text-[13px] font-medium text-learn-muted">{t('AI সঙ্গী')}</span>
        </span>
      }
      right={
        <button type="button" onClick={endSession} aria-label={t('শেষ করুন')}>
          <StatusChip tone="violet" className="ring-1 ring-learn-ai/40">{t('শেষ করুন')}</StatusChip>
        </button>
      }
      onClose={() => window.history.back()}
      primaryAction={
        // Desktop: same panel styling as the messages area, pulled up to touch
        // the chat window (mobile keeps the plain white bar).
        <div className="border-t border-learn-border bg-white px-5 pb-2 pt-2 lg:-mt-10 lg:rounded-[20px] lg:border-learn-ai/10 lg:bg-learn-ai-tint/40 lg:ring-1 lg:ring-learn-ai/10">
          {/* hint chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {hints.map(({ label, fill }) => (
              <button
                key={label}
                type="button"
                onClick={() => setInput((v) => (v ? v : fill))}
                className="shrink-0 rounded-full bg-learn-structure px-3 py-2 text-[13px] font-semibold text-learn-muted"
              >
                {t(label)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label={t('মাইক্রোফোন')} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-learn-structure text-learn-muted">
              <Mic className="size-5" strokeWidth={2} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t('ইংরেজিতে উত্তর লিখুন…')}
              className="h-12 min-w-0 flex-1 rounded-full border border-learn-ai/25 bg-white px-4 text-[14px] text-learn-ink shadow-[0px_2px_10px_rgba(124,107,245,0.14)] placeholder:text-learn-muted/60 transition-shadow focus:border-learn-ai/50 focus:outline-none focus:ring-2 focus:ring-learn-ai/40"
            />
            <button
              type="button"
              aria-label={t('পাঠান')}
              onClick={send}
              disabled={!input.trim() || typing}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-learn-ai text-white transition-all active:scale-95 disabled:opacity-40"
            >
              <Send className="size-4.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      }
    >
      <Head title={t('AI সঙ্গী')} />
      {/* Desktop: the chat fills the viewport between header and input bar —
          a tinted panel that stretches full height, with messages anchored
          at the bottom like a real chat window (mobile is unchanged). */}
      <div className="lg:flex lg:h-full lg:flex-col lg:rounded-[20px] lg:bg-learn-ai-tint/40 lg:px-5 lg:py-4 lg:ring-1 lg:ring-learn-ai/10">
      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
      <div className="flex flex-col gap-4 pt-2 pb-4 lg:min-h-full lg:justify-end">
        {messages.map((msg, i) =>
          msg.role === 'ai' ? (
            <div key={i} className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-learn-ai text-white">
                <Bot className="size-4.5" strokeWidth={2} />
              </span>
              <div className="max-w-[80%] rounded-[16px] rounded-bl-md bg-white px-4 py-3 text-[14px] leading-relaxed text-learn-ink shadow-[0px_2px_10px_rgba(20,23,43,0.06)]">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-end gap-2">
              <div className="max-w-[80%] rounded-[16px] rounded-br-md bg-learn-ai px-4 py-3 text-[14px] leading-relaxed text-white">
                {msg.text}
              </div>
              {msg.correction && (
                <CorrectionCard correction={msg.correction} expanded={expanded} onToggle={() => setExpanded((e) => !e)} />
              )}
            </div>
          )
        )}
        {typing && (
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-learn-ai text-white">
              <Bot className="size-4.5" strokeWidth={2} />
            </span>
            <span className="rounded-[16px] rounded-bl-md bg-white px-4 py-3 text-[13px] text-learn-muted shadow-[0px_2px_10px_rgba(20,23,43,0.06)]">
              {t('লিখছেন…')}
            </span>
          </div>
        )}
      </div>
      </div>
      </div>
    </SessionShell>
  );
}

const SCENARIO_HINTS = {
  interview: [
    { label: 'আমার অভিজ্ঞতা', fill: 'I have three years of experience in this field.' },
    { label: 'পদটি সম্পর্কে বলুন', fill: 'Could you tell me more about the daily responsibilities?' },
    { label: 'কখন শুরু হবে?', fill: 'When would the selected candidate start?' },
    { label: 'সাপ্তাহিক ছুটি কেমন?', fill: 'What is the work schedule and weekly holiday?' },
    { label: 'বুঝতে পারিনি', fill: 'I am sorry, I did not catch that.' },
    { label: 'আরেকবার বলুন', fill: 'Could you say that again, please?' },
    { label: 'ধন্যবাদ', fill: 'Thank you for this opportunity.' },
  ],
  shopping: [
    { label: 'এটার দাম কত?', fill: 'How much does this item cost?' },
    { label: 'অন্য সাইজ আছে?', fill: 'Do you have this in a different size?' },
    { label: 'চেঞ্জ রুম কোথায়?', fill: 'Where is the changing room?' },
    { label: 'কার্ডে পে করা যাবে?', fill: 'Can I pay by credit card?' },
    { label: 'ডিসকাউন্ট আছে?', fill: 'Is there any discount on this product?' },
    { label: 'ধন্যবাদ', fill: 'Thank you for your help.' },
  ],
  doctor: [
    { label: 'মাথা ব্যথা করছে', fill: 'I have a severe headache and fever.' },
    { label: 'কতবার খাবো?', fill: 'How many times a day should I take this medicine?' },
    { label: 'কাল থেকে অসুস্থ', fill: 'I have been feeling sick since yesterday.' },
    { label: 'খাবারের আগে না পরে?', fill: 'Should I take this medicine before or after meals?' },
    { label: 'বুকের এক্স-রে', fill: 'Do I need to do any blood tests or X-rays?' },
    { label: 'পরামর্শের জন্য ধন্যবাদ', fill: 'Thank you for the advice, doctor.' },
  ],
  airport: [
    { label: 'গেট ৫ কোথায়?', fill: 'Could you tell me where gate number five is?' },
    { label: 'আমার পাসপোর্ট', fill: 'Here is my passport and boarding pass.' },
    { label: 'ফ্লাইট ঠিক সময়ে আছে?', fill: 'Is my flight on schedule?' },
    { label: 'বোর্ডিং কখন শুরু?', fill: 'What time does the boarding start?' },
    { label: 'ওয়াশরুম কোথায়?', fill: 'Where is the nearest restroom?' },
    { label: 'ধন্যবাদ', fill: 'Thank you for your assistance.' },
  ],
  'small-talk': [
    { label: 'আমি ভালো আছি', fill: 'I am doing great, thank you! How about you?' },
    { label: 'সপ্তাহের ছুটিতে কি করলেন?', fill: 'What did you do over the weekend?' },
    { label: 'চা খাওয়ার দাওয়াত', fill: 'Let’s meet for tea sometime next week!' },
    { label: 'নতুন মুভি দেখেছেন?', fill: 'Have you seen any good movies lately?' },
    { label: 'আজকের আবহাওয়া', fill: 'The weather is really nice today, isn\'t it?' },
    { label: 'পরে কথা হবে', fill: 'It was nice chatting with you. Talk to you later!' },
  ],
  'open-chat': [
    { label: 'ইংরেজি শেখা', fill: 'I want to practice my English speaking skills.' },
    { label: 'আমার ভুল শুধরে দিন', fill: 'Can you please correct my grammar mistakes?' },
    { label: 'একটি উদাহরণ দিন', fill: 'Could you please give me an example sentence?' },
    { label: 'ধীরে বলুন', fill: 'Could you please speak a bit more slowly?' },
    { label: 'দিনটি কেমন গেলো?', fill: 'How was your day today?' },
    { label: 'সহজ করে বলুন', fill: 'Could you explain that in simpler words?' },
    { label: 'আরেকবার বলুন', fill: 'Could you say that again?' },
  ],
};

function CorrectionCard({ correction, expanded, onToggle }) {
  const { t } = useI18n();
  return (
    <div className="w-full max-w-[80%] rounded-[14px] border-l-2 border-dashed border-learn-ai bg-white p-3 shadow-[0px_2px_10px_rgba(20,23,43,0.06)]">
      <p className="text-[13px] font-bold uppercase tracking-wide text-learn-ai">{t('সংশোধন')}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed">
        <span className="text-learn-danger line-through">{correction.wrong}</span>{' '}
        <span className="text-learn-muted">→</span>{' '}
        <span className="font-bold text-learn-success">{correction.right}</span>
      </p>
      {expanded && <p className="mt-1.5 text-[13px] text-learn-muted">{correction.reasonBn}</p>}
      <button type="button" onClick={onToggle} className="mt-1 flex items-center gap-0.5 text-[13px] font-semibold text-learn-ai">
        {t('ব্যাখ্যা দেখুন')}
        <ChevronDown className={cn('size-3.5 transition-transform', expanded && 'rotate-180')} />
      </button>
    </div>
  );
}
