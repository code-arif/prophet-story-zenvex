import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { AnswerRow } from '../../../components/AnswerRow';
import { ScoreRing } from '../../../components/ScoreRing';
import { buttonVariants } from '../../../components/ui/button';
import { useI18n } from '../../../lib/i18n';
import { speak, SPEED_OPTIONS, normalizeSpeed, formatSpeed } from '../../../lib/speech';

/**
 * Screen 22 — লিসেনিং প্র্যাকটিস / Listening Practice (Stitch, feature 5).
 * Dictation (type what you hear, word-by-word scoring) and comprehension
 * (MCQs) using the device voice. Sentences + comprehension come from the
 * backend.
 */
export default function Listening({
  dictationSentences = ['The bus leaves at seven.'],
  comprehension = COMPREHENSION_DEFAULT,
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

  return (
    <LearnerShell showBack activeTab="practice" title={t('লিসেনিং প্র্যাকটিস')}>
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
          options={[
            { label: t('ডিকটেশন'), value: 'dictation' },
            { label: t('বুঝে উত্তর দিন'), value: 'comprehension' },
          ]}
        />

        {tab === 'dictation' ? (
          <>
            {/* Play card */}
            <div className="flex flex-col items-center rounded-[14px] bg-white p-5 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <button
                type="button"
                aria-label={t('শুনুন')}
                onClick={() => play()}
                className="flex size-[72px] items-center justify-center rounded-full bg-learn-primary text-white shadow-[0px_10px_24px_rgba(43,89,195,0.28)] transition-transform active:scale-95"
              >
                <Play className="size-7 fill-current" strokeWidth={2} />
              </button>
              <p className="mt-3 text-[14px] font-semibold text-learn-ink">{t('বাক্যটি শুনুন')}</p>
              <p className="text-[13px] text-learn-muted">
                {toBnDigits(dictIndex + 1)}/{toBnDigits(dictationSentences.length)}
              </p>
              {dictationSentences.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setDictIndex((i) => (i + 1) % dictationSentences.length);
                    setTyped('');
                    setResult(null);
                  }}
                  className="mt-2 text-[13px] font-semibold text-learn-primary"
                >
                  {t('পরের বাক্য')}
                </button>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={cn(
                      'h-12 rounded-full px-4 text-[13px] font-semibold transition-colors',
                      speed === s ? 'bg-learn-primary text-white' : 'bg-learn-structure text-learn-muted'
                    )}
                  >
                    {formatSpeed(s)}
                  </button>
                ))}
                <button type="button" onClick={() => play()} className="flex h-12 items-center gap-1 rounded-full bg-learn-structure px-3.5 text-[13px] font-semibold text-learn-muted">
                  <RotateCcw className="size-3.5" strokeWidth={2} />
                  {t('আবার')}
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

            <button className={buttonVariants({ size: 'learner' })} onClick={check}>
              {t('মিলিয়ে দেখুন')}
            </button>

            {result && (
              <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                <p className="text-[15px] leading-loose">
                  {result.matched.map((m, i) => (
                    <span key={i} className="mr-1.5">
                      <span className={cn('rounded px-0.5', m.ok ? 'bg-learn-success-tint text-learn-success' : 'bg-learn-danger-tint text-learn-danger')}>
                        {m.w}
                      </span>
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-[13px] text-learn-muted">
                  {t('{total}টির মধ্যে {n}টি শব্দ মিলেছে', { total: toBnDigits(result.matched.length), n: toBnDigits(result.matched.filter((m) => m.ok).length) })}
                </p>
              </div>
            )}

            <p className="text-center text-[13px] text-learn-muted">{t('ডিভাইসের ভয়েস ব্যবহার হয়, কোনো অডিও ফাইল নামাতে হয় না')}</p>
          </>
        ) : comp.done ? (
          <div className="flex flex-col items-center pt-2">
            <ScoreRing value={compQuestions.length > 0 ? Math.round((compScore / compQuestions.length) * 100) : 0} size={140} stroke={10} tone="success">
              <span className="text-[20px] font-bold text-learn-ink">
                {toBnDigits(compScore)}/{toBnDigits(compQuestions.length)}
              </span>
            </ScoreRing>
            <p className="mt-3 text-[16px] font-bold text-learn-ink">
              {compScore === compQuestions.length ? t('দারুণ! সব সঠিক') : t('ফলাফল দেখুন')}
            </p>
            <button
              className={cn(buttonVariants({ variant: 'outlineBlue', size: 'learner' }), 'mt-6')}
              onClick={() => {
                setComp({ qIndex: 0, answers: [], done: false });
                setSelected(null);
              }}
            >
              <RotateCcw className="size-4" strokeWidth={2} />
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
                className="flex size-[72px] items-center justify-center rounded-full bg-learn-primary text-white shadow-[0px_10px_24px_rgba(43,89,195,0.28)] transition-transform active:scale-95"
              >
                <Play className="size-7 fill-current" strokeWidth={2} />
              </button>
              <p className="mt-3 text-[14px] font-semibold text-learn-ink">{t('অনুচ্ছেদটি শুনুন')}</p>
            </div>

            <p className="text-[13px] text-learn-muted">{t('প্রশ্ন {n}', { n: `${toBnDigits(comp.qIndex + 1)}/${toBnDigits(compQuestions.length)}` })}</p>
            <p className="mt-1 text-[20px] font-bold leading-[28px]">{q.q}</p>
            <div className="mt-3 space-y-3">
              {q.options.map((opt, i) => (
                <AnswerRow key={i} letter={String.fromCharCode(65 + i)} label={opt} state={selected === i ? 'selected' : 'idle'} onClick={() => answerComp(i)} />
              ))}
            </div>
            <button
              className={cn(buttonVariants({ size: 'learner' }), selected === null && 'pointer-events-none opacity-50')}
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
