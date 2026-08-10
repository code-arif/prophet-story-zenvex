import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { X, Check, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { SessionShell } from '../../../components/SessionShell';
import { Callout } from '../../../components/Callout';
import { SpeakerButton } from '../../../components/SpeakerButton';
import { Chip } from '../../../components/Chip';
import { ScoreRing } from '../../../components/ScoreRing';
import { buttonVariants } from '../../../components/ui/button';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 10 — পাঠ / Lesson Player (Stitch, feature 1). Full-screen session:
 * explanation → examples → 3 exercises with instant feedback → result.
 * UI-phase demo lesson; content comes from the backend later.
 */
export default function LessonPlayer({ lesson = LESSON }) {
  const [phase, setPhase] = React.useState('intro'); // intro | ex | result
  const [exIndex, setExIndex] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [answered, setAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const { t } = useI18n();
  const exercise = lesson.exercises[exIndex];
  const isLast = exIndex === lesson.exercises.length - 1;
  const passed = (score / lesson.exercises.length) * 100 >= 70;

  const headerProgress = phase === 'result' ? 100 : phase === 'intro' ? 40 : 40 + exIndex * 20;

  const handleAnswer = (optionIndex) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    if (optionIndex === exercise.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (!answered) return;
    setSelected(null);
    setAnswered(false);
    if (isLast) {
      setPhase('result');
    } else {
      setExIndex((i) => i + 1);
    }
  };

  const durationChip = (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-blue-100 bg-[#EEF2FC] px-3 text-[13px] font-bold text-learn-primary shadow-sm">
      <Clock className="size-3.5 text-learn-primary" />
      {t('৩ মিনিট')}
    </span>
  );

  // Desktop: the bottom bar shares the panel's tint + rounded corners and is
  // pulled up to feel attached to the lesson window (mobile is unchanged).
  const primaryAction = (
    <div className="lg:-mt-10 lg:rounded-[20px] lg:border-t lg:border-learn-primary/10 lg:bg-learn-primary-tint/40 lg:px-5 lg:pb-3 lg:pt-3 lg:ring-1 lg:ring-learn-primary/10">
      {phase === 'intro' ? (
        <button
          className={cn(buttonVariants({ size: 'learner' }), 'w-full bg-learn-primary text-white rounded-[14px] h-12 font-bold')}
          onClick={() => setPhase('ex')}
        >
          {t('অনুশীলন শুরু করুন')}
        </button>
      ) : phase === 'ex' ? (
        <button
          className={cn(buttonVariants({ size: 'learner' }), !answered && 'pointer-events-none opacity-50')}
          onClick={handleNext}
        >
          {isLast ? t('ফলাফল দেখুন') : t('পরের অনুশীলন')}
        </button>
      ) : (
        <button
          className={cn(buttonVariants({ size: 'learner' }), 'w-full')}
          onClick={() => {
            if (passed) {
              // Save completion; the server redirects to the next lesson.
              router.post(`/learn/lessons/${lesson.id}/complete`, {
                score,
                total: lesson.exercises.length,
                passed: true,
              });
            } else {
              setPhase('intro');
              setExIndex(0);
              setScore(0);
              setSelected(null);
              setAnswered(false);
            }
          }}
        >
          {passed ? t('পরের পাঠ') : t('আবার চেষ্টা করুন')}
        </button>
      )}
    </div>
  );

  return (
    <SessionShell
      title={phase === 'ex' ? t('অনুশীলন') : phase === 'result' ? t('ফলাফল') : undefined}
      progress={headerProgress}
      segments={5}
      right={phase === 'intro' ? durationChip : undefined}
      counter={phase === 'ex' ? `${toBnDigits(exIndex + 1)}/${toBnDigits(lesson.exercises.length)}` : undefined}
      onClose={() => router.visit('/learn/lessons')}
      primaryAction={primaryAction}
    >
      <Head title={t('পাঠ')} />
      {/* Desktop: lesson content in a rounded tinted panel that fills the
          viewport between header and bottom bar (mobile is unchanged). */}
      <div className="lg:flex lg:h-full lg:flex-col lg:rounded-[20px] lg:bg-learn-primary-tint/40 lg:ring-1 lg:ring-learn-primary/10">
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-5 lg:py-4">
          {phase === 'intro' && <Intro lesson={lesson} />}
          {phase === 'ex' && <Exercise exercise={exercise} selected={selected} answered={answered} onAnswer={handleAnswer} />}
          {phase === 'result' && <Result score={score} total={lesson.exercises.length} passed={passed} />}
        </div>
      </div>
    </SessionShell>
  );
}

function Intro({ lesson }) {
  const { t } = useI18n();
  return (
    <div className="pt-2 pb-4">
      <h1 className="text-[24px] font-extrabold text-learn-ink tracking-tight leading-tight">{lesson.titleEn}</h1>
      <p className="mt-1.5 text-[15px] font-semibold text-learn-muted">{lesson.subtitleBn}</p>

      <div className="mt-4 border-l-[4px] border-learn-primary bg-[#EEF2FC]/80 rounded-[12px] p-4 text-[14px] leading-relaxed text-learn-ink font-medium">
        {lesson.explanationBn}
      </div>

      <h2 className="mt-6 text-[16px] font-bold text-learn-ink mb-3">{t('উদাহরণ')}</h2>
      <div className="space-y-2.5">
        {lesson.examples.map((ex) => (
          <div key={ex.en} className="flex items-center gap-3 rounded-[16px] bg-white p-4 border border-[#c3c6d5]/50 shadow-sm">
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-learn-ink leading-tight">{ex.en}</span>
              <span className="block text-[13px] text-learn-muted mt-1">{ex.bn}</span>
            </span>
            <SpeakerButton text={ex.en} size="transparent" tone="transparent" />
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-[16px] font-bold text-learn-ink mb-3">{t('মনে রাখুন')}</h2>
      <div className="space-y-3">
        <div className="flex items-start gap-2.5 text-[14px] leading-relaxed text-learn-ink font-medium">
          <span className="text-learn-primary font-bold mt-0.5">•</span>
          <span>
            {t('Universal truth বা চিরন্তন সত্য প্রকাশেও এই tense ব্যবহৃত হয়। যেমন:')}{' '}
            <span className="font-semibold text-learn-ink">{t('The sun rises in the east.')}</span>
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-[14px] leading-relaxed">
          <span className="text-learn-primary font-bold mt-0.5">•</span>
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full border border-learn-danger text-learn-danger shrink-0">
              <X className="size-3.5" strokeWidth={3} />
            </span>
            <span className="text-learn-danger line-through">{t('He go to office:')}</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5 text-[14px] leading-relaxed">
          <span className="text-learn-primary font-bold mt-0.5">•</span>
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full border border-learn-success text-learn-success shrink-0">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="font-semibold text-learn-success">{t('He goes to office.')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Exercise({ exercise, selected, answered, onAnswer }) {
  const { t } = useI18n();
  return (
    <div className="pt-2 pb-4">
      <h2 className="text-[20px] font-bold text-learn-ink leading-snug">{t('উপযুক্ত শব্দটি বসান')}</h2>
      <p className="mt-1.5 text-[14px] text-learn-muted">{t('সঠিক গ্রামার ব্যবহার করে বাক্যটি পূরণ করুন।')}</p>

      {/* Question Card */}
      <div className="mt-6 rounded-[20px] bg-white p-6 border border-[#c3c6d5]/50 shadow-sm text-center min-h-32 flex items-center justify-center">
        <p className="text-[20px] font-semibold text-learn-ink leading-relaxed">
          {exercise.q.split('___').map((part, i, parts) => (
            <React.Fragment key={i}>
              {part}
              {i < parts.length - 1 && (
                <span className="inline-block px-2 text-learn-primary border-b-2 border-learn-primary font-extrabold min-w-16">
                  {selected !== null ? exercise.options[selected] : '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* Options Grid (2x2) */}
      <div className="mt-6 grid grid-cols-2 gap-3.5">
        {exercise.options.map((opt, i) => {
          const isSel = selected === i;
          return (
            <button
              key={opt}
              type="button"
              disabled={answered && selected !== i}
              onClick={() => onAnswer(i)}
              className={cn(
                "flex h-14 items-center justify-center rounded-[16px] border text-[16px] font-bold transition-all duration-150 active:scale-[0.98] shadow-sm",
                isSel
                  ? "bg-learn-primary text-white border-learn-primary"
                  : "bg-white text-learn-ink border-[#c3c6d5]/60 hover:bg-learn-bg disabled:opacity-60"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Bottom Full-Width Feedback Strip */}
      {answered && (
        <div
          className={cn(
            'mt-6 -mx-5 px-5 py-4 border-t border-b flex items-start gap-3',
            selected === exercise.answer
              ? 'border-[#c2f3de] bg-[#EAFDF5]'
              : 'border-[#ffc9c9] bg-[#FFF5F5]'
          )}
        >
          {selected === exercise.answer ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-learn-success text-white mt-0.5">
              <Check className="size-4" strokeWidth={3} />
            </span>
          ) : (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-learn-danger text-white mt-0.5">
              <X className="size-4" strokeWidth={3} />
            </span>
          )}
          <div>
            <p className={cn('text-[16px] font-bold', selected === exercise.answer ? 'text-learn-success' : 'text-learn-danger')}>
              {selected === exercise.answer ? t('সঠিক!') : t('ভুল হয়েছে')}
            </p>
            <p className="mt-1 text-[13px] text-learn-ink font-medium leading-relaxed">
              {exercise.explanationBn}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Result({ score, total, passed }) {
  const { t } = useI18n();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <ScoreRing value={pct} size={150} tone={passed ? 'success' : 'primary'}>
        <span className="text-[28px] font-bold text-learn-ink">{toBnDigits(score)}/{toBnDigits(total)}</span>
      </ScoreRing>
      <h2 className="mt-5 text-[20px] font-bold">{passed ? t('ভালো করেছেন!') : t('আবার চেষ্টা করুন')}</h2>
      <p className="mt-1 text-[13px] text-learn-muted">
        {passed
          ? t('৭০% বা তার বেশি — পরের পাঠ খুলে গেছে')
          : t('৭০% পেলেই পরের পাঠ খুলবে — এই পাঠটি আবার দেখুন')}
      </p>
      {!passed && (
        <Link href="/learn/grammar/present-simple" className={cn(buttonVariants({ variant: 'outlineBlue', size: 'learner' }), 'mt-6 max-w-64')}>
          {t('নিয়মটি পড়ুন')}
        </Link>
      )}
    </div>
  );
}

// ── UI-phase demo lesson (feature 1 ships data/curriculum.json later) ──
const LESSON = {
  id: 'A2-U3-L3',
  titleEn: 'Telling the Time',
  subtitleBn: 'সময় বলা শিখুন',
  explanationBn:
    'সময় বোঝাতে o’clock, half past, quarter past এবং quarter to ব্যবহার হয়। "Half past seven" মানে ৭টা বেজে ৩০ মিনিট।',
  examples: [
    { en: 'I wake up at 6 am.', bn: 'আমি সকাল ৬টায় ঘুম থেকে উঠি।' },
    { en: 'The bus leaves at half past seven.', bn: 'বাসটি সাড়ে ৭টায় ছাড়ে।' },
    { en: 'It is quarter to nine.', bn: 'এখন ৯টা বাজতে ১৫ মিনিট বাকি।' },
  ],
  exercises: [
    { typeBn: 'শূন্যস্থান পূরণ', q: 'She goes to bed at ___ past ten.', options: ['half', 'quarter', 'o’clock', 'past'], answer: 0, explanationBn: '"Half past ten" মানে সাড়ে ১০টা।' },
    { typeBn: 'শূন্যস্থান পূরণ', q: 'It is ___ to twelve.', options: ['quarter', 'half', 'o’clock', 'minute'], answer: 0, explanationBn: '"Quarter to twelve" মানে ১২টা বাজতে ১৫ মিনিট বাকি।' },
    { typeBn: 'শূন্যস্থান পূরণ', q: 'The meeting starts at nine ___.', options: ['o’clock', 'half', 'quarter', 'time'], answer: 0, explanationBn: '"Nine o’clock" মানে ঠিক ৯টা।' },
  ],
};
