<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Menu;
use App\Models\Page;
use App\Models\PostType;
use App\Models\Setting;
use App\Services\BdAppsApiClient;
use App\Services\AppSettings;
use App\Support\Msisdn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    private function defaultUssdMenuSettings(): array
    {
        return [
            'menu_text' => "BD Election Daily\n1. Subscribe\n2. Cancel\n",
            'start_keywords' => ['MENU', 'MO-INIT'],
            'subscribe_code' => '1',
            'cancel_code' => '2',
            'subscribe_reply' => "Subscription active.\n",
            'cancel_reply' => "Subscription canceled.\n",
            'invalid_reply' => "Invalid option.\n",
            'invalid_with_menu' => true,
        ];
    }

    public function general(AppSettings $settings)
    {
        $postTypes = PostType::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug']);
        $pages     = Page::query()->where('is_published', true)->orderBy('title')->get(['id', 'title', 'slug']);
        $articles  = Article::query()->whereNotNull('published_at')->orderByDesc('published_at')->limit(100)->get(['id', 'title', 'slug']);

        return Inertia::render('Admin/Settings/General', [
            'settings' => [
                'guest_mode_enabled' => $settings->get('guest_mode_enabled', false),
                // Theme/Brand
                'brandName' => $settings->brandName(),
                'logoUrl' => $settings->logoUrl(),
                'logoPath' => $settings->logoPath(),
                'faviconUrl' => $settings->faviconUrl(),
                'faviconPath' => $settings->faviconPath(),
                // Expose theme information so the Settings page retains theme data
                'theme' => [
                    'mode' => $settings->themeMode(),
                    'pack' => $settings->themePack(),
                    'primaryHex' => $settings->themeCustomPrimaryHex(),
                    'effectivePrimaryHex' => $settings->effectiveThemePrimaryHex(),
                    'packs' => $settings->themePacks(),
                ],
                // SEO
                'seo_title' => (string) $settings->get('seo.title', ''),
                'seo_description' => (string) $settings->get('seo.description', ''),
                // Pagination
                'pagination.articles' => (string) $settings->get('pagination.articles', '20'),
                'pagination.users' => (string) $settings->get('pagination.users', '20'),
                'pagination.subscriptions' => (string) $settings->get('pagination.subscriptions', '50'),
                'pagination.media' => (string) $settings->get('pagination.media', '24'),
                // Article View Mode
                'article.view_mode' => (string) $settings->get('article.view_mode', 'infinite'),
                // Homepage
                'home_page_type' => (string) $settings->get('home_page_type', 'feed'),
                // App download / subscription info
                'app_download_charge_text' => (string) $settings->get('app.download_charge_text', $settings->get('app_charge_text', 'Charge: Tk 4.00+ (VAT+SD+SC) per day with Auto Renewal.')),
                'app_charge_text' => (string) $settings->get('app.download_charge_text', $settings->get('app_charge_text', 'Charge: Tk 4.00+ (VAT+SD+SC) per day with Auto Renewal.')),
                'app_download_features' => (array) $settings->get('app.download_features', []),
                'app_features' => (array) $settings->get('app.download_features', []),
            ],
            'packs' => $settings->themePacks(),
            'postTypes' => $postTypes,
            'pages' => $pages,
            'articles' => $articles,
        ]);
    }

    public function saveGeneral(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'guest_mode_enabled' => ['required', 'boolean'],
            // Theme/Brand
            'brandName' => ['nullable', 'string', 'max:100'],
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:4096'],
            'logo_path' => ['nullable', 'string', 'max:500'],
            'favicon' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg,ico', 'max:2048'],
            'favicon_path' => ['nullable', 'string', 'max:500'],
            // SEO
            'seo_title' => ['nullable', 'string', 'max:120'],
            'seo_description' => ['nullable', 'string', 'max:300'],
            // Pagination
            'pagination_articles' => ['nullable', 'integer', 'min:5', 'max:100'],
            'pagination_users' => ['nullable', 'integer', 'min:5', 'max:100'],
            'pagination_subscriptions' => ['nullable', 'integer', 'min:10', 'max:200'],
            'pagination_media' => ['nullable', 'integer', 'min:12', 'max:100'],
            // Article View Mode
            'article_view_mode' => ['nullable', 'string', 'in:infinite,single,loadmore,navigation'],
            // Homepage
            'home_page_type' => ['nullable', 'string', 'max:80'],
            // App download / subscription info
            'app_charge_text' => ['nullable', 'string', 'max:200'],
            'app_features' => ['nullable', 'string', 'max:2000'],
        ]);

        // Access Control
        $settings->set('guest_mode_enabled', $validated['guest_mode_enabled']);

        // Theme/Brand
        if (isset($validated['brandName'])) {
            $settings->set('brand.name', $validated['brandName']);
        }

        $pack = (string) ($validated['pack'] ?? 'custom');
        if (!in_array($pack, array_merge(['custom'], array_keys($settings->themePacks())), true)) {
            $pack = 'custom';
        }
        $settings->set('theme.pack', $pack);

        if (isset($validated['primaryHex']) && (string) $validated['primaryHex'] !== '') {
            $settings->set('theme.primary_hex', $validated['primaryHex']);
        }

        // Handle logo from media picker or direct upload
        if ($request->hasFile('logo')) {
            $path = $settings->storeLogo($request->file('logo'));
            $settings->set('brand.logo_path', $path);
        } elseif (!empty($validated['logo_path'])) {
            $settings->set('brand.logo_path', $validated['logo_path']);
        }

        // Handle favicon from media picker or direct upload
        if ($request->hasFile('favicon')) {
            $path = $settings->storeFavicon($request->file('favicon'));
            $settings->set('brand.favicon_path', $path);
        } elseif (!empty($validated['favicon_path'])) {
            $settings->set('brand.favicon_path', $validated['favicon_path']);
        }

        // SEO
        $settings->set('seo.title', $validated['seo_title'] ?? '');
        $settings->set('seo.description', $validated['seo_description'] ?? '');

        // Pagination
        if (isset($validated['pagination_articles'])) {
            $settings->set('pagination.articles', (int) $validated['pagination_articles']);
        }
        if (isset($validated['pagination_users'])) {
            $settings->set('pagination.users', (int) $validated['pagination_users']);
        }
        if (isset($validated['pagination_subscriptions'])) {
            $settings->set('pagination.subscriptions', (int) $validated['pagination_subscriptions']);
        }
        if (isset($validated['pagination_media'])) {
            $settings->set('pagination.media', (int) $validated['pagination_media']);
        }

        // Article View Mode
        if (isset($validated['article_view_mode'])) {
            $settings->set('article.view_mode', $validated['article_view_mode']);
        }

        // Homepage type
        if (isset($validated['home_page_type'])) {
            $settings->set('home_page_type', $validated['home_page_type']);
        }

        // App download / subscription info
        if (array_key_exists('app_charge_text', $validated)) {
            $chargeText = (string) ($validated['app_charge_text'] ?? '');
            $settings->set('app.download_charge_text', $chargeText);
            $settings->set('app_charge_text', $chargeText);
        }

        if (isset($validated['app_features'])) {
            // Accept newline-separated features; store as array
            $lines = preg_split('/\r?\n/', trim((string) $validated['app_features']));
            $features = array_values(array_filter(array_map('trim', $lines), fn($v) => $v !== ''));
            $settings->set('app.download_features', $features);
        }
        return back()->with('status', 'Settings saved.');
    }

    public function bdapps(AppSettings $settings)
    {
        $integrations = $settings->integrations();

        $baseUrl = $integrations['bdapps_base_url'] ?: (string) config('services.bdapps.base_url');
        $smsUrl = $integrations['bdapps_sms_url'] ?: (string) config('services.bdapps.sms_url');
        $ussdUrl = $integrations['bdapps_ussd_url'] ?: (string) config('services.bdapps.ussd_url');

        return Inertia::render('Admin/Settings/BdApps', [
            'bdapps' => [
                'baseUrl' => $baseUrl,
                'smsUrl' => $smsUrl,
                'ussdUrl' => $ussdUrl,
                'sourceAddress' => $integrations['bdapps_source_address'] ?: (string) config('services.bdapps.source_address'),
                'smsEncoding' => (string) config('services.bdapps.sms_encoding', '245'),
                'smsDeliveryStatusRequest' => (string) config('services.bdapps.sms_delivery_status_request', '1'),
                'notify' => [
                    'subscribeEnabled' => (bool) $settings->get('subscription.notify_subscribe_enabled', true),
                    'subscribeText' => (string) $settings->get(
                        'subscription.notify_subscribe_text',
                        'Subscription active. Visit the site to read subscriber-only articles.'
                    ),
                    'unsubscribeEnabled' => (bool) $settings->get('subscription.notify_unsubscribe_enabled', true),
                    'unsubscribeText' => (string) $settings->get('subscription.notify_unsubscribe_text', 'Subscription canceled.'),
                ],
                // These are safe defaults/presets for convenience; adjust if your platform provides a different Swagger URL.
                'swaggerUrlPresets' => [
                    'dev' => 'http://localhost:7000/swagger-ui',
                    'production' => 'https://developer.bdapps.com/swagger-ui',
                ],
                'docsUrlPresets' => [
                    'dev' => 'http://localhost:7000',
                    'production' => 'https://developer.bdapps.com',
                ],
            ],
        ]);
    }

    public function saveBdappsNotifications(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'subscribeEnabled' => ['required', 'boolean'],
            'subscribeText' => ['nullable', 'string', 'max:480'],
            'unsubscribeEnabled' => ['required', 'boolean'],
            'unsubscribeText' => ['nullable', 'string', 'max:480'],
        ]);

        $settings->set('subscription.notify_subscribe_enabled', (bool) $validated['subscribeEnabled']);
        $settings->set('subscription.notify_subscribe_text', (string) ($validated['subscribeText'] ?? ''));
        $settings->set('subscription.notify_unsubscribe_enabled', (bool) $validated['unsubscribeEnabled']);
        $settings->set('subscription.notify_unsubscribe_text', (string) ($validated['unsubscribeText'] ?? ''));

        return back()->with('status', 'Subscription notification SMS settings saved.');
    }

    public function bdappsTestSms(Request $request, BdAppsApiClient $client): RedirectResponse
    {
        $validated = $request->validate([
            'msisdn' => ['required', 'string', 'max:32'],
            'message' => ['required', 'string', 'max:1000'],
            'encoding' => ['nullable', 'string', 'max:16'],
            'deliveryStatusRequest' => ['nullable', 'string', 'max:8'],
            'sourceAddress' => ['nullable', 'string', 'max:32'],
        ]);

        $destination = Msisdn::toTelBd($validated['msisdn']);
        if ($destination === '') {
            return back()->with('error', 'Invalid MSISDN. Use formats like 01XXXXXXXXX, 8801XXXXXXXXX, or tel:8801XXXXXXXXX.');
        }

        $payload = [
            'message' => $validated['message'],
            'destinationAddresses' => [$destination],
            'encoding' => (string) ($validated['encoding'] ?? config('services.bdapps.sms_encoding', '245')),
            'deliveryStatusRequest' => (string) ($validated['deliveryStatusRequest'] ?? config('services.bdapps.sms_delivery_status_request', '1')),
        ];

        $sourceAddress = trim((string) ($validated['sourceAddress'] ?? config('services.bdapps.source_address', '')));
        if ($sourceAddress !== '') {
            $payload['sourceAddress'] = $sourceAddress;
        }

        // Call BDApps and flash a sanitized trace (do not include password).
        try {
            $resp = $client->sendSms($payload);

            $safeRequest = array_merge(['version' => (string) config('services.bdapps.sms_version', '1.0')], $payload);
            $safeRequest['applicationId'] = (string) config('services.bdapps.app_id', '');
            $safeRequest['password'] = '***';

            $request->session()->flash('bdappsTest', [
                'service' => 'sms.send',
                'url' => (string) config('services.bdapps.sms_url', ''),
                'request' => $safeRequest,
                'response' => $resp,
            ]);

            $statusCode = (string) ($resp['statusCode'] ?? '');
            if ($statusCode === 'S1000') {
                return back()->with('status', 'BDApps SMS test sent successfully (S1000).');
            }

            return back()->with('error', 'BDApps SMS test failed: '.((string) ($resp['statusDetail'] ?? 'Unknown error')));
        } catch (\Throwable $e) {
            $request->session()->flash('bdappsTest', [
                'service' => 'sms.send',
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'BDApps SMS test error: '.$e->getMessage());
        }
    }

    public function theme(AppSettings $settings)
    {
        return Inertia::render('Admin/Settings/Theme', [
            'settings' => [
                'brandName' => $settings->brandName(),
                'logoUrl' => $settings->logoUrl(),
                'logoPath' => $settings->logoPath(),
                'theme' => [
                    'mode' => $settings->themeMode(),
                    'pack' => $settings->themePack(),
                    'primaryHex' => $settings->themeCustomPrimaryHex(),
                    'effectivePrimaryHex' => $settings->effectiveThemePrimaryHex(),
                    'packs' => $settings->themePacks(),
                ],
            ],
            'packs' => $settings->themePacks(),
        ]);
    }

    public function saveTheme(Request $request, AppSettings $settings)
    {
        $validated = $request->validate([
            'brandName' => ['required', 'string', 'max:100'],
            'mode' => ['nullable', 'string', 'in:dark,light'],
            'pack' => ['nullable', 'string', 'max:32'],
            'primaryHex' => ['nullable', 'string', 'max:16', 'regex:/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/'],
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:4096'],
            'logo_path' => ['nullable', 'string', 'max:500'],
        ]);

        $pack = (string) ($validated['pack'] ?? 'custom');
        if (!in_array($pack, array_merge(['custom'], array_keys($settings->themePacks())), true)) {
            $pack = 'custom';
        }

        $settings->set('brand.name', $validated['brandName']);
        $settings->set('theme.mode', $validated['mode'] ?? 'dark');
        $settings->set('theme.pack', $pack);

        if ($pack === 'custom' && (!isset($validated['primaryHex']) || (string) $validated['primaryHex'] === '')) {
            return back()->with('error', 'Primary color is required for Custom theme.');
        }

        if (isset($validated['primaryHex']) && (string) $validated['primaryHex'] !== '') {
            $settings->set('theme.primary_hex', $validated['primaryHex']);
        }

        // Handle logo from media picker or direct upload
        if ($request->hasFile('logo')) {
            $path = $settings->storeLogo($request->file('logo'));
            $settings->set('brand.logo_path', $path);
        } elseif (!empty($validated['logo_path'])) {
            // Use logo from media library
            $settings->set('brand.logo_path', $validated['logo_path']);
        }

        return back()->with('status', 'Theme settings saved.');
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Admin/Settings/Profile', [
            'user' => $user?->only(['id', 'name', 'email', 'phone']),
        ]);
    }

    public function saveProfile(Request $request): RedirectResponse
    {
        $user = $request->user();
        if (!$user) {
            return back()->with('error', 'Not authenticated.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['nullable', 'string', 'max:32'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;
        if (isset($validated['password']) && $validated['password'] !== '') {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        return back()->with('status', 'Profile updated.');
    }

    public function integrations(AppSettings $settings)
    {
        $integrations = $settings->integrations();

        return Inertia::render('Admin/Settings/Integrations', [
            'integrations' => [
                'mailer' => $integrations['mailer'] ?: config('mail.default'),
                'smtp_host' => $integrations['smtp_host'] ?: config('mail.mailers.smtp.host'),
                'smtp_port' => $integrations['smtp_port'] ?: config('mail.mailers.smtp.port'),
                'smtp_username' => $integrations['smtp_username'] ?: config('mail.mailers.smtp.username'),
                // never echo passwords back to the browser
                'smtp_password' => '',
                'smtp_password_set' => ($integrations['smtp_password'] ?? '') !== '',
                'mail_from_address' => $integrations['mail_from_address'] ?: config('mail.from.address'),
                'mail_from_name' => $integrations['mail_from_name'] ?: config('mail.from.name'),

                'bdapps_base_url' => $integrations['bdapps_base_url'] ?: config('services.bdapps.base_url'),
                'bdapps_sms_url' => $integrations['bdapps_sms_url'] ?: config('services.bdapps.sms_url'),
                'bdapps_ussd_url' => $integrations['bdapps_ussd_url'] ?: config('services.bdapps.ussd_url'),
                'bdapps_app_id' => $integrations['bdapps_app_id'] ?: config('services.bdapps.app_id'),
                'bdapps_password' => '',
                'bdapps_password_set' => ($integrations['bdapps_password'] ?? '') !== '',
                'bdapps_source_address' => $integrations['bdapps_source_address'] ?: config('services.bdapps.source_address'),
                'bdapps_use_platform_subscription' => $integrations['bdapps_use_platform_subscription'] ?? config('services.bdapps.use_platform_subscription'),
            ],
        ]);
    }

    public function ussdMenu(AppSettings $settings)
    {
        $defaults = $this->defaultUssdMenuSettings();

        $startKeywords = $settings->get('ussd.start_keywords', $defaults['start_keywords']);
        if (!is_array($startKeywords)) {
            $startKeywords = $defaults['start_keywords'];
        }

        return Inertia::render('Admin/Settings/UssdMenu', [
            'ussd' => [
                'menu_text' => (string) $settings->get('ussd.menu_text', $defaults['menu_text']),
                'start_keywords' => array_values(array_filter(array_map('strval', $startKeywords))),
                'subscribe_code' => (string) $settings->get('ussd.subscribe_code', $defaults['subscribe_code']),
                'cancel_code' => (string) $settings->get('ussd.cancel_code', $defaults['cancel_code']),
                'subscribe_reply' => (string) $settings->get('ussd.subscribe_reply', $defaults['subscribe_reply']),
                'cancel_reply' => (string) $settings->get('ussd.cancel_reply', $defaults['cancel_reply']),
                'invalid_reply' => (string) $settings->get('ussd.invalid_reply', $defaults['invalid_reply']),
                'invalid_with_menu' => (bool) $settings->get('ussd.invalid_with_menu', $defaults['invalid_with_menu']),
            ],
        ]);
    }

    public function saveUssdMenu(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'menu_text' => ['required', 'string', 'max:2000'],
            'start_keywords_csv' => ['nullable', 'string', 'max:500'],
            'subscribe_code' => ['required', 'string', 'max:16'],
            'cancel_code' => ['required', 'string', 'max:16'],
            'subscribe_reply' => ['required', 'string', 'max:500'],
            'cancel_reply' => ['required', 'string', 'max:500'],
            'invalid_reply' => ['required', 'string', 'max:500'],
            'invalid_with_menu' => ['nullable', 'boolean'],
        ]);

        $menuText = (string) $validated['menu_text'];
        $menuText = str_replace("\r\n", "\n", $menuText);

        $csv = trim((string) ($validated['start_keywords_csv'] ?? ''));
        $keywords = $csv === '' ? [] : (preg_split('/\s*,\s*/', $csv) ?: []);
        $keywords = collect($keywords)
            ->map(fn ($v) => strtoupper(trim((string) $v)))
            ->filter(fn ($v) => $v !== '')
            ->unique()
            ->values()
            ->all();

        $settings->set('ussd.menu_text', $menuText);
        $settings->set('ussd.start_keywords', $keywords);
        $settings->set('ussd.subscribe_code', strtoupper(trim((string) $validated['subscribe_code'])));
        $settings->set('ussd.cancel_code', strtoupper(trim((string) $validated['cancel_code'])));
        $settings->set('ussd.subscribe_reply', (string) $validated['subscribe_reply']);
        $settings->set('ussd.cancel_reply', (string) $validated['cancel_reply']);
        $settings->set('ussd.invalid_reply', (string) $validated['invalid_reply']);
        $settings->set('ussd.invalid_with_menu', (bool) ($validated['invalid_with_menu'] ?? true));

        return back()->with('status', 'USSD menu settings saved.');
    }

    public function saveIntegrations(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'mailer' => ['required', 'in:log,smtp'],
            'smtp_host' => ['nullable', 'string', 'max:255'],
            'smtp_port' => ['nullable', 'integer'],
            'smtp_username' => ['nullable', 'string', 'max:255'],
            'smtp_password' => ['nullable', 'string', 'max:255'],
            'mail_from_address' => ['nullable', 'email', 'max:255'],
            'mail_from_name' => ['nullable', 'string', 'max:255'],

            'bdapps_base_url' => ['nullable', 'string', 'max:255'],
            'bdapps_sms_url' => ['nullable', 'string', 'max:255'],
            'bdapps_ussd_url' => ['nullable', 'string', 'max:255'],
            'bdapps_app_id' => ['nullable', 'string', 'max:255'],
            'bdapps_password' => ['nullable', 'string', 'max:255'],
            'bdapps_source_address' => ['nullable', 'string', 'max:255'],
            'bdapps_use_platform_subscription' => ['nullable', 'boolean'],
        ]);

        $settings->set('integrations.mailer', $validated['mailer']);
        $settings->set('integrations.smtp_host', $validated['smtp_host'] ?? '');
        $settings->set('integrations.smtp_port', $validated['smtp_port'] ?? '');
        $settings->set('integrations.smtp_username', $validated['smtp_username'] ?? '');
        if (isset($validated['smtp_password']) && $validated['smtp_password'] !== '') {
            $settings->set('integrations.smtp_password', $validated['smtp_password']);
        }
        $settings->set('integrations.mail_from_address', $validated['mail_from_address'] ?? '');
        $settings->set('integrations.mail_from_name', $validated['mail_from_name'] ?? '');

        $settings->set('integrations.bdapps_base_url', $validated['bdapps_base_url'] ?? '');
        $settings->set('integrations.bdapps_sms_url', $validated['bdapps_sms_url'] ?? '');
        $settings->set('integrations.bdapps_ussd_url', $validated['bdapps_ussd_url'] ?? '');
        $settings->set('integrations.bdapps_app_id', $validated['bdapps_app_id'] ?? '');
        if (isset($validated['bdapps_password']) && $validated['bdapps_password'] !== '') {
            $settings->set('integrations.bdapps_password', $validated['bdapps_password']);
        }
        $settings->set('integrations.bdapps_source_address', $validated['bdapps_source_address'] ?? '');
        $settings->set('integrations.bdapps_use_platform_subscription', (bool)($validated['bdapps_use_platform_subscription'] ?? false));

        // Clear application cache to ensure settings take effect immediately
        Artisan::call('config:clear');
        Artisan::call('cache:clear');

        return back()->with('status', 'Integrations saved.');
    }

    public function seo(AppSettings $settings)
    {
        return Inertia::render('Admin/Settings/Seo', [
            'settings' => [
                'brandName' => $settings->brandName(),
                'logoUrl' => $settings->logoUrl(),
                'logoPath' => $settings->logoPath(),
            ],
            'seo' => [
                'title' => (string) $settings->get('seo.title', ''),
                'description' => (string) $settings->get('seo.description', ''),
            ],
        ]);
    }

    public function saveSeo(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'brandName' => ['nullable', 'string', 'max:100'],
            'logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp,svg', 'max:4096'],
            'logo_path' => ['nullable', 'string', 'max:500'],
            'title' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:300'],
        ]);

        // Save branding
        if (isset($validated['brandName'])) {
            $settings->set('brand.name', $validated['brandName']);
        }

        // Handle logo from media picker or direct upload
        if ($request->hasFile('logo')) {
            $path = $settings->storeLogo($request->file('logo'));
            $settings->set('brand.logo_path', $path);
        } elseif (!empty($validated['logo_path'])) {
            $settings->set('brand.logo_path', $validated['logo_path']);
        }

        // Save SEO
        $settings->set('seo.title', $validated['title'] ?? '');
        $settings->set('seo.description', $validated['description'] ?? '');

        return back()->with('status', 'Branding & SEO settings saved.');
    }

    public function footer(AppSettings $settings)
    {
        return Inertia::render('Admin/Settings/Footer', [
            'footer' => [
                'links' => $settings->footerLinks(),
            ],
        ]);
    }

    public function saveFooter(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'linksJson' => ['required', 'string', 'max:20000'],
        ]);

        $decoded = json_decode($validated['linksJson'], true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return back()->with('error', 'Invalid JSON. Provide an array of links.');
        }

        $links = [];
        foreach ($decoded as $idx => $item) {
            if (!is_array($item)) {
                return back()->with('error', 'Invalid item at index '.$idx.'.');
            }
            $label = trim((string) ($item['label'] ?? ''));
            $url = trim((string) ($item['url'] ?? ''));
            if ($label === '' || $url === '') {
                return back()->with('error', 'Each link requires label and url.');
            }
            $links[] = ['label' => $label, 'url' => $url];
        }

        $settings->set('footer.links', $links);

        return back()->with('status', 'Footer links saved.');
    }

    public function userMenu(AppSettings $settings)
    {
        $defaults = [
            ['type' => 'custom', 'label' => 'News feed', 'href' => '/'],
            ['type' => 'custom', 'label' => 'Profile', 'href' => '/profile'],
            ['type' => 'custom', 'label' => 'About', 'href' => '/about'],
            ['type' => 'custom', 'label' => 'Help', 'href' => '/help'],
        ];

        $raw = null;
        if (Schema::hasTable('menus')) {
            $dbItems = \App\Models\Menu::where('type', 'user')
                ->whereNull('parent_id')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();
            if ($dbItems->isNotEmpty()) {
                $raw = [];
                foreach ($dbItems as $item) {
                    $typeAttr = 'custom';
                    if ($item->page_id !== null) {
                        $typeAttr = 'page';
                    } elseif ($item->article_id !== null) {
                        $typeAttr = 'article';
                    }
                    $raw[] = [
                        'type' => $typeAttr,
                        'label' => $item->label,
                        'href' => $item->href,
                        'page_id' => $item->page_id,
                        'article_id' => $item->article_id,
                    ];
                }
            }
        }

        if ($raw === null) {
            $raw = $defaults;
        }

        $pageIds = [];
        $articleIds = [];
        foreach ($raw as $it) {
            if (!is_array($it)) {
                continue;
            }
            if (($it['type'] ?? null) === 'page' && isset($it['page_id'])) {
                $pageIds[] = (int) $it['page_id'];
            }
            if (($it['type'] ?? null) === 'article' && isset($it['article_id'])) {
                $articleIds[] = (int) $it['article_id'];
            }
        }

        $pages = [];
        if ($pageIds) {
            $pages = Page::query()
                ->whereIn('id', array_values(array_unique($pageIds)))
                ->get(['id', 'title', 'slug', 'is_published'])
                ->keyBy('id')
                ->all();
        }

        $articles = [];
        if ($articleIds) {
            $articles = Article::query()
                ->whereIn('id', array_values(array_unique($articleIds)))
                ->get(['id', 'title', 'slug', 'published_at'])
                ->keyBy('id')
                ->all();
        }

        $hydrated = [];
        foreach ($raw as $it) {
            if (!is_array($it)) {
                continue;
            }

            $type = (string) ($it['type'] ?? 'custom');
            $label = trim((string) ($it['label'] ?? ''));
            $href = trim((string) ($it['href'] ?? ''));

            if ($type === 'page') {
                $pid = (int) ($it['page_id'] ?? 0);
                $p = $pid > 0 ? ($pages[$pid] ?? null) : null;
                $hydrated[] = array_merge($it, [
                    'label' => $label !== '' ? $label : ($p?->title ?? ''),
                    'preview_title' => $p?->title,
                    'preview_href' => $p ? '/p/'.$p->slug : null,
                    'preview_status' => $p ? ((bool) $p->is_published ? 'published' : 'draft') : 'missing',
                ]);
                continue;
            }

            if ($type === 'article') {
                $aid = (int) ($it['article_id'] ?? 0);
                $a = $aid > 0 ? ($articles[$aid] ?? null) : null;
                $hydrated[] = array_merge($it, [
                    'label' => $label !== '' ? $label : ($a?->title ?? ''),
                    'preview_title' => $a?->title,
                    'preview_href' => $a ? '/articles/'.$a->slug : null,
                    'preview_status' => $a ? ($a->published_at ? 'published' : 'draft') : 'missing',
                ]);
                continue;
            }

            $hydrated[] = array_merge($it, [
                'type' => 'custom',
                'label' => $label,
                'href' => $href,
                'preview_href' => $href,
            ]);
        }

        return Inertia::render('Admin/Settings/UserMenu', [
            'navMenu' => [
                'items' => $hydrated,
            ],
        ]);
    }

    public function saveUserMenu(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'max:30'],
            'items.*.type' => ['required', 'in:custom,page,article'],
            'items.*.label' => ['required', 'string', 'max:60'],
            'items.*.href' => ['nullable', 'string', 'max:200'],
            'items.*.page_id' => ['nullable', 'integer', 'exists:pages,id'],
            'items.*.article_id' => ['nullable', 'integer', 'exists:articles,id'],
        ]);

        $items = [];
        foreach ($validated['items'] as $idx => $it) {
            $type = (string) ($it['type'] ?? 'custom');
            $label = trim((string) ($it['label'] ?? ''));
            if ($label === '') {
                return back()->with('error', 'Label required for item #'.($idx + 1).'.');
            }

            if ($type === 'page') {
                $pid = (int) ($it['page_id'] ?? 0);
                if ($pid <= 0) {
                    return back()->with('error', 'Select a page for item #'.($idx + 1).'.');
                }
                $items[] = ['type' => 'page', 'label' => $label, 'page_id' => $pid];
                continue;
            }

            if ($type === 'article') {
                $aid = (int) ($it['article_id'] ?? 0);
                if ($aid <= 0) {
                    return back()->with('error', 'Select a post for item #'.($idx + 1).'.');
                }
                $items[] = ['type' => 'article', 'label' => $label, 'article_id' => $aid];
                continue;
            }

            $href = trim((string) ($it['href'] ?? ''));
            if ($href === '') {
                return back()->with('error', 'URL required for item #'.($idx + 1).'.');
            }

            $ok = str_starts_with($href, '/') || str_starts_with($href, 'http://') || str_starts_with($href, 'https://');
            if (!$ok) {
                return back()->with('error', 'URL must start with / or http(s):// (item #'.($idx + 1).').');
            }

            $items[] = ['type' => 'custom', 'label' => $label, 'href' => $href];
        }

        DB::transaction(function() use ($items) {
            Menu::where('type', 'user')->delete();
            foreach ($items as $idx => $it) {
                Menu::create([
                    'type' => 'user',
                    'label' => $it['label'],
                    'href' => $it['href'] ?? null,
                    'page_id' => $it['page_id'] ?? null,
                    'article_id' => $it['article_id'] ?? null,
                    'sort_order' => $idx,
                ]);
            }
        });

        return back()->with('status', 'User menu saved.');
    }

    public function menu(AppSettings $settings)
    {
        return Inertia::render('Admin/Settings/Menu', [
            'menu' => [
                'items' => $settings->adminMenu(),
            ],
        ]);
    }

    public function saveMenu(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'itemsJson' => ['required', 'string', 'max:20000'],
        ]);

        $decoded = json_decode($validated['itemsJson'], true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return back()->with('error', 'Invalid JSON. Provide an array of menu items.');
        }

        try {
            $sanitized = $this->validateAndSanitizeMenu($decoded, true);
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }

        DB::transaction(function() use ($sanitized) {
            Menu::where('type', 'admin')->delete();
            $this->saveMenuItemsRecursive($sanitized, 'admin');
        });

        return back()->with('status', 'Admin menu saved.');
    }

    private function validateAndSanitizeMenu(array $items, bool $isAdmin = true): array
    {
        $sanitized = [];
        foreach ($items as $idx => $item) {
            if (!is_array($item)) {
                throw new \InvalidArgumentException('Invalid item structure.');
            }

            $label = trim((string) ($item['label'] ?? ''));
            if ($label === '') {
                throw new \InvalidArgumentException('Each menu item requires a label.');
            }

            $href = isset($item['href']) ? trim((string) $item['href']) : null;
            if ($isAdmin && $href !== null && $href !== '' && !str_starts_with($href, '/admin')) {
                throw new \InvalidArgumentException('Admin menu href must start with /admin (item: '.$label.').');
            }

            $sanitizedItem = [
                'label' => $label,
                'href' => $href !== '' ? $href : null,
                'roles' => isset($item['roles']) ? array_values(array_unique(array_filter(array_map('strval', (array) $item['roles'])))) : null,
                'page_id' => isset($item['page_id']) ? (int) $item['page_id'] : null,
                'article_id' => isset($item['article_id']) ? (int) $item['article_id'] : null,
            ];

            if (isset($item['children']) && is_array($item['children'])) {
                $sanitizedItem['children'] = $this->validateAndSanitizeMenu($item['children'], $isAdmin);
            }

            $sanitized[] = $sanitizedItem;
        }
        return $sanitized;
    }

    private function saveMenuItemsRecursive(array $items, string $type, ?int $parentId = null): void
    {
        foreach ($items as $idx => $item) {
            $dbItem = \App\Models\Menu::create([
                'type' => $type,
                'parent_id' => $parentId,
                'label' => $item['label'] ?? '',
                'href' => $item['href'] ?? null,
                'roles' => isset($item['roles']) ? (array) $item['roles'] : null,
                'page_id' => isset($item['page_id']) ? (int) $item['page_id'] : null,
                'article_id' => isset($item['article_id']) ? (int) $item['article_id'] : null,
                'sort_order' => $idx,
            ]);

            if (isset($item['children']) && is_array($item['children'])) {
                $this->saveMenuItemsRecursive($item['children'], $type, $dbItem->id);
            }
        }
    }

    public function widgets(AppSettings $settings)
    {
        return Inertia::render('Admin/Settings/Widgets', [
            'widgets' => [
                'refreshSeconds' => (int) $settings->get('admin.widget_refresh_seconds', 0),
                'electionCountdownTitle' => (string) $settings->get('election.countdown_title', 'Count Down'),
                'electionCountdownAt' => (string) $settings->get('election.countdown_at', ''),
            ],
        ]);
    }

    public function saveWidgets(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'refreshSeconds' => ['nullable', 'integer', 'min:0', 'max:3600'],
            'electionCountdownTitle' => ['nullable', 'string', 'max:80'],
            'electionCountdownAt' => ['nullable', 'string', 'max:32', 'regex:/^$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/'],
        ]);

        $seconds = (int) ($validated['refreshSeconds'] ?? 0);
        $settings->set('admin.widget_refresh_seconds', $seconds);

        $title = trim((string) ($validated['electionCountdownTitle'] ?? ''));
        $settings->set('election.countdown_title', $title !== '' ? $title : 'Count Down');

        $at = trim((string) ($validated['electionCountdownAt'] ?? ''));
        $settings->set('election.countdown_at', $at);

        return back()->with('status', 'Widget settings saved.');
    }

    public function optimize()
    {
        $cacheDriver = config('cache.default');
        $sessionDriver = config('session.driver');

        return Inertia::render('Admin/Settings/Optimize', [
            'info' => [
                'cacheDriver' => $cacheDriver,
                'sessionDriver' => $sessionDriver,
                'phpVersion' => PHP_VERSION,
                'laravelVersion' => app()->version(),
            ],
        ]);
    }

    public function clearCache(): RedirectResponse
    {
        Cache::flush();

        return back()->with('status', 'Application cache cleared successfully.');
    }

    public function clearViews(): RedirectResponse
    {
        Artisan::call('view:clear');

        return back()->with('status', 'Compiled views cleared successfully.');
    }

    public function clearConfig(): RedirectResponse
    {
        Artisan::call('config:clear');

        return back()->with('status', 'Configuration cache cleared successfully.');
    }

    public function clearRoutes(): RedirectResponse
    {
        Artisan::call('route:clear');

        return back()->with('status', 'Route cache cleared successfully.');
    }

    public function optimizeApp(): RedirectResponse
    {
        Artisan::call('optimize:clear');

        return back()->with('status', 'All caches cleared successfully.');
    }

    public function cacheConfig(): RedirectResponse
    {
        Artisan::call('config:cache');

        return back()->with('status', 'Configuration cached successfully.');
    }

    public function cacheRoutes(): RedirectResponse
    {
        Artisan::call('route:cache');

        return back()->with('status', 'Routes cached successfully.');
    }

    public function cacheViews(): RedirectResponse
    {
        Artisan::call('view:cache');

        return back()->with('status', 'Views cached successfully.');
    }

    // Backup & Restore Methods
    public function backupSettings(AppSettings $settings)
    {
        $data = Setting::all()->pluck('value', 'key')->toArray();
        
        $filename = 'backup-settings-' . now()->format('Y-m-d-His') . '.json';
        
        return response()->streamDownload(function () use ($data) {
            echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }

    public function backupContent()
    {
        $articles = Article::with('category:id,name,slug')->get()->map(function ($article) {
            return [
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'body' => $article->body,
                'body_blocks' => $article->body_blocks,
                'category' => $article->category?->slug,
                'featured_image_path' => $article->featured_image_path,
                'published_at' => $article->published_at?->toDateTimeString(),
                'view_count' => $article->view_count,
            ];
        });
        
        $filename = 'backup-articles-' . now()->format('Y-m-d-His') . '.json';
        
        return response()->streamDownload(function () use ($articles) {
            echo json_encode($articles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }

    public function backupPages()
    {
        $pages = Page::all()->map(function ($page) {
            return [
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
            ];
        });
        
        $filename = 'backup-pages-' . now()->format('Y-m-d-His') . '.json';
        
        return response()->streamDownload(function () use ($pages) {
            echo json_encode($pages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }

    public function backupMenu(AppSettings $settings)
    {
        $menus = Menu::orderBy('type')->orderBy('parent_id')->orderBy('sort_order')->get()->toArray();
        
        $filename = 'backup-menu-' . now()->format('Y-m-d-His') . '.json';
        
        return response()->streamDownload(function () use ($menus) {
            echo json_encode($menus, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }

    public function backupAll(AppSettings $settings)
    {
        $settingsData = Setting::all()->pluck('value', 'key')->toArray();
        
        $articles = Article::with('category:id,name,slug')->get()->map(function ($article) {
            return [
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'body' => $article->body,
                'body_blocks' => $article->body_blocks,
                'category' => $article->category?->slug,
                'featured_image_path' => $article->featured_image_path,
                'published_at' => $article->published_at?->toDateTimeString(),
                'view_count' => $article->view_count,
            ];
        });
        
        $pages = Page::all()->map(function ($page) {
            return [
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
            ];
        });
        
        $data = [
            'backup_date' => now()->toDateTimeString(),
            'settings' => $settingsData,
            'articles' => $articles,
            'pages' => $pages,
        ];
        
        $filename = 'backup-all-' . now()->format('Y-m-d-His') . '.json';
        
        return response()->streamDownload(function () use ($data) {
            echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }

    public function restore(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'backup_file' => ['required', 'file', 'mimes:json', 'max:102400'],
            'restore_type' => ['required', 'in:settings,content,pages,menu,all'],
        ]);
        
        $file = $request->file('backup_file');
        $content = file_get_contents($file->getRealPath());
        $data = json_decode($content, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return back()->withErrors(['backup_file' => 'Invalid JSON file.']);
        }
        
        $type = $validated['restore_type'];
        
        try {
            if ($type === 'settings' || $type === 'all') {
                $settingsData = $type === 'all' ? ($data['settings'] ?? []) : $data;
                foreach ($settingsData as $key => $value) {
                    $settings->set($key, $value);
                }
            }
            
            if ($type === 'content' || $type === 'all') {
                $articlesData = $type === 'all' ? ($data['articles'] ?? []) : $data;
                // Note: This doesn't delete existing articles, just adds/updates
                foreach ($articlesData as $articleData) {
                    Article::updateOrCreate(
                        ['slug' => $articleData['slug']],
                        [
                            'title' => $articleData['title'],
                            'excerpt' => $articleData['excerpt'] ?? null,
                            'body' => $articleData['body'] ?? null,
                            'body_blocks' => $articleData['body_blocks'] ?? null,
                            'featured_image_path' => $articleData['featured_image_path'] ?? null,
                            'published_at' => $articleData['published_at'] ?? null,
                            'view_count' => $articleData['view_count'] ?? 0,
                        ]
                    );
                }
            }
            
            if ($type === 'pages' || $type === 'all') {
                $pagesData = $type === 'all' ? ($data['pages'] ?? []) : $data;
                foreach ($pagesData as $pageData) {
                    Page::updateOrCreate(
                        ['slug' => $pageData['slug']],
                        [
                            'title' => $pageData['title'],
                            'content' => $pageData['content'] ?? '',
                        ]
                    );
                }
            }
            
            if ($type === 'menu') {
                DB::transaction(function() use ($data) {
                    Schema::disableForeignKeyConstraints();
                    Menu::truncate();
                    Schema::enableForeignKeyConstraints();
                    
                    // Check if it's the old backup format
                    if (isset($data['user_menu']) || isset($data['admin_menu'])) {
                        // Restore old user_menu settings as new 'user' type menu items
                        if (isset($data['user_menu']) && is_array($data['user_menu'])) {
                            foreach ($data['user_menu'] as $idx => $it) {
                                Menu::create([
                                    'type' => 'user',
                                    'label' => $it['label'] ?? '',
                                    'href' => $it['href'] ?? null,
                                    'page_id' => $it['page_id'] ?? null,
                                    'article_id' => $it['article_id'] ?? null,
                                    'sort_order' => $idx,
                                ]);
                            }
                        }
                        // Restore old admin_menu settings as new 'admin' type menu items
                        if (isset($data['admin_menu']) && is_array($data['admin_menu'])) {
                            $this->saveMenuItemsRecursive($data['admin_menu'], 'admin');
                        }
                    } else {
                        // It is the new format (flat array of database rows)
                        foreach ($data as $item) {
                            Menu::create([
                                'id' => $item['id'] ?? null,
                                'type' => $item['type'] ?? 'admin',
                                'parent_id' => $item['parent_id'] ?? null,
                                'label' => $item['label'] ?? '',
                                'href' => $item['href'] ?? null,
                                'roles' => isset($item['roles']) ? (array) $item['roles'] : null,
                                'page_id' => $item['page_id'] ?? null,
                                'article_id' => $item['article_id'] ?? null,
                                'sort_order' => $item['sort_order'] ?? 0,
                                'is_active' => $item['is_active'] ?? true,
                            ]);
                        }
                    }
                });
            }
            
            return back()->with('status', 'Data restored successfully from backup.');
        } catch (\Exception $e) {
            return back()->withErrors(['backup_file' => 'Restore failed: ' . $e->getMessage()]);
        }
    }

    public function reset(Request $request, AppSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'reset_type' => ['required', 'in:settings,content,pages,all'],
            'confirm' => ['required', 'accepted'],
        ]);
        
        $type = $validated['reset_type'];
        
        try {
            if ($type === 'settings' || $type === 'all') {
                Setting::truncate();
                Schema::disableForeignKeyConstraints();
                Menu::truncate();
                Schema::enableForeignKeyConstraints();
            }
            
            if ($type === 'content' || $type === 'all') {
                Article::truncate();
                DB::table('article_views')->truncate();
            }
            
            if ($type === 'pages' || $type === 'all') {
                Page::truncate();
            }
            
            return back()->with('status', 'Data reset successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Reset failed: ' . $e->getMessage()]);
        }
    }
}
