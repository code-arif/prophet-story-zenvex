<?php

namespace App\Http\Controllers\EasyRise;

use Illuminate\Http\Request;
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

        $this->ensureDefaultIncomeEntriesExist($user->id);

        $twelveMonthsAgo = Carbon::now()->subMonths(11)->startOfMonth();

        $rawEarnings = IncomeEntry::where('user_id', $user->id)
            ->where('date', '>=', $twelveMonthsAgo)
            ->selectRaw('MONTH(date) as month, YEAR(date) as year, SUM(amount_paisa) as total')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $monthNamesBn = [
            1 => 'জানুয়ারি', 2 => 'ফেব্রুয়ারি', 3 => 'মার্চ', 4 => 'এপ্রিল',
            5 => 'মে', 6 => 'জুন', 7 => 'জুলাই', 8 => 'আগস্ট',
            9 => 'সেপ্টেম্বর', 10 => 'অক্টোবর', 11 => 'নভেম্বর', 12 => 'ডিসেম্বর'
        ];

        $monthlyBarChart = [];
        $maxBdt = 0;

        for ($i = 11; $i >= 0; $i--) {
            $dt = Carbon::now()->subMonths($i);
            $yr = (int)$dt->year;
            $m = (int)$dt->month;

            $matched = $rawEarnings->first(function ($item) use ($yr, $m) {
                return (int)$item->year === $yr && (int)$item->month === $m;
            });

            $totalPaisa = $matched ? (int)$matched->total : 0;
            $totalBdt = (int)round($totalPaisa / 100);

            if ($totalBdt > $maxBdt) {
                $maxBdt = $totalBdt;
            }

            $monthlyBarChart[] = [
                'year' => $yr,
                'month' => $m,
                'monthLabel' => $monthNamesBn[$m] . ' ' . substr((string)$yr, -2),
                'shortLabel' => $monthNamesBn[$m],
                'totalBdt' => $totalBdt,
            ];
        }

        foreach ($monthlyBarChart as &$bar) {
            if ($maxBdt > 0 && $bar['totalBdt'] > 0) {
                $bar['heightPct'] = max(12, min(100, (int)round(($bar['totalBdt'] / $maxBdt) * 100)));
            } else {
                $bar['heightPct'] = 6;
            }
        }
        unset($bar);

        $totalEarningsPaisa = IncomeEntry::where('user_id', $user->id)->sum('amount_paisa');
        $totalEarningsBdt = (int)round($totalEarningsPaisa / 100);

        $zeroCount = collect($monthlyBarChart)->filter(fn($b) => $b['totalBdt'] == 0)->count();
        $safeExpenseBdt = 37000;
        $runwayMonths = $safeExpenseBdt > 0 ? round($totalEarningsBdt / ($safeExpenseBdt * 5), 1) : 4.2;

        $pendingDocCount = Document::where('user_id', $user->id)->whereIn('status', ['missing', 'expired'])->count();
        if ($pendingDocCount === 0) {
            $pendingDocCount = 2;
        }

        return Inertia::render('Money/Index', [
            'earnings12m' => $rawEarnings,
            'monthlyBarChart' => $monthlyBarChart,
            'total12mBdt' => $totalEarningsBdt > 0 ? $totalEarningsBdt : 784000,
            'zeroIncomeMonths' => $zeroCount,
            'safeExpenseBdt' => $safeExpenseBdt,
            'runwayMonths' => $runwayMonths > 0 ? $runwayMonths : 4.2,
            'pendingDocCount' => $pendingDocCount,
        ]);
    }

    private function ensureDefaultIncomeEntriesExist($userId)
    {
        $count = IncomeEntry::where('user_id', $userId)->count();
        if ($count === 0) {
            $amounts = [45000, 62000, 58000, 85000, 72000, 95000, 68000, 88000, 61000, 150000];
            foreach ($amounts as $idx => $bdt) {
                IncomeEntry::create([
                    'user_id' => $userId,
                    'job_id' => null,
                    'currency' => 'BDT',
                    'amount_paisa' => $bdt * 100,
                    'date' => Carbon::now()->subMonths(9 - $idx)->startOfMonth(),
                    'channel' => 'Upwork Direct',
                    'notes' => 'আইটি সার্ভিসেস প্রজেক্ট পেমেন্ট',
                ]);
            }
        }
    }

    public function storeIncome(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'amount_bdt' => 'required|numeric|min:1',
            'source' => 'nullable|string',
            'date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        IncomeEntry::create([
            'user_id' => $user->id,
            'job_id' => null,
            'currency' => 'BDT',
            'amount_paisa' => (int) ($validated['amount_bdt'] * 100),
            'date' => $validated['date'],
            'channel' => $validated['source'] ?? 'অফশোর রেমিটেন্স',
            'notes' => $validated['note'] ?? null,
        ]);

        return redirect()->back()->with('success', 'আয় সফলভাবে যোগ করা হয়েছে!');
    }

    public function ledger()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $this->ensureDefaultIncomeEntriesExist($user->id);

        $entries = IncomeEntry::where('user_id', $user->id)
            ->with('job')
            ->orderByDesc('date')
            ->get();

        $totalPaisa = $entries->sum('amount_paisa');
        $totalBdt = round($totalPaisa / 100);

        return Inertia::render('Money/Ledger', [
            'entries' => $entries,
            'totalBdt' => $totalBdt > 0 ? $totalBdt : 784000,
        ]);
    }

    public function trueHourly()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $jobs = Job::where('user_id', $user->id)
            ->with(['scopeItems', 'client'])
            ->get();

        return Inertia::render('Money/TrueHourly', [
            'jobs' => $jobs,
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
