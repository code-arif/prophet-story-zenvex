import React from 'react';
import { cn } from '../lib/utils';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { SidebarNav } from '../components/SidebarNav';

/**
 * App shell for easy rise (ইজি রাইজ) — Stitch design.
 * TopBar (translucent frosted, settings gear) + scrollable content +
 * 5-tab bottom navigation with elevated violet centre button.
 *
 * Mobile-first, centered on a 390px-style canvas. On lg+ (desktop
 * adaptation) the bottom nav becomes a fixed left sidebar and the
 * content column widens to a max of 960px.
 *
 * No bottom nav on: onboarding screens (01–03), settings (30).
 * Pass `hideNav` to suppress bottom nav (e.g. onboarding).
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
  return (
    <div className="min-h-dvh bg-bg-from font-bn text-ink">
      <SidebarNav active={activeTab} />
      <div className="lg:pl-60">
        <div className="mx-auto w-full max-w-md lg:max-w-[960px]">
          <TopBar
            title={title}
            left={left}
            onBack={showBack ? onBack || (() => window.history.back()) : undefined}
            right={right}
            showSettings={showSettings}
          />
          <main className={cn('px-4 pb-28 pt-3 lg:px-10 lg:pb-16', className)}>
            {children}
          </main>
        </div>
      </div>
      {!hideNav && <BottomNav active={activeTab} />}
    </div>
  );
}
