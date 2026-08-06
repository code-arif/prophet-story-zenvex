import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bookmark, Check, ArrowRight, Lightbulb, Compass, Info, AlertTriangle, SquarePen } from 'lucide-react';
import LearnerShell from '../../../layouts/LearnerShell';
import { buttonVariants } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 12 — নিয়মের বিস্তারিত / Grammar Rule Detail (Stitch, feature 3).
 * Five fixed blocks: explanation, structure, correct examples, common
 * mistakes, practice jump. Green only for correct, red only for mistakes.
 */
export default function GrammarRule({ rule = RULE }) {
  const { t } = useI18n();

  const localStorageKey = `bookmark_grammar_${rule.id}`;
  const [bookmarked, setBookmarked] = React.useState(() => {
    try {
      return localStorage.getItem(localStorageKey) === 'true';
    } catch {
      return false;
    }
  });

  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    try {
      localStorage.setItem(localStorageKey, String(next));
    } catch {
      // Ignored
    }
  };

  return (
    <LearnerShell
      title={rule.nameEn}
      showBack
      right={
        <button 
          type="button" 
          aria-label={bookmarked ? t('সংরক্ষণ বাতিল করুন') : t('সংরক্ষণ করুন')} 
          onClick={toggleBookmark}
          className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
        >
          <Bookmark 
            className={cn("size-5 transition-all duration-200", bookmarked ? "fill-learn-primary text-learn-primary scale-110" : "text-learn-ink")} 
            strokeWidth={2} 
          />
        </button>
      }
    >
      <div className="mt-2 space-y-5 pb-6">
        <Head title={rule?.nameEn || ''} />

        {/* Cover Image */}
        <div className="relative h-44 w-full overflow-hidden rounded-[20px] border border-black/5 shadow-sm">
          <img
            src="/images/laptop_study.png"
            alt={rule.nameEn}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Card 1: Explanation (সহজ ব্যাখ্যা) */}
        <section className="rounded-[20px] bg-white p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="size-5 text-learn-primary" strokeWidth={2.2} />
            <h2 className="text-[16px] font-bold text-learn-ink">{t('সহজ ব্যাখ্যা')}</h2>
          </div>
          <div className="mt-3 space-y-2">
            {(rule?.explanationBn || []).map((p, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-learn-ink font-medium">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Card 2: Structure (বাক্য গঠন) */}
        <section className="rounded-[20px] bg-white p-5 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Compass className="size-5 text-learn-primary" strokeWidth={2.2} />
            <h2 className="text-[16px] font-bold text-learn-ink">{t('বাক্য গঠন (Structure)')}</h2>
          </div>
          
          <div className="mt-4 rounded-[12px] bg-[#F0F2F9]/70 px-4 py-3.5 text-center text-[15px] font-bold text-learn-ink leading-relaxed">
            {rule.structure}
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-[13px] text-learn-muted font-medium">
            <Info className="size-4 text-learn-primary shrink-0" strokeWidth={2} />
            <span>{rule.structureNoteBn}</span>
          </div>
        </section>

        {/* Card 3: Correct Examples (সঠিক উদাহরণ) */}
        <section>
          <h2 className="text-[16px] font-bold text-learn-ink mb-3">{t('সঠিক উদাহরণ')}</h2>
          <div className="rounded-[20px] bg-white p-5 border border-black/5 shadow-sm space-y-4">
            {(rule?.correct || []).map((ex) => (
              <div key={ex.en} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-learn-success text-learn-success">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <div>
                  <span className="block text-[15px] font-bold text-learn-ink leading-tight">{ex.en}</span>
                  <span className="block text-[13px] text-learn-muted mt-1">{ex.bn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card 4: Common Mistakes (যে ভুলগুলো বেশি হয়) */}
        <section className="rounded-[20px] bg-[#FFF5F5] border border-[#ffc9c9] p-5">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-5 text-learn-danger" strokeWidth={2.2} />
            <h2 className="text-[16px] font-bold text-learn-danger">{t('যে ভুলগুলো বেশি হয়')}</h2>
          </div>
          
          <div className="mt-4 space-y-3">
            {(rule?.mistakes || []).map((m) => (
              <div key={m.wrong} className="rounded-[12px] bg-white p-3.5 border border-[#ffc9c9]/30 shadow-sm space-y-1">
                <p className="text-[14px] leading-relaxed">
                  <span className="text-learn-danger line-through">{m.wrong}</span>{' '}
                  <ArrowRight className="inline size-3.5 text-learn-muted mx-1" strokeWidth={2.5} />{' '}
                  <span className="font-bold text-learn-success">{m.right}</span>
                </p>
                <p className="text-[12px] text-learn-muted font-medium leading-normal">{m.reasonBn}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practice Button */}
        <Link 
          href="/practice/quiz" 
          className="flex w-full h-12 items-center justify-center gap-2 rounded-[14px] border border-[#2b59c3] bg-white text-learn-primary font-bold text-[14px] transition-transform active:scale-[0.98] mt-4 shadow-sm"
        >
          <SquarePen className="size-4.5 text-learn-primary" strokeWidth={2.2} />
          {t('এই নিয়মে অনুশীলন করুন')}
        </Link>
      </div>
    </LearnerShell>
  );
}

// ── UI-phase demo rule (feature 3 ships data/grammar.json later) ──
const RULE = {
  id: 'present-simple',
  nameEn: 'Present Simple',
  category: 'Tense',
  explanationBn: [
    'যে কাজ প্রতিদিন বা নিয়মিত ঘটে, তা বোঝাতে Present Simple ব্যবহার হয়। অভ্যাস, সাধারণ সত্য এবং নির্ধারিত সময়সূচি — সবই এই টেন্সে প্রকাশ করা যায়।',
    'He / She / It কর্তার সাথে verb-এর শেষে s বা es যোগ হয়। নেতিবাচক ও প্রশ্নবাচক বাক্যে does ব্যবহার হয় এবং তখন verb-এর s উঠে যায়।',
  ],
  structure: 'Subject + verb (+ s/es) + object',
  structureNoteBn: 'He / She / It এর সাথে verb এ s যোগ হয়',
  correct: [
    { en: 'I wake up at 6 am.', bn: 'আমি সকাল ৬টায় ঘুম থেকে উঠি।' },
    { en: 'She works in a bank.', bn: 'তিনি একটি ব্যাংকে কাজ করেন।' },
    { en: 'The sun rises in the east.', bn: 'সূর্য পূর্ব দিকে ওঠে।' },
  ],
  mistakes: [
    { wrong: 'He go to office.', right: 'He goes to office.', reasonBn: 'He কর্তার সাথে verb-এ s যোগ হয়।' },
    { wrong: 'She don’t like tea.', right: 'She doesn’t like tea.', reasonBn: 'He/She/It এর সাথে negative-এ does না হয়।' },
  ],
};
