<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use App\Models\EasyRise\Document;
use App\Models\EasyRise\IncomeEntry;
use App\Models\EasyRise\Job;
use App\Support\LearnerUser;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class MoneyController extends Controller
{
    public function index()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $twelveMonthsAgo = Carbon::now()->subMonths(12)->startOfMonth();

        $earnings12m = IncomeEntry::where('user_id', $user->id)
            ->where('date', '>=', $twelveMonthsAgo)
            ->selectRaw('MONTH(date) as month, YEAR(date) as year, SUM(amount_paisa) as total')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $monthly = IncomeEntry::where('user_id', $user->id)
            ->where('date', '>=', Carbon::now()->subMonths(6)->startOfMonth())
            ->selectRaw('MONTH(date) as month, YEAR(date) as year, SUM(amount_paisa) as total')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $totalEarnings = IncomeEntry::where('user_id', $user->id)->sum('amount_paisa');
        $jobCount = Job::where('user_id', $user->id)->where('status', 'closed')->count();
        $avgMonthly = $monthly->isNotEmpty()
            ? round($monthly->avg('total'))
            : 0;

        $runway = $avgMonthly > 0 ? round(($totalEarnings / $avgMonthly)) : 0;
        $safeDraw = round($avgMonthly * 0.8);

        return Inertia::render('Money/Index', [
            'earnings12m' => $earnings12m,
            'monthly' => $monthly,
            'runway' => $runway,
            'safeDraw' => $safeDraw,
        ]);
    }

    public function ledger()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $entries = IncomeEntry::where('user_id', $user->id)
            ->with('job')
            ->orderByDesc('date')
            ->get();

        $filters = [
            'statuses' => ['completed', 'awaiting_payment', 'in_progress'],
        ];

        return Inertia::render('Money/Ledger', [
            'entries' => $entries,
            'filters' => $filters,
        ]);
    }

    public function trueHourly()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $jobs = Job::where('user_id', $user->id)
            ->with('scopeItems')
            ->where('status', 'closed')
            ->get()
            ->map(fn ($job) => [
                'id' => $job->id,
                'title' => $job->title,
                'totalEarned' => $job->incomeEntries->sum('amount_paisa'),
                'totalHours' => $job->scopeItems->sum('hours'),
                'trueHourly' => $job->scopeItems->sum('hours') > 0
                    ? round($job->incomeEntries->sum('amount_paisa') / $job->scopeItems->sum('hours'))
                    : 0,
            ]);

        $selectedJob = $jobs->first();
        $calc = null;

        if ($selectedJob && $selectedJob['totalHours'] > 0) {
            $calc = [
                'totalEarned' => $selectedJob['totalEarned'],
                'totalHours' => $selectedJob['totalHours'],
                'trueHourlyRate' => $selectedJob['trueHourly'],
            ];
        }

        return Inertia::render('Money/TrueHourly', [
            'jobs' => $jobs,
            'selectedJob' => $selectedJob,
            'calc' => $calc,
        ]);
    }

    public function runway()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $monthlyIncome = IncomeEntry::where('user_id', $user->id)
            ->where('date', '>=', Carbon::now()->subMonths(12)->startOfMonth())
            ->selectRaw('MONTH(date) as month, YEAR(date) as year, SUM(amount_paisa) as total')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $totalIncome = $monthlyIncome->sum('total');
        $months = $monthlyIncome->count();
        $avgMonthly = $months > 0 ? round($totalIncome / $months) : 0;

        return Inertia::render('Money/Runway', [
            'monthlyIncome' => $monthlyIncome,
            'expenses' => 0,
            'savings' => $totalIncome,
        ]);
    }

    public function channels()
    {
        $incentiveData = json_decode(
            file_get_contents(resource_path('js/data/incentiveRules.json')),
            true
        );

        return Inertia::render('Money/Channels', [
            'channels' => $incentiveData['channels'] ?? [],
            'requirements' => $incentiveData['eligibility'] ?? [],
        ]);
    }

    public function incentive()
    {
        $incentiveData = json_decode(
            file_get_contents(resource_path('js/data/incentiveRules.json')),
            true
        );

        return Inertia::render('Money/Incentive', [
            'payment' => null,
            'rules' => $incentiveData['channels'] ?? [],
            'result' => null,
        ]);
    }

    public function documents()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $documentData = json_decode(
            file_get_contents(resource_path('js/data/documentLists.json')),
            true
        );

        $documents = Document::where('user_id', $user->id)->get();

        return Inertia::render('Money/DocReadiness', [
            'purposes' => $documentData['purposes'] ?? [],
            'documents' => $documents,
        ]);
    }

    public function proof()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $totalEarnings = IncomeEntry::where('user_id', $user->id)->sum('amount_paisa');

        return Inertia::render('Money/IncomeProof', [
            'range' => [
                'from' => Carbon::now()->subMonths(3)->startOfMonth()->format('Y-m-d'),
                'to' => Carbon::now()->endOfMonth()->format('Y-m-d'),
            ],
            'personName' => $user->name ?? '',
            'purpose' => '',
            'showClientNames' => false,
        ]);
    }
}
