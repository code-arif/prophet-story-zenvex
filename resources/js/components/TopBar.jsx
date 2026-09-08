import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Home, ChevronRight, ArrowLeft, Settings,
  User, Blocks, Search, BookOpen, Brain,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useKidMode } from './KidModeProvider';
import { useI18n } from '../lib/i18n';
import { NAV_TABS } from '../lib/nav';
import ProfileSwitcher from './ProfileSwitcher';

/**
 * Breadcrumb Route Map for Prophet Stories (নবীদের গল্প)
 */
const BREADCRUMB_MAP = {
  '/': { label: 'হোম', parent: null },
  '/library': { label: 'গল্প', parent: null },
  '/search': { label: 'অনুসন্ধান', parent: null },
  '/kid-profiles': { label: 'সন্তানের প্রোফাইল', parent: null },
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
    return { current: overrideTitle || item.label, parent: item.parent };
  }

  if (cleanUrl.startsWith('/library/')) {
    return { current: overrideTitle || 'গল্প', parent: { label: 'গল্প', href: '/library' } };
  }
  if (cleanUrl.startsWith('/read/')) {
    return { current: overrideTitle || 'পড়া', parent: { label: 'গল্প', href: '/library' } };
  }
  if (cleanUrl.startsWith('/p/')) {
    return { current: overrideTitle || 'পেজ', parent: null };
  }

  return { current: overrideTitle || 'Prophet Stories', parent: null };
}

/**
 * TopBar — Prophet Stories (নবীদের গল্প)
 *
 * Responsive strategy:
 *  • Mobile  (< lg): breadcrumb on the left, action icons on the right.
 *                    Nav links are in BottomNav — not here.
 *  • Desktop (≥ lg): logo on the far left, nav tabs inline in the centre,
 *                    action icons on the far right.  No sidebar needed.
 */
export function TopBar({ title, onBack, right, left, showSettings = true, className }) {
  const { url, props } = usePage();
  const { t } = useI18n();
  const { kidMode, toggleKidMode } = useKidMode();
  const subscriber = props?.subscriber;
  const breadcrumb = resolveBreadcrumb(url, title);

  // Derive active tab key from current URL for desktop nav highlighting
  const activeKey = (() => {
    const clean = (url || '').split('?')[0];
    if (clean === '/' || clean === '') return 'home';
    if (clean.startsWith('/library') || clean.startsWith('/read')) return 'stories';
    if (clean.startsWith('/search')) return 'search';
    if (clean.startsWith('/quiz')) return 'quiz';
    if (clean.startsWith('/kid')) return 'kid';
    if (clean.startsWith('/settings') || clean.startsWith('/profile') || clean.startsWith('/kid-profiles')) return 'settings';
    return '';
  })();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-xl shadow-xs transition-all',
        kidMode ? 'border-kid/25 bg-kid/5' : 'border-primary/15 bg-bg-light/90',
        className
      )}
    >
      {/* ── Desktop layout (lg+) ─────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-between h-15 max-w-7xl mx-auto px-6 xl:px-8 gap-4">

        {/* Logo + wordmark */}
        <Link href="/library" className="flex items-center gap-2.5 shrink-0 group">
          <img
            src="/logo.png"
            alt="Prophet Stories"
            className="size-9 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="leading-tight">
            <p className="text-[15px] font-black text-ink tracking-tight">Prophet Stories</p>
            <p className={cn('text-[11px] font-semibold font-bn -mt-0.5', kidMode ? 'text-kid' : 'text-secondary')}>
              নবীদের গল্প
            </p>
          </div>
        </Link>

        {/* Centre nav tabs */}
        <nav className="flex items-center gap-1 font-bn" aria-label="Primary navigation">
          {NAV_TABS.map(({ key, label, href, Icon, accent, kid: isKidTab }) => {
            const isActive = key === activeKey;
            const isKidActive = isKidTab && kidMode;

            if (accent) {
              return (
                <Link
                  key={key}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 h-9 rounded-xl text-[13px] font-black transition-all active:scale-95',
                    'bg-accent text-white shadow-md shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5'
                  )}
                >
                  <Icon className="size-4" strokeWidth={2.2} />
                  <span>{t(label)}</span>
                </Link>
              );
            }

            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 h-9 rounded-xl text-[13px] font-semibold transition-all active:scale-95',
                  isActive
                    ? isKidActive
                      ? 'bg-kid/10 text-kid font-bold'
                      : 'bg-primary/10 text-primary font-bold'
                    : 'text-muted hover:text-ink hover:bg-black/5'
                )}
              >
                <Icon
                  className={cn(
                    'size-4 transition-colors',
                    isActive
                      ? isKidActive ? 'text-kid' : 'text-primary'
                      : 'text-muted'
                  )}
                  strokeWidth={2}
                />
                <span>{t(label)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-2 shrink-0">
          {right}
          <ProfileSwitcher />

          <button
            type="button"
            onClick={toggleKidMode}
            aria-label={kidMode ? t('কিড মোড বন্ধ করুন') : t('কিড মোড চালু করুন')}
            title={kidMode ? t('কিড মোড বন্ধ করুন') : t('কিড মোড চালু করুন')}
            className={cn(
              'flex items-center gap-1.5 rounded-xl border px-2.5 h-9 transition-all active:scale-95 font-bn text-[12px] font-bold',
              kidMode
                ? 'bg-kid text-white border-kid shadow-md shadow-kid/25'
                : 'bg-white/70 text-muted hover:text-kid border-kid/25 hover:bg-kid/10'
            )}
          >
            <Blocks className="size-4" strokeWidth={2} />
            <span>{t('কিড')}</span>
          </button>

          {subscriber?.name && (
            <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-1.5 border border-primary/15 font-bn text-[12px] font-bold text-ink">
              <User className="size-3.5 text-primary" />
              <span className="truncate max-w-[110px]">{subscriber.name}</span>
            </div>
          )}

          <Link
            href="/search"
            aria-label="অনুসন্ধান"
            title="অনুসন্ধান"
            className="flex size-9 items-center justify-center rounded-xl bg-white/70 text-muted transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 border border-primary/15"
          >
            <Search className="size-4.5" strokeWidth={2} />
          </Link>

          {showSettings && (
            <Link
              href="/settings"
              aria-label={t('সেটিংস')}
              className="flex size-9 items-center justify-center rounded-xl bg-white/70 text-muted transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 border border-primary/15"
            >
              <Settings className="size-4.5" strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile layout (< lg) ─────────────────────────────────────── */}
      <div className="flex lg:hidden items-center justify-between h-14 max-w-full px-4 gap-2">

        {/* LEFT: back button OR breadcrumb */}
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
              {/* Logo thumbnail on mobile */}
              <Link href="/library" className="shrink-0">
                <img
                  src="/logo.png"
                  alt="Prophet Stories"
                  className="size-8 rounded-lg object-cover"
                />
              </Link>

              <ChevronRight className="size-3.5 text-primary/25 shrink-0" />

              {breadcrumb.parent && (
                <>
                  <Link
                    href={breadcrumb.parent.href}
                    className="text-muted hover:text-primary transition-colors shrink-0 truncate max-w-[80px]"
                  >
                    {breadcrumb.parent.label}
                  </Link>
                  <ChevronRight className="size-3.5 text-primary/25 shrink-0" />
                </>
              )}

              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[12px] font-bold border shrink-0 truncate max-w-[130px]',
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

        {/* RIGHT: mobile action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {right}
          <ProfileSwitcher />

          <button
            type="button"
            onClick={toggleKidMode}
            aria-label={kidMode ? t('কিড মোড বন্ধ করুন') : t('কিড মোড চালু করুন')}
            className={cn(
              'flex items-center gap-1 rounded-xl border px-2 h-9 transition-all active:scale-95 font-bn',
              kidMode
                ? 'bg-kid text-white border-kid shadow-md shadow-kid/25'
                : 'bg-white/70 text-muted hover:text-kid border-kid/25 hover:bg-kid/10'
            )}
          >
            <Blocks className="size-4" strokeWidth={2} />
            <span className="text-[11px] font-bold">{t('কিড')}</span>
          </button>

          <Link
            href="/search"
            aria-label="অনুসন্ধান"
            className="flex size-9 items-center justify-center rounded-xl bg-white/70 text-muted transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 border border-primary/15"
          >
            <Search className="size-4" strokeWidth={2} />
          </Link>

          {showSettings && (
            <Link
              href="/settings"
              aria-label={t('সেটিংস')}
              className="flex size-9 items-center justify-center rounded-xl bg-white/70 text-muted transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 border border-primary/15"
            >
              <Settings className="size-4" strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}