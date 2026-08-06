import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bookmark, Check, ArrowRight } from 'lucide-react';
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
  return (
    <LearnerShell
      title={rule.nameEn}
      showBack
      right={
        <button type="button" aria-label={t('সংরক্ষণ করুন')} className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <Bookmark className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title={rule?.nameEn || ''} />
        {/* Explanation */}
        <section className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <h2 className="text-[15px] font-bold text-learn-ink">{t('সহজ ব্যাখ্যা')}</h2>
          {(rule?.explanationBn || []).map((p, i) => (
            <p key={i} className="mt-2 text-[14px] leading-relaxed text-learn-ink">{p}</p>
          ))}
        </section>

        {/* Structure */}
        <section className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="rounded-[12px] bg-learn-structure px-4 py-3 font-mono text-[14px] text-learn-ink">
            {rule.structure}
          </div>
          <p className="mt-2 text-[13px] text-learn-muted">{rule.structureNoteBn}</p>
        </section>

        {/* Correct examples — green only */}
        <section>
          <h2 className="text-[16px] font-semibold text-learn-ink">{t('সঠিক উদাহরণ')}</h2>
          <div className="mt-2 space-y-2.5">
            {(rule?.correct || []).map((ex) => (
              <div key={ex.en} className="flex items-start gap-3 rounded-[14px] bg-white p-3.5 ring-1 ring-learn-border">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-learn-success text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-learn-ink">{ex.en}</span>
                  <span className="block text-[13px] text-learn-muted">{ex.bn}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Common mistakes — red + green */}
        <section>
          <h2 className="text-[16px] font-semibold text-learn-ink">{t('যে ভুলগুলো বেশি হয়')}</h2>
          <div className="mt-2 space-y-2.5">
            {(rule?.mistakes || []).map((m) => (
              <div key={m.wrong} className="rounded-[14px] bg-learn-danger-tint p-3.5">
                <p className="text-[13px] leading-relaxed">
                  <span className="text-learn-danger line-through">{m.wrong}</span>{' '}
                  <ArrowRight className="inline size-3.5 text-learn-muted" />{' '}
                  <span className="font-bold text-learn-success">{m.right}</span>
                </p>
                <p className="mt-1.5 text-[13px] text-learn-muted">{m.reasonBn}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practice jump */}
        <Link href="/practice/quiz" className={cn(buttonVariants({ variant: 'outlineBlue', size: 'learner' }), 'w-full')}>
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
