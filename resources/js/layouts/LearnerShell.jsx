import React from 'react';
import { cn } from '../lib/utils';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';

/**
 * App shell for the "Learn English" learner UI (Stitch design):
 * a top bar (streak chip on hubs, back on sub-pages) + scrollable content +
 * the 5-tab bottom navigation. Mobile-first, centered on a 390px-style canvas.
 *
 * Pages assign this layout via `Page.layout = LearnerShell` (Inertia 2).
 */
export default function LearnerShell({
  title,
  onBack,
  showBack = false,
  right,
  left,
  activeTab = 'home',
  children,
  className,
}) {
  return (
    <div className="min-h-dvh bg-learn-bg font-learn-bn text-learn-ink">
      <div className="mx-auto w-full max-w-md">
        <TopBar
          title={title}
          left={left}
          onBack={showBack ? onBack || (() => window.history.back()) : undefined}
          right={right}
        />
        <main className={cn('px-5 pb-28 pt-2', className)}>{children}</main>
      </div>
      <BottomNav active={activeTab} />
    </div>
  );
}
