import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { ChipStrip } from '../../components/ui/ChipStrip';
import ProposalPart from '../../components/learn/ProposalPart';
import { WarnStrip } from '../../components/ui/WarnStrip';
import { cn } from '../../lib/utils';

/**
 * Screen 10 — Proposal Library · প্রস্তাব লাইব্রেরি
 * ChipStrip + 6 parts + PaleInset samples + amber donts card.
 */

const JOB_TYPES = ['লোগো', 'ওয়েবসাইট', 'ল্যান্ডিং পেজ', 'সোশ্যাল মিডিয়া', 'কন্টেন্ট'];

const PROPOSAL_STRUCTURE = [
  { part: 'গ্রিটিং', sample: 'Hi [Client Name], I saw your project and I\'m excited to help!' },
  { part: 'বোঝাপড়া', sample: 'I understand you need a modern, clean logo for your brand.' },
  { part: 'অভিজ্ঞতা', sample: 'I\'ve designed 50+ logos for startups in your industry.' },
  { part: 'পদ্ধতি', sample: 'I\'ll create 3 concepts, then refine your favorite.' },
  { part: 'সময়সীমা', sample: 'You\'ll receive the first draft within 48 hours.' },
  { part: 'CTA', sample: 'Let\'s start — I\'m available right now.' },
];

const DONT_LIST = [
  'শুরুতেই দাম না বলে কাজের মান নিয়ে কথা বলুন',
  '"I am the best" — এ ধরনের দাবি এড়িয়ে চলুন',
  'ক্লায়েন্টের প্রোজেক্ট নিয়ে গবেষণা করে লিখুন',
  'কপি-পেস্ট প্রস্তাব কখনো দিবেন না',
];

export default function ProposalLibrary() {
  const { t } = useI18n();
  const [selectedType, setSelectedType] = useState(0);

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="প্রস্তাব লাইব্রেরি — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('প্রস্তাব লাইব্রেরি')}</h1>

      {/* Job type chips */}
      <div className="mb-3">
        <ChipStrip
          chips={JOB_TYPES.map((j, i) => ({ label: j, value: i }))}
          value={selectedType}
          onChange={setSelectedType}
        />
      </div>

      {/* Proposal structure */}
      <div className="mb-3 space-y-2">
        {PROPOSAL_STRUCTURE.map((p, i) => (
          <ProposalPart key={i} {...p} index={i} />
        ))}
      </div>

      {/* Dont's card */}
      <div className="mb-3">
        <WarnStrip>
          <p className="mb-2 text-[13px] font-bold text-warn font-bn">{t('এড়িয়ে চলুন')}</p>
          <ul className="space-y-1">
            {DONT_LIST.map((d, i) => (
              <li key={i} className="text-[12px] text-ink font-bn">• {t(d)}</li>
            ))}
          </ul>
        </WarnStrip>
      </div>
    </div>
  );
}
