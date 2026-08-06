import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { postJson } from '../../../lib/api';
import { SessionShell } from '../../../components/SessionShell';
import { SpeakerButton } from '../../../components/SpeakerButton';
import { ScoreRing } from '../../../components/ScoreRing';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 14 — কার্ড পুনরাবৃত্তি / Flashcard Review (Stitch, feature 2).
 * Full-screen session: card front → reveal → three self-ratings
 * (জানি না / কঠিন / জানি). Ratings are saved per word (SRS).
 */
export default function FlashcardReview({ cards = CARDS }) {
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [rated, setRated] = React.useState(0);

  const card = cards[index];
  const progress = cards.length > 0 ? ((index + (revealed ? 0.5 : 0)) / cards.length) * 100 : 0;

  const rate = (quality) => {
    // Save the rating (0 জানি না · 1 কঠিন · 2 জানি) for SRS scheduling.
    if (card?.id) {
      postJson('/learn/vocabulary/rate', { word_id: card.id, rating: quality }).catch(() => {});
    }
    setRated((r) => r + 1);
    if (index + 1 >= cards.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  };

  const saveWord = () => {
    if (card?.id) {
      postJson('/learn/vocabulary/save-word', { word_id: card.id, saved: true }).catch(() => {});
    }
  };

  const primaryAction = done ? (
    <Link href="/learn/vocabulary" className={cn(buttonVariants({ size: 'learner' }), 'w-full')}>
      শেষ করুন
    </Link>
  ) : !revealed ? (
    <button className={buttonVariants({ variant: 'outlineBlue', size: 'learner' })} onClick={() => setRevealed(true)}>
      অর্থ দেখুন
    </button>
  ) : null;

  return (
    <SessionShell
      title={undefined}
      progress={progress}
      counter={done ? undefined : `${toBnDigits(index + 1)}/${toBnDigits(cards.length)}`}
      onClose={() => window.history.back()}
      primaryAction={primaryAction}
    >
      <Head title="কার্ড পুনরাবৃত্তি" />
      {done ? (
        <DoneState rated={rated} total={cards.length} />
      ) : (
        <div className="flex min-h-[calc(100dvh-190px)] flex-col justify-center pt-2">
          <Flashcard card={card} revealed={revealed} onSave={saveWord} />

          {revealed && (
            <div className="mt-6">
              <div className="grid grid-cols-3 gap-2">
                {RATINGS.map(({ bn, classes }, i) => (
                  <button
                    key={bn}
                    type="button"
                    onClick={() => rate(i)}
                    className={cn('flex h-14 items-center justify-center rounded-[14px] text-[14px] font-bold transition-transform active:scale-95', classes)}
                  >
                    {bn}
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-center text-[13px] text-learn-muted">পরের বার দেখা যাবে: ৩ দিন পর</p>
            </div>
          )}
        </div>
      )}
    </SessionShell>
  );
}

function Flashcard({ card, revealed, onSave }) {
  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[20px] bg-white p-6 shadow-[0px_16px_40px_rgba(20,23,43,0.14)]">
      {revealed ? (
        <div className="text-center">
          <div className="flex items-start justify-between">
            <p className="text-[14px] font-semibold text-learn-ink">{card.en}</p>
            <button type="button" aria-label="সংরক্ষণ করুন" onClick={onSave} className="text-learn-warn">
              <Star className="size-5 fill-current" strokeWidth={2} />
            </button>
          </div>
          <p className="mt-6 text-[28px] font-bold text-learn-ink">{card.bn}</p>
          <p className="mt-5 text-[15px] font-semibold text-learn-ink">{card.exampleEn}</p>
          <p className="mt-1 text-[13px] text-learn-muted">{card.exampleBn}</p>
          <div className="mt-5 flex justify-center">
            <SpeakerButton text={card.en} size="md" />
          </div>
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <p className="text-[34px] font-bold leading-tight text-learn-ink">{card.en}</p>
          <p className="mt-3 text-[14px] text-learn-muted">{card.ipa}</p>
          <div className="mt-5">
            <SpeakerButton text={card.en} size="lg" />
          </div>
          <p className="mt-8 text-[13px] text-learn-muted">অর্থ দেখতে ট্যাপ করুন</p>
        </div>
      )}
    </div>
  );
}

function DoneState({ rated, total }) {
  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <ScoreRing value={(rated / total) * 100} size={150} tone="success">
        <span className="text-[28px] font-bold text-learn-ink">{toBnDigits(rated)}/{toBnDigits(total)}</span>
      </ScoreRing>
      <h2 className="mt-5 text-[20px] font-bold">সেশন শেষ!</h2>
      <p className="mt-1 text-[13px] text-learn-muted">আগামীকাল আবার আসুন — শব্দ মনে রাখতে নিয়মিত পুনরাবৃত্তি জরুরি</p>
    </div>
  );
}

const RATINGS = [
  { bn: 'জানি না', classes: 'bg-learn-danger-tint text-learn-danger' },
  { bn: 'কঠিন', classes: 'bg-learn-warn-tint text-learn-warn' },
  { bn: 'জানি', classes: 'bg-learn-success-tint text-learn-success' },
];

// ── UI-phase demo cards (feature 2 ships data later) ──
const CARDS = [
  { en: 'reliable', ipa: '/rɪˈlaɪəbl/', bn: 'নির্ভরযোগ্য', exampleEn: 'He is a reliable friend.', exampleBn: 'তিনি একজন নির্ভরযোগ্য বন্ধু।' },
  { en: 'deadline', ipa: '/ˈdedlaɪn/', bn: 'শেষ সময়সীমা', exampleEn: 'The deadline is Friday.', exampleBn: 'সময়সীমা শুক্রবার।' },
  { en: 'sincere', ipa: '/sɪnˈsɪə(r)/', bn: 'আন্তরিক', exampleEn: 'She gave a sincere apology.', exampleBn: 'তিনি আন্তরিকভাবে ক্ষমা চেয়েছেন।' },
  { en: 'achieve', ipa: '/əˈtʃiːv/', bn: 'অর্জন করা', exampleEn: 'Hard work helps you achieve goals.', exampleBn: 'কঠোর পরিশ্রম লক্ষ্য অর্জনে সাহায্য করে।' },
  { en: 'convenient', ipa: '/kənˈviːniənt/', bn: 'সুবিধাজনক', exampleEn: 'This time is convenient for me.', exampleBn: 'এই সময়টি আমার জন্য সুবিধাজনক।' },
];
