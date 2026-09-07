import React, { useState } from 'react';
import { Check, Copy, Lightbulb, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * MoralLessonCard - Reusable "What We Learn" takeaway section with sharing support.
 *
 * Visually distinct takeaway card placed at the end of both reader modes,
 * clearly separated from the narrative text so parents and readers can easily
 * identify, discuss, and share the moral lessons.
 *
 * Sharing features:
 *  - Native Web Share API on supported devices (phones, tablets, modern browsers).
 *  - Respectful fallback directly to WhatsApp (wa.me) or clipboard copy.
 *  - Clean message format without promotional noise.
 */
export default function MoralLessonCard({
  lesson,
  prophetName,
  chapterTitle,
  sourceReference,
  chapterUrl,
  variant = 'standard',
  className,
}) {
  const [copied, setCopied] = useState(false);

  if (!lesson || typeof lesson !== 'string' || !lesson.trim()) {
    return null;
  }

  const isKid = variant === 'kid';

  const formatShareText = () => {
    const parts = [];

    // Title / Context line
    if (prophetName && chapterTitle) {
      parts.push(`📖 ${prophetName} — ${chapterTitle}`);
    } else if (chapterTitle) {
      parts.push(`📖 ${chapterTitle}`);
    } else if (prophetName) {
      parts.push(`📖 ${prophetName}`);
    }

    // Core takeaway
    parts.push(`\n❝ ${lesson.trim()} ❞\n`);

    // Source reference if available
    if (sourceReference && sourceReference.trim()) {
      parts.push(`সূত্র: ${sourceReference.trim()}`);
    }

    // Direct link
    const url = chapterUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (url) {
      parts.push(`\nপড়ুন: ${url}`);
    }

    return parts.join('\n');
  };

  const handleShare = async () => {
    const textToShare = formatShareText();
    const shareUrl = chapterUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const title = chapterTitle
      ? `${chapterTitle} — শিক্ষণীয় শিক্ষা`
      : 'নবীগণের কাহিনী — শিক্ষণীয় শিক্ষা';

    // 1. Try native Web Share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: textToShare,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // AbortError indicates user dismissed the share modal; don't trigger fallback.
        if (err.name === 'AbortError') {
          return;
        }
        // Fall through to WhatsApp / copy fallback if error occurred
      }
    }

    // 2. WhatsApp fallback
    if (typeof window !== 'undefined') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
      const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // 3. Fallback to clipboard copy if pop-up blocked or not preferred
      if (!opened && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(textToShare);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          // Best effort clipboard
        }
      }
    }
  };

  const ShareButton = ({ buttonClass }) => (
    <button
      type="button"
      onClick={handleShare}
      title="এই শিক্ষাটি শেয়ার করুন"
      aria-label="এই শিক্ষাটি শেয়ার করুন"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-bold transition-all cursor-pointer select-none active:scale-95',
        buttonClass
      )}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-success" strokeWidth={2.5} />
          <span>কপি হয়েছে!</span>
        </>
      ) : (
        <>
          <Share2 className="size-3.5" strokeWidth={2.2} />
          <span>শেয়ার করুন</span>
        </>
      )}
    </button>
  );

  if (isKid) {
    return (
      <aside
        aria-labelledby="moral-lesson-kid-title"
        className={cn(
          'mt-10 overflow-hidden rounded-3xl border-2 border-kid/30 bg-gradient-to-br from-kid/15 via-white/80 to-secondary/10 p-5 sm:p-6 shadow-sm shadow-kid/10 transition-all',
          className
        )}
      >
        {/* Kid Card Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-kid text-white shadow-md shadow-kid/25">
              <Sparkles className="size-6" strokeWidth={2.4} />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-kid/15 px-2.5 py-0.5 text-[11px] font-black text-kid uppercase tracking-wider">
                <MessageCircle className="size-3" />
                পিতা-মাতা ও সন্তানের আলোচনা
              </span>
              <h2
                id="moral-lesson-kid-title"
                className="text-[18px] sm:text-[20px] font-black tracking-tight text-kid"
              >
                আমরা কী শিখলাম?
              </h2>
            </div>
          </div>

          <ShareButton buttonClass="border border-kid/30 bg-white text-kid hover:bg-kid hover:text-white shadow-xs" />
        </div>

        {/* Takeaway Content */}
        <div className="mt-4 rounded-2xl border border-kid/20 bg-white/70 p-4 sm:p-5">
          <p className="text-[16px] sm:text-[17px] font-semibold leading-relaxed text-ink/90">
            {lesson}
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-labelledby="moral-lesson-title"
      className={cn(
        'mt-10 overflow-hidden rounded-2xl border border-accent/35 bg-gradient-to-br from-accent/15 via-white/85 to-secondary/10 p-5 sm:p-6 shadow-xs transition-all',
        className
      )}
    >
      {/* Standard Card Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/25">
            <Lightbulb className="size-5.5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-bold text-accent uppercase tracking-wider">
                <Sparkles className="size-3" />
                মূল শিক্ষা ও উপলব্ধি
              </span>
            </div>
            <h2
              id="moral-lesson-title"
              className="mt-1 text-[16px] sm:text-[17px] font-black tracking-tight text-ink"
            >
              এই গল্প থেকে শিক্ষা
            </h2>
          </div>
        </div>

        <ShareButton buttonClass="border border-accent/30 bg-white/80 text-accent hover:bg-accent hover:text-white shadow-xs" />
      </div>

      {/* Takeaway Content */}
      <div className="mt-4 rounded-xl border border-accent/20 bg-white/60 p-4">
        <p className="text-[15px] sm:text-[15.5px] leading-relaxed text-ink/95 font-medium">
          {lesson}
        </p>
      </div>
    </aside>
  );
}
