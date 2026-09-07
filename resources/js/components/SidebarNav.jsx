import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { NAV_TABS } from '../lib/nav';
import { useI18n } from '../lib/i18n';
import { useKidMode } from './KidModeProvider';
import { BottomSheet } from './ui/BottomSheet';

/**
 * Desktop left sidebar — Prophet Stories (নবীদের গল্প) desert design.
 * Shown only on lg+: same 5 tabs from NAV_TABS, stacked vertically.
 * The quiz (কুইজ) tab keeps its elevated Sunset Amber identity; the active
 * tab is Sandstone Ochre (Palm Green in kid mode). Hidden on mobile where
 * BottomNav takes over.
 */
export function SidebarNav({ active = 'home', className }) {
  const { t } = useI18n();
  const { kidMode } = useKidMode();
  const logoutForm = useForm({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmLogout = () => {
    setIsSubmitting(true);
    logoutForm.post('/logout', {
      onFinish: () => {
        setIsSubmitting(false);
        setShowLogoutModal(false);
      },
    });
  };

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r bg-bg-light lg:flex',
          kidMode ? 'border-kid/25' : 'border-primary/15',
          className
        )}
        aria-label="Sidebar navigation"
      >
        {/* Wordmark */}
        <div className={cn('flex h-14 shrink-0 items-center gap-3 border-b px-5', kidMode ? 'border-kid/25' : 'border-primary/15')}>
          <img
            src="/logo.png"
            alt="Prophet Stories logo"
            className="size-8 object-contain rounded-lg shadow-sm"
          />
          <div className="leading-tight">
            <p className="text-[16px] font-bold text-ink">Prophet Stories</p>
            <p className={cn('text-[13px] font-medium font-bn', kidMode ? 'text-kid' : 'text-secondary')}>
              নবীদের গল্প
            </p>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_TABS.map(({ key, label, href, Icon, accent, kid: isKidTab }) => {
            const isActive = key === active;
            const isKidActive = isKidTab && kidMode;
            return (
              <Link
                key={key}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-12 items-center gap-3 rounded-[12px] px-3 text-[14px] transition-all font-bn',
                  accent
                    ? cn(
                        'bg-accent text-white font-black shadow-[0_4px_14px_rgba(232,134,59,0.35)] hover:shadow-[0_6px_18px_rgba(232,134,59,0.45)]',
                        isActive
                          ? 'ring-2 ring-accent/60 ring-offset-2 ring-offset-bg-light'
                          : 'opacity-95 hover:opacity-100'
                      )
                    : isActive
                    ? isKidActive
                      ? 'bg-kid/10 text-kid font-extrabold'
                      : 'bg-primary/10 text-primary font-extrabold'
                    : isKidActive
                    ? 'text-kid hover:bg-kid/10 hover:text-kid font-semibold'
                    : 'text-muted hover:bg-primary/5 hover:text-ink font-semibold'
                )}
              >
                <Icon className="size-5 shrink-0" strokeWidth={2} />
                <span className="truncate">{t(label)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer — logout button */}
        <div className={cn('shrink-0 border-t p-3', kidMode ? 'border-kid/25' : 'border-primary/15')}>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            disabled={logoutForm.processing}
            className="flex h-12 w-full items-center gap-3 rounded-[12px] px-3 text-[14px] font-semibold text-danger transition-colors hover:bg-red-50 active:scale-[0.98] disabled:opacity-60 font-bn cursor-pointer"
          >
            <LogOut className="size-5 shrink-0" strokeWidth={2} />
            <span>{logoutForm.processing ? t('লগ আউট হচ্ছে…') : t('লগ আউট')}</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirm Sheet */}
      <BottomSheet
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      >
        <div className="flex flex-col items-center text-center font-bn space-y-4 p-1">
          <div className="size-16 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shadow-inner mb-1">
            <LogOut className="size-8 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-[22px] font-black text-ink tracking-tight">
              {t('লগ আউট নিশ্চিতকরণ')}
            </h2>
            <p className="text-[14px] leading-relaxed text-muted px-2">
              {t('আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্ট থেকে লগ আউট করতে চান?')}
            </p>
          </div>

          <div className="w-full space-y-2.5 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmLogout}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[14px] font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-60"
            >
              <LogOut className="size-4" />
              {isSubmitting ? t('লগ আউট হচ্ছে…') : t('হ্যাঁ, লগ আউট করুন')}
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-ink text-[14px] font-bold border border-slate-200 transition-all active:scale-[0.98] cursor-pointer"
            >
              {t('ফিরে যান')}
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}