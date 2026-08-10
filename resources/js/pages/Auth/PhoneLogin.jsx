import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React from 'react';
import { Download, Phone } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F6F7FB] text-[#14172B] flex font-['Noto_Sans_Bengali','Inter',sans-serif] relative overflow-hidden">
      <Head title="শিখুন - লগইন" />

      {/* Decorative Blur Elements for the background (Visible behind desktop card / mobile background) */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 opacity-15 pointer-events-none bg-[#2B59C3] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 opacity-10 pointer-events-none bg-[#2B59C3] rounded-full blur-3xl" />

      {/* LEFT COLUMN: Premium Introduction Panel (Desktop/Tablet Only) */}
      <section className="hidden md:flex md:w-[50%] lg:w-[55%] relative overflow-hidden bg-[#14172B] text-white flex-col justify-between p-12 lg:p-16 select-none">
        {/* Background Visual Enhancements (Glow/Blobs) */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#2B59C3]/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#2B59C3]/15 blur-[100px] pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

        {/* Top Header Section */}
        <div className="flex items-center gap-3 z-10">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brandName}
              className="size-11 rounded-full bg-white object-cover shadow-md ring-2 ring-white/20"
            />
          ) : null}
          {brandName ? (
            <span className="text-xl font-bold tracking-tight text-white/95">{brandName}</span>
          ) : null}
        </div>

        {/* Core Marketing Copy */}
        <div className="my-auto space-y-6 z-10 max-w-lg">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#85a8ff] text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/5">
            ✨ Language Learning Hub
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.25] tracking-tight">
            শিখুন ইংরেজি সহজে <br />
            <span className="bg-gradient-to-r from-[#5F8BFA] to-[#B3C8FC] bg-clip-text text-transparent">এবং কার্যকরভাবে</span>
          </h2>
          <p className="text-base lg:text-lg text-white/70 leading-relaxed font-normal">
            আপনার ভাষা শেখার যাত্রা শুরু হোক আজই। আমাদের রয়েছে ইন্টারেক্টিভ লেসন, এআই টিউটর এবং প্রতিদিনের প্র্যাকটিস সেশন।
          </p>
          
          <div className="pt-6 space-y-4 border-t border-white/10">
            <div className="flex items-center gap-3.5 text-sm text-white/80">
              <span className="w-5 h-5 rounded-full bg-[#2B59C3] flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-[#2B59C3]/50">✓</span>
              <span>ব্যক্তিগতকৃত শিখন পথ (Personalized Learning Path)</span>
            </div>
            <div className="flex items-center gap-3.5 text-sm text-white/80">
              <span className="w-5 h-5 rounded-full bg-[#2B59C3] flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-[#2B59C3]/50">✓</span>
              <span>এআই চ্যাট এবং প্র্যাকটিস অ্যাসিস্ট্যান্ট</span>
            </div>
            <div className="flex items-center gap-3.5 text-sm text-white/80">
              <span className="w-5 h-5 rounded-full bg-[#2B59C3] flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-[#2B59C3]/50">✓</span>
              <span>বিশদ অগ্রগতি ট্র্যাকিং এবং বিশ্লেষণ</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-white/40 z-10">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
      </section>

      {/* RIGHT COLUMN: Login Card Container (Mobile & Desktop Form) */}
      <section className="w-full md:w-[50%] lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        

        {/* Core Card Container - Shifts to white surface with shadow/border on desktop */}
        <main className="w-full max-w-[390px] flex-1 flex flex-col justify-between md:justify-center md:flex-none md:bg-white md:rounded-2xl md:shadow-[0px_10px_35px_rgba(20,23,43,0.04)] md:border md:border-black/5 md:p-8 lg:p-10 md:my-auto animate-fade-in">
          
          <div>
            {/* Brand Logo & Name (Mobile Only - Hidden on Desktop to avoid repetition) */}
            {(logoUrl || brandName) && (
              <div className="mb-6 flex flex-col items-center text-center animate-fade-in md:hidden">
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

            {/* Flash Alerts */}
            {flash?.error && (
              <div className="mb-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 ring-1 ring-red-500/20">
                {flash.error}
              </div>
            )}
            {flash?.status && (
              <div className="mb-5 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700 ring-1 ring-green-500/20">
                {flash.status}
              </div>
            )}

            {/* Header Title Text */}
            <div className="space-y-1 mb-8">
              <h1 className="text-[22px] leading-[30px] font-extrabold text-[#14172B] tracking-tight">ফোন নম্বর দিন</h1>
              <p className="text-[14px] leading-[22px] text-[#6B7280] font-normal">আপনার অগ্রগতি এই নম্বরের সাথে যুক্ত থাকবে</p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.post('/login/send-otp');
              }}
              className="space-y-5"
            >
              <div>
                {/* Numeric Input Wrapper */}
                <div className="bg-white rounded-[14px] shadow-[0px_4px_12px_rgba(20,23,43,0.03)] p-1 flex items-center border border-[#c3c6d5]/40 focus-within:border-[#2B59C3] focus-within:ring-1 focus-within:ring-[#2B59C3] focus-within:shadow-[0px_4px_16px_rgba(43,89,195,0.08)] transition-all duration-200">
                  {/* Phone Icon & Country Prefix */}
                  <div className="flex items-center gap-2.5 pl-4 pr-3 h-12 select-none">
                    <Phone className="size-5 text-[#6B7280] flex-shrink-0" />
                    <span className="text-[15px] font-semibold text-[#14172B]">+৮৮০</span>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-px h-6 bg-[#c3c6d5]/70"></div>

                  {/* Input field */}
                  <input
                    id="phoneInput"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="১৭XXXXXXXX"
                    value={form.data.msisdn}
                    onChange={(e) => form.setData('msisdn', e.target.value)}
                    className="flex-1 h-12 bg-transparent border-none px-4 text-[15px] text-[#14172B] placeholder:text-[#c3c6d5] focus:outline-none focus:ring-0"
                  />
                </div>

                {form.errors.msisdn ? (
                  <div className="mt-2 text-sm text-red-500 pl-1">{form.errors.msisdn}</div>
                ) : null}

                <div className="mt-3.5 space-y-1 pl-1">
                  <p className="text-[12px] text-[#6B7280] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">info</span>
                    এসএমএসে একটি কোড পাঠানো হবে
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] leading-normal">
                    ফরম্যাট: 8801XXXXXXXXX অথবা 01XXXXXXXXX
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-4">
                <button
                  type="submit"
                  disabled={!isValidLength || form.processing}
                  className={`w-full h-12 rounded-[14px] font-semibold text-[15px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] ${
                    isValidLength && !form.processing
                      ? 'bg-[#2B59C3] text-white shadow-[0px_8px_20px_rgba(43,89,195,0.18)] hover:bg-[#1F4BB5] hover:shadow-[0px_8px_24px_rgba(43,89,195,0.25)] cursor-pointer'
                      : 'bg-[#C9CED6] text-white cursor-not-allowed'
                  }`}
                >
                  {form.processing ? (
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  ) : (
                    'কোড পাঠান'
                  )}
                </button>

                <p className="text-center text-[12px] text-[#6B7280] px-2 leading-relaxed">
                  চালিয়ে গেলে আপনি{' '}
                  <a href="#" className="text-[#2B59C3] font-semibold hover:underline transition-colors">
                    ব্যবহারের শর্ত
                  </a>{' '}
                  মেনে নিচ্ছেন
                </p>
              </div>
            </form>
          </div>

          {/* Guest login, charge description */}
          <div className="mt-8 space-y-4 text-center">
            {guestModeEnabled && (
              <div>
                <Link href="/guest" className="inline-block text-sm text-[#2B59C3] font-semibold hover:text-[#1F4BB5] hover:underline transition-all">
                  Continue as Guest
                </Link>
              </div>
            )}

            {appChargeText && (
              <div className="text-[11px] text-[#8C94A0] leading-normal px-2 max-w-[280px] mx-auto">
                {appChargeText}
              </div>
            )}
          </div>
        </main>
      </section>

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
