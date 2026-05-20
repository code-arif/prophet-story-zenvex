<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureAdmin Middleware
 * 
 * This middleware ensures that only admin users can access admin panel routes.
 * It checks if the user has any admin role (admin, moderator, editor).
 * 
 * Unlike CheckRole, this middleware doesn't take parameters - it always
 * checks for admin-type roles. Specific permissions are checked separately.
 * 
 * Usage: Route::middleware('admin')->group(function () { ... });
 */
class EnsureAdmin
{
    /**
     * Handle an incoming request.
     * 
     * Allow access to users with is_admin flag OR any admin role (admin, moderator, editor).
     * Specific permissions are checked at the route level.
     * 
     * @param Request $request The incoming request
     * @param Closure $next The next middleware/controller
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('admin.login');
        }

        // Allow access if user is an admin or has any assigned role
        if (!$user->isAdmin()) {
            abort(403, 'You are not allowed to access the admin panel.');
        }

        return $next($request);
    }
}
