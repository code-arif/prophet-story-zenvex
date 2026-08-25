import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { NAV_TABS } from '../lib/nav';
import { useI18n } from '../lib/i18n';

/**
 * Desktop left sidebar — easy rise Stitch design.
 * Shown only on lg+: same 5 tabs from NAV_TABS, stacked vertically.
 * The assistant (সহায়ক) tab keeps its violet identity; the active tab
 * is filled primary blue. Hidden on mobile where BottomNav takes over.
 */
export function SidebarNav({ active = 'home', className }) {
  const { t } = useI18n();
  const logoutForm = useForm({});

  const handleLogout = () => {
    if (window.confirm(t('আপনি কি নিশ্চিত যে লগ আউট করতে চান?'))) {
      logoutForm.post('/logout');
    }
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border-rest bg-white lg:flex',
        className
      )}
      aria-label="Sidebar navigation"
    >
      {/* Wordmark */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border-rest px-5">
        <img
          src="/logo.png"
          alt="easy rise logo"
          className="size-8 object-contain rounded-lg shadow-sm"
        />
        <div className="leading-tight">
          <p className="text-[16px] font-bold text-ink">easy rise</p>
          <p className="text-[13px] font-medium text-muted font-bn">ইজি রাইজ</p>
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
                'flex h-12 items-center gap-3 rounded-[12px] px-3 text-[14px] font-semibold transition-colors active:scale-[0.98] font-bn',
                isActive
                  ? ai
                    ? 'bg-inset-violet text-ai'
                    : 'bg-inset-blue text-brand'
                  : 'text-muted hover:bg-bg-from hover:text-ink'
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={2} />
              <span className="truncate">{t(label)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — logout only */}
      <div className="shrink-0 border-t border-border-rest p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutForm.processing}
          className="flex h-12 w-full items-center gap-3 rounded-[12px] px-3 text-[14px] font-semibold text-danger transition-colors hover:bg-red-50 active:scale-[0.98] disabled:opacity-60 font-bn"
        >
          <LogOut className="size-5 shrink-0" strokeWidth={2} />
          <span>{logoutForm.processing ? t('লগ আউট হচ্ছে…') : t('লগ আউট')}</span>
        </button>
      </div>
    </aside>
  );
}
