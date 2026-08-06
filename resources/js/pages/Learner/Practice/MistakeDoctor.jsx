import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Check, Info, WifiOff, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { postJson } from '../../../lib/api';
import LearnerShell from '../../../layouts/LearnerShell';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 27 — ভুল সংশোধক / Mistake Doctor (Stitch, feature 16).
 * Type a sentence, match it against the fixed error-pattern map, show the
 * correction card; plus a grid of common Bangla-speaker mistakes.
 * The check runs on the server (POST /practice/mistakes/check).
 */
export default function MistakeDoctor({ common = COMMON }) {
  const [text, setText] = React.useState('I am agree with your plan');
  const [checked, setChecked] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const check = async (sentence) => {
    const value = (sentence ?? text).trim();
    if (!value || checking) return;
    setChecking(true);
    try {
      const res = await postJson('/practice/mistakes/check', { text: value });
      setResult(res);
      setChecked(true);
    } catch {
      // keep previous state
    } finally {
      setChecking(false);
    }
  };

  return (
    <LearnerShell
      showBack
      activeTab="practice"
      title="ভুল সংশোধক"
      right={
        <button type="button" aria-label="তথ্য" className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <Info className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title="ভুল সংশোধক" />

        {/* Offline strip */}
        <div className="flex items-center gap-2 rounded-[14px] bg-learn-structure px-4 py-3 text-[13px] text-learn-muted">
          <WifiOff className="size-4 shrink-0" strokeWidth={2} />
          <span>সম্পূর্ণ অফলাইন — নির্দিষ্ট ভুলের তালিকা মিলিয়ে দেখা হয়</span>
        </div>

        {/* Input card */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <input
            value={text}
            onChange={(e) => { setText(e.target.value); setChecked(false); }}
            placeholder="একটি ইংরেজি বাক্য লিখুন…"
            className="w-full rounded-[12px] bg-learn-bg px-3.5 py-3 text-[15px] text-learn-ink placeholder:text-learn-muted/60 focus:outline-none"
          />
          <button className={cn(buttonVariants({ size: 'learner' }), 'mt-3')} onClick={() => check()} disabled={checking}>
            {checking ? 'যাচাই হচ্ছে…' : 'মিলিয়ে দেখুন'}
          </button>
        </div>

        {result && result.found === false && (
          <div className="rounded-[14px] bg-white p-4 text-[13px] text-learn-ink shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            {result.reasonBn}
          </div>
        )}
        {result && result.found !== false && result.wrong && (
          <div className="rounded-[14px] border-l-[3px] border-learn-danger bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <p className="text-[13px] font-bold uppercase tracking-wide text-learn-danger">যে ভুলটি পাওয়া গেল</p>
            <p className="mt-2 text-[15px] leading-relaxed">
              <span className="text-learn-danger line-through">{result.wrong}</span>
              <ArrowRight className="mx-1.5 inline size-4 text-learn-muted" strokeWidth={2} />
              <span className="font-bold text-learn-success">{result.correct}</span>
            </p>
            <div className="mt-3 rounded-[12px] bg-learn-bg px-3.5 py-2.5 text-[13px] leading-relaxed text-learn-ink">
              {result.reasonBn}
            </div>
            <div className="mt-3">
              <p className="mb-2 text-[13px] font-semibold text-learn-ink">সঠিক ব্যবহার</p>
              {result.examples.map((ex) => (
                <div key={ex.en} className="flex items-start gap-2 py-1">
                  <Check className="mt-0.5 size-4 shrink-0 text-learn-success" strokeWidth={2} />
                  <div>
                    <p className="text-[14px] font-semibold text-learn-ink">{ex.en}</p>
                    <p className="text-[13px] text-learn-muted">{ex.bn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common mistakes grid */}
        <div>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">বেশি হয় এমন ভুল</p>
          <div className="grid grid-cols-2 gap-2.5">
            {common.map((m) => (
              <button
                key={m.wrong}
                type="button"
                onClick={() => { setText(m.wrong); check(m.wrong); }}
                className="rounded-[14px] bg-white px-3.5 py-3 text-left text-[13px] font-semibold text-learn-ink shadow-[0px_4px_12px_rgba(20,23,43,0.04)] transition-colors active:bg-learn-bg"
              >
                {m.wrong}
                <span className="mt-0.5 block text-[13px] font-normal text-learn-muted">→ {m.correct}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI fallback */}
        <Link href="/ai/chat" className={cn(buttonVariants({ variant: 'outlineViolet', size: 'learner' }), 'inline-flex w-full items-center justify-center gap-1.5')}>
          <WifiOff className="size-4" strokeWidth={2} />
          তালিকায় নেই? AI সঙ্গীকে জিজ্ঞাসা করুন
        </Link>
      </div>
    </LearnerShell>
  );
}

const COMMON = [
  { wrong: 'discuss about', correct: 'discuss' },
  { wrong: 'one of my friend', correct: 'one of my friends' },
  { wrong: 'cope up with', correct: 'cope with' },
  { wrong: 'give a miss call', correct: 'missed call' },
  { wrong: 'return back', correct: 'return' },
  { wrong: 'more better', correct: 'better' },
];
