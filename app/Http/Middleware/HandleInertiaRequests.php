<?php

namespace App\Http\Middleware;

use App\Models\Subscriber;
use App\Models\Subscription;
use App\Services\AppSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        
        // If session is empty but we have a remember_me cookie (Auth logged in), sync them
        if ($msisdn === '' && \Illuminate\Support\Facades\Auth::guard('subscriber')->check()) {
            $user = \Illuminate\Support\Facades\Auth::guard('subscriber')->user();
            $msisdn = $user->msisdn;
            $request->session()->put('msisdn', $msisdn);
        }

        /** @var AppSettings $settings */
        $settings = app(AppSettings::class);

        return array_merge(parent::share($request), [
            '_token' => fn () => csrf_token(),
            'settings' => [
                'brandName' => fn () => $settings->brandName(),
                'logoUrl' => fn () => $settings->logoUrl(),
                'footerLinks' => fn () => $settings->footerLinks(),
                'navMenu' => fn () => $settings->navMenu(),
                'articleViewMode' => fn () => $settings->articleViewMode(),
                'election' => [
                    'countdownTitle' => fn () => (string) $settings->get('election.countdown_title', 'Count Down'),
                    'countdownAt' => fn () => (string) $settings->get('election.countdown_at', ''),
                ],
                'theme' => [
                    'primaryHex' => fn () => $settings->themePrimaryHex(),
                    'effectivePrimaryHex' => fn () => $settings->effectiveThemePrimaryHex(),
                    'packs' => fn () => $settings->themePacks(),
                ],
            ],
            'auth' => [
                'msisdn' => fn () => $msisdn,
                'isLoggedIn' => fn () => $msisdn !== '',
                'isSubscribed' => fn () => $msisdn === '' ? false : (bool) Subscription::query()
                    ->where('msisdn', $msisdn)
                    ->where('status', Subscription::STATUS_ACTIVE)
                    ->whereNull('ends_at')
                    ->exists(),
            ],
            'subscriber' => fn () => $msisdn === ''
                ? null
                : Subscriber::query()
                    ->where('msisdn', $msisdn)
                    ->first(['msisdn', 'name', 'dob', 'avatar_path']),
            // Learner UI language ('bn' | 'en') — drives the app's i18n.
            // Logged-in users: their saved preference is authoritative.
            'appLanguage' => fn () => $msisdn === ''
                ? 'bn'
                : ((string) Subscriber::query()->where('msisdn', $msisdn)->value('app_language') ?: 'bn'),

            // Learner UI text size (0 small · 1 medium · 2 large).
            'textSize' => fn () => $msisdn === ''
                ? 1
                : (int) (Subscriber::query()->where('msisdn', $msisdn)->value('font_size') ?? 1),

            // Learner UI speech — saved TTS voice preference + reading speed.
            // Drives speechSynthesis voice + rate on the practice screens.
            'voice' => fn () => $msisdn === ''
                ? 'default'
                : ((string) Subscriber::query()->where('msisdn', $msisdn)->value('voice') ?: 'default'),
            'readingSpeed' => fn () => $msisdn === ''
                ? '1.0'
                : number_format((float) (Subscriber::query()->where('msisdn', $msisdn)->value('reading_speed') ?? 1.0), 2, '.', ''),
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'bdappsTest' => fn () => $request->session()->get('bdappsTest'),
                'unsubscribe_manual' => fn () => $request->session()->get('unsubscribe_manual'),
                'premiumPopup' => fn () => (bool) $request->session()->pull('premium_popup_open', false),
            ],
            'admin' => [
                'isLoggedIn' => fn () => (bool) $request->user(),
                'user' => fn () => $request->user() 
                    ? array_merge(
                        $request->user()->only(['id', 'name', 'email', 'phone', 'is_admin']),
                        [
                            'roles' => $request->user()->roles->map(fn($role) => [
                                'id' => $role->id,
                                'name' => $role->name,
                                'display_name' => $role->display_name,
                            ])->toArray(),
                            'permissions' => $request->user()->getAllPermissions(),
                        ]
                    )
                    : null,
                'menu' => fn () => $settings->adminMenu(),
                'widgetRefreshSeconds' => fn () => (int) $settings->get('admin.widget_refresh_seconds', 0),
            ],
        ]);
    }
}
