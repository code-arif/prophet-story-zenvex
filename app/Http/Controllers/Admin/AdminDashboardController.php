<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Services\AppSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __invoke(AppSettings $settings)
    {
        $days = collect(range(13, 0))
            ->map(fn ($i) => now()->subDays($i)->format('Y-m-d'))
            ->values();

        $articlesByDay = Article::query()
            ->whereNotNull('published_at')
            ->where('published_at', '>=', now()->subDays(13)->startOfDay())
            ->selectRaw('DATE(published_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $subscribersByDay = Subscriber::query()
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $subscriptionByStatus = Schema::hasTable('subscriptions')
            ? Subscription::query()->selectRaw('status, COUNT(*) as c')->groupBy('status')->pluck('c', 'status')
            : collect();

        return Inertia::render('Admin/Dashboard', [
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
            'counts' => [
                'articles' => Article::query()->count(),
                'categories' => Category::query()->count(),
                'pages' => Page::query()->count(),
                'subscribers' => Subscriber::query()->count(),
                'activeSubscriptions' => Subscription::query()->where('status', Subscription::STATUS_ACTIVE)->whereNull('ends_at')->count(),
            ],
            'charts' => [
                'labels' => $days,
                'articlesPerDay' => $days->map(fn ($d) => (int) ($articlesByDay[$d] ?? 0))->values(),
                'subscribersPerDay' => $days->map(fn ($d) => (int) ($subscribersByDay[$d] ?? 0))->values(),
                'subscriptionStatus' => [
                    'labels' => $subscriptionByStatus->keys()->values(),
                    'data' => $subscriptionByStatus->values(),
                ],
                'generatedAt' => now()->toIso8601String(),
            ],
        ]);
    }
}
