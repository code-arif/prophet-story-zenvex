import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Globe, Briefcase, Wallet, FileCheck } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

/**
 * Screen 01 — Welcome · স্বাগতম
 * Onboarding. No bottom navigation.
 * Introduces what easy rise does across the whole freelance career.
 */
export default function Welcome() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-bg-from via-[#F0F0FF] to-bg-to">
      <Head title="ইজি রাইজ — স্বাগতম" />

      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-brand/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-ai/20 blur-[120px]" />

      {/* Content */}
      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 py-12">
        {/* Main glass card */}
        <div className="glass-tall w-full max-w-sm p-6">
          {/* Wordmark */}
          <div className="mb-5 text-center">
            <p className="text-[30px] font-medium tracking-tight text-ink">easy rise</p>
            <p className="text-[17px] text-muted font-bn">ইজি রাইজ</p>
          </div>

          {/* Headline */}
          <h1 className="mb-2 text-center text-[24px] font-bold leading-snug text-ink font-bn">
            {t('প্রথম কাজ থেকে নিজের ব্যবসা পর্যন্ত')}
          </h1>

          {/* Sub-headline */}
          <p className="mb-6 text-center text-[15px] text-muted font-bn">
            {t('শেখা, কাজ গোছানো, আর টাকা দেশে আনা — সব এক জায়গায়')}
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-2.5">
            <FeatureRow
              icon={<Globe className="size-4" />}
              text={t('মার্কেটপ্লেস কীভাবে চলে তা বুঝে নিন')}
            />
            <FeatureRow
              icon={<Briefcase className="size-4" />}
              text={t('ক্লায়েন্ট আর কাজ এক বোর্ডে')}
            />
            <FeatureRow
              icon={<Wallet className="size-4" />}
              text={t('অনিয়মিত আয়ের হিসাব যেভাবে দরকার')}
            />
            <FeatureRow
              icon={<FileCheck className="size-4" />}
              text={t('বৈধ পথে টাকা এনে কাগজ তৈরি রাখুন')}
            />
          </div>
        </div>

        {/* CTA + link */}
        <div className="mt-8 w-full max-w-sm">
          {/* Page dots */}
          <div className="mb-4 flex justify-center gap-2">
            <span className="size-2 rounded-full bg-brand" />
            <span className="size-2 rounded-full bg-border-rest" />
            <span className="size-2 rounded-full bg-border-rest" />
          </div>

          {/* Primary button */}
          <Link
            href="/login"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-brand text-[17px] font-bold text-white shadow-[0_8px_20px_rgba(29,111,242,0.25)] transition-all hover:bg-brand-dark active:scale-[0.98] font-bn"
          >
            {t('শুরু করুন')}
            <ArrowRight className="size-5" />
          </Link>

          {/* Secondary link */}
          <p className="mt-3 text-center">
            <Link
              href="/login"
              className="text-[15px] text-muted transition-colors hover:text-ink font-bn"
            >
              {t('আগে থেকেই কাজ করছি')}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <div className="glass-row flex items-center gap-3 px-4 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-inset-blue text-brand">
        {icon}
      </div>
      <span className="text-[14px] text-ink font-bn">{text}</span>
    </div>
  );
}
