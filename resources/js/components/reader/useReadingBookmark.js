import { useEffect, useRef } from 'react';

/**
 * Resume-where-you-left-off persistence for the readers.
 *
 * `useReadingBookmark(chapterId)`:
 *  - upserts the bookmark as soon as a chapter opens (chapter-level resume),
 *  - saves the current scroll ratio when leaving the chapter (mid-chapter
 *    resume), and
 *  - flushes the position when the tab closes (keepalive fetch).
 *
 * Writes are fire-and-forget JSON POSTs to /reader/bookmark — failures
 * (e.g. anonymous guests) are silently ignored.
 */
export function saveReadingBookmark({ chapterId, scrollPosition = null }) {
  if (typeof chapterId !== 'number') return;
  const token = typeof window !== 'undefined' && window.csrfToken ? window.csrfToken : '';
  try {
    fetch('/reader/bookmark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': token,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ chapter_id: chapterId, scroll_position: scrollPosition }),
      credentials: 'same-origin',
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

function getScrollRatio() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.max(0, Math.min(1, window.scrollY / max));
}

export function useReadingBookmark(chapterId) {
  const chapterRef = useRef(chapterId);
  chapterRef.current = chapterId;

  // Upsert on open; persist the scroll ratio when leaving the chapter
  // (also runs when navigating prev/next inside the same reader).
  useEffect(() => {
    saveReadingBookmark({ chapterId });
    return () => {
      saveReadingBookmark({ chapterId, scrollPosition: getScrollRatio() });
    };
  }, [chapterId]);

  // Flush the position when the tab or window is closed.
  useEffect(() => {
    const onBeforeUnload = () =>
      saveReadingBookmark({ chapterId: chapterRef.current, scrollPosition: getScrollRatio() });
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);
}

/**
 * Restore a saved mid-chapter scroll ratio once the page has settled.
 * No-op when `resumeScroll` is null/undefined (fresh chapter start).
 */
export function useRestoreScroll(resumeScroll) {
  useEffect(() => {
    if (typeof resumeScroll !== 'number' || resumeScroll <= 0) return;

    const restore = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max > 0) {
        window.scrollTo({ top: resumeScroll * max });
      }
    };

    // Try shortly after mount, then again once late images have loaded.
    const timer = window.setTimeout(restore, 120);
    const onLoad = () => window.setTimeout(restore, 0);
    window.addEventListener('load', onLoad);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', onLoad);
    };
  }, [resumeScroll]);
}