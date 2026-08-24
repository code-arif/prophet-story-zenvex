import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import SettingsGroup from '../../components/settings/SettingsGroup';
import SettingsRow from '../../components/settings/SettingsRow';
import { BottomSheet } from '../../components/ui/BottomSheet';

/**
 * Screen 30 — Settings · সেটিংস
 * 6 groups + danger button (only red in app) + confirm sheet.
 */

export default function SettingsIndex() {
  const { t } = useI18n();
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="সেটিংস — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('সেটিংস')}</h1>

      {/* Group 1: Profile */}
      <SettingsGroup title="প্রোফাইল">
        <SettingsRow label="পুরো নাম" value="আরিফুল ইসলাম" action="বদলান" />
        <SettingsRow label="ফোন নম্বর" value="+৮৮০ ১৭XXXXXXXX" action="যাচাই আছে" />
        <SettingsRow label="ইমেইল" value="ariful@email.com" action="যোগ করুন" />
      </SettingsGroup>

      {/* Group 2: Work */}
      <SettingsGroup title="কাজ">
        <SettingsRow label="পেমেন্ট চ্যানেল" value="bKash, Nagad" action="পরিচালনা" href="/money/channels" />
        <SettingsRow label="স্কোপ গার্ড" value="চালু আছে" action="সেটিংস" />
        <SettingsRow label="ক্যাপাসিটি" value="৪০ ঘণ্টা/সপ্তাহ" action="বদলান" />
      </SettingsGroup>

      {/* Group 3: Money */}
      <SettingsGroup title="টাকা">
        <SettingsRow label="মুদ্রা" value="BDT (৳)" action="বদলান" />
        <SettingsRow label="স্বয়ংক্রিয় হিসাব" value="বন্ধ" action="চালু করুন" />
        <SettingsRow label="রিমাইন্ডার" value="প্রতি শুক্রবার" action="বদলান" />
      </SettingsGroup>

      {/* Group 4: Learn */}
      <SettingsGroup title="শেখা">
        <SettingsRow label="ভাষা" value="বাংলা" action="বদলান" />
        <SettingsRow label="রিমাইন্ডার" value="রাত ৯:০০" action="বদলান" />
        <SettingsRow label="অফলাইন ডেটা" value="১২ এমবি" action="পরিচালনা" />
      </SettingsGroup>

      {/* Group 5: Support */}
      <SettingsGroup title="সহায়তা">
        <SettingsRow label="সাহায্য কেন্দ্র" action="খুলুন" />
        <SettingsRow label="ফিডব্যাক" action="পাঠান" />
        <SettingsRow label="শর্তাবলী" action="দেখুন" />
        <SettingsRow label="গোপনীয়তা" action="দেখুন" />
      </SettingsGroup>

      {/* Group 6: Data */}
      <SettingsGroup title="ডেটা">
        <SettingsRow label="অগ্রগতি রপ্তানি" action="ডাউনলোড" />
        <SettingsRow label="লগ আউট" action="লগ আউট" />
        <SettingsRow
          label="সব তথ্য মুছে ফেলুন"
          danger
          onClick={() => setShowDelete(true)}
        />
      </SettingsGroup>

      {/* Version */}
      <p className="mt-4 text-center text-[11px] text-muted font-bn">
        easy rise v1.0.0
      </p>

      {/* Delete confirm sheet */}
      <BottomSheet open={showDelete} onClose={() => setShowDelete(false)}>
        <div className="p-4">
          <p className="mb-2 text-[18px] font-bold text-danger font-bn">{t('সব তথ্য মুছে ফেলুন')}</p>
          <p className="mb-4 text-[14px] text-muted font-bn">
            {t('এই কাজটি অপরিবর্তনীয়। সব অগ্রগতি, কাজ, এবং হিসাব মুছে যাবে।')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDelete(false)}
              className="flex h-12 flex-1 items-center justify-center rounded-[14px] border border-border-rest text-[14px] font-bold text-ink active:scale-[0.98] font-bn"
            >
              {t('বাতিল')}
            </button>
            <button
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
