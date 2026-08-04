import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React from 'react';
import { Download } from 'lucide-react';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';

export default function PhoneLogin({ brandName, logoUrl, guestModeEnabled, appChargeText }) {
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
    <div className="min-h-screen bg-[#F6F7FB] text-[#14172B] flex flex-col max-w-[390px] mx-auto overflow-x-hidden relative font-['Noto_Sans_Bengali','Inter',sans-serif]">
      <Head title="শিখুন - লগইন" />

      {/* Top AppBar Navigation */}
      <header className="fixed top-0 w-full max-w-[390px] h-14 z-50 flex items-center px-5 bg-transparent">
        <button
          aria-label="Back"
          type="button"
          className="w-12 h-12 flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 transition-colors active:scale-95"
          onClick={() => window.history.back()}
        >
          <span className="material-symbols-outlined text-[#14172B] text-2xl">arrow_back</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col pt-24 px-5 pb-10">
        {/* Brand / Logo if available */}
        {(logoUrl || brandName) && (
          <div className="mb-6 flex flex-col items-center text-center animate-fade-in">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="mb-2 size-16 rounded-full bg-white object-cover shadow-sm ring-1 ring-black/10"
              />
            ) : null}
            {brandName ? (
              <div className="text-xl font-bold text-[#14172B] tracking-tight">{brandName}</div>
            ) : null}
          </div>
        )}

        {/* Flash messages */}
        {flash?.error && (
          <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 ring-1 ring-red-500/20">
            {flash.error}
          </div>
        )}
        {flash?.status && (
          <div className="mb-4 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700 ring-1 ring-green-500/20">
            {flash.status}
          </div>
        )}

        {/* Header Content */}
        <div className="animate-fade-in space-y-1 mb-8">
          <h1 className="text-[22px] leading-[30px] font-bold text-[#14172B]">ফোন নম্বর দিন</h1>
          <p className="text-[15px] leading-[22px] text-[#6B7280]">আপনার অগ্রগতি এই নম্বরের সাথে যুক্ত থাকবে</p>
        </div>

        {/* Input Card Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.post('/login/send-otp');
          }}
          className="animate-fade-in space-y-4"
          style={{ animationDelay: '0.1s' }}
        >
          <div>
            <div className="bg-white rounded-[14px] shadow-[0px_4px_12px_rgba(20,23,43,0.04)] p-1 flex items-center border border-[#c3c6d5]/30 focus-within:border-[#2B59C3] focus-within:ring-1 focus-within:ring-[#2B59C3] transition-all">
              {/* Country Prefix Chip */}
              <div className="flex items-center gap-2 pl-4 pr-3 h-12 select-none">
                <div className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 relative">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTs_lT3W_LjbqQajI0aq-Y2YzfJxgFX8ij3Ol4ZbMKOgcTusVvy8fqZFaXPLzLFQG_dGZF79nOLcmfrS-xwrk24OdXkMK7QTpcZOTiiEgUvUnH1LThnCunY7OMr16aEFayjavRf-Mh6rUGJxOGe5ASB2WrYKub0Hjc6cOiC4MomSo3qGDIpJtoHZ37RMVzqnBTGSyPLuRA_bL22P0OOkomGQf-HtDi5u0mjWRpRkZKtJKDLVKqiM6t')",
                    }}
                  />
                </div>
                <span className="text-[16px] font-semibold text-[#14172B]">+৮৮০</span>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-6 bg-[#c3c6d5]"></div>

              {/* Numeric Input */}
              <input
                id="phoneInput"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="১৭XXXXXXXX"
                value={form.data.msisdn}
                onChange={(e) => form.setData('msisdn', e.target.value)}
                className="flex-1 h-12 bg-transparent border-none px-4 text-[16px] text-[#14172B] placeholder:text-[#c3c6d5] focus:outline-none focus:ring-0"
              />
            </div>

            {form.errors.msisdn ? (
              <div className="mt-2 text-sm text-red-500 pl-1">{form.errors.msisdn}</div>
            ) : null}

            <p className="mt-3 text-[13px] text-[#6B7280] pl-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">info</span>
              এসএমএসে একটি কোড পাঠানো হবে
            </p>
            <p className="mt-1 text-[11px] text-[#6B7280] pl-1">
              ফরম্যাট: 8801XXXXXXXXX অথবা 01XXXXXXXXX
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-6 space-y-4">
            <button
              type="submit"
              disabled={form.processing}
              className={`w-full h-[52px] rounded-[14px] font-semibold text-[16px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] ${
                isValidLength && !form.processing
                  ? 'bg-[#2B59C3] text-white shadow-[0px_8px_20px_rgba(43,89,195,0.15)] cursor-pointer'
                  : 'bg-[#C9CED6] text-white cursor-not-allowed'
              }`}
            >
              {form.processing ? (
                <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              ) : (
                'কোড পাঠান'
              )}
            </button>

            <p className="text-center text-[13px] text-[#6B7280] px-4 leading-relaxed">
              চালিয়ে গেলে আপনি{' '}
              <a href="#" className="text-[#2B59C3] font-semibold hover:underline">
                ব্যবহারের শর্ত
              </a>{' '}
              মেনে নিচ্ছেন
            </p>
          </div>
        </form>

        <div className="flex-1"></div>

        {/* Additional Features: Guest mode, charging info, app download */}
        <div className="mt-6 space-y-3 text-center">
          {guestModeEnabled && (
            <div>
              <Link href="/guest" className="inline-block text-sm text-[#2B59C3] font-semibold hover:underline">
                Continue as Guest
              </Link>
            </div>
          )}

          {appChargeText && (
            <div className="text-xs text-[#6B7280]">{appChargeText}</div>
          )}
        </div>
      </main>

      {/* Decorative Blur Background Element */}
      <div className="absolute top-0 right-0 -z-10 w-64 h-64 opacity-20 pointer-events-none bg-[#2B59C3] rounded-full blur-3xl" />

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
