import { MessageCircle, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ReflectionQuestions - Post-chapter discussion prompts.
 *
 * Renders 1-3 reflection questions after the MoralLessonCard. These are
 * conversation starters, not graded quiz questions — no scoring or
 * right/wrong UI. Designed to prompt parent-child discussion, especially
 * in Kid Mode.
 *
 * @param {{ id: number, question: string, answer_hint: string|null }[]} questions
 * @param {'standard'|'kid'} variant
 */
export default function ReflectionQuestions({
  questions,
  variant = 'standard',
  className,
}) {
  if (!questions || questions.length === 0) {
    return null;
  }

  const isKid = variant === 'kid';

  if (isKid) {
    return (
      <section
        aria-label="আলোচনার প্রশ্ন"
        className={cn(
          'mt-8 overflow-hidden rounded-3xl border-2 border-kid/25 bg-gradient-to-br from-kid/10 via-white/80 to-secondary/5 p-5 sm:p-6',
          className
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-kid/15 text-kid shadow-sm">
            <MessageCircle className="size-5.5" strokeWidth={2.2} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-kid/15 px-2.5 py-0.5 text-[11px] font-black text-kid uppercase tracking-wider">
              <Sparkles className="size-3" />
              চিন্তা করুন
            </span>
            <h3 className="text-[16px] sm:text-[17px] font-black tracking-tight text-kid">
              আলোচনার প্রশ্ন
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="rounded-2xl border border-kid/20 bg-white/70 p-4 transition-all hover:bg-white/90"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-kid/15 text-[13px] font-black text-kid">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] sm:text-[16px] font-semibold leading-relaxed text-ink/90">
                    {q.question}
                  </p>
                  {q.answer_hint && (
                    <p className="mt-2 text-[13px] leading-relaxed text-muted italic border-t border-kid/10 pt-2">
                      💡 {q.answer_hint}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[12px] font-semibold text-kid/70">
          বাবা-মাকে জিজ্ঞাস করুন অথবা পরিবারের সাথে আলোচনা করুন
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="আলোচনার প্রশ্ন"
      className={cn(
        'mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white/85 to-secondary/5 p-5 sm:p-6 shadow-xs',
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
          <HelpCircle className="size-5" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
            <MessageCircle className="size-3" />
            আলোচনার প্রশ্ন
          </span>
          <h3 className="mt-1.5 text-[15px] sm:text-[16px] font-black tracking-tight text-ink">
            গল্পটি পড়ার পর চিন্তা করুন
          </h3>

          <div className="mt-3 space-y-2.5">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-xl border border-primary/15 bg-white/60 p-3.5 transition-all hover:bg-white/90"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[12px] font-black text-primary">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] sm:text-[15px] leading-relaxed font-semibold text-ink/90">
                      {q.question}
                    </p>
                    {q.answer_hint && (
                      <p className="mt-1.5 text-[12px] leading-relaxed text-muted italic border-t border-primary/10 pt-1.5">
                        {q.answer_hint}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
