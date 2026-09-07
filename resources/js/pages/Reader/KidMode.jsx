import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Blocks, BookOpen, Lightbulb, ScrollText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toBnDigits } from '../../lib/format';
import ReaderModeToggle from '../../components/reader/ReaderModeToggle';

/**
 * Reader / KidMode — alternate reading experience built for children.
 *
 * Uses `content_kid_friendly`, a large illustration prominent at the top of
 * the chapter, bigger text by default, and simple large Next/Previous
 * buttons. Palm Green (kid) tints the accents throughout this mode so it
 * reads as visually distinct from the standard reader. The Standard ↔ Kid
 * switch (same chapter, same place) sits at the top.
 */
const KID_FONT_SIZES = [20, 22, 24, 27];
const KID_FONT_SIZE_KEY = 'reader.kid.fontSize';

export default function ReaderKidMode({ chapter, prophet, navigation }) {
  const [fsIndex, setFsIndex] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(KID_FONT_SIZE_KEY));
      if (Number.isInteger(saved) && saved >= 0 && saved < KID_FONT_SIZES.length) return saved;
    } catch {}
    return 0; // larger text by default for children
  });

  useEffect(() => {
    try {
      localStorage.setItem(KID_FONT_SIZE_KEY, String(fsIndex));
    } catch {}
  }, [fsIndex]);

  const fontSize = KID_FONT_SIZES[fsIndex];
  const { prev, next } = navigation || {};
  const showListButton = !prev && !next;

  return (
    <>
      <Head title={`${chapter.title} — কিড মোড`} />

      {/* Top row: back to the prophet's chapter list + Standard/Kid switch */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {prophet ? (
          <Link
            href={`/library/${prophet.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-kid/30 bg-kid/10 px-4 py-2 text-[14px] font-black text-kid transition-colors hover:bg-kid/20"
          >
            <ArrowLeft className="size-5" strokeWidth={2.4} />
            {prophet.name} — অধ্যায়
          </Link>
        ) : (
          <span />
        )}
        <ReaderModeToggle chapterId={chapter.id} mode="kid" />
      </div>

      <article className="mx-auto max-w-[62ch]">
        {/* Large illustration — prominent at the top of the chapter */}
        <div className="overflow-hidden rounded-3xl border-4 border-kid/25 shadow-lg shadow-kid/10">
          {chapter.illustration_url ? (
            <img
              src={chapter.illustration_url}
              alt={`${chapter.title} — চিত্র`}
              className="aspect-[16/9] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-kid/25 via-bg-light to-secondary/15">
              <span className="text-7xl drop-shadow-sm">🕌</span>
            </div>
          )}
        </div>

        {/* Chapter header */}
        <header className="pt-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-kid/15 px-3.5 py-1 text-[13px] font-black text-kid">
            <Blocks className="size-4" strokeWidth={2.4} />
            অধ্যায় {toBnDigits(chapter.chapter_number)}
          </span>
          <h1 className="mt-3 text-[30px] leading-snug font-black tracking-tight text-ink sm:text-[38px]">
            {chapter.title}
          </h1>
          {prophet && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[15px] font-bold text-secondary">
              <BookOpen className="size-4.5" />
              {prophet.name}
              {prophet.name_arabic && (
                <span dir="rtl" className="font-semibold text-muted">{prophet.name_arabic}</span>
              )}
            </p>
          )}
        </header>

        {/* Bigger text control (kid scale, larger by default) */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="পাঠের আকার ছোট করুন"
            disabled={fsIndex === 0}
            onClick={() => setFsIndex((i) => Math.max(0, i - 1))}
            className="flex size-11 items-center justify-center rounded-full border-2 border-kid/30 bg-white text-[18px] font-black text-kid transition-colors hover:bg-kid/10 disabled:opacity-35"
          >
            −
          </button>
          <span className="flex items-center gap-1.5 px-3" aria-hidden="true">
            {KID_FONT_SIZES.map((_, i) => (
              <span
                key={i}
                className={cn('size-2 rounded-full transition-colors', i <= fsIndex ? 'bg-kid' : 'bg-kid/25')}
              />
            ))}
          </span>
          <button
            type="button"
            aria-label="পাঠের আকার বড় করুন"
            disabled={fsIndex === KID_FONT_SIZES.length - 1}
            onClick={() => setFsIndex((i) => Math.min(KID_FONT_SIZES.length - 1, i + 1))}
            className="flex size-11 items-center justify-center rounded-full border-2 border-kid/30 bg-white text-[21px] font-black text-kid transition-colors hover:bg-kid/10 disabled:opacity-35"
          >
            +
          </button>
        </div>

        {/* Kid-friendly body */}
        <div
          className="mt-8 whitespace-pre-line text-ink [text-wrap:pretty]"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}
        >
          {chapter.content}
        </div>

        {/* Moral lesson — Palm Green highlighted section */}
        <aside className="mt-10 overflow-hidden rounded-3xl border-2 border-kid/25 bg-kid/10 p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-kid text-white shadow-md shadow-kid/30">
              <Lightbulb className="size-6" strokeWidth={2.4} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[18px] font-black tracking-tight text-kid">এই গল্প থেকে শিক্ষা</h2>
              <p className="mt-1.5 text-[16px] leading-relaxed text-ink/90">{chapter.moral_lesson}</p>
            </div>
          </div>
        </aside>

        {/* Source citation — clearly at the end of the chapter */}
        <footer className="mt-5 flex items-start gap-3 rounded-2xl border border-kid/15 bg-white/70 p-4">
          <ScrollText className="mt-0.5 size-4.5 shrink-0 text-secondary" />
          <div className="min-w-0 text-[13px] leading-relaxed">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">সূত্র</span>
            <p className="mt-1 italic text-ink/75">{chapter.source_reference}</p>
          </div>
        </footer>

        {/* Simple large navigation */}
        <nav className="mt-10 space-y-3 border-t-2 border-kid/15 pt-6">
          {prev && (
            <Link
              href={`/read/${prev.id}/kid`}
              className="group flex items-center gap-4 rounded-3xl border-2 border-kid/25 bg-white/80 px-5 py-4 transition-all hover:bg-kid/10"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-kid/15 text-kid transition-transform group-hover:-translate-x-1">
                <ArrowLeft className="size-6" strokeWidth={2.6} />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-[15px] font-black text-kid">আগের অধ্যায়</span>
                <span className="block truncate text-[14px] font-semibold text-ink/80">{prev.title}</span>
              </span>
            </Link>
          )}

          {next ? (
            <Link
              href={`/read/${next.id}/kid`}
              className="group flex items-center justify-end gap-4 rounded-3xl bg-kid px-5 py-4 text-white shadow-lg shadow-kid/30 transition-all hover:bg-kid/90 sm:flex-row-reverse sm:text-right"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 transition-transform group-hover:translate-x-1">
                <ArrowRight className="size-6" strokeWidth={2.6} />
              </span>
              <span className="min-w-0 text-right sm:text-left">
                <span className="block text-[16px] font-black">পরের অধ্যায়</span>
                <span className="block truncate text-[14px] font-semibold text-white/85">{next.title}</span>
              </span>
            </Link>
          ) : (
            <div className="flex items-center justify-center rounded-3xl border-2 border-dashed border-kid/25 bg-kid/5 px-5 py-4 text-center">
              <span className="text-[15px] font-black text-kid/80">🎉 গল্প শেষ! পরের গল্পগুলো শীঘ্রই আসছে</span>
            </div>
          )}

          {showListButton && prophet && (
            <Link
              href={`/library/${prophet.id}`}
              className="flex items-center justify-center gap-2 rounded-3xl bg-kid px-5 py-4 text-[17px] font-black text-white shadow-lg shadow-kid/30 transition-colors hover:bg-kid/90"
            >
              <BookOpen className="size-6" strokeWidth={2.6} />
              {prophet.name} এর সব অধ্যায় দেখুন
            </Link>
          )}
        </nav>
      </article>
    </>
  );
}

// Immersive: hide the bottom nav while reading.
ReaderKidMode.hideNav = true;