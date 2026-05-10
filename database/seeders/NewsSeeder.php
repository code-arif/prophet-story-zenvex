<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        if (!class_exists(Category::class)) {
            return;
        }

        $categories = [
            ['slug' => 'politics', 'name' => 'রাজনীতি', 'sort_order' => 10],
            ['slug' => 'economy', 'name' => 'অর্থনীতি', 'sort_order' => 20],
            ['slug' => 'sports', 'name' => 'খেলাধুলা', 'sort_order' => 30],
            ['slug' => 'international', 'name' => 'আন্তর্জাতিক', 'sort_order' => 40],
            ['slug' => 'technology', 'name' => 'প্রযুক্তি', 'sort_order' => 50],
            ['slug' => 'entertainment', 'name' => 'বিনোদন', 'sort_order' => 60],
        ];

        foreach ($categories as $c) {
            Category::query()->updateOrCreate(
                ['slug' => $c['slug']],
                [
                    'name' => $c['name'],
                    'sort_order' => (int) $c['sort_order'],
                    'is_active' => true,
                    'show_in_nav' => true,
                ]
            );
        }

        $catIds = Category::query()->pluck('id', 'slug')->all();

        $imageUrls = [
            'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80',
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
            'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
            'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
            'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
            'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
        ];

        $headlinePool = [
            ['cat' => 'politics', 'title' => 'নির্বাচন কমিশন নতুন ডিজিটাল ভোটিং পদ্ধতি ঘোষণা করেছে', 'excerpt' => 'স্বচ্ছ ও নিরাপদ নির্বাচনের জন্য পাইলট কার্যক্রম শুরু হবে কয়েকটি আসনে।'],
            ['cat' => 'economy', 'title' => 'নির্বাচনের আগে শেয়ারবাজারে নতুন উচ্চতা', 'excerpt' => 'অর্থনৈতিক সূচক ইতিবাচক থাকায় বিনিয়োগকারীদের আস্থা বেড়েছে।'],
            ['cat' => 'sports', 'title' => 'বিশ্বকাপ বাছাইয়ে জাতীয় দলের চূড়ান্ত স্কোয়াড ঘোষণা', 'excerpt' => 'দলে জায়গা পেয়েছে নতুন প্রতিভা ও অভিজ্ঞ খেলোয়াড়রা।'],
            ['cat' => 'international', 'title' => 'আন্তর্জাতিক পর্যবেক্ষকরা নির্বাচন প্রস্তুতি ইতিবাচক বলেছে', 'excerpt' => 'গণতান্ত্রিক প্রক্রিয়া শক্তিশালী করতে নানা উদ্যোগের প্রশংসা করা হয়েছে।'],
            ['cat' => 'technology', 'title' => 'রিয়েল-টাইম ফলাফল দেখার নতুন অ্যাপ চালু', 'excerpt' => 'মানচিত্র ও কেন্দ্রভিত্তিক ফলাফল দেখা যাবে লাইভ।'],
            ['cat' => 'entertainment', 'title' => 'ভোটারদের উৎসাহ দিতে তারকাদের প্রচারণা', 'excerpt' => 'সামাজিক মাধ্যমে নাগরিকদের ভোটকেন্দ্রে যাওয়ার আহ্বান।'],
        ];

        $faker = fake();

        // Create a set of very recent items for Hot News carousel.
        for ($i = 0; $i < 12; $i++) {
            $base = $headlinePool[$i % count($headlinePool)];
            $title = $i < count($headlinePool)
                ? $base['title']
                : $base['title'].' (আপডেট '.($i + 1).')';

            $slug = Str::slug($title);
            if ($slug === '') {
                $slug = $base['cat'].'-'.Str::random(10);
            }
            $slug = $slug.'-'.Str::lower(Str::random(6));

            $publishedAt = now()->subMinutes(($i + 1) * 18);
            $isBreaking = $i < 5;

            $body = $base['excerpt']."\n\n".$faker->paragraphs(6, true);

            $blocks = [
                ['type' => 'heading', 'level' => 2, 'text' => $title],
                ['type' => 'paragraph', 'text' => $body],
                ['type' => 'quote', 'text' => $faker->sentence(14)],
            ];

            Article::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $catIds[$base['cat']] ?? null,
                    'title' => $title,
                    'excerpt' => $base['excerpt'],
                    'body' => $body,
                    'body_blocks' => $blocks,
                    // Keep as URL so no storage symlink/network downloads are required.
                    'featured_image_path' => $imageUrls[$i % count($imageUrls)],
                    'published_at' => $publishedAt,
                    'is_breaking' => $isBreaking,
                    'view_count' => random_int(0, 5000),
                ]
            );
        }

        // Generate more articles for category sections and scrolling.
        $slugs = array_keys($catIds);
        for ($i = 0; $i < 60; $i++) {
            $catSlug = $slugs[$i % max(1, count($slugs))] ?? 'politics';
            $title = $faker->sentence(7);

            $slug = Str::slug($title).'-'.Str::lower(Str::random(8));
            $excerpt = $faker->sentence(18);
            $body = $excerpt."\n\n".$faker->paragraphs(8, true);

            $publishedAt = now()->subHours(random_int(1, 96))->subMinutes(random_int(0, 59));

            Article::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $catIds[$catSlug] ?? null,
                    'title' => $title,
                    'excerpt' => $excerpt,
                    'body' => $body,
                    'body_blocks' => [
                        ['type' => 'heading', 'level' => 2, 'text' => $title],
                        ['type' => 'paragraph', 'text' => $body],
                    ],
                    'featured_image_path' => $imageUrls[$i % count($imageUrls)],
                    'published_at' => $publishedAt,
                    'is_breaking' => ($i % 17) === 0,
                    'view_count' => random_int(0, 20000),
                ]
            );
        }
    }
}
