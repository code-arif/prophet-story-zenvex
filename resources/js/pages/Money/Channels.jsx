import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import ChannelCard from '../../components/money/ChannelCard';
import { WarnStrip } from '../../components/ui/WarnStrip';

/**
 * Screen 26 — Payment Channels · পেমেন্ট চ্যানেল
 * 4 expandable cards + amber warning card.
 */

const MOCK = {
  channels: [
    {
      name: 'bKash',
      icon: '📱',
      status: 'সক্রিয়',
      details: [
        { label: 'নম্বর', value: '০১৭XXXXXXXX' },
        { label: 'সীমা', value: '৳২৫,০০০/দিন' },
        { label: 'ফি', value: '১.৫%' },
      ],
    },
    {
      name: 'Nagad',
      icon: '💳',
      status: 'সক্রিয়',
      details: [
        { label: 'নম্বর', value: '০১৮XXXXXXXX' },
        { label: 'সীমা', value: '৳২০,০০০/দিন' },
        { label: 'ফি', value: '১.০%' },
      ],
    },
    {
      name: 'Payoneer',
      icon: '🌐',
      status: 'যাচাই বাকি',
      details: [
        { label: 'ইমেইল', value: 'user@email.com' },
        { label: 'সীমা', value: 'অসীমিত' },
        { label: 'ফি', value: '২.০%' },
      ],
    },
    {
      name: 'Bank Transfer',
      icon: '🏦',
      status: 'সেটআপ বাকি',
      details: [
        { label: 'ব্যাংক', value: 'নির্বাচন করুন' },
        { label: 'অ্যাকাউন্ট', value: '—' },
        { label: 'SWIFT', value: '—' },
      ],
    },
  ],
};

export default function Channels() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState({});
  const { channels } = MOCK;

  const toggle = (i) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  const unverified = channels.filter((c) => c.status !== 'সক্রিয়').length;

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="পেমেন্ট চ্যানেল — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('পেমেন্ট চ্যানেল')}</h1>

      {/* Warning strip */}
      {unverified > 0 && (
        <div className="mb-3">
          <WarnStrip>
            {unverified}টি চ্যানেল যাচাই বাকি — টাকা আনতে সব চ্যানেল সক্রিয় করুন
          </WarnStrip>
        </div>
      )}

      {/* Channel cards */}
      <div className="space-y-2">
        {channels.map((c, i) => (
          <ChannelCard
            key={i}
            channel={c}
            expanded={!!expanded[i]}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </div>
  );
}
