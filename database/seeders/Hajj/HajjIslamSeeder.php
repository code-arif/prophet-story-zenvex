<?php

namespace Database\Seeders\Hajj;

use App\Models\Article;
use App\Models\Category;
use App\Models\PostType;
use Illuminate\Database\Seeder;

/**
 * Seeds Quran Ayahs, Ibadah guides, and Islamic stories.
 */
class HajjIslamSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedQuranAyahs();
        $this->seedIbadah();
        $this->seedStories();
        $this->command->info('✅ Islamic content seeded (Quran, Ibadah, Stories).');
    }

    // ──────────────────────────────────────────────────────────────────────
    // QURAN AYAHS
    // ──────────────────────────────────────────────────────────────────────
    private function seedQuranAyahs(): void
    {
        $quranType = PostType::where('slug', 'quran')->first();
        if (!$quranType) return;

        $catMap = Category::whereIn('slug', [
            'quran-hajj', 'quran-iman', 'quran-ibadah',
            'quran-tazkiyah', 'quran-jannah', 'quran-surah',
        ])->pluck('id', 'slug');

        foreach ($this->getAyahs() as $item) {
            Article::updateOrCreate(['slug' => $item['slug']], [
                'title'               => $item['title'],
                'excerpt'             => $item['excerpt'],
                'body'                => $item['body'],
                'featured_image_path' => $this->categoryImage($item['category']),
                'category_id'         => $catMap[$item['category']] ?? null,
                'post_type_id'        => $quranType->id,
                'is_breaking'         => false,
                'published_at'        => now()->subDays(rand(1, 60)),
                'visibility'          => 'public',
            ]);
        }
    }

    private function categoryImage(string $cat): string
    {
        return match (true) {
            str_starts_with($cat, 'quran')   => 'https://images.unsplash.com/photo-1585036151513-9259aa9b5b37?w=1200&q=80',
            str_contains($cat, 'salah')      => 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80',
            str_contains($cat, 'sawm')       => 'https://images.unsplash.com/photo-1499159058454-75067059248a?w=1200&q=80',
            str_contains($cat, 'zakat')      => 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=1200&q=80',
            str_contains($cat, 'hajj')       => 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80',
            str_contains($cat, 'tahajjud')   => 'https://images.unsplash.com/photo-1499159058454-75067059248a?w=1200&q=80',
            str_contains($cat, 'prophet')    => 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&q=80',
            str_contains($cat, 'sahabi')     => 'https://images.unsplash.com/photo-1564769662824-8e31e11e40c2?w=1200&q=80',
            str_contains($cat, 'story')      => 'https://images.unsplash.com/photo-1567519280911-8f65d3e3cd44?w=1200&q=80',
            default                          => 'https://images.unsplash.com/photo-1564769662824-8e31e11e40c2?w=1200&q=80',
        };
    }

    private function getAyahs(): array
    {
        return [
            [
                'slug'     => 'quran-baqarah-196-hajj',
                'title'    => 'সূরা বাকারা আয়াত ১৯৬ — হজ ও উমরা সম্পূর্ণ করার নির্দেশ',
                'category' => 'quran-hajj',
                'excerpt'  => 'আল্লাহর জন্য হজ ও উমরা সম্পন্ন করার নির্দেশ দেওয়া হয়েছে এই আয়াতে।',
                'body'     => $this->renderAyah(
                    arabic: 'وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ ۚ فَإِنْ أُحْصِرْتُمْ فَمَا اسْتَيْسَرَ مِنَ الْهَدْيِ',
                    transliteration: 'ওয়া আতিম্মুল হাজ্জা ওয়াল উমরাতা লিল্লাহ — ফাইন উহসিরতুম ফামাস তাইসারা মিনাল হাদঈ',
                    translation: 'আর তোমরা আল্লাহর জন্য হজ ও উমরাহ পূর্ণ করো। যদি তোমরা বাধাগ্রস্ত হও, তাহলে সহজলভ্য কোরবানি করো।',
                    source: 'সূরা বাকারা, আয়াত ১৯৬',
                    tafsir: 'এই আয়াতে আল্লাহ হজ ও উমরা সম্পন্ন করার নির্দেশ দিয়েছেন। "লিল্লাহ" মানে শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য — কোনো লোক দেখানো বা দুনিয়াবি উদ্দেশ্য নয়।'
                ),
            ],
            [
                'slug'     => 'quran-baqarah-197-hajj-months',
                'title'    => 'সূরা বাকারা আয়াত ১৯৭ — হজের মাস ও আদব',
                'category' => 'quran-hajj',
                'excerpt'  => 'হজের নির্ধারিত মাস এবং হজের সময়কার আচরণবিধি সম্পর্কে আল্লাহর নির্দেশ।',
                'body'     => $this->renderAyah(
                    arabic: 'الْحَجُّ أَشْهُرٌ مَّعْلُومَاتٌ ۚ فَمَن فَرَضَ فِيهِنَّ الْحَجَّ فَلَا رَفَثَ وَلَا فُسُوقَ وَلَا جِدَالَ فِي الْحَجِّ',
                    transliteration: 'আলহাজ্জু আশহুরুম মা\'লুমাত — ফামান ফারাদা ফিহিন্নাল হাজ্জা ফালা রাফাসা ওয়ালা ফুসূকা ওয়ালা জিদালা ফিল হাজ্জ',
                    translation: 'হজের জন্য নির্দিষ্ট মাস আছে। যে ব্যক্তি এ মাসগুলোতে হজের ইচ্ছা পোষণ করে, সে যেন অশ্লীল কথা, পাপ কাজ ও ঝগড়া-বিবাদ থেকে বিরত থাকে।',
                    source: 'সূরা বাকারা, আয়াত ১৯৭',
                    tafsir: 'হজের মাস হলো শাওয়াল, জিলকাদ ও জিলহজের প্রথম দশ দিন। এই সময়ে অশ্লীলতা (রাফাস), পাপাচার (ফুসুক) ও ঝগড়া (জিদাল) নিষেধ।'
                ),
            ],
            [
                'slug'     => 'quran-imran-97-hajj-fardh',
                'title'    => 'সূরা আলে ইমরান আয়াত ৯৬-৯৭ — হজের ফরজিয়াত',
                'category' => 'quran-hajj',
                'excerpt'  => 'মানবজাতির জন্য প্রথম ইবাদতের স্থান মক্কা এবং হজ ফরজ হওয়ার ঘোষণা।',
                'body'     => $this->renderAyah(
                    arabic: 'وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا ۚ وَمَن كَفَرَ فَإِنَّ اللَّهَ غَنِيٌّ عَنِ الْعَالَمِينَ',
                    transliteration: 'ওয়া লিল্লাহি আলান্নাসি হিজ্জুল বাইতি মানিস তাত্বা\'আ ইলাইহি সাবিলা — ওয়ামান কাফারা ফাইন্নাল্লাহা গানিয়্যুন আনিল আ\'লামীন',
                    translation: 'যে লোকের সামর্থ্য আছে তার উপর আল্লাহর জন্য বায়তুল্লাহর হজ করা ফরজ। আর যে ব্যক্তি অস্বীকার করে, আল্লাহ সৃষ্টিজগত থেকে বেনিয়াজ।',
                    source: 'সূরা আলে ইমরান, আয়াত ৯৭',
                    tafsir: 'এই আয়াতে স্পষ্টভাবে হজ ফরজ ঘোষণা করা হয়েছে। "সামর্থ্য" বলতে শারীরিক সুস্থতা, আর্থিক সক্ষমতা ও নিরাপদ পথ বোঝায়।'
                ),
            ],
            [
                'slug'     => 'quran-hajj-2227-ibrahim-adhan',
                'title'    => 'সূরা হজ আয়াত ২৭-২৯ — ইবরাহিম (আ.)-এর হজের আযান',
                'category' => 'quran-hajj',
                'excerpt'  => 'আল্লাহ ইবরাহিম (আ.)-কে সারা বিশ্বে হজের জন্য ডাক দিতে বললেন।',
                'body'     => $this->renderAyah(
                    arabic: 'وَأَذِّن فِي النَّاسِ بِالْحَجِّ يَأْتُوكَ رِجَالًا وَعَلَىٰ كُلِّ ضَامِرٍ يَأْتِينَ مِن كُلِّ فَجٍّ عَمِيقٍ',
                    transliteration: 'ওয়া আয্যিন ফিন্নাসি বিল হাজ্জি ইয়াতূকা রিজালান ওয়া আলা কুল্লি দ্বামিরিন ইয়াতীনা মিন কুল্লি ফাজ্জিন আমীক',
                    translation: 'মানুষের মধ্যে হজের জন্য ঘোষণা দাও, তারা তোমার কাছে আসবে পায়ে হেঁটে এবং সব দূরবর্তী পথ থেকে কৃশকায় উটের পিঠে চড়ে।',
                    source: 'সূরা হজ, আয়াত ২৭',
                    tafsir: 'হযরত ইবরাহিম (আ.) কাবাঘর নির্মাণের পর আল্লাহর আদেশে ঘোষণা দিলেন। সে ডাক আজও প্রতি বছর লক্ষ লক্ষ মুসলমানের হৃদয়ে অনুরণিত হয়।'
                ),
            ],
            [
                'slug'     => 'quran-fatiha-complete',
                'title'    => 'সূরা ফাতিহা — কুরআনের মা',
                'category' => 'quran-surah',
                'excerpt'  => 'পবিত্র কুরআনের প্রথম সূরা যা প্রতি নামাজে পাঠ করা ফরজ।',
                'body'     => $this->renderAyah(
                    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ — الرَّحْمَٰنِ الرَّحِيمِ — مَالِكِ يَوْمِ الدِّينِ — إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ — اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ — صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
                    transliteration: 'বিসমিল্লাহির রাহমানির রাহিম — আলহামদু লিল্লাহি রাব্বিল আলামীন — আর রাহমানির রাহিম — মালিকি ইয়াওমিদ্দীন — ইয়্যাকা না\'বুদু ওয়া ইয়্যাকা নাস্তাঈন — ইহদিনাস সিরাত্বাল মুস্তাকীম — সিরাত্বাল্লাজিনা আনআ\'মতা আলাইহিম গাইরিল মাগদ্বুবি আলাইহিম ওয়ালাদ্দ্বাল্লীন',
                    translation: 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু। সমস্ত প্রশংসা আল্লাহর, যিনি বিশ্বজগতের পালনকর্তা। তিনি পরম করুণাময় ও অসীম দয়ালু। তিনি বিচার দিনের মালিক। আমরা শুধু তোমারই ইবাদত করি এবং শুধু তোমারই কাছে সাহায্য প্রার্থনা করি। আমাদের সরল পথ দেখাও।',
                    source: 'সূরা ফাতিহা (১:১-৭)',
                    tafsir: 'সূরা ফাতিহাকে "উম্মুল কুরআন" (কুরআনের মা) বলা হয়। প্রতিদিন পাঁচ ওয়াক্ত নামাজে কমপক্ষে ১৭ বার এটি পাঠ করতে হয়।'
                ),
            ],
            [
                'slug'     => 'quran-ikhlas-tawhid',
                'title'    => 'সূরা ইখলাস — একত্ববাদের সারাংশ',
                'category' => 'quran-iman',
                'excerpt'  => 'সূরা ইখলাস পুরো কুরআনের এক-তৃতীয়াংশের সমতুল্য।',
                'body'     => $this->renderAyah(
                    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ — اللَّهُ الصَّمَدُ — لَمْ يَلِدْ وَلَمْ يُولَدْ — وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
                    transliteration: 'কুল হুওয়াল্লাহু আহাদ — আল্লাহুস সামাদ — লাম ইয়ালিদ ওয়ালাম ইউলাদ — ওয়ালাম ইয়াকুল লাহু কুফুওয়ান আহাদ',
                    translation: 'বলুন: তিনি আল্লাহ, একক ও অদ্বিতীয়। আল্লাহ কারো মুখাপেক্ষী নন (তিনি ঐশী শক্তির উৎস)। তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি। আর তাঁর সমকক্ষ কেউ নেই।',
                    source: 'সূরা ইখলাস (১১২:১-৪)',
                    tafsir: 'রাসূলুল্লাহ (সা.) বলেছেন এই সূরাটি কুরআনের এক-তৃতীয়াংশের সমতুল্য। (বুখারী ৫০১৫) প্রতিদিন সকাল-সন্ধ্যায় তিনবার পড়লে পুরো কুরআন খতমের সওয়াব।'
                ),
            ],
        ];
    }

    private function renderAyah(
        string $arabic,
        string $transliteration,
        string $translation,
        string $source,
        string $tafsir
    ): string {
        return <<<HTML
<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-6 mb-6">
  <p class="text-2xl leading-loose text-right font-arabic" dir="rtl">{$arabic}</p>
</div>

<div class="rounded-xl bg-[hsl(var(--muted))] p-4 mb-4">
  <p class="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">উচ্চারণ (বাংলা)</p>
  <p class="italic">{$transliteration}</p>
</div>

<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 mb-4">
  <p class="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">বাংলা অনুবাদ</p>
  <p class="text-base">{$translation}</p>
</div>

<div class="flex items-center gap-2 mb-4">
  <span class="rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-3 py-1 text-xs font-semibold">📖 {$source}</span>
</div>

<div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
  <p class="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">তাফসীর / ব্যাখ্যা</p>
  <p class="text-sm">{$tafsir}</p>
</div>
HTML;
    }

    // ──────────────────────────────────────────────────────────────────────
    // IBADAH GUIDES
    // ──────────────────────────────────────────────────────────────────────
    private function seedIbadah(): void
    {
        $ibadahType = PostType::where('slug', 'ibadah')->first();
        if (!$ibadahType) return;

        $catMap = Category::whereIn('slug', [
            'ibadah-salah', 'ibadah-sawm', 'ibadah-zakat',
            'ibadah-hajj', 'ibadah-quran', 'ibadah-tahajjud',
        ])->pluck('id', 'slug');

        foreach ($this->getIbadahArticles() as $item) {
            Article::updateOrCreate(['slug' => $item['slug']], [
                'title'               => $item['title'],
                'excerpt'             => $item['excerpt'],
                'body'                => $item['body'],
                'featured_image_path' => $this->categoryImage($item['category']),
                'category_id'         => $catMap[$item['category']] ?? null,
                'post_type_id'        => $ibadahType->id,
                'is_breaking'         => false,
                'published_at'        => now()->subDays(rand(1, 60)),
                'visibility'          => 'public',
            ]);
        }
    }

    private function getIbadahArticles(): array
    {
        return [
            [
                'slug'     => 'salah-five-times-guide',
                'title'    => 'পাঁচ ওয়াক্ত নামাজ — ফরজ, সুন্নাত ও পদ্ধতি',
                'category' => 'ibadah-salah',
                'excerpt'  => 'ফজর, জোহর, আসর, মাগরিব ও ইশা নামাজের সময়, রাকাত সংখ্যা ও পদ্ধতি।',
                'body'     => <<<HTML
<h2>পাঁচ ওয়াক্ত নামাজ</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6 text-center">
  <p class="text-xl font-arabic" dir="rtl">إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا</p>
  <p class="text-sm italic mt-2">ইন্নাস সালাতা কানাত আলাল মু\'মিনিনা কিতাবাম মাওকূতা</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">"নামাজ মুমিনদের উপর নির্দিষ্ট সময়ে ফরজ।" — সূরা নিসা ৪:১০৩</p>
</div>

<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead class="bg-[hsl(var(--muted))]">
      <tr>
        <th class="border border-[hsl(var(--border))] px-3 py-2">নামাজ</th>
        <th class="border border-[hsl(var(--border))] px-3 py-2">ফরজ</th>
        <th class="border border-[hsl(var(--border))] px-3 py-2">সুন্নাত</th>
        <th class="border border-[hsl(var(--border))] px-3 py-2">নফল</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-[hsl(var(--border))] px-3 py-2">ফজর</td><td class="border border-[hsl(var(--border))] px-3 py-2">২</td><td class="border border-[hsl(var(--border))] px-3 py-2">২ (আগে)</td><td class="border border-[hsl(var(--border))] px-3 py-2">—</td></tr>
      <tr class="bg-[hsl(var(--muted)/0.3)]"><td class="border border-[hsl(var(--border))] px-3 py-2">জোহর</td><td class="border border-[hsl(var(--border))] px-3 py-2">৪</td><td class="border border-[hsl(var(--border))] px-3 py-2">৪ আগে + ২ পরে</td><td class="border border-[hsl(var(--border))] px-3 py-2">২</td></tr>
      <tr><td class="border border-[hsl(var(--border))] px-3 py-2">আসর</td><td class="border border-[hsl(var(--border))] px-3 py-2">৪</td><td class="border border-[hsl(var(--border))] px-3 py-2">৪ আগে (মুস্তাহাব)</td><td class="border border-[hsl(var(--border))] px-3 py-2">—</td></tr>
      <tr class="bg-[hsl(var(--muted)/0.3)]"><td class="border border-[hsl(var(--border))] px-3 py-2">মাগরিব</td><td class="border border-[hsl(var(--border))] px-3 py-2">৩</td><td class="border border-[hsl(var(--border))] px-3 py-2">২ পরে</td><td class="border border-[hsl(var(--border))] px-3 py-2">২</td></tr>
      <tr><td class="border border-[hsl(var(--border))] px-3 py-2">ইশা</td><td class="border border-[hsl(var(--border))] px-3 py-2">৪</td><td class="border border-[hsl(var(--border))] px-3 py-2">৪ আগে + ২ পরে</td><td class="border border-[hsl(var(--border))] px-3 py-2">৩ বিতর</td></tr>
    </tbody>
  </table>
</div>

<h3>নামাজের রুকনসমূহ (ফরজ)</h3>
<ol class="space-y-1 text-sm">
  <li>১. তাকবীরে তাহরীমা — "আল্লাহু আকবার" বলে নামাজ শুরু করা</li>
  <li>২. দাঁড়ানো (কিয়াম) — ফরজ নামাজে দাঁড়ানো</li>
  <li>৩. কিরাত — সূরা ফাতিহা পাঠ করা</li>
  <li>৪. রুকু — কোমর সমানভাবে বাঁকানো</li>
  <li>৫. সিজদা — দুটি সিজদা করা</li>
  <li>৬. শেষ বৈঠক — শেষ রাকাতে বসা</li>
  <li>৭. সালাম — "আস-সালামু আলাইকুম ওয়া রাহমাতুল্লাহ" বলে শেষ করা</li>
</ol>
HTML,
            ],
            [
                'slug'     => 'ramadan-fasting-guide',
                'title'    => 'রমজানের রোজা — নিয়ম, ফযিলত ও করণীয়',
                'category' => 'ibadah-sawm',
                'excerpt'  => 'রমজান মাসের রোজা কীভাবে রাখতে হবে, কী কী রোজা ভাঙে এবং রমজানের বিশেষ আমল।',
                'body'     => <<<HTML
<h2>রমজানের রোজা</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6 text-center">
  <p class="text-xl font-arabic" dir="rtl">يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ</p>
  <p class="text-sm italic mt-2">ইয়া আইয়্যুহাল্লাজিনা আমানু কুতিবা আলাইকুমুস সিয়ামু কামা কুতিবা আলাল্লাজিনা মিন কাবলিকুম লাআল্লাকুম তাত্তাকুন</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">"হে মুমিনগণ! তোমাদের উপর রোজা ফরজ করা হয়েছে..." — সূরা বাকারা ২:১৮৩</p>
</div>

<h3>সেহরি ও ইফতার</h3>
<ul class="space-y-2">
  <li>🌅 <strong>সেহরি:</strong> সুবহে সাদিকের আগে খাওয়া শেষ করুন। সেহরি খাওয়া সুন্নাত।</li>
  <li>🌆 <strong>ইফতার:</strong> সূর্যাস্তের সাথে সাথে ইফতার করুন। বিলম্ব না করাই উত্তম।</li>
  <li>দোয়ার সাথে ইফতার: <span class="font-arabic" dir="rtl">اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ</span></li>
</ul>

<h3>রোজা ভাঙার কারণ</h3>
<div class="grid grid-cols-2 gap-3 my-4">
  <div class="rounded-xl bg-[hsl(var(--destructive)/0.05)] border border-[hsl(var(--destructive)/0.2)] p-3">
    <p class="text-xs font-semibold text-[hsl(var(--destructive))] mb-1">🚫 রোজা ভাঙে (কাযা + কাফফারা)</p>
    <ul class="text-xs space-y-1">
      <li>ইচ্ছাকৃতভাবে স্ত্রী সহবাস</li>
      <li>ইচ্ছাকৃতভাবে পানাহার</li>
    </ul>
  </div>
  <div class="rounded-xl bg-[hsl(var(--destructive)/0.05)] border border-[hsl(var(--destructive)/0.2)] p-3">
    <p class="text-xs font-semibold text-[hsl(var(--destructive))] mb-1">🚫 রোজা ভাঙে (শুধু কাযা)</p>
    <ul class="text-xs space-y-1">
      <li>ভুলে পানাহার করলে রোজা ভাঙে না, কিন্তু ইচ্ছাকৃতভাবে ভাঙলে কাযা</li>
      <li>বমি হলে রোজা ভাঙে না, কিন্তু ইচ্ছাকৃতভাবে বমি করলে কাযা</li>
    </ul>
  </div>
</div>

<h3>রমজানের বিশেষ আমল</h3>
<ul class="space-y-2">
  <li>📖 প্রতিদিন কুরআন তিলাওয়াত করুন (১ পারা করে)</li>
  <li>🌙 তারাবির নামাজ আদায় করুন (২০ রাকাত)</li>
  <li>🤲 বেশি বেশি ইস্তিগফার ও দোয়া করুন</li>
  <li>💰 যাকাত ও সাদাকাহ দিন</li>
  <li>🌟 শেষ ১০ রাতে লাইলাতুল কদর তালাশ করুন</li>
</ul>
HTML,
            ],
            [
                'slug'     => 'zakat-calculation-guide',
                'title'    => 'যাকাত — হিসাব, নিসাব ও পদ্ধতি',
                'category' => 'ibadah-zakat',
                'excerpt'  => 'যাকাতের নিসাব কত, কার উপর ফরজ, কীভাবে হিসাব করতে হয় এবং কাদের দিতে হয়।',
                'body'     => <<<HTML
<h2>যাকাত — ইসলামের তৃতীয় স্তম্ভ</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6 text-center">
  <p class="text-xl font-arabic" dir="rtl">وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ</p>
  <p class="text-sm italic mt-2">ওয়া আকীমুস সালাতা ওয়া আতুয্যাকাতা ওয়ারকাউ মায়ার রাকিঈন</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">"নামাজ কায়েম করো, যাকাত দাও।" — সূরা বাকারা ২:৪৩</p>
</div>

<h3>যাকাতের নিসাব (২০২৪-২৫)</h3>
<div class="overflow-x-auto my-4">
  <table class="w-full text-sm border-collapse">
    <thead class="bg-[hsl(var(--muted))]">
      <tr>
        <th class="border border-[hsl(var(--border))] px-3 py-2">সম্পদের ধরন</th>
        <th class="border border-[hsl(var(--border))] px-3 py-2">নিসাব</th>
        <th class="border border-[hsl(var(--border))] px-3 py-2">হার</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-[hsl(var(--border))] px-3 py-2">স্বর্ণ</td><td class="border border-[hsl(var(--border))] px-3 py-2">৮৫ গ্রাম</td><td class="border border-[hsl(var(--border))] px-3 py-2">২.৫%</td></tr>
      <tr class="bg-[hsl(var(--muted)/0.3)]"><td class="border border-[hsl(var(--border))] px-3 py-2">রূপা</td><td class="border border-[hsl(var(--border))] px-3 py-2">৫৯৫ গ্রাম</td><td class="border border-[hsl(var(--border))] px-3 py-2">২.৫%</td></tr>
      <tr><td class="border border-[hsl(var(--border))] px-3 py-2">নগদ অর্থ</td><td class="border border-[hsl(var(--border))] px-3 py-2">৮৫ গ্রাম স্বর্ণের মূল্য সমপরিমাণ</td><td class="border border-[hsl(var(--border))] px-3 py-2">২.৫%</td></tr>
      <tr class="bg-[hsl(var(--muted)/0.3)]"><td class="border border-[hsl(var(--border))] px-3 py-2">ব্যবসায়ী পণ্য</td><td class="border border-[hsl(var(--border))] px-3 py-2">নিসাব পরিমাণ</td><td class="border border-[hsl(var(--border))] px-3 py-2">২.৫%</td></tr>
    </tbody>
  </table>
</div>

<h3>যাকাত পাওয়ার হকদার (৮ শ্রেণি)</h3>
<div class="grid grid-cols-2 gap-2 my-4">
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 text-sm">১. ফকির (অভাবী)</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 text-sm">২. মিসকিন (দরিদ্র)</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 text-sm">৩. যাকাত সংগ্রহকারী</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 text-sm">৪. ইসলামে নতুন</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 text-sm">৫. ঋণগ্রস্ত</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 text-sm">৬. আল্লাহর পথে</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 text-sm">৭. মুসাফির</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-2 text-sm">৮. দাস মুক্তি</div>
</div>

<p class="text-sm">(সূরা তাওবা ৯:৬০)</p>
HTML,
            ],
            [
                'slug'     => 'tahajjud-night-prayer',
                'title'    => 'তাহাজ্জুদ নামাজ — রাতের গোপন ইবাদাহ',
                'category' => 'ibadah-tahajjud',
                'excerpt'  => 'তাহাজ্জুদ নামাজের গুরুত্ব, পদ্ধতি ও সময় সম্পর্কে বিস্তারিত।',
                'body'     => <<<HTML
<h2>তাহাজ্জুদ — রাত্রির আধ্যাত্মিক শক্তি</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6 text-center">
  <p class="text-xl font-arabic" dir="rtl">وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا</p>
  <p class="text-sm italic mt-2">ওয়া মিনাল্লাইলি ফা তাহাজ্জাদ বিহি নাফিলাতাল্লাক</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">"রাতের কিছু অংশে তাহাজ্জুদ পড়ুন।" — সূরা ইসরা ১৭:৭৯</p>
</div>

<h3>তাহাজ্জুদের সময়</h3>
<p>এশার নামাজের পর থেকে ফজরের আগ পর্যন্ত — সর্বোত্তম হলো রাতের শেষ তৃতীয়াংশে।</p>

<h3>তাহাজ্জুদের ফযিলত</h3>
<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 my-4">
  <p class="text-sm">রাসূলুল্লাহ (সা.) বলেছেন: <strong>"প্রতি রাতে আল্লাহ তাআলা রাতের শেষ তৃতীয়াংশে দুনিয়ার আকাশে নেমে আসেন এবং বলেন: কে আছ যে আমাকে ডাকবে? আমি তার ডাকে সাড়া দেব।"</strong></p>
  <p class="text-xs text-[hsl(var(--muted-foreground))] mt-2">— বুখারী ১১৪৫, মুসলিম ৭৫৮</p>
</div>

<h3>তাহাজ্জুদ কীভাবে পড়বেন</h3>
<ol class="space-y-2 text-sm">
  <li><strong>১.</strong> ঘুম থেকে উঠে ওযু করুন</li>
  <li><strong>২.</strong> দুটি হালকা রাকাত দিয়ে শুরু করুন</li>
  <li><strong>৩.</strong> ২, ৪, ৬ বা ৮ রাকাত পড়ুন — দুই দুই রাকাত করে</li>
  <li><strong>৪.</strong> দীর্ঘ কিরাত ও রুকু-সিজদায় বেশি সময় দিন</li>
  <li><strong>৫.</strong> সিজদায় মন খুলে দোয়া করুন</li>
</ol>
HTML,
            ],
        ];
    }

    // ──────────────────────────────────────────────────────────────────────
    // ISLAMIC STORIES
    // ──────────────────────────────────────────────────────────────────────
    private function seedStories(): void
    {
        $storyType = PostType::where('slug', 'islamic-story')->first();
        if (!$storyType) return;

        $catMap = Category::whereIn('slug', [
            'story-prophet', 'story-sahabi', 'story-hajj',
        ])->pluck('id', 'slug');

        foreach ($this->getStories() as $item) {
            Article::updateOrCreate(['slug' => $item['slug']], [
                'title'               => $item['title'],
                'excerpt'             => $item['excerpt'],
                'body'                => $item['body'],
                'featured_image_path' => $this->categoryImage($item['category']),
                'category_id'         => $catMap[$item['category']] ?? null,
                'post_type_id'        => $storyType->id,
                'is_breaking'         => false,
                'published_at'        => now()->subDays(rand(1, 90)),
                'visibility'          => 'public',
            ]);
        }
    }

    private function getStories(): array
    {
        return [
            [
                'slug'     => 'story-ibrahim-kaaba-construction',
                'title'    => 'হযরত ইবরাহিম (আ.) ও কাবাঘর নির্মাণের ইতিহাস',
                'category' => 'story-prophet',
                'excerpt'  => 'আল্লাহর নির্দেশে হযরত ইবরাহিম (আ.) ও ইসমাইল (আ.) কীভাবে পবিত্র কাবাঘর নির্মাণ করেছিলেন।',
                'body'     => <<<HTML
<h2>কাবাঘর নির্মাণের পবিত্র ইতিহাস</h2>

<div class="rounded-2xl bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] p-5 mb-6 text-center">
  <p class="text-xl font-arabic" dir="rtl">وَإِذْ يَرْفَعُ إِبْرَاهِيمُ الْقَوَاعِدَ مِنَ الْبَيْتِ وَإِسْمَاعِيلُ</p>
  <p class="text-sm italic mt-2">ওয়া ইয যারফাউ ইবরাহীমুল কাওয়াইদা মিনাল বাইতি ওয়া ইসমাঈল</p>
  <p class="text-sm text-[hsl(var(--muted-foreground))] mt-1">"স্মরণ করুন, যখন ইবরাহিম ও ইসমাইল বায়তুল্লাহর ভিত্তিপ্রস্তর স্থাপন করছিলেন।" — সূরা বাকারা ২:১২৭</p>
</div>

<h3>শুরুর গল্প</h3>
<p>বহু বছর আগে, বর্তমান মক্কার মরুভূমিতে ছিল শুধু বালু আর পাথর। আল্লাহর আদেশে হযরত ইবরাহিম (আ.) তাঁর স্ত্রী হাজেরা (আ.) ও শিশুপুত্র ইসমাইলকে এখানে রেখে গিয়েছিলেন।</p>

<div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4 my-4">
  <h4 class="font-semibold text-sm mb-2">হাজেরা (আ.)-এর প্রশ্ন</h4>
  <p class="text-sm italic">"হে ইবরাহিম! আল্লাহ কি তোমাকে এই কাজের আদেশ দিয়েছেন?"</p>
  <p class="text-sm mt-1 italic">"হ্যাঁ।"</p>
  <p class="text-sm mt-1">"তাহলে আল্লাহ আমাদের নিয়ে যাবেন না।" — বুখারী ৩৩৬৪</p>
</div>

<h3>যমযমের পানি — হাজেরার ত্যাগের পুরস্কার</h3>
<p>ক্ষুধা-তৃষ্ণায় শিশু ইসমাইল কাঁদতে লাগলেন। হাজেরা (আ.) পানির খোঁজে সাফা ও মারওয়া পাহাড়ের মধ্যে সাতবার দৌড়ালেন। তখন আল্লাহর ইচ্ছায় ইসমাইলের পায়ের কাছে যমযমের পানি উছলে উঠল। হাজেরা বললেন: <em>"যম যম!"</em> (থামো থামো)।</p>

<h3>কাবাঘর নির্মাণ</h3>
<p>বছর পরে, আল্লাহ ইবরাহিম (আ.)-কে কাবাঘর নির্মাণের আদেশ দিলেন। ইবরাহিম (আ.) ও কিশোর ইসমাইল (আ.) একসাথে ভিত তুললেন, দেওয়াল গড়লেন। নির্মাণের সময় তারা দোয়া করলেন:</p>

<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 my-4">
  <p class="text-xl font-arabic" dir="rtl">رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ</p>
  <p class="text-sm italic mt-2">রাব্বানা তাকাব্বাল মিন্না — ইন্নাকা আংতাস সামীউল আলীম</p>
  <p class="text-sm mt-1">"হে আমাদের রব! আমাদের থেকে কবুল করো। নিশ্চয়ই তুমি সব শুনছ ও জানছ।" — সূরা বাকারা ২:১২৭</p>
</div>

<h3>হাজরে আসওয়াদ — কালো পাথর</h3>
<p>নির্মাণের শেষে কর্নার পাথরের জন্য ইসমাইল (আ.) অন্য পাথর আনলেও ইবরাহিম (আ.) তা পছন্দ করলেন না। তারপর জিবরাইল (আ.) জান্নাত থেকে হাজরে আসওয়াদ নিয়ে এলেন। প্রথমে এটি দুধের চেয়েও সাদা ছিল, মানুষের পাপের কারণে কালো হয়ে গেছে।</p>

<h3>হজের আযান</h3>
<p>কাবাঘর নির্মাণের পর আল্লাহ ইবরাহিম (আ.)-কে আদেশ দিলেন: সারা বিশ্বে হজের ঘোষণা দিতে। ইবরাহিম (আ.) জিজ্ঞেস করলেন: আমার কণ্ঠস্বর কি পৌঁছাবে? আল্লাহ বললেন: তুমি ডাকো, পৌঁছে দেওয়া আমার কাজ। সেই ডাক আজও প্রতিধ্বনিত হয় — প্রতি বছর ১০ লক্ষেরও বেশি হাজী মক্কায় আসেন।</p>
HTML,
            ],
            [
                'slug'     => 'story-hajjar-saee-history',
                'title'    => 'হাজেরা (আ.) ও সাফা-মারওয়া সাঈর ইতিহাস',
                'category' => 'story-hajj',
                'excerpt'  => 'মা হাজেরার অসীম ধৈর্য ও আল্লাহর প্রতি আস্থার অবিশ্বাস্য ঘটনা — যা আজও হজের অংশ।',
                'body'     => <<<HTML
<h2>হাজেরা (আ.) — ধৈর্যের এক অনন্য দৃষ্টান্ত</h2>

<p>হযরত হাজেরা (আ.) ছিলেন হযরত ইবরাহিম (আ.)-এর দ্বিতীয় স্ত্রী। তিনি ছিলেন একজন মিশরীয় দাসী যাকে সারা (আ.) ইবরাহিম (আ.)-কে উপহার দিয়েছিলেন।</p>

<h3>মরুভূমিতে একা</h3>
<p>আল্লাহর আদেশে ইবরাহিম (আ.) হাজেরা ও শিশু ইসমাইলকে বর্তমান মক্কার মরুভূমিতে রেখে যাচ্ছিলেন। পানি ও খেজুর ছাড়া আর কিছু নেই। হাজেরা জিজ্ঞেস করলেন: "আমাদের এই নির্জন উপত্যকায় রেখে যাচ্ছ কেন?"</p>
<p>ইবরাহিম (আ.) কোনো জবাব নেই — কারণ এটি আল্লাহর আদেশ ব্যাখ্যা করা কঠিন। হাজেরা বুঝলেন এবং বললেন: <em>"আল্লাহ কি তোমাকে এই কাজের নির্দেশ দিয়েছেন?" ইবরাহিম বললেন: "হ্যাঁ।" হাজেরা শান্তভাবে বললেন: "তাহলে আল্লাহ আমাদের ধ্বংস করবেন না।"</em></p>

<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 my-4">
  <p class="text-sm font-semibold">📖 শিক্ষা</p>
  <p class="text-sm mt-1">আল্লাহর উপর সম্পূর্ণ তাওয়াক্কুল (ভরসা) রাখলে আল্লাহ কখনো নিরাশ করেন না।</p>
</div>

<h3>সাফা-মারওয়া — ভালোবাসার দৌড়</h3>
<p>পানি শেষ হয়ে গেলে শিশু ইসমাইল কাঁদতে লাগলেন। মা হাজেরা পাগলপ্রায় হয়ে সাফা পাহাড়ে উঠলেন — পানির খোঁজে। পানি দেখতে পেলেন না। মারওয়ায় দৌড়ালেন। আবার সাফায়। এভাবে সাত বার দৌড়ালেন—</p>

<div class="grid grid-cols-2 gap-2 my-4 text-sm">
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-3 text-center">🏔️ সাফা → মারওয়া = ১</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-3 text-center">🏔️ মারওয়া → সাফা = ২</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-3 text-center">... এভাবে মোট ৭ বার</div>
  <div class="rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-3 text-center">মারওয়ায় শেষ = ৭</div>
</div>

<p>আল্লাহ সুবহানাহু তাআলা হাজেরার ত্যাগ ও আল্লাহর উপর আস্থাকে এতটাই পছন্দ করলেন যে এই দৌড়কে হজ ও উমরার একটি অবিচ্ছেদ্য অংশ করে দিলেন। প্রতি বছর কোটি মুসলমান এই সাঈ করে হাজেরার স্মৃতিকে জীবিত রাখেন।</p>

<h3>যমযমের অলৌকিক উৎস</h3>
<p>সপ্তমবার ফেরার পথে হাজেরা দেখলেন ইসমাইলের পা নাড়ানোর সাথে সাথে মাটি থেকে পানি বের হচ্ছে! হাজেরা সেই পানিকে ধরে রাখতে চাইলেন এবং মাটির চরদিকে বাঁধ দিলেন। বললেন: "যম্ম যম্ম" — অর্থাৎ "থাকো, থাকো"! রাসূলুল্লাহ (সা.) বলেছেন: যদি হাজেরা ছেড়ে দিতেন, এটি নদী হয়ে বয়ে যেত।</p>
HTML,
            ],
            [
                'slug'     => 'story-umar-mosque-expansion',
                'title'    => 'হযরত উমর (রা.) ও মসজিদে নববীর সম্প্রসারণ',
                'category' => 'story-sahabi',
                'excerpt'  => 'ইসলামের দ্বিতীয় খলিফা হযরত উমর (রা.) কীভাবে মদিনার মসজিদ সম্প্রসারণ করেছিলেন।',
                'body'     => <<<HTML
<h2>হযরত উমর (রা.) — ন্যায়ের প্রতীক</h2>

<p>হযরত উমর ইবনুল খাত্তাব (রা.) ছিলেন ইসলামের দ্বিতীয় খলিফা (৬৩৪-৬৪৪ খ্রি.)। তাঁর শাসনামলে ইসলামি খিলাফত অসাধারণ বিস্তার লাভ করে।</p>

<h3>মসজিদে নববীর সম্প্রসারণ</h3>
<p>রাসূলুল্লাহ (সা.)-এর আমলে মসজিদে নববী ছিল একটি ছোট ভবন। মুসলমানের সংখ্যা বাড়তে থাকলে হযরত উমর (রা.) মসজিদ সম্প্রসারণের প্রয়োজনীয়তা অনুভব করলেন।</p>

<div class="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4 my-4">
  <p class="text-sm">তিনি পার্শ্ববর্তী জমির মালিকদের কাছে থেকে ন্যায্য মূল্যে জমি কিনে, মসজিদের আয়তন ৫,০০০ বর্গ মিটার থেকে ৭,৫০০ বর্গ মিটারে বাড়ালেন।</p>
</div>

<h3>উমর (রা.)-এর ন্যায়বিচারের গল্প</h3>
<p>একবার মিশরের গভর্নর হযরত আমর ইবনুল আস (রা.)-এর ছেলে একজন মিশরীয় কপ্ট খ্রিস্টানকে অন্যায়ভাবে প্রহার করলেন। ক্ষতিগ্রস্ত লোকটি মদিনায় উমর (রা.)-এর কাছে অভিযোগ করলেন।</p>
<p>উমর (রা.) পিতা ও পুত্র উভয়কে মদিনায় ডাকলেন এবং সেই কপ্ট মিশরীয়কে লাঠি দিয়ে গভর্নরের ছেলেকে প্রহার করতে বললেন। তারপর বলললেন বিখ্যাত সেই উক্তি:</p>

<div class="rounded-xl bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.3)] p-4 my-4">
  <p class="text-lg font-semibold italic">"মেতা আস্তাআ্ব্আদ্তুমুন্নাস ওয়া কাদ ওয়ালাদাথুম উম্মাহাতুহুম আহরারা"</p>
  <p class="text-sm mt-2">"কতদিন থেকে তোমরা মানুষকে দাস বানিয়েছ — যাদের মা তাদের স্বাধীনভাবে জন্ম দিয়েছে?"</p>
</div>

<h3>উমর (রা.)-এর শাসনের বৈশিষ্ট্য</h3>
<ul class="space-y-2">
  <li>✅ প্রতি রাতে মদিনার অলিগলিতে ঘুরে জনগণের খোঁজ নিতেন</li>
  <li>✅ খলিফা হওয়ার পরও বাজারে নিজে কাঁচামাল বহন করতেন</li>
  <li>✅ সরকারি সম্পদ নিজের জন্য এক পয়সাও ব্যবহার করতেন না</li>
  <li>✅ প্রতিটি মজলুমের জন্য তাঁর দরজা সবসময় খোলা ছিল</li>
</ul>
HTML,
            ],
        ];
    }
}
