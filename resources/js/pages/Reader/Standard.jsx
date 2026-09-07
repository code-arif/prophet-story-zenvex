import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb, ScrollText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toBnDigits } from '../../lib/format';

/**
 * Reader / Standard — primary adult-oriented reading experience.
 *
 * Book-style typography for `content_standard`: comfortable measure and
 * generous line height, a reader-scoped font-size control (persisted for
 * comfortable reading across age groups), the moral lesson in a distinct
 * highlighted section, the source citation clearly at the end, and
 * prev/next chapter navigation.
 *
 * Immersive: bottom navigation is hidden (static `hideNav`), so the chrome
 * narrows to the top bar while reading.
 */
const FONT_SIZES = [16, 17.5, 19, 21.5];
const FONT_SIZE_KEY = 'reader.standard.fontSize';

export default function ReaderStandard({ chapter, prophet, navigation }) {
  const [fsIndex, setFsIndex] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(FONT_SIZE_KEY));
      if (Number.isInteger(saved) && saved >= 0 && saved < FONT_SIZES.length) return saved;
    } catch {}
    return 1;
  });

  useEffect(() => {
    try {
      localStorage.setItem(FONT_SIZE_KEY, String(fsIndex));
    } catch {}
  }, [fsIndex]);

  const fontSize = FONT_SIZES[fsIndex];
  const { prev, next } = navigation || {};

  return (
    <>
      <Head title={`${chapter.title} — Prophet Stories`} />

      {/* Back to the prophet's chapter list */}
      {prophet && (
        <Link
          href={`/library/${prophet.id}`}
          className="mb-5 inline-flex items-center gap-1.5 rounded-xl border border-primary/15 bg-white/70 px-3 py-1.5 text-[13px] font-bold text-primary transition-colors hover:bg-primary/10"
        >
          <ArrowLeft className="size-4" />
          {prophet.name}: অধ্যায় তালিকা
        </Link>
      )}

      <article className="mx-auto max-w-[68ch]">
        {/* Chapter header */}
        <header className="border-b border-primary/15 pb-6 text-center">
          {prophet && (
            <div className="mb-2 flex items-center justify-center gap-2 text-[13px] font-bold">
              <BookOpen className="size-4 text-secondary" />
              <span className="text-secondary">{prophet.name}</span>
              {prophet.name_arabic && (
                <span dir="rtl" className="font-semibold text-muted">{prophet.name_arabic}</span>
              )}
            </div>
          )}
          <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
            অধ্যায় {toBnDigits(chapter.chapter_number)}
          </p>
          <h1 className="text-[26px] leading-snug font-black tracking-tight text-ink sm:text-[34px]">
            {chapter.title}
          </h1>
        </header>

        {/* Font-size control */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="পাঠের আকার ছোট করুন"
            disabled={fsIndex === 0}
            onClick={() => setFsIndex((i) => Math.max(0, i - 1))}
            className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-white/70 text-[15px] font-black text-primary transition-colors hover:bg-primary/10 disabled:opacity-35"
          >
            −
          </button>

          <span className="flex items-center gap-1 px-2" aria-hidden="true">
            {FONT_SIZES.map((_, i) => (
              <span
                key={i}
                className={cn('size-1.5 rounded-full transition-colors', i <= fsIndex ? 'bg-primary' : 'bg-primary/25')}
              />
            ))}
          </span>

          <button
            type="button"
            aria-label="পাঠের আকার বড় করুন"
            disabled={fsIndex === FONT_SIZES.length - 1}
            onClick={() => setFsIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
            className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-white/70 text-[17px] font-black text-primary transition-colors hover:bg-primary/10 disabled:opacity-35"
          >
            +
          </button>
        </div>

        {/* Body */}
        <div
          className="mt-8 whitespace-pre-line text-ink [text-wrap:pretty]"
          style={{ fontSize: `${fontSize}px`, lineHeight: 2.0 }}
        >
          {chapter.content_standard}
        </div>

        {/* Moral lesson — distinct highlighted section */}
        <aside className="mt-10 overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-bg-light to-secondary/10 p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/25">
              <Lightbulb className="size-5" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] font-black tracking-tight text-ink">এই গল্প থেকে শিক্ষা</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/90">{chapter.moral_lesson}</p>
            </div>
          </div>
        </aside>

        {/* Source citation — clearly at the end of the chapter */}
        <footer className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/10 bg-white/60 p-4">
          <ScrollText className="mt-0.5 size-4.5 shrink-0 text-secondary" />
          <div className="min-w-0 text-[13px] leading-relaxed">
            <span className="block font-bold uppercase tracking-wider text-muted text-[11px]">সূত্র</span>
            <p className="mt-1 text-ink/80 italic">{chapter.source_reference}</p>
          </div>
        </footer>

        {/* Prev / Next chapter navigation */}
        <nav className="mt-10 grid grid-cols-1 gap-3 border-t border-primary/15 pt-6 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/read/${prev.id}`}
              className="group flex items-center gap-3 rounded-2xl border border-primary/15 bg-white/70 px-4 py-3.5 transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:-translate-x-0.5">
                <ArrowLeft className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                  আগের অধ্যায়
                </span>
                <span className="block truncate text-[14px] font-bold text-ink">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/20 px-4 py-3.5 opacity-60">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/40 text-muted">
                <ArrowLeft className="size-5" />
              </span>
              <span className="text-[13px] font-semibold text-muted">এটিই প্রথম অধ্যায়</span>
            </div>
          )}

          {next ? (
            <Link
              href={`/read/${next.id}`}
              className="group flex items-center justify-end gap-3 rounded-2xl bg-primary px-4 py-3.5 text-white shadow-md shadow-primary/25 transition-all hover:bg-primary/90 sm:flex-row-reverse sm:text-right"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  পরের অধ্যায়
                </span>
                <span className="block truncate text-[14px] font-bold">{next.title}</span>
              </span>
            </Link>
          ) : (
            <div className="flex items-center justify-end gap-3 rounded-2xl border border-dashed border-primary/20 px-4 py-3.5 text-right opacity-60">
              <span className="text-[13px] font-semibold text-muted">এটিই শেষ অধ্যায়</span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/40 text-muted">
                <ArrowRight className="size-5" />
              </span>
            </div>
          )}
        </nav>
      </article>
    </>
  );
}

// Immersive: hide the bottom nav while reading (chrome = top bar only).
ReaderStandard.hideNav = true;