<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use App\Models\EasyRise\EasyRiseSetting;
use App\Support\LearnerUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $subscriber = Auth::guard('subscriber')->user();

        $settings = EasyRiseSetting::where('user_id', $user->id)
            ->pluck('value', 'key');

        return Inertia::render('Settings/Index', [
            'user' => $user,
            'subscriber' => $subscriber,
            'workingHours' => (int) ($settings->get('weekly_hours') ?? 40),
            'minRate' => (int) ($settings->get('min_hourly_rate') ?? 800),
            'currency' => $settings->get('currency') ?? 'BDT',
            'reminders' => [
                'deadlineEnabled' => (bool) ($settings->get('reminder_deadline_enabled', '1') === '1'),
                'deadlineDays' => (int) ($settings->get('reminder_deadline_days') ?? 3),
                'overdueEnabled' => (bool) ($settings->get('reminder_overdue_enabled', '1') === '1'),
                'overdueDays' => (int) ($settings->get('reminder_overdue_days') ?? 1),
                'docExpiryEnabled' => (bool) ($settings->get('reminder_doc_expiry_enabled', '0') === '1'),
                'docExpiryDays' => (int) ($settings->get('reminder_doc_expiry_days') ?? 7),
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $subscriber = Auth::guard('subscriber')->user();
        if (!$subscriber) return redirect()->route('easy.welcome');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $subscriber->name = $validated['name'];
        $subscriber->dob = $validated['dob'] ?? $subscriber->dob;

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $subscriber->avatar_path = $path;
        }

        $subscriber->save();

        return back()->with('status', 'প্রোফাইল আপডেট হয়েছে।');
    }

    public function updatePreferences(Request $request)
    {
        $subscriber = Auth::guard('subscriber')->user();
        if (!$subscriber) return redirect()->route('easy.welcome');

        $validated = $request->validate([
            'app_language' => 'required|in:bn,en',
            'text_size' => 'required|integer|min:1|max:3',
        ]);

        $subscriber->update($validated);

        return back()->with('status', 'পছন্দ আপডেট হয়েছে।');
    }

    public function updateWorkRules(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return back();

        $validated = $request->validate([
            'weekly_hours' => 'required|integer|min:1|max:168',
            'min_hourly_rate' => 'required|numeric|min:0',
            'currency' => 'required|string|in:BDT,USD,EUR',
        ]);

        foreach ($validated as $key => $val) {
            EasyRiseSetting::updateOrCreate(
                ['user_id' => $user->id, 'key' => $key],
                ['value' => (string) $val]
            );
        }

        return back()->with('status', 'কাজের নিয়ম আপডেট হয়েছে।');
    }

    public function updateReminders(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return back();

        $validated = $request->validate([
            'reminder_deadline_enabled' => 'nullable|boolean',
            'reminder_deadline_days' => 'nullable|integer|min:1|max:30',
            'reminder_overdue_enabled' => 'nullable|boolean',
            'reminder_overdue_days' => 'nullable|integer|min:1|max:30',
            'reminder_doc_expiry_enabled' => 'nullable|boolean',
            'reminder_doc_expiry_days' => 'nullable|integer|min:1|max:60',
        ]);

        foreach ($validated as $key => $val) {
            if ($val !== null) {
                EasyRiseSetting::updateOrCreate(
                    ['user_id' => $user->id, 'key' => $key],
                    ['value' => is_bool($val) ? ($val ? '1' : '0') : (string) $val]
                );
            }
        }

        return back()->with('status', 'রিমাইন্ডার আপডেট হয়েছে।');
    }
}
