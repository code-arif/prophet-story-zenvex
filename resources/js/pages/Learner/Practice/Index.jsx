import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Headphones, Languages, Mic, PenLine, Wrench } from 'lucide-react';
import LearnerShell from '../../../layouts/LearnerShell';
import { StreakChip } from '../../../components/StreakChip';
import { HubTile } from '../../../components/HubTile';
import { buttonVariants } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

/**
 * Screen 20 — অনুশীলন / Practice Hub (Stitch). Today's weakest-skill
 * suggestion plus the six practice surfaces with honest status chips.
 * Advice comes from the learner's actual progress.
 */
export default function PracticeIndex({ streak = 0, advice = { bn: 'বলা', text: 'আপনার সবচেয়ে দুর্বল দক্ষতা — ৫ মিনিট উচ্চারণ অনুশীলন করুন', href: '/practice/pronunciation' } }) {
  return (
    <>
      <Head title="অনুশীলন" />
      <LearnerShell title="অনুশীলন" activeTab="practice" right={<StreakChip days={streak} />}>
      <div className="mt-2 space-y-4">
        {/* Today's advice */}
        <section>
          <h2 className="text-[16px] font-semibold text-learn-ink">আজকের পরামর্শ</h2>
          <div className="mt-3 rounded-[14px] border-l-[3px] border-learn-warn bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <p className="text-[15px] font-bold text-learn-ink">{advice.bn}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-learn-muted">
              {advice.text}
            </p>
            <Link
              href={advice.href}
              className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'mt-3 h-12 rounded-full px-4')}
            >
              শুরু করুন
            </Link>
          </div>
        </section>

        {/* All practice */}
        <section>
          <h2 className="text-[16px] font-semibold text-learn-ink">সব অনুশীলন</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {TILES.map(({ href, Icon, title, subtitle, badge, badgeTone, tint }) => (
              <HubTile
                key={href}
                href={href}
                icon={Icon}
                tint={tint}
                title={title}
                subtitle={subtitle}
                badge={badge}
                badgeTone={badgeTone}
                layout="grid"
              />
            ))}
          </div>
        </section>
      </div>
      </LearnerShell>
    </>
  );
}

const TILES = [
  { href: '/practice/pronunciation', Icon: Mic, tint: 'blue', title: 'উচ্চারণ স্টুডিও', subtitle: 'শুনুন, বলুন, মিলিয়ে দেখুন', badge: 'স্কোরিং-এ নেট লাগে', badgeTone: 'amber' },
  { href: '/practice/listening', Icon: Headphones, tint: 'blue', title: 'লিসেনিং', subtitle: 'শুনে লিখুন ও বুঝুন', badge: 'অফলাইন', badgeTone: 'grey' },
  { href: '/practice/writing', Icon: PenLine, tint: 'indigo', title: 'রাইটিং ডেস্ক', subtitle: 'বিষয় বেছে লিখুন', badge: 'অফলাইন', badgeTone: 'grey' },
  { href: '/practice/quiz', Icon: ClipboardList, tint: 'amber', title: 'কুইজ ও টেস্ট', subtitle: 'নিজেকে যাচাই করুন', badge: 'অফলাইন', badgeTone: 'grey' },
  { href: '/practice/phrasebook', Icon: Languages, tint: 'green', title: 'ফ্রেজবুক', subtitle: 'বাস্তব পরিস্থিতির বাক্য', badge: 'অফলাইন', badgeTone: 'grey' },
  { href: '/practice/mistakes', Icon: Wrench, tint: 'grey', title: 'ভুল সংশোধক', subtitle: 'বাংলাভাষীদের সাধারণ ভুল', badge: 'অফলাইন', badgeTone: 'grey' },
];
