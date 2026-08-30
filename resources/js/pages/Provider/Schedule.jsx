import React, { useState } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle, 
  ShieldCheck,
  Zap,
  CalendarX
} from 'lucide-react';

const DAY_LABELS = {
  saturday: 'শনিবার (Saturday)',
  sunday: 'রবিবার (Sunday)',
  monday: 'সোমবার (Monday)',
  tuesday: 'মঙ্গলবার (Tuesday)',
  wednesday: 'বুধবার (Wednesday)',
  thursday: 'বৃহস্পতিবার (Thursday)',
  friday: 'শুক্রবার (Friday)',
};

export default function Schedule({ provider, weeklySchedules = {}, blockedDates = [] }) {
  const { flash = {} } = usePage().props;

  // Initialize weekly schedules array
  const [schedules, setSchedules] = useState(() => {
    return Object.keys(DAY_LABELS).map((dayKey) => {
      const existing = weeklySchedules[dayKey] || {};
      return {
        day_of_week: dayKey,
        is_available: existing.is_available !== undefined ? existing.is_available : true,
        start_time: existing.start_time || '08:00',
        end_time: existing.end_time || '20:00',
      };
    });
  });

  const { post: postWeekly, processing: processingWeekly } = useForm();
  const { data: exceptionData, setData: setExceptionData, post: postException, processing: processingException, reset: resetException } = useForm({
    specific_date: '',
    is_available: false,
  });

  const handleWeeklyToggle = (index) => {
    const updated = [...schedules];
    updated[index].is_available = !updated[index].is_available;
    setSchedules(updated);
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleWeeklySubmit = (e) => {
    e.preventDefault();
    postWeekly(route('provider.schedule.weekly'), {
      data: { schedules },
      preserveScroll: true,
    });
  };

  const handleAddExceptionDate = (e) => {
    e.preventDefault();
    if (!exceptionData.specific_date) return;

    postException(route('provider.schedule.exception'), {
      preserveScroll: true,
      onSuccess: () => resetException('specific_date'),
    });
  };

  const handleUnblockDate = (dateStr) => {
    if (confirm('আপনি কি এই ছুটির তারিখটি ব্লক লিস্ট থেকে সরাতে চান?')) {
      postException(route('provider.schedule.exception'), {
        preserveScroll: true,
        data: {
          specific_date: dateStr,
          is_available: true,
        },
      });
    }
  };

  return (
    <>
      <Head title="ওয়ার্কিং শিডিউল ও ছুটি ক্যালেন্ডার — Mistri Call" />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-24">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-[#37474F] text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={route('providers.index')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold">ওয়ার্কিং শিডিউল ও ছুটি ক্যালেন্ডার</h1>
                <p className="text-xs text-white/70">আপনার সাপ্তাহিক কাজের সময় ও ছুটির দিন ঠিক করুন</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
          {flash.success && (
            <div className="p-4 rounded-2xl bg-[#00B894]/15 border border-[#00B894]/30 text-[#00B894] font-medium flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{flash.success}</span>
            </div>
          )}

          {/* Section 1: Weekly Recurring Schedule */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FFC300]" /> সাপ্তাহিক কাজের শিডিউল (Weekly Schedule)
                </h2>
                <p className="text-xs text-slate-500">প্রতি সপ্তাহের নির্দিষ্ট দিনগুলোর কর্মঘণ্টা সেট করুন</p>
              </div>

              <button
                type="button"
                onClick={handleWeeklySubmit}
                disabled={processingWeekly}
                className="py-2.5 px-5 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>সেভ শিডিউল</span>
              </button>
            </div>

            <div className="space-y-3">
              {schedules.map((item, idx) => (
                <div
                  key={item.day_of_week}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.is_available
                      ? 'bg-white border-slate-200 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <button
                      type="button"
                      onClick={() => handleWeeklyToggle(idx)}
                      className={`w-12 h-6 rounded-full transition relative p-0.5 cursor-pointer ${
                        item.is_available ? 'bg-[#00B894]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          item.is_available ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <span className="text-xs font-bold text-[#37474F]">
                      {DAY_LABELS[item.day_of_week]}
                    </span>
                  </div>

                  {item.is_available ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">সময়:</span>
                      <input
                        type="time"
                        value={item.start_time}
                        onChange={(e) => handleTimeChange(idx, 'start_time', e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#37474F] focus:ring-2 focus:ring-[#37474F] outline-none bg-slate-50"
                      />
                      <span className="text-slate-400">থেকে</span>
                      <input
                        type="time"
                        value={item.end_time}
                        onChange={(e) => handleTimeChange(idx, 'end_time', e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#37474F] focus:ring-2 focus:ring-[#37474F] outline-none bg-slate-50"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 italic">সার্ভিস বন্ধ (Off Day)</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Exception Date Blocker (Holidays) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <CalendarX className="w-5 h-5 text-[#FF6F3C]" /> নির্দিষ্ট ছুটির দিন ব্লক করুন (Exception Dates)
              </h2>
              <p className="text-xs text-slate-500">বিশেষ ছুটির দিনে কাজের অর্ডার বন্ধ রাখার জন্য তারিখ যোগ করুন</p>
            </div>

            {/* Date Input Form */}
            <form onSubmit={handleAddExceptionDate} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={exceptionData.specific_date}
                onChange={(e) => setExceptionData('specific_date', e.target.value)}
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-[#37474F] outline-none bg-slate-50"
              />
              <button
                type="submit"
                disabled={processingException || !exceptionData.specific_date}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-[#FF6F3C] hover:bg-[#e05826] text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ছুটি যোগ করুন</span>
              </button>
            </form>

            {/* List of Blocked Exception Dates */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                ব্লক করা ছুটির তালিকা
              </span>

              {blockedDates.length === 0 ? (
                <p className="text-xs text-slate-400 italic">কোনো ছুটির তারিখ ব্লক করা নেই</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {blockedDates.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-2xl bg-[#FF6F3C]/10 border border-[#FF6F3C]/30 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FF6F3C]" />
                        <span className="font-bold text-slate-800">
                          {new Date(b.specific_date).toLocaleDateString([], { dateStyle: 'medium' })}
                        </span>
                      </div>

                      <button
                        onClick={() => handleUnblockDate(b.specific_date)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-white cursor-pointer"
                        title="ছুটি সরাতে আনব্লক করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
