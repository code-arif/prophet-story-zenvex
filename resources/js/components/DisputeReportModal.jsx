import React from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, X, Send, ShieldAlert, UserX, AlertCircle, DollarSign, HelpCircle } from 'lucide-react';

const REASON_OPTIONS = [
  { key: 'no_show', label: 'উপস্থিত হয়নি (No-Show)', icon: UserX, description: 'নির্ধারিত সময়ে মিস্ত্রি বা কাস্টমার উপস্থিত হননি' },
  { key: 'poor_quality', label: 'নিম্নমানের কাজ (Poor Quality)', icon: AlertTriangle, description: 'কাজের মান সন্তোষজনক নয় বা যন্ত্রাংশ ক্ষতিগ্রস্ত হয়েছে' },
  { key: 'price_disagreement', label: 'মূল্য সংক্রান্ত মতবিরোধ (Price Disagreement)', icon: DollarSign, description: 'পূর্বে নির্ধারিত ভাড়ার চেয়ে অতিরিক্ত দাবি করা হচ্ছে' },
  { key: 'other', label: 'অন্যান্য সমস্যা (Other Issue)', icon: HelpCircle, description: 'অন্য যেকোনো ধরনের অপ্রীতিকর ঘটনা বা অভিযোগ' },
];

export default function DisputeReportModal({ serviceRequestId, onClose }) {
  const { data, setData, post, processing, errors } = useForm({
    service_request_id: serviceRequestId,
    reason: 'no_show',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('service-disputes.store'), {
      preserveScroll: true,
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 font-bold flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#37474F]">সমস্যা রিপোর্ট করুন (Report a Problem)</h3>
            <p className="text-xs text-slate-500">কাজ চলাকালীন বা পরবর্তী অভিযোগ রিপোর্ট করুন</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700">অভিযোগের কারণ সিলেক্ট করুন</label>
            <div className="space-y-2">
              {REASON_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = data.reason === opt.key;
                return (
                  <label
                    key={opt.key}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-red-50 border-red-300 ring-2 ring-red-400/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={opt.key}
                      checked={isSelected}
                      onChange={(e) => setData('reason', e.target.value)}
                      className="mt-0.5 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-red-500" />
                        <span>{opt.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{opt.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.reason && <p className="text-red-500 font-medium">{errors.reason}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">সমস্যার বিস্তারিত বিবরণ</label>
            <textarea
              rows="3"
              required
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder="কি কি সমস্যা হয়েছে তা সংক্ষেপে বিস্তারিত লিখুন (সর্বনিম্ন ১০ অক্ষর)..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#37474F] outline-none bg-slate-50"
            />
            {errors.description && <p className="text-red-500 font-medium">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={processing || !data.description}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>রিপোর্ট জমা দিন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
