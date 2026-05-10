<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

/**
 * ArticleController - Manages article display and navigation
 * 
 * This controller handles:
 * - Listing published articles with pagination
 * - Displaying individual articles with view tracking
 * - Loading related articles
 * - Auto-loading next article for continuous reading
 * 
 * Features:
 * - View count tracking (with session-based throttling)
 * - Related articles by category
 * - 24-hour "Most Read" tracking
 * - Next article loading for client-side navigation
 */
class ArticleController extends Controller
{
    /**
     * Display a paginated list of published articles.
     * 
     * Fetches articles with pagination. The number of articles per page
     * is configurable via the 'pagination.articles' setting.
     * 
     * @return \Inertia\Response
     */
    public function index()
    {   
        // Get articles per page from settings, default to 12
        $postperpage = (int) DB::table('settings')->where('key', 'pagination.articles')->value('value') ?? 12;
        $articles = Article::query()
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->paginate($postperpage);

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
        ]);
    }

    public function show(Request $request, Article $article)
    {
        if (Schema::hasColumn('articles', 'view_count')) {
            $article->increment('view_count');
            $article->refresh();
        }

        // Track views for "Most Read (24h)" in a lightweight way.
        // Throttle per-session to avoid inflating counts on refresh.
        if (Schema::hasTable('article_views')) {
            $key = 'views.last_article_viewed_at.' . $article->id;
            $last = (int) $request->session()->get($key, 0);
            $now = now()->timestamp;

            if ($last === 0 || ($now - $last) > 300) {
                $request->session()->put($key, $now);

                $ip = (string) $request->ip();
                $ua = (string) $request->userAgent();
                $fingerprint = substr(hash('sha256', $ip . '|' . $ua), 0, 64);

                try {
                    DB::table('article_views')->insert([
                        'article_id' => $article->id,
                        'viewed_at' => now(),
                        'fingerprint' => $fingerprint,
                    ]);
                } catch (\Throwable $e) {
                    // do not block UI
                }
            }
        }

        // Load related articles (same category, excluding current article)
        $relatedArticles = [];
        if ($article->category_id) {
            $relatedArticles = Article::query()
                ->whereNotNull('published_at')
                ->where('category_id', $article->category_id)
                ->where('id', '!=', $article->id)
                ->orderByDesc('published_at')
                ->limit(4)
                ->get(['id', 'slug', 'title', 'excerpt', 'featured_image_path', 'published_at'])
                ->toArray();
        }

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }

    /**
     * Return the next article (older) in JSON for client-side auto-load.
     * 
     * This method is used for infinite scroll or "load more" functionality.
     * It first tries to find the next article in the same category.
     * If no more articles in the same category, it falls back to a random
     * article from other categories.
     * 
     * @param Article $article The current article (route model binding)
     * @return \Illuminate\Http\JsonResponse
     */
    public function next(Article $article)
    {
        // Prefer next article in the same category (related)
        $next = null;
        if ($article->category_id) {
            $next = Article::query()
                ->whereNotNull('published_at')
                ->where('category_id', $article->category_id)
                ->where('published_at', '<', $article->published_at)
                ->orderByDesc('published_at')
                ->with('category')
                ->first();
        }

        // Fallback: any next article from different categories (random)
        if (!$next) {
            $next = Article::query()
                ->whereNotNull('published_at')
                ->where('published_at', '<', $article->published_at)
                ->where('category_id', '!=', $article->category_id) // Different category
                ->inRandomOrder()
                ->with('category')
                ->first();
        }

        // Last fallback: any article if above failed
        if (!$next) {
            $next = Article::query()
                ->whereNotNull('published_at')
                ->where('published_at', '<', $article->published_at)
                ->orderByDesc('published_at')
                ->with('category')
                ->first();
        }

        if (!$next) {
            return response()->json(['message' => 'No more articles'], 404);
        }

        return response()->json([
            'id' => $next->id,
            'slug' => $next->slug,
            'title' => $next->title,
            'excerpt' => $next->excerpt,
            'body' => $next->body,
            'body_blocks' => $next->body_blocks,
            'featured_image_url' => $next->featured_image_url,
            'published_at' => $next->published_at ? $next->published_at->toDateTimeString() : null,
            'category' => $next->category ? [
                'id' => $next->category->id,
                'name' => $next->category->name,
                'slug' => $next->category->slug,
            ] : null,
        ]);
    }

    /**
     * Return suggested articles (trending, most read, etc.) for insertion between posts.
     */
    public function suggested()
    {
        $suggested = [];

        // Most Read (by view_count if column exists)
        if (Schema::hasColumn('articles', 'view_count')) {
            $mostRead = Article::query()
                ->whereNotNull('published_at')
                ->orderByDesc('view_count')
                ->limit(4)
                ->get(['id', 'slug', 'title', 'excerpt', 'featured_image_path', 'view_count'])
                ->map(fn($a) => array_merge($a->toArray(), ['type' => 'Most Read']))
                ->toArray();
            $suggested = array_merge($suggested, $mostRead);
        }

        // Trending (most views in last 24 hours if article_views table exists)
        if (Schema::hasTable('article_views')) {
            $trending = Article::query()
                ->select('articles.*')
                ->join('article_views', 'articles.id', '=', 'article_views.article_id')
                ->whereNotNull('articles.published_at')
                ->where('article_views.viewed_at', '>=', now()->subHours(24))
                ->groupBy('articles.id')
                ->orderByRaw('COUNT(article_views.id) DESC')
                ->limit(3)
                ->get(['id', 'slug', 'title', 'excerpt', 'featured_image_url'])
                ->map(fn($a) => array_merge($a->toArray(), ['type' => 'Trending']))
                ->toArray();
            $suggested = array_merge($suggested, $trending);
        }

        // Random suggested if we don't have enough
        if (count($suggested) < 3) {
            $random = Article::query()
                ->whereNotNull('published_at')
                ->inRandomOrder()
                ->limit(3)
                ->get(['id', 'slug', 'title', 'excerpt', 'featured_image_url'])
                ->map(fn($a) => array_merge($a->toArray(), ['type' => 'Suggested']))
                ->toArray();
            $suggested = array_merge($suggested, $random);
        }

        // Shuffle and limit to 4
        shuffle($suggested);
        $suggested = array_slice($suggested, 0, 4);

        return response()->json(['articles' => $suggested]);
    }

    /**
     * Return the previous article (newer) in JSON for navigation.
     */
    public function previous(Article $article)
    {
        // Prefer previous article in the same category (related)
        $prev = null;
        if ($article->category_id) {
            $prev = Article::query()
                ->whereNotNull('published_at')
                ->where('category_id', $article->category_id)
                ->where('published_at', '>', $article->published_at)
                ->orderBy('published_at')
                ->with('category')
                ->first();
        }

        // Fallback: any previous article from different categories
        if (!$prev) {
            $prev = Article::query()
                ->whereNotNull('published_at')
                ->where('published_at', '>', $article->published_at)
                ->orderBy('published_at')
                ->with('category')
                ->first();
        }

        if (!$prev) {
            return response()->json(['message' => 'No previous articles'], 404);
        }

        return response()->json([
            'id' => $prev->id,
            'slug' => $prev->slug,
            'title' => $prev->title,
            'excerpt' => $prev->excerpt,
            'published_at' => $prev->published_at ? $prev->published_at->toDateTimeString() : null,
        ]);
    }
}
