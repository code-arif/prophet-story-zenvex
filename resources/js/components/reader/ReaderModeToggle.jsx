import React from 'react';
import { Link } from '@inertiajs/react';
import { Blocks, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Reader mode preference — shared between the Standard and Kid readers.
 * Persisted to localStorage so the reader's preferred mode is remembered
 * the next time the app opens (Library chapter rows honor it too).
 */
export const READER_MODE_KEY = 'reader.mode';

export function getReaderMode() {
  try {
    return localStorage.getItem(READER_MODE_KEY) === 'kid' ? 'kid' : 'standard';
  } catch {
    return 'standard';
  }
}

export function setReaderMode(mode) {
  try {
    localStorage.setItem(READER_MODE_KEY, mode === 'kid' ? 'kid' : 'standard');
  } catch {}
}

/**
 * Segmented Standard ↔ Kid switch for a chapter.
 *
 * Rendered on both reader pages. Both ends are real links to the same
 * chapter in the other mode, so switching never loses the reader's place.
 * The active end is tinted by the current page's palette (Ochre on the
 * standard reader, Palm Green on the kid reader).
 */
export default function ReaderModeToggle({ chapterId, mode = 'standard', className }) {
  const isKid = mode === 'kid';

  const optionBase =
    'flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-black transition-colors';

  const adultOption = isKid
    ? cn(optionBase, 'text-muted hover:bg-kid/10 hover:text-kid')
    : cn(optionBase, 'bg-primary text-white shadow-sm shadow-primary/30');

  const kidOption = isKid
    ? cn(optionBase, 'bg-kid text-white shadow-sm shadow-kid/40')
    : cn(optionBase, 'text-muted hover:bg-primary/10 hover:text-primary');

  return (
    <div
      role="group"
      aria-label="পড়ার ধরন বাছাই করুন"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border bg-white/70 p-1',
        isKid ? 'border-kid/30' : 'border-primary/20',
        className
      )}
    >
      <Link
        href={`/read/${chapterId}`}
        onClick={() => setReaderMode('standard')}
        title="বড়দের জন্য পড়ুন"
        className={adultOption}
      >
        <BookOpen className="size-4" strokeWidth={2.2} />
        <span className="hidden sm:inline">বড়দের</span>
      </Link>

      <Link
        href={`/read/${chapterId}/kid`}
        onClick={() => setReaderMode('kid')}
        title="কিড মোডে পড়ুন"
        className={kidOption}
      >
        <Blocks className="size-4" strokeWidth={2.2} />
        <span className="hidden sm:inline">কিড</span>
      </Link>
    </div>
  );
}