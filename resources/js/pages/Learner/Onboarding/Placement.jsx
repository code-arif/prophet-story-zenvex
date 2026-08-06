import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '../../../components/ui/button';
import { AnswerRow } from '../../../components/AnswerRow';
import { SessionShell } from '../../../components/SessionShell';
import { toBnDigits } from '../../../lib/format';
import { scorePlacement, levelForScore, SKILL_LABELS } from './placementLogic';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 05 — লেভেল নির্ণয় পরীক্ষা / Placement Test (Stitch, feature 15).
 * Focused session screen: close X, centered title, counter chip, progress bar,
 * single primary action. 15 fixed questions — no grading until the end.
 *
 * UI-phase wiring: on finish it computes the result and calls `onFinish(result)`
 * (default: router.visit('/welcome/placement/result', { data: result })).
 */
export default function Placement({ questions = SAMPLE_QUESTIONS, onFinish }) {
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const { t } = useI18n();

  const total = questions.length;
  const question = questions[index];
  const isLast = index === total - 1;

  const handleNext = () => {
    const nextAnswers = [...answers, selected];

    if (!isLast) {
      setAnswers(nextAnswers);
      setIndex(index + 1);
      setSelected(null);
      return;
    }

    // Finished — grade on the server (authoritative), then show the result.
    if (onFinish) {
      const { score, total: t, bySkill } = scorePlacement(nextAnswers, questions);
      onFinish({ score, total: t, level: levelForScore(score), bySkill });
      return;
    }
    router.post('/welcome/placement/submit', { answers: nextAnswers });
  };

  return (
    <SessionShell
      title={t('লেভেল নির্ণয় পরীক্ষা')}
      progress={(index / total) * 100}
      counter={`${toBnDigits(index + 1)}/${toBnDigits(total)}`}
      onClose={() => window.history.back()}
      primaryAction={
        <div className="space-y-2">
          <p className="text-center text-[13px] text-learn-muted">{t('উত্তর বদলানো যাবে না')}</p>
          <Button size="learner" disabled={selected === null} onClick={handleNext}>
            {isLast ? t('ফলাফল দেখুন') : t('পরের প্রশ্ন')}
          </Button>
        </div>
      }
    >
      <div className="pt-3">
        <span className="text-[13px] font-semibold text-learn-muted">
          {t(SKILL_LABELS[question.skill] || question.skill)}
        </span>
        <p className="mt-1 text-[20px] font-bold leading-[28px] text-learn-ink">{question.q}</p>
        <p className="mt-1 text-[13px] text-learn-muted">{t('সঠিক শব্দটি বেছে নিন')}</p>

        <div className="mt-4 space-y-3">
          {question.options.map((opt, i) => (
            <AnswerRow
              key={i}
              letter={String.fromCharCode(65 + i)}
              label={opt}
              state={selected === i ? 'selected' : 'idle'}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>
      </div>
    </SessionShell>
  );
}

// ── UI-phase sample content (feature 15 ships data/placement.json later) ──
// 15 fixed questions, 5 per band (A1, A2, B1), each with a skill tag.
const SAMPLE_QUESTIONS = [
  { id: 'p1', band: 'A1', skill: 'speaking', q: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1 },
  { id: 'p2', band: 'A1', skill: 'reading', q: 'This is a ___ of water.', options: ['cup', 'car', 'cat', 'day'], answer: 0 },
  { id: 'p3', band: 'A1', skill: 'reading', q: 'I ___ rice every day.', options: ['eat', 'eats', 'eating', 'eaten'], answer: 0 },
  { id: 'p4', band: 'A1', skill: 'listening', q: 'They ___ football on Friday.', options: ['play', 'plays', 'playing', 'played'], answer: 0 },
  { id: 'p5', band: 'A1', skill: 'speaking', q: '"___ are you?" — "I am fine."', options: ['What', 'Who', 'How', 'Where'], answer: 2 },
  { id: 'p6', band: 'A2', skill: 'writing', q: 'He has been living in Dhaka ___ 2019.', options: ['since', 'for', 'from', 'at'], answer: 0 },
  { id: 'p7', band: 'A2', skill: 'writing', q: 'She is ___ in her new job.', options: ['interesting', 'interested', 'interest', 'interests'], answer: 1 },
  { id: 'p8', band: 'A2', skill: 'reading', q: 'The train leaves ___ 7 o’clock.', options: ['on', 'at', 'in', 'to'], answer: 1 },
  { id: 'p9', band: 'A2', skill: 'listening', q: 'We ___ to the market yesterday.', options: ['go', 'went', 'gone', 'going'], answer: 1 },
  { id: 'p10', band: 'A2', skill: 'writing', q: 'If it rains, we ___ at home.', options: ['stay', 'stayed', 'staying', 'will stay'], answer: 3 },
  { id: 'p11', band: 'B1', skill: 'writing', q: 'The report ___ by Monday.', options: ['must finish', 'must be finished', 'must finished', 'finished must'], answer: 1 },
  { id: 'p12', band: 'B1', skill: 'reading', q: 'She ___ to the success of the project.', options: ['contributed', 'contribution', 'contributing', 'contributes'], answer: 0 },
  { id: 'p13', band: 'B1', skill: 'reading', q: 'Despite the rain, the match ___ on.', options: ['went', 'goes', 'was going', 'has gone'], answer: 0 },
  { id: 'p14', band: 'B1', skill: 'writing', q: 'I look forward to ___ from you.', options: ['hear', 'hearing', 'heard', 'hears'], answer: 1 },
  { id: 'p15', band: 'B1', skill: 'speaking', q: 'By next year, I ___ my degree.', options: ['will complete', 'will have completed', 'complete', 'completed'], answer: 1 },
];
