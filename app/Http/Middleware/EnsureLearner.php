<?php

namespace App\Http\Middleware;

use App\Models\Subscriber;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureLearner — requires a logged-in subscriber for the learner app.
 *
 * The subscriber auth is session/MSISDN based (same source of truth as
 * HandleInertiaRequests), so we check the session msisdn first and fall
 * back to the "subscriber" auth guard (remember-me cookie). Guests and
 * anonymous visitors are redirected to the phone-login screen.
 */
class EnsureLearner
{
    public function handle(Request $request, Closure $next): Response
    {
        $msisdn = (string) $request->session()->get('msisdn', '');

        if ($msisdn === '' && Auth::guard('subscriber')->check()) {
            $msisdn = (string) Auth::guard('subscriber')->user()->msisdn;
            $request->session()->put('msisdn', $msisdn);
        }

        if ($msisdn === '') {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            return redirect()->guest(route('login.show'));
        }

        $request->session()->put('msisdn', $msisdn);

        // New users must finish profile setup + placement before entering
        // the learner tabs. The onboarding (welcome.*) routes and the home
        // screen (which redirects itself) are excluded.
        if (!$request->routeIs('welcome.*', 'learner.home')) {
            $subscriber = Subscriber::query()->where('msisdn', $msisdn)->first();
            if ($subscriber && !$subscriber->is_onboarded) {
                return Redirect::route('welcome.profile');
            }
        }

        return $next($request);
    }
}
