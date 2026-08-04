import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ChevronRight, FolderOpen, Sparkles, WifiOff, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { StatusChip } from '../../../components/StatusChip';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 23 — রাইটিং ডেস্ক / Writing Desk (Stitch, feature 15).
 * Two states: prompt list (Tab 4 shell) and full-screen editor
 * (no bottom nav, violet AI feedback entry). UI-phase demo data.
 */
export default function WritingDesk() {
  const [editing, setEditing] = React.useState(null); // null | prompt object
  const [draft, setDraft] = React.useState('');
  const [elapsed, setElapsed] = React.useState(0);

  // Editor timer (demo — resets on open)
  React.useEffect(() => {
    if (!editing) return;
    setElapsed(0);
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [editing]);

  const words = draft.trim() === '' ? 0 : draft.trim().split(/\s+/).length;

  if (editing) {
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    return (
      <div className="flex h-full min-h-screen flex-col bg-[hsl(var(--learn-bg))]">
        <Head title="রাইটিং ডেস্ক" />
        {/* Editor top bar — no bottom nav */}
        <header className="flex items-center gap-2 px-5 py-3">
          <button
            type="button"
            aria-label="বন্ধ করুন"
            onClick={() => setEditing(null)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-[15px] font-semibold text-learn-ink">{editing.title}</p>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="shrink-0 text-[14px] font-bold text-learn-primary"
          >
            সেভ
          </button>
        </header>

        {/* Structure panel */}
        <details className="mx-5 rounded-[14px] bg-learn-primary-tint px-4 py-3">
          <summary className="cursor-pointer list-none text-[13px] font-semibold text-learn-primary">
            কাঠামো দেখুন
          </summary>
          <div className="mt-3 space-y-2.5">
            {STRUCTURE.map((step) => (
              <div key={step.label} className="rounded-[12px] bg-white px-3 py-2.5">
                <p className="text-[12px] font-bold text-learn-ink">{step.label}</p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  {step.phrases.map((p) => (
                    <span key={p} className="text-[12px] text-learn-muted">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>

        {/* Writing area */}
        <div className="flex-1 px-5 py-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="এখানে ইংরেজিতে লিখুন…"
            rows={12}
            autoFocus
            className="w-full resize-none rounded-[14px] bg-white p-4 text-[15px] leading-relaxed text-learn-ink shadow-[0px_4px_12px_rgba(20,23,43,0.04)] placeholder:text-learn-muted/60 focus:outline-none"
          />
        </div>

        {/* Fixed bottom bar */}
        <div className="flex items-center justify-between gap-3 border-t border-learn-structure/70 bg-white px-5 py-3">
          <span className="text-[13px] text-learn-muted">
            {toBnDigits(words)} শব্দ · {toBnDigits(mm)}:{toBnDigits(ss)}
          </span>
          <Link
            href="/ai/writing"
            className={cn(buttonVariants({ variant: 'outlineViolet', size: 'sm' }), 'inline-flex items-center gap-1.5')}
          >
            <Sparkles className="size-4" strokeWidth={2} />
            AI ফিডব্যাক নিন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <LearnerShell
      showBack
      activeTab="practice"
      title="রাইটিং ডেস্ক"
      right={
        <button
          type="button"
          aria-label="খসড়া"
          className="relative flex size-10 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
        >
          <FolderOpen className="size-5" strokeWidth={2} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-learn-danger px-1 text-[10px] font-bold text-white">
            {toBnDigits(4)}
          </span>
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title="রাইটিং ডেস্ক" />

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['সব', 'দরখাস্ত', 'ইমেইল', 'প্যারাগ্রাফ', 'গল্প', 'মতামত'].map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>

        {/* Drafts */}
        <div>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">খসড়া চালিয়ে যান</p>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setEditing({ ...PROMPTS[0], title: 'Leave application to the manager' })}
            onKeyDown={(e) => e.key === 'Enter' && setEditing({ ...PROMPTS[0], title: 'Leave application to the manager' })}
            className="flex items-center gap-3 rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-learn-ink">Leave application to the manager</p>
              <p className="mt-0.5 truncate text-[13px] text-learn-muted">
                Dear Sir, I am writing to request a leave of absence…
              </p>
              <p className="mt-1 text-[12px] text-learn-muted">৮৭ শব্দ · ২ দিন আগে</p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-learn-muted" strokeWidth={2} />
          </div>
        </div>

        {/* New prompts */}
        <div>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">নতুন লেখা শুরু করুন</p>
          <div className="space-y-3">
            {PROMPTS.map((prompt) => (
              <div
                key={prompt.title}
                role="button"
                tabIndex={0}
                onClick={() => setEditing(prompt)}
                onKeyDown={(e) => e.key === 'Enter' && setEditing(prompt)}
                className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[14px] font-bold leading-snug text-learn-ink">{prompt.title}</p>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-learn-muted" strokeWidth={2} />
                </div>
                <p className="mt-1 text-[13px] text-learn-muted">{prompt.bn}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <StatusChip tone="blue">{prompt.level}</StatusChip>
                  <span className="text-[12px] text-learn-muted">{prompt.words}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[12px] text-learn-muted">সব খসড়া ডিভাইসে সংরক্ষিত থাকে</p>
      </div>
    </LearnerShell>
  );
}

const STRUCTURE = [
  {
    label: 'শুরু',
    phrases: ['Dear Sir,', 'I hope this message finds you well.'],
  },
  {
    label: 'মূল অংশ',
    phrases: ['I would like to request…', 'Because of…'],
  },
  {
    label: 'শেষ',
    phrases: ['Thank you for your consideration.', 'Sincerely,'],
  },
];

const PROMPTS = [
  { title: 'Write an email requesting a day off', bn: 'অফিসে ছুটির জন্য ইমেইল', level: 'A2', words: '১০০–১৫০ শব্দ' },
  { title: 'Write an application for a bank account', bn: 'ব্যাংক অ্যাকাউন্ট খোলার দরখাস্ত', level: 'A2', words: '৮০–১২০ শব্দ' },
  { title: 'Describe your daily routine in a paragraph', bn: 'দৈনন্দিন রুটিন নিয়ে প্যারাগ্রাফ', level: 'B1', words: '১২০–১৮০ শব্দ' },
  { title: 'Write a short story beginning with a rainy day', bn: 'বৃষ্টির দিন দিয়ে শুরু করা গল্প', level: 'B1', words: '১৫০–২০০ শব্দ' },
];
