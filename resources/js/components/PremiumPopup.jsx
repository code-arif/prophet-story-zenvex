import { Link } from '@inertiajs/react';
import React from 'react';

const CHECK_ICON = (
  <svg className="w-3 h-3 text-[hsl(var(--primary))]" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const FEATURES = [
  { title: 'Unlimited Access', desc: 'Read all premium articles and reports' },
  { title: 'Breaking News Alerts', desc: 'Get notified instantly about important updates' },
  { title: 'Focused Reading Experience', desc: 'Enjoy uninterrupted reading' },
];

/**
 * PremiumPopup
 * Props:
 *   open     {boolean}  – whether the modal is visible
 *   onClose  {function} – called when user dismisses the modal
 */
export default function PremiumPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[hsl(var(--card))] rounded-3xl p-8 max-w-lg w-full ring-1 ring-[hsl(var(--border))] shadow-2xl transform transition-all relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-[hsl(var(--foreground))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] text-center mb-2">
          Premium Content
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-6">
          Subscribe to unlock exclusive articles, breaking news, and in-depth analysis
        </p>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          {FEATURES.map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center shrink-0 mt-0.5">
                {CHECK_ICON}
              </div>
              <div>
                <div className="text-sm font-medium text-[hsl(var(--foreground))]">{title}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full text-center py-3.5 px-6 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Subscribe Now
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-medium hover:bg-[hsl(var(--secondary))] transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
