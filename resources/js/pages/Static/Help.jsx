import React from 'react';
import AppShell from '../../layouts/AppShell';

export default function Help() {
  return (
    <AppShell title="Help">
      <div className="space-y-4">

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="text-lg font-semibold">সহায়তা (Help)</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            হজ ও ওমরাহ সংক্রান্ত প্রয়োজনীয় তথ্য, নির্দেশনা ও সহায়তা পেতে এই পেজটি ব্যবহার করুন।
          </div>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="font-semibold">হজে যাওয়ার পূর্ব প্রস্তুতি</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-[hsl(var(--muted-foreground))] space-y-1">
            <li>বৈধ পাসপোর্ট (কমপক্ষে ৬ মাস মেয়াদ থাকতে হবে)</li>
            <li>হজ নিবন্ধন সম্পন্ন করা (সরকারি বা অনুমোদিত এজেন্সির মাধ্যমে)</li>
            <li>হজ ভিসা সংগ্রহ</li>
            <li>টিকা (মেনিনজাইটিস, কোভিড-১৯ ইত্যাদি) সম্পন্ন করা</li>
            <li>প্রয়োজনীয় টাকা ও আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ড প্রস্তুত রাখা</li>
          </ul>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="font-semibold">হজ প্যাকেজ ও নিবন্ধন (বাংলাদেশ)</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            বাংলাদেশ থেকে হজে যেতে হলে ধর্ম বিষয়ক মন্ত্রণালয় অনুমোদিত হজ এজেন্সির মাধ্যমে নিবন্ধন করতে হয়। 
            সরকারি ও বেসরকারি—উভয় ধরনের প্যাকেজ পাওয়া যায়।
          </div>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="font-semibold">হজ চলাকালীন প্রয়োজনীয় টিপস</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-[hsl(var(--muted-foreground))] space-y-1">
            <li>সবসময় আপনার আইডি কার্ড ও হোটেলের তথ্য সাথে রাখুন</li>
            <li>দলনেতার সাথে যোগাযোগ বজায় রাখুন</li>
            <li>পর্যাপ্ত পানি পান করুন (ডিহাইড্রেশন এড়াতে)</li>
            <li>নির্দেশনা অনুযায়ী ইবাদত সম্পন্ন করুন</li>
            <li>ভিড়ের সময় সতর্ক থাকুন</li>
          </ul>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="font-semibold">যোগাযোগ (Contact)</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))] space-y-1">
            <div>📞 হজ হেল্পলাইন (বাংলাদেশ): ১৬১৩৬</div>
            <div>🌐 ওয়েবসাইট: https://www.hajj.gov.bd</div>
            <div>✉️ ইমেইল: info@mylabbaik.com</div>
            <div>📱 অ্যাপ সাপোর্ট: My Labbaik (mylabbaik.com)</div>
          </div>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="font-semibold">OTP সমস্যা?</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            যদি OTP না পান, তাহলে আপনার মোবাইল নম্বর সঠিক কিনা যাচাই করুন।
            প্রয়োজনে সাপোর্টে যোগাযোগ করুন।
          </div>
        </div>

      </div>
    </AppShell>
  );
}