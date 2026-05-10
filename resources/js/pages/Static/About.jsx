import React from 'react';
import AppShell from '../../layouts/AppShell';

export default function About() {
  return (
    <AppShell title="About">
      <div className="space-y-4">

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="text-lg font-semibold">My Labbaik</div>

          <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            My Labbaik (https://mylabbaik.com/) একটি সহজ ও mobile-first হজ ও ওমরাহ গাইড অ্যাপ। 
            এটি হাজীদের জন্য ধাপে ধাপে নির্দেশনা, দোয়া, এবং প্রয়োজনীয় তথ্য প্রদান করে যাতে ইবাদত সঠিকভাবে ও সহজে সম্পন্ন করা যায়।
          </div>

          <div className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
            ইহরাম, তাওয়াফ, সাঈ, মিনায় অবস্থান, আরাফাত, মুজদালিফা—হজের প্রতিটি ধাপকে সহজভাবে বুঝানোর জন্য 
            এই অ্যাপটি ডিজাইন করা হয়েছে। নতুন ও অভিজ্ঞ—সব ধরনের হাজীদের জন্য এটি সহায়ক।
          </div>

          <div className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
            Our goal is to provide clear, authentic, and easy-to-follow guidance so that you can focus fully on your worship (ইবাদত) without confusion.
          </div>

          <div className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
            ✨ বৈশিষ্ট্যসমূহ:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>ধাপে ধাপে হজ ও ওমরাহ গাইড</li>
              <li>প্রয়োজনীয় দোয়া ও নির্দেশনা</li>
              <li>সহজ ভাষায় ব্যাখ্যা</li>
              <li>মোবাইল-ফ্রেন্ডলি ডিজাইন</li>
            </ul>
          </div>

          <div className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
            Designed for convenience, My Labbaik keeps everything in one place—so you can stay focused, prepared, and spiritually connected throughout your journey.
          </div>

        </div>

      </div>
    </AppShell>
  );
}