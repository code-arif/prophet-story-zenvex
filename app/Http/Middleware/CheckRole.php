<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CheckRole Middleware
 * 
 * This middleware checks if the authenticated user has any of the required roles.
 * It supports multiple roles - user only needs one of them to pass.
 * 
 * Usage: Route::get('/path', 'Controller@method')->middleware('role:admin,moderator');
 * 
 * If the user doesn't have any of the required roles, a 403 error is returned.
 */
class CheckRole
{
    /**
     * Handle an incoming request to check if user has required role(s).
     * 
     * @param Request $request The incoming request
     * @param Closure $next The next middleware/controller
     * @param string ...$roles One or more role names to check
     * @return Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('admin.login')->with('error', 'Authentication required.');
        }

        // Check if user has any of the required roles
        if (!$user->hasRole($roles)) {
            abort(403, 'Unauthorized. Insufficient permissions.');
        }

        return $next($request);
    }
}
