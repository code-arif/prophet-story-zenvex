<?php

namespace App\Http\Controllers\EasyRise;

use \Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\EasyRise\Client;
use App\Models\EasyRise\EasyRiseSetting;
use App\Models\EasyRise\Job;
use App\Models\EasyRise\Proposal;
use App\Models\EasyRise\ReminderLog;
use App\Models\EasyRise\ScopeItem;
use App\Support\LearnerUser;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class WorkController extends Controller
{
    private function ensureDefaultJobsExist(int $userId): void
    {
        $count = Job::where('user_id', $userId)->count();
        if ($count === 0) {
            $client1 = Client::firstOrCreate(['user_id' => $userId, 'name' => 'Ahmed Traders'], ['source' => 'direct', 'marketplace' => 'Direct']);
            $client2 = Client::firstOrCreate(['user_id' => $userId, 'name' => 'Tech Nova BD'], ['source' => 'upwork', 'marketplace' => 'Upwork']);
            $client3 = Client::firstOrCreate(['user_id' => $userId, 'name' => 'Boutique 360'], ['source' => 'fiverr', 'marketplace' => 'Fiverr']);
            $client4 = Client::firstOrCreate(['user_id' => $userId, 'name' => 'নাবিলা স্টোর'], ['source' => 'direct', 'marketplace' => 'Direct']);
            $client5 = Client::firstOrCreate(['user_id' => $userId, 'name' => 'আজমাইন টেক'], ['source' => 'upwork', 'marketplace' => 'Upwork']);

            Job::create(['user_id' => $userId, 'client_id' => $client1->id, 'title' => 'লোগো ডিজাইন — ৩টি কনসেপ্ট', 'status' => 'active', 'deadline' => now()->addDays(3), 'agreed_paisa' => 1200000]);
            Job::create(['user_id' => $userId, 'client_id' => $client2->id, 'title' => 'ওয়েবসাইট রিডিজাইন (ফ্রন্টএন্ড)', 'status' => 'applied', 'deadline' => now()->addDays(5), 'agreed_paisa' => 2500000]);
            Job::create(['user_id' => $userId, 'client_id' => $client3->id, 'title' => 'সোশ্যাল মিডিয়া ব্যানার (৫টি)', 'status' => 'awaiting_payment', 'deadline' => now(), 'agreed_paisa' => 500000]);
            Job::create(['user_id' => $userId, 'client_id' => $client4->id, 'title' => 'ইউটিউব থাম্বনেইল কভার প্যাক', 'status' => 'delivered', 'deadline' => now()->subDays(1), 'agreed_paisa' => 450000]);
            Job::create(['user_id' => $userId, 'client_id' => $client5->id, 'title' => 'মোবাইল অ্যাপ UI ইউজার ফ্লো', 'status' => 'closed', 'deadline' => now()->subDays(10), 'agreed_paisa' => 1850000]);
        }
    }

    public function pipeline()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $this->ensureDefaultJobsExist($user->id);

        $clients = Client::where('user_id', $user->id)->get();

        $jobs = Job::where('user_id', $user->id)
            ->with('client')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'client_name' => $job->client ? $job->client->name : 'ক্লায়েন্ট',
                    'amount' => (int) round(($job->agreed_paisa ?? 0) / 100),
                    'deadline' => $job->deadline ? $job->deadline->format('Y-m-d') : null,
                    'deadline_formatted' => $job->deadline ? (
                        $job->deadline->isPast() && !$job->deadline->isToday()
                            ? 'মেয়াদ শেষ'
                            : ($job->deadline->isToday() ? 'আজ' : $job->deadline->diffForHumans())
                    ) : 'নির্ধারিত নয়',
                    'source' => $job->client ? ($job->client->marketplace ?? $job->client->source) : 'সরাসরি',
                    'status' => $job->status === 'awaiting_payment' ? 'payment_due' : ($job->status === 'closed' ? 'completed' : ($job->status === 'delivered' ? 'submitted' : ($job->status === 'prospect' ? 'proposal' : $job->status))),
                ];
            });

        $dueJobsQuery = Job::where('user_id', $user->id)->where('status', 'awaiting_payment');

        $stats = [
            'proposals_sent' => Job::where('user_id', $user->id)->whereIn('status', ['prospect', 'applied', 'proposal'])->count(),
            'active' => Job::where('user_id', $user->id)->where('status', 'active')->count(),
            'submitted' => Job::where('user_id', $user->id)->where('status', 'delivered')->count(),
            'awaiting_payment' => $dueJobsQuery->count(),
            'due_total_amount' => (int) round($dueJobsQuery->sum('agreed_paisa') / 100),
            'completed' => Job::where('user_id', $user->id)->where('status', 'closed')->count(),
        ];

        return Inertia::render('Work/Pipeline', [
            'clients' => $clients,
            'jobs' => $jobs,
            'stats' => $stats,
        ]);
    }

    public function storeJob(\Illuminate\Http\Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'amount' => 'nullable|numeric|min:0',
            'status' => 'required|string',
        ]);

        $client = Client::firstOrCreate(
            ['user_id' => $user->id, 'name' => $validated['client_name']],
            ['source' => 'direct', 'marketplace' => 'Direct']
        );

        $dbStatusMap = [
            'proposal' => 'applied',
            'active' => 'active',
            'submitted' => 'delivered',
            'payment_due' => 'awaiting_payment',
            'completed' => 'closed',
        ];

        $status = $dbStatusMap[$validated['status']] ?? $validated['status'];
        $amountInPaisa = isset($validated['amount']) ? (int) ($validated['amount'] * 100) : 0;

        Job::create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'title' => $validated['title'],
            'status' => $status,
            'agreed_paisa' => $amountInPaisa,
            'deadline' => now()->addDays(7),
        ]);

        return redirect()->back()->with('success', 'নতুন কাজ যুক্ত করা হয়েছে!');
    }

    public function jobDetail($id)
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $job = Job::where('user_id', $user->id)
            ->with(['client', 'scopeItems', 'incomeEntries'])
            ->findOrFail($id);

        $scopeItems = ScopeItem::where('user_id', $user->id)
            ->where('job_id', $id)
            ->get();

        $payments = $job->incomeEntries;

        return Inertia::render('Work/JobDetail', [
            'job' => $job,
            'scopeItems' => $scopeItems,
            'payments' => $payments,
        ]);
    }

    public function scope($id)
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $this->ensureDefaultJobsExist($user->id);

        $job = Job::where('user_id', $user->id)->with('client')->find($id);

        if (!$job) {
            $job = Job::where('user_id', $user->id)->with('client')->first();
        }

        $items = $job ? ScopeItem::where('user_id', $user->id)
            ->where('job_id', $job->id)
            ->orderByDesc('created_at')
            ->get() : collect([]);

        $agreed = $items->filter(fn ($item) => !$item->is_extra);
        $extra = $items->filter(fn ($item) => $item->is_extra);

        return Inertia::render('Work/ScopeGuard', [
            'job' => $job,
            'jobId' => $job ? $job->id : $id,
            'agreed' => $agreed->values(),
            'extra' => $extra->values(),
            'items' => $items,
        ]);
    }

    public function storeScopeItem(Request $request, $id)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'hours' => 'nullable|numeric|min:0.5',
            'is_extra' => 'nullable|boolean',
        ]);

        ScopeItem::create([
            'user_id' => $user->id,
            'job_id' => $id,
            'description' => $validated['description'],
            'hours' => $validated['hours'] ?? 1.0,
            'is_extra' => $validated['is_extra'] ?? true,
            'date' => now(),
        ]);

        return redirect()->back()->with('success', 'নতুন স্কোপ আইটেম যুক্ত করা হয়েছে!');
    }

    public function updateScopeItem(Request $request, $id)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $item = ScopeItem::where('user_id', $user->id)->find($id);
        if ($item) {
            $validated = $request->validate([
                'description' => 'required|string|max:255',
                'hours' => 'nullable|numeric|min:0.5',
            ]);

            $item->update([
                'description' => $validated['description'],
                'hours' => $validated['hours'] ?? $item->hours,
            ]);
        }

        return redirect()->back()->with('success', 'স্কোপ আইটেম আপডেট করা হয়েছে!');
    }

    public function destroyScopeItem($id)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $item = ScopeItem::where('user_id', $user->id)->find($id);
        if ($item) {
            $item->delete();
        }

        return redirect()->back()->with('success', 'স্কোপ আইটেম মুছে ফেলা হয়েছে!');
    }

    private function ensureDefaultProposalsExist(int $userId): void
    {
        $count = Proposal::where('user_id', $userId)->count();
        if ($count === 0) {
            $this->ensureDefaultJobsExist($userId);
            $jobs = Job::where('user_id', $userId)->get();

            $seedData = [
                [
                    'job_id' => $jobs[0]->id ?? null,
                    'marketplace' => 'Upwork',
                    'job_type' => 'Graphic Design',
                    'quoted_paisa' => 500000,
                    'outcome' => 'replied',
                    'sent_at' => now(),
                ],
                [
                    'job_id' => $jobs[1]->id ?? null,
                    'marketplace' => 'Fiverr',
                    'job_type' => 'Web Development',
                    'quoted_paisa' => 1200000,
                    'outcome' => 'sent',
                    'sent_at' => now()->subDay(),
                ],
                [
                    'job_id' => $jobs[2]->id ?? null,
                    'marketplace' => 'Upwork',
                    'job_type' => 'Data Entry',
                    'quoted_paisa' => 300000,
                    'outcome' => 'won',
                    'sent_at' => now()->subDays(3),
                ],
                [
                    'job_id' => $jobs[3]->id ?? null,
                    'marketplace' => 'Direct',
                    'job_type' => 'UI/UX Mobile App Redesign',
                    'quoted_paisa' => 2000000,
                    'outcome' => 'won',
                    'sent_at' => now()->subDays(5),
                ],
            ];

            foreach ($seedData as $data) {
                Proposal::create(array_merge($data, ['user_id' => $userId]));
            }
        }
    }

    public function proposals()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $this->ensureDefaultProposalsExist($user->id);

        $proposals = Proposal::where('user_id', $user->id)
            ->with('job')
            ->orderByDesc('sent_at')
            ->get();

        $totalSent = max(1, $proposals->count());
        $totalReplied = $proposals->filter(fn ($p) => in_array($p->outcome, ['replied', 'won', 'viewed']))->count();
        $totalWon = $proposals->filter(fn ($p) => in_array($p->outcome, ['won', 'hired']))->count();

        $responseRatePct = (int) round(($totalReplied / $totalSent) * 100);
        $winRatePct = (int) round(($totalWon / $totalSent) * 100);

        // Group by marketplace
        $marketplaceData = $proposals->groupBy(fn ($p) => $p->marketplace ?: 'Upwork')
            ->map(function ($group, $mName) use ($totalSent) {
                $pct = (int) round(($group->count() / $totalSent) * 100);
                return [
                    'name' => $mName,
                    'pct' => $pct > 0 ? $pct : 10,
                    'barClass' => 'bg-brand',
                ];
            })->values();

        // Group by category/job_type
        $categoryData = $proposals->groupBy(fn ($p) => $p->job_type ?: 'অন্যান্য')
            ->map(function ($group, $cName) use ($totalSent) {
                $pct = (int) round(($group->count() / $totalSent) * 100);
                return [
                    'name' => $cName,
                    'pct' => $pct > 0 ? $pct : 10,
                    'barClass' => 'bg-brand',
                ];
            })->values();

        $stats = [
            'sent' => $totalSent,
            'replied' => $totalReplied,
            'won' => $totalWon,
            'response_rate_pct' => $responseRatePct,
            'win_rate_pct' => $winRatePct,
            'marketplace_data' => $marketplaceData,
            'category_data' => $categoryData,
        ];

        return Inertia::render('Work/ProposalTracker', [
            'proposals' => $proposals,
            'stats' => $stats,
            'windowDays' => 90,
        ]);
    }

    public function storeProposal(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'marketplace' => 'required|string|max:255',
            'amount' => 'nullable|numeric|min:0',
            'outcome' => 'required|string',
        ]);

        $amountInPaisa = isset($validated['amount']) ? (int) ($validated['amount'] * 100) : 0;

        Proposal::create([
            'user_id' => $user->id,
            'marketplace' => $validated['marketplace'],
            'job_type' => $validated['title'],
            'quoted_paisa' => $amountInPaisa,
            'outcome' => $validated['outcome'],
            'sent_at' => now(),
        ]);

        return redirect()->back()->with('success', 'নতুন প্রস্তাব যুক্ত করা হয়েছে!');
    }

    public function payments()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $this->ensureDefaultJobsExist($user->id);

        $overdueJobs = Job::where('user_id', $user->id)
            ->whereIn('status', ['awaiting_payment', 'active', 'delivered'])
            ->with('client')
            ->get();

        $reminderLog = ReminderLog::where('user_id', $user->id)
            ->orderByDesc('sent_at')
            ->limit(20)
            ->get();

        return Inertia::render('Work/PaymentsDue', [
            'overdueJobs' => $overdueJobs,
            'reminderLog' => $reminderLog,
        ]);
    }

    public function storeReminderLog(Request $request, $id)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $job = Job::where('user_id', $user->id)->find($id);
        if ($job) {
            $validated = $request->validate([
                'type' => 'nullable|string',
                'message' => 'nullable|string',
            ]);

            ReminderLog::create([
                'user_id' => $user->id,
                'job_id' => $job->id,
                'type' => $validated['type'] ?? 'reminder',
                'message' => $validated['message'] ?? 'তাগাদা বার্তা পাঠানো হয়েছে।',
                'sent_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'তাগাদা বার্তা রেকর্ড করা হয়েছে!');
    }

    public function capacity()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $settings = EasyRiseSetting::where('user_id', $user->id)
            ->pluck('value', 'key');

        $weeklyHours = (int) ($settings->get('weekly_hours') ?? 40);

        $weekStart = Carbon::now()->startOfWeek();
        $weekEnd = Carbon::now()->endOfWeek();

        $committed = ScopeItem::where('user_id', $user->id)
            ->whereBetween('date', [$weekStart, $weekEnd])
            ->get()
            ->groupBy('job_id')
            ->map(fn ($items, $jobId) => [
                'job_id' => $jobId,
                'hours' => $items->sum('hours'),
            ])
            ->values();

        $totalCommitted = $committed->sum('hours');
        $available = max(0, $weeklyHours - $totalCommitted);

        return Inertia::render('Work/CapacityMeter', [
            'weeklyHours' => $weeklyHours,
            'committed' => $committed,
            'available' => $available,
        ]);
    }

    public function screener()
    {
        $rules = json_decode(
            file_get_contents(resource_path('js/data/screenerRules.json')),
            true
        );

        $verdictBands = $rules['verdictBands'] ?? [];
        $scoringRules = $rules['rules'] ?? [];
        $questions = collect($rules)->filter(fn ($item) => isset($item['question']))->values();

        return Inertia::render('Work/ClientScreener', [
            'questions' => $questions,
            'verdictBands' => $verdictBands,
            'rules' => $scoringRules,
        ]);
    }
}
