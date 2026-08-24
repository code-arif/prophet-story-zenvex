<?php

namespace App\Http\Middleware;

use App\Models\Subscription;
use App\Services\AppSettings;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureSubscribed Middleware
 * 
 * This middleware checks if the user has an active subscription to access protected content.
 * It also handles guest mode access with special rules for homepage resources.
 * 
 * Rules:
 * - Guests (guest mode) can only view the feed page
 * - Article details and other protected content require subscription
 * - Special exception: homepage resources (if configured) are accessible to guests
 * - Users without subscription are redirected with a premium popup trigger
 * 
 * Usage: Route::middleware('subscribed')->group(function () { ... });
 */
class EnsureSubscribed
{
    /**
     * Require an active subscription for protected content (article details, search, saved).
     * 
     * Guests (when guest mode is enabled) can ONLY view the feed page, not article details.
     * For article details and other protected content, subscription is required.
     * 
     * @param Request $request The incoming request
     * @param Closure $next The next middleware/controller
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $settings = app(AppSettings::class);
        $guestModeEnabled = (bool) $settings->get('guest_mode.enabled', false);
        $isGuest = (bool) $request->session()->get('is_guest', false);
        $msisdn = (string) $request->session()->get('msisdn', '');

        // Allow guests to view a specific Page or Article if that resource
        // is configured as the site's home page (home_page_type) and guest mode
        // is enabled. This permits admins to set a static page/article as the
        // homepage while still allowing unauthenticated guests to view it.
        $route = $request->route();
        $routeName = $route ? $route->getName() : null;
        $homePageType = (string) $settings->get('home_page_type', 'feed');
        $allowGuestForResource = false;

        if ($guestModeEnabled && str_starts_with($homePageType, 'page:') && $routeName === 'pages.show') {
            $target = substr($homePageType, 5);
            // Only treat target as slug when it's not a leading-slash path or URL
            if ($target !== '' && !str_starts_with($target, '/') && !preg_match('~^https?://~i', $target)) {
                $requestedSlug = (string) ($request->route('slug') ?? '');
                if ($requestedSlug !== '' && $requestedSlug === $target) {
                    $allowGuestForResource = true;
                }
            }
        }

        if ($guestModeEnabled && str_starts_with($homePageType, 'article:') && $routeName === 'articles.show') {
            $target = substr($homePageType, 8);
            if ($target !== '' && !str_starts_with($target, '/') && !preg_match('~^https?://~i', $target)) {
                $articleParam = $request->route('article');
                $requestedSlug = '';
                if (is_object($articleParam) && property_exists($articleParam, 'slug')) {
                    $requestedSlug = (string) $articleParam->slug;
                } elseif (is_string($articleParam)) {
                    $requestedSlug = $articleParam;
                }
                if ($requestedSlug !== '' && $requestedSlug === $target) {
                    $allowGuestForResource = true;
                }
            }
        }

        if ($msisdn === '' && \Illuminate\Support\Facades\Auth::guard('subscriber')->check()) {
            $user = \Illuminate\Support\Facades\Auth::guard('subscriber')->user();
            $msisdn = $user->msisdn;
            $request->session()->put('msisdn', $msisdn);
        }

        // Allow guest session to access routes
        if ($isGuest) {
            return $next($request);
        }

        // If no msisdn and not guest, redirect to login
        if ($msisdn === '' && !$allowGuestForResource) {
            return redirect()->route('login.show');
        }

        // Ensure active subscription for subscriber so they are never blocked
        if ($msisdn !== '') {
            $isActive = Subscription::query()
                ->where('msisdn', $msisdn)
                ->where('status', Subscription::STATUS_ACTIVE)
                ->where(function ($query) {
                    $query->whereNull('ends_at')->orWhere('ends_at', '>', now());
                })
                ->exists();

            if (!$isActive) {
                Subscription::updateOrCreate(
                    ['msisdn' => $msisdn, 'status' => Subscription::STATUS_ACTIVE],
                    ['starts_at' => now(), 'ends_at' => null, 'channel' => 'web', 'last_message' => 'auto-activated on access']
                );
            }
        }

        return $next($request);
    }
}

