import React from 'react';
import { Link } from '@inertiajs/react';
import { Home, BookOpen, Mic, User, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const TABS = [
  { key: 'home', label: 'হোম', href: '/home', Icon: Home },
  { key: 'learn', label: 'শিখুন', href: '/learn', Icon: BookOpen },
  { key: 'ai', label: 'AI সঙ্গী', href: '/ai', Icon: MessageCircle, center: true },
  { key: 'practice', label: 'অনুশীলন', href: '/practice', Icon: Mic },
  { key: 'profile', label: 'প্রোফাইল', href: '/profile', Icon: User },
];

/**
 * 5-tab bottom navigation (Stitch design): হোম · শিখুন · [elevated violet
 * AI সঙ্গী] · অনুশীলন · প্রোফাইল. Active tab is primary; the centre tab is
 * the only place the violet AI color is used.
 */
export function BottomNav({ active = 'home', className }) {
  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t border-learn-border bg-white pb-[env(safe-area-inset-bottom)]',
        className
      )}
      aria-label="Main navigation"
    >
      <div className="grid h-16 grid-cols-5 items-center px-1">
        {TABS.map(({ key, label, href, Icon, center }) => {
          const isActive = key === active;

          if (center) {
            return (
              <div key={key} className="relative flex justify-center">
                <Link
                  href={href}
                  aria-label={label}
                  className={cn(
                    'absolute -top-5 flex size-14 items-center justify-center rounded-full bg-learn-ai text-white shadow-[0_8px_20px_rgba(124,107,245,0.35)] ring-4 ring-learn-bg transition-transform active:scale-95'
                  )}
                >
                  <Icon className="size-7" strokeWidth={2} />
                </Link>
                <span
                  className={cn(
                    'mt-8 text-[11px] font-semibold',
                    isActive ? 'text-learn-ai' : 'text-learn-muted'
                  )}
                >
                  {label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={key}
              href={href}
              className={cn(
                'flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors',
                isActive ? 'text-learn-primary' : 'text-learn-muted'
              )}
            >
              <Icon className="size-6" strokeWidth={2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
