<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    /**
     * Handle an incoming request.
     * 
     * Verifies user authentication. If the request is for the admin panel,
     * it also verifies that the user is an administrator.
     * 
     * @param Request $request
     * @param Closure $next
     * @param string[] ...$guards
     * @return Response
     */
    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        $guard = $guards ? $guards[0] : null;

        if (Auth::guard($guard)->guest()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            if ($request->is('admin') || $request->is('admin/*')) {
                return redirect()->guest(route('admin.login'));
            }

            return redirect()->guest(route('login.show'));
        }

        $user = $request->user();

        // If accessing admin routes, ensure the user has admin panel rights
        if ($request->is('admin') || $request->is('admin/*')) {
            if (!$user || !$user->isAdmin()) {
                abort(403, 'You are not allowed to access the admin panel.');
            }
        }

        return $next($request);
    }
}
