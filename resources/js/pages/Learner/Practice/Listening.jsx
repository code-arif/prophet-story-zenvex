import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { AnswerRow } from '../../../components/AnswerRow';
import { ScoreRing } from '../../../components/ScoreRing';
import { StreakChip } from '../../../components/StreakChip';
import { useI18n } from '../../../lib/i18n';
import { speak, normalizeSpeed, formatSpeed } from '../../../lib/speech';

/**
 * Screen 22 — লিসেনিং প্র্যাকটিস / Listening Practice (Stitch, feature 5).
 * Dictation (type what you hear, word-by-word scoring) and comprehension
 * (MCQs) using the device voice. Sentences + comprehension come from the
 * backend.
 */
export default function Listening({
  dictationSentences = ['The bus leaves at seven.'],
  comprehension = COMPREHENSION_DEFAULT,
  streak = 7,
}) {
  const [tab, setTab] = React.useState('dictation');
  const [typed, setTyped] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [dictIndex, setDictIndex] = React.useState(0);
  const [comp, setComp] = React.useState({ qIndex: 0, answers: [], done: false });
  const [selected, setSelected] = React.useState(null);

  // Seed the on-screen playback speed from the saved reading-speed setting
  // (it stays adjustable here for quick per-session tweaks).
  const { readingSpeed = '1.0' } = usePage().props;
  const [speed, setSpeed] = React.useState(() => normalizeSpeed(readingSpeed));

  const { t } = useI18n();
  const sentence = dictationSentences[dictIndex % Math.max(1, dictationSentences.length)];
  const compQuestions = comprehension?.questions || [];
  const compText = comprehension?.text || COMPREHENSION_TEXT;
  const typedWords = typed.trim() === '' ? 0 : typed.trim().split(/\s+/).length;

  // Speak with the saved voice preference; rate comes from the on-screen
  // picker (seeded from the saved reading speed).
  const play = () => speak(tab === 'dictation' ? sentence : compText, { rate: Number(speed) });

  const check = () => {
    const target = sentence.toLowerCase().replace(/[.,!?]/g, '').split(' ');
    const heard = typed.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
    const matched = target.map((w, i) => ({ w, ok: heard[i] === w }));
    setResult({ matched });
  };

  const answerComp = (i) => {
    setSelected(i);
    setComp((c) => ({ ...c, answers: [...c.answers, i] }));
  };

  const finishComp = () => {
    setComp((c) => ({ ...c, done: true }));
  };

  const q = compQuestions[comp.qIndex];
  const compScore = comp.answers.filter((a, i) => a === compQuestions[i]?.answer).length;

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
      title={<span className="text-[18px] font-bold text-learn-primary">{t('লিসেনিং প্র্যাকটিস')}</span>}
      right={<StreakChip days={streak} />}
    >
      <div className="mt-2 space-y-4">
        <Head title={t('লিসেনিং প্র্যাকটিস')} />
        <SegmentedControl
          value={tab}
          onChange={(v) => {
            setTab(v);
            setResult(null);
            setComp({ qIndex: 0, answers: [], done: false });
            setSelected(null);
          }}
          tone="light"
          options={[
            { label: t('ডিকটেশন'), value: 'dictation' },
            { label: t('বুঝে উত্তর দিন'), value: 'comprehension' },
          ]}
        />

        {tab === 'dictation' ? (
          <>
            {/* Play card */}
            <div className="relative flex flex-col items-center rounded-[14px] bg-white p-5 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              {/* Top Right Progress Badge */}
              <span className="absolute top-4 right-4 rounded-full bg-learn-ai-tint px-3 py-0.5 text-[12px] font-bold text-learn-ai">
                {toBnDigits(dictIndex + 1)}/{toBnDigits(dictationSentences.length)}
              </span>

              <button
                type="button"
                aria-label={t('শুনুন')}
                onClick={() => play()}
                className="flex size-[72px] items-center justify-center rounded-full bg-learn-primary text-white shadow-[0px_10px_24px_rgba(43,89,195,0.28)] transition-transform active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[36px] font-variation-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
              <p className="mt-3 text-[14px] font-bold text-learn-ink">{t('বাক্যটি শুনুন')}</p>
              
              {dictationSentences.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setDictIndex((i) => (i + 1) % dictationSentences.length);
                    setTyped('');
                    setResult(null);
                  }}
                  className="mt-2 text-[13px] font-semibold text-learn-primary cursor-pointer hover:underline"
                >
                  {t('পরের বাক্য')}
                </button>
              )}

              {/* Cohesive speed selector and replay controller */}
              <div className="mt-4 flex items-center bg-[#eaf0fc] rounded-full p-1 shadow-sm">
                {['0.75', '1.0', '1.25'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={cn(
                      'h-9 rounded-full px-4 text-[13px] font-bold transition-all cursor-pointer',
                      speed === s ? 'bg-learn-primary text-white shadow-sm' : 'text-learn-primary hover:opacity-80'
                    )}
                  >
                    {formatSpeed(s)}
                  </button>
                ))}
                <div className="h-6 w-[1px] bg-learn-primary/20 mx-2" />
                <button
                  type="button"
                  onClick={() => play()}
                  className="flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-bold text-learn-primary active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">replay</span>
                  <span>{t('আবার')}</span>
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <textarea
                value={typed}
                onChange={(e) => { setTyped(e.target.value); setResult(null); }}
                placeholder={t('যা শুনলেন লিখুন…')}
                rows={3}
                className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-learn-ink placeholder:text-learn-muted/60 focus:outline-none"
              />
              <p className="mt-2 text-right text-[13px] text-learn-muted">{toBnDigits(typedWords)} {t('শব্দ')}</p>
            </div>

            <button
              className="w-full h-12 flex items-center justify-center gap-2 rounded-[14px] bg-learn-primary text-[15px] font-bold text-white hover:bg-learn-primary-dark active:scale-[0.98] transition-all cursor-pointer shadow-md"
              onClick={check}
            >
              <span>{t('মিলিয়ে দেখুন')}</span>
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </button>

            {result && (
              <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {result.matched.map((m, i) => (
                    <span
                      key={i}
                      className={cn(
                        'rounded-[6px] px-2.5 py-1.5 text-[14px] font-bold border',
                        m.ok 
                          ? 'bg-learn-success-tint text-learn-success border-learn-success/10' 
                          : 'bg-learn-danger-tint text-learn-danger border-learn-danger/10'
                      )}
                    >
                      {m.w}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-2 flex-1 rounded-full bg-learn-structure overflow-hidden">
                    <div 
                      className="h-full bg-learn-success rounded-full transition-all duration-500" 
                      style={{ width: `${(result.matched.filter(m => m.ok).length / Math.max(1, result.matched.length)) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-bold text-learn-muted shrink-0">
                    {t('{total}টির মধ্যে {n}টি শব্দ মিলেছে', { total: toBnDigits(result.matched.length), n: toBnDigits(result.matched.filter((m) => m.ok).length) })}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5 rounded-[14px] bg-[#eaf0fc]/35 px-4 py-3 text-[13px] text-learn-muted">
              <span className="material-symbols-outlined text-[20px] shrink-0 text-learn-muted mt-0.5">info</span>
              <span>{t('ডিভাইসের ভয়েস ব্যবহার হয়, কোনো অডিও ফাইল নামাতে হয় না')}</span>
            </div>
          </>
        ) : comp.done ? (
          <div className="flex flex-col items-center pt-2">
            <ScoreRing value={compQuestions.length > 0 ? Math.round((compScore / compQuestions.length) * 100) : 0} size={140} stroke={10} tone="success">
              <span className="text-[20px] font-bold text-[#14172b]">
                {toBnDigits(compScore)}/{toBnDigits(compQuestions.length)}
              </span>
            </ScoreRing>
            <p className="mt-3 text-[16px] font-bold text-learn-ink">
              {compScore === compQuestions.length ? t('দারুণ! সব সঠিক') : t('ফলাফল দেখুন')}
            </p>
            <button
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border-2 border-learn-primary/30 text-learn-primary text-[15px] font-bold hover:bg-learn-primary-tint/20 active:scale-[0.98] transition-all cursor-pointer"
              onClick={() => {
                setComp({ qIndex: 0, answers: [], done: false });
                setSelected(null);
              }}
            >
              <span className="material-symbols-outlined text-[20px]">replay</span>
              {t('আবার চেষ্টা করুন')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center rounded-[14px] bg-white p-5 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <button
                type="button"
                aria-label={t('শুনুন')}
                onClick={() => play()}
                className="flex size-[72px] items-center justify-center rounded-full bg-learn-primary text-white shadow-[0px_10px_24px_rgba(43,89,195,0.28)] transition-transform active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[36px] font-variation-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
              <p className="mt-3 text-[14px] font-bold text-learn-ink">{t('অনুচ্ছেদটি শুনুন')}</p>
            </div>

            <p className="text-[13px] text-learn-muted">{t('প্রশ্ন {n}', { n: `${toBnDigits(comp.qIndex + 1)}/${toBnDigits(compQuestions.length)}` })}</p>
            <p className="mt-1 text-[20px] font-bold leading-[28px]">{q.q}</p>
            <div className="mt-3 space-y-3">
              {q.options.map((opt, i) => (
                <AnswerRow key={i} letter={String.fromCharCode(65 + i)} label={opt} state={selected === i ? 'selected' : 'idle'} onClick={() => answerComp(i)} />
              ))}
            </div>
            <button
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-learn-primary text-[15px] font-bold text-white hover:bg-learn-primary-dark active:scale-[0.98] transition-all cursor-pointer shadow-md"
              onClick={() => {
                if (comp.qIndex + 1 < compQuestions.length) {
                  setComp((c) => ({ ...c, qIndex: c.qIndex + 1 }));
                  setSelected(null);
                } else {
                  finishComp();
                }
              }}
            >
              {comp.qIndex + 1 >= compQuestions.length ? t('শেষ করুন') : t('পরের প্রশ্ন')}
            </button>
          </>
        )}
      </div>
    </LearnerShell>
  );
}

const COMPREHENSION_TEXT =
  'Rahim wakes up at six every morning. He drinks tea and reads the newspaper. Then he goes to the office by bus.';

const COMPREHENSION = {
  questions: [
    { q: 'What time does Rahim wake up?', options: ['At seven', 'At six', 'At five', 'At eight'], answer: 1 },
    { q: 'What does he drink in the morning?', options: ['Coffee', 'Milk', 'Tea', 'Juice'], answer: 2 },
    { q: 'How does he go to the office?', options: ['By car', 'By train', 'By bus', 'By rickshaw'], answer: 2 },
  ],
};

const COMPREHENSION_DEFAULT = { text: COMPREHENSION_TEXT, questions: COMPREHENSION.questions };
