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
        $validated = $request->validate([
            'app_language' => 'required|in:bn,en',
            'text_size' => 'required|integer|min:1|max:3',
        ]);

        $request->session()->put('app_language', $validated['app_language']);
        $request->session()->put('text_size', $validated['text_size']);

        $subscriber = Auth::guard('subscriber')->user();
        if ($subscriber) {
            $subscriber->update($validated);
        }

        $user = LearnerUser::resolve();
        if ($user) {
            EasyRiseSetting::updateOrCreate(
                ['user_id' => $user->id, 'key' => 'app_language'],
                ['value' => $validated['app_language']]
            );
            EasyRiseSetting::updateOrCreate(
                ['user_id' => $user->id, 'key' => 'text_size'],
                ['value' => (string) $validated['text_size']]
            );
        }

        return back()->with('status', $validated['app_language'] === 'en' ? 'Preferences updated.' : 'পছন্দ আপডেট হয়েছে।');
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

    public function exportData()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $fileName = 'easy-rise-data-export-' . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($user) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM

            fputcsv($file, ['=== USER PROFILE SUMMARY ===']);
            fputcsv($file, ['User ID', 'Name', 'Export Date']);
            fputcsv($file, [$user->id, $user->name ?? 'User', now()->format('Y-m-d H:i:s')]);
            fputcsv($file, []);

            fputcsv($file, ['=== INCOME ENTRIES ===']);
            fputcsv($file, ['ID', 'Date', 'Source/Client', 'Channel', 'Amount (BDT)', 'Notes']);
            $incomes = \App\Models\EasyRise\IncomeEntry::where('user_id', $user->id)->orderByDesc('date')->get();
            foreach ($incomes as $inc) {
                fputcsv($file, [
                    $inc->id,
                    $inc->date ? $inc->date->format('Y-m-d') : '',
                    $inc->client_name ?? '',
                    $inc->channel ?? '',
                    round(($inc->amount_paisa ?? 0) / 100, 2),
                    $inc->notes ?? '',
                ]);
            }
            fputcsv($file, []);

            fputcsv($file, ['=== JOBS & PIPELINE ===']);
            fputcsv($file, ['ID', 'Job Title', 'Status', 'Agreed Amount (BDT)', 'Due Date', 'Client Name']);
            $jobs = \App\Models\EasyRise\Job::where('user_id', $user->id)->with('client')->get();
            foreach ($jobs as $j) {
                fputcsv($file, [
                    $j->id,
                    $j->title,
                    $j->status,
                    round(($j->agreed_paisa ?? 0) / 100, 2),
                    $j->due_date ? $j->due_date->format('Y-m-d') : '',
                    $j->client ? $j->client->name : '',
                ]);
            }
            fputcsv($file, []);

            fputcsv($file, ['=== DOCUMENTS CHECKLIST ===']);
            fputcsv($file, ['ID', 'Document Name', 'Purpose', 'Status', 'Expiry Date']);
            $docs = \App\Models\EasyRise\Document::where('user_id', $user->id)->get();
            foreach ($docs as $d) {
                fputcsv($file, [
                    $d->id,
                    $d->name,
                    $d->purpose,
                    $d->status,
                    $d->expiry_date ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
