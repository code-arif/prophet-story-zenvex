<?php

namespace Database\Seeders\Hajj;

use App\Models\Page;
use App\Models\PostType;
use App\Models\Taxonomy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Seeds dynamic pages using the page builder (builder_data JSON).
 *
 * Prop names must match AdminPageBuilderController::renderBuilderHtml()
 * and resources/js/lib/sbuilder/renderer.js / BlocksView.jsx:
 *   hero       → title, subtitle, btnText, btnHref, textColor, paddingY, align
 *   featureGrid → items[].icon/title/desc/href, cols, gap
 *   postLoop   → postTypeId (int), categoryId (int), count, cols, showExcerpt, orderBy
 *   categoryLoop → taxonomyId (int), count, cols
 *   cta        → title, subtitle, btnText, btnHref, align
 *   heading    → text, level, align, size, weight
 *   stats      → items[].value/label
 *   accordion  → items[].question/answer
 *   alert      → type, title, message
 *   quote      → text, author
 */
class HajjPagesSeeder extends Seeder
{
    private array $ptIds  = [];     // post_type slug → id
    private array $taxIds = [];     // taxonomy  slug → id

    public function run(): void
    {
        // Cache IDs so we don't hit DB per block
        $this->ptIds  = PostType::pluck('id', 'slug')->all();
        $this->taxIds = Taxonomy::pluck('id', 'slug')->all();

        foreach ($this->getPages() as $page) {
            Page::updateOrCreate(['slug' => $page['slug']], [
                'title'        => $page['title'],
                'content'      => null,
                'is_published' => true,
                'use_builder'  => true,
                'visibility'   => 'public',
                'builder_data' => $page['blocks'],
            ]);
        }

        $this->command->info('✅ Hajj pages seeded (builder).');
    }

    private function b(string $type, array $props): array
    {
        return ['id' => (string) Str::uuid(), 'type' => $type, 'props' => $props];
    }

    private function ptId(string $slug): ?int
    {
        return isset($this->ptIds[$slug]) ? (int) $this->ptIds[$slug] : null;
    }

    private function taxId(string $slug): ?int
    {
        return isset($this->taxIds[$slug]) ? (int) $this->taxIds[$slug] : null;
    }

    private function getPages(): array
    {
        return [

            // ── মূল হজ পেজ ─────────────────────────────────────────────
            [
                'slug'  => 'hajj',
                'title' => '🕋 হজ গাইড — সম্পূর্ণ তথ্য',
                'blocks' => [

                    $this->b('hero', [
                        'title'     => '🕋 হজ গাইড',
                        'subtitle'  => 'হজের প্রতিটি ধাপ — ইহরাম থেকে বিদায় তাওয়াফ পর্যন্ত সম্পূর্ণ গাইড বাংলায়।',
                        'bgType'    => 'gradient',
                        'bgGradientFrom' => '#1d4e89',
                        'bgGradientTo'   => '#0f3460',
                        'textColor' => 'text-white',
                        'align'     => 'text-center',
                        'paddingY'  => 'py-16',
                        'btnText'   => 'হজের প্রস্তুতি শুরু করুন',
                        'btnHref'   => '/articles/hajj-niyyat-preparation',
                    ]),

                    $this->b('heading', [
                        'text'   => 'হজের গুরুত্বপূর্ণ ধাপ',
                        'level'  => 'h2',
                        'align'  => 'text-center',
                        'size'   => 'text-2xl',
                        'weight' => 'font-bold',
                    ]),

                    $this->b('featureGrid', [
                        'cols' => 'grid-cols-3',
                        'gap'  => 'gap-4',
                        'items' => [
                            ['icon' => '📋', 'title' => 'হজের প্রস্তুতি',    'desc' => 'নিয়ত, কাগজপত্র, চেকলিস্ট এবং মানসিক প্রস্তুতি।',        'href' => '/articles/hajj-niyyat-preparation'],
                            ['icon' => '🤍', 'title' => 'ইহরাম ও মীকাত',   'desc' => 'ইহরামের পোশাক, মীকাতের বিবরণ ও নিষিদ্ধ কাজ।',            'href' => '/articles/ihram-rules-and-miqat'],
                            ['icon' => '🕋', 'title' => 'তাওয়াফ ও সাঈ',    'desc' => 'কাবাঘর প্রদক্ষিণের নিয়ম ও সাফা-মারওয়া সাঈ।',           'href' => '/articles/tawaf-complete-guide'],
                            ['icon' => '🌅', 'title' => 'আরাফাতের দিন',    'desc' => 'হজের সবচেয়ে গুরুত্বপূর্ণ রুকন — আরাফাতে অবস্থান।',       'href' => '/articles/arafah-day-guide'],
                            ['icon' => '🪨', 'title' => 'মিনা ও জামারাত',  'desc' => 'পাথর মারা, কুরবানি ও মাথা মুণ্ডনের নিয়ম।',               'href' => '/articles/mina-rami-qurbani'],
                            ['icon' => '✨', 'title' => 'হজ পরবর্তী আমল',   'desc' => 'হজ থেকে ফিরে জীবন পরিবর্তনের পথনির্দেশ।',               'href' => '/articles/after-hajj-amal'],
                        ],
                    ]),

                    $this->b('heading', [
                        'text'   => 'হজ গাইড আর্টিকেল',
                        'level'  => 'h2',
                        'align'  => 'text-center',
                        'size'   => 'text-xl',
                        'weight' => 'font-semibold',
                    ]),

                    $this->b('postLoop', [
                        'postTypeId'  => $this->ptId('hajj'),
                        'count'       => 6,
                        'cols'        => 'grid-cols-2',
                        'gap'         => 'gap-4',
                        'showExcerpt' => true,
                        'showImage'   => false,
                        'orderBy'     => 'latest',
                    ]),

                    $this->b('cta', [
                        'title'    => 'হজের দোয়া শিখুন',
                        'subtitle' => 'হজের প্রতিটি ধাপে পড়ার জন্য দোয়া, তালবিয়া ও জিকির।',
                        'btnText'  => 'দোয়া দেখুন',
                        'btnHref'  => '/p/duas',
                        'align'    => 'text-center',
                        'paddingY' => 'py-12',
                    ]),
                ],
            ],

            // ── দোয়া পেজ ────────────────────────────────────────────────
            [
                'slug'  => 'duas',
                'title' => '🤲 দোয়া ও জিকির সংকলন',
                'blocks' => [

                    $this->b('hero', [
                        'title'     => '🤲 দোয়া ও জিকির',
                        'subtitle'  => 'হজ, নামাজ, সকাল-সন্ধ্যা ও দৈনন্দিন জীবনের দোয়া — আরবি + বাংলা উচ্চারণ ও অর্থসহ।',
                        'bgType'    => 'gradient',
                        'bgGradientFrom' => '#1a3c6e',
                        'bgGradientTo'   => '#2d6a4f',
                        'textColor' => 'text-white',
                        'align'     => 'text-center',
                        'paddingY'  => 'py-14',
                    ]),

                    $this->b('stats', [
                        'cols' => 'grid-cols-3',
                        'gap'  => 'gap-4',
                        'items' => [
                            ['value' => '১৬+',   'label' => 'গুরুত্বপূর্ণ দোয়া'],
                            ['value' => '৮',     'label' => 'বিষয়ভিত্তিক ক্যাটাগরি'],
                            ['value' => '১০০%',  'label' => 'আরবি + বাংলা'],
                        ],
                    ]),

                    $this->b('heading', [
                        'text'   => 'দোয়ার বিভাগ',
                        'level'  => 'h2',
                        'align'  => 'text-center',
                        'size'   => 'text-xl',
                        'weight' => 'font-semibold',
                    ]),

                    $this->b('categoryLoop', [
                        'taxonomyId' => $this->taxId('dua-category'),
                        'count'      => 8,
                        'cols'       => 'grid-cols-4',
                        'gap'        => 'gap-3',
                        'showCount'  => true,
                    ]),

                    $this->b('heading', [
                        'text'   => 'সকল দোয়া',
                        'level'  => 'h2',
                        'align'  => 'text-center',
                        'size'   => 'text-xl',
                        'weight' => 'font-semibold',
                    ]),

                    $this->b('postLoop', [
                        'postTypeId'  => $this->ptId('dua'),
                        'count'       => 12,
                        'cols'        => 'grid-cols-3',
                        'gap'         => 'gap-4',
                        'showExcerpt' => true,
                        'showImage'   => false,
                        'orderBy'     => 'latest',
                    ]),

                    $this->b('alert', [
                        'type'    => 'info',
                        'title'   => '📿 প্রতিদিনের আমল',
                        'message' => 'সকাল ও সন্ধ্যায় মাসনুন দোয়া পড়ার অভ্যাস গড়ুন। ছোট ছোট দোয়াও আল্লাহর কাছে অনেক বড় ইবাদত।',
                    ]),
                ],
            ],

            // ── ইবাদাহ পেজ ───────────────────────────────────────────────
            [
                'slug'  => 'ibadah',
                'title' => '🕌 ইবাদাহ গাইড — নামাজ, রোজা, যাকাত',
                'blocks' => [

                    $this->b('hero', [
                        'title'     => '🕌 ইবাদাহ গাইড',
                        'subtitle'  => 'ইসলামের পাঁচটি স্তম্ভ — নামাজ, রোজা, যাকাত, হজ ও শাহাদাহ সম্পর্কে সম্পূর্ণ গাইড।',
                        'bgType'    => 'color',
                        'bgColor'   => '#1a1a2e',
                        'textColor' => 'text-white',
                        'align'     => 'text-center',
                        'paddingY'  => 'py-14',
                    ]),

                    $this->b('heading', [
                        'text'  => 'ইসলামের পাঁচ স্তম্ভ',
                        'level' => 'h2',
                        'align' => 'text-center',
                        'size'  => 'text-xl',
                        'weight' => 'font-semibold',
                    ]),

                    $this->b('featureGrid', [
                        'cols' => 'grid-cols-5',
                        'gap'  => 'gap-3',
                        'items' => [
                            ['icon' => '🌙', 'title' => 'শাহাদাহ',  'desc' => 'আল্লাহ এক ও মুহাম্মদ (সা.) তাঁর রাসূল।'],
                            ['icon' => '🕌', 'title' => 'সালাত',    'desc' => 'দিনে পাঁচ ওয়াক্ত নামাজ ফরজ।'],
                            ['icon' => '🌙', 'title' => 'সিয়াম',    'desc' => 'রমজান মাসে রোজা রাখা ফরজ।'],
                            ['icon' => '💰', 'title' => 'যাকাত',    'desc' => 'সম্পদের ২.৫% দরিদ্রদের দেওয়া ফরজ।'],
                            ['icon' => '🕋', 'title' => 'হজ',       'desc' => 'সামর্থ্যবান প্রত্যেকের উপর একবার ফরজ।'],
                        ],
                    ]),

                    $this->b('heading', [
                        'text'   => 'ইবাদাহ বিষয়ক আর্টিকেল',
                        'level'  => 'h2',
                        'align'  => 'text-center',
                        'size'   => 'text-xl',
                        'weight' => 'font-semibold',
                    ]),

                    $this->b('postLoop', [
                        'postTypeId'  => $this->ptId('ibadah'),
                        'count'       => 6,
                        'cols'        => 'grid-cols-3',
                        'gap'         => 'gap-4',
                        'showExcerpt' => true,
                        'showImage'   => false,
                        'orderBy'     => 'latest',
                    ]),

                    $this->b('accordion', [
                        'items' => [
                            ['question' => 'নামাজ না পড়লে কি মুসলমান থাকা যায়?',         'answer' => 'নামাজ ইসলামের দ্বিতীয় স্তম্ভ। রাসূলুল্লাহ (সা.) বলেছেন: "বান্দা ও কুফরের মধ্যে পার্থক্য হলো নামাজ।" (মুসলিম ৮২)'],
                            ['question' => 'কারো কি রোজা না রাখার অনুমতি আছে?',          'answer' => 'অসুস্থ, মুসাফির, গর্ভবতী বা দুগ্ধদানকারী মা রোজা না রেখে পরে কাযা করতে পারেন।'],
                            ['question' => 'যাকাত কতটুকু সম্পদের উপর দিতে হয়?',          'answer' => 'নিসাব পরিমাণ সম্পদ (৮৫ গ্রাম স্বর্ণ সমতুল্য) পূর্ণ এক বছর থাকলে ২.৫% যাকাত দিতে হবে।'],
                            ['question' => 'হজ কতবার ফরজ?',                               'answer' => 'জীবনে একবার হজ করা ফরজ, তবে সামর্থ্য থাকলে বারবার করা মুস্তাহাব। (মুসলিম ১৩৩৭)'],
                        ],
                    ]),
                ],
            ],

            // ── কুরআন পেজ ────────────────────────────────────────────────
            [
                'slug'  => 'quran-ayah',
                'title' => '📖 কুরআনের আয়াত — আরবি ও বাংলা',
                'blocks' => [

                    $this->b('hero', [
                        'title'     => '📖 কুরআনের আলো',
                        'subtitle'  => 'হজ, ইমান ও ইবাদাহ বিষয়ক কুরআনের আয়াত — মূল আরবি, বাংলা উচ্চারণ ও অনুবাদসহ।',
                        'bgType'    => 'gradient',
                        'bgGradientFrom' => '#2c3e50',
                        'bgGradientTo'   => '#3498db',
                        'textColor' => 'text-white',
                        'align'     => 'text-center',
                        'paddingY'  => 'py-14',
                    ]),

                    $this->b('quote', [
                        'text'   => 'এই কুরআন মানবজাতির জন্য বিবরণ, হেদায়াত এবং উপদেশ।',
                        'author' => 'সূরা আলে ইমরান ৩:১৩৮',
                    ]),

                    $this->b('heading', [
                        'text'   => 'কুরআনের বিষয়ভিত্তিক আয়াত',
                        'level'  => 'h2',
                        'align'  => 'text-center',
                        'size'   => 'text-xl',
                        'weight' => 'font-semibold',
                    ]),

                    $this->b('categoryLoop', [
                        'taxonomyId' => $this->taxId('quran-topics'),
                        'count'      => 6,
                        'cols'       => 'grid-cols-3',
                        'gap'        => 'gap-3',
                        'showCount'  => true,
                    ]),

                    $this->b('heading', [
                        'text'   => 'কুরআনের আয়াতসমূহ',
                        'level'  => 'h2',
                        'align'  => 'text-center',
                        'size'   => 'text-xl',
                        'weight' => 'font-semibold',
                    ]),

                    $this->b('postLoop', [
                        'postTypeId'  => $this->ptId('quran'),
                        'count'       => 9,
                        'cols'        => 'grid-cols-3',
                        'gap'         => 'gap-4',
                        'showExcerpt' => true,
                        'showImage'   => false,
                        'orderBy'     => 'latest',
                    ]),

                    $this->b('cta', [
                        'title'    => 'প্রতিদিন কুরআন তিলাওয়াত করুন',
                        'subtitle' => 'রাসূলুল্লাহ (সা.) বলেছেন: "কুরআন পড়ো, কারণ কিয়ামতে এটি তোমার জন্য সুপারিশ করবে।" (মুসলিম ৮০৪)',
                        'btnText'  => 'দোয়া ও জিকির দেখুন',
                        'btnHref'  => '/p/duas',
                        'align'    => 'text-center',
                        'paddingY' => 'py-12',
                    ]),
                ],
            ],

            // ── ইসলামিক গল্প পেজ ─────────────────────────────────────────
            [
                'slug'  => 'islamic-stories',
                'title' => '📜 ইসলামিক গল্প ও ইতিহাস',
                'blocks' => [

                    $this->b('hero', [
                        'title'     => '📜 ইসলামিক গল্প',
                        'subtitle'  => 'নবী-রাসূল, সাহাবী ও কাবাঘর নির্মাণের অনুপ্রেরণামূলক ইতিহাস বাংলায়।',
                        'bgType'    => 'gradient',
                        'bgGradientFrom' => '#4a1942',
                        'bgGradientTo'   => '#c84b31',
                        'textColor' => 'text-white',
                        'align'     => 'text-center',
                        'paddingY'  => 'py-14',
                    ]),

                    $this->b('postLoop', [
                        'postTypeId'  => $this->ptId('islamic-story'),
                        'count'       => 6,
                        'cols'        => 'grid-cols-2',
                        'gap'         => 'gap-6',
                        'showExcerpt' => true,
                        'showImage'   => false,
                        'orderBy'     => 'latest',
                    ]),

                    $this->b('alert', [
                        'type'    => 'success',
                        'title'   => '📚 ইতিহাস থেকে শিক্ষা',
                        'message' => 'নবী-রাসূলদের জীবনী পড়া ইবাদত। তাদের ত্যাগ ও পরীক্ষার গল্প আমাদের ঈমান মজবুত করে।',
                    ]),
                ],
            ],
        ];
    }
}
