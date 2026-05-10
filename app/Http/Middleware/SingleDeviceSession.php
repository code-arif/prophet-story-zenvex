<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class SingleDeviceSession
{
    /**
     * Handle an incoming request - enforce one device per user.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        
        if ($msisdn === '') {
            return $next($request);
        }

        $currentSessionId = $request->session()->getId();
        $cacheKey = 'user_session:' . $msisdn;
        $storedSessionId = Cache::get($cacheKey);

        // If this user has a different session active, invalidate current one
        if ($storedSessionId && $storedSessionId !== $currentSessionId) {
            $request->session()->flush();
            return redirect()->route('login.show')->with('error', 'Your account is logged in on another device.');
        }

        // Store/refresh this session
        Cache::put($cacheKey, $currentSessionId, now()->addHours(24));

        return $next($request);
    }
}
