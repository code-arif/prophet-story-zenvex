import React from 'react';
import { Head } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { ScoreRing } from '../../../components/ScoreRing';
import { useI18n } from '../../../lib/i18n';
import { speak } from '../../../lib/speech';

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
  const [speed, setSpeed] = React.useState('1.0');
  const [recording, setRecording] = React.useState(false);
  const { t } = useI18n();

  const items = modes[mode] || [];
  const current = items[itemIndex % Math.max(1, items.length)] || {};
  const target = current.target || (mode === 'word' ? 'reliable' : mode === 'pairs' ? 'ship / sheep' : 'She sells sea shells by the shore.');
  const phonetic = current.phonetic || '';
  const words = current.words || [];

  const changeMode = (next) => {
    setMode(next);
    setItemIndex(0);
    setScored(false);
    setRecording(false);
  };

  const nextItem = () => {
    setItemIndex((i) => i + 1);
    setScored(false);
    setRecording(false);
  };

  const handlePlay = () => {
    speak(target, { rate: parseFloat(speed) });
  };

  const toggleSpeed = () => {
    setSpeed((prev) => (prev === '1.0' ? '0.75' : '1.0'));
  };

  const startRecording = () => {
    if (recording) return;
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setScored(true);
    }, 2000);
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

  return (
    <LearnerShell
      activeTab="practice"
      left={customLeft}
      title={<span className="text-[18px] font-bold text-learn-primary">{t('উচ্চারণ স্টুডিও')}</span>}
    >
      <div className="mt-2 space-y-4">
        <Head title={t('উচ্চারণ স্টুডিও')} />

        {/* Mode chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip selected={mode === 'word'} onClick={() => changeMode('word')}>{t('শব্দ')}</Chip>
          <Chip selected={mode === 'sentence'} onClick={() => changeMode('sentence')}>{t('বাক্য')}</Chip>
          <Chip selected={mode === 'pairs'} onClick={() => changeMode('pairs')}>{t('কঠিন জোড়া')}</Chip>
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
                <button
                  type="button"
                  onClick={handlePlay}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-learn-primary-tint px-6 text-[15px] font-bold text-learn-primary hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                  <span>{t('শুনুন')}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleSpeed}
                  className="flex size-12 items-center justify-center rounded-full bg-[#eaf0fc] text-[13px] font-bold text-learn-primary hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  {speed}x
                </button>
              </div>
            </div>

            {/* Waveform */}
            <div className="flex justify-center py-2">
              <div className="flex h-10 w-56 items-center gap-1.5 justify-center">
                {WAVEFORM.map((h, i) => (
                  <span
                    key={i}
                    className={cn(
                      'w-1 rounded-full bg-learn-structure transition-all duration-300',
                      recording ? 'bg-learn-primary animate-pulse' : 'bg-learn-structure'
                    )}
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Mic */}
            <div className="flex flex-col items-center py-2">
              <button
                type="button"
                aria-label={t('রেকর্ড করুন')}
                onClick={startRecording}
                className={cn(
                  "flex size-[88px] items-center justify-center rounded-full bg-learn-primary text-white shadow-[0px_12px_28px_rgba(43,89,195,0.3)] transition-all cursor-pointer active:scale-95",
                  recording ? "ring-8 ring-learn-primary/20 scale-105" : ""
                )}
              >
                <span className="material-symbols-outlined text-[36px]">mic</span>
              </button>
              <p className="mt-3 text-[14px] font-bold text-learn-ink">{recording ? t('শুনছি...') : t('চেপে ধরে বলুন')}</p>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={nextItem}
                  className="mt-4 text-[13px] font-semibold text-learn-primary cursor-pointer hover:underline"
                >
                  {t('পরের বাক্য')} ({toBnDigits(itemIndex + 1)}/{toBnDigits(items.length)})
                </button>
              )}
            </div>

            {/* Honest mode notice */}
            <div className="flex items-start gap-2.5 rounded-[14px] bg-white px-4 py-3 text-[13px] text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <span className="material-symbols-outlined text-[20px] shrink-0 text-learn-muted mt-0.5">info</span>
              <span>{t('রিকগনিশন না চললে রেকর্ডিং মিলিয়ে দেখার সুযোগ থাকবে')}</span>
            </div>
          </>
        )}
      </div>
    </LearnerShell>
  );
}

function ScoredState({ target, words, onRetry }) {
  const { t } = useI18n();

  const failedWord = words.find((w) => !w.ok);

  const getAiTips = (fw) => {
    if (!fw) return '';
    const wordText = fw.w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
    
    if (wordText === 'shells' || wordText === 'shell' || wordText === 'shore') {
      return t('"{word}" শব্দটি বলার সময় "sh" সাউন্ডটি আরও পরিষ্কারভাবে উচ্চারণ করার চেষ্টা করুন। জিব্ব তালুর ওপরের দিকে রাখুন।', { word: fw.w });
    }
    if (wordText === 'sea' || wordText === 'sells') {
      return t('"{word}" শব্দটি বলার সময় "s" সাউন্ডটি শিসের মতো উচ্চারণ করার চেষ্টা করুন। জিব দাঁতের পেছনের অংশে রাখুন।', { word: fw.w });
    }
    if (wordText === 'reliable') {
      return t('"{word}" শব্দটি বলার সময় "l" এবং "r" এর পার্থক্য পরিষ্কার রাখুন। "re-li-a-ble" এভাবে ভেঙে উচ্চারণ অনুশীলন করুন।', { word: fw.w });
    }
    if (wordText === 'ship') {
      return t('"{word}" শব্দটি ছোট "i" সাউন্ড দিয়ে বলুন (হ্রস্ব ই)। এটি "sheep" (দীর্ঘ ঈ) থেকে আলাদা।', { word: fw.w });
    }
    if (wordText === 'sheep') {
      return t('"{word}" শব্দটি দীর্ঘ "ee" সাউন্ড দিয়ে বলুন (দীর্ঘ ঈ)। এটি "ship" (হ্রস্ব ই) থেকে আলাদা।', { word: fw.w });
    }
    return t('"{word}" শব্দটি উচ্চারণে কিছুটা ভুল হয়েছে। শব্দটির অডিও শুনে বারবার অনুশীলন করুন।', { word: fw.w });
  };

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
          <span className="text-[20px] font-bold text-[#14172b]">{toBnDigits(82)}%</span>
        </ScoreRing>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 ring-1 ring-learn-border">
          <span className="flex size-9 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary">
            <span className="material-symbols-outlined text-[18px] font-variation-fill" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </span>
          <span className="flex-1 text-[14px] font-semibold text-learn-ink">{t('সঠিক উচ্চারণ')}</span>
          <button
            type="button"
            onClick={() => speak(target)}
            className="flex size-8 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">volume_up</span>
          </button>
        </div>
        <div className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 ring-1 ring-learn-border">
          <span className="flex size-9 items-center justify-center rounded-full bg-learn-structure text-learn-muted">
            <span className="material-symbols-outlined text-[18px] font-variation-fill" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </span>
          <span className="flex-1 text-[14px] font-semibold text-learn-ink">{t('আপনার উচ্চারণ')}</span>
          <span className="flex size-8 items-center justify-center rounded-full bg-learn-structure text-learn-muted">
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </span>
        </div>
      </div>

      <button
        className="w-full h-12 flex items-center justify-center gap-2 rounded-[14px] border-2 border-learn-primary/30 text-learn-primary text-[15px] font-bold hover:bg-learn-primary-tint/20 active:scale-[0.98] transition-all cursor-pointer"
        onClick={onRetry}
      >
        <span className="material-symbols-outlined text-[20px]">replay</span>
        {t('আবার চেষ্টা করুন')}
      </button>

      {failedWord && (
        <div className="rounded-[14px] bg-learn-ai-tint p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] mt-4">
          <p className="text-[14px] font-bold text-learn-ai">{t('AI টিপস')}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-learn-ink font-medium">
            {getAiTips(failedWord)}
          </p>
        </div>
      )}
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
