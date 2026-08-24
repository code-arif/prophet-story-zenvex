import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { VioletInset } from '../../components/ui/VioletInset';
import PlanTask from '../../components/learn/PlanTask';
import { cn } from '../../lib/utils';

/**
 * Screen 12 — 90-Day Plan · ৯০ দিনের পরিকল্পনা
 * Setup state → saved plan with timeline.
 */

const MOCK_PLAN = {
  generated: true,
  goal: 'কাজ খুঁজে বের করা',
  level: 'শুরু',
  dailyTime: '৩০ মিনিট',
  tasks: [
    { day: '১-৭', title: 'প্রোফাইল তৈরি', detail: 'ছবি, বিবরণ, স্কিল — সব যোগ করুন' },
    { day: '৮-১৪', title: 'পোর্টফোলিও', detail: '৩টি নমুনা কাজ আপলোড করুন' },
    { day: '১৫-২১', title: 'প্রথম প্রস্তাব', detail: '৫টি প্রস্তাব পাঠান' },
    { day: '২২-৩০', title: 'ক্লায়েন্ট যোগাযোগ', detail: 'ইন্টারভিউ প্রস্তুতি' },
    { day: '৩১-৪৫', title: 'প্রথম কাজ', detail: 'সময়মতো ডেলিভারি' },
    { day: '৪৬-৬০', title: 'রিভিউ সংগ্রহ', detail: 'ক্লায়েন্টদের কাছ থেকে রিভিউ নিন' },
    { day: '৬১-৭৫', title: 'দর বাড়ান', detail: 'আপনার রেট বাড়িয়ে দিন' },
    { day: '৭৬-৯০', title: 'নিজের ব্র্যান্ড', detail: 'নিজের পেজ তৈরি করুন' },
  ],
};

export default function Plan90Days() {
  const { t } = useI18n();
  const [phase, setPhase] = useState(MOCK_PLAN.generated ? 'plan' : 'setup');
  const [form, setForm] = useState({ goal: '', level: '', dailyTime: '' });

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="৯০ দিনের পরিকল্পনা — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('৯০ দিনের পরিকল্পনা')}</h1>

      {phase === 'setup' ? (
        <div>
          <p className="mb-4 text-[14px] text-muted font-bn">
            {t('আপনার লক্ষ্য ও সময় অনুযায়ী পরিকল্পনা তৈরি করুন')}
          </p>

          <VioletInset>
            <p className="text-[13px] text-ai font-bn">
              {t('AI পরিকল্পনা তৈরি করতে ইন্টারনেট প্রয়োজন। একবার তৈরি হলে অফলাইনেও চলবে।')}
            </p>
          </VioletInset>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-ink font-bn">{t('লক্ষ্য')}</label>
              <div className="flex gap-2">
                {['কাজ খোঁজা', 'রেট বাড়ানো', 'দক্ষতা বাড়ানো'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm((p) => ({ ...p, goal: g }))}
                    className={cn(
                      'flex-1 rounded-full py-2 text-[12px] font-bold transition-all active:scale-95 font-bn',
                      form.goal === g ? 'bg-ai text-white' : 'glass-row text-ink'
                    )}
                  >
                    {t(g)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-semibold text-ink font-bn">{t('দৈনিক সময়')}</label>
              <div className="flex gap-2">
                {['১০ মিনিট', '২০ মিনিট', '৩০ মিনিট', '৬০ মিনিট'].map((t2) => (
                  <button
                    key={t2}
                    onClick={() => setForm((p) => ({ ...p, dailyTime: t2 }))}
                    className={cn(
                      'flex-1 rounded-full py-2 text-[12px] font-bold transition-all active:scale-95 font-bn',
                      form.dailyTime === t2 ? 'bg-ai text-white' : 'glass-row text-ink'
                    )}
                  >
                    {t(t2)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('plan')}
            disabled={!form.goal || !form.dailyTime}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-[14px] bg-ai text-[14px] font-bold text-white active:scale-[0.98] disabled:opacity-50 font-bn"
          >
            {t('পরিকল্পনা তৈরি করুন')}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-3 glass px-4 py-3">
            <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-bn">
              <div><span className="text-muted">{t('লক্ষ্য')}</span><p className="font-bold text-ink">{MOCK_PLAN.goal}</p></div>
              <div><span className="text-muted">{t('লেভেল')}</span><p className="font-bold text-ink">{MOCK_PLAN.level}</p></div>
              <div><span className="text-muted">{t('দৈনিক')}</span><p className="font-bold text-ink">{MOCK_PLAN.dailyTime}</p></div>
            </div>
          </div>

          <div className="space-y-2">
            {MOCK_PLAN.tasks.map((task, i) => (
              <PlanTask key={i} task={task} day={task.day} />
            ))}
          </div>

          <button
            onClick={() => setPhase('setup')}
            className="mt-3 flex h-12 w-full items-center justify-center rounded-[14px] border border-border-rest text-[14px] font-bold text-ink active:scale-[0.98] font-bn"
          >
            {t('নতুন করে তৈরি করুন')}
          </button>
        </div>
      )}
    </div>
  );
}
