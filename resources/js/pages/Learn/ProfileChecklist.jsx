import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Sparkles, Settings, ArrowRight } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 09 — Profile & Portfolio Checklist · প্রোফাইল চেকলিস্ট
 * Grouped checklist with filters, dynamic DB toggling, and AI Review CTA.
 */
export default function ProfileChecklist({ items = [] }) {
  const { t } = useI18n();

  // Default fallback data if empty seed
  const defaultItems = [
    {
      id: 1,
      group: 'শিরোনাম ও পরিচিতি',
      title: 'শিরোনামে কাজের ধরন আর ফল দুটোই আছে',
      description: null,
      done: true,
    },
    {
      id: 2,
      group: 'শিরোনাম ও পরিচিতি',
      title: 'পরিচিতির প্রথম দুই লাইনে ক্লায়েন্টের সমস্যা আছে',
      description: null,
      done: false,
    },
    {
      id: 3,
      group: 'পোর্টফোলিওর নমুনা',
      title: 'অন্তত ৩টি নমুনায় আগের-পরের ফল দেখানো আছে',
      description: 'শুধু ছবি নয় — কী সমস্যা ছিল আর কী হলো, দুই লাইনে লিখুন',
      done: false,
    },
    {
      id: 4,
      group: 'বিশ্বাসযোগ্যতার চিহ্ন',
      title: 'প্রতিটি নমুনার সাথে আপনার নিজের ভূমিকা লেখা আছে',
      description: null,
      done: true,
    },
    {
      id: 5,
      group: 'প্রোফাইল ও ছবি',
      title: 'পরিষ্কার ও পেশাদার প্রোফাইল ছবিযুক্ত করা আছে',
      description: null,
      done: true,
    },
    {
      id: 6,
      group: 'দক্ষতা ও ট্যাগ',
      title: '৫-১০টি প্রাসঙ্গিক দক্ষতা ট্যাগ সংযুক্ত করা হয়েছে',
      description: null,
      done: true,
    },
    {
      id: 7,
      group: 'হার ও উপলব্ধতা',
      title: 'বাজারের সাথে সামঞ্জস্যপূর্ণ ঘণ্টা-হার নির্ধারণ করা আছে',
      description: null,
      done: true,
    },
    {
      id: 8,
      group: 'হার ও উপলব্ধতা',
      title: 'সাপ্তাহিক কাজ করার উপলব্ধতার সময় নির্দিষ্ট করা আছে',
      description: null,
      done: true,
    },
    {
      id: 9,
      group: 'প্রস্তাব ও প্রতিক্রিয়া',
      title: 'কভার লেটার টেমপ্লেট ও ব্যক্তিগত প্রস্তাব কাঠামো প্রস্তুত',
      description: null,
      done: true,
    },
    {
      id: 10,
      group: 'প্রস্তাব ও প্রতিক্রিয়া',
      title: 'ক্লায়েন্ট মেসেজের দ্রুত প্রতিক্রিয়া (২৪ ঘণ্টার মধ্যে) নিশ্চিত করা',
      description: null,
      done: false,
    },
    {
      id: 11,
      group: 'অতিরিক্ত',
      title: '৬০-৯০ সেকেন্ডের সংক্ষিপ্ত পরিচয় ভিডিও যোগ করা',
      description: null,
      done: false,
    },
    {
      id: 12,
      group: 'অতিরিক্ত',
      title: 'ব্যাংক তথ্য ও আইডেন্টিটি ভেরিফিকেশন সম্পন্ন',
      description: null,
      done: false,
    },
  ];

  // Local state initialized from Inertia props
  const [itemList, setItemList] = useState(
    items.length > 0
      ? items.map((i) => ({
          id: i.id,
          item_id: i.item_id,
          group: i.group || 'সাধারণ',
          title: i.title,
          description: i.description,
          doneBool: Boolean(i.done),
        }))
      : defaultItems.map((i) => ({ ...i, doneBool: i.done }))
  );

  // Active Filter: 'all', 'pending', 'done'
  const [filter, setFilter] = useState('all');

  const handleToggle = (item) => {
    // Optimistic UI update
    setItemList((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, doneBool: !x.doneBool } : x))
    );

    // Persist to backend DB
    router.post(
      '/learn/checklist/toggle',
      { id: item.id, item_id: item.item_id },
      { preserveScroll: true }
    );
  };

  // Calculations
  const totalCount = itemList.length;
  const doneCount = itemList.filter((i) => i.doneBool).length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Filtered Items
  const displayedItems = itemList.filter((item) => {
    if (filter === 'pending') return !item.doneBool;
    if (filter === 'done') return item.doneBool;
    return true; // 'all'
  });

  // Group displayed items by group name
  const groupsMap = displayedItems.reduce((acc, item) => {
    const grp = item.group || 'সাধারণ চেকলিস্ট';
    if (!acc[grp]) acc[grp] = [];
    acc[grp].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-5 font-bn max-w-2xl mx-auto pb-20">
      <Head title="প্রোফাইল ও পোর্টফোলিও চেকলিস্ট — ইজি রাইজ" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            প্রোফাইল ও পোর্টফোলিও চেকলিস্ট
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            ক্লায়েন্ট নিয়োগের সিদ্ধান্ত নেওয়ার আগে যা দেখেন
          </p>
        </div>
      </div>

      {/* Progress Header Card */}
      <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-[28px] font-black text-ink leading-none">
            {toBnDigits(doneCount)} / {toBnDigits(totalCount)}
          </span>
          <span className="text-[13px] font-medium text-slate-500">
            ক্লায়েন্ট নিয়োগের আগে এগুলোই দেখেন
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200/50">
          <div
            className="bg-brand h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-[13.5px] font-bold transition-all active:scale-95 shrink-0 ${
            filter === 'all'
              ? 'bg-brand text-white shadow-md shadow-brand/20'
              : 'glass text-slate-700 hover:bg-slate-50'
          }`}
        >
          সব
        </button>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-full text-[13.5px] font-bold transition-all active:scale-95 shrink-0 ${
            filter === 'pending'
              ? 'bg-brand text-white shadow-md shadow-brand/20'
              : 'glass text-slate-700 hover:bg-slate-50'
          }`}
        >
          বাকি আছে
        </button>
        <button
          type="button"
          onClick={() => setFilter('done')}
          className={`px-4 py-2 rounded-full text-[13.5px] font-bold transition-all active:scale-95 shrink-0 ${
            filter === 'done'
              ? 'bg-brand text-white shadow-md shadow-brand/20'
              : 'glass text-slate-700 hover:bg-slate-50'
          }`}
        >
          হয়েছে
        </button>
      </div>

      {/* Checklist Groups */}
      <div className="space-y-5">
        {Object.keys(groupsMap).length === 0 ? (
          <div className="glass p-8 text-center rounded-2xl border border-slate-100 text-muted">
            কোনো আইটেম পাওয়া যায়নি।
          </div>
        ) : (
          Object.entries(groupsMap).map(([groupTitle, groupItems]) => (
            <div key={groupTitle} className="space-y-2">
              <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider px-2">
                {groupTitle}
              </h2>

              <div className="glass rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {groupItems.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => handleToggle(item)}
                    className="flex items-start gap-3.5 p-4 cursor-pointer hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Check Circle */}
                    <div className="mt-0.5 shrink-0">
                      {item.doneBool ? (
                        <div className="size-6 rounded-full bg-emerald-100 border border-emerald-600 flex items-center justify-center text-emerald-600">
                          <Check className="size-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="size-6 rounded-full border-2 border-slate-300 group-hover:border-brand transition-colors" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <p
                        className={`text-[14.5px] font-semibold leading-snug transition-colors ${
                          item.doneBool
                            ? 'text-slate-400 line-through decoration-slate-300'
                            : 'text-ink'
                        }`}
                      >
                        {item.title}
                      </p>

                      {item.description && (
                        <p className="text-[12.5px] text-slate-600 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/50 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Call to Action Card */}
      <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden space-y-4 bg-gradient-to-br from-violet-50/40 via-white to-purple-50/30">
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-violet-600" />

        <div className="flex items-center gap-3 pl-2">
          <div className="size-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
            <Sparkles className="size-5" />
          </div>
          <span className="text-[15px] font-bold text-ink">
            নিজের প্রোফাইল লিখে রিভিউ করাতে চান?
          </span>
        </div>

        <Link
          href="/learn/profile-review"
          className="w-full py-3 rounded-xl border border-violet-600 text-violet-600 font-bold text-[14px] bg-white hover:bg-violet-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
        >
          প্রোফাইল রিভিউ
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
