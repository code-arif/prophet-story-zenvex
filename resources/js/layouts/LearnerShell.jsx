import React from 'react';
import { cn } from '../lib/utils';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { SidebarNav } from '../components/SidebarNav';
import FlashMessages from '../components/FlashMessages';

/**
 * App shell for easy rise (ইজি রাইজ) — Stitch design.
 * Sticky TopBar (translucent frosted, breadcrumb + settings gear) + scrollable content +
 * 5-tab bottom navigation on mobile / fixed sidebar navigation on desktop (lg+).
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
    <div className="min-h-dvh bg-[#F6F8FE] font-bn text-ink selection:bg-brand selection:text-white">
      <SidebarNav active={activeTab} />
      <div className="lg:pl-60">
        <div className="w-full">
          <TopBar
            title={title}
            left={left}
            onBack={showBack ? onBack || (() => window.history.back()) : undefined}
            right={right}
            showSettings={showSettings}
          />
          <main className={cn('mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-28 pt-4 lg:pb-8', className)}>
            <FlashMessages className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200" />
            {children}
          </main>
        </div>
      </div>
      {!hideNav && <BottomNav active={activeTab} />}
    </div>
  );
}
