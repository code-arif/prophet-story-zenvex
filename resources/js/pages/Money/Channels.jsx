import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Info,
  Landmark,
  Globe,
  Store,
  ChevronRight,
  Clock,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 26 — Remittance Channels · টাকা দেশে আনার চ্যানেল
 * Intro guidance + Expandable channel cards (SWIFT, Online Platforms, Local MFS) + Warning card + Incentive quick links.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function Channels({ channels = [], requirements = [] }) {
  const { t } = useI18n();

  // Accordion Expand/Collapse State (SWIFT open by default)
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [addedDocId, setAddedDocId] = useState(null);

  const defaultChannels = [
    {
      id: 0,
      title: 'সরাসরি ব্যাংক ট্রান্সফার (SWIFT)',
      subtitle: 'উচ্চ নিরাপত্তার আন্তর্জাতিক ট্রান্সফার',
      icon_type: 'bank',
      requirements: ['পাসপোর্ট কপি', 'আয়ের চুক্তিপত্র', 'ব্যাংক তথ্য'],
      duration: '২-৫ কার্যদিবস',
      documents: [
        { name: 'সার্টিফিকেট অফ ইনওয়ার্ড রেমিট্যান্স', note: 'প্রণোদনার জন্য' },
        { name: 'অ্যাডভাইস নোট', note: 'করের জন্য' },
      ],
      limits: {
        min: 'কোনো সীমা নেই',
        max: 'ব্যাংক নীতি অনুযায়ী প্রযোজ্য',
        verifiedDate: '২০২৬',
      },
    },
    {
      id: 1,
      title: 'অনলাইন পেমেন্ট প্ল্যাটফর্ম',
      subtitle: 'পেওনিয়ার, ওয়াইজ ইত্যাদি',
      icon_type: 'globe',
      requirements: ['জাতীয় পরিচয়পত্র / পাসপোর্ট', 'লাইভ ফেস ভেরিফিকেশন', 'ব্যাংক অ্যাকাউন্ট লিঙ্ক'],
      duration: '১-২ কার্যদিবস',
      documents: [
        { name: 'পেওনিয়ার ইনওয়ার্ড স্টেটমেন্ট', note: 'ব্যাংক জমার জন্য' },
        { name: 'ডিজিটাল ট্রানজেকশন রসিদ', note: 'করের রেকর্ডের জন্য' },
      ],
      limits: {
        min: 'USD ৫০',
        max: 'দৈনিক USD ১০,০০০',
        verifiedDate: '২০২৬',
      },
    },
    {
      id: 2,
      title: 'লোকাল গেটওয়ে (MFS)',
      subtitle: 'বিকাশ, নগদ, রকেট (রেমিটেন্স ওয়ালেট)',
      icon_type: 'store',
      requirements: ['জাতীয় পরিচয়পত্র / টিন সার্টিফিকেট', 'বিকাশ/নগদ রেমিটেন্স ওয়ালেট লিঙ্ক'],
      duration: 'তাৎক্ষণিক / ইনস্ট্যান্ট',
      documents: [
        { name: 'এমএফএস ইনওয়ার্ড রসিদ', note: 'ইনস্ট্যান্ট ক্যাশ ইন' },
      ],
      limits: {
        min: '৳ ৫০০',
        max: '৳ ২,৫০,০০০ / দিন',
        verifiedDate: '২০২৬',
      },
    },
  ];

  const channelList = channels && channels.length > 0 ? channels : defaultChannels;

  const handleAddChecklist = (channelTitle, docName) => {
    router.post(
      '/money/channels/add-doc',
      {
        channel_name: channelTitle,
        doc_name: docName,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setAddedDocId(docName);
          setTimeout(() => setAddedDocId(null), 3000);
        },
      }
    );
  };

  const getChannelIcon = (type) => {
    if (type === 'globe') return <Globe className="size-5 text-brand" />;
    if (type === 'store') return <Store className="size-5 text-brand" />;
    return <Landmark className="size-5 text-brand" />;
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="টাকা দেশে আনার চ্যানেল — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            টাকা দেশে আনার চ্যানেল
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            বৈধ ব্যাংক ও রেমিটেন্স চ্যানেলের তালিকা, কাগজপত্র ও সুবিধা
          </p>
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Intro Card, Channel Cards Stack, Warning Card, Footnote (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Intro Guidance Card */}
          <div className="glass p-4 rounded-2xl border border-sky-200/80 shadow-2xs flex items-start gap-3 bg-gradient-to-r from-sky-50/50 to-white">
            <Info className="size-5 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-[14px] leading-snug font-medium text-sky-950">
              বৈধ চ্যানেলে টাকা এলে কাগজ পাওয়া যায় — সেই কাগজেই পরে প্রণোদনা, কর আর ব্যাংকের কাজ হয়
            </p>
          </div>

          {/* Expandable Channels Accordion Stack */}
          <div className="space-y-4">
            {channelList.map((channel, idx) => {
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={channel.id}
                  className="glass rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all"
                >
                  {/* Header Row */}
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between group cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
                        {channel.icon || getChannelIcon(channel.icon_type)}
                      </div>
                      <div>
                        <h3 className="text-[16px] font-extrabold text-ink group-hover:text-brand transition-colors">
                          {channel.title}
                        </h3>
                        <p className="text-[13px] font-medium text-slate-500">
                          {channel.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`size-5 text-slate-400 group-hover:text-ink transition-transform duration-200 ${
                        isExpanded ? 'rotate-90 text-brand' : ''
                      }`}
                    />
                  </button>

                  {/* Expanded Details Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-200 font-bn">
                      
                      {/* Requirements List */}
                      <div>
                        <p className="font-extrabold text-[14px] text-ink mb-2">
                          কী কী লাগে:
                        </p>
                        <ul className="text-[13.5px] text-slate-700 space-y-1.5 list-disc list-inside font-medium">
                          {channel.requirements.map((req, rIdx) => (
                            <li key={rIdx}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Time Duration */}
                      <div className="flex items-center gap-2 text-[13.5px] text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Clock className="size-4 text-brand shrink-0" />
                        <p>
                          <span className="font-extrabold text-ink">সাধারণত কত সময় নেয়:</span>{' '}
                          {channel.duration}
                        </p>
                      </div>

                      {/* Returned Documents */}
                      <div>
                        <p className="font-extrabold text-[14px] text-ink mb-2">
                          কোন কাগজ ফেরত আসে:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {channel.documents.map((doc, dIdx) => (
                            <div
                              key={dIdx}
                              className="bg-blue-50/70 rounded-xl p-3 border border-brand/20 space-y-0.5 flex flex-col justify-between"
                            >
                              <div>
                                <p className="text-[13px] font-extrabold text-brand">
                                  {doc.name}
                                </p>
                                <p className="text-[11.5px] font-bold text-slate-500 mb-1.5">
                                  {doc.note}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddChecklist(channel.title, doc.name)}
                                className="text-[11.5px] font-bold text-brand hover:underline text-left cursor-pointer flex items-center gap-1"
                              >
                                {addedDocId === doc.name ? (
                                  <>
                                    <CheckCircle2 className="size-3 text-emerald-600" />
                                    <span className="text-emerald-700">যুক্ত হয়েছে</span>
                                  </>
                                ) : (
                                  <span>+ তালিকায় যোগ করুন</span>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Limits & Conditions Table */}
                      <div>
                        <p className="font-extrabold text-[14px] text-ink mb-2">
                          সীমা ও শর্ত:
                        </p>
                        <div className="w-full text-[13px] border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100">
                          <div className="grid grid-cols-2 bg-slate-50 p-3">
                            <div className="font-bold text-slate-700">সর্বনিম্ন সীমা</div>
                            <div className="font-extrabold text-ink">{channel.limits.min}</div>
                          </div>
                          <div className="grid grid-cols-2 p-3 items-center">
                            <div>
                              <div className="font-bold text-slate-700">সর্বোচ্চ সীমা</div>
                              <div className="text-[11px] font-bold text-slate-400">
                                সর্বশেষ যাচাই: {channel.limits.verifiedDate}
                              </div>
                            </div>
                            <div>
                              {channel.limits.max.includes('TODO') ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-[11.5px] font-extrabold border border-amber-200">
                                  <Clock className="size-3 text-amber-700" />
                                  TODO — যাচাই বাকি
                                </span>
                              ) : (
                                <span className="font-extrabold text-ink">{channel.limits.max}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleAddChecklist(channel.title, channel.documents[0]?.name || channel.title)}
                          className="flex-1 py-2.5 rounded-xl border-2 border-brand text-brand hover:bg-brand/5 font-bold text-[13.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          {addedDocId ? (
                            <>
                              <CheckCircle2 className="size-4 text-emerald-600" />
                              <span className="text-emerald-700">তালিকায় যুক্ত হয়েছে!</span>
                            </>
                          ) : (
                            <span>প্রস্তুতির তালিকায় যোগ করুন</span>
                          )}
                        </button>
                        
                        <Link
                          href="/money/incentive"
                          className="flex-1 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-[13.5px] flex items-center justify-center transition-all cursor-pointer shadow-2xs text-center"
                        >
                          প্রণোদনার যোগ্যতা দেখুন →
                        </Link>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Warning Section ("অনানুষ্ঠানিক পথে আনলে যা হয় না") */}
          <div className="glass p-5 rounded-3xl border border-amber-200 bg-amber-50/60 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-600" />
              <h3 className="font-black text-[16px] text-amber-950">
                অনানুষ্ঠানিক পথে (হুন্ডি) আনলে যা হয় না
              </h3>
            </div>
            <ul className="text-[13.5px] text-amber-900 space-y-2 list-disc list-inside font-bold pl-2">
              <li>সরকারি ২.৫% প্রণোদনা পাওয়া যায় না</li>
              <li>ব্যাংকের ইনওয়ার্ড রেমিট্যান্স প্রফ সার্টিফিকেট পাওয়া যায় না</li>
              <li>আয়কর রিটার্নে লিগ্যাল আয়ের কোনো প্রমাণ থাকে না</li>
            </ul>
          </div>

          {/* Footnote Notice */}
          <p className="text-center text-[12.5px] font-bold text-slate-400 pt-2">
            নিয়ম বদলায় — কাজের আগে নিজের ব্যাংকে মিলিয়ে নিন
          </p>

        </div>

        {/* Right Sidebar Column: Incentive Calculator Quick CTA & Legal Guidelines (4 cols) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* 2.5% Cash Incentive CTA Card */}
          <div className="glass p-5 rounded-2xl border border-sky-200/80 shadow-sm space-y-3 bg-gradient-to-br from-sky-50/50 to-white">
            <h3 className="text-[15.5px] font-extrabold text-sky-950 flex items-center gap-2">
              <Zap className="size-4 text-sky-600 fill-current" />
              ২.৫% সরকারি প্রণোদনা
            </h3>

            <p className="text-[12.5px] text-sky-900 leading-relaxed font-medium">
              বৈধ ব্যাংকিং বা অনুমোদিত এমএফএস চ্যানেলে রেমিটেন্স আনলে বাংলাদেশ সরকার সরাসরি ২.৫% নগদ প্রণোদনা দেয়।
            </p>

            <Link
              href="/money/incentive"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[13px] flex items-center justify-center gap-1 shadow-xs transition-all block text-center cursor-pointer"
            >
              প্রণোদনা ক্যালকুলেটর খুলুন →
            </Link>
          </div>

          {/* Legal Remittance Checklist Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <FileCheck className="size-4 text-brand" />
              নিরাপদ পেমেন্ট রিসিভ টিপস
            </h3>

            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                ক্লায়েন্ট পেমেন্ট ইনভয়েসে সঠিক সার্ভিস বিবরণ লিখুন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                ইনওয়ার্ড সার্টিফিকেট ব্যাংক থেকে সংগ্রহ করে ড্রাইভে সেভ রাখুন।
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
