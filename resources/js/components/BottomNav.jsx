import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '../lib/utils';
import { NAV_TABS } from '../lib/nav';
import { useI18n } from '../lib/i18n';

/**
 * 5-tab bottom navigation (Stitch design): হোম · শিখুন · [elevated violet
 * AI সঙ্গী] · অনুশীলন · প্রোফাইল. Active tab is primary; the centre tab is
 * the only place the violet AI color is used. Mobile-only — hidden on lg+
 * where the desktop SidebarNav takes over (Phase 7).
 */
export function BottomNav({ active = 'home', className }) {
  const { t } = useI18n();

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t border-learn-border bg-white pb-[env(safe-area-inset-bottom)] lg:hidden',
        className
      )}
      aria-label="Main navigation"
    >
      <div className="grid h-16 grid-cols-5 items-center px-1">
        {NAV_TABS.map(({ key, label, href, Icon, ai }) => {
          const isActive = key === active;

          const labelText = t(label);

          if (ai) {
            return (
              <div key={key} className="relative flex justify-center">
                <Link
                  href={href}
                  aria-label={labelText}
                  className={cn(
                    'absolute -top-5 flex size-14 items-center justify-center rounded-full bg-learn-ai text-white shadow-[0_8px_20px_rgba(124,107,245,0.35)] ring-4 ring-learn-bg transition-transform active:scale-95'
                  )}
                >
                  <Icon className="size-7" strokeWidth={2} />
                </Link>
                <span
                  className={cn(
                    'mt-8 text-[13px] font-semibold',
                    isActive ? 'text-learn-ai' : 'text-learn-muted'
                  )}
                >
                  {labelText}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={key}
              href={href}
              className={cn(
                'flex h-full flex-col items-center justify-center gap-0.5 text-[13px] font-semibold transition-colors',
                isActive ? 'text-learn-primary' : 'text-learn-muted'
              )}
            >
              <Icon className="size-6" strokeWidth={2} />
              <span>{labelText}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
