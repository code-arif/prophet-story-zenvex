import React, { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Check, ChevronDown, Plus, Settings, User, Users } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * ProfileSwitcher - "Reading as: [Parent] / [Child's Name]" context switcher.
 *
 * Placed in the main navigation (TopBar) so a parent can quickly switch
 * the reading context to their child before handing over the device, or return
 * to parent mode with one tap.
 */
export default function ProfileSwitcher({ className }) {
  const { props } = usePage();
  const activeKidProfile = props?.activeKidProfile || null;
  const kidProfiles = props?.kidProfiles || [];
  const subscriber = props?.subscriber || null;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Expose activeKidProfile globally for ReaderModeToggle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__ACTIVE_KID_PROFILE__ = activeKidProfile;
    }
  }, [activeKidProfile]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = (profileId) => {
    setIsOpen(false);
    router.post(
      '/kid-profiles/switch',
      { profile_id: profileId },
      { preserveScroll: true }
    );
  };

  const isKidActive = Boolean(activeKidProfile);
  const displayName = isKidActive ? activeKidProfile.name : 'অভিভাবক';

  return (
    <div className={cn('relative inline-block text-left font-bn', className)} ref={dropdownRef}>
      {/* Switcher Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="পড়ার প্রোফাইল পরিবর্তন করুন"
        className={cn(
          'flex h-9 sm:h-10 items-center gap-1.5 rounded-full border px-3 text-[12.5px] sm:text-[13px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer',
          isKidActive
            ? 'border-kid/40 bg-kid/15 text-kid hover:bg-kid/25'
            : 'border-primary/20 bg-white/80 text-ink hover:bg-primary/10 hover:text-primary'
        )}
      >
        <span className="text-[14px] sm:text-[15px]" aria-hidden="true">
          {isKidActive ? '🧒' : '👤'}
        </span>
        <span className="hidden xs:inline text-muted font-normal text-[11px] sm:text-[12px]">
          পড়ছেন:
        </span>
        <span className="truncate max-w-[90px] sm:max-w-[120px] font-black">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            'size-3.5 opacity-60 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-primary/15 bg-white/95 p-2 shadow-xl backdrop-blur-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-primary/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              কার জন্য প্রস্তুত করছেন?
            </p>
            <p className="text-[12px] text-ink font-semibold">
              ডিভাইস সন্তানের হাতে দেওয়ার আগে মোড বেছে নিন
            </p>
          </div>

          <div className="py-1 space-y-1">
            {/* Parent Option */}
            <button
              type="button"
              onClick={() => handleSwitch('parent')}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-bold transition-colors cursor-pointer',
                !isKidActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-ink hover:bg-primary/5'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">👤</span>
                <div>
                  <div className="leading-tight">অভিভাবক</div>
                  <div className="text-[10.5px] font-medium text-muted">
                    সব গল্প উন্মুক্ত (Standard Mode)
                  </div>
                </div>
              </div>
              {!isKidActive && <Check className="size-4 shrink-0 text-primary stroke-[2.5]" />}
            </button>

            {/* Child Profiles */}
            {kidProfiles.map((kp) => {
              const isSelected = activeKidProfile?.id === kp.id;
              return (
                <button
                  key={kp.id}
                  type="button"
                  onClick={() => handleSwitch(kp.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-bold transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-kid/15 text-kid'
                      : 'text-ink hover:bg-kid/5'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧒</span>
                    <div>
                      <div className="leading-tight">{kp.name}</div>
                      <div className="text-[10.5px] font-medium text-muted">
                        কিড মোড {kp.unlocked_prophet_ids?.length ? `(${kp.unlocked_prophet_ids.length}টি গল্প)` : '(সব গল্প)'}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="size-4 shrink-0 text-kid stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          {/* Manage Profiles Footer Link */}
          <div className="border-t border-primary/10 pt-1 mt-1">
            <Link
              href="/kid-profiles"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold text-primary hover:bg-primary/10 transition-colors"
            >
              <Users className="size-3.5" />
              <span>সন্তানের প্রোফাইল পরিচালনা করুন</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
