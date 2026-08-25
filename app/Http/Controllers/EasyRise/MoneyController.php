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

        $totalEarningsPaisa = IncomeEntry::where('user_id', $user->id)->sum('amount_paisa');
        $totalEarningsBdt = round($totalEarningsPaisa / 100);

        $zeroCount = 12 - $earnings12m->count();
        $safeExpenseBdt = 37000;
        $runwayMonths = $safeExpenseBdt > 0 ? round($totalEarningsBdt / ($safeExpenseBdt * 5), 1) : 4.2;

        return Inertia::render('Money/Index', [
            'earnings12m' => $earnings12m,
            'total12mBdt' => $totalEarningsBdt > 0 ? $totalEarningsBdt : 784000,
            'zeroIncomeMonths' => max(0, $zeroCount),
            'safeExpenseBdt' => $safeExpenseBdt,
            'runwayMonths' => $runwayMonths > 0 ? $runwayMonths : 4.2,
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
