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

        $subscribersByDay = Subscriber::query()
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $incomeByDay = collect();
        $jobsByDay = collect();

        $subscriptionByStatus = Schema::hasTable('subscriptions')
            ? Subscription::query()->selectRaw('status, COUNT(*) as c')->groupBy('status')->pluck('c', 'status')
            : collect();

        $learnerOnboarding = Schema::hasColumn('subscribers', 'profile_skipped_at')
            ? [
                'completed' => Subscriber::query()
                    ->whereNotNull('name')
                    ->where('name', '!=', '')
                    ->whereNull('profile_skipped_at')
                    ->count(),
                'skipped' => Subscriber::query()
                    ->whereNotNull('profile_skipped_at')
                    ->where(function ($q) {
                        $q->whereNull('name')->orWhere('name', '');
                    })
                    ->count(),
                'neverStarted' => Subscriber::query()
                    ->whereNull('profile_skipped_at')
                    ->where(function ($q) {
                        $q->whereNull('name')->orWhere('name', '');
                    })
                    ->count(),
                'total' => Subscriber::query()->count(),
            ]
            : null;

        $totalIncomeBdt = 0;

        return Inertia::render('Admin/Dashboard', [
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
            'counts' => [
                'subscribers' => Subscriber::query()->count(),
                'activeSubscriptions' => Subscription::query()->where('status', Subscription::STATUS_ACTIVE)->whereNull('ends_at')->count(),
                'jobs' => 0,
                'clients' => 0,
                'incomeEntries' => 0,
                'totalIncomeBdt' => $totalIncomeBdt,
                'documents' => 0,
                'feedbacks' => 0,
                'articles' => Article::query()->count(),
                'pages' => Page::query()->count(),
            ],
            'learnerOnboarding' => $learnerOnboarding,
            'charts' => [
                'labels' => $days,
                'subscribersPerDay' => $days->map(fn ($d) => (int) ($subscribersByDay[$d] ?? 0))->values(),
                'incomePerDay' => $days->map(fn ($d) => round(($incomeByDay[$d] ?? 0) / 100, 2))->values(),
                'jobsPerDay' => $days->map(fn ($d) => (int) ($jobsByDay[$d] ?? 0))->values(),
                'subscriptionStatus' => [
                    'labels' => $subscriptionByStatus->keys()->values(),
                    'data' => $subscriptionByStatus->values(),
                ],
                'generatedAt' => now()->toIso8601String(),
            ],
        ]);
    }
}
