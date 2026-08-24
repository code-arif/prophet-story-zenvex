import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  ChevronRight,
  Download,
  Trash2,
  ExternalLink,
  Lock,
  ArrowLeftRight,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { BottomSheet } from '../../components/ui/BottomSheet';

function Toggle({ checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300"
      style={{ background: checked ? '#1d6ff2' : '#e1e2ed' }}
    >
      <span
        className="inline-block h-[22px] w-[22px] rounded-full bg-white shadow transition-transform duration-300"
        style={{
          transform: checked ? 'translateX(22px)' : 'translateX(2px)',
        }}
      />
    </button>
  );
}

function SectionHeader({ children }) {
  return (
    <h3 className="px-4 pt-4 pb-2 text-[12px] font-bold uppercase tracking-wider text-brand font-bn">
      {children}
    </h3>
  );
}

function Row({ children, className = '' }) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${className}`}
    >
      {children}
    </div>
  );
}

function RowDivider() {
  return <div className="h-px bg-black/5 ml-4" />;
}

export default function SettingsIndex() {
  const { t } = useI18n();
  const [showDelete, setShowDelete] = useState(false);
  const [lang, setLang] = useState('bn');
  const [textSize, setTextSize] = useState(2);
  const [toggles, setToggles] = useState({
    deadline: true,
    overdue: true,
    docExpiry: false,
  });

  const toggle = (key) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="সেটিংস — ইজি রাইজ" />

      {/* Group 1: অ্যাকাউন্ট */}
      <div className="glass mb-3.5 overflow-hidden">
        <Link
          href="/profile"
          className="flex items-center gap-4 p-4 transition-colors active:scale-[0.99]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-[16px] font-bold text-white font-bn">
            RH
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-ink font-bn truncate">
              {t('মোঃ রুবেল হোসেন')}
            </p>
            <p className="text-[12px] text-muted font-bn truncate">
              ০১৭•••••৬৭৮
            </p>
          </div>
          <ChevronRight className="size-5 text-muted shrink-0" />
        </Link>
      </div>

      {/* Group 2: কাজের নিয়ম */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('কাজের নিয়ম')}</SectionHeader>
        <Row>
          <span className="text-[15px] text-ink font-bn">
            {t('সাপ্তাহিক ঘণ্টা')}
          </span>
          <div className="flex items-center gap-2 text-muted">
            <span className="text-[13px] font-bn">২৫</span>
            <ChevronRight className="size-5" />
          </div>
        </Row>
        <RowDivider />
        <Row>
          <span className="text-[15px] text-ink font-bn">
            {t('সর্বনিম্ন গ্রহণযোগ্য ঘণ্টা-হার')}
          </span>
          <div className="flex items-center gap-2 text-muted">
            <span className="text-[13px] font-bn">৳ ৮০০</span>
            <ChevronRight className="size-5" />
          </div>
        </Row>
        <RowDivider />
        <Row className="pb-4">
          <span className="text-[15px] text-ink font-bn">
            {t('প্রধান মুদ্রা')}
          </span>
          <div className="flex items-center gap-2 text-muted">
            <span className="text-[13px] font-bn">USD</span>
            <ChevronRight className="size-5" />
          </div>
        </Row>
      </div>

      {/* Group 3: ভাষা ও দেখা */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('ভাষা ও দেখা')}</SectionHeader>
        <Row>
          <span className="text-[15px] text-ink font-bn">{t('ভাষা')}</span>
          <div className="flex items-center gap-1 rounded-full border border-border-rest bg-bg-from px-3 py-1.5">
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`text-[13px] font-bn transition-colors ${
                lang === 'bn' ? 'text-ink font-semibold' : 'text-muted'
              }`}
            >
              বাংলা
            </button>
            <ArrowLeftRight className="size-3.5 text-muted mx-0.5" />
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`text-[13px] font-bn transition-colors ${
                lang === 'en' ? 'text-ink font-semibold' : 'text-muted'
              }`}
            >
              English
            </button>
          </div>
        </Row>
        <div className="px-4 pb-4 pt-1">
          <span className="mb-2 block text-[15px] text-ink font-bn">
            {t('টেক্সট সাইজ')}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-muted font-bn">অ</span>
            <input
              type="range"
              min={1}
              max={3}
              value={textSize}
              onChange={(e) => setTextSize(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-border-rest accent-brand"
            />
            <span className="text-[22px] text-ink font-bn">অ</span>
          </div>
        </div>
      </div>

      {/* Group 4: মনে করিয়ে দেওয়া */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('মনে করিয়ে দেওয়া')}</SectionHeader>
        <Row>
          <div className="flex flex-col">
            <span className="text-[15px] text-ink font-bn">
              {t('সময়সীমার আগে')}
            </span>
            <span className="text-[12px] text-muted font-bn">
              ৩ দিন আগে
            </span>
          </div>
          <Toggle
            checked={toggles.deadline}
            onToggle={() => toggle('deadline')}
          />
        </Row>
        <RowDivider />
        <Row>
          <div className="flex flex-col">
            <span className="text-[15px] text-ink font-bn">
              {t('বকেয়া টাকার তাগাদা')}
            </span>
            <span className="text-[12px] text-muted font-bn">
              ১ দিন পর
            </span>
          </div>
          <Toggle
            checked={toggles.overdue}
            onToggle={() => toggle('overdue')}
          />
        </Row>
        <RowDivider />
        <Row className="pb-4">
          <div className="flex flex-col">
            <span className="text-[15px] text-ink font-bn">
              {t('কাগজের মেয়াদ')}
            </span>
            <span className="text-[12px] text-muted font-bn">
              ৭ দিন আগে
            </span>
          </div>
          <Toggle
            checked={toggles.docExpiry}
            onToggle={() => toggle('docExpiry')}
          />
        </Row>
      </div>

      {/* Group 5: তথ্য */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('তথ্য')}</SectionHeader>
        <Row>
          <div className="flex items-center gap-3">
            <Download className="size-5 text-muted" />
            <span className="text-[15px] text-ink font-bn">
              {t('সব তথ্য ফাইল হিসেবে নিন')}
            </span>
          </div>
        </Row>
        <RowDivider />
        <Row className="pb-4">
          <div className="flex items-center gap-3">
            <Trash2 className="size-5 text-danger" />
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="text-[15px] text-danger font-bn"
            >
              {t('সব তথ্য মুছে ফেলুন')}
            </button>
          </div>
        </Row>
      </div>

      {/* Group 6: সম্পর্কে */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('সম্পর্কে')}</SectionHeader>
        <Row>
          <span className="text-[15px] text-ink font-bn">{t('ভার্সন')}</span>
          <span className="text-[13px] text-muted font-bn">
            v1.2.4 (Build 89)
          </span>
        </Row>
        <RowDivider />
        <Row>
          <span className="text-[15px] text-ink font-bn">
            {t('শর্তাবলী')}
          </span>
          <ChevronRight className="size-5 text-muted" />
        </Row>
        <RowDivider />
        <Row className="pb-4">
          <span className="text-[15px] text-brand font-bn">
            {t('মতামত দিন')}
          </span>
          <ExternalLink className="size-5 text-brand" />
        </Row>
      </div>

      {/* Footnote */}
      <div className="pb-8 text-center">
        <p className="flex items-center justify-center gap-1 text-[12px] text-muted font-bn">
          <Lock className="size-3.5" />
          {t('সব তথ্য আপনার ডিভাইসেই থাকে')}
        </p>
      </div>

      {/* Delete confirm sheet */}
      <BottomSheet open={showDelete} onClose={() => setShowDelete(false)}>
        <div className="p-4">
          <p className="mb-2 text-[18px] font-bold text-danger font-bn">
            {t('সব তথ্য মুছে ফেলুন')}
          </p>
          <p className="mb-4 text-[14px] text-muted font-bn">
            {t(
              'এই কাজটি অপরিবর্তনীয়। সব অগ্রগতি, কাজ, এবং হিসাব মুছে যাবে।'
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowDelete(false)}
              className="flex h-12 flex-1 items-center justify-center rounded-[14px] border border-border-rest text-[14px] font-bold text-ink active:scale-[0.98] font-bn"
            >
              {t('বাতিল')}
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(false)}
              className="flex h-12 flex-1 items-center justify-center rounded-[14px] bg-danger text-[14px] font-bold text-white active:scale-[0.98] font-bn"
            >
              {t('মুছে ফেলুন')}
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
