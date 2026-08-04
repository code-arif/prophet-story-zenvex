import React from 'react';
import { Head } from '@inertiajs/react';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { AnswerRow } from '../../../components/AnswerRow';
import { ScoreRing } from '../../../components/ScoreRing';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 22 — লিসেনিং প্র্যাকটিস / Listening Practice (Stitch, feature 5).
 * Dictation (type what you hear, word-by-word scoring) and comprehension
 * (MCQs) using the device voice. UI-phase demo sentences.
 */
export default function Listening() {
  const [tab, setTab] = React.useState('dictation');
  const [speed, setSpeed] = React.useState('১.০x');
  const [typed, setTyped] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [comp, setComp] = React.useState({ qIndex: 0, answers: [], done: false });
  const [selected, setSelected] = React.useState(null);

  const sentence = 'The bus leaves at seven.';
  const typedWords = typed.trim() === '' ? 0 : typed.trim().split(/\s+/).length;

  const play = (rate = Number(speed.replace('x', '').replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d)))) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(tab === 'dictation' ? sentence : COMPREHENSION_TEXT);
    u.lang = 'en-US';
    u.rate = rate;
    window.speechSynthesis.speak(u);
  };

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

  const q = COMPREHENSION.questions[comp.qIndex];
  const compScore = comp.answers.filter((a, i) => a === COMPREHENSION.questions[i]?.answer).length;

  return (
    <LearnerShell showBack activeTab="practice" title="লিসেনিং প্র্যাকটিস">
      <div className="mt-2 space-y-4">
        <Head title="লিসেনিং প্র্যাকটিস" />
        <SegmentedControl
          value={tab}
          onChange={(v) => {
            setTab(v);
            setResult(null);
            setComp({ qIndex: 0, answers: [], done: false });
            setSelected(null);
          }}
          options={[
            { label: 'ডিকটেশন', value: 'dictation' },
            { label: 'বুঝে উত্তর দিন', value: 'comprehension' },
          ]}
        />

        {tab === 'dictation' ? (
          <>
            {/* Play card */}
            <div className="flex flex-col items-center rounded-[14px] bg-white p-5 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <button
                type="button"
                aria-label="শুনুন"
                onClick={() => play()}
                className="flex size-[72px] items-center justify-center rounded-full bg-learn-primary text-white shadow-[0px_10px_24px_rgba(43,89,195,0.28)] transition-transform active:scale-95"
              >
                <Play className="size-7 fill-current" strokeWidth={2} />
              </button>
              <p className="mt-3 text-[14px] font-semibold text-learn-ink">বাক্যটি শুনুন</p>
              <p className="text-[12px] text-learn-muted">৩/১০</p>

              <div className="mt-4 flex items-center gap-2">
                {['০.৭৫x', '১.০x', '১.২৫x'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={cn(
                      'h-8 rounded-full px-3.5 text-[12px] font-semibold transition-colors',
                      speed === s ? 'bg-learn-primary text-white' : 'bg-learn-structure text-learn-muted'
                    )}
                  >
                    {s}
                  </button>
                ))}
                <button type="button" onClick={() => play()} className="flex h-8 items-center gap-1 rounded-full bg-learn-structure px-3 text-[12px] font-semibold text-learn-muted">
                  <RotateCcw className="size-3.5" strokeWidth={2} />
                  আবার
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <textarea
                value={typed}
                onChange={(e) => { setTyped(e.target.value); setResult(null); }}
                placeholder="যা শুনলেন লিখুন…"
                rows={3}
                className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-learn-ink placeholder:text-learn-muted/60 focus:outline-none"
              />
              <p className="mt-2 text-right text-[12px] text-learn-muted">{toBnDigits(typedWords)} শব্দ</p>
            </div>

            <button className={buttonVariants({ size: 'learner' })} onClick={check}>
              মিলিয়ে দেখুন
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
                  {toBnDigits(result.matched.length)}টির মধ্যে {toBnDigits(result.matched.filter((m) => m.ok).length)}টি শব্দ মিলেছে
                </p>
              </div>
            )}

            <p className="text-center text-[12px] text-learn-muted">ডিভাইসের ভয়েস ব্যবহার হয়, কোনো অডিও ফাইল নামাতে হয় না</p>
          </>
        ) : comp.done ? (
          <div className="flex flex-col items-center pt-2">
            <ScoreRing value={Math.round((compScore / COMPREHENSION.questions.length) * 100)} size={140} stroke={10} tone="success">
              <span className="text-[20px] font-bold text-learn-ink">
                {toBnDigits(compScore)}/{toBnDigits(COMPREHENSION.questions.length)}
              </span>
            </ScoreRing>
            <p className="mt-3 text-[16px] font-bold text-learn-ink">
              {compScore === COMPREHENSION.questions.length ? 'দারুণ! সব সঠিক' : 'ফলাফল দেখুন'}
            </p>
            <button
              className={cn(buttonVariants({ variant: 'outlineBlue', size: 'learner' }), 'mt-6')}
              onClick={() => {
                setComp({ qIndex: 0, answers: [], done: false });
                setSelected(null);
              }}
            >
              <RotateCcw className="size-4" strokeWidth={2} />
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center rounded-[14px] bg-white p-5 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <button
                type="button"
                aria-label="শুনুন"
                onClick={() => play()}
                className="flex size-[72px] items-center justify-center rounded-full bg-learn-primary text-white shadow-[0px_10px_24px_rgba(43,89,195,0.28)] transition-transform active:scale-95"
              >
                <Play className="size-7 fill-current" strokeWidth={2} />
              </button>
              <p className="mt-3 text-[14px] font-semibold text-learn-ink">অনুচ্ছেদটি শুনুন</p>
            </div>

            <p className="text-[13px] text-learn-muted">প্রশ্ন {toBnDigits(comp.qIndex + 1)}/{toBnDigits(COMPREHENSION.questions.length)}</p>
            <p className="mt-1 text-[20px] font-bold leading-[28px]">{q.q}</p>
            <div className="mt-3 space-y-3">
              {q.options.map((opt, i) => (
                <AnswerRow key={i} letter={String.fromCharCode(65 + i)} label={opt} state={selected === i ? 'selected' : 'idle'} onClick={() => answerComp(i)} />
              ))}
            </div>
            <button
              className={cn(buttonVariants({ size: 'learner' }), selected === null && 'pointer-events-none opacity-50')}
              onClick={() => {
                if (comp.qIndex + 1 < COMPREHENSION.questions.length) {
                  setComp((c) => ({ ...c, qIndex: c.qIndex + 1 }));
                  setSelected(null);
                } else {
                  finishComp();
                }
              }}
            >
              {comp.qIndex + 1 >= COMPREHENSION.questions.length ? 'শেষ করুন' : 'পরের প্রশ্ন'}
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
