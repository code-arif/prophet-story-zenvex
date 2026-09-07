import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, ChevronRight, ArrowLeft, Settings, User, Blocks } from 'lucide-react';
import { cn } from '../lib/utils';
import { useKidMode } from './KidModeProvider';
import { useI18n } from '../lib/i18n';

/**
 * Breadcrumb Route Map for Prophet Stories (নবীদের গল্প)
 */
const BREADCRUMB_MAP = {
  '/': { label: 'হোম', parent: null },
  '/library': { label: 'গল্প', parent: null },
  '/quiz': { label: 'কুইজ', parent: null },
  '/kid': { label: 'কিড মোড', parent: null },
  '/settings': { label: 'সেটিংস', parent: null },
  '/profile': { label: 'প্রোফাইল', parent: null },
  '/terms': { label: 'শর্তাবলী', parent: null },
};

function resolveBreadcrumb(url, overrideTitle) {
  const cleanUrl = (url || '').split('?')[0];

  if (BREADCRUMB_MAP[cleanUrl]) {
    const item = BREADCRUMB_MAP[cleanUrl];
    return {
      current: overrideTitle || item.label,
      parent: item.parent,
    };
  }

  // Dynamic routes: individual story / page
  if (cleanUrl.startsWith('/library/')) {
    return { current: overrideTitle || 'গল্প', parent: { label: 'গল্প', href: '/library' } };
  }
  if (cleanUrl.startsWith('/read/')) {
    return { current: overrideTitle || 'পড়া', parent: { label: 'গল্প', href: '/library' } };
  }
  if (cleanUrl.startsWith('/p/')) {
    return { current: overrideTitle || 'পেজ', parent: null };
  }

  return {
    current: overrideTitle || 'Prophet Stories',
    parent: null,
  };
}

export function TopBar({ title, onBack, right, left, showSettings = true, className }) {
  const { url, props } = usePage();
  const { t } = useI18n();
  const { kidMode, toggleKidMode } = useKidMode();
  const subscriber = props?.subscriber;
  const breadcrumb = resolveBreadcrumb(url, title);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-15 border-b backdrop-blur-xl shadow-xs transition-all',
        kidMode ? 'border-kid/25 bg-kid/5' : 'border-primary/15 bg-bg-light/90',
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT: Professional Unified Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {onBack && (
            <button
              type="button"
              aria-label="Back"
              onClick={onBack}
              className="-ml-1 mr-1 flex size-9 items-center justify-center rounded-xl bg-white/70 text-ink transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 shrink-0 border border-primary/10"
            >
              <ArrowLeft className="size-4" strokeWidth={2.2} />
            </button>
          )}

          {left ? (
            <div className="flex items-center shrink-0">{left}</div>
          ) : (
            <nav className="flex items-center gap-1.5 font-bn text-[13px] font-semibold min-w-0 truncate">
              {/* Root Home Pill */}
              <Link
                href="/"
                className="flex items-center gap-1 text-muted hover:text-primary transition-colors shrink-0"
              >
                <Home
                  className={cn('size-3.5', kidMode ? 'text-kid' : 'text-primary')}
                />
                <span className="hidden sm:inline">{t('হোম')}</span>
              </Link>

              <ChevronRight className="size-3.5 text-primary/25 shrink-0" />

              {/* Parent Route (if any) */}
              {breadcrumb.parent && (
                <>
                  <Link
                    href={breadcrumb.parent.href}
                    className="text-muted hover:text-primary transition-colors shrink-0 truncate max-w-[100px] sm:max-w-none"
                  >
                    {breadcrumb.parent.label}
                  </Link>
                  <ChevronRight className="size-3.5 text-primary/25 shrink-0" />
                </>
              )}

              {/* Current Active Page Pill */}
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[12px] font-bold border shrink-0 truncate',
                  kidMode
                    ? 'bg-kid/10 text-kid border-kid/25'
                    : 'bg-primary/10 text-primary border-primary/25'
                )}
              >
                {breadcrumb.current}
              </span>
            </nav>
          )}
        </div>

        {/* RIGHT: Kid Mode Toggle, User Status & Settings */}
        <div className="flex items-center justify-end gap-2 shrink-0 ml-2">
          {right}

          {/* Kid / Adult mode toggle */}
          <button
            type="button"
            onClick={toggleKidMode}
            aria-label={kidMode ? t('কিড মোড বন্ধ করুন') : t('কিড মোড চালু করুন')}
            title={kidMode ? t('কিড মোড বন্ধ করুন') : t('কিড মোড চালু করুন')}
            className={cn(
              'flex items-center gap-1.5 rounded-xl border px-2.5 h-10 transition-all active:scale-95 font-bn',
              kidMode
                ? 'bg-kid text-white border-kid shadow-md shadow-kid/25'
                : 'bg-white/70 text-muted hover:text-kid border-kid/25 hover:bg-kid/10'
            )}
          >
            <Blocks className="size-4.5" strokeWidth={2} />
            <span className="hidden sm:inline text-[12px] font-bold">{t('কিড')}</span>
          </button>

          {subscriber?.name && (
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/70 px-3 py-1.5 border border-primary/15 font-bn text-[12px] font-bold text-ink">
              <User className="size-3.5 text-primary" />
              <span className="truncate max-w-[120px]">{subscriber.name}</span>
            </div>
          )}

          {showSettings && (
            <Link
              href="/settings"
              aria-label={t('সেটিংস')}
              className="flex size-10 items-center justify-center rounded-xl bg-white/70 text-muted transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 border border-primary/15"
            >
              <Settings className="size-4.5" strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}