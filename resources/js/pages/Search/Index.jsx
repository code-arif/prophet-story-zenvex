import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, BookOpen, ChevronRight, Compass, FileText, Search, Sparkles, X } from 'lucide-react';
import { toBnDigits } from '../../lib/format';
import { getReaderMode } from '../../components/reader/ReaderModeToggle';

const POPULAR_THEMES = [
  'মুসা',
  'ইব্রাহিম',
  'ইউসুফ',
  'নূহ',
  'দাউদ',
  'ধৈর্য',
  'কুরবানী',
  'তওবা',
  'ঈমান',
  'মিশর',
];

export default function SearchIndex({ q = '', results = [], totalMatches = 0 }) {
  const [query, setQuery] = useState(q);
  const readerPref = getReaderMode();
  const readHref = (chapterId) =>
    readerPref === 'kid' ? `/read/${chapterId}/kid` : `/read/${chapterId}`;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = query.trim();
    router.get(
      '/search',
      trimmed ? { q: trimmed } : {},
      { preserveState: true, replace: true }
    );
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    router.get('/search', { q: tag }, { preserveState: true, replace: true });
  };

  const handleClear = () => {
    setQuery('');
    router.get('/search', {}, { preserveState: true, replace: true });
  };

  const hasSearched = Boolean(q && q.trim().length > 0);
  const resultList = Array.isArray(results) ? results : [];

  return (
    <>
      <Head title={q ? `"${q}" — অনুসন্ধান — Prophet Stories` : 'অনুসন্ধান — Prophet Stories'} />

      {/* Header */}
      <div className="mb-6 space-y-1">
        <h1 className="text-[26px] sm:text-[30px] font-black tracking-tight text-ink">
          গল্প ও ঘটনা অনুসন্ধান
        </h1>
        <p className="text-[14px] text-muted font-medium">
          নবীর নাম, কুরআনের কাহিনী, বিষয় বা শিক্ষা দিয়ে সরাসরি অধ্যায় খুঁজুন।
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative flex items-center">
          <Search className="absolute left-4 size-5 text-primary/60 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="নবীর নাম, বিষয় বা শব্দ দিয়ে খুঁজুন (যেমন: মুসা, ধৈর্য, কুরবানী)..."
            className="h-13 w-full rounded-2xl border-2 border-primary/20 bg-white/90 pl-11 pr-12 text-[15px] font-medium text-ink shadow-xs outline-none transition-all placeholder:text-muted/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 font-bn"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="মুছে ফেলুন"
              className="absolute right-3.5 flex size-7 items-center justify-center rounded-full bg-primary/10 text-muted transition-colors hover:bg-primary/20 hover:text-ink cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </form>

      {/* Popular Suggestions / Theme Pills */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-muted uppercase tracking-wider mb-2.5">
          <Sparkles className="size-3.5 text-accent" />
          <span>জনপ্রিয় বিষয়সমূহ:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_THEMES.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className={`rounded-full px-3.5 py-1 text-[13px] font-bold transition-all cursor-pointer ${
                q === tag
                  ? 'bg-primary text-white shadow-xs'
                  : 'border border-primary/15 bg-white/70 text-ink hover:border-primary/40 hover:bg-primary/5 active:scale-95'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results or Empty State */}
      {hasSearched ? (
        <div>
          {/* Result count status */}
          <div className="mb-4 flex items-center justify-between text-[13px] text-muted">
            <span>
              <strong className="text-ink">"{q}"</strong> এর জন্য{' '}
              <strong className="text-primary font-black">{toBnDigits(resultList.length)}</strong> জন নবীর মোট{' '}
              <strong className="text-primary font-black">{toBnDigits(totalMatches)}</strong>টি অধ্যায় পাওয়া গেছে
            </span>
          </div>

          {resultList.length === 0 ? (
            /* No Results Found */
            <div className="rounded-3xl border border-primary/15 bg-white/80 p-10 text-center shadow-xs">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                🔍
              </div>
              <h3 className="text-[17px] font-bold text-ink">কোনো ফলাফল পাওয়া যায়নি</h3>
              <p className="mx-auto mt-1.5 max-w-md text-[13px] text-muted leading-relaxed">
                "{q}" সম্পর্কিত কোনো নবী বা অধ্যায় খুঁজে পাওয়া যায়নি। বানানের সঠিকতা যাচাই করুন অথবা উপরের জনপ্রিয় বিষয়গুলোর একটি বেছে নিন।
              </p>
            </div>
          ) : (
            /* Results Grouped by Prophet */
            <div className="space-y-6">
              {resultList.map((group) => (
                <div
                  key={group.id}
                  className="overflow-hidden rounded-3xl border border-primary/15 bg-white/85 shadow-xs transition-all hover:border-primary/30 hover:shadow-md"
                >
                  {/* Prophet Group Header */}
                  <div className="flex items-center justify-between gap-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 via-white/50 to-transparent p-4 sm:p-5">
                    <div className="flex min-w-0 items-center gap-3.5">
                      {group.cover_image_url ? (
                        <img
                          src={group.cover_image_url}
                          alt={group.name}
                          className="size-13 shrink-0 rounded-2xl object-cover ring-1 ring-primary/20"
                        />
                      ) : (
                        <div className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                          🕌
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <h2 className="truncate text-[18px] font-black text-ink">
                            {group.name}
                          </h2>
                          {group.name_arabic && (
                            <span dir="rtl" className="shrink-0 text-[15px] font-semibold text-secondary">
                              {group.name_arabic}
                            </span>
                          )}
                        </div>
                        {group.short_intro && (
                          <p className="line-clamp-1 text-[12.5px] text-muted">
                            {group.short_intro}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/library/${group.id}`}
                      className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-xl border border-primary/20 bg-white/80 px-3 py-1.5 text-[12px] font-bold text-primary transition-colors hover:bg-primary/10"
                    >
                      <span>সব অধ্যায়</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>

                  {/* Matching Chapters Listed Underneath */}
                  <div className="divide-y divide-primary/10">
                    {(group.matching_chapters || []).map((chapter) => (
                      <Link
                        key={chapter.id}
                        href={readHref(chapter.id)}
                        className="group flex items-start justify-between gap-4 p-4 transition-colors hover:bg-primary/5 active:bg-primary/10 cursor-pointer"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-black text-primary">
                            {toBnDigits(chapter.chapter_number)}
                          </span>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-[15px] font-bold text-ink group-hover:text-primary transition-colors">
                                {chapter.title}
                              </h3>
                              {chapter.match_type === 'moral_lesson' && (
                                <span className="inline-flex shrink-0 items-center rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                                  শিক্ষা
                                </span>
                              )}
                            </div>

                            {/* Snippet preview if matched in body/moral */}
                            {chapter.snippet ? (
                              <p className="text-[12.5px] text-muted leading-relaxed line-clamp-2">
                                <span className="text-secondary font-medium">প্রাসঙ্গিক অংশ: </span>
                                {chapter.snippet}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        {/* Direct Read affordance */}
                        <div className="flex shrink-0 items-center gap-1 rounded-xl bg-primary/10 px-3 py-1.5 text-[12px] font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white">
                          <span>পড়ুন</span>
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Initial Landing View (Before Search) */
        <div className="rounded-3xl border border-primary/15 bg-white/60 p-8 text-center sm:p-12">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/20 text-3xl shadow-xs">
            <Compass className="size-8 text-primary" />
          </div>
          <h2 className="text-[18px] font-bold text-ink">কীভাবে খুঁজবেন?</h2>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] text-muted leading-relaxed">
            কোনো নির্দিষ্ট নবীর নাম (যেমন <strong>হযরত মুসা (আঃ)</strong>), কুরআনিক ঘটনা (যেমন <strong>তুফান</strong>, <strong>কুরবানী</strong>) বা গল্প থেকে শিক্ষা দিয়ে সার্চ করুন। সরাসরি সংশ্লিষ্ট অধ্যায় পাওয়া যাবে।
          </p>
        </div>
      )}
    </>
  );
}
