import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Chapter completion tracking for readers.
 *
 * Automatically records chapter completion when the reader reaches
 * the end of the chapter (via scroll height threshold or IntersectionObserver),
 * and provides an explicit `markAsRead` action for a button.
 *
 * Idempotent: once read or in-flight, duplicate POST requests are prevented.
 */
function getCsrfToken() {
  if (typeof document === 'undefined') return '';
  const meta = document.querySelector('meta[name="csrf-token"]');
  if (meta && meta.content) return meta.content;
  return typeof window !== 'undefined' && window.csrfToken ? window.csrfToken : '';
}

export function useChapterCompletion({ chapterId, initialIsRead = false }) {
  const [isRead, setIsRead] = useState(Boolean(initialIsRead));
  const [isMarking, setIsMarking] = useState(false);
  const endRef = useRef(null);
  const completedRef = useRef(Boolean(initialIsRead));
  const inFlightRef = useRef(false);

  useEffect(() => {
    setIsRead(Boolean(initialIsRead));
    completedRef.current = Boolean(initialIsRead);
  }, [chapterId, initialIsRead]);

  const markAsRead = useCallback(async () => {
    if (!chapterId || completedRef.current || inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    setIsMarking(true);

    try {
      const token = getCsrfToken();
      const response = await fetch('/reader/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': token,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ chapter_id: chapterId }),
        credentials: 'same-origin',
      });

      if (response.ok) {
        completedRef.current = true;
        setIsRead(true);
      }
    } catch {
      // Best-effort completion recording
    } finally {
      inFlightRef.current = false;
      setIsMarking(false);
    }
  }, [chapterId]);

  // 1. Trigger when scroll reaches the bottom (threshold <= 180px)
  useEffect(() => {
    if (completedRef.current) return;

    const onScroll = () => {
      if (completedRef.current) return;
      const doc = document.documentElement;
      const scrollBottom = window.innerHeight + window.scrollY;
      const totalHeight = doc.scrollHeight;

      // When user scrolled within 180px of the bottom
      if (totalHeight > 0 && scrollBottom >= totalHeight - 180) {
        markAsRead();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [markAsRead]);

  // 2. Trigger via IntersectionObserver on the footer element (extra reliable on mobile)
  useEffect(() => {
    if (completedRef.current) return;
    const target = endRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting && !completedRef.current) {
          markAsRead();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [markAsRead]);

  return {
    isRead,
    isMarking,
    markAsRead,
    endRef,
  };
}
