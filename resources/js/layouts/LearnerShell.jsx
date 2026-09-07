import React from 'react';
import { cn } from '../lib/utils';
import { useKidMode } from '../components/KidModeProvider';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import FlashMessages from '../components/FlashMessages';

/**
 * App shell for Prophet Stories (নবীদের গল্প).
 *
 * Layout strategy:
 *  • Desktop (≥ lg): Sticky TopBar with inline navigation (logo + nav tabs +
 *    action icons). No sidebar — everything lives in the top bar.
 *  • Mobile   (< lg): Slim TopBar (breadcrumb + actions only) + fixed
 *    BottomNav (5-tab bar at the very bottom, like a native app).
 *
 * The sidebar (SidebarNav) has been intentionally removed — desktop navigation
 * is now fully handled by TopBar.
 */
export default function LearnerShell({
  title,
  onBack,
  showBack = false,
  right,
  left,
  activeTab = 'home',
  showSettings = true,
  hideNav = false,
  children,
  className,
}) {
  const { kidMode } = useKidMode();

  return (
    <div
      className={cn(
        'min-h-dvh bg-bg-light font-bn text-ink',
        kidMode
          ? 'selection:bg-kid selection:text-white'
          : 'selection:bg-primary selection:text-white'
      )}
    >
      {/* Single top bar — handles both desktop nav and mobile breadcrumb */}
      <TopBar
        title={title}
        left={left}
        onBack={showBack ? onBack || (() => window.history.back()) : undefined}
        right={right}
        showSettings={showSettings}
      />

      {/* Page content — full width on all breakpoints (no sidebar offset) */}
      <main className={cn('mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-28 lg:pb-10 pt-4', className)}>
        <FlashMessages className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200" />
        {children}
      </main>

      {/* Mobile-only bottom navigation — hidden on lg+ (TopBar handles it) */}
      {!hideNav && <BottomNav active={activeTab} />}
    </div>
  );
}