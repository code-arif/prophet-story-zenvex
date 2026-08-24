<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use App\Models\EasyRise\EasyRiseSetting;
use App\Support\LearnerUser;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $settings = EasyRiseSetting::where('user_id', $user->id)
            ->pluck('value', 'key');

        return Inertia::render('Settings/Index', [
            'user' => $user,
            'workingHours' => (int) ($settings->get('weekly_hours') ?? 40),
            'minRate' => (int) ($settings->get('min_hourly_rate') ?? 0),
            'currency' => $settings->get('currency') ?? 'BDT',
        ]);
    }
}
