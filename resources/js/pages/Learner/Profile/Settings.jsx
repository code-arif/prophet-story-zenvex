import React from 'react';
import { Head } from '@inertiajs/react';
import { Bell, CalendarPlus, ChevronRight, Database, Info, Languages, Speaker, Trash2, Volume2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 31 — সেটিংস ও রিমাইন্ডার / Settings & Reminder (Stitch).
 * Grouped setting rows with a reminder toggle + day chips, language/voice
 * controls and a destructive data section (red reserved for destructive).
 */
export default function Settings() {
  const [reminderOn, setReminderOn] = React.useState(true);
  const [days, setDays] = React.useState(new Set(['শ', 'র', 'সো', 'ম', 'বু']));
  const [size, setSize] = React.useState(1); // 0 small, 1 medium, 2 large

  const toggleDay = (d) => {
    setDays((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  return (
    <LearnerShell showBack activeTab="profile" title="সেটিংস">
      <div className="mt-2 space-y-4">
        <Head title="সেটিংস" />

        {/* Group 1 — Reminder */}
        <section>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">পড়ার রিমাইন্ডার</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Bell className="size-5 shrink-0 text-learn-ink" strokeWidth={2} />
              <span className="flex-1 text-[14px] font-semibold text-learn-ink">দৈনিক রিমাইন্ডার</span>
              <button
                type="button"
                role="switch"
                aria-checked={reminderOn}
                aria-label="দৈনিক রিমাইন্ডার"
                onClick={() => setReminderOn((v) => !v)}
                className={cn(
                  'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                  reminderOn ? 'bg-learn-primary' : 'bg-learn-disabled'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-6 rounded-full bg-white shadow transition-all',
                    reminderOn ? 'left-[22px]' : 'left-0.5'
                  )}
                />
              </button>
            </div>
            <div className="mx-4 h-px bg-learn-structure" />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex-1 text-[14px] font-medium text-learn-ink">সময়</span>
              <span className="text-[13px] text-learn-muted">রাত ৯:০০</span>
              <ChevronRight className="size-4 text-learn-muted" strokeWidth={2} />
            </div>
            <div className="mx-4 h-px bg-learn-structure" />
            <div className="flex gap-2 px-4 py-3.5">
              {DAY_KEYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  aria-pressed={days.has(d)}
                  className={cn(
                    'flex size-10 flex-1 items-center justify-center rounded-full text-[13px] font-bold transition-colors',
                    days.has(d) ? 'bg-learn-primary text-white' : 'bg-learn-bg text-learn-muted'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Amber note */}
          <div className="mt-3 rounded-[14px] bg-learn-warn-tint px-4 py-3">
            <div className="flex items-start gap-2.5 text-[13px] leading-relaxed text-learn-warn">
              <Info className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
              <span>iPhone-এ ব্রাউজার নোটিফিকেশন সবসময় নির্ভরযোগ্য নয় — অ্যাপ খুললে বকেয়া রিমাইন্ডার দেখানো হবে</span>
            </div>
            <button className={cn(buttonVariants({ variant: 'outlineBlue', size: 'sm' }), 'mt-3 w-full')}>
              <CalendarPlus className="size-4" strokeWidth={2} />
              ক্যালেন্ডারে যোগ করুন
            </button>
          </div>
        </section>

        {/* Group 2 — Language & writing */}
        <section>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">ভাষা ও লেখা</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Languages className="size-5 shrink-0 text-learn-ink" strokeWidth={2} />
              <span className="flex-1 text-[14px] font-medium text-learn-ink">অ্যাপের ভাষা</span>
              <span className="text-[13px] text-learn-muted">বাংলা</span>
              <ChevronRight className="size-4 text-learn-muted" strokeWidth={2} />
            </div>
            <div className="mx-4 h-px bg-learn-structure" />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex-1 text-[14px] font-medium text-learn-ink">লেখার আকার</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-label={`লেখার আকার ${s + 1}`}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg font-bold transition-colors',
                      size === s ? 'bg-learn-primary text-white' : 'text-learn-muted'
                    )}
                  >
                    <span className={s === 0 ? 'text-[12px]' : s === 1 ? 'text-[14px]' : 'text-[17px]'}>ক</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Group 3 — Listening */}
        <section>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">শোনা</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Speaker className="size-5 shrink-0 text-learn-ink" strokeWidth={2} />
              <span className="flex-1 text-[14px] font-medium text-learn-ink">ভয়েস</span>
              <span className="text-[13px] text-learn-muted">ডিভাইসের ডিফল্ট</span>
              <ChevronRight className="size-4 text-learn-muted" strokeWidth={2} />
            </div>
            <div className="mx-4 h-px bg-learn-structure" />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Volume2 className="size-5 shrink-0 text-learn-ink" strokeWidth={2} />
              <span className="flex-1 text-[14px] font-medium text-learn-ink">পড়ার গতি</span>
              <span className="text-[13px] text-learn-muted">১.০x</span>
              <ChevronRight className="size-4 text-learn-muted" strokeWidth={2} />
            </div>
          </div>
        </section>

        {/* Group 4 — Data */}
        <section>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">ডেটা</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Database className="size-5 shrink-0 text-learn-ink" strokeWidth={2} />
              <span className="flex-1 text-[14px] font-medium text-learn-ink">সংরক্ষিত জায়গা</span>
              <span className="text-[13px] text-learn-muted">{toBnDigits(18)} MB</span>
            </div>
            <div className="mx-4 h-px bg-learn-structure" />
            <button type="button" className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <span className="flex-1 text-[14px] font-medium text-learn-ink">অগ্রগতি রপ্তানি করুন</span>
              <ChevronRight className="size-4 text-learn-muted" strokeWidth={2} />
            </button>
            <div className="mx-4 h-px bg-learn-structure" />
            <button
              type="button"
              onClick={() => window.confirm('আপনি কি নিশ্চিত যে সব তথ্য মুছে ফেলতে চান?')}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <Trash2 className="size-5 shrink-0 text-learn-danger" strokeWidth={2} />
              <span className="flex-1 text-[14px] font-semibold text-learn-danger">সব তথ্য মুছে ফেলুন</span>
            </button>
          </div>
        </section>
      </div>
    </LearnerShell>
  );
}

const DAY_KEYS = ['শ', 'র', 'সো', 'ম', 'বু', 'বৃ', 'শু'];
