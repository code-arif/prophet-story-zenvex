<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Models\EasyRise\Job;
use App\Models\EasyRise\IncomeEntry;
use App\Models\EasyRise\Client;
use App\Models\EasyRise\Document;
use App\Models\EasyRise\Feedback;
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

        $incomeByDay = Schema::hasTable('income_entries')
            ? IncomeEntry::query()
                ->where('date', '>=', now()->subDays(13)->startOfDay())
                ->selectRaw('DATE(date) as d, SUM(amount_paisa) as s')
                ->groupBy('d')
                ->pluck('s', 'd')
            : collect();

        $jobsByDay = Schema::hasTable('jobs')
            ? Job::query()
                ->where('created_at', '>=', now()->subDays(13)->startOfDay())
                ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
                ->groupBy('d')
                ->pluck('c', 'd')
            : collect();

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

        $totalIncomePaisa = Schema::hasTable('income_entries') ? IncomeEntry::sum('amount_paisa') : 0;
        $totalIncomeBdt = round($totalIncomePaisa / 100, 2);

        return Inertia::render('Admin/Dashboard', [
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
            'counts' => [
                'subscribers' => Subscriber::query()->count(),
                'activeSubscriptions' => Subscription::query()->where('status', Subscription::STATUS_ACTIVE)->whereNull('ends_at')->count(),
                'jobs' => Schema::hasTable('jobs') ? Job::query()->count() : 0,
                'clients' => Schema::hasTable('clients') ? Client::query()->count() : 0,
                'incomeEntries' => Schema::hasTable('income_entries') ? IncomeEntry::query()->count() : 0,
                'totalIncomeBdt' => $totalIncomeBdt,
                'documents' => Schema::hasTable('documents') ? Document::query()->count() : 0,
                'feedbacks' => Schema::hasTable('feedbacks') ? Feedback::query()->count() : 0,
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
