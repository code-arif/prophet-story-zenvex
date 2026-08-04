import React from 'react';
import { cn } from '../lib/utils';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { SidebarNav } from '../components/SidebarNav';

/**
 * App shell for the "Learn English" learner UI (Stitch design):
 * a top bar (streak chip on hubs, back on sub-pages) + scrollable content +
 * the 5-tab bottom navigation.
 *
 * Mobile-first, centered on a 390px-style canvas. On lg+ (Phase 7 desktop
 * adaptation) the bottom nav becomes a fixed left sidebar and the content
 * column widens to a max of 960px.
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
      <SidebarNav active={activeTab} />
      <div className="lg:pl-60">
        <div className="mx-auto w-full max-w-md lg:max-w-[960px]">
          <TopBar
            title={title}
            left={left}
            onBack={showBack ? onBack || (() => window.history.back()) : undefined}
            right={right}
          />
          <main className={cn('px-5 pb-28 pt-2 lg:px-10 lg:pb-16', className)}>{children}</main>
        </div>
      </div>
      <BottomNav active={activeTab} />
    </div>
  );
}
