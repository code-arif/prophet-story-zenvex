import React, { useState } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { 
  Wrench, 
  Clock, 
  MapPin, 
  Calendar, 
  Flame, 
  User, 
  ChevronLeft, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation, 
  Play, 
  XCircle, 
  FileText,
  AlertCircle,
  Camera,
  History
} from 'lucide-react';
import StatusStepper from '@/Components/StatusStepper';
import QuoteReviewCard from '@/Components/QuoteReviewCard';
import SendQuoteModal from '@/Components/SendQuoteModal';
import ReviewPrompt from '@/Components/ReviewPrompt';

export default function Show({ 
  serviceRequest, 
  activeQuote = null, 
  statusLogs = [], 
  currentUser, 
  isCustomer, 
  isProvider 
}) {
  const { flash = {} } = usePage().props;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSendQuoteModal, setShowSendQuoteModal] = useState(false);

  const customer = serviceRequest?.customer || {};
  const provider = serviceRequest?.provider?.user || {};
  const category = serviceRequest?.category || {};

  const { data: cancelData, setData: setCancelData, post: postStatus, processing, errors } = useForm({
    status: '',
    reason: '',
  });

  const handleAdvanceStatus = (nextStatus) => {
    if (confirm(`আপনি কি কাজের স্ট্যাটাস '${nextStatus}' এ আপডেট করতে চান?`)) {
      postStatus(route('service-requests.update-status', serviceRequest.id), {
        preserveScroll: true,
        data: { status: nextStatus },
      });
    }
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    postStatus(route('service-requests.update-status', serviceRequest.id), {
      preserveScroll: true,
      onSuccess: () => setShowCancelModal(false),
    });
  };

  return (
    <>
      <Head title={`সার্ভিস অর্ডার #${serviceRequest.id} — Mistri Call`} />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-28">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-[#37474F] text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={route('providers.index')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="text-base font-bold flex items-center gap-2">
                  সার্ভিস রিকোয়েস্ট #{serviceRequest.id}
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white/15 text-[#FFC300]">
                    {category.name}
                  </span>
                </h1>
                <p className="text-xs text-white/70">কাজের স্ট্যাটাস ও লাইফসাইকেল ট্র্যাকিং</p>
              </div>
            </div>

            {/* Chat Link if Accepted or Later */}
            {(serviceRequest.status === 'accepted' || serviceRequest.status === 'en_route' || serviceRequest.status === 'in_progress') && (
              <Link
                href={route('service-requests.chat', serviceRequest.id)}
                className="py-2 px-3 rounded-xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>চ্যাট খুলুন</span>
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
          {flash.success && (
            <div className="p-4 rounded-2xl bg-[#00B894]/15 border border-[#00B894]/30 text-[#00B894] font-medium flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{flash.success}</span>
            </div>
          )}

          {/* Visual Status Stepper Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#37474F] uppercase tracking-wider">
              কাজের অগ্রগতি (Job Lifecycle Progress)
            </h2>
            <StatusStepper 
              currentStatus={serviceRequest.status} 
              cancellationReason={statusLogs.find(l => l.to_status === 'cancelled')?.reason}
            />
          </div>

          {/* Active Price Quote Component for Customer */}
          {activeQuote && (
            <QuoteReviewCard quote={activeQuote} />
          )}

          {/* Review Prompt for Customer when Job Completed */}
          {isCustomer && serviceRequest.status === 'completed' && !serviceRequest.review && (
            <ReviewPrompt serviceRequestId={serviceRequest.id} />
          )}

          {/* Submitted Review Display Card */}
          {serviceRequest.review && (
            <div className="bg-white rounded-3xl border border-[#00B894]/40 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00B894] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> আপনার দেওয়া রিভিউ ও রেটিং
                </span>
                <span className="text-xs font-bold bg-[#00B894]/15 text-[#00B894] px-2.5 py-0.5 rounded-full">
                  ★ {serviceRequest.review.rating}.0
                </span>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                "{serviceRequest.review.comment || 'কোনো মন্তব্য নেই'}"
              </p>
              <div className="text-[11px] text-slate-500 font-medium">
                প্রাইস ফেয়ারনেস: <span className="font-bold text-[#37474F] uppercase">{serviceRequest.review.price_fairness}</span>
              </div>
            </div>
          )}

          {/* Provider Send Quote Trigger (If Provider viewing pending request) */}
          {isProvider && serviceRequest.status === 'pending' && !activeQuote && (
            <div className="bg-gradient-to-r from-[#37474F] to-[#2c383f] text-white p-6 rounded-3xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#FFC300]">কাস্টমারকে খরচের হিসাব (Price Quote) পাঠান</h3>
                  <p className="text-xs text-white/80">কাজ গ্রহণের আগে আনুমানিক খরচের বিবরণ পাঠান</p>
                </div>
                <button
                  onClick={() => setShowSendQuoteModal(true)}
                  className="py-2.5 px-5 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-extrabold text-xs shadow-md transition cursor-pointer"
                >
                  কোটেশন পাঠান
                </button>
              </div>
            </div>
          )}

          {/* Service Request Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#37474F] text-[#FFC300] font-bold flex items-center justify-center text-lg shadow-2xs">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#37474F]">{category.name} সার্ভিস</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> কাস্টমার: <span className="font-semibold text-slate-700">{customer.name}</span>
                  </p>
                </div>
              </div>

              {/* Urgency Badge */}
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                serviceRequest.urgency === 'emergency_now'
                  ? 'bg-[#FF6F3C]/15 text-[#FF6F3C] border-[#FF6F3C]/30 animate-pulse'
                  : serviceRequest.urgency === 'scheduled'
                  ? 'bg-[#37474F]/10 text-[#37474F] border-[#37474F]/20'
                  : 'bg-[#00B894]/15 text-[#00B894] border-[#00B894]/30'
              }`}>
                {serviceRequest.urgency === 'emergency_now' ? '🔥 ইমার্জেন্সি এখন' : serviceRequest.urgency === 'scheduled' ? '📅 নির্ধারিত শিডিউল' : '⚡ আজকের মধ্যে'}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">কাজের বিবরণ</span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                {serviceRequest.description}
              </p>
            </div>

            {/* Photos Gallery */}
            {serviceRequest.photo_paths && serviceRequest.photo_paths.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-[#37474F]" /> নষ্ট আইটেমের ছবি ({serviceRequest.photo_paths.length} টি)
                </span>
                <div className="flex flex-wrap gap-3">
                  {serviceRequest.photo_paths.map((path, idx) => (
                    <a
                      key={idx}
                      href={`/storage/${path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-20 h-20 rounded-2xl border overflow-hidden shadow-2xs hover:opacity-95 transition"
                    >
                      <img src={`/storage/${path}`} alt="Broken equipment" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Address & Location */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF6F3C]" /> ঠিকানা ও জেলা
              </span>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium">
                <p className="font-bold text-[#37474F]">{serviceRequest.district || 'ঢাকা'}</p>
                <p className="mt-0.5 text-slate-600">{serviceRequest.address_note}</p>
              </div>
            </div>
          </div>

          {/* Transition History Timeline Log Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#37474F] uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-[#FFC300]" /> স্ট্যাটাস হিস্ট্রি লগ (Status Timeline)
            </h3>

            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
              {statusLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">এখনও কোনো স্ট্যাটাস পরিবর্তন হয়নি</p>
              ) : (
                statusLogs.map((log) => (
                  <div key={log.id} className="relative space-y-0.5">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#00B894] ring-4 ring-white"></div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#37474F]">
                        স্ট্যাটাস: <span className="text-[#00B894] font-extrabold">{log.to_status}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      পরিবর্তন করেছেন: {log.changed_by?.name || 'ইউজার'}
                    </p>
                    {log.reason && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 mt-1 italic">
                        নোট: {log.reason}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sticky Provider Status Advancement Action Controls */}
        {isProvider && serviceRequest.status !== 'completed' && serviceRequest.status !== 'cancelled' && serviceRequest.status !== 'declined' && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setCancelData('status', 'cancelled');
                  setShowCancelModal(true);
                }}
                className="py-3 px-4 rounded-2xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>বাতিল করুন</span>
              </button>

              <div className="flex items-center gap-2">
                {serviceRequest.status === 'pending' && (
                  <button
                    onClick={() => handleAdvanceStatus('accepted')}
                    className="py-3 px-6 rounded-2xl bg-[#00B894] hover:bg-[#009678] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>রিকোয়েস্ট গ্রহণ করুন</span>
                  </button>
                )}

                {serviceRequest.status === 'accepted' && (
                  <button
                    onClick={() => handleAdvanceStatus('en_route')}
                    className="py-3 px-6 rounded-2xl bg-[#37474F] hover:bg-[#253137] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Navigation className="w-4 h-4 text-[#FFC300]" />
                    <span>অন রুট (রওনা দিয়েছি)</span>
                  </button>
                )}

                {serviceRequest.status === 'en_route' && (
                  <button
                    onClick={() => handleAdvanceStatus('in_progress')}
                    className="py-3 px-6 rounded-2xl bg-[#37474F] hover:bg-[#253137] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-4 h-4 text-[#FFC300]" />
                    <span>কাজ শুরু করুন (In Progress)</span>
                  </button>
                )}

                {serviceRequest.status === 'in_progress' && (
                  <button
                    onClick={() => handleAdvanceStatus('completed')}
                    className="py-3 px-6 rounded-2xl bg-[#00B894] hover:bg-[#009678] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>কাজ সম্পন্ন করুন (Complete Job)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Reason Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
              <h3 className="text-base font-bold text-[#37474F]">সার্ভিস রিকোয়েস্ট বাতিল করুন</h3>
              <p className="text-xs text-slate-500">বাতিল করার নির্দিষ্ট কারণ লিখুন:</p>

              <form onSubmit={handleCancelSubmit} className="space-y-4">
                <textarea
                  rows={3}
                  required
                  value={cancelData.reason}
                  onChange={(e) => setCancelData('reason', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#37474F] outline-none"
                  placeholder="যেমন: সময়ে উপস্থিত হওয়া সম্ভব নয় / যন্ত্রাংশের অভাব..."
                />
                {errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    ফিরে যান
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    কনফার্ম বাতিল করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for sending quote */}
        {showSendQuoteModal && (
          <SendQuoteModal 
            serviceRequest={serviceRequest} 
            onClose={() => setShowSendQuoteModal(false)} 
          />
        )}
      </div>
    </>
  );
}
