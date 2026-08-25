<?php

namespace App\Http\Middleware;

use App\Services\AppSettings;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GuestAccess
{
    /**
     * Handle an incoming request.
     * 
     * This middleware allows guest access when guest mode is enabled.
     * Guests can only view the feed page (home), NOT other protected pages.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        $isGuest = (bool) $request->session()->get('is_guest', false);
        
        // Allow authenticated users (with msisdn and not guest) to access
        if ($msisdn !== '' && !$isGuest) {
            return $next($request);
        }
        
        $settings = app(AppSettings::class);
        $guestModeEnabled = (bool) $settings->get('guest_mode_enabled', false);
        
        // If guest mode is not enabled, redirect to login for subscription
        if (!$guestModeEnabled) {
            return redirect()->route('login.show');
        }
        
        // If user has no msisdn and is not already marked as guest, mark as guest
        // Do not create any fake msisdn - guests simply have is_guest=true and no msisdn
        if ($msisdn === '' && !$isGuest) {
            $request->session()->put('is_guest', true);
            $request->session()->put('msisdn', ''); // Ensure no msisdn for guests
        }
        
        return $next($request);
    }
}
