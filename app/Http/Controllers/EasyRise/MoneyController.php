<?php

namespace App\Http\Controllers\EasyRise;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\EasyRise\Client;
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

    private function ensureDefaultJobsExist(int $userId): void
    {
        $count = Job::where('user_id', $userId)->count();
        if ($count === 0) {
            $client1 = Client::firstOrCreate(['user_id' => $userId, 'name' => 'Ahmed Traders'], ['source' => 'direct', 'marketplace' => 'Direct']);
            $client2 = Client::firstOrCreate(['user_id' => $userId, 'name' => 'Tech Nova BD'], ['source' => 'upwork', 'marketplace' => 'Upwork']);
            $client3 = Client::firstOrCreate(['user_id' => $userId, 'name' => 'Boutique 360'], ['source' => 'fiverr', 'marketplace' => 'Fiverr']);

            Job::create(['user_id' => $userId, 'client_id' => $client1->id, 'title' => 'লোগো ডিজাইন — ৩টি কনসেপ্ট', 'status' => 'active', 'deadline' => now()->addDays(3), 'agreed_paisa' => 1200000]);
            Job::create(['user_id' => $userId, 'client_id' => $client2->id, 'title' => 'ওয়েবসাইট রিডিজাইন (ফ্রন্টএন্ড)', 'status' => 'applied', 'deadline' => now()->addDays(5), 'agreed_paisa' => 2500000]);
            Job::create(['user_id' => $userId, 'client_id' => $client3->id, 'title' => 'সোশ্যাল মিডিয়া ব্যানার (৫টি)', 'status' => 'awaiting_payment', 'deadline' => now(), 'agreed_paisa' => 500000]);
        }
    }

    public function trueHourly()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $this->ensureDefaultJobsExist($user->id);

        $jobs = Job::where('user_id', $user->id)
            ->with(['scopeItems', 'client'])
            ->get();

        $historyKey = "user_true_hourly_rates_{$user->id}";
        $history = cache()->get($historyKey, [410, 450, 435, 520]);
        $minTargetRate = cache()->get("user_min_target_rate_{$user->id}", 800);

        return Inertia::render('Money/TrueHourly', [
            'jobs' => $jobs,
            'rateHistory' => $history,
            'minTargetRate' => $minTargetRate,
        ]);
    }

    public function storeTrueHourly(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'job_id' => 'nullable|integer',
            'target_rate' => 'nullable|numeric',
            'actual_rate' => 'required|numeric',
            'total_hours' => 'nullable|numeric',
        ]);

        $historyKey = "user_true_hourly_rates_{$user->id}";
        $history = cache()->get($historyKey, [410, 450, 435, 520]);

        $newRate = (int) round($validated['actual_rate']);
        array_unshift($history, $newRate);
        $history = array_values(array_unique($history));
        $history = array_slice($history, 0, 8);

        cache()->put($historyKey, $history, now()->addDays(90));

        if (!empty($validated['target_rate'])) {
            cache()->put("user_min_target_rate_{$user->id}", (int)$validated['target_rate'], now()->addDays(90));
        }

        return redirect()->back()->with('success', 'রেট হিসাব সফলভাবে সংরক্ষণ করা হয়েছে!');
    }

    public function runway()
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

        $monthlyBars = [];
        $maxBdt = 0;
        $nonZeroIncomeList = [];

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

            if ($totalBdt > 0) {
                $nonZeroIncomeList[] = $totalBdt;
            }

            $monthlyBars[] = [
                'month' => $monthNamesBn[$m],
                'amount' => $totalBdt,
            ];
        }

        $worstMonthBdt = count($nonZeroIncomeList) > 0 ? min($nonZeroIncomeList) : 9000;

        foreach ($monthlyBars as &$bar) {
            $amt = $bar['amount'];
            $bar['heightPct'] = $maxBdt > 0 && $amt > 0 ? max(10, min(100, (int)round(($amt / $maxBdt) * 100))) : 6;
            $bar['isLow'] = $amt < 30000;
            $bar['isWorst'] = $amt === $worstMonthBdt;
        }
        unset($bar);

        $totalEarningsPaisa = IncomeEntry::where('user_id', $user->id)->sum('amount_paisa');
        $totalEarningsBdt = (int)round($totalEarningsPaisa / 100);

        $avgIncomeBdt = count($nonZeroIncomeList) > 0
            ? (int)round(array_sum($nonZeroIncomeList) / count($nonZeroIncomeList))
            : 65300;

        $userExpenseKey = "user_essential_expense_{$user->id}";
        $userSavingsKey = "user_current_savings_{$user->id}";

        $expenses = cache()->get($userExpenseKey, 32000);
        $savings = cache()->get($userSavingsKey, $totalEarningsBdt > 0 ? $totalEarningsBdt : 135000);

        return Inertia::render('Money/Runway', [
            'monthlyIncome' => $monthlyBars,
            'avgIncomeBdt' => $avgIncomeBdt,
            'worstMonthBdt' => $worstMonthBdt,
            'expenses' => $expenses,
            'savings' => $savings,
        ]);
    }

    public function storeRunwaySettings(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'essential_expense' => 'nullable|numeric|min:0',
            'current_savings' => 'nullable|numeric|min:0',
        ]);

        if (isset($validated['essential_expense'])) {
            cache()->put("user_essential_expense_{$user->id}", (int)$validated['essential_expense'], now()->addDays(90));
        }

        if (isset($validated['current_savings'])) {
            cache()->put("user_current_savings_{$user->id}", (int)$validated['current_savings'], now()->addDays(90));
        }

        return redirect()->back()->with('success', 'রানওয়ে সেটিংস আপডেট করা হয়েছে!');
    }

    public function channels()
    {
        $user = LearnerUser::resolve();

        $incentiveData = json_decode(
            file_get_contents(resource_path('js/data/incentiveRules.json')),
            true
        );

        $jsonChannels = $incentiveData['channels'] ?? [];

        $channelList = [
            [
                'id' => 0,
                'title' => 'সরাসরি ব্যাংক ট্রান্সফার (SWIFT)',
                'subtitle' => 'উচ্চ নিরাপত্তার আন্তর্জাতিক ট্রান্সফার',
                'icon_type' => 'bank',
                'requirements' => ['পাসপোর্ট কপি', 'আয়ের চুক্তিপত্র', 'ব্যাংক তথ্য'],
                'duration' => '২-৫ কার্যদিবস',
                'documents' => [
                    ['name' => 'সার্টিফিকেট অফ ইনওয়ার্ড রেমিট্যান্স', 'note' => 'প্রণোদনার জন্য'],
                    ['name' => 'অ্যাডভাইস নোট', 'note' => 'করের জন্য'],
                ],
                'limits' => [
                    'min' => 'কোনো সীমা নেই',
                    'max' => 'ব্যাংক নীতি অনুযায়ী প্রযোজ্য',
                    'verifiedDate' => '২০২৬',
                ],
            ],
            [
                'id' => 1,
                'title' => 'অনলাইন পেমেন্ট প্ল্যাটফর্ম',
                'subtitle' => 'পেওনিয়ার, ওয়াইজ ইত্যাদি',
                'icon_type' => 'globe',
                'requirements' => ['জাতীয় পরিচয়পত্র / পাসপোর্ট', 'লাইভ ফেস ভেরিফিকেশন', 'ব্যাংক অ্যাকাউন্ট লিঙ্ক'],
                'duration' => '১-২ কার্যদিবস',
                'documents' => [
                    ['name' => 'পেওনিয়ার ইনওয়ার্ড স্টেটমেন্ট', 'note' => 'ব্যাংক জমার জন্য'],
                    ['name' => 'ডিজিটাল ট্রানজেকশন রসিদ', 'note' => 'করের রেকর্ডের জন্য'],
                ],
                'limits' => [
                    'min' => 'USD ৫০',
                    'max' => 'দৈনিক USD ১০,০০০',
                    'verifiedDate' => '২০২৬',
                ],
            ],
            [
                'id' => 2,
                'title' => 'লোকাল গেটওয়ে (MFS)',
                'subtitle' => 'বিকাশ, নগদ, রকেট (রেমিটেন্স ওয়ালেট)',
                'icon_type' => 'store',
                'requirements' => ['জাতীয় পরিচয়পত্র / টিন সার্টিফিকেট', 'বিকাশ/নগদ রেমিটেন্স ওয়ালেট লিঙ্ক'],
                'duration' => 'তাৎক্ষণিক / ইনস্ট্যান্ট',
                'documents' => [
                    ['name' => 'এমএফএস ইনওয়ার্ড রসিদ', 'note' => 'ইনস্ট্যান্ট ক্যাশ ইন'],
                ],
                'limits' => [
                    'min' => '৳ ৫০০',
                    'max' => '৳ ২,৫০,০০০ / দিন',
                    'verifiedDate' => '২০২৬',
                ],
            ],
        ];

        return Inertia::render('Money/Channels', [
            'channels' => $channelList,
            'rules' => $jsonChannels,
            'requirements' => $incentiveData['eligibilityBn'] ?? [],
        ]);
    }

    public function addChannelDoc(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'channel_name' => 'required|string|max:255',
            'doc_name' => 'required|string|max:255',
        ]);

        Document::firstOrCreate(
            [
                'user_id' => $user->id,
                'name' => $validated['doc_name'],
            ],
            [
                'purpose' => 'রেমিটেন্স চ্যানেল — ' . $validated['channel_name'],
                'status' => 'missing',
                'note' => 'চ্যানেল থেকে প্রয়োজনীয় নথি',
            ]
        );

        return redirect()->back()->with('success', 'কাগজটি প্রস্তুতি তালিকায় যুক্ত করা হয়েছে!');
    }

    public function incentive()
    {
        $user = LearnerUser::resolve();
        if ($user) {
            $this->ensureDefaultIncomeEntriesExist($user->id);
        }

        $incentiveData = json_decode(
            file_get_contents(resource_path('js/data/incentiveRules.json')),
            true
        );

        $latestEntry = $user ? IncomeEntry::where('user_id', $user->id)->orderByDesc('date')->first() : null;

        $latestIncome = $latestEntry ? [
            'id' => $latestEntry->id,
            'amount_bdt' => (int) round(($latestEntry->amount_paisa ?? 0) / 100),
            'amount_usd' => (int) round((($latestEntry->amount_paisa ?? 0) / 100) / 119.5),
            'channel' => $latestEntry->channel,
            'date' => $latestEntry->date ? $latestEntry->date->format('Y-m-d') : null,
        ] : null;

        return Inertia::render('Money/Incentive', [
            'latestIncome' => $latestIncome,
            'payment' => $latestEntry,
            'rules' => $incentiveData['channels'] ?? [],
            'eligibility' => $incentiveData['eligibilityBn'] ?? [],
        ]);
    }

    public function incentiveResult(Request $request)
    {
        $user = LearnerUser::resolve();

        $isBanking = $request->query('is_banking', '0') === '1';
        $amountBdt = (int) $request->query('amount_bdt', 53775);
        $hasFreelance = $request->query('has_freelance', '1') === '1';

        $ratePct = $isBanking ? 2.5 : 0.0;
        $calculated = $isBanking ? (int) round($amountBdt * 0.025) : 0;

        return Inertia::render('Money/IncentiveResult', [
            'isEligible' => $isBanking,
            'amountBdt' => $amountBdt,
            'incentiveRatePct' => $ratePct,
            'incentiveCalculated' => $calculated,
            'blockingReason' => $isBanking ? null : 'টাকাটি অনানুষ্ঠানিক (Hundi) পথে এসেছে বলে মনে হচ্ছে',
            'conditions' => [
                ['label' => 'ব্যাংকিং চ্যানেলের প্রমাণ', 'matched' => $isBanking],
                ['label' => 'ফ্রিল্যান্সিং কাজের প্রমাণ', 'matched' => $hasFreelance],
            ],
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

        $existingPurposes = Document::where('user_id', $user->id)->pluck('purpose')->toArray();

        $defaultDocs = [
            // Purpose: ফ্রিল্যান্সার আইডি কার্ড
            [
                'user_id' => $user->id,
                'name' => 'NID কপি',
                'purpose' => 'ফ্রিল্যান্সার আইডি কার্ড',
                'status' => 'valid',
                'expiry_date' => null,
                'note' => 'পরিচয়পত্র হিসেবে',
            ],
            [
                'user_id' => $user->id,
                'name' => 'ট্রেড লাইসেন্স',
                'purpose' => 'ফ্রিল্যান্সার আইডি কার্ড',
                'status' => 'expired',
                'expiry_date' => now()->addDays(14)->format('Y-m-d'),
                'note' => 'পেশার প্রমাণ (নবায়ন করতে হবে)',
            ],
            [
                'user_id' => $user->id,
                'name' => 'পাসপোর্ট ছবি',
                'purpose' => 'ফ্রিল্যান্সার আইডি কার্ড',
                'status' => 'missing',
                'expiry_date' => null,
                'note' => 'ভেরিফিকেশন',
            ],

            // Purpose: কর রিটার্ন
            [
                'user_id' => $user->id,
                'name' => 'TIN সার্টিফিকেট',
                'purpose' => 'কর রিটার্ন',
                'status' => 'valid',
                'expiry_date' => null,
                'note' => 'কর শনাক্তকরণ নম্বর',
            ],
            [
                'user_id' => $user->id,
                'name' => 'আয়কর জমার রসিদ',
                'purpose' => 'কর রিটার্ন',
                'status' => 'expired',
                'expiry_date' => now()->subDays(5)->format('Y-m-d'),
                'note' => 'গত বছরের কর জমার প্রমাণ',
            ],

            // Purpose: ব্যাংক অ্যাকাউন্ট
            [
                'user_id' => $user->id,
                'name' => 'ব্যাংক স্টেটমেন্ট',
                'purpose' => 'ব্যাংক অ্যাকাউন্ট',
                'status' => 'valid',
                'expiry_date' => null,
                'note' => 'গত ৩ মাসের লেনদেন',
            ],
            [
                'user_id' => $user->id,
                'name' => 'ইনওয়ার্ড রেমিট্যান্স সার্টিফিকেট',
                'purpose' => 'ব্যাংক অ্যাকাউন্ট',
                'status' => 'valid',
                'expiry_date' => null,
                'note' => '২.৫% প্রণোদনার জন্য প্রমাণপত্র',
            ],
        ];

        $hasIdDocs = false;
        $hasTaxDocs = false;
        $hasBankDocs = false;

        foreach ($existingPurposes as $p) {
            if (str_contains($p, 'আইডি') || str_contains($p, 'ID') || str_contains($p, 'freelance')) $hasIdDocs = true;
            if (str_contains($p, 'কর') || str_contains($p, 'ট্যাক্স') || str_contains($p, 'tax')) $hasTaxDocs = true;
            if (str_contains($p, 'ব্যাংক') || str_contains($p, 'bank') || str_contains($p, 'রেমিটেন্স')) $hasBankDocs = true;
        }

        if (!$hasIdDocs || !$hasTaxDocs || !$hasBankDocs) {
            foreach ($defaultDocs as $doc) {
                Document::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'name' => $doc['name'],
                    ],
                    $doc
                );
            }
        }

        $documents = Document::where('user_id', $user->id)->get();

        return Inertia::render('Money/DocReadiness', [
            'purposes' => $documentData['purposes'] ?? [],
            'documents' => $documents,
        ]);
    }

    public function updateDocument(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'id' => 'nullable|integer',
            'name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'status' => 'required|string|in:valid,ready,missing,expired',
            'expiry_date' => 'nullable|date',
            'note' => 'nullable|string|max:1000',
        ]);

        $dbStatus = ($validated['status'] === 'ready') ? 'valid' : $validated['status'];

        if (!empty($validated['id'])) {
            $doc = Document::where('user_id', $user->id)->where('id', $validated['id'])->first();
            if ($doc) {
                $doc->update([
                    'status' => $dbStatus,
                    'expiry_date' => $validated['expiry_date'] ?? null,
                    'note' => $validated['note'] ?? null,
                ]);
            }
        } else {
            Document::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'purpose' => $validated['purpose'],
                'status' => $dbStatus,
                'expiry_date' => $validated['expiry_date'] ?? null,
                'note' => $validated['note'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'কাগজপত্রের তথ্য সেভ করা হয়েছে!');
    }

    public function proof()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');
        $this->ensureDefaultIncomeEntriesExist($user->id);

        $totalEarningsPaisa = IncomeEntry::where('user_id', $user->id)->sum('amount_paisa');
        $entries = IncomeEntry::where('user_id', $user->id)->orderByDesc('date')->take(10)->get()->map(function ($e) {
            return [
                'id' => $e->id,
                'date' => $e->date ? $e->date->format('Y-m-d') : '',
                'client_name' => $e->client_name ?? 'গোপনীয় ক্লায়েন্ট',
                'channel' => $e->channel ?? 'ব্যাংক রেমিট্যান্স',
                'amount_bdt' => (int) round(($e->amount_paisa ?? 0) / 100),
            ];
        });

        return Inertia::render('Money/IncomeProof', [
            'personName' => $user->name ?? 'Md. Rubel Hossain',
            'totalEarningsBdt' => (int) round($totalEarningsPaisa / 100),
            'entries' => $entries,
        ]);
    }
}
