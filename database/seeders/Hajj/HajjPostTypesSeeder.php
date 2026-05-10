<?php

namespace Database\Seeders\Hajj;

use App\Models\PostType;
use App\Models\Taxonomy;
use Illuminate\Database\Seeder;

/**
 * Creates all PostTypes and Taxonomies for Islamic/Hajj content.
 */
class HajjPostTypesSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. Post (default) ────────────────────────────────────────
        $post = PostType::firstOrCreate(['slug' => 'post'], [
            'name'        => 'Post',
            'description' => 'সাধারণ সংবাদ ও ব্লগ পোস্ট',
            'icon'        => '📰',
            'is_active'   => true,
            'sort_order'  => 1,
        ]);
        Taxonomy::firstOrCreate(['slug' => 'category', 'post_type_id' => $post->id], [
            'name'       => 'Category',
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        // ─── 2. Hajj Guide ───────────────────────────────────────────
        $hajj = PostType::firstOrCreate(['slug' => 'hajj'], [
            'name'        => 'হজ গাইড',
            'description' => 'হজ পালনের সম্পূর্ণ গাইড',
            'icon'        => '🕋',
            'is_active'   => true,
            'sort_order'  => 2,
        ]);
        Taxonomy::firstOrCreate(['slug' => 'hajj-topics', 'post_type_id' => $hajj->id], [
            'name'       => 'হজ বিষয়',
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        // ─── 3. Dua & Zikir ──────────────────────────────────────────
        $dua = PostType::firstOrCreate(['slug' => 'dua'], [
            'name'        => 'দোয়া ও জিকির',
            'description' => 'কুরআন ও হাদিসের দোয়া সমূহ',
            'icon'        => '🤲',
            'is_active'   => true,
            'sort_order'  => 3,
        ]);
        Taxonomy::firstOrCreate(['slug' => 'dua-category', 'post_type_id' => $dua->id], [
            'name'       => 'দোয়ার ধরন',
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        // ─── 4. Quran ─────────────────────────────────────────────────
        $quran = PostType::firstOrCreate(['slug' => 'quran'], [
            'name'        => 'কুরআন',
            'description' => 'কুরআনের আয়াত ও সূরা সমূহ',
            'icon'        => '📖',
            'is_active'   => true,
            'sort_order'  => 4,
        ]);
        Taxonomy::firstOrCreate(['slug' => 'quran-topics', 'post_type_id' => $quran->id], [
            'name'       => 'কুরআনের বিষয়',
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        // ─── 5. Ibadah ───────────────────────────────────────────────
        $ibadah = PostType::firstOrCreate(['slug' => 'ibadah'], [
            'name'        => 'ইবাদাহ',
            'description' => 'নামাজ, রোজা, যাকাত, হজের বিধিবিধান',
            'icon'        => '🕌',
            'is_active'   => true,
            'sort_order'  => 5,
        ]);
        Taxonomy::firstOrCreate(['slug' => 'ibadah-type', 'post_type_id' => $ibadah->id], [
            'name'       => 'ইবাদাহর ধরন',
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        // ─── 6. Islamic Story ─────────────────────────────────────────
        $story = PostType::firstOrCreate(['slug' => 'islamic-story'], [
            'name'        => 'ইসলামিক গল্প',
            'description' => 'নবী-রাসূল ও সাহাবীদের জীবনী',
            'icon'        => '📜',
            'is_active'   => true,
            'sort_order'  => 6,
        ]);
        Taxonomy::firstOrCreate(['slug' => 'story-category', 'post_type_id' => $story->id], [
            'name'       => 'গল্পের বিভাগ',
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        $this->command->info('✅ PostTypes & Taxonomies seeded.');
    }
}
