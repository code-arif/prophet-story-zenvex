<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class HajjPageSeeder extends Seeder
{
    public function run(): void
    {
        $content = <<<'HTML'
<div class="pb-20">

  <!-- Header -->
  <div class="bg-primary text-primary-foreground px-4 py-6">
    <h1 class="text-2xl font-bold">মাই হজ</h1>
    <p class="text-sm mt-1" style="opacity:0.8">বাংলাদেশ থেকে হজ পালনের সম্পূর্ণ গাইড</p>
  </div>

  <!-- Bismillah -->
  <div class="text-center py-6 px-4">
    <p class="text-2xl font-semibold text-primary" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
    <p class="text-sm text-muted-foreground mt-1">পরম করুণাময় অসীম দয়ালু আল্লাহর নামে</p>
  </div>

  <!-- Feature Grid -->
  <div class="px-4 grid grid-cols-2 gap-3">

    <a href="/before-hajj" class="bg-card rounded-xl p-4 border border-border block hover:shadow-lg transition-shadow">
      <div class="text-2xl mb-3">📚</div>
      <h3 class="font-semibold text-sm">হজের আগে প্রস্তুতি</h3>
      <p class="text-xs text-muted-foreground mt-1">হজের পূর্বে যা করণীয়</p>
    </a>

    <a href="/during-hajj" class="bg-card rounded-xl p-4 border border-border block hover:shadow-lg transition-shadow">
      <div class="text-2xl mb-3">🗺️</div>
      <h3 class="font-semibold text-sm">হজ পালনের নিয়ম</h3>
      <p class="text-xs text-muted-foreground mt-1">ধাপে ধাপে হজ গাইড</p>
    </a>

    <a href="/after-hajj" class="bg-card rounded-xl p-4 border border-border block hover:shadow-lg transition-shadow">
      <div class="text-2xl mb-3">⭐</div>
      <h3 class="font-semibold text-sm">হজের পরে করণীয়</h3>
      <p class="text-xs text-muted-foreground mt-1">হজ পরবর্তী আমল</p>
    </a>

    <a href="/qibla" class="bg-card rounded-xl p-4 border border-border block hover:shadow-lg transition-shadow">
      <div class="text-2xl mb-3">🧭</div>
      <h3 class="font-semibold text-sm">কিবলা কম্পাস</h3>
      <p class="text-xs text-muted-foreground mt-1">কিবলার দিক নির্ণয়</p>
    </a>

    <a href="/hajj/prayer-times" class="bg-card rounded-xl p-4 border border-border block hover:shadow-lg transition-shadow">
      <div class="text-2xl mb-3">🕐</div>
      <h3 class="font-semibold text-sm">নামাজের সময়সূচী</h3>
      <p class="text-xs text-muted-foreground mt-1">মক্কা ও ঢাকার সময়</p>
    </a>

    <a href="/duas" class="bg-card rounded-xl p-4 border border-border block hover:shadow-lg transition-shadow">
      <div class="text-2xl mb-3">🤲</div>
      <h3 class="font-semibold text-sm">দোয়া ও জিকির</h3>
      <p class="text-xs text-muted-foreground mt-1">অডিও সহ দোয়া সমূহ</p>
    </a>

    <a href="/videos" class="bg-card rounded-xl p-4 border border-border block hover:shadow-lg transition-shadow">
      <div class="text-2xl mb-3">🎥</div>
      <h3 class="font-semibold text-sm">ভিডিও গাইড</h3>
      <p class="text-xs text-muted-foreground mt-1">হজের ভিডিও টিউটোরিয়াল</p>
    </a>

    <a href="/" class="bg-card rounded-xl p-4 border border-border block hover:shadow-lg transition-shadow">
      <div class="text-2xl mb-3">📰</div>
      <h3 class="font-semibold text-sm">নিউজ ফিড</h3>
      <p class="text-xs text-muted-foreground mt-1">সর্বশেষ হজ আপডেট</p>
    </a>

  </div>

  <!-- Daily Reminder -->
  <div class="mx-4 mt-6 rounded-xl p-4 border" style="background-color:hsl(var(--accent)/0.1);border-color:hsl(var(--accent)/0.3)">
    <p class="text-sm font-semibold">📿 আজকের আমল</p>
    <p class="text-xs text-muted-foreground mt-1">
      "যে ব্যক্তি আল্লাহর সন্তুষ্টির জন্য হজ করে এবং অশ্লীল কথা ও পাপ কাজ থেকে বিরত থাকে, সে সদ্যজাত শিশুর মতো (নিষ্পাপ হয়ে) ফিরে আসে।" — বুখারী
    </p>
  </div>

</div>
HTML;

        Page::updateOrCreate(
            ['slug' => 'hajj'],
            [
                'title'        => 'মাই হজ',
                'content'      => $content,
                'is_published' => true,
                'use_builder'  => false,
            ]
        );

        $this->command->info('Hajj landing page seeded (slug: hajj).');
    }
}
