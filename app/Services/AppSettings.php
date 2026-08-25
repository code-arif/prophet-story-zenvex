<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

/**
 * AppSettings - Manages application settings stored in database
 * 
 * This service provides an interface to get/set application settings
 * that are stored in the database (settings table). It supports:
 * - Cached settings for performance
 * - Theme management with predefined theme packs
 * - Brand settings (name, logo)
 * - Homepage and layout configuration
 * - Integration settings (mail, BdApps, etc.)
 * 
 * Settings are cached indefinitely and cleared when updated.
 */
class AppSettings
{
    /** @var string Cache key for all settings */
    private const CACHE_KEY = 'app.settings.all';

    /**
     * Theme packs provide a full shadcn-like token palette, not just primary.
     * Values are HSL strings: "H S% L%".
     * 
     * @var array<string, array{label: string, primaryHex: string}>
     */
    private const THEME_PACKS = [
        'blue' => ['label' => 'Blue', 'primaryHex' => '#3b82f6'],
        'emerald' => ['label' => 'Emerald', 'primaryHex' => '#10b981'],
        'violet' => ['label' => 'Violet', 'primaryHex' => '#8b5cf6'],
        'orange' => ['label' => 'Orange', 'primaryHex' => '#f97316'],
        'rose' => ['label' => 'Rose', 'primaryHex' => '#f43f5e'],
        'cyan' => ['label' => 'Cyan', 'primaryHex' => '#06b6d4'],
    ];

    /**
     * Get setting value by key.
     * 
     * Retrieves a setting value from the cached settings array.
     * Returns the default value if the key doesn't exist.
     * 
     * @param string $key The setting key to retrieve
     * @param mixed $default Default value if key doesn't exist
     * @return mixed The setting value or default
     */
    public function get(string $key, mixed $default = null): mixed
    {
        $all = $this->all();

        return array_key_exists($key, $all) ? $all[$key] : $default;
    }

    /**
     * Persist a setting value to database.
     * 
     * Updates existing setting or creates a new one.
     * Clears the settings cache after saving.
     * 
     * @param string $key The setting key
     * @param mixed $value The value to store (will be JSON-encoded if not string)
     * @return void
     */
    public function set(string $key, mixed $value): void
    {
        Setting::query()->updateOrCreate(
            ['key' => $key],
            ['value' => is_string($value) ? $value : json_encode($value)]
        );

        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Return all settings as key => value array.
     * 
     * Results are cached indefinitely. The cache is cleared when
     * settings are updated via the set() method.
     * 
     * @return array All settings as key-value pairs
     */
    public function all(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            if (!Schema::hasTable('settings')) {
                return [];
            }

            return Setting::query()
                ->get(['key', 'value'])
                ->mapWithKeys(function (Setting $s) {
                    $raw = $s->value;
                    $decoded = null;
                    if (is_string($raw)) {
                        $decoded = json_decode($raw, true);
                    }

                    return [$s->key => (json_last_error() === JSON_ERROR_NONE ? $decoded : $raw)];
                })
                ->all();
        });
    }

    public function brandName(): string
    {
        return (string) $this->get('brand.name', config('app.name', 'easy rise'));
    }

    public function logoPath(): string
    {
        return (string) $this->get('brand.logo_path', 'logo.png');
    }

    public function logoUrl(): string
    {
        $path = $this->logoPath();
        $path = ltrim($path, '/');

        // If it's already a full URL, return as-is
        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }

        // If path is a local storage path (served via /storage), keep using asset()
        if (str_starts_with($path, 'storage/')) {
            return asset($path);
        }

        // If the file exists directly in public directory, serve it from there
        if (file_exists(public_path($path))) {
            return asset($path);
        }

        // If ImageKit is configured and path is relative, prefer using the
        // imagekit disk URL generator to avoid duplicating path segments.
        $imagekitEndpoint = config('filesystems.disks.imagekit.url_endpoint');
        if ($imagekitEndpoint) {
            try {
                return Storage::disk('imagekit')->url($path);
            } catch (\Throwable $e) {
                return rtrim($imagekitEndpoint, '/') . '/' . ltrim($path, '/');
            }
        }

        // Fallback to serving from local storage
        return asset('storage/' . ltrim($path, '/'));
    }

    public function faviconPath(): string
    {
        $path = (string) $this->get('brand.favicon_path', '');
        // If no favicon is set, fall back to logo
        return $path !== '' ? $path : $this->logoPath();
    }

    public function faviconUrl(): string
    {
        $path = $this->faviconPath();
        $path = ltrim($path, '/');

        // If it's already a full URL, return as-is
        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }

        // If path is a local storage path (served via /storage), keep using asset()
        if (str_starts_with($path, 'storage/')) {
            return asset($path);
        }

        // If the file exists directly in public directory, serve it from there
        if (file_exists(public_path($path))) {
            return asset($path);
        }

        // If ImageKit is configured and path is relative, prefer using the
        // imagekit disk URL generator to avoid duplicating path segments.
        $imagekitEndpoint = config('filesystems.disks.imagekit.url_endpoint');
        if ($imagekitEndpoint) {
            try {
                return Storage::disk('imagekit')->url($path);
            } catch (\Throwable $e) {
                return rtrim($imagekitEndpoint, '/') . '/' . ltrim($path, '/');
            }
        }

        // Fallback to serving from local storage
        return asset('storage/' . ltrim($path, '/'));
    }

    public function themePrimaryHex(): string
    {
        return $this->effectiveThemePrimaryHex();
    }

    public function themeCustomPrimaryHex(): string
    {
        $hex = (string) $this->get('theme.primary_hex', '#3b82f6');

        return $this->normalizeHex($hex) ?: '#3b82f6';
    }

    public function themePack(): string
    {
        // Backwards compatible: previously stored as theme.preset
        $pack = (string) $this->get('theme.pack', (string) $this->get('theme.preset', 'custom'));

        if ($pack === '' || $pack === 'custom') {
            return 'custom';
        }

        return array_key_exists($pack, self::THEME_PACKS) ? $pack : 'custom';
    }

    /**
     * Backwards compatible alias for older code paths.
     * Prefer using themePack() going forward.
     */
    public function themePreset(): string
    {
        return $this->themePack();
    }

    public function themeMode(): string
    {
        $mode = (string) $this->get('theme.mode', 'dark');
        $mode = strtolower(trim($mode));

        return in_array($mode, ['dark', 'light'], true) ? $mode : 'dark';
    }

    public function themePacks(): array
    {
        return self::THEME_PACKS;
    }

    public function effectiveThemePrimaryHex(): string
    {
        // Primary is derived from pack or custom hex.
        $pack = $this->themePack();
        if ($pack === 'custom') {
            return $this->themeCustomPrimaryHex();
        }

        $hex = self::THEME_PACKS[$pack]['primaryHex'] ?? null;

        return is_string($hex) && $hex !== '' ? $hex : '#3b82f6';
    }

    public function themePrimaryHsl(): string
    {
        return $this->hexToHsl($this->effectiveThemePrimaryHex());
    }

    public function themePrimaryForegroundHsl(): string
    {
        // Choose white text for dark primary, black for light primary.
        [$r, $g, $b] = $this->hexToRgb($this->effectiveThemePrimaryHex());
        $luma = (0.2126 * $r + 0.7152 * $g + 0.0722 * $b) / 255;

        return $luma > 0.6 ? '0 0% 0%' : '0 0% 100%';
    }

    /**
     * Returns a map of CSS custom property names (without leading "--") to HSL strings.
     * These override the default tokens defined in resources/css/app.css.
     */
    public function themeCssVars(): array
    {
        return $this->themeCssVarsForMode($this->themeMode());
    }

    /**
     * Return theme CSS variables for an explicit mode.
     * Useful for generating both light/dark palettes for client-side toggles.
     */
    public function themeCssVarsForMode(string $mode): array
    {
        $pack = $this->themePack();
        $mode = strtolower(trim($mode));
        $mode = in_array($mode, ['dark', 'light'], true) ? $mode : 'dark';

        $primary = $this->themePrimaryHsl();
        [$h] = $this->parseHsl($primary);

        if ($mode === 'light') {
            // Light palette (shadcn-like) with pack/custom primary.
            $background = '0 0% 100%';
            $foreground = '222.2 84% 4.9%';

            $card = '0 0% 100%';
            $cardFg = $foreground;

            $popover = '0 0% 100%';
            $popoverFg = $foreground;

            $secondary = '210 40% 96.1%';
            $secondaryFg = $foreground;

            $muted = '210 40% 96.1%';
            $mutedFg = '215.4 16.3% 46.9%';

            $accent = '210 40% 96.1%';
            $accentFg = $foreground;

            $destructive = '0 84.2% 60.2%';
            $destructiveFg = '210 40% 98%';

            $border = '214.3 31.8% 91.4%';
            $input = $border;
        } else {
            // Dark palette (shadcn-like) with a subtle hue tint.
            $background = $this->formatHsl($h, 84, 4.9);
            $foreground = '210 40% 98%';

            $card = $this->formatHsl($h, 70, 6.2);
            $cardFg = $foreground;

            $popover = $card;
            $popoverFg = $foreground;

            $secondary = $this->formatHsl($h, 28, 16.9);
            $secondaryFg = $foreground;

            $muted = $this->formatHsl($h, 25, 16.9);
            $mutedFg = $this->formatHsl($h, 10.6, 64.9);

            $accent = $muted;
            $accentFg = $foreground;

            $destructive = '0 62.8% 30.6%';
            $destructiveFg = $foreground;

            $border = $this->formatHsl($h, 27.9, 16.9);
            $input = $border;
        }

        // If a non-custom pack is selected, keep the same derivation but allow
        // future pack-specific tuning here.
        if ($pack !== 'custom') {
            // no-op today; derivation is already based on pack primary hue.
        }

        return [
            'background' => $background,
            'foreground' => $foreground,

            'card' => $card,
            'card-foreground' => $cardFg,
            'popover' => $popover,
            'popover-foreground' => $popoverFg,

            'primary' => $primary,
            'primary-foreground' => $this->themePrimaryForegroundHsl(),
            'secondary' => $secondary,
            'secondary-foreground' => $secondaryFg,
            'muted' => $muted,
            'muted-foreground' => $mutedFg,
            'accent' => $accent,
            'accent-foreground' => $accentFg,
            'destructive' => $destructive,
            'destructive-foreground' => $destructiveFg,

            'border' => $border,
            'input' => $input,
            'ring' => $primary,
        ];
    }

    public function seoTitle(): string
    {
        return (string) $this->get('seo.title', $this->brandName());
    }

    public function seoDescription(): string
    {
        return (string) $this->get('seo.description', '');
    }

    public function footerLinks(): array
    {
        $links = $this->get('footer.links', []);
        return is_array($links) ? $links : [];
    }

    public function navMenu(): array
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

        $items = [];
        $pageIds = [];
        $articleIds = [];

        foreach ($raw as $it) {
            if (!is_array($it)) {
                continue;
            }

            $type = (string) ($it['type'] ?? 'custom');
            $label = trim((string) ($it['label'] ?? ''));

            if ($label === '') {
                continue;
            }

            if ($type === 'page') {
                $pid = (int) ($it['page_id'] ?? 0);
                if ($pid > 0) {
                    $pageIds[] = $pid;
                    $items[] = ['type' => 'page', 'label' => $label, 'page_id' => $pid];
                }
                continue;
            }

            if ($type === 'article') {
                $aid = (int) ($it['article_id'] ?? 0);
                if ($aid > 0) {
                    $articleIds[] = $aid;
                    $items[] = ['type' => 'article', 'label' => $label, 'article_id' => $aid];
                }
                continue;
            }

            $href = trim((string) ($it['href'] ?? ''));
            if ($href !== '') {
                $items[] = ['type' => 'custom', 'label' => $label, 'href' => $href];
            }
        }

        $pages = [];
        if ($pageIds) {
            $pages = Page::query()
                ->whereIn('id', array_values(array_unique($pageIds)))
                ->where('is_published', true)
                ->get(['id', 'slug', 'title'])
                ->keyBy('id')
                ->all();
        }

        $articles = [];
        if ($articleIds) {
            $articles = Article::query()
                ->whereIn('id', array_values(array_unique($articleIds)))
                ->whereNotNull('published_at')
                ->get(['id', 'slug', 'title'])
                ->keyBy('id')
                ->all();
        }

        $resolved = [];
        foreach ($items as $it) {
            if ($it['type'] === 'page') {
                $p = $pages[$it['page_id']] ?? null;
                if (!$p) {
                    continue;
                }
                $resolved[] = ['label' => $it['label'], 'href' => '/p/'.$p->slug];
                continue;
            }

            if ($it['type'] === 'article') {
                $a = $articles[$it['article_id']] ?? null;
                if (!$a) {
                    continue;
                }
                $resolved[] = ['label' => $it['label'], 'href' => '/articles/'.$a->slug];
                continue;
            }

            $resolved[] = ['label' => $it['label'], 'href' => $it['href']];
        }

        return $resolved;
    }

    public function adminMenu(): array
    {
        $user = auth()->user();
        
        if (!$user) {
            return [];
        }

        return \Illuminate\Support\Facades\Cache::remember('sidebar_menus_user_' . $user->id, 300, function () use ($user) {
            return \App\Models\SidebarMenu::with('children')
                ->whereNull('parent_id')
                ->orderBy('id')
                ->get()
                ->map(function($menu) use ($user) {
                    if ($menu->permission && !$user->can($menu->permission)) {
                        return null;
                    }
                    
                    $item = [
                        'label' => $menu->name,
                        'icon' => $menu->icon,
                        'href' => $menu->path,
                    ];

                    if ($menu->children->count() > 0) {
                        $children = $menu->children->filter(fn($c) => !$c->permission || $user->can($c->permission))
                            ->map(fn($c) => [
                                'label' => $c->name, 
                                'href' => $c->path,
                                'icon' => $c->icon,
                            ])->values()->toArray();
                        
                        if (count($children) > 0) {
                            $item['children'] = $children;
                        }
                    }
                    return $item;
                })->filter()->values()->toArray();
        });
    }

    private function filterMenuByRole(array $items, $user): array
    {
        $filtered = array_filter($items, function ($item) use ($user) {
            // If no roles specified, show to everyone
            if (!isset($item['roles']) || empty($item['roles'])) {
                return true;
            }
            
            // Check if user has any of the required roles
            return $user->hasRole($item['roles']);
        });

        // Process each item to filter children and remove roles
        $filtered = array_map(function ($item) use ($user) {
            // Remove roles from output
            unset($item['roles']);
            
            // Recursively filter children if they exist
            if (isset($item['children']) && is_array($item['children'])) {
                $item['children'] = $this->filterMenuByRole($item['children'], $user);
                // Remove the group if no children remain
                if (empty($item['children'])) {
                    return null;
                }
            }
            
            return $item;
        }, $filtered);

        // Remove null entries and re-index
        return array_values(array_filter($filtered));
    }

    private function transformMenuItemsToArray($items): array
    {
        $result = [];
        foreach ($items as $item) {
            $arr = [
                'label' => $item->label,
            ];
            if ($item->href !== null) {
                $arr['href'] = $item->href;
            }
            if ($item->roles !== null && !empty($item->roles)) {
                $arr['roles'] = $item->roles;
            }
            if ($item->page_id !== null) {
                $arr['page_id'] = $item->page_id;
            }
            if ($item->article_id !== null) {
                $arr['article_id'] = $item->article_id;
            }
            if ($item->children && $item->children->isNotEmpty()) {
                $arr['children'] = $this->transformMenuItemsToArray($item->children);
            }
            $result[] = $arr;
        }
        return $result;
    }

    public function integrations(): array
    {
        return [
            'mailer' => (string) $this->get('integrations.mailer', ''),
            'smtp_host' => (string) $this->get('integrations.smtp_host', ''),
            'smtp_port' => (string) $this->get('integrations.smtp_port', ''),
            'smtp_username' => (string) $this->get('integrations.smtp_username', ''),
            'smtp_password' => (string) $this->get('integrations.smtp_password', ''),
            'mail_from_address' => (string) $this->get('integrations.mail_from_address', ''),
            'mail_from_name' => (string) $this->get('integrations.mail_from_name', ''),

            'bdapps_base_url' => (string) $this->get('integrations.bdapps_base_url', ''),

            'bdapps_sms_url' => (string) $this->get('integrations.bdapps_sms_url', ''),
            'bdapps_ussd_url' => (string) $this->get('integrations.bdapps_ussd_url', ''),
            'bdapps_app_id' => (string) $this->get('integrations.bdapps_app_id', ''),
            'bdapps_password' => (string) $this->get('integrations.bdapps_password', ''),
            'bdapps_source_address' => (string) $this->get('integrations.bdapps_source_address', ''),
            'bdapps_use_platform_subscription' => $this->get('integrations.bdapps_use_platform_subscription') !== null
                ? (bool) $this->get('integrations.bdapps_use_platform_subscription')
                : (bool) config('services.bdapps.use_platform_subscription', false),
        ];
    }

    public function storeLogo(UploadedFile $file): string
    {
        $path = $file->storePubliclyAs('brand', 'logo.'.$file->getClientOriginalExtension(), ['disk' => 'public']);
        // stored under storage/app/public, served at /storage
        return 'storage/'.$path;
    }

    public function storeFavicon(UploadedFile $file): string
    {
        $path = $file->storePubliclyAs('brand', 'favicon.'.$file->getClientOriginalExtension(), ['disk' => 'public']);
        // stored under storage/app/public, served at /storage
        return 'storage/'.$path;
    }

    private function normalizeHex(string $hex): string
    {
        $hex = trim($hex);
        if ($hex === '') {
            return '';
        }

        if ($hex[0] !== '#') {
            $hex = '#'.$hex;
        }

        if (!preg_match('/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/', $hex)) {
            return '';
        }

        if (strlen($hex) === 4) {
            $hex = '#'.$hex[1].$hex[1].$hex[2].$hex[2].$hex[3].$hex[3];
        }

        return strtolower($hex);
    }

    private function hexToRgb(string $hex): array
    {
        $hex = $this->normalizeHex($hex);
        if ($hex === '') {
            return [59, 130, 246];
        }

        $hex = substr($hex, 1);
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

        return [$r, $g, $b];
    }

    /**
     * Convert hex (#rrggbb) to shadcn-style HSL string: "H S% L%".
     */
    private function hexToHsl(string $hex): string
    {
        [$r, $g, $b] = $this->hexToRgb($hex);

        $r /= 255;
        $g /= 255;
        $b /= 255;

        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $delta = $max - $min;

        $l = ($max + $min) / 2;

        if ($delta == 0) {
            $h = 0;
            $s = 0;
        } else {
            $s = $delta / (1 - abs(2 * $l - 1));

            if ($max === $r) {
                $h = 60 * fmod((($g - $b) / $delta), 6);
            } elseif ($max === $g) {
                $h = 60 * ((($b - $r) / $delta) + 2);
            } else {
                $h = 60 * ((($r - $g) / $delta) + 4);
            }
        }

        if ($h < 0) {
            $h += 360;
        }

        $h = round($h, 1);
        $s = round($s * 100, 1);
        $l = round($l * 100, 1);

        return $h.' '.$s.'% '.$l.'%';
    }

    private function parseHsl(string $hsl): array
    {
        // Expected formats: "H S% L%" (from hexToHsl)
        $parts = preg_split('/\s+/', trim($hsl)) ?: [];
        $h = isset($parts[0]) ? (float) $parts[0] : 217.2;
        $s = isset($parts[1]) ? (float) rtrim((string) $parts[1], '%') : 91.2;
        $l = isset($parts[2]) ? (float) rtrim((string) $parts[2], '%') : 59.8;
        return [$h, $s, $l];
    }

    private function formatHsl(float $h, float $s, float $l): string
    {
        $h = round($h, 1);
        $s = round($s, 1);
        $l = round($l, 1);
        return $h.' '.$s.'% '.$l.'%';
    }

    // BDApps Configuration Methods
    public function bdappsAppId(): string
    {
        return (string) $this->get('integrations.bdapps_app_id', config('services.bdapps.app_id', ''));
    }

    public function bdappsPassword(): string
    {
        return (string) $this->get('integrations.bdapps_password', config('services.bdapps.password', ''));
    }

    public function setBdappsAppId(string $appId): void
    {
        $this->set('integrations.bdapps_app_id', $appId);
    }

    public function setBdappsPassword(string $password): void
    {
        $this->set('integrations.bdapps_password', $password);
    }

    public function bdappsUsePlatformOtp(): bool
    {
        return (bool) $this->get('bdapps.use_platform_otp', config('services.bdapps.use_platform_otp', false));
    }

    public function setBdappsUsePlatformOtp(bool $enabled): void
    {
        $this->set('bdapps.use_platform_otp', $enabled);
    }

    // Pagination Configuration Methods
    public function paginationArticles(): int
    {
        return (int) $this->get('pagination.articles', 20);
    }

    public function paginationUsers(): int
    {
        return (int) $this->get('pagination.users', 20);
    }

    public function paginationSubscriptions(): int
    {
        return (int) $this->get('pagination.subscriptions', 50);
    }

    public function paginationMedia(): int
    {
        return (int) $this->get('pagination.media', 24);
    }

    // Article View Mode Configuration
    public function articleViewMode(): string
    {
        $mode = (string) $this->get('article.view_mode', 'infinite');
        return in_array($mode, ['infinite', 'single', 'loadmore', 'navigation'], true) ? $mode : 'infinite';
    }
}
