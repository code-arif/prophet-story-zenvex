<?php

namespace Database\Seeders\Hajj;

use App\Models\Category;
use App\Models\PostType;
use App\Models\Taxonomy;
use Illuminate\Database\Seeder;

/**
 * Creates all categories for each PostType/Taxonomy.
 */
class HajjCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Hajj Topics ──────────────────────────────────────────────
        $hajjType = PostType::where('slug', 'hajj')->first();
        $hajjTax  = Taxonomy::where('slug', 'hajj-topics')->first();
        if ($hajjType && $hajjTax) {
            $hajjCats = [
                ['slug' => 'hajj-preparation',  'name' => 'হজের প্রস্তুতি',        'sort_order' => 1],
                ['slug' => 'hajj-rituals',       'name' => 'হজের আহকাম ও নিয়ম',    'sort_order' => 2],
                ['slug' => 'hajj-after',         'name' => 'হজ পরবর্তী আমল',        'sort_order' => 3],
                ['slug' => 'makkah-guide',       'name' => 'মক্কা ও মদিনা গাইড',    'sort_order' => 4],
                ['slug' => 'ihram-guide',        'name' => 'ইহরাম ও মীকাত',          'sort_order' => 5],
                ['slug' => 'tawaf-guide',        'name' => 'তাওয়াফ ও সাঈ',           'sort_order' => 6],
                ['slug' => 'arafa-muzdalifa',    'name' => 'আরাফাত ও মুযদালিফা',     'sort_order' => 7],
                ['slug' => 'mina-rami',          'name' => 'মিনা ও জামারাত',          'sort_order' => 8],
            ];
            foreach ($hajjCats as $c) {
                Category::firstOrCreate(['slug' => $c['slug']], [
                    'name'        => $c['name'],
                    'taxonomy_id' => $hajjTax->id,
                    'is_active'   => true,
                    'show_in_nav' => true,
                    'sort_order'  => $c['sort_order'],
                ]);
            }
        }

        // ─── Dua Categories ───────────────────────────────────────────
        $duaType = PostType::where('slug', 'dua')->first();
        $duaTax  = Taxonomy::where('slug', 'dua-category')->first();
        if ($duaType && $duaTax) {
            $duaCats = [
                ['slug' => 'dua-daily',         'name' => 'দৈনন্দিন দোয়া',          'sort_order' => 1],
                ['slug' => 'dua-salah',         'name' => 'নামাজের দোয়া',            'sort_order' => 2],
                ['slug' => 'dua-hajj',          'name' => 'হজের দোয়া',               'sort_order' => 3],
                ['slug' => 'dua-morning',       'name' => 'সকাল-সন্ধ্যার আমল',       'sort_order' => 4],
                ['slug' => 'dua-quran',         'name' => 'কুরআনের দোয়া',            'sort_order' => 5],
                ['slug' => 'dua-protection',    'name' => 'সুরক্ষার দোয়া',           'sort_order' => 6],
                ['slug' => 'dua-forgiveness',   'name' => 'ক্ষমার দোয়া',             'sort_order' => 7],
                ['slug' => 'dua-zikir',         'name' => 'তাসবীহ ও জিকির',          'sort_order' => 8],
            ];
            foreach ($duaCats as $c) {
                Category::firstOrCreate(['slug' => $c['slug']], [
                    'name'        => $c['name'],
                    'taxonomy_id' => $duaTax->id,
                    'is_active'   => true,
                    'show_in_nav' => true,
                    'sort_order'  => $c['sort_order'],
                ]);
            }
        }

        // ─── Quran Categories ─────────────────────────────────────────
        $quranType = PostType::where('slug', 'quran')->first();
        $quranTax  = Taxonomy::where('slug', 'quran-topics')->first();
        if ($quranType && $quranTax) {
            $quranCats = [
                ['slug' => 'quran-hajj',        'name' => 'হজ সংক্রান্ত আয়াত',      'sort_order' => 1],
                ['slug' => 'quran-iman',        'name' => 'ঈমান ও আকিদা',            'sort_order' => 2],
                ['slug' => 'quran-ibadah',      'name' => 'ইবাদাহ প্রসঙ্গ',          'sort_order' => 3],
                ['slug' => 'quran-tazkiyah',    'name' => 'তাযকিয়া ও আত্মশুদ্ধি',   'sort_order' => 4],
                ['slug' => 'quran-jannah',      'name' => 'জান্নাত ও জাহান্নাম',     'sort_order' => 5],
                ['slug' => 'quran-surah',       'name' => 'বিশেষ সূরা',               'sort_order' => 6],
            ];
            foreach ($quranCats as $c) {
                Category::firstOrCreate(['slug' => $c['slug']], [
                    'name'        => $c['name'],
                    'taxonomy_id' => $quranTax->id,
                    'is_active'   => true,
                    'show_in_nav' => true,
                    'sort_order'  => $c['sort_order'],
                ]);
            }
        }

        // ─── Ibadah Categories ────────────────────────────────────────
        $ibadahType = PostType::where('slug', 'ibadah')->first();
        $ibadahTax  = Taxonomy::where('slug', 'ibadah-type')->first();
        if ($ibadahType && $ibadahTax) {
            $ibadahCats = [
                ['slug' => 'ibadah-salah',      'name' => 'নামাজ',                   'sort_order' => 1],
                ['slug' => 'ibadah-sawm',       'name' => 'রোজা',                    'sort_order' => 2],
                ['slug' => 'ibadah-zakat',      'name' => 'যাকাত',                   'sort_order' => 3],
                ['slug' => 'ibadah-hajj',       'name' => 'হজ ও উমরা',               'sort_order' => 4],
                ['slug' => 'ibadah-quran',      'name' => 'কুরআন তিলাওয়াত',          'sort_order' => 5],
                ['slug' => 'ibadah-tahajjud',   'name' => 'তাহাজ্জুদ ও নফল',         'sort_order' => 6],
            ];
            foreach ($ibadahCats as $c) {
                Category::firstOrCreate(['slug' => $c['slug']], [
                    'name'        => $c['name'],
                    'taxonomy_id' => $ibadahTax->id,
                    'is_active'   => true,
                    'show_in_nav' => true,
                    'sort_order'  => $c['sort_order'],
                ]);
            }
        }

        // ─── Islamic Story Categories ─────────────────────────────────
        $storyType = PostType::where('slug', 'islamic-story')->first();
        $storyTax  = Taxonomy::where('slug', 'story-category')->first();
        if ($storyType && $storyTax) {
            $storyCats = [
                ['slug' => 'story-prophet',     'name' => 'নবীদের কাহিনী',           'sort_order' => 1],
                ['slug' => 'story-sahabi',      'name' => 'সাহাবীদের জীবনী',         'sort_order' => 2],
                ['slug' => 'story-hajj',        'name' => 'হজের ইতিহাস',             'sort_order' => 3],
            ];
            foreach ($storyCats as $c) {
                Category::firstOrCreate(['slug' => $c['slug']], [
                    'name'        => $c['name'],
                    'taxonomy_id' => $storyTax->id,
                    'is_active'   => true,
                    'show_in_nav' => true,
                    'sort_order'  => $c['sort_order'],
                ]);
            }
        }

        $this->command->info('✅ Categories seeded.');
    }
}
