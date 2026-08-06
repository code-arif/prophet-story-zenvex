import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { postJson } from '../../../lib/api';
import { ScoreRing } from '../../../components/ScoreRing';
import { AnswerRow } from '../../../components/AnswerRow';
import { buttonVariants } from '../../../components/ui/button';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 25 — কুইজ চলছে / Quiz Session (Stitch, feature 8).
 * Full-screen session: one question at a time with an amber timer, then a
 * scored result with per-mistake explanations. Questions come from the
 * backend; the finished attempt is persisted via POST /practice/quiz/attempt.
 */
export default function QuizSession({ quiz = null, questions = QUESTIONS }) {
  const [qIndex, setQIndex] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [answers, setAnswers] = React.useState([]);
  const [timer, setTimer] = React.useState(30);
  const postedRef = React.useRef(false);

  React.useEffect(() => {
    if (qIndex >= questions.length) return;
    setTimer(30);
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [qIndex]);

  const { t } = useI18n();
  const finished = qIndex >= questions.length;
  const correct = answers.filter((a, i) => a === questions[i]?.answer).length;
  const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  // Persist the attempt once when the quiz finishes.
  React.useEffect(() => {
    if (finished && !postedRef.current && quiz?.id) {
      postedRef.current = true;
      postJson('/practice/quiz/attempt', { quiz_id: quiz.id, answers }).catch(() => {});
    }
  }, [finished, quiz, answers]);

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswers((prev) => [...prev, i]);
  };

  // Skip: record null (counts as wrong) and advance without faking an answer.
  const skip = () => {
    if (selected !== null) return;
    setSelected(-1);
    setAnswers((prev) => [...prev, null]);
  };

  const next = () => {
    setSelected(null);
    setQIndex((q) => q + 1);
  };

  const restart = () => {
    postedRef.current = false;
    setQIndex(0);
    setSelected(null);
    setAnswers([]);
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-white">
      <Head title={t('কুইজ চলছে')} />
      {finished ? (
        <ResultView correct={correct} total={questions.length} pct={pct} answers={answers} questions={questions} onRetry={restart} />
      ) : (
        <QuestionView
          index={qIndex}
          total={questions.length}
          timer={timer}
          selected={selected}
          questions={questions}
          onChoose={choose}
          onSkip={skip}
          onNext={next}
        />
      )}
    </div>
  );
}

function QuestionView({ index, total, timer, selected, questions, onChoose, onSkip, onNext }) {
  const { t } = useI18n();
  const q = questions[index] || QUESTIONS[index] || { topic: '', q: '', options: [] };
  const last = index + 1 >= total;
  const answered = selected !== null;
  return (
    <>
      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-2 px-5 py-3">
          <Link href="/practice/quiz" className="flex size-12 shrink-0 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95" aria-label={t('বন্ধ করুন')}>
            <X className="size-5" strokeWidth={2} />
          </Link>
          <p className="min-w-0 flex-1 text-center text-[15px] font-semibold text-learn-ink">
            {t('প্রশ্ন {n}', { n: `${toBnDigits(index + 1)}/${toBnDigits(total)}` })}
          </p>
          <span className="flex h-9 shrink-0 items-center rounded-full bg-learn-warn-tint px-3 text-[13px] font-bold text-learn-warn">
            {toBnDigits(String(Math.floor(timer / 60)).padStart(2, '0'))}:{toBnDigits(String(timer % 60).padStart(2, '0'))}
          </span>
        </header>

        {/* Progress bar */}
        <div className="mx-5 h-1 overflow-hidden rounded-full bg-learn-structure">
          <div
            className="h-full rounded-full bg-learn-primary transition-all duration-500"
            style={{ width: `${((index + (selected !== null ? 1 : 0.25)) / total) * 100}%` }}
          />
        </div>

        <div className="flex-1 px-5 pb-4 pt-6">
          <p className="text-[13px] font-semibold text-learn-muted">{q.topic}</p>
          <h1 className="mt-1 text-[20px] font-bold leading-[28px] text-learn-ink">{q.q}</h1>
          <div className="mt-4 space-y-3">
            {q.options.map((opt, i) => (
              <AnswerRow
                key={i}
                letter={String.fromCharCode(65 + i)}
                label={opt}
                state={selected === i ? 'selected' : 'idle'}
                onClick={() => onChoose(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fixed */}
      <div className="border-t border-learn-structure/70 bg-white px-5 py-3">
        <div className="mx-auto w-full max-w-[960px]">
          <button
            className={cn(buttonVariants({ size: 'learner' }), !answered && 'pointer-events-none opacity-50')}
            onClick={onNext}
          >
            {last ? t('ফলাফল দেখুন') : t('পরের প্রশ্ন')}
          </button>
          {!answered && (
            <button
              type="button"
              onClick={onSkip}
              className="mt-1 w-full text-center text-[13px] text-learn-muted underline underline-offset-2"
            >
              {t('এই প্রশ্নটি বাদ দিন')}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function ResultView({ correct, total, pct, answers, questions, onRetry }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--learn-bg))]">
      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
      <header className="px-5 py-3 text-center">
        <p className="text-[15px] font-semibold text-learn-ink">{t('ফলাফল')}</p>
      </header>

      <div className="flex-1 space-y-4 px-5 pb-4">
        {/* Score ring */}
        <div className="flex flex-col items-center pt-2">
          <ScoreRing value={pct} size={140} stroke={10} tone="success">
            <span className="text-[22px] font-bold text-learn-ink">
              {toBnDigits(correct)}/{toBnDigits(total)}
            </span>
          </ScoreRing>
          <p className="mt-3 text-[16px] font-bold text-learn-ink">
            {pct >= 70 ? t('ভালো করেছেন') : pct >= 40 ? t('আরেকটু অনুশীলন করুন') : t('আবার চেষ্টা করুন')}
          </p>
        </div>

        {/* Skill bars */}
        <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <p className="mb-3 text-[14px] font-semibold text-learn-ink">{t('দক্ষতা অনুযায়ী')}</p>
          <div className="space-y-2.5">
            {SKILLS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-9 shrink-0 text-[13px] text-learn-muted">{t(s.label)}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-learn-structure">
                  <div className={cn('h-full rounded-full', s.tone)} style={{ width: `${s.value}%` }} />
                </div>
                <span className="w-9 shrink-0 text-right text-[13px] font-semibold text-learn-ink">{toBnDigits(s.value)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mistakes */}
        <div>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">{t('যেগুলো ভুল হয়েছে')}</p>
          <div className="space-y-3">
            {questions.map((q, i) =>
              answers[i] === q.answer ? null : (
                <div key={q.q} className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                  <p className="text-[13px] text-learn-muted">{q.topic}</p>
                  <p className="mt-0.5 text-[14px] font-semibold text-learn-ink">{q.q}</p>
                  <p className="mt-2 text-[13px]">
                    {answers[i] === null ? (
                      <span className="text-learn-muted">{t('প্রশ্নটি বাদ দেওয়া হয়েছে')}</span>
                    ) : (
                      <>
                        <span className="text-learn-danger line-through">{q.options[answers[i]]}</span>
                        <span className="mx-1.5 text-learn-muted">→</span>
                        <span className="font-bold text-learn-success">{q.options[q.answer]}</span>
                      </>
                    )}
                  </p>
                  <p className="mt-1.5 text-[13px] text-learn-muted">{q.reasonBn}</p>
                  <Link href="/learn/grammar/present-simple" className="mt-2 inline-block text-[13px] font-semibold text-learn-primary underline underline-offset-2">
                    {t('নিয়মটি পড়ুন')}
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      </div>

      {/* Bottom row */}
      <div className="border-t border-learn-structure/70 bg-white px-5 py-3">
        <div className="mx-auto flex max-w-[960px] gap-3">
          <button className={cn(buttonVariants({ variant: 'outlineBlue', size: 'learner' }), 'flex-1')} onClick={onRetry}>
            {t('আবার দিন')}
          </button>
          <Link href="/practice/quiz" className={cn(buttonVariants({ size: 'learner' }), 'flex-1')}>
            {t('শেষ করুন')}
          </Link>
        </div>
      </div>
    </div>
  );
}

const SKILLS = [
  { label: 'গ্রামার', value: 80, tone: 'bg-learn-primary' },
  { label: 'শব্দ', value: 70, tone: 'bg-learn-primary' },
  { label: 'পড়া', value: 60, tone: 'bg-learn-primary' },
  { label: 'শোনা', value: 50, tone: 'bg-learn-warn' },
];

const QUESTIONS = [
  { topic: 'Preposition', q: 'He has been living in Dhaka ____ 2019.', options: ['since', 'for', 'from', 'at'], answer: 0, reasonBn: "কোনো সময়ের শুরু বোঝাতে since ব্যবহৃত হয়।" },
  { topic: 'Tense', q: 'She ____ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1, reasonBn: "He/She/It এর সাথে Present Simple-এ verb এর শেষে s/es যোগ হয়।" },
  { topic: 'Article', q: 'He is ____ honest man.', options: ['a', 'an', 'the', 'no article'], answer: 1, reasonBn: "honest শব্দের শুরুতে vowel sound, তাই an ব্যবহৃত হয়।" },
  { topic: 'Vocabulary', q: 'Choose the closest meaning of "reliable".', options: ['ঢিলেঢালা', 'নির্ভরযোগ্য', 'উদাসীন', 'কঠোর'], answer: 1, reasonBn: "reliable মানে নির্ভরযোগ্য।" },
  { topic: 'Preposition', q: 'We arrived ____ the station at noon.', options: ['to', 'at', 'in', 'on'], answer: 1, reasonBn: "ছোট জায়গা বা নির্দিষ্ট বিন্দু বোঝাতে at ব্যবহৃত হয়।" },
];
