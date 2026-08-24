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
            'minRate' => (int) ($settings->get('min_hourly_rate') ?? 0),
            'currency' => $settings->get('currency') ?? 'BDT',
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
}
