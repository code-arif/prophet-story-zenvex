import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Check, CheckCircle2, ChevronRight, Circle, DownloadCloud, Loader2, Trash2 } from 'lucide-react';
import {
  downloadProphetOffline,
  isProphetOffline,
  offlineSupported,
  packUrlsForProphet,
  removeProphetOffline,
} from '../../lib/offline';
import { toBnDigits } from '../../lib/format';
import { getReaderMode } from '../../components/reader/ReaderModeToggle';

/**
 * Library show — chapter list for one Prophet (নবীদের গল্প).
 * Each row shows the chapter number/title and a read/unread marker.
 * Read markers reflect the reader's `reading_progress` once that feature
 * exists; until then every row renders as unread.
 */
export default function LibraryShow({ prophet, chapters, hasProgress }) {
  const readCount = (chapters || []).filter((c) => c.is_read).length;
  const started = hasProgress && readCount > 0;

  // Download-for-offline state: idle | busy | done | error
  const [offlineState, setOfflineState] = useState('idle');
  const [offlineSaved, setOfflineSaved] = useState(0);
  const offlineTotal = packUrlsForProphet(chapters || []).length;

  useEffect(() => {
    if (!offlineSupported()) {
      setOfflineState('unsupported');
      return;
    }
    setOfflineState(isProphetOffline(prophet.id) ? 'done' : 'idle');
  }, [prophet.id]);

  async function handleOfflineDownload() {
    if (offlineState === 'busy' || offlineTotal === 0) return;
    setOfflineState('busy');
    setOfflineSaved(0);
    try {
      const saved = await downloadProphetOffline({
        prophetId: prophet.id,
        prophetName: prophet.name,
        chapters: chapters || [],
        onProgress: (n) => setOfflineSaved(n),
      });
      setOfflineSaved(saved);
      setOfflineState('done');
    } catch {
      setOfflineState('error');
    }
  }

  async function handleOfflineRemove() {
    await removeProphetOffline({ prophetId: prophet.id, chapters: chapters || [] });
    setOfflineSaved(0);
    setOfflineState('idle');
  }

  // Open chapters in the reader mode the user last chose (Kid vs Standard).
  const readerPref = getReaderMode();
  const rowHref = (id) => (readerPref === 'kid' ? `/read/${id}/kid` : `/read/${id}`);

  return (
    <>
      <Head title={`${prophet.name} — Prophet Stories`} />

      <Link
        href="/library"
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl border border-primary/15 bg-white/70 px-3 py-1.5 text-[13px] font-bold text-primary transition-colors hover:bg-primary/10"
      >
        <ArrowLeft className="size-4" />
        সব গল্প
      </Link>

      {/* Prophet hero header */}
      <div className="overflow-hidden rounded-2xl border border-primary/15 bg-white/80 shadow-sm">
        <div className="relative h-36 w-full sm:h-44 bg-gradient-to-br from-bg-dark via-bg-dark to-primary/70">
          {prophet.cover_image_url ? (
            <img
              src={prophet.cover_image_url}
              alt={prophet.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">🕌</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-bg-dark/20 to-transparent" />
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-3">
              <h1 className="text-[24px] sm:text-[28px] font-black tracking-tight text-ink">
                {prophet.name}
              </h1>
              {prophet.name_arabic && (
                <span dir="rtl" className="text-[20px] font-semibold text-secondary">
                  {prophet.name_arabic}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[12px] font-bold text-primary">
              <BookOpen className="size-3.5" />
              {toBnDigits(prophet.chapter_count)}টি অধ্যায়
            </span>
          </div>

          <p className="text-[14px] leading-relaxed text-muted">{prophet.short_intro}</p>

          {started && (
            <div className="pt-1">
              <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
                <span className="text-primary">
                  {toBnDigits(readCount)}/{toBnDigits(prophet.chapter_count)} পড়া হয়েছে
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min((readCount / Math.max(prophet.chapter_count, 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download for Offline (per Prophet) */}
      {offlineState !== 'unsupported' && (
        <div className="mb-2 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-white/60 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DownloadCloud className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-ink">অফলাইনের জন্য নামান</p>
              <p className="text-[12px] text-muted">
                গল্প ও অডিও সংরক্ষণ করুন — নামানোর পর ইন্টারনেট ছাড়াই পড়া ও শোনা যাবে।
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {offlineState === 'done' && (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-success/10 px-3 py-1.5 text-[12px] font-bold text-success">
                  <Check className="size-3.5" />
                  সংরক্ষিত হয়েছে
                </span>
                <button
                  type="button"
                  onClick={handleOfflineRemove}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-danger/25 px-3 py-1.5 text-[12px] font-bold text-danger transition-colors hover:bg-danger/10"
                >
                  <Trash2 className="size-3.5" />
                  সরান
                </button>
              </>
            )}

            {offlineState === 'busy' && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-[12px] font-bold text-primary">
                <Loader2 className="size-3.5 animate-spin" />
                নামানো হচ্ছে… {toBnDigits(offlineSaved)}/{toBnDigits(offlineTotal)}
              </span>
            )}

            {offlineState === 'error' && (
              <span className="text-[12px] font-bold text-danger">
                নামানো যায়নি — আবার চেষ্টা করুন
              </span>
            )}

            {offlineState === 'idle' && (
              <button
                type="button"
                onClick={handleOfflineDownload}
                disabled={offlineTotal === 0}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-[12px] font-bold text-white shadow-sm shadow-primary/25 transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <DownloadCloud className="size-3.5" />
                নামান
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chapter list */}
      <h2 className="mb-3 mt-6 text-[16px] font-bold text-ink">অধ্যায়সমূহ</h2>

      {(chapters?.length || 0) === 0 ? (
        <div className="rounded-2xl border border-primary/15 bg-white/70 p-8 text-center text-[13px] text-muted">
          এই নবীর জন্য এখনো কোনো অধ্যায় যোগ করা হয়নি।
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary/15 bg-white/80">
          <div className="divide-y divide-primary/10">
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={rowHref(ch.id)}
                className="group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-primary/5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[13px] font-black text-primary">
                    {toBnDigits(ch.chapter_number)}
                  </span>
                  <span className={`truncate text-[15px] font-semibold ${ch.is_read ? 'text-muted line-through decoration-primary/30' : 'text-ink'}`}>
                    {ch.title}
                  </span>
                </div>

                {/* Read / unread indicator + open affordance */}
                <div className="flex shrink-0 items-center gap-2">
                  {ch.is_read ? (
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-success">
                      <CheckCircle2 className="size-5" strokeWidth={2.2} />
                      <span className="hidden sm:inline">পড়া হয়েছে</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
                      <Circle className="size-5 text-outline-inactive" />
                      <span className="hidden sm:inline">পড়া হয়নি</span>
                    </span>
                  )}
                  <ChevronRight className="size-4 text-primary/40 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}