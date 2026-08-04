import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { SessionShell } from '../../../components/SessionShell';
import { Callout } from '../../../components/Callout';
import { SpeakerButton } from '../../../components/SpeakerButton';
import { Chip } from '../../../components/Chip';
import { ScoreRing } from '../../../components/ScoreRing';
import { buttonVariants } from '../../../components/ui/button';

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

  const exercise = lesson.exercises[exIndex];
  const isLast = exIndex === lesson.exercises.length - 1;
  const passed = (score / lesson.exercises.length) * 100 >= 70;

  const headerProgress = phase === 'result' ? 100 : phase === 'intro' ? 20 : 40 + exIndex * 20;

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

  const primaryAction =
    phase === 'intro' ? (
      <div className="space-y-2">
        <p className="text-center text-[13px] text-learn-muted">{toBnDigits(lesson.exercises.length)}টি অনুশীলন, শেষে একটি চেক</p>
        <button className={buttonVariants({ size: 'learner' })} onClick={() => setPhase('ex')}>
          অনুশীলন শুরু করুন
        </button>
      </div>
    ) : phase === 'ex' ? (
      <button
        className={cn(buttonVariants({ size: 'learner' }), !answered && 'pointer-events-none opacity-50')}
        onClick={handleNext}
      >
        {isLast ? 'ফলাফল দেখুন' : 'পরের অনুশীলন'}
      </button>
    ) : (
      <Link href="/learn/lessons" className={cn(buttonVariants({ size: 'learner' }), 'w-full')}>
        {passed ? 'পরের পাঠ' : 'আবার চেষ্টা করুন'}
      </Link>
    );

  return (
    <SessionShell
      title={phase === 'ex' ? 'অনুশীলন' : phase === 'result' ? 'ফলাফল' : lesson.titleEn}
      progress={headerProgress}
      segments={5}
      counter={phase === 'ex' ? `${toBnDigits(exIndex + 1)}/${toBnDigits(lesson.exercises.length)}` : undefined}
      onClose={() => window.history.back()}
      primaryAction={primaryAction}
    >
      <Head title="পাঠ" />
      {phase === 'intro' && <Intro lesson={lesson} />}
      {phase === 'ex' && <Exercise exercise={exercise} selected={selected} answered={answered} onAnswer={handleAnswer} />}
      {phase === 'result' && <Result score={score} total={lesson.exercises.length} passed={passed} />}
    </SessionShell>
  );
}

function Intro({ lesson }) {
  return (
    <div className="pt-2">
      <h1 className="text-[22px] font-bold leading-[30px]">{lesson.titleEn}</h1>
      <p className="mt-1 text-[14px] text-learn-muted">{lesson.subtitleBn}</p>

      <Callout title="ব্যাখ্যা" tone="primary" className="mt-4">
        {lesson.explanationBn}
      </Callout>

      <h2 className="mt-5 text-[16px] font-semibold">উদাহরণ</h2>
      <div className="mt-2 space-y-2.5">
        {lesson.examples.map((ex) => (
          <div key={ex.en} className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 ring-1 ring-learn-border">
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-learn-ink">{ex.en}</span>
              <span className="block text-[13px] text-learn-muted">{ex.bn}</span>
            </span>
            <SpeakerButton text={ex.en} size="sm" />
          </div>
        ))}
      </div>

      <h2 className="mt-5 text-[16px] font-semibold">মনে রাখুন</h2>
      <div className="mt-2 space-y-2 rounded-[14px] bg-white p-4 ring-1 ring-learn-border">
        <p className="text-[14px] text-learn-ink">✓ He / She / It এর সাথে verb এর শেষে s যোগ হয়</p>
        <p className="text-[14px]">
          <span className="text-learn-danger line-through">He go to office.</span>{' '}
          <span className="text-learn-muted">→</span>{' '}
          <span className="font-semibold text-learn-success">He goes to office.</span>
        </p>
      </div>
    </div>
  );
}

function Exercise({ exercise, selected, answered, onAnswer }) {
  return (
    <div className="pt-2">
      <p className="text-[13px] font-semibold text-learn-muted">{exercise.typeBn}</p>
      <p className="mt-2 text-[20px] font-bold leading-[30px]">
        {exercise.q.split('___').map((part, i, parts) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && <span className="text-learn-primary underline decoration-dotted">______</span>}
          </React.Fragment>
        ))}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {exercise.options.map((opt, i) => (
          <Chip
            key={opt}
            selected={selected === i}
            disabled={answered && selected !== i}
            onClick={() => onAnswer(i)}
          >
            {opt}
          </Chip>
        ))}
      </div>

      {answered && (
        <div
          className={cn(
            'mt-5 rounded-[14px] border-l-[3px] p-4',
            selected === exercise.answer ? 'border-learn-success bg-learn-success-tint' : 'border-learn-danger bg-learn-danger-tint'
          )}
        >
          <p className={cn('text-[15px] font-bold', selected === exercise.answer ? 'text-learn-success' : 'text-learn-danger')}>
            {selected === exercise.answer ? 'সঠিক!' : 'ভুল হয়েছে'}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-learn-ink">{exercise.explanationBn}</p>
        </div>
      )}
    </div>
  );
}

function Result({ score, total, passed }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <ScoreRing value={pct} size={150} tone={passed ? 'success' : 'primary'}>
        <span className="text-[28px] font-bold text-learn-ink">{toBnDigits(score)}/{toBnDigits(total)}</span>
      </ScoreRing>
      <h2 className="mt-5 text-[20px] font-bold">{passed ? 'ভালো করেছেন!' : 'আবার চেষ্টা করুন'}</h2>
      <p className="mt-1 text-[13px] text-learn-muted">
        {passed
          ? '৭০% বা তার বেশি — পরের পাঠ খুলে গেছে'
          : '৭০% পেলেই পরের পাঠ খুলবে — এই পাঠটি আবার দেখুন'}
      </p>
      {!passed && (
        <Link href="/learn/grammar/present-simple" className={cn(buttonVariants({ variant: 'outlineBlue', size: 'learner' }), 'mt-6 max-w-64')}>
          নিয়মটি পড়ুন
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
