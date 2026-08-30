<?php

namespace App\Http\Controllers;

use App\Models\ProviderAvailability;
use App\Models\ServiceProviderProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderScheduleController extends Controller
{
    /**
     * Display provider schedule editor screen.
     */
    public function index(Request $request)
    {
        $user = auth()->user() ?? $request->user();
        $provider = ServiceProviderProfile::where('user_id', $user->id)->firstOrFail();

        $days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        
        $weeklySchedules = ProviderAvailability::query()
            ->where('provider_id', $provider->id)
            ->whereNotNull('day_of_week')
            ->get()
            ->keyBy('day_of_week');

        // Ensure all 7 days exist
        $weeklyData = [];
        foreach ($days as $day) {
            if ($existing = $weeklySchedules->get($day)) {
                $weeklyData[$day] = [
                    'day_of_week' => $day,
                    'is_available' => (bool) $existing->is_available,
                    'start_time' => substr($existing->start_time, 0, 5),
                    'end_time' => substr($existing->end_time, 0, 5),
                ];
            } else {
                $weeklyData[$day] = [
                    'day_of_week' => $day,
                    'is_available' => true,
                    'start_time' => '08:00',
                    'end_time' => '20:00',
                ];
            }
        }

        // Blocked Exception Dates (Holidays / off days)
        $blockedDates = ProviderAvailability::query()
            ->where('provider_id', $provider->id)
            ->whereNotNull('specific_date')
            ->orderBy('specific_date', 'asc')
            ->get();

        return Inertia::render('Provider/Schedule', [
            'provider' => $provider,
            'weeklySchedules' => $weeklyData,
            'blockedDates' => $blockedDates,
        ]);
    }

    /**
     * Update weekly recurring availability schedule.
     */
    public function updateWeekly(Request $request)
    {
        $user = auth()->user() ?? $request->user();
        $provider = ServiceProviderProfile::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'schedules' => ['required', 'array'],
            'schedules.*.day_of_week' => ['required', 'in:saturday,sunday,monday,tuesday,wednesday,thursday,friday'],
            'schedules.*.is_available' => ['required', 'boolean'],
            'schedules.*.start_time' => ['required', 'string'],
            'schedules.*.end_time' => ['required', 'string'],
        ]);

        foreach ($validated['schedules'] as $item) {
            ProviderAvailability::updateOrCreate(
                [
                    'provider_id' => $provider->id,
                    'day_of_week' => $item['day_of_week'],
                ],
                [
                    'start_time' => $item['start_time'] . ':00',
                    'end_time' => $item['end_time'] . ':00',
                    'is_available' => $item['is_available'],
                ]
            );
        }

        return redirect()->back()->with('success', 'সাপ্তাহিক ওয়ার্কিং শিডিউল আপডেট করা হয়েছে!');
    }

    /**
     * Block or unblock a specific exception date.
     */
    public function toggleExceptionDate(Request $request)
    {
        $user = auth()->user() ?? $request->user();
        $provider = ServiceProviderProfile::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'specific_date' => ['required', 'date'],
            'is_available' => ['required', 'boolean'], // false to block out date
        ]);

        ProviderAvailability::updateOrCreate(
            [
                'provider_id' => $provider->id,
                'specific_date' => $validated['specific_date'],
            ],
            [
                'is_available' => $validated['is_available'],
            ]
        );

        $msg = $validated['is_available'] ? 'ছুটির তারিখটি পুনরায় সচল করা হয়েছে।' : 'ছুটির তারিখের সার্ভিস বন্ধ রাখা হয়েছে।';

        return redirect()->back()->with('success', $msg);
    }
}
