import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 01 — স্বাগতম / Welcome & Language (Stitch).
 * Onboarding screen: NO bottom navigation.
 */
export default function Welcome({ brandName = 'Learn English' }) {
  return (
    <div className="min-h-screen bg-learn-bg font-learn-bn text-learn-ink flex flex-col max-w-[390px] mx-auto overflow-x-hidden relative">
      <Head title="স্বাগতম" />

      {/* Wordmark */}
      <div className="pt-12 text-center">
        <div className="text-[20px] font-bold tracking-tight text-learn-ink">{brandName}</div>
        <p className="mt-1 text-[13px] text-learn-muted">ইংরেজি শেখা এবার নিজের গতিতে</p>
      </div>

      {/* Illustration card */}
      <div className="mt-8 px-5">
        <div className="rounded-[24px] bg-white shadow-[0px_12px_32px_rgba(20,23,43,0.08)] overflow-hidden">
          <Illustration />
        </div>
      </div>

      {/* Headline */}
      <div className="mt-7 px-5 text-center">
        <h1 className="text-[20px] leading-[30px] font-bold text-learn-ink">
          পড়া, শোনা, বলা আর লেখা — চারটিই এক জায়গায়
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-learn-muted">
          ইন্টারনেট ছাড়াই বেশিরভাগ অনুশীলন চলে
        </p>

        {/* 3-dot page indicator */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-learn-primary" />
          <span className="h-2 w-2 rounded-full bg-learn-border" />
          <span className="h-2 w-2 rounded-full bg-learn-border" />
        </div>
      </div>

      <div className="flex-1" />

      {/* Bottom third */}
      <div className="px-5 pb-8 pt-6">
        <Link href="/welcome/profile" className={cn(buttonVariants({ size: 'learner' }))}>
          শুরু করি
        </Link>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-[15px] font-semibold text-learn-primary">
            আগে থেকেই অ্যাকাউন্ট আছে
          </Link>
        </div>
        <p className="mt-5 text-center text-[13px] text-learn-muted">
          হোম স্ক্রিনে যোগ করলে অ্যাপের মতোই খুলবে
        </p>
      </div>
    </div>
  );
}

/** Flat illustration: a learner with a phone and A/B/C speech bubbles. */
function Illustration() {
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" role="img" aria-label="শিক্ষার্থী ও ফোনের চিত্র">
      {/* soft background shapes */}
      <circle cx="52" cy="196" r="54" fill="#EAF0FC" />
      <circle cx="296" cy="34" r="36" fill="#F0EDFF" />
      <circle cx="276" cy="196" r="24" fill="#FEF4E1" />

      {/* speech bubbles with A B C */}
      <g>
        <g transform="translate(18 30)">
          <ellipse cx="34" cy="20" rx="34" ry="20" fill="#FFFFFF" stroke="#2B59C3" strokeWidth="2.5" />
          <text x="34" y="27" textAnchor="middle" fontSize="18" fontWeight="700" fill="#2B59C3" fontFamily="Inter, sans-serif">A</text>
          <path d="M22 36 L14 50 L34 38 Z" fill="#FFFFFF" stroke="#2B59C3" strokeWidth="2.5" />
        </g>
        <g transform="translate(238 22)">
          <ellipse cx="34" cy="20" rx="34" ry="20" fill="#FFFFFF" stroke="#7C6BF5" strokeWidth="2.5" />
          <text x="34" y="27" textAnchor="middle" fontSize="18" fontWeight="700" fill="#7C6BF5" fontFamily="Inter, sans-serif">B</text>
          <path d="M46 36 L54 50 L34 38 Z" fill="#FFFFFF" stroke="#7C6BF5" strokeWidth="2.5" />
        </g>
        <g transform="translate(128 8)">
          <ellipse cx="34" cy="20" rx="34" ry="20" fill="#FFFFFF" stroke="#17A673" strokeWidth="2.5" />
          <text x="34" y="27" textAnchor="middle" fontSize="18" fontWeight="700" fill="#17A673" fontFamily="Inter, sans-serif">C</text>
          <path d="M22 36 L14 50 L34 38 Z" fill="#FFFFFF" stroke="#17A673" strokeWidth="2.5" />
        </g>
      </g>

      {/* phone */}
      <g>
        <rect x="200" y="74" width="72" height="122" rx="14" fill="#14172B" />
        <rect x="208" y="84" width="56" height="102" rx="8" fill="#FFFFFF" />
        <circle cx="236" cy="96" r="8" fill="#EAF0FC" />
        <rect x="216" y="112" width="40" height="6" rx="3" fill="#2B59C3" />
        <rect x="216" y="124" width="40" height="6" rx="3" fill="#E2E6EE" />
        <rect x="216" y="136" width="28" height="6" rx="3" fill="#E2E6EE" />
      </g>

      {/* learner */}
      <g>
        <circle cx="112" cy="118" r="24" fill="#FFD9A0" />
        <path d="M88 118 a24 24 0 0 1 48 0 Z" fill="#2B59C3" />
        <rect x="78" y="142" width="68" height="46" rx="18" fill="#2B59C3" />
        <rect x="78" y="158" width="68" height="18" rx="9" fill="#1E3F8F" />
        {/* arms */}
        <rect x="58" y="146" width="20" height="36" rx="10" fill="#2B59C3" transform="rotate(-14 68 164)" />
        <rect x="146" y="146" width="20" height="36" rx="10" fill="#2B59C3" transform="rotate(14 156 164)" />
      </g>
    </svg>
  );
}
