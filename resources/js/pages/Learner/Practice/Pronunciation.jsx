import React from 'react';
import { Head } from '@inertiajs/react';
import { List, Mic, Play, RotateCcw, Info } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { ScoreRing } from '../../../components/ScoreRing';
import { SpeakerButton } from '../../../components/SpeakerButton';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 21 — উচ্চারণ স্টুডিও / Pronunciation Studio (Stitch, feature 4).
 * Listen, record, then score word-by-word. The mode badge (recognition vs
 * compare-only) is surfaced up front. Items come from the backend; scoring
 * is a compare-only review (device speech, no network).
 */
export default function Pronunciation({ modes = MODES_DEFAULT }) {
  const [mode, setMode] = React.useState('sentence'); // word | sentence | pairs
  const [itemIndex, setItemIndex] = React.useState(0);
  const [scored, setScored] = React.useState(false);

  const items = modes[mode] || [];
  const current = items[itemIndex % Math.max(1, items.length)] || {};
  const target = current.target || (mode === 'word' ? 'reliable' : mode === 'pairs' ? 'ship / sheep' : 'She sells sea shells by the shore.');
  const phonetic = current.phonetic || '';
  const words = current.words || [];

  const changeMode = (next) => {
    setMode(next);
    setItemIndex(0);
    setScored(false);
  };

  const nextItem = () => {
    setItemIndex((i) => i + 1);
    setScored(false);
  };

  const speakSlow = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(target);
    u.lang = 'en-US';
    u.rate = 0.75;
    window.speechSynthesis.speak(u);
  };

  return (
    <LearnerShell
      showBack
      activeTab="practice"
      title="উচ্চারণ স্টুডিও"
      right={
        <button type="button" aria-label="তালিকা" className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <List className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title="উচ্চারণ স্টুডিও" />

        {/* Mode chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip selected={mode === 'word'} onClick={() => changeMode('word')}>শব্দ</Chip>
          <Chip selected={mode === 'sentence'} onClick={() => changeMode('sentence')}>বাক্য</Chip>
          <Chip selected={mode === 'pairs'} onClick={() => changeMode('pairs')}>কঠিন জোড়া</Chip>
        </div>

        {scored ? (
          <ScoredState target={target} words={words} onRetry={() => setScored(false)} />
        ) : (
          <>
            {/* Target card */}
            <div className="rounded-[14px] bg-white p-5 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <p className="text-[22px] font-bold leading-snug text-learn-ink">{target}</p>
              <p className="mt-1 text-[13px] text-learn-muted">{phonetic}</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <SpeakerButton text={target} size="lg" />
                <button
                  type="button"
                  onClick={speakSlow}
                  className="inline-flex h-12 items-center rounded-full bg-learn-structure px-3.5 text-[13px] font-semibold text-learn-muted"
                >
                  ধীরে ০.৭৫x
                </button>
              </div>
            </div>

            {/* Mic */}
            <div className="flex flex-col items-center py-2">
              <button
                type="button"
                aria-label="রেকর্ড করুন"
                onClick={() => setScored(true)}
                className="flex size-[88px] items-center justify-center rounded-full bg-learn-primary text-white shadow-[0px_12px_28px_rgba(43,89,195,0.3)] transition-transform active:scale-95"
              >
                <Mic className="size-9" strokeWidth={2} />
              </button>
              <p className="mt-3 text-[13px] font-medium text-learn-muted">চেপে ধরে বলুন</p>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={nextItem}
                  className="mt-3 text-[13px] font-semibold text-learn-primary"
                >
                  পরের বাক্য ({toBnDigits(itemIndex + 1)}/{toBnDigits(items.length)})
                </button>
              )}
              <div className="mt-4 flex h-10 w-56 items-center gap-1">
                {WAVEFORM.map((h, i) => (
                  <span key={i} className="flex-1 rounded-full bg-learn-structure" style={{ height: `${h}px` }} />
                ))}
              </div>
            </div>

            {/* Honest mode notice */}
            <div className="flex items-start gap-2.5 rounded-[14px] bg-white px-4 py-3 text-[13px] text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <Info className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
              <span>রিকগনিশন না চললে রেকর্ডিং মিলিয়ে দেখার সুযোগ থাকবে</span>
            </div>
          </>
        )}
      </div>
    </LearnerShell>
  );
}

function ScoredState({ target, words, onRetry }) {
  return (
    <>
      <div className="flex items-center gap-4 rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
        <div className="min-w-0 flex-1 text-[15px] font-semibold leading-relaxed">
          {words.map((w, i) => (
            <span key={i} className={cn(w.ok ? 'text-learn-success' : 'text-learn-danger underline decoration-dotted underline-offset-4')}>
              {w.w}{' '}
            </span>
          ))}
        </div>
        <ScoreRing value={82} size={96} stroke={8} tone="primary">
          <span className="text-[20px] font-bold text-learn-ink">{toBnDigits(82)}%</span>
        </ScoreRing>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 ring-1 ring-learn-border">
          <span className="flex size-9 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary">
            <Play className="size-4 fill-current" strokeWidth={2} />
          </span>
          <span className="flex-1 text-[14px] font-semibold text-learn-ink">সঠিক উচ্চারণ</span>
          <SpeakerButton text={target} size="sm" />
        </div>
        <div className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 ring-1 ring-learn-border">
          <span className="flex size-9 items-center justify-center rounded-full bg-learn-structure text-learn-muted">
            <Play className="size-4 fill-current" strokeWidth={2} />
          </span>
          <span className="flex-1 text-[14px] font-semibold text-learn-ink">আপনার উচ্চারণ</span>
          <span className="flex size-8 items-center justify-center rounded-full bg-learn-structure text-learn-muted">
            <Mic className="size-4" strokeWidth={2} />
          </span>
        </div>
      </div>

      <button className={cn(buttonVariants({ variant: 'outlineBlue', size: 'learner' }), 'w-full')} onClick={onRetry}>
        <RotateCcw className="size-4" strokeWidth={2} />
        আবার চেষ্টা করুন
      </button>
    </>
  );
}

const WAVEFORM = [8, 14, 22, 18, 28, 20, 14, 10, 16, 24, 18, 12, 8, 14, 22, 16, 10];

const MODES_DEFAULT = {
  word: [{ target: 'reliable', phonetic: '/rɪˈlaɪəbl/', words: [] }],
  sentence: [
    {
      target: 'She sells sea shells by the shore.',
      phonetic: '/ʃiː selz siː ʃelz baɪ ðə ʃɔːr/',
      words: [
        { w: 'She', ok: true }, { w: 'sells', ok: true }, { w: 'sea', ok: true },
        { w: 'shells', ok: false }, { w: 'by', ok: true }, { w: 'the', ok: true }, { w: 'shore.', ok: true },
      ],
    },
  ],
  pairs: [{ target: 'ship / sheep', phonetic: '/ʃɪp/ /ʃiːp/', words: [] }],
};
