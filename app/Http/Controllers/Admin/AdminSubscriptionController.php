<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Services\BdAppsApiClient;
use App\Services\BdAppsSmsService;
use App\Services\SubscriberSync;
use App\Support\Msisdn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminSubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $nameMatchMsisdns = collect();
        if ($q !== '' && !preg_match('/\d/', $q)) {
            $nameMatchMsisdns = Subscriber::query()
                ->where('name', 'like', '%'.$q.'%')
                ->limit(500)
                ->pluck('msisdn');
        }

        $page = Subscription::query()
            ->select(['msisdn', DB::raw('MAX(updated_at) as last_updated')])
            ->when($q !== '', function ($query) use ($q, $nameMatchMsisdns) {
                $query->where(function ($sub) use ($q, $nameMatchMsisdns) {
                    $sub->where('msisdn', 'like', '%'.$q.'%');
                    if ($nameMatchMsisdns->isNotEmpty()) {
                        $sub->orWhereIn('msisdn', $nameMatchMsisdns);
                    }
                });
            })
            ->groupBy('msisdn')
            ->orderByDesc('last_updated')
            ->paginate(app(\App\Services\AppSettings::class)->paginationSubscriptions())
            ->withQueryString();

        $msisdns = collect($page->items())->pluck('msisdn')->values();

        $subscribers = $msisdns->isEmpty()
            ? collect()
            : Subscriber::query()
                ->whereIn('msisdn', $msisdns)
                ->get(['msisdn', 'name', 'updated_at']);

        $subscriberByMsisdn = $subscribers->keyBy('msisdn');

        $subs = $msisdns->isEmpty()
            ? collect()
            : Subscription::query()
                ->whereIn('msisdn', $msisdns)
                ->get(['id', 'msisdn', 'status', 'starts_at', 'ends_at', 'channel', 'updated_at']);

        $byMsisdn = $subs->groupBy('msisdn')->map(function ($rows) {
            $active = $rows->firstWhere('status', Subscription::STATUS_ACTIVE);
            $canceled = $rows->firstWhere('status', Subscription::STATUS_CANCELED);

            $current = null;
            if ($active && $active->ends_at === null) {
                $current = $active;
            } elseif ($canceled) {
                $current = $canceled;
            } elseif ($active) {
                $current = $active;
            }

            return [
                'active' => $active,
                'canceled' => $canceled,
                'current' => $current,
            ];
        });

        $items = collect($page->items())->map(function ($row) use ($byMsisdn, $subscriberByMsisdn) {
            $msisdn = $row->msisdn;
            $subscriber = $subscriberByMsisdn->get($msisdn);
            $pack = $byMsisdn->get($msisdn, ['active' => null, 'canceled' => null, 'current' => null]);
            $current = $pack['current'];

            return [
                'msisdn' => $msisdn,
                'name' => $subscriber?->name,
                'updated_at' => $row->last_updated,
                'current' => $current ? [
                    'status' => $current->status,
                    'starts_at' => $current->starts_at,
                    'ends_at' => $current->ends_at,
                    'channel' => $current->channel,
                ] : null,
                'isActive' => (bool) ($pack['active'] && $pack['active']->ends_at === null),
            ];
        })->values();

        return Inertia::render('Admin/Subscriptions/Index', [
            'q' => $q,
            'rows' => [
                'data' => $items,
                'links' => $page->linkCollection(),
                'meta' => [
                    'current_page' => $page->currentPage(),
                    'last_page' => $page->lastPage(),
                    'per_page' => $page->perPage(),
                    'total' => $page->total(),
                ],
            ],
        ]);
    }

    public function show(string $msisdn)
    {
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        $subscriber = Subscriber::query()
            ->where('msisdn', $msisdn)
            ->first(['msisdn', 'name', 'dob', 'avatar_path', 'created_at', 'updated_at']);

        $active = Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_ACTIVE)
            ->first(['id', 'msisdn', 'status', 'starts_at', 'ends_at', 'channel', 'last_message', 'created_at', 'updated_at']);

        $canceled = Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_CANCELED)
            ->first(['id', 'msisdn', 'status', 'starts_at', 'ends_at', 'channel', 'last_message', 'created_at', 'updated_at']);

        $isActive = (bool) ($active && $active->ends_at === null);

        return Inertia::render('Admin/Subscriptions/Show', [
            'subscriber' => $subscriber,
            'msisdn' => $msisdn,
            'isActive' => $isActive,
            'active' => $active,
            'canceled' => $canceled,
        ]);
    }

    public function activate(Request $request, string $msisdn, SubscriberSync $sync): RedirectResponse
    {
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        $validated = $request->validate([
            'channel' => ['nullable', 'string', 'max:32'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $channel = trim((string) ($validated['channel'] ?? 'admin'));
        if ($channel === '') {
            $channel = 'admin';
        }

        $sync->ensureExists($msisdn);

        // Keep one current status per MSISDN.
        Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_CANCELED)
            ->delete();

        Subscription::query()->updateOrCreate(
            ['msisdn' => $msisdn, 'status' => Subscription::STATUS_ACTIVE],
            [
                'starts_at' => now(),
                'ends_at' => null,
                'channel' => $channel,
                'last_message' => $validated['note'] ?? null,
            ]
        );

        // Sync with BDApps platform if enabled
        if ((bool) config('services.bdapps.use_platform_subscription', false)) {
            try {
                app(BdAppsApiClient::class)->setSubscription($msisdn, true);
            } catch (\Throwable $e) {
                // Log but don't block admin action
            }
        }

        return back()->with('status', 'Subscription marked ACTIVE.');
    }

    public function cancel(Request $request, string $msisdn, SubscriberSync $sync): RedirectResponse
    {
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        $validated = $request->validate([
            'channel' => ['nullable', 'string', 'max:32'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $channel = trim((string) ($validated['channel'] ?? 'admin'));
        if ($channel === '') {
            $channel = 'admin';
        }

        $sync->ensureExists($msisdn);

        // Keep one current status per MSISDN.
        Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_ACTIVE)
            ->delete();

        Subscription::query()->updateOrCreate(
            ['msisdn' => $msisdn, 'status' => Subscription::STATUS_CANCELED],
            [
                'ends_at' => now(),
                'channel' => $channel,
                'last_message' => $validated['note'] ?? null,
            ]
        );

        // Sync with BDApps platform if enabled
        if ((bool) config('services.bdapps.use_platform_subscription', false)) {
            try {
                app(BdAppsApiClient::class)->setSubscription($msisdn, false);
            } catch (\Throwable $e) {
                // Log but don't block admin action
            }
        }

        return back()->with('status', 'Subscription marked CANCELED.');
    }

    public function clear(string $msisdn): RedirectResponse
    {
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        Subscription::query()->where('msisdn', $msisdn)->delete();

        return back()->with('status', 'Subscription records cleared.');
    }

    public function sendSms(Request $request, BdAppsSmsService $sms, string $msisdn): RedirectResponse
    {
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:480'],
        ]);

        try {
            $sms->send($msisdn, $validated['message']);
            return back()->with('status', 'SMS sent (S1000).');
        } catch (\Throwable $e) {
            return back()->with('error', 'SMS failed: '.$e->getMessage());
        }
    }
}
