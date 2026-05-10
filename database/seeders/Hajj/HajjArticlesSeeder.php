<?php

namespace Database\Seeders\Hajj;

use App\Models\Article;
use App\Models\Category;
use App\Models\PostType;
use Illuminate\Database\Seeder;

/**
 * Seeds Hajj Guide Articles — step-by-step Hajj in Bangla.
 */
class HajjArticlesSeeder extends Seeder
{
    public function run(): void
    {
        $hajjType = PostType::where('slug', 'hajj')->first();
        if (!$hajjType) {
            $this->command->warn('⚠️  Hajj PostType not found. Run HajjPostTypesSeeder first.');
            return;
        }

        $catMap = Category::whereIn('slug', [
            'hajj-preparation', 'hajj-rituals', 'hajj-after',
            'makkah-guide', 'ihram-guide', 'tawaf-guide',
            'arafa-muzdalifa', 'mina-rami',
        ])->pluck('id', 'slug');

        $images = $this->getImageMap();
        foreach ($this->getArticles() as $art) {
            Article::updateOrCreate(['slug' => $art['slug']], [
                'title'               => $art['title'],
                'excerpt'             => $art['excerpt'],
                'body'                => $art['body'],
                'featured_image_path' => $images[$art['slug']] ?? null,
                'category_id'         => $catMap[$art['category']] ?? null,
                'post_type_id'        => $hajjType->id,
                'is_breaking'         => false,
                'published_at'        => now()->subDays(rand(1, 30)),
                'visibility'          => 'public',
            ]);
        }

        $this->command->info('✅ Hajj Articles seeded.');
    }

    private function getImageMap(): array
    {
        return [
            // Hajj preparation — pilgrims in white ihram at Masjid al-Haram
            'hajj-niyyat-preparation'  => 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80',
            // Documents & checklist — travel / passport
            'hajj-documents-checklist' => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
            // Ihram & Miqat — white-robed pilgrims
            'ihram-rules-and-miqat'    => 'https://images.unsplash.com/photo-1564769662824-8e31e11e40c2?w=1200&q=80',
            // Tawaf — aerial view of the Kaaba
            'tawaf-complete-guide'     => 'https://images.unsplash.com/photo-1568831984808-1f0c9e0b7be4?w=1200&q=80',
            // Arafat — vast plains with pilgrims
            'arafah-day-guide'         => 'https://images.unsplash.com/photo-1566232392379-afd9298e6a46?w=1200&q=80',
            // Mina & Jamarat — Mina tent city
            'mina-rami-qurbani'        => 'https://images.unsplash.com/photo-1503541024826-8ef9f5b01f24?w=1200&q=80',
            // After Hajj — Masjid al-Nabawi, Madinah
            'after-hajj-amal'          => 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&q=80',
            // Makkah & Madinah guide — grand mosque overview
            'makkah-madina-guide'      => 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
        ];
    }

    private function getArticles(): array
    {
        return [
            // ── Preparation ──────────────────────────────────────────────
            [
                'slug'     => 'hajj-niyyat-preparation',
                'title'    => 'হজের নিয়ত ও মানসিক প্রস্তুতি',
                'category' => 'hajj-preparation',
                'excerpt'  => 'হজ করার আগে সবচেয়ে জরুরি বিষয় হলো বিশুদ্ধ নিয়ত এবং মানসিক প্রস্তুতি।',
                'body'     => <<<HTML
<h2>হজের নিয়ত ও মানসিক প্রস্তুতি</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6">
  <p class="text-xl font-arabic text-center" dir="rtl">وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ</p>
  <p class="text-sm text-center text-[hsl(var(--muted-foreground))] mt-2">উচ্চারণ: ওয়া আতিম্মুল হাজ্জা ওয়াল উমরাতা লিল্লাহ</p>
  <p class="text-sm text-center mt-1">"আল্লাহর জন্যই হজ ও উমরা সম্পন্ন করো।" — সূরা বাকারা ২:১৯৬</p>
</div>

<h3>নিয়ত কীভাবে করবেন?</h3>
<p>হজের নিয়ত মনে মনে করতে হয়। মুখে বলা মুস্তাহাব:</p>
<div class="rounded-xl bg-[hsl(var(--muted))] p-4 my-4">
  <p class="text-xl font-arabic" dir="rtl">اللَّهُمَّ إِنِّي أُرِيدُ الْحَجَّ فَيَسِّرْهُ لِي وَتَقَبَّلْهُ مِنِّي</p>
  <p class="text-sm mt-2 italic">আল্লাহুম্মা ইন্নি উরীদুল হাজ্জা ফা ইয়াস্সিরহু লি ওয়া তাকাব্বালহু মিন্নি</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">অর্থ: হে আল্লাহ! আমি হজ করার ইচ্ছা করছি, আমার জন্য সহজ করে দাও এবং কবুল করো।</p>
</div>

<h3>মানসিক প্রস্তুতি</h3>
<ul class="space-y-2">
  <li>✅ পরিবারের সাথে বিদায় নিন, পুরনো সব মনোমালিন্য মিটিয়ে নিন</li>
  <li>✅ দেনা-পাওনা মিটিয়ে যান, ওয়াসিয়তনামা লিখুন</li>
  <li>✅ হজের বিস্তারিত ম্যানুয়াল পড়ুন ও প্রশিক্ষণে অংশ নিন</li>
  <li>✅ ধৈর্য ও সহনশীলতার মনোবল তৈরি করুন</li>
  <li>✅ শারীরিক কষ্টের জন্য মানসিকভাবে প্রস্তুত থাকুন</li>
</ul>

<h3>হজের ফযিলত</h3>
<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 my-4">
  <p class="text-sm">রাসূলুল্লাহ (সা.) বলেছেন: <strong>"যে ব্যক্তি আল্লাহর জন্য হজ করে এবং অশ্লীল কথা ও পাপ কাজ থেকে বিরত থাকে, সে সদ্যোজাত শিশুর মতো (নিষ্পাপ হয়ে) ফিরে আসে।"</strong></p>
  <p class="text-xs text-[hsl(var(--muted-foreground))] mt-2">— বুখারী ১৫২১, মুসলিম ১৩৫০</p>
</div>
HTML,
            ],

            [
                'slug'     => 'hajj-documents-checklist',
                'title'    => 'হজের জন্য প্রয়োজনীয় কাগজপত্র ও চেকলিস্ট',
                'category' => 'hajj-preparation',
                'excerpt'  => 'হজে যাওয়ার আগে কী কী কাগজপত্র ও জিনিসপত্র প্রয়োজন — সম্পূর্ণ চেকলিস্ট।',
                'body'     => <<<HTML
<h2>হজের সম্পূর্ণ চেকলিস্ট</h2>

<h3>📄 কাগজপত্র</h3>
<ul class="space-y-1">
  <li>☐ পাসপোর্ট (ন্যূনতম ৬ মাসের মেয়াদ)</li>
  <li>☐ হজ ভিসা</li>
  <li>☐ মেনিনজাইটিস টিকার আন্তর্জাতিক সনদপত্র</li>
  <li>☐ কোভিড-১৯ ভ্যাক্সিনেশন সনদ</li>
  <li>☐ জাতীয় পরিচয়পত্রের কপি (৫টি)</li>
  <li>☐ পাসপোর্ট সাইজ ছবি (১০ কপি)</li>
  <li>☐ হজ এজেন্সির বুকিং পেপার</li>
  <li>☐ বিমান টিকিট</li>
  <li>☐ হোটেল বুকিং কনফার্মেশন</li>
  <li>☐ স্বাস্থ্য পরীক্ষার রিপোর্ট</li>
</ul>

<h3>🧳 প্রয়োজনীয় জিনিসপত্র</h3>
<div class="grid grid-cols-2 gap-4 my-4">
  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <p class="font-semibold text-sm mb-2">👗 পোশাক</p>
    <ul class="text-xs space-y-1">
      <li>☐ ইহরামের কাপড় (২ সেট)</li>
      <li>☐ আরামদায়ক পোশাক (৪-৫ সেট)</li>
      <li>☐ আরামদায়ক স্যান্ডেল</li>
      <li>☐ মোজা</li>
      <li>☐ ছাতা</li>
    </ul>
  </div>
  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <p class="font-semibold text-sm mb-2">💊 স্বাস্থ্য</p>
    <ul class="text-xs space-y-1">
      <li>☐ নিয়মিত ওষুধপত্র</li>
      <li>☐ পেইন কিলার</li>
      <li>☐ ডায়রিয়ার ওষুধ</li>
      <li>☐ সানস্ক্রিন SPF 50+</li>
      <li>☐ ওআরএস স্যালাইন</li>
    </ul>
  </div>
  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <p class="font-semibold text-sm mb-2">📱 ইলেকট্রনিক্স</p>
    <ul class="text-xs space-y-1">
      <li>☐ মোবাইল + চার্জার</li>
      <li>☐ পাওয়ার ব্যাংক</li>
      <li>☐ মাল্টি-প্লাগ অ্যাডাপ্টার</li>
      <li>☐ ইয়ারফোন</li>
    </ul>
  </div>
  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <p class="font-semibold text-sm mb-2">📿 ধর্মীয়</p>
    <ul class="text-xs space-y-1">
      <li>☐ কুরআন শরীফ (ছোট)</li>
      <li>☐ হজের দোয়ার বই</li>
      <li>☐ তাসবীহ</li>
      <li>☐ জায়নামায</li>
    </ul>
  </div>
</div>

<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 mt-4">
  <p class="text-sm font-semibold">⚠️ মনে রাখবেন</p>
  <p class="text-xs mt-1">সৌদি আরবে কিছু ওষুধ নিষিদ্ধ। বাংলাদেশ হজ অফিস থেকে অনুমোদিত ওষুধের তালিকা সংগ্রহ করুন।</p>
</div>
HTML,
            ],

            // ── Ihram ─────────────────────────────────────────────────────
            [
                'slug'     => 'ihram-rules-and-miqat',
                'title'    => 'ইহরামের নিয়ম ও মীকাত',
                'category' => 'ihram-guide',
                'excerpt'  => 'হজ ও উমরার ইহরাম কোথা থেকে, কীভাবে বাঁধতে হয় এবং কী কী নিষিদ্ধ।',
                'body'     => <<<HTML
<h2>ইহরাম — হজের পবিত্র অবস্থা</h2>

<h3>মীকাত — ইহরামের নির্ধারিত স্থান</h3>
<div class="overflow-x-auto">
  <table class="w-full text-sm border-collapse my-4">
    <thead class="bg-[hsl(var(--muted))]">
      <tr>
        <th class="border border-[hsl(var(--border))] px-3 py-2 text-left">মীকাতের নাম</th>
        <th class="border border-[hsl(var(--border))] px-3 py-2 text-left">কোন দেশের জন্য</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-[hsl(var(--border))] px-3 py-2">যুলহুলাইফা (আবিয়ার আলী)</td><td class="border border-[hsl(var(--border))] px-3 py-2">মদিনা হয়ে আসলে</td></tr>
      <tr class="bg-[hsl(var(--muted)/0.3)]"><td class="border border-[hsl(var(--border))] px-3 py-2">ইয়ালামলাম</td><td class="border border-[hsl(var(--border))] px-3 py-2">বাংলাদেশ, ভারত, পাকিস্তান (সমুদ্রপথ)</td></tr>
      <tr><td class="border border-[hsl(var(--border))] px-3 py-2">কারনুল মানাযিল</td><td class="border border-[hsl(var(--border))] px-3 py-2">নজদ থেকে আসলে</td></tr>
      <tr class="bg-[hsl(var(--muted)/0.3)]"><td class="border border-[hsl(var(--border))] px-3 py-2">যাতু ইরক</td><td class="border border-[hsl(var(--border))] px-3 py-2">ইরাক থেকে আসলে</td></tr>
      <tr><td class="border border-[hsl(var(--border))] px-3 py-2">জুহফা</td><td class="border border-[hsl(var(--border))] px-3 py-2">সিরিয়া, মিশর থেকে আসলে</td></tr>
    </tbody>
  </table>
</div>

<h3>ইহরামের পোশাক</h3>
<ul class="space-y-2">
  <li><strong>পুরুষের জন্য:</strong> সেলাই ছাড়া দুটি সাদা কাপড় — একটি কোমরে বাঁধা (ইযার), একটি কাঁধে (রিদা)</li>
  <li><strong>মহিলাদের জন্য:</strong> স্বাভাবিক শালীন পোশাক, মুখ ও হাত ঢাকা যাবে না ইহরামের সময়</li>
</ul>

<h3>ইহরামের নিষিদ্ধ কাজ</h3>
<div class="grid grid-cols-2 gap-3 my-4">
  <div class="rounded-xl bg-[hsl(var(--destructive)/0.05)] border border-[hsl(var(--destructive)/0.2)] p-3">
    <p class="text-xs font-semibold text-[hsl(var(--destructive))] mb-1">🚫 পুরুষ ও মহিলা উভয়ের জন্য নিষিদ্ধ</p>
    <ul class="text-xs space-y-1">
      <li>চুল কাটা বা ছিঁড়া</li>
      <li>নখ কাটা</li>
      <li>সুগন্ধি ব্যবহার</li>
      <li>যৌন সম্পর্ক</li>
      <li>শিকার করা</li>
      <li>ঝগড়া-বিবাদ</li>
    </ul>
  </div>
  <div class="rounded-xl bg-[hsl(var(--destructive)/0.05)] border border-[hsl(var(--destructive)/0.2)] p-3">
    <p class="text-xs font-semibold text-[hsl(var(--destructive))] mb-1">🚫 শুধু পুরুষের জন্য নিষিদ্ধ</p>
    <ul class="text-xs space-y-1">
      <li>মাথা ঢাকা</li>
      <li>সেলাই করা পোশাক</li>
      <li>হাত মোজা পরা</li>
      <li>গোড়ালি ঢাকা জুতা</li>
    </ul>
  </div>
</div>

<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4">
  <p class="text-sm font-semibold">💡 টিপস</p>
  <p class="text-xs mt-1">বিমানে ওঠার আগেই ইহরাম বেঁধে নিন। ঢাকা থেকে রওনা হওয়ার পর বিমানের মধ্যে ঘোষণা দিলে ইহরাম বেঁধে নিন।</p>
</div>
HTML,
            ],

            // ── Tawaf ─────────────────────────────────────────────────────
            [
                'slug'     => 'tawaf-complete-guide',
                'title'    => 'তাওয়াফ করার সম্পূর্ণ নিয়ম',
                'category' => 'tawaf-guide',
                'excerpt'  => 'কাবাঘর প্রদক্ষিণ (তাওয়াফ) করার নিয়ম, শর্ত, দোয়া ও সাঈ।',
                'body'     => <<<HTML
<h2>তাওয়াফ — কাবাঘর প্রদক্ষিণ</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6 text-center">
  <p class="text-2xl" dir="rtl">وَلْيَطَّوَّفُوا بِالْبَيْتِ الْعَتِيقِ</p>
  <p class="text-sm italic mt-2">ওয়াল ইয়াত্তাওয়াফু বিল বাইতিল আতীক</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">"এবং তারা যেন এই প্রাচীন ঘরের প্রদক্ষিণ করে।" — সূরা হজ ২২:২৯</p>
</div>

<h3>তাওয়াফের শর্তসমূহ</h3>
<ul class="space-y-2">
  <li>✅ ওযু থাকতে হবে</li>
  <li>✅ সতর ঢাকা থাকতে হবে</li>
  <li>✅ কাবাকে বামদিকে রেখে প্রদক্ষিণ করতে হবে</li>
  <li>✅ হাজরে আসওয়াদ থেকে শুরু করতে হবে</li>
  <li>✅ সাত চক্কর পূর্ণ করতে হবে</li>
  <li>✅ মসজিদুল হারামের ভেতরে করতে হবে</li>
</ul>

<h3>তাওয়াফের ধাপ</h3>
<div class="space-y-3 my-4">
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold">১</span>
    <div>
      <p class="font-semibold text-sm">হাজরে আসওয়াদ বরাবর দাঁড়ান</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">কালো পাথর চুমু দিন বা ইশারা করুন এবং "বিসমিল্লাহ আল্লাহু আকবার" বলুন।</p>
    </div>
  </div>
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold">২</span>
    <div>
      <p class="font-semibold text-sm">সাত চক্কর পূর্ণ করুন</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">প্রতিটি চক্করে ইয়ামানি কোণ থেকে হাজরে আসওয়াদের মধ্যবর্তী স্থানে "রাব্বানা আতিনা ফিদ্দুনইয়া..." পড়ুন।</p>
    </div>
  </div>
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold">৩</span>
    <div>
      <p class="font-semibold text-sm">মাকামে ইবরাহিমে দুই রাকাত নামাজ</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">তাওয়াফ শেষে মাকামে ইবরাহিমের পিছনে ২ রাকাত নামাজ পড়ুন।</p>
    </div>
  </div>
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold">৪</span>
    <div>
      <p class="font-semibold text-sm">যমযমের পানি পান করুন</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">কিবলামুখী হয়ে দাঁড়িয়ে পান করুন।</p>
    </div>
  </div>
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold">৫</span>
    <div>
      <p class="font-semibold text-sm">সাফা-মারওয়া সাঈ করুন</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">সাফা পাহাড় থেকে শুরু করে মারওয়া পর্যন্ত ৭ বার যাতায়াত।</p>
    </div>
  </div>
</div>

<h3>পুরুষের জন্য রমল ও ইযতিবা</h3>
<p class="text-sm">উমরা ও তাওয়াফে কুদুমে পুরুষরা প্রথম তিন চক্করে দ্রুত পায়ে হাঁটবেন (রমল) এবং ডান বগল খোলা রাখবেন (ইযতিবা)।</p>
HTML,
            ],

            // ── Arafa ─────────────────────────────────────────────────────
            [
                'slug'     => 'arafah-day-guide',
                'title'    => 'আরাফাতের দিন — হজের সবচেয়ে গুরুত্বপূর্ণ রুকন',
                'category' => 'arafa-muzdalifa',
                'excerpt'  => '৯ জিলহজ আরাফাতে অবস্থান — হজের ফরজ। এই দিনের আমল ও করণীয়।',
                'body'     => <<<HTML
<h2>আরাফাত — হজের প্রাণ</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6 text-center">
  <p class="text-xl" dir="rtl">الحَجُّ عَرَفَةُ</p>
  <p class="text-sm italic mt-2">আলহাজ্জু আরাফাহ</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">"হজ হলো আরাফাত।" — তিরমিযী ৮৮৯</p>
</div>

<h3>৮ জিলহজ — মিনায় যাত্রা (তারবিয়ার দিন)</h3>
<ul class="space-y-2">
  <li>📍 ইহরাম অবস্থায় মিনায় যান (মক্কা থেকে ৫ কিমি)</li>
  <li>🕌 মিনায় ৫ ওয়াক্ত নামাজ পড়ুন — জোহর, আসর, মাগরিব, ইশা ও পরের দিন ফজর</li>
  <li>📿 বেশি বেশি তালবিয়া, জিকির ও দোয়া করুন</li>
  <li>😴 মিনায় রাত কাটান (সুন্নাত)</li>
</ul>

<h3>৯ জিলহজ — আরাফাতে অবস্থান (ফরজ)</h3>
<div class="rounded-xl bg-[hsl(var(--destructive)/0.05)] border border-[hsl(var(--destructive)/0.2)] p-4 my-4">
  <p class="text-sm font-bold">⚠️ সতর্কতা: আরাফাতে অবস্থান না করলে হজ হবে না!</p>
  <p class="text-xs mt-1">সূর্যাস্তের আগেই আরাফাতে পৌঁছুন এবং সূর্যাস্ত পর্যন্ত থাকুন।</p>
</div>

<ul class="space-y-2">
  <li>🌅 ফজরের পর মিনা থেকে আরাফাতের উদ্দেশ্যে রওনা</li>
  <li>🕛 জোহর ও আসর একসাথে কসর করে পড়ুন (জোহরের সময়ে)</li>
  <li>🤲 বেশি বেশি দোয়া করুন — এটি কবুলের দিন</li>
  <li>🌙 সূর্যাস্তের পর মুযদালিফায় রওনা</li>
</ul>

<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 my-4">
  <p class="text-sm font-semibold">🌟 এই দিনের শ্রেষ্ঠ দোয়া</p>
  <p class="text-lg font-arabic mt-2" dir="rtl">لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ</p>
  <p class="text-xs italic mt-2">লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহ...<br>আল্লাহ ছাড়া কোনো উপাস্য নেই (বারবার পড়ুন)</p>
</div>

<h3>৯ জিলহজ রাত — মুযদালিফায় রাত্রিযাপন</h3>
<ul class="space-y-2">
  <li>📍 মুযদালিফায় পৌঁছে মাগরিব ও ইশা একসাথে পড়ুন</li>
  <li>🌙 এখানেই রাত কাটান (ওয়াজিব)</li>
  <li>🪨 জামারাতে মারার জন্য ৭০টি কংকর সংগ্রহ করুন</li>
  <li>🌅 ফজরের পর মিনার উদ্দেশ্যে রওনা করুন</li>
</ul>
HTML,
            ],

            // ── Mina & Jamarat ────────────────────────────────────────────
            [
                'slug'     => 'mina-rami-qurbani',
                'title'    => 'মিনায় শয়তানকে পাথর মারা ও কুরবানি',
                'category' => 'mina-rami',
                'excerpt'  => '১০ জিলহজ মিনায় জামারাতে পাথর মারা, কুরবানি, মাথা মুণ্ডন ও তাওয়াফে জিয়ারাতের নিয়ম।',
                'body'     => <<<HTML
<h2>মিনার কাজ — ১০-১২ জিলহজ</h2>

<h3>১০ জিলহজ — ঈদের দিনের আমল</h3>
<div class="space-y-3">
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold">১</span>
    <div>
      <p class="font-semibold">বড় জামারাতে ৭টি পাথর মারা</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">ফজর থেকে উজ্জ্বল আগে। প্রতি পাথরে "আল্লাহু আকবার" বলতে হবে।</p>
    </div>
  </div>
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold">২</span>
    <div>
      <p class="font-semibold">কুরবানি করা (ওয়াজিব)</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">একটি ছাগল/ভেড়া বা গরু/উটে ৭ ভাগে।</p>
    </div>
  </div>
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold">৩</span>
    <div>
      <p class="font-semibold">মাথা মুণ্ডন বা চুল ছাঁটা (তাহাল্লুল)</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">পুরুষ — মাথা মুণ্ডন (উত্তম) বা ছাঁটা। মহিলা — এক আঙুলের মাথা পরিমাণ ছাঁটা।</p>
    </div>
  </div>
  <div class="flex items-start gap-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold">৪</span>
    <div>
      <p class="font-semibold">তাওয়াফে জিয়ারাত (ফরজ)</p>
      <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">মক্কায় গিয়ে কাবাঘর ৭ বার প্রদক্ষিণ করুন। এরপর সাফা-মারওয়া সাঈ।</p>
    </div>
  </div>
</div>

<h3>১১-১২ জিলহজ — আইয়ামে তাশরীক</h3>
<ul class="space-y-2">
  <li>প্রতিদিন তিনটি জামারাতে ৭টি করে পাথর মারুন (মোট ২১টি)</li>
  <li>ছোট জামারাত → মাঝারি জামারাত → বড় জামারাত (এই ক্রমে)</li>
  <li>মিনায় রাত কাটানো ওয়াজিব</li>
  <li>১৩ তারিখ সূর্যাস্তের আগে মিনা ত্যাগ করলে ১২ তারিখে ফেরা জায়েজ</li>
</ul>

<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 mt-4">
  <p class="text-sm font-semibold">🤲 পাথর মারার সময়ের দোয়া</p>
  <p class="text-lg font-arabic mt-2" dir="rtl">اللَّهُ أَكْبَرُ</p>
  <p class="text-xs italic">আল্লাহু আকবার — প্রতিটি পাথর মারার সময় বলুন</p>
</div>
HTML,
            ],

            // ── After Hajj ────────────────────────────────────────────────
            [
                'slug'     => 'after-hajj-amal',
                'title'    => 'হজের পরে করণীয় আমল ও জীবনযাপন',
                'category' => 'hajj-after',
                'excerpt'  => 'হজ থেকে ফিরে এসে কীভাবে হাজির জীবন আরও সুন্দর করা যায়।',
                'body'     => <<<HTML
<h2>হজ মাবরুর — কবুল হজের আলামত</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6 text-center">
  <p class="text-xl" dir="rtl">الْحَجُّ الْمَبْرُورُ لَيْسَ لَهُ جَزَاءٌ إِلَّا الْجَنَّةُ</p>
  <p class="text-sm italic mt-2">আলহাজ্জুল মাবরুরু লাইসা লাহু জাযাউন ইল্লাল জান্নাহ</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">"মাবরুর (কবুল) হজের পুরস্কার শুধুই জান্নাত।" — বুখারী ১৭৭৩</p>
</div>

<h3>তাওয়াফে বিদা</h3>
<p>মক্কা ছাড়ার আগে শেষ তাওয়াফ করুন (ওয়াজিব)। এটি বিদায়ী তাওয়াফ।</p>

<h3>মদিনায় রাসূলুল্লাহ (সা.)-এর রওজা জিয়ারাত</h3>
<div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4 my-4">
  <p class="text-sm">মদিনায় গেলে মসজিদে নববীতে নামাজ পড়ুন এবং রাসূলুল্লাহ (সা.)–এর রওজায় সালাম দিন।</p>
  <p class="text-xl font-arabic text-center mt-3" dir="rtl">السَّلَامُ عَلَيْكَ يَا رَسُولَ اللَّهِ</p>
  <p class="text-sm text-center italic">আস-সালামু আলাইকা ইয়া রাসূলাল্লাহ</p>
</div>

<h3>হজ থেকে ফেরার পর করণীয়</h3>
<ul class="space-y-2">
  <li>✅ নিজের ও পরিবারের জন্য দোয়া করুন</li>
  <li>✅ হজের স্মৃতি ও শিক্ষা অন্যদের সাথে ভাগ করুন</li>
  <li>✅ নামাজ, রোজা, যাকাত নিয়মিত আদায় করুন</li>
  <li>✅ পাপ থেকে বিরত থাকুন — হজের পরিশুদ্ধতা ধরে রাখুন</li>
  <li>✅ গরিব-অসহায়দের সাহায্য করুন</li>
  <li>✅ কুরআন তিলাওয়াতের অভ্যাস বজায় রাখুন</li>
</ul>

<h3>কবুল হজের আলামত</h3>
<p class="text-sm">আলেমগণ বলেছেন, হজ কবুল হওয়ার আলামত হলো হজের পর থেকে আগের চেয়ে বেশি ভালো আমল করা এবং পাপ থেকে আরও বেশি দূরে থাকা।</p>
HTML,
            ],

            // ── Makkah Guide ──────────────────────────────────────────────
            [
                'slug'     => 'makkah-madina-guide',
                'title'    => 'মক্কা ও মদিনার ঐতিহাসিক স্থানসমূহ',
                'category' => 'makkah-guide',
                'excerpt'  => 'মক্কা ও মদিনায় হজ যাত্রায় দেখার মতো গুরুত্বপূর্ণ ঐতিহাসিক ও ধর্মীয় স্থান।',
                'body'     => <<<HTML
<h2>মক্কা মুকাররামার দর্শনীয় স্থান</h2>

<div class="space-y-4">

  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">🕋</span>
      <p class="font-semibold">মসজিদুল হারাম</p>
    </div>
    <p class="text-sm">পৃথিবীর সবচেয়ে বড় মসজিদ। এখানে এক রাকাত নামাজ পড়লে ১ লক্ষ রাকাত নামাজের সওয়াব পাওয়া যায়।</p>
  </div>

  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">🪨</span>
      <p class="font-semibold">জাবালে নূর (হেরা গুহা)</p>
    </div>
    <p class="text-sm">যেখানে প্রথম ওহি নাযিল হয়েছিল। মক্কার উত্তরে একটি পাহাড়ের চূড়ায়।</p>
  </div>

  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">⛏️</span>
      <p class="font-semibold">জাবালে সূর (সাওর গুহা)</p>
    </div>
    <p class="text-sm">যেখানে রাসূলুল্লাহ (সা.) ও হযরত আবু বকর (রা.) হিজরতের সময় তিন রাত লুকিয়ে ছিলেন।</p>
  </div>

  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">🏛️</span>
      <p class="font-semibold">জান্নাতুল মু\'আল্লা</p>
    </div>
    <p class="text-sm">মক্কার কবরস্থান যেখানে হযরত খাদিজা (রা.) সহ অনেক সাহাবী-সাহাবিয়ারা শায়িত।</p>
  </div>

</div>

<h2 class="mt-8">মদিনা মুনাওওয়ারার দর্শনীয় স্থান</h2>

<div class="space-y-4">

  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">🕌</span>
      <p class="font-semibold">মসজিদে নববী (সা.)</p>
    </div>
    <p class="text-sm">এখানে এক রাকাত নামাজ পড়লে ১,০০০ রাকাত নামাজের সওয়াব পাওয়া যায়।</p>
  </div>

  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">🕌</span>
      <p class="font-semibold">মসজিদে কুবা</p>
    </div>
    <p class="text-sm">ইসলামের প্রথম মসজিদ। এখানে দুই রাকাত নামাজ পড়লে একটি উমরার সওয়াব। (তিরমিযী ৩২৪)</p>
  </div>

  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">⚔️</span>
      <p class="font-semibold">উহুদ পাহাড় ও শহীদদের কবরস্থান</p>
    </div>
    <p class="text-sm">৬২৫ খ্রিস্টাব্দে উহুদ যুদ্ধের স্থান। এখানে হযরত হামযা (রা.) সহ ৭০ জন শহীদ সাহাবী শায়িত।</p>
  </div>

  <div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">🏛️</span>
      <p class="font-semibold">জান্নাতুল বাকি</p>
    </div>
    <p class="text-sm">মদিনার কবরস্থান যেখানে হযরত ওসমান (রা.), হযরত আয়িশা (রা.) সহ অসংখ্য সাহাবী-সাহাবিয়া শায়িত।</p>
  </div>

</div>
HTML,
            ],
        ];
    }
}
