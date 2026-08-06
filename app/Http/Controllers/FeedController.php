<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\PostType;
use App\Services\AppSettings;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

/**
 * FeedController - Handles the /feed route for article listings
 * 
 * This controller manages the article feed display, similar to HomeController
 * but specifically for the /feed route. It supports category filtering
 * and subscription-based content access.
 * 
 * Features:
 * - Configurable homepage type (feed, page, article, route)
 * - Category-based filtering
 * - Guest mode support
 * - MSISDN-based subscription checking
 * - Breaking news display
 * - Most read articles (24h)
 * 
 * Note: This was separated from HomeController to allow HomeController
 * to be repurposed for a distinct home/landing page.
 */
class FeedController extends Controller
{
    public function __invoke(Request $request, AppSettings $settings): mixed
    {
                
        $msisdn = (string) $request->session()->get('msisdn', '');
        $isGuest = (bool) $request->session()->get('is_guest', false);
        $guestModeEnabled = (bool) $settings->get('guest_mode.enabled', false);
        // If not logged in and not guest
        if ($msisdn === '' && !$isGuest) {
            // If guest mode is disabled, require login
            if (!$guestModeEnabled) {
                return redirect()->route('login.show');
            }
        }

        $cols = ['id', 'post_type_id', 'category_id', 'slug', 'title', 'excerpt', 'published_at', 'featured_image_path', 'is_breaking'];
        if (Schema::hasColumn('articles', 'view_count')) {
            $cols[] = 'view_count';
        }
        
        $activePostType = null;
        if (Schema::hasTable('post_types')) {
            $activePostType = PostType::query()->where('slug', 'feed')->where('is_active', true)->first();
        }
                
        $categorySlug = trim((string) ($slug ?? $request->query('category', '')));
        $activeCategories = [];
        $selectedCategory = null;
        
        if (Schema::hasTable('categories')) {
            $categoriesQuery = Category::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name');

            // Filter categories by the active post type's taxonomies
            if ($activePostType && Schema::hasTable('taxonomies')) {
                $taxonomyIds = $activePostType->taxonomies()->pluck('id')->all();
                if (!empty($taxonomyIds)) {
                    $categoriesQuery->whereIn('taxonomy_id', $taxonomyIds);
                }
            }

            $activeCategories = $categoriesQuery
                ->get(['id', 'slug', 'name', 'show_in_nav'])
                ->values()
                ->all();

            if ($categorySlug !== '') {
                $selectedCategory = Category::query()
                    ->where('slug', $categorySlug)
                    ->where('is_active', true)
                    ->first(['id', 'slug', 'name']);
            }
        }

        $latestQuery = Article::query()
            ->whereNotNull('published_at')
            ->when($activePostType, function ($q) use ($activePostType) {
                // Include articles matching this post type, or articles with no post_type set (backward compat)
                $q->where(function ($inner) use ($activePostType) {
                    $inner->where('post_type_id', $activePostType->id)
                          ->orWhereNull('post_type_id');
                });
            })
            ->when($selectedCategory, fn ($q) => $q->where('category_id', $selectedCategory->id))
            ->orderByDesc('published_at');

        if (Schema::hasTable('categories')) {
            $latestQuery->with(['category:id,slug,name']);
        }

        $latest = $latestQuery->limit(20)->get($cols);

        $breakingQuery = Article::query()
            ->whereNotNull('published_at')
            ->where('is_breaking', true)
            ->when($activePostType, function ($q) use ($activePostType) {
                $q->where(function ($inner) use ($activePostType) {
                    $inner->where('post_type_id', $activePostType->id)
                          ->orWhereNull('post_type_id');
                });
            })
            ->when($selectedCategory, fn ($q) => $q->where('category_id', $selectedCategory->id))
            ->orderByDesc('published_at')
            ->limit(8);

        if (Schema::hasTable('categories')) {
            $breakingQuery->with(['category:id,slug,name']);
        }

        $breaking = $breakingQuery->get(['id', 'category_id', 'slug', 'title', 'published_at']);

        $mostRead24h = collect();
        if (Schema::hasTable('article_views')) {
            $ids = DB::table('article_views')
                ->select('article_id', DB::raw('count(*) as views'))
                ->where('viewed_at', '>=', now()->subDay())
                ->groupBy('article_id')
                ->orderByDesc('views')
                ->limit(12)
                ->get();

            $articleIds = $ids->pluck('article_id')->all();
            $articlesQuery = Article::query()->whereIn('id', $articleIds)
                ->when($activePostType, function ($q) use ($activePostType) {
                    $q->where(function ($inner) use ($activePostType) {
                        $inner->where('post_type_id', $activePostType->id)
                              ->orWhereNull('post_type_id');
                    });
                });
            if (Schema::hasTable('categories')) {
                $articlesQuery->with(['category:id,slug,name']);
            }

            $articles = $articlesQuery->get($cols)->keyBy('id');

            $mostRead24h = $ids
                ->map(function ($row) use ($articles) {
                    $a = $articles->get($row->article_id);
                    if (!$a) {
                        return null;
                    }

                    return array_merge($a->toArray(), [
                        'views_24h' => (int) $row->views,
                    ]);
                })
                ->filter()
                ->values();
        }

        $sectionBlocks = [];
        if (!$selectedCategory && Schema::hasTable('categories') && !empty($activeCategories)) {
            $categoryIds = collect($activeCategories)
                ->filter(fn ($c) => (bool) ($c['show_in_nav'] ?? true))
                ->pluck('id')
                ->values()
                ->all();

            if (!empty($categoryIds)) {
                $blockArticlesQuery = Article::query()
                    ->whereNotNull('published_at')
                    ->whereIn('category_id', $categoryIds)
                    ->when($activePostType, function ($q) use ($activePostType) {
                        $q->where(function ($inner) use ($activePostType) {
                            $inner->where('post_type_id', $activePostType->id)
                                  ->orWhereNull('post_type_id');
                        });
                    })
                    ->orderByDesc('published_at')
                    ->limit(120);

                if (Schema::hasTable('categories')) {
                    $blockArticlesQuery->with(['category:id,slug,name']);
                }

                $blockArticles = $blockArticlesQuery->get($cols)
                    ->groupBy('category_id');

                foreach ($activeCategories as $cat) {
                    if (!(bool) ($cat['show_in_nav'] ?? true)) {
                        continue;
                    }

                    $articlesForCategory = $blockArticles->get($cat['id']);
                    if (!$articlesForCategory || $articlesForCategory->isEmpty()) {
                        continue;
                    }

                    $sectionBlocks[] = [
                        'category' => [
                            'id' => $cat['id'],
                            'slug' => $cat['slug'],
                            'name' => $cat['name'],
                        ],
                        'articles' => $articlesForCategory->take(3)->values(),
                    ];
                }
            }
        }

        return Inertia::render('Feed/Index', [
            'brandName' => $settings->brandName(),
            'msisdn' => $msisdn,
            'isGuest' => $isGuest,
            'isSubscribed' => $msisdn === '' ? false : (bool) Subscription::query()->where('msisdn', $msisdn)->where('status', Subscription::STATUS_ACTIVE)->whereNull('ends_at')->exists(),
            'sections' => array_values(array_filter($activeCategories, fn ($c) => (bool) ($c['show_in_nav'] ?? true))),
            'selectedCategory' => $selectedCategory,
            'latest' => $latest,
            'breaking' => $breaking,
            'mostRead24h' => $mostRead24h,
            'sectionBlocks' => $sectionBlocks,
        ]);
    }
}
