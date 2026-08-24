<?php

namespace App\Http\Controllers\EasyRise;

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
    public function pipeline()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $clients = Client::where('user_id', $user->id)->get();

        $jobs = Job::where('user_id', $user->id)
            ->with('client')
            ->orderByDesc('created_at')
            ->get();

        $stats = [
            'active' => Job::where('user_id', $user->id)->where('status', 'active')->count(),
            'proposals_sent' => Proposal::where('user_id', $user->id)->where('outcome', 'sent')->count(),
            'awaiting_payment' => Job::where('user_id', $user->id)->where('status', 'awaiting_payment')->count(),
            'completed' => Job::where('user_id', $user->id)->where('status', 'closed')->count(),
        ];

        return Inertia::render('Work/Pipeline', [
            'clients' => $clients,
            'jobs' => $jobs,
            'stats' => $stats,
        ]);
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

        $job = Job::where('user_id', $user->id)->findOrFail($id);

        $items = ScopeItem::where('user_id', $user->id)
            ->where('job_id', $id)
            ->get();

        $agreed = $items->filter(fn ($item) => !$item->is_extra ?? true);
        $extra = $items->filter(fn ($item) => $item->is_extra ?? false);

        return Inertia::render('Work/ScopeGuard', [
            'agreed' => $agreed->values(),
            'extra' => $extra->values(),
            'items' => $items,
        ]);
    }

    public function proposals()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $proposals = Proposal::where('user_id', $user->id)
            ->with('job')
            ->orderByDesc('sent_at')
            ->get();

        $settings = EasyRiseSetting::where('user_id', $user->id)
            ->pluck('value', 'key');

        $windowDays = (int) ($settings->get('proposal_window_days') ?? 30);

        return Inertia::render('Work/ProposalTracker', [
            'proposals' => $proposals,
            'windowDays' => $windowDays,
        ]);
    }

    public function payments()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $overdueJobs = Job::where('user_id', $user->id)
            ->where('status', 'awaiting_payment')
            ->where('deadline', '<', Carbon::today())
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
