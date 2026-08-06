import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { postJson } from '../../../lib/api';
import { SessionShell } from '../../../components/SessionShell';
import { BottomSheet, BottomSheetClose } from '../../../components/BottomSheet';
import { SpeakerButton } from '../../../components/SpeakerButton';
import { AnswerRow } from '../../../components/AnswerRow';
import { buttonVariants } from '../../../components/ui/button';
import { useI18n } from '../../../lib/i18n';

const WORD_DETAILS = {
  envelope: {
    pos: 'Noun',
    definition: 'A flat paper container, as for a letter or card, as it is usually with a gummed flap on the back.',
  },
  postage: {
    pos: 'Noun',
    definition: 'The charge for mailing a piece of mail, typically represented by a stamp.',
  },
  stamp: {
    pos: 'Noun',
    definition: 'A small adhesive piece of paper stuck to something to show that an amount of money has been paid.',
  },
  counter: {
    pos: 'Noun',
    definition: 'A long flat surface or table in a shop, bank, or post office at which customers are served.',
  },
  delivery: {
    pos: 'Noun',
    definition: 'The action of delivering letters, parcels, or goods to a recipient.',
  },
  clerk: {
    pos: 'Noun',
    definition: 'An employee in an office, shop, or bank who keeps records or handles business tasks.',
  },
  weighed: {
    pos: 'Verb',
    definition: 'Measured the weight of something using a scale.',
  },
  cousin: {
    pos: 'Noun',
    definition: 'A child of one\'s uncle or aunt.',
  }
};

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

  const textFormatButton = (
    <button 
      type="button" 
      className="text-learn-primary font-extrabold text-[18px] tracking-tighter select-none hover:opacity-85"
    >
      tT
    </button>
  );

  return (
    <SessionShell
      title={t('Reading Lesson')}
      progress={phase === 'read' ? 35 : 100}
      right={textFormatButton}
      onClose={() => router.visit('/learn/reading')}
      primaryAction={
        phase === 'read' ? (
          <button 
            type="button"
            onClick={() => setPhase('quiz')}
            className="flex w-full h-12 items-center justify-center gap-1.5 rounded-[14px] bg-[#2b59c3] text-white font-bold text-[14px] transition-transform active:scale-[0.98] shadow-sm"
          >
            {t('প্রশ্নে যান')}
            <ArrowRight className="size-4" />
          </button>
        ) : phase === 'quiz' ? (
          <button
            type="button"
            disabled={selected === null}
            onClick={handleNext}
            className={cn(
              "flex w-full h-12 items-center justify-center gap-1.5 rounded-[14px] bg-[#2b59c3] text-white font-bold text-[14px] transition-transform active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            {isLast ? t('ফলাফল দেখুন') : t('পরের প্রশ্ন')}
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <Link 
            href="/learn/reading" 
            className="flex w-full h-12 items-center justify-center gap-1.5 rounded-[14px] bg-[#2b59c3] text-white font-bold text-[14px] transition-transform active:scale-[0.98] shadow-sm"
          >
            {t('শেষ করুন')}
          </Link>
        )
      }
    >
      <Head title={passage.titleEn} />
      {phase === 'read' && (
        <div className="pt-2">
          {/* Passage Title */}
          <h1 className="text-[22px] font-extrabold text-learn-ink leading-tight mb-4">{passage.titleEn}</h1>
          
          <p className="text-[17px] leading-[1.7] text-learn-ink">
            {passage.textEn.split(/\s+/).map((token, i) => {
              const isGlossary = Boolean(passage.glossary[normalizeKey(token)]);
              const isActive = activeWord?.token && normalizeKey(activeWord.token) === normalizeKey(token);
              return isGlossary ? (
                <button
                  key={`${token}-${i}`}
                  type="button"
                  onClick={() => openWord(token)}
                  className={cn(
                    'inline border-b border-dotted border-learn-primary text-learn-ink font-semibold bg-transparent align-baseline [font-family:inherit] transition-colors hover:text-learn-primary',
                    isActive && 'text-learn-primary font-bold border-b-2 border-solid'
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
          {/* Header check with WPM */}
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-learn-ink">{t('বোধগম্যতা যাচাই')}</h2>
            <WpmChip wpm={110} />
          </div>

          {/* Banner */}
          <div className="relative mt-4 h-36 w-full overflow-hidden rounded-[20px] border border-black/5 shadow-sm">
            <img
              src="/images/post_office_banner.png"
              alt={passage.titleEn}
              className="h-full w-full object-cover"
            />
            {/* Dark overlay at bottom left */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 text-[13px] font-bold text-white">
              {passage.titleEn}
            </span>
          </div>

          {/* Question Counter */}
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-learn-muted mt-5 block">
            {t('QUESTION {current} OF {total}', {
              current: qIndex + 1,
              total: passage.questions.length,
            })}
          </span>

          {/* Question Title */}
          <p className="mt-1.5 text-[17px] font-bold text-learn-ink leading-snug">{question.q}</p>

          {/* Options List */}
          <div className="mt-5 space-y-3.5">
            {question.options.map((opt, i) => {
              const isSel = selected === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "flex h-14 w-full items-center gap-3.5 rounded-[16px] px-4 text-left transition-all duration-150 active:scale-[0.99] border shadow-sm",
                    isSel
                      ? "border-2 border-learn-primary bg-[#F0F5FF]"
                      : "border-[#c3c6d5]/60 bg-white hover:bg-learn-bg"
                  )}
                >
                  {/* Radio Icon */}
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                      isSel ? "border-learn-primary" : "border-[#c3c6d5]/80"
                    )}
                  >
                    {isSel && <span className="size-3 rounded-full bg-learn-primary" />}
                  </span>
                  {/* Option Label */}
                  <span className="text-[15px] font-semibold text-learn-ink">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* AI Tip Box */}
          <div className="mt-5 rounded-[16px] bg-[#EEEDFC] p-4 flex items-start gap-3 border border-[#dedbfa]">
            <Sparkles className="size-5 text-[#6366F1] shrink-0 mt-0.5" strokeWidth={2.2} />
            <p className="text-[12px] text-[#4f5195] font-medium leading-relaxed">
              <span className="font-bold text-[#6366F1] mr-1">{t('AI Tip')}:</span>
              {t(question.tipEn || 'Look for keywords in the story to find the answer.')}
            </p>
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
        {activeWord && (() => {
          const key = normalizeKey(activeWord.token);
          const extra = WORD_DETAILS[key] || { pos: 'Noun', definition: '' };
          return (
            <div className="pb-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[24px] font-bold text-learn-ink leading-none">{activeWord.token}</span>
                  <SpeakerButton text={activeWord.token} size="sm" tone="blue" />
                </div>
                {extra.pos && (
                  <span className="inline-flex h-6 items-center rounded-full bg-learn-primary-tint px-2.5 text-[11px] font-bold text-learn-primary">
                    {extra.pos}
                  </span>
                )}
              </div>

              {/* Pronunciation */}
              <p className="mt-1 text-[13px] text-learn-muted font-mono">{activeWord.ipa}</p>

              {/* Bengali Meaning */}
              <p className="mt-3.5 text-[18px] font-bold text-learn-primary">{activeWord.bn}</p>

              {/* Definition */}
              {extra.definition && (
                <p className="mt-2.5 text-[14px] leading-relaxed text-learn-ink font-medium">
                  {extra.definition}
                </p>
              )}

              {/* Example Card */}
              <div className="mt-4 rounded-[14px] bg-white p-4 border border-[#c3c6d5]/50 shadow-sm space-y-1">
                <p className="text-[14px] font-bold text-learn-ink leading-relaxed italic">
                  “{activeWord.exampleEn}”
                </p>
                <p className="text-[12px] text-learn-muted font-medium">
                  {activeWord.exampleBn}
                </p>
              </div>

              {/* Action Button */}
              <button 
                type="button"
                onClick={() => {
                  addWordToVocabulary();
                  setActiveWord(null);
                }}
                className="flex w-full h-12 items-center justify-center gap-2 rounded-[14px] bg-learn-primary text-white font-bold text-[14px] transition-transform active:scale-[0.98] mt-5 shadow-sm"
              >
                <PlusCircle className="size-5" />
                {t('শব্দভাণ্ডারে যোগ করুন')}
              </button>
            </div>
          );
        })()}
      </BottomSheet>
    </SessionShell>
  );
}

function WpmChip({ wpm }) {
  return (
    <span className="inline-flex h-9 items-center rounded-full bg-[#EEF2FC] px-3.5 text-[13px] font-bold text-learn-primary">
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
    { q: 'Where did Rahim go yesterday morning?', options: ['To the market', 'To the post office', 'To the bank', 'To the airport'], answer: 1, tipEn: 'Look for keywords like "post" or "mail" in the story to find the answer.' },
    { q: 'What did Rahim want to send?', options: ['A parcel', 'A stamp', 'An envelope', 'A book'], answer: 2, tipEn: 'Read the second sentence of the story where Rahim\'s goal is described.' },
    { q: 'Who did Rahim hand the letter to?', options: ['His cousin', 'The clerk', 'A friend', 'The manager'], answer: 1, tipEn: 'Look for who was serving Rahim when his turn came.' },
    { q: 'What did the clerk do with the letter?', options: ['He opened it', 'He weighed it', 'He returned it', 'He read it'], answer: 1, tipEn: 'Find what action the clerk performed after receiving the letter.' },
    { q: 'How did Rahim feel when he left?', options: ['Sad', 'Angry', 'Happy', 'Tired'], answer: 2, tipEn: 'Look at the word "happily" to identify his feeling.' },
  ],
};
