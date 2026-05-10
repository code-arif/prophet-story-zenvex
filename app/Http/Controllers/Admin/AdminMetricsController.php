<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Page;
use App\Models\Subscriber;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminMetricsController extends Controller
{
    public function index()
    {
        $hasViewCount = Schema::hasColumn('articles', 'view_count');

        $days = collect(range(13, 0))
            ->map(fn ($i) => now()->subDays($i)->format('Y-m-d'))
            ->values();

        $viewsPerDay = collect();
        if (Schema::hasTable('article_views')) {
            $viewsByDay = DB::table('article_views')
                ->where('viewed_at', '>=', now()->subDays(13)->startOfDay())
                ->selectRaw('DATE(viewed_at) as d, COUNT(*) as c')
                ->groupBy('d')
                ->pluck('c', 'd');

            $viewsPerDay = $days->map(fn ($d) => (int) ($viewsByDay[$d] ?? 0))->values();
        }

        $categoryViews = collect();
        if ($hasViewCount && Schema::hasTable('categories')) {
            $categoryViews = DB::table('articles')
                ->join('categories', 'articles.category_id', '=', 'categories.id')
                ->whereNotNull('articles.published_at')
                ->selectRaw('categories.name as name, SUM(articles.view_count) as views')
                ->groupBy('categories.name')
                ->orderByDesc('views')
                ->limit(8)
                ->get();
        }

        $topArticles = $hasViewCount
            ? Article::query()
                ->orderByDesc('view_count')
                ->limit(10)
                ->get(['id', 'slug', 'title', 'view_count', 'published_at'])
            : collect();

        return Inertia::render('Admin/Metrics/Index', [
            'counts' => [
                'articles' => Article::query()->count(),
                'publishedArticles' => Article::query()->whereNotNull('published_at')->count(),
                'pages' => Page::query()->count(),
                'subscribers' => Subscriber::query()->count(),
                'activeSubscriptions' => Subscription::query()->where('status', Subscription::STATUS_ACTIVE)->whereNull('ends_at')->count(),
                'totalArticleViews' => $hasViewCount ? (int) Article::query()->sum('view_count') : 0,
            ],
            'topArticles' => $topArticles,
            'charts' => [
                'labels' => $days,
                'viewsPerDay' => $viewsPerDay,
                'categoryViews' => [
                    'labels' => $categoryViews->pluck('name')->values(),
                    'data' => $categoryViews->pluck('views')->map(fn ($v) => (int) $v)->values(),
                ],
                'generatedAt' => now()->toIso8601String(),
            ],
        ]);
    }
}
