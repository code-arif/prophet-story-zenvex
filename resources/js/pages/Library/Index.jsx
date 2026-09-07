import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Play } from 'lucide-react';
import { toBnDigits } from '../../lib/format';
import { getReaderMode } from '../../components/reader/ReaderModeToggle';

/**
 * Library index — Prophet Stories (নবীদের গল্প) library browse view.
 * Grid of Prophet cards (cover, name, short intro, chapter count) with a
 * small progress bar once the reader has started the Prophet's chapters.
 */
export default function LibraryIndex({ prophets, continueReading }) {
  // Resume in the reader mode the user last chose (Kid vs Standard).
  const readerPref = getReaderMode();
  const readHref = (chapterId) =>
    readerPref === 'kid' ? `/read/${chapterId}/kid` : `/read/${chapterId}`;

  return (
    <>
      <Head title="গল্প — Prophet Stories" />

      {/* Page header */}
      <div className="mb-6 space-y-1">
        <h1 className="text-[26px] sm:text-[30px] font-black tracking-tight text-ink">
          নবীদের গল্প
        </h1>
        <p className="text-[14px] text-muted font-medium">
          কুরআন ও সহিহ সূত্রভিত্তিক নবী-কাহিনী — পড়ুন বড়দের জন্য, বা বাচ্চাদের কিড মোডে।
        </p>
      </div>

      {/* Continue Reading — most recent read chapter across all Prophets */}
      {continueReading && (
        <Link
          href={readHref(continueReading.chapter_id)}
          className="group mb-6 flex items-center gap-4 overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-r from-primary/10 via-white/80 to-accent/15 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/15 sm:p-5"
        >
          {continueReading.cover_image_url ? (
            <img
              src={continueReading.cover_image_url}
              alt={continueReading.prophet_name}
              className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-primary/20 sm:size-20"
            />
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-3xl sm:size-20">
              🕌
            </div>
          )}

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-black text-white">
              <Play className="size-3 fill-current" />
              চালিয়ে পড়ুন
            </span>
            <p className="mt-1.5 truncate text-[12px] font-semibold text-secondary">
              {continueReading.prophet_name}
            </p>
            <p className="truncate text-[15px] font-bold text-ink">
              অধ্যায় {toBnDigits(continueReading.chapter_number)}: {continueReading.chapter_title}
            </p>
          </div>

          <span className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-white shadow-md shadow-primary/25 transition-transform group-hover:translate-x-0.5 sm:inline-flex">
            আবার পড়ুন
            <ArrowRight className="size-4" />
          </span>
        </Link>
      )}

      {(prophets?.length || 0) === 0 ? (
        <div className="rounded-2xl border border-primary/15 bg-white/70 p-10 text-center">
          <p className="text-[15px] font-semibold text-ink">এখনো কোনো গল্প যোগ করা হয়নি</p>
          <p className="mt-1 text-[13px] text-muted">শীঘ্রই নবী-কাহিনী এখানে প্রকাশিত হবে।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prophets.map((p) => {
            const started = (p.completed_chapters ?? 0) > 0;
            return (
              <Link
                key={p.id}
                href={`/library/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-primary/15 bg-white/80 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
                  {p.cover_image_url ? (
                    <img
                      src={p.cover_image_url}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl">🕌</div>
                  )}
                  <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-bg-dark/85 px-2.5 py-1 text-[11px] font-bold text-bg-light backdrop-blur-sm">
                    <BookOpen className="size-3.5 text-accent" />
                    {toBnDigits(p.chapter_count)}টি অধ্যায়
                  </span>
                </div>

                {/* Body */}
                <div className="space-y-2 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-[17px] font-bold leading-snug text-ink group-hover:text-primary transition-colors">
                      {p.name}
                    </h2>
                    {p.name_arabic && (
                      <span dir="rtl" className="shrink-0 text-[15px] font-semibold text-secondary">
                        {p.name_arabic}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">
                    {p.short_intro}
                  </p>

                  {/* Resume indicator — which chapter to continue from */}
                  {p.resume_chapter && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-accent/15 px-2 py-1 text-[12px] font-bold text-ink">
                      <Play className="size-3 shrink-0 fill-accent text-accent" />
                      <span className="truncate">
                        চালিয়ে যান — অধ্যায় {toBnDigits(p.resume_chapter.chapter_number)}
                      </span>
                    </div>
                  )}

                  {/* Progress (only once the reader has started) */}
                  {started && p.progress_percent !== null && (
                    <div className="pt-1">
                      <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-primary">
                          {toBnDigits(p.completed_chapters)}/{toBnDigits(p.chapter_count)} পড়া
                        </span>
                        <span className="text-muted">{toBnDigits(p.progress_percent)}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.min(p.progress_percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}