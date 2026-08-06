import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { postJson } from '../../../lib/api';
import { SessionShell } from '../../../components/SessionShell';
import { BottomSheet, BottomSheetClose } from '../../../components/BottomSheet';
import { SpeakerButton } from '../../../components/SpeakerButton';
import { AnswerRow } from '../../../components/AnswerRow';
import { buttonVariants } from '../../../components/ui/button';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 16 — পাঠ্য পড়ুন / Reading Reader (Stitch, feature 6). Full-screen
 * session: tappable glossary words open a bottom sheet; then comprehension
 * questions with a WPM chip. UI-phase demo passage.
 */
export default function ReadingReader({ passage = PASSAGE }) {
  const [phase, setPhase] = React.useState('read'); // read | quiz
  const [activeWord, setActiveWord] = React.useState(null);
  const [qIndex, setQIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const { t } = useI18n();

  const question = passage.questions[qIndex];
  const isLast = qIndex === passage.questions.length - 1;

  const openWord = (token) => {
    const key = normalizeKey(token);
    const entry = passage.glossary[key];
    if (entry) setActiveWord({ token, ...entry });
  };

  const handleNext = () => {
    const next = [...answers, selected];
    if (!isLast) {
      setAnswers(next);
      setQIndex((i) => i + 1);
      setSelected(null);
    } else {
      setAnswers(next);
      setPhase('done');
      // Persist the comprehension score (best effort).
      const score = next.reduce((acc, a, i) => acc + (a === passage.questions[i]?.answer ? 1 : 0), 0);
      postJson(`/learn/reading/${passage.id}/complete`, {
        score,
        total: passage.questions.length,
      }).catch(() => {});
    }
  };

  const addWordToVocabulary = () => {
    if (activeWord?.token) {
      postJson('/learn/vocabulary/save-word', { word: activeWord.token, saved: true }).catch(() => {});
    }
  };

  return (
    <SessionShell
      title={passage.titleEn}
      progress={phase === 'read' ? 35 : 100}
      right={phase !== 'read' ? <WpmChip wpm={110} /> : undefined}
      onClose={() => window.history.back()}
      primaryAction={
        phase === 'read' ? (
          <button className={buttonVariants({ size: 'learner' })} onClick={() => setPhase('quiz')}>
            {t('প্রশ্নে যান')}
          </button>
        ) : phase === 'quiz' ? (
          <button
            className={cn(buttonVariants({ size: 'learner' }), selected === null && 'pointer-events-none opacity-50')}
            onClick={handleNext}
          >
            {isLast ? t('ফলাফল দেখুন') : t('পরের প্রশ্ন')}
          </button>
        ) : (
          <Link href="/learn/reading" className={cn(buttonVariants({ size: 'learner' }), 'w-full')}>
            {t('শেষ করুন')}
          </Link>
        )
      }
    >
      <Head title={passage.titleEn} />
      {phase === 'read' && (
        <div className="pt-2">
          <p className="text-[17px] leading-[1.7] text-learn-ink">
            {passage.textEn.split(/\s+/).map((token, i) => {
              const isGlossary = Boolean(passage.glossary[normalizeKey(token)]);
              return isGlossary ? (
                <button
                  key={`${token}-${i}`}
                  type="button"
                  onClick={() => openWord(token)}
                  className={cn(
                    'border-b-2 border-dotted border-learn-primary bg-transparent align-baseline [font-family:inherit] transition-colors',
                    activeWord?.token === token && 'rounded bg-learn-primary-tint'
                  )}
                >
                  {token}
                </button>
              ) : (
                <span key={`${token}-${i}`}> {token} </span>
              );
            })}
          </p>
        </div>
      )}

      {phase === 'quiz' && (
        <div className="pt-2">
          <h2 className="text-[16px] font-semibold">{t('বোধগম্যতা যাচাই')}</h2>
          <p className="mt-1 text-[13px] text-learn-muted">
            {t('প্রশ্ন {n}', { n: `${toBnDigits(qIndex + 1)}/${toBnDigits(passage.questions.length)}` })}
          </p>
          <p className="mt-4 text-[20px] font-bold leading-[28px]">{question.q}</p>
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
      )}

      {phase === 'done' && (
        <div className="pt-8 text-center">
          <h2 className="text-[20px] font-bold">{t('সম্পন্ন!')}</h2>
          <p className="mt-1 text-[13px] text-learn-muted">{t('পাঠ্যটি পড়া শেষ — তালিকায় "সম্পন্ন" চিপ দেখাবে')}</p>
        </div>
      )}

      {/* Word bottom sheet */}
      <BottomSheet open={Boolean(activeWord)} onOpenChange={(o) => !o && setActiveWord(null)}>
        {activeWord && (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-bold text-learn-ink">{activeWord.token}</p>
              <SpeakerButton text={activeWord.token} size="sm" />
            </div>
            <p className="mt-1 text-[13px] text-learn-muted">{activeWord.ipa}</p>
            <p className="mt-3 text-[18px] font-bold text-learn-ink">{activeWord.bn}</p>
            <p className="mt-2 text-[14px] font-semibold text-learn-ink">{activeWord.exampleEn}</p>
            <p className="text-[13px] text-learn-muted">{activeWord.exampleBn}</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button className={buttonVariants({ size: 'learner' })} onClick={addWordToVocabulary}>{t('শব্দভাণ্ডারে যোগ করুন')}</button>
              <BottomSheetClose asChild>
                <button className={buttonVariants({ variant: 'outlineBlue', size: 'learner' })}>{t('বন্ধ করুন')}</button>
              </BottomSheetClose>
            </div>
          </div>
        )}
      </BottomSheet>
    </SessionShell>
  );
}

function WpmChip({ wpm }) {
  return (
    <span className="inline-flex h-9 items-center rounded-full bg-learn-primary-tint px-3 text-[13px] font-bold text-learn-primary">
      {toBnDigits(wpm)} WPM
    </span>
  );
}

function normalizeKey(token) {
  return token.toLowerCase().replace(/[.,!?;:""'’]$/g, '');
}

// ── UI-phase demo passage (feature 6 ships data/reading.json later) ──
const PASSAGE = {
  id: 'r1',
  titleEn: 'A Day at the Post Office',
  words: 180,
  textEn:
    'Rahim went to the post office yesterday morning. He wanted to send an envelope to his cousin in Sylhet. He waited in a line for five minutes. When his turn came, he bought a stamp and handed the letter to the clerk. The clerk weighed it and told him the price. Rahim paid the money and left the post office happily. He hopes the letter reaches his cousin soon.',
  glossary: {
    envelope: {
      ipa: '/ˈenvələʊp/',
      bn: 'খাম',
      exampleEn: 'He put the letter inside the envelope.',
      exampleBn: 'তিনি চিঠিটি খামের ভিতরে রাখলেন।',
    },
    clerk: { ipa: '/klɑːk/', bn: 'কর্মচারী', exampleEn: 'The clerk helped him buy a stamp.', exampleBn: 'কর্মচারী তাকে স্ট্যাম্প কিনতে সাহায্য করলেন।' },
    weighed: { ipa: '/weɪd/', bn: 'ওজন করা', exampleEn: 'The clerk weighed the parcel.', exampleBn: 'কর্মচারী প্যাকেটটির ওজন নিলেন।' },
    cousin: { ipa: '/ˈkʌzn/', bn: 'চাচাতো/খালাতো ভাই', exampleEn: 'Her cousin lives in Sylhet.', exampleBn: 'তার চাচাতো ভাই সিলেটে থাকেন।' },
  },
  questions: [
    { q: 'Where did Rahim go yesterday morning?', options: ['To the market', 'To the post office', 'To the bank', 'To the airport'], answer: 1 },
    { q: 'What did Rahim want to send?', options: ['A parcel', 'A stamp', 'An envelope', 'A book'], answer: 2 },
    { q: 'Who did Rahim hand the letter to?', options: ['His cousin', 'The clerk', 'A friend', 'The manager'], answer: 1 },
    { q: 'What did the clerk do with the letter?', options: ['He opened it', 'He weighed it', 'He returned it', 'He read it'], answer: 1 },
    { q: 'How did Rahim feel when he left?', options: ['Sad', 'Angry', 'Happy', 'Tired'], answer: 2 },
  ],
};
