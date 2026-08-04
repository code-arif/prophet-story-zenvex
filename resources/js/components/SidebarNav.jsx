import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '../lib/utils';
import { NAV_TABS } from '../lib/nav';

/**
 * Desktop left sidebar (Phase 7 desktop adaptation). Shown only on lg+:
 * the same 5 tabs from NAV_TABS, stacked vertically. The AI tab keeps its
 * violet identity; the active tab is filled primary blue. Hidden on mobile
 * where BottomNav takes over.
 */
export function SidebarNav({ active = 'home', className }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-learn-border bg-white lg:flex',
        className
      )}
      aria-label="Sidebar navigation"
    >
      {/* Wordmark */}
      <div className="flex h-14 shrink-0 items-center border-b border-learn-border px-5">
        <div className="leading-tight">
          <p className="text-[16px] font-bold text-learn-ink">Learn English</p>
          <p className="text-[13px] font-medium text-learn-muted">ইংরেজি শেখা এবার নিজের গতিতে</p>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_TABS.map(({ key, label, href, Icon, ai }) => {
          const isActive = key === active;
          return (
            <Link
              key={key}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-12 items-center gap-3 rounded-[12px] px-3 text-[14px] font-semibold transition-colors active:scale-[0.98]',
                isActive
                  ? ai
                    ? 'bg-learn-ai-tint text-learn-ai'
                    : 'bg-learn-primary-tint text-learn-primary'
                  : 'text-learn-muted hover:bg-learn-bg hover:text-learn-ink'
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={2} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="shrink-0 border-t border-learn-border px-5 py-4">
        <p className="text-[13px] leading-relaxed text-learn-muted">
          বেশিরভাগ অনুশীলন ইন্টারনেট ছাড়াই চলে
        </p>
      </div>
    </aside>
  );
}
