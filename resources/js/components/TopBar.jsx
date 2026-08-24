import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, ChevronRight, ArrowLeft, Settings, User } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Breadcrumb Route Map for easy rise (ইজি রাইজ)
 */
const BREADCRUMB_MAP = {
  '/home': { label: 'আজ (Today)', parent: null },
  '/home/ladder': { label: 'রাইজ ল্যাডার', parent: { label: 'আজ', href: '/home' } },

  '/learn': { label: 'শেখা', parent: null },
  '/learn/marketplace': { label: 'মার্কেটপ্লেস তুলনা', parent: { label: 'শেখা', href: '/learn' } },
  '/learn/niche': { label: 'নিচ স্কোরার', parent: { label: 'শেখা', href: '/learn' } },
  '/learn/checklist': { label: 'প্রোফাইল চেকলিস্ট', parent: { label: 'শেখা', href: '/learn' } },
  '/learn/proposals': { label: 'প্রপোজাল লাইব্রেরি', parent: { label: 'শেখা', href: '/learn' } },
  '/learn/scripts': { label: 'কথোপকথন স্ক্রিপ্ট', parent: { label: 'শেখা', href: '/learn' } },
  '/learn/plan': { label: '৯০ দিনের পরিকল্পনা', parent: { label: 'শেখা', href: '/learn' } },
  '/learn/profile-review': { label: 'প্রোফাইল রিভিউ', parent: { label: 'শেখা', href: '/learn' } },

  '/assistant': { label: 'সহায়ক (AI)', parent: null },

  '/work': { label: 'কাজ', parent: null },
  '/work/proposals': { label: 'প্রপোজাল ট্র্যাকার', parent: { label: 'কাজ', href: '/work' } },
  '/work/payments': { label: 'বকেয়া পেমেন্ট', parent: { label: 'কাজ', href: '/work' } },
  '/work/capacity': { label: 'ক্যাপাসিটি মিটার', parent: { label: 'কাজ', href: '/work' } },
  '/work/screener': { label: 'ক্লায়েন্ট স্ক্রিনার', parent: { label: 'কাজ', href: '/work' } },

  '/money': { label: 'টাকা', parent: null },
  '/money/ledger': { label: 'আয়-ব্যয় লেজার', parent: { label: 'টাকা', href: '/money' } },
  '/money/true-hourly': { label: 'ট্রু আওয়ারলি', parent: { label: 'টাকা', href: '/money' } },
  '/money/runway': { label: 'ফাইন্যান্সিয়াল রানওয়ে', parent: { label: 'টাকা', href: '/money' } },
  '/money/channels': { label: 'পেমেন্ট চ্যানেল', parent: { label: 'টাকা', href: '/money' } },
  '/money/incentive': { label: 'সরকারি প্রণোদনা', parent: { label: 'টাকা', href: '/money' } },
  '/money/documents': { label: 'ডকুমেন্ট রেডিনেস', parent: { label: 'টাকা', href: '/money' } },
  '/money/proof': { label: 'ইনকাম প্রুফ', parent: { label: 'টাকা', href: '/money' } },

  '/settings': { label: 'সেটিংস', parent: null },
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

  // Dynamic job matching
  if (cleanUrl.startsWith('/work/jobs/')) {
    if (cleanUrl.endsWith('/scope')) {
      return { current: 'স্কোপ গার্ড', parent: { label: 'কাজ', href: '/work' } };
    }
    return { current: 'প্রজেক্ট ডিটেইলস', parent: { label: 'কাজ', href: '/work' } };
  }

  return {
    current: overrideTitle || 'ড্যাশবোর্ড',
    parent: null,
  };
}

export function TopBar({ title, onBack, right, left, showSettings = true, className }) {
  const { url, props } = usePage();
  const subscriber = props?.subscriber;
  const breadcrumb = resolveBreadcrumb(url, title);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-15 border-b border-border-rest/80',
        'bg-white/95 backdrop-blur-xl shadow-xs transition-all',
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
              className="-ml-1 mr-1 flex size-9 items-center justify-center rounded-xl bg-slate-100/80 text-ink transition-colors hover:bg-brand/10 hover:text-brand active:scale-95 shrink-0"
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
                href="/home"
                className="flex items-center gap-1 text-muted hover:text-brand transition-colors shrink-0"
              >
                <Home className="size-3.5 text-brand" />
                <span className="hidden sm:inline">হোম</span>
              </Link>

              <ChevronRight className="size-3.5 text-slate-300 shrink-0" />

              {/* Parent Route (if any) */}
              {breadcrumb.parent && (
                <>
                  <Link
                    href={breadcrumb.parent.href}
                    className="text-muted hover:text-brand transition-colors shrink-0 truncate max-w-[100px] sm:max-w-none"
                  >
                    {breadcrumb.parent.label}
                  </Link>
                  <ChevronRight className="size-3.5 text-slate-300 shrink-0" />
                </>
              )}

              {/* Current Active Page Pill */}
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[12px] font-bold text-brand border border-brand/20 shrink-0 truncate">
                {breadcrumb.current}
              </span>
            </nav>
          )}
        </div>

        {/* RIGHT: User Status & Settings */}
        <div className="flex items-center justify-end gap-2 shrink-0 ml-2">
          {right}

          {subscriber?.name && (
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-1.5 border border-slate-200/60 font-bn text-[12px] font-bold text-ink">
              <User className="size-3.5 text-brand" />
              <span className="truncate max-w-[120px]">{subscriber.name}</span>
            </div>
          )}

          {showSettings && (
            <Link
              href="/settings"
              aria-label="সেটিংস"
              className="flex size-10 items-center justify-center rounded-xl bg-slate-100/80 text-muted transition-colors hover:bg-brand/10 hover:text-brand active:scale-95 border border-slate-200/60"
            >
              <Settings className="size-4.5" strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
