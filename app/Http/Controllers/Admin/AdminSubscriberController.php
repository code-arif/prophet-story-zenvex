<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Services\BdAppsSmsService;
use App\Support\Msisdn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminSubscriberController extends Controller
{
    public function index()
    {
        $subscribers = Subscriber::query()
            ->orderByDesc('updated_at')
            ->limit(200)
            ->get(['msisdn', 'name', 'dob', 'avatar_path', 'updated_at']);

        return Inertia::render('Admin/Subscribers/Index', [
            'subscribers' => $subscribers,
        ]);
    }

    public function show(string $msisdn)
    {
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        $columns = ['msisdn', 'name', 'dob', 'avatar_path', 'created_at', 'updated_at', 'level', 'onboarded_at'];
        if (Schema::hasColumn('subscribers', 'profile_skipped_at')) {
            $columns[] = 'profile_skipped_at';
        }

        $subscriber = Subscriber::query()
            ->where('msisdn', $msisdn)
            ->firstOrFail($columns);

        $subscription = Subscription::query()
            ->where('msisdn', $msisdn)
            ->orderByRaw("CASE WHEN status = ? AND ends_at IS NULL THEN 0 ELSE 1 END", [Subscription::STATUS_ACTIVE])
            ->orderByDesc('updated_at')
            ->first(['status', 'starts_at', 'ends_at', 'channel', 'last_message']);

        // Learner onboarding status (same buckets as the dashboard funnel).
        // ISO 8601 timestamps — parsed reliably by JS in every browser.
        $onboarding = null;
        if (Schema::hasColumn('subscribers', 'profile_skipped_at')) {
            $hasName = $subscriber->name !== null && $subscriber->name !== '';
            $skipped = $subscriber->profile_skipped_at !== null;
            $onboarding = [
                'status' => $skipped && !$hasName ? 'skipped' : ($hasName ? 'completed' : 'never_started'),
                'skippedAt' => $subscriber->profile_skipped_at?->toIso8601String(),
                'onboardedAt' => $subscriber->onboarded_at?->toIso8601String(),
                'level' => $subscriber->level,
            ];
        }

        return Inertia::render('Admin/Subscribers/Show', [
            'subscriber' => $subscriber,
            'subscription' => $subscription,
            'onboarding' => $onboarding,
        ]);
    }

    public function sendSms(Request $request, BdAppsSmsService $sms, string $msisdn)
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

    /**
     * Delete a subscriber (only if unsubscribed).
     * Requires admin password confirmation.
     */
    public function destroy(Request $request, string $msisdn)
    {
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        $validated = $request->validate([
            'password' => ['required', 'string'],
        ]);

        // Verify admin password using the authenticated user
        $admin = $request->user();

        if (!$admin || !Hash::check($validated['password'], $admin->password)) {
            return back()->with('error', 'Invalid admin password.');
        }

        // Check if subscriber has an active subscription
        $hasActiveSubscription = Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_ACTIVE)
            ->whereNull('ends_at')
            ->exists();

        if ($hasActiveSubscription) {
            return back()->with('error', 'Cannot delete subscriber with active subscription. Cancel subscription first.');
        }

        // Delete subscriber and their subscription records
        Subscription::query()->where('msisdn', $msisdn)->delete();
        Subscriber::query()->where('msisdn', $msisdn)->delete();

        return redirect()->route('admin.subscribers.index')->with('status', 'Subscriber deleted successfully.');
    }
}
