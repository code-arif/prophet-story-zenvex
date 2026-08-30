import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, DollarSign, Send, Wrench, Calculator } from 'lucide-react';

export default function SendQuoteModal({ serviceRequest, onClose, onSuccess }) {
  if (!serviceRequest) return null;

  const defaultVisit = serviceRequest.provider?.visit_charge || 150;

  const { data, setData, post, processing, errors } = useForm({
    service_request_id: serviceRequest.id,
    visit_charge: defaultVisit,
    labor_charge: 300,
    materials_charge: 0,
    estimated_total: Number(defaultVisit) + 300,
    breakdown_note: '',
  });

  useEffect(() => {
    const total = Number(data.visit_charge || 0) + Number(data.labor_charge || 0) + Number(data.materials_charge || 0);
    setData('estimated_total', total);
  }, [data.visit_charge, data.labor_charge, data.materials_charge]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('service-quotes.store'), {
      preserveScroll: true,
      onSuccess: () => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#FFC300]" />
            <h3 className="text-base font-bold text-[#37474F]">খরচের আনুমানিক কোটেশন পাঠান</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ভিজিট ফি (৳)</label>
              <input
                type="number"
                min="0"
                value={data.visit_charge}
                onChange={(e) => setData('visit_charge', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#37474F] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">মজুরি/Labor (৳)</label>
              <input
                type="number"
                min="0"
                value={data.labor_charge}
                onChange={(e) => setData('labor_charge', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#37474F] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">মালামাল/Parts (৳)</label>
              <input
                type="number"
                min="0"
                value={data.materials_charge}
                onChange={(e) => setData('materials_charge', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#37474F] outline-none"
              />
            </div>
          </div>

          {/* Calculated Total Display */}
          <div className="bg-[#37474F] text-white p-3.5 rounded-2xl flex items-center justify-between">
            <span className="font-bold text-[#FFC300]">মোট আনুমানিক হিসাব:</span>
            <span className="text-lg font-black text-[#FFC300]">৳{data.estimated_total}</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">খরচের নোট / বিস্তারিত বিবরণ</label>
            <textarea
              rows={3}
              value={data.breakdown_note}
              onChange={(e) => setData('breakdown_note', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#37474F] outline-none"
              placeholder="যেমন: কাজ পরিদর্শনের পর মালামালের প্রকৃত খরচের হিসাব চূড়ান্ত করা হবে..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={processing}
              className="flex-1 py-3 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-black shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{processing ? 'পাঠানো হচ্ছে...' : 'কোটেশন সাবমিট'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
