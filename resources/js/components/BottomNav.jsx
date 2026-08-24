import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '../lib/utils';
import { NAV_TABS } from '../lib/nav';
import { useI18n } from '../lib/i18n';

/**
 * 5-tab bottom navigation — easy rise Stitch design.
 * আজ · শেখা · [elevated violet সহায়ক] · কাজ · টাকা
 * Centre tab is the only place violet (#6D28D9) appears in chrome.
 * Active tab is primary (#1D6FF2) with a small filled dot beneath.
 * Mobile-only — hidden on lg+ where SidebarNav takes over.
 */
export function BottomNav({ active = 'home', className }) {
  const { t } = useI18n();

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md',
        'border-t border-border-rest bg-white/90 backdrop-blur-[18px]',
        'pb-[env(safe-area-inset-bottom)] lg:hidden',
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
              <div key={key} className="relative flex justify-center h-full col-span-1">
                <Link
                  href={href}
                  aria-label={labelText}
                  className={cn(
                    'absolute -top-6 flex size-[72px] flex-col items-center justify-center rounded-full',
                    'bg-ai text-white shadow-[0_8px_20px_rgba(109,40,217,0.35)]',
                    'transition-all hover:scale-105 active:scale-95 gap-0.5'
                  )}
                >
                  <Icon className="size-6 text-white" strokeWidth={2.2} />
                  <span className="text-[11px] font-extrabold text-white tracking-wide font-bn">
                    {labelText}
                  </span>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={key}
              href={href}
              className={cn(
                'flex h-full flex-col items-center justify-center gap-0.5 text-[13px] font-semibold transition-colors font-bn',
                isActive ? 'text-brand' : 'text-muted'
              )}
            >
              <Icon
                className={cn(
                  'size-6 transition-all',
                  isActive ? 'text-brand' : 'text-muted'
                )}
                strokeWidth={2}
              />
              <span className={cn(isActive && 'font-bold')}>{labelText}</span>
              {isActive && (
                <span className="absolute bottom-1 size-1.5 rounded-full bg-brand" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
