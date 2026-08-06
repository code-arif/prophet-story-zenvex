import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Bot, Mic, Send, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { postJson } from '../../../lib/api';
import { SessionShell } from '../../../components/SessionShell';
import { StatusChip } from '../../../components/StatusChip';

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
      setMessages((m) => [...m, { role: 'ai', text: 'দুঃখিত, কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।' }]);
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

  return (
    <SessionShell
      title={
        <span className="block leading-tight">
          <span className="block text-[15px] font-bold">{scenario.bn}</span>
          <span className="block text-[13px] font-medium text-learn-muted">AI সঙ্গী</span>
        </span>
      }
      right={
        <button type="button" onClick={endSession} aria-label="শেষ করুন">
          <StatusChip tone="violet" className="ring-1 ring-learn-ai/40">শেষ করুন</StatusChip>
        </button>
      }
      onClose={() => window.history.back()}
      primaryAction={
        <div className="border-t border-learn-border bg-white px-5 pb-2 pt-2">
          {/* hint chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['শব্দ খুঁজে পাচ্ছি না', 'আরেকবার বলুন'].map((hint) => (
              <button
                key={hint}
                type="button"
                onClick={() => setInput((v) => (v ? v : 'Could you repeat that?'))}
                className="shrink-0 rounded-full bg-learn-structure px-3 py-2 text-[13px] font-semibold text-learn-muted"
              >
                {hint}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="মাইক্রোফোন" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-learn-structure text-learn-muted">
              <Mic className="size-5" strokeWidth={2} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="ইংরেজিতে উত্তর লিখুন…"
              className="h-12 min-w-0 flex-1 rounded-full bg-learn-bg px-4 text-[14px] text-learn-ink placeholder:text-learn-muted/60 focus:outline-none focus:ring-2 focus:ring-learn-ai/40"
            />
            <button
              type="button"
              aria-label="পাঠান"
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
      <Head title="AI সঙ্গী" />
      <div className="flex flex-col gap-4 pt-2 pb-4">
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
              লিখছেন…
            </span>
          </div>
        )}
      </div>
    </SessionShell>
  );
}

function CorrectionCard({ correction, expanded, onToggle }) {
  return (
    <div className="w-full max-w-[80%] rounded-[14px] border-l-2 border-dashed border-learn-ai bg-white p-3 shadow-[0px_2px_10px_rgba(20,23,43,0.06)]">
      <p className="text-[13px] font-bold uppercase tracking-wide text-learn-ai">সংশোধন</p>
      <p className="mt-1.5 text-[13px] leading-relaxed">
        <span className="text-learn-danger line-through">{correction.wrong}</span>{' '}
        <span className="text-learn-muted">→</span>{' '}
        <span className="font-bold text-learn-success">{correction.right}</span>
      </p>
      {expanded && <p className="mt-1.5 text-[13px] text-learn-muted">{correction.reasonBn}</p>}
      <button type="button" onClick={onToggle} className="mt-1 flex items-center gap-0.5 text-[13px] font-semibold text-learn-ai">
        ব্যাখ্যা দেখুন
        <ChevronDown className={cn('size-3.5 transition-transform', expanded && 'rotate-180')} />
      </button>
    </div>
  );
}
