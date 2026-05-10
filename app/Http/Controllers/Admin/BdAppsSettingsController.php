<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AppSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BdAppsSettingsController extends Controller
{
    public function index(AppSettings $settings)
    {
        return Inertia::render('Admin/Settings/BdApps', [
            'settings' => [
                'app_id' => $settings->bdappsAppId(),
                'password' => $settings->bdappsPassword() ? '••••••••' : '',
                'use_platform_otp' => $settings->bdappsUsePlatformOtp(),
            ],
        ]);
    }

    public function update(Request $request, AppSettings $settings)
    {
        $validated = $request->validate([
            'app_id' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'max:255'],
            'use_platform_otp' => ['boolean'],
        ]);

        if (!empty($validated['app_id'])) {
            $settings->setBdappsAppId($validated['app_id']);
        }

        // Only update password if provided (not the masked value)
        if (!empty($validated['password']) && $validated['password'] !== '••••••••') {
            $settings->setBdappsPassword($validated['password']);
        }

        $settings->setBdappsUsePlatformOtp($validated['use_platform_otp'] ?? false);

        return back()->with('status', 'BDApps settings updated successfully.');
    }
}
