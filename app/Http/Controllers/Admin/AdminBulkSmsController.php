<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendSmsToMsisdnJob;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Support\Msisdn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminBulkSmsController extends Controller
{
    public function create(Request $request)
    {
        $totalSubscribers = Subscriber::query()->count();

        $activeMsisdnCount = Subscription::query()
            ->where('status', Subscription::STATUS_ACTIVE)
            ->whereNull('ends_at')
            ->distinct('msisdn')
            ->count('msisdn');

        $inactiveEstimate = max(0, $totalSubscribers - $activeMsisdnCount);

        return Inertia::render('Admin/Sms/Bulk', [
            'stats' => [
                'subscribersTotal' => $totalSubscribers,
                'activeSubscriptions' => $activeMsisdnCount,
                'inactiveEstimate' => $inactiveEstimate,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'segment' => ['required', 'string', 'in:all_subscribers,active_subscribers,inactive_subscribers,custom'],
            'message' => ['required', 'string', 'max:480'],
            'custom_msisdns' => ['nullable', 'string', 'max:50000'],
            'delay_seconds' => ['nullable', 'integer', 'min:0', 'max:10'],
        ]);

        $segment = $validated['segment'];
        $message = trim($validated['message']);
        $delaySeconds = (int) ($validated['delay_seconds'] ?? 1);

        $msisdns = collect();

        if ($segment === 'all_subscribers') {
            $msisdns = Subscriber::query()->pluck('msisdn');
        } elseif ($segment === 'active_subscribers') {
            $msisdns = Subscription::query()
                ->where('status', Subscription::STATUS_ACTIVE)
                ->whereNull('ends_at')
                ->distinct()
                ->pluck('msisdn');
        } elseif ($segment === 'inactive_subscribers') {
            $active = Subscription::query()
                ->where('status', Subscription::STATUS_ACTIVE)
                ->whereNull('ends_at')
                ->distinct()
                ->pluck('msisdn');

            $msisdns = Subscriber::query()
                ->whereNotIn('msisdn', $active)
                ->pluck('msisdn');
        } elseif ($segment === 'custom') {
            $raw = (string) ($validated['custom_msisdns'] ?? '');
            $parts = preg_split('/[\s,;]+/', $raw) ?: [];

            $msisdns = collect($parts)
                ->map(fn ($v) => Msisdn::normalizeBd((string) $v))
                ->filter(fn ($v) => $v !== '')
                ->unique()
                ->values();
        }

        $msisdns = $msisdns
            ->map(fn ($v) => Msisdn::normalizeBd((string) $v))
            ->filter(fn ($v) => $v !== '')
            ->unique()
            ->values();

        $maxRecipients = 2000;
        if ($msisdns->count() > $maxRecipients) {
            return back()->with('error', "Too many recipients ({$msisdns->count()}). Max {$maxRecipients} per bulk send.");
        }

        if ($message === '') {
            return back()->with('error', 'Message cannot be empty.');
        }

        $tag = 'admin-bulk-'.now()->format('YmdHis');

        $i = 0;
        foreach ($msisdns as $msisdn) {
            $job = new SendSmsToMsisdnJob($msisdn, $message, $tag);

            // Stagger dispatch slightly to reduce provider bursts.
            $job->delay(now()->addSeconds($delaySeconds * (int) floor($i / 20)));
            dispatch($job);
            $i++;
        }

        return back()->with('status', "Queued {$msisdns->count()} SMS messages ({$segment}). Tag: {$tag}");
    }
}
