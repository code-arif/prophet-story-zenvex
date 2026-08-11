import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React from 'react';
import { GraduationCap, Info, Lock, Phone } from 'lucide-react';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';

/**
 * Login (PhoneLogin) — styled like the Full Fit login page.
 *
 * Mobile-first: ALL content lives inside a single compact card that is
 * vertically centered, so the whole login screen fits on one phone viewport
 * with no scrolling. Brand row on top, phone form, then the trust +
 * subscription charge info inside the card — never lost at the page bottom.
 */
export default function PhoneLogin({ brandName = 'শিখুন ইংরেজি', logoUrl, guestModeEnabled, appChargeText }) {
  const form = useForm({
    msisdn: '',
  });
  const { flash } = usePage().props;

  const [showUnsubscribeModal, setShowUnsubscribeModal] = React.useState(false);
  const [unsubscribeInfo, setUnsubscribeInfo] = React.useState(null);

  // Parse error message for manual unsubscribe instructions
  React.useEffect(() => {
    if (flash?.error && flash.error.includes('send SMS')) {
      const match = flash.error.match(/send SMS:\s*(.+?)\s*to\s*(\d+)/i);
      if (match) {
        setUnsubscribeInfo({
          message: flash.error.split('Please send SMS')[0].trim() + '.',
          instruction: `${match[1]} to ${match[2]}`
        });
        setShowUnsubscribeModal(true);
      }
    }
  }, [flash?.error]);

  const rawDigits = (form.data.msisdn || '').replace(/\D/g, '');
  const isValidLength = rawDigits.length >= 10;

  return (
    <div className="flex min-h-dvh flex-col bg-[#F6F7FB] font-['Noto_Sans_Bengali','Inter',sans-serif] text-[#14172B]">
      <Head title="শিখুন - লগইন" />

      {/* Single compact card — everything fits on one mobile screen, no scroll */}
      <main className="flex w-full flex-1 items-center justify-center px-4 pb-4 pt-1 sm:py-6">
        <div className="w-full max-w-md rounded-[24px] bg-white p-5 shadow-[0px_10px_35px_rgba(20,23,43,0.06)] sm:p-6">
          {/* Brand row — logo + name inline */}
          <div className="mb-5 flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="size-12 shrink-0 rounded-full bg-white object-cover shadow-md ring-1 ring-black/10 sm:size-16"
              />
            ) : (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#2B59C3] text-white shadow-md sm:size-16">
                <GraduationCap className="size-6" strokeWidth={2.2} />
              </span>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-[22px] font-bold leading-7 tracking-tight text-[#14172B] sm:text-2xl">
                {brandName}
              </h1>
              <p className="text-[13px] leading-5 text-[#6B7280] sm:text-sm">
                আপনার ভাষা শেখার সঙ্গী
              </p>
            </div>
          </div>

          {/* Flash Alerts */}
          {flash?.error && (
            <div className="mb-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 ring-1 ring-red-500/20">
              {flash.error}
            </div>
          )}
          {flash?.status && (
            <div className="mb-3 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700 ring-1 ring-green-500/20">
              {flash.status}
            </div>
          )}

          {/* Form heading */}
          <h2 className="mb-0.5 text-lg font-bold text-[#14172B] sm:text-[20px]">ফোন নম্বর দিন</h2>
          <p className="mb-3 text-sm leading-5 text-[#6B7280] sm:mb-4">আপনার অগ্রগতি এই নম্বরের সাথে যুক্ত থাকবে</p>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.post('/login/send-otp');
            }}
            className="space-y-3"
          >
            <div className="relative">
              {/* Numeric Input Wrapper */}
              <div className="flex h-12 items-center overflow-hidden rounded-xl border-2 border-[#c3c6d5]/60 bg-[#F6F7FB] transition-colors focus-within:border-[#2B59C3] focus-within:ring-1 focus-within:ring-[#2B59C3] sm:h-14">
                <div className="flex h-full items-center justify-center border-r border-[#c3c6d5]/60 bg-[#F6F7FB] px-3.5 sm:px-4">
                  <Phone className="size-4 text-[#6B7280]" />
                  <span className="ml-2 text-[15px] font-semibold text-[#14172B]">+৮৮০</span>
                </div>
                <input
                  id="phoneInput"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="১৭XXXXXXXX"
                  value={form.data.msisdn}
                  onChange={(e) => form.setData('msisdn', e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full flex-1 bg-transparent px-4 py-2.5 text-[15px] tracking-widest text-[#14172B] placeholder:tracking-normal placeholder:text-[#c3c6d5] focus:outline-none focus:ring-0 sm:py-3"
                />
              </div>

              <p className="mt-1.5 flex items-center gap-1 px-1 text-xs text-[#6B7280]">
                <Info className="size-3.5" />
                এসএমএসে একটি কোড পাঠানো হবে
              </p>
              <p className="mt-1 px-1 text-[11px] text-[#9CA3AF]">
                ফরম্যাট: 8801XXXXXXXXX অথবা 01XXXXXXXXX
              </p>

              {form.errors.msisdn ? (
                <p className="mt-1 px-1 text-xs text-red-500">{form.errors.msisdn}</p>
              ) : null}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isValidLength || form.processing}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:h-14 ${
                isValidLength && !form.processing
                  ? 'bg-[#2B59C3] text-white shadow-[0px_8px_20px_rgba(43,89,195,0.18)] hover:bg-[#1F4BB5]'
                  : 'bg-[#C9CED6] text-white'
              }`}
            >
              {form.processing ? 'পাঠানো হচ্ছে...' : 'কোড পাঠান'}
            </button>
          </form>

          {/* Trust + subscription charge — inside the card so it is never
              pushed off to the bottom of the screen */}
          <div className="mt-4 rounded-xl border border-[#c3c6d5]/40 bg-[#F6F7FB] px-3 py-2.5 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#6B7280]">
              <Lock className="size-3.5" strokeWidth={1.75} />
              আপনার তথ্য সম্পূর্ণ নিরাপদ
            </p>
            {appChargeText ? (
              <p className="mt-1 text-[10px] leading-relaxed text-[#8C94A0]">{appChargeText}</p>
            ) : null}
          </div>

          {/* Guest login */}
          {guestModeEnabled && (
            <p className="mt-3 text-center">
              <Link
                href="/guest"
                className="text-sm font-semibold text-[#2B59C3] transition-all hover:text-[#1F4BB5] hover:underline"
              >
                Continue as Guest
              </Link>
            </p>
          )}

          {/* Terms */}
          <p className="mt-3 text-center text-xs leading-tight text-[#8C94A0]">
            চালিয়ে গেলে আপনি{' '}
            <a href="#" className="font-medium text-[#2B59C3] underline">
              ব্যবহারের শর্ত
            </a>{' '}
            মেনে নিচ্ছেন
          </p>
        </div>
      </main>

      {/* Manual Unsubscribe Modal */}
      {showUnsubscribeModal && unsubscribeInfo && (
        <UnsubscribeManualModal
          message={unsubscribeInfo.message}
          instruction={unsubscribeInfo.instruction}
          onClose={() => setShowUnsubscribeModal(false)}
        />
      )}
    </div>
  );
}
