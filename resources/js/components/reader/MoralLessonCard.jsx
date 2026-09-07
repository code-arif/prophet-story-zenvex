import React from 'react';
import { Lightbulb, MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * MoralLessonCard - Reusable "What We Learn" takeaway section.
 *
 * Visually distinct takeaway card placed at the end of both reader modes,
 * clearly separated from the narrative text so parents and readers can easily
 * identify, discuss, and internalize the moral lessons.
 *
 * Supports two variants:
 *  - 'standard': Book-style parchment with Sandstone/Amber accents
 *  - 'kid': Playful Palm Green card designed for parent-child conversation
 */
export default function MoralLessonCard({
  lesson,
  variant = 'standard',
  className,
}) {
  if (!lesson || typeof lesson !== 'string' || !lesson.trim()) {
    return null;
  }

  const isKid = variant === 'kid';

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
      <div className="flex items-start gap-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/25">
          <Lightbulb className="size-5.5" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
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

          {/* Takeaway Content */}
          <div className="mt-3 rounded-xl border border-accent/20 bg-white/60 p-4">
            <p className="text-[15px] sm:text-[15.5px] leading-relaxed text-ink/95 font-medium">
              {lesson}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
