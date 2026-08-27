import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  PlusCircle,
  Calendar,
  Save,
  Plus,
  X,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 28 — Document Readiness · কাগজপত্র প্রস্তুতি
 * Dynamic Ring Gauges + Segmented Purpose Selector + Expiring Warning Banner +
 * Interactive Document List + Add New Document Modal/Form + Mandatory Info Card.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function DocReadiness({ purposes = [], documents = [] }) {
  const { t } = useI18n();

  const PURPOSE_LIST = [
    { key: 'আইডি কার্ড', label: 'ফ্রিল্যান্সার আইডি কার্ড' },
    { key: 'কর রিটার্ন', label: 'কর রিটার্ন' },
    { key: 'ব্যাংক', label: 'ব্যাংক অ্যাকাউন্ট' },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [editingForm, setEditingForm] = useState({});

  // Modal / Form state for adding new document
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocForm, setNewDocForm] = useState({
    name: '',
    purpose: PURPOSE_LIST[0].label,
    status: 'ready',
    expiry_date: '',
    note: '',
  });

  // Categorize documents into 3 tabs
  const matchCategory = (doc) => {
    const p = (doc.purpose || '') + ' ' + (doc.name || '');
    if (p.includes('আইডি') || p.includes('ID') || p.includes('পাসপোর্ট') || p.includes('লাইসেন্স') || p.includes('ছবি')) {
      return 0; // ID Card
    }
    if (p.includes('কর') || p.includes('ট্যাক্স') || p.includes('TIN') || p.includes('tax')) {
      return 1; // Tax Return
    }
    return 2; // Bank Account
  };

  const categorizedDocs = [
    documents.filter((d) => matchCategory(d) === 0),
    documents.filter((d) => matchCategory(d) === 1),
    documents.filter((d) => matchCategory(d) === 2),
  ];

  // Dynamic Gauge percentage calculation
  const getGaugePct = (tabIndex) => {
    const list = categorizedDocs[tabIndex] || [];
    if (list.length === 0) return 0;
    const ready = list.filter((d) => d.status === 'ready' || d.status === 'valid').length;
    return Math.round((ready / list.length) * 100);
  };

  // Documents for active tab
  const currentDocs = categorizedDocs[activeTab] || [];

  // Count expiring/expired documents across all categories
  const expiringCount = documents.filter((d) => d.status === 'expired').length;

  const handleToggleExpand = (doc) => {
    if (expandedId === doc.id) {
      setExpandedId(null);
    } else {
      setExpandedId(doc.id);
      setEditingForm({
        id: doc.id,
        name: doc.name,
        purpose: doc.purpose,
        status: doc.status || 'ready',
        expiry_date: doc.expiry_date || '',
        note: doc.note || '',
      });
    }
  };

  const handleSaveDocument = (doc) => {
    const form = editingForm[doc.id] || {
      id: doc.id,
      name: doc.name,
      purpose: doc.purpose,
      status: doc.status || 'ready',
      expiry_date: doc.expiry_date || '',
      note: doc.note || '',
    };

    router.post('/money/documents/update', form, {
      preserveScroll: true,
      onSuccess: () => {
        setExpandedId(null);
      },
    });
  };

  const handleCreateDocument = (e) => {
    e.preventDefault();
    if (!newDocForm.name.trim()) return;

    router.post('/money/documents/update', newDocForm, {
      preserveScroll: true,
      onSuccess: () => {
        setShowAddModal(false);
        setNewDocForm({
          name: '',
          purpose: PURPOSE_LIST[activeTab].label,
          status: 'ready',
          expiry_date: '',
          note: '',
        });
      },
    });
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="কাগজপত্র প্রস্তুতি — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            কাগজপত্র প্রস্তুতি
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            ব্যাংক, ট্যাক্স ও ভিসার প্রয়োজনীয় কাগজপত্রের প্রস্তুতি ট্র্যাকার
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewDocForm((prev) => ({ ...prev, purpose: PURPOSE_LIST[activeTab].label }));
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-[13.5px] flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>নতুন কাগজ যোগ করুন</span>
        </button>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Readiness Gauges, Segmented Selector, Expiring Banner, Doc List (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Readiness Gauges Card (3 Ring Gauges) */}
          <div className="glass p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-3 gap-3 items-center text-center">
              {PURPOSE_LIST.map((item, idx) => {
                const pct = getGaugePct(idx);
                const isFull = pct === 100;
                const strokeDasharray = `${pct}, 100`;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div className="relative size-16 group-hover:scale-105 transition-transform">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className={isFull ? 'text-emerald-600' : 'text-brand'}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={strokeDasharray}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-[13px] font-extrabold ${
                            isFull ? 'text-emerald-700' : 'text-brand'
                          }`}
                        >
                          {toBnDigits(pct)}%
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[12.5px] font-bold leading-tight ${
                        activeTab === idx ? 'text-brand font-black' : 'text-slate-700'
                      }`}
                    >
                      {item.key}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Segmented Purpose Selector */}
          <div className="flex bg-slate-200/60 p-1 rounded-2xl backdrop-blur-sm">
            {PURPOSE_LIST.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-2.5 text-[13.5px] font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'bg-white text-brand shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-ink'
                }`}
              >
                {item.key}
              </button>
            ))}
          </div>

          {/* Expiring Warning Banner (If Any Docs Expiring) */}
          {expiringCount > 0 && (
            <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-950 shadow-2xs">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-amber-600 shrink-0" />
                <span className="text-[14px] font-extrabold">
                  {toBnDigits(expiringCount)}টি কাগজের মেয়াদ শেষ হতে চলেছে বা শেষ হয়েছে
                </span>
              </div>
              <ChevronRight className="size-5 text-amber-700 shrink-0" />
            </div>
          )}

          {/* Document Rows Stack */}
          <div className="space-y-3">
            {currentDocs.length === 0 ? (
              <div className="glass p-8 rounded-3xl border border-slate-100 shadow-2xs text-center space-y-3">
                <p className="text-[14.5px] font-extrabold text-slate-600">
                  এই ক্যাটাগরিতে কোনো কাগজ যুক্ত করা নেই।
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNewDocForm((prev) => ({ ...prev, purpose: PURPOSE_LIST[activeTab].label }));
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 rounded-xl border-2 border-brand text-brand hover:bg-brand/5 font-bold text-[13px] inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="size-4 stroke-[2.5]" />
                  <span>কাগজ যুক্ত করুন</span>
                </button>
              </div>
            ) : (
              currentDocs.map((doc) => {
                const isExpanded = expandedId === doc.id;
                const isReady = doc.status === 'ready' || doc.status === 'valid';
                const isExpired = doc.status === 'expired';

                const formData = editingForm[doc.id] || {
                  id: doc.id,
                  name: doc.name,
                  purpose: doc.purpose,
                  status: doc.status || 'valid',
                  expiry_date: doc.expiry_date || '',
                  note: doc.note || '',
                };

                return (
                  <div
                    key={doc.id}
                    className="glass rounded-2xl border border-slate-100 shadow-2xs overflow-hidden transition-all"
                  >
                    {/* Item Header Row */}
                    <div
                      onClick={() => handleToggleExpand(doc)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-700'
                              : isExpired
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isReady ? (
                            <CheckCircle2 className="size-5" />
                          ) : isExpired ? (
                            <Clock className="size-5" />
                          ) : (
                            <PlusCircle className="size-5" />
                          )}
                        </div>

                        <div className="truncate">
                          <h4 className="text-[15px] font-extrabold text-ink leading-tight">
                            {doc.name}
                          </h4>
                          <p className="text-[12px] font-bold text-slate-400 mt-0.5">
                            {doc.note || 'প্রয়োজনীয় নথি'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {isReady && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[12px] font-extrabold">
                            আছে
                          </span>
                        )}

                        {isExpired && (
                          <div className="flex flex-col items-end">
                            <span className="px-3 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[11.5px] font-extrabold">
                              মেয়াদ শেষ হচ্ছে
                            </span>
                            {doc.expiry_date && (
                              <span className="text-[10.5px] font-bold text-amber-700 mt-0.5">
                                {doc.expiry_date}
                              </span>
                            )}
                          </div>
                        )}

                        {!isReady && !isExpired && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[12px] font-extrabold">
                            নেই
                          </span>
                        )}

                        <ChevronDown
                          className={`size-4 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-brand' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Inline Expandable Form */}
                    {isExpanded && (
                      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in duration-200">
                        <div>
                          <label className="text-[12px] font-bold text-slate-600 mb-1.5 block">
                            অবস্থা পরিবর্তন করুন
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingForm((prev) => ({
                                  ...prev,
                                  [doc.id]: { ...formData, status: 'valid' },
                                }))
                              }
                              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                                formData.status === 'valid' || formData.status === 'ready'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              আছে (Ready)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingForm((prev) => ({
                                  ...prev,
                                  [doc.id]: { ...formData, status: 'expired' },
                                }))
                              }
                              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                                formData.status === 'expired'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              মেয়াদ উত্তীর্ণ (Expired)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingForm((prev) => ({
                                  ...prev,
                                  [doc.id]: { ...formData, status: 'missing' },
                                }))
                              }
                              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                                formData.status === 'missing'
                                  ? 'bg-slate-700 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              নেই (Missing)
                            </button>
                          </div>
                        </div>

                        {formData.status === 'expired' && (
                          <div>
                            <label className="text-[12px] font-bold text-slate-600 mb-1 block">
                              মেয়াদ শেষের তারিখ
                            </label>
                            <div className="flex items-center gap-2 p-2 border border-slate-300 rounded-xl bg-white focus-within:border-brand">
                              <Calendar className="size-4 text-slate-400" />
                              <input
                                type="date"
                                value={formData.expiry_date || ''}
                                onChange={(e) =>
                                  setEditingForm((prev) => ({
                                    ...prev,
                                    [doc.id]: { ...formData, expiry_date: e.target.value },
                                  }))
                                }
                                className="bg-transparent border-none p-0 text-[13px] font-bold text-ink focus:ring-0 w-full"
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-[12px] font-bold text-slate-600 mb-1 block">
                            নোট (ঐচ্ছিক)
                          </label>
                          <input
                            type="text"
                            value={formData.note || ''}
                            onChange={(e) =>
                              setEditingForm((prev) => ({
                                ...prev,
                                [doc.id]: { ...formData, note: e.target.value },
                              }))
                            }
                            placeholder="নবায়ন করতে হবে..."
                            className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-[13px] font-bold text-ink focus:border-brand focus:ring-1 focus:ring-brand"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSaveDocument(doc)}
                          className="w-full py-2 rounded-xl bg-brand text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-2xs hover:bg-brand-dark transition-all cursor-pointer mt-1"
                        >
                          <Save className="size-4" />
                          <span>সেভ করুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Mandatory Info Card */}
          <div className="glass rounded-2xl p-3.5 flex gap-3 items-start border border-sky-200/80 bg-sky-50/50">
            <Info className="size-5 text-sky-600 mt-0.5 shrink-0" />
            <p className="text-[12.5px] font-bold text-sky-950 leading-relaxed">
              কোনো কাগজের ছবি বা ফাইল এই অ্যাপে রাখা হয় না — শুধু অবস্থা আর তারিখ সেভ করা হয়
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/money/channels"
            className="w-full h-12 border-2 border-brand text-brand hover:bg-brand/5 font-extrabold text-[14px] rounded-2xl flex items-center justify-center transition-all cursor-pointer block text-center shadow-2xs"
          >
            কোন তালিকা আমার জন্য প্রযোজ্য?
          </Link>

        </div>

        {/* Right Sidebar Column: Safety & Privacy Guidelines (4 cols) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Privacy Note Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-extrabold text-ink flex items-center gap-2">
              <Info className="size-4 text-brand" />
              ব্যক্তিগত তথ্য নিরাপত্তা
            </h3>

            <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium">
              আপনার গুরুত্বপূর্ণ এনআইডি বা ব্যাংক ডকুমেন্টের কোনো স্ক্যান ফাইল আমাদের সার্ভারে সংরক্ষণ করা হয় না। আপনি কেবল নিজের ট্র্যাকিংয়ের সুবিধার্থে মেয়াদ ও অবস্থা আপডেট রাখতে পারবেন।
            </p>
          </div>

        </div>

      </div>

      {/* Add New Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-bn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-[18px] font-black text-ink">নতুন কাগজ যুক্ত করুন</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-ink cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3.5">
              <div>
                <label className="text-[12.5px] font-bold text-slate-700 mb-1 block">
                  কাগজের নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পাসপোর্ট, ট্রেড লাইসেন্স..."
                  value={newDocForm.name}
                  onChange={(e) => setNewDocForm({ ...newDocForm, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-[13.5px] font-bold text-ink focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="text-[12.5px] font-bold text-slate-700 mb-1 block">
                  ক্যাটাগরি
                </label>
                <select
                  value={newDocForm.purpose}
                  onChange={(e) => setNewDocForm({ ...newDocForm, purpose: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-[13.5px] font-bold text-ink focus:border-brand focus:ring-1 focus:ring-brand"
                >
                  {PURPOSE_LIST.map((item, idx) => (
                    <option key={idx} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[12.5px] font-bold text-slate-700 mb-1 block">
                  বর্তমান অবস্থা
                </label>
                <select
                  value={newDocForm.status}
                  onChange={(e) => setNewDocForm({ ...newDocForm, status: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-[13.5px] font-bold text-ink focus:border-brand focus:ring-1 focus:ring-brand"
                >
                  <option value="ready">আছে (Ready)</option>
                  <option value="expired">মেয়াদ শেষ হচ্ছে (Expired)</option>
                  <option value="missing">নেই (Missing)</option>
                </select>
              </div>

              {newDocForm.status === 'expired' && (
                <div>
                  <label className="text-[12.5px] font-bold text-slate-700 mb-1 block">
                    মেয়াদ শেষের তারিখ
                  </label>
                  <input
                    type="date"
                    value={newDocForm.expiry_date}
                    onChange={(e) => setNewDocForm({ ...newDocForm, expiry_date: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-[13.5px] font-bold text-ink focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
              )}

              <div>
                <label className="text-[12.5px] font-bold text-slate-700 mb-1 block">
                  নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মূল + ফটোকপি..."
                  value={newDocForm.note}
                  onChange={(e) => setNewDocForm({ ...newDocForm, note: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-[13.5px] font-bold text-ink focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-[13px] text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand hover:bg-brand-dark font-bold text-[13px] text-white shadow-2xs cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
