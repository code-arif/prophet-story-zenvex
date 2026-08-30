import React from 'react';
import { router } from '@inertiajs/react';
import { CheckCircle2, XCircle, DollarSign, Wrench, ShieldCheck, FileText } from 'lucide-react';

export default function QuoteReviewCard({ quote, onRequestUpdated }) {
  if (!quote) return null;

  const handleAccept = () => {
    if (confirm('আপনি কি এই কাজের খরচের হিসেবটি গ্রহণ করতে চান?')) {
      router.post(route('service-quotes.accept', quote.id), {}, {
        preserveScroll: true,
        onSuccess: () => onRequestUpdated && onRequestUpdated(),
      });
    }
  };

  const handleReject = () => {
    if (confirm('আপনি কি এই প্রাইস কোটেশনটি প্রত্যাখ্যান করতে চান?')) {
      router.post(route('service-quotes.reject', quote.id), {}, {
        preserveScroll: true,
        onSuccess: () => onRequestUpdated && onRequestUpdated(),
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#FFC300] p-6 shadow-md space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#37474F] bg-[#FFC300] p-1 rounded-lg" />
          <h3 className="font-bold text-sm text-[#37474F]">মিস্ত্রির আনুমানিক খরচের কোটেশন (Price Quote)</h3>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          quote.status === 'accepted'
            ? 'bg-[#00B894]/15 text-[#00B894] border-[#00B894]/30'
            : quote.status === 'rejected'
            ? 'bg-red-500/15 text-red-600 border-red-500/30'
            : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
        }`}>
          {quote.status === 'accepted' ? 'গৃহীত (Accepted)' : quote.status === 'rejected' ? 'প্রত্যাখ্যাত (Rejected)' : 'রিভিউয়ের অপেক্ষায়'}
        </span>
      </div>

      {/* Fee Breakdown grid */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block font-medium">ভিজিট ফি</span>
          <span className="font-bold text-slate-800">৳{quote.visit_charge ? Number(quote.visit_charge) : 0}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">মজুরি (Labor)</span>
          <span className="font-bold text-slate-800">৳{quote.labor_charge ? Number(quote.labor_charge) : 0}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">মালামাল (Parts)</span>
          <span className="font-bold text-slate-800">৳{quote.materials_charge ? Number(quote.materials_charge) : 0}</span>
        </div>
      </div>

      {/* Estimated Total */}
      <div className="flex items-center justify-between bg-[#37474F] text-white p-4 rounded-2xl">
        <span className="text-xs font-bold text-[#FFC300]">মোট আনুমানিক খরচ (Estimated Total):</span>
        <span className="text-xl font-black text-[#FFC300]">৳{Number(quote.estimated_total).toLocaleString()}</span>
      </div>

      {/* Breakdown Note */}
      {quote.breakdown_note && (
        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
          <span className="font-bold text-[#37474F] block mb-0.5">নোট / বিস্তারিত:</span>
          {quote.breakdown_note}
        </div>
      )}

      {/* Action Buttons for Customer (Pending State) */}
      {quote.status === 'sent' && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleReject}
            className="flex-1 py-3 rounded-2xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>প্রত্যাখ্যান করুন</span>
          </button>

          <button
            onClick={handleAccept}
            className="flex-1 py-3 rounded-2xl bg-[#00B894] hover:bg-[#009678] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>কোটেশন গ্রহণ করুন</span>
          </button>
        </div>
      )}
    </div>
  );
}
