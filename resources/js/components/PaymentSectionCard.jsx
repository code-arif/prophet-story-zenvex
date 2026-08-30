import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { DollarSign, CheckCircle2, Phone, CreditCard, ShieldCheck, AlertCircle, Send, Wallet } from 'lucide-react';

export default function PaymentSectionCard({ serviceRequest, payment = null, isCustomer = false, isProvider = false }) {
  if (!serviceRequest || serviceRequest.status !== 'completed') return null;

  const defaultAmount = serviceRequest.activeQuote 
    ? serviceRequest.activeQuote.estimated_total 
    : (serviceRequest.provider?.visit_charge || 150);

  const providerPhone = serviceRequest.provider?.user?.phone || '01700000000';

  const { data, setData, post, processing, errors } = useForm({
    service_request_id: serviceRequest.id,
    amount: payment?.amount || defaultAmount,
    method: payment?.method || 'cash',
    transaction_id: payment?.transaction_id || '',
  });

  const handleSavePaymentMethod = (e) => {
    e.preventDefault();
    post(route('service-payments.store'), {
      preserveScroll: true,
    });
  };

  const handleConfirmPayment = () => {
    if (!payment) return;
    if (confirm('আপনি কি এই কাজের পেমেন্ট কনফার্ম করতে চান?')) {
      router.post(route('service-payments.confirm', payment.id), {}, {
        preserveScroll: true,
      });
    }
  };

  const isConfirmed = payment?.status === 'confirmed';

  return (
    <div className="bg-white rounded-3xl border-2 border-[#00B894] p-6 shadow-md space-y-5 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#37474F] bg-[#00B894]/20 p-1 rounded-lg" />
          <h3 className="font-bold text-sm text-[#37474F]">পেমেন্ট রেকর্ড ও ট্র্যাকিং (Service Payment)</h3>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          isConfirmed
            ? 'bg-[#00B894]/15 text-[#00B894] border-[#00B894]/30'
            : 'bg-amber-500/15 text-amber-700 border-amber-500/30'
        }`}>
          {isConfirmed ? 'পেমেন্ট কনফার্মড (Paid)' : 'পেমেন্ট অপেক্ষমাণ (Pending)'}
        </span>
      </div>

      {isConfirmed ? (
        /* Confirmed Payment Summary View */
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">পরিশোধিত অর্থ:</span>
            <span className="text-lg font-black text-[#00B894]">৳{Number(payment.amount).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span>পেমেন্ট মেথড:</span>
            <span className="font-bold uppercase bg-white px-2 py-0.5 rounded border border-slate-200">
              {payment.method}
            </span>
          </div>

          {payment.transaction_id && (
            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span>ট্রানজেকশন আইডি (TrxID):</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                {payment.transaction_id}
              </span>
            </div>
          )}

          {payment.confirmed_by && (
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              কনফার্ম করেছেন: {payment.confirmed_by?.name || 'ইউজার'} ({new Date(payment.confirmed_at).toLocaleString()})
            </p>
          )}
        </div>
      ) : (
        /* Pending Payment Form / Instructions */
        <form onSubmit={handleSavePaymentMethod} className="space-y-4 text-xs">
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-700">পরিশোধযোগ্য মোট অর্থ:</span>
            <span className="text-xl font-black text-[#37474F]">৳{data.amount}</span>
          </div>

          {/* Payment Method Selector Chips */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">পেমেন্ট মেথড সিলেক্ট করুন</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setData('method', 'cash')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                  data.method === 'cash'
                    ? 'bg-[#37474F] text-[#FFC300] border-[#37474F]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                💵 ক্যাশ (Cash)
              </button>

              <button
                type="button"
                onClick={() => setData('method', 'bkash')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                  data.method === 'bkash'
                    ? 'bg-[#e2136e] text-white border-[#e2136e]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                বিকাশ (bKash)
              </button>

              <button
                type="button"
                onClick={() => setData('method', 'nagad')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                  data.method === 'nagad'
                    ? 'bg-[#f7941d] text-white border-[#f7941d]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                নগদ (Nagad)
              </button>
            </div>
          </div>

          {/* MFS Send Money Prompt Info */}
          {(data.method === 'bkash' || data.method === 'nagad') && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-slate-700">
              <p className="font-bold flex items-center gap-1 text-[#37474F]">
                <Phone className="w-4 h-4 text-[#00B894]" /> মিস্ত্রির {data.method === 'bkash' ? 'বিকাশ' : 'নগদ'} পার্সোনাল নম্বর:
                <span className="font-black text-[#37474F] bg-white px-2 py-0.5 rounded border border-slate-200">{providerPhone}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                উপরের নম্বরে ৳{data.amount} সেন্ড মানি (Send Money) করে ট্রানজেকশন আইডি টি নিচে লিখুন:
              </p>

              <div>
                <input
                  type="text"
                  value={data.transaction_id}
                  onChange={(e) => setData('transaction_id', e.target.value)}
                  placeholder="যেমন: 9J37X8Y2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono uppercase text-xs focus:ring-2 focus:ring-[#37474F] outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit / Confirm buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="py-3 px-5 rounded-2xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              মেথড পরিবর্তন সেভ
            </button>

            {payment ? (
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="flex-1 py-3 px-5 rounded-2xl bg-[#00B894] hover:bg-[#009678] text-white font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>পেমেন্ট প্রাপ্তি/পরিশোধ কনফার্ম করুন</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={processing}
                className="flex-1 py-3 px-5 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-black shadow-md transition cursor-pointer"
              >
                পেমেন্ট সেভ করুন
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
