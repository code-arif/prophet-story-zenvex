<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get user's notification settings
     */
    public function getSettings()
    {
        $settings = NotificationSetting::firstOrCreate(
            ['user_id' => Auth::id()],
            [
                'prayer_reminder_minutes' => 15,
                'live_class_reminder_minutes' => 30,
                'email_notifications' => true,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Update notification settings
     */
    public function updateSettings(Request $request)
    {
        $settings = NotificationSetting::firstOrCreate(
            ['user_id' => Auth::id()]
        );

        $validated = $request->validate([
            'prayer_fajr' => 'nullable|boolean',
            'prayer_dhuhr' => 'nullable|boolean',
            'prayer_asr' => 'nullable|boolean',
            'prayer_maghrib' => 'nullable|boolean',
            'prayer_isha' => 'nullable|boolean',
            'prayer_reminder_minutes' => 'nullable|integer|min:5|max:60',
            'quran_daily_reminder' => 'nullable|boolean',
            'quran_reminder_time' => 'nullable|date_format:H:i',
            'live_class_reminder' => 'nullable|boolean',
            'live_class_reminder_minutes' => 'nullable|integer|min:10|max:120',
            'browser_notifications' => 'nullable|boolean',
            'email_notifications' => 'nullable|boolean',
            'sms_notifications' => 'nullable|boolean',
        ]);

        $settings->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Notification settings updated successfully',
            'data' => $settings,
        ]);
    }

    /**
     * Test notification
     */
    public function testNotification(Request $request)
    {
        $request->validate([
            'type' => 'required|in:browser,email,sms',
        ]);

        // This would send an actual test notification
        // For now, just return success
        
        return response()->json([
            'success' => true,
            'message' => "Test {$request->type} notification sent successfully",
        ]);
    }

    /**
     * Request browser notification permission
     */
    public function requestBrowserPermission(Request $request)
    {
        $request->validate([
            'subscription' => 'required|array',
        ]);

        // Store the push subscription details
        // This would typically save to a separate push_subscriptions table
        
        $settings = NotificationSetting::firstOrCreate(
            ['user_id' => Auth::id()]
        );

        $settings->update(['browser_notifications' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Browser notifications enabled',
        ]);
    }

    /**
     * Get notification summary
     */
    public function summary()
    {
        $settings = NotificationSetting::where('user_id', Auth::id())->first();

        if (!$settings) {
            return response()->json([
                'success' => true,
                'data' => [
                    'enabled_count' => 0,
                    'categories' => [],
                ],
            ]);
        }

        $summary = [
            'prayer_notifications' => $settings->hasPrayerNotifications(),
            'enabled_prayers' => $settings->enabled_prayers,
            'channels' => [
                'browser' => $settings->browser_notifications,
                'email' => $settings->email_notifications,
                'sms' => $settings->sms_notifications,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }
}
