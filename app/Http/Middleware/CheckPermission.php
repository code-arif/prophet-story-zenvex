<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CheckPermission Middleware
 * 
 * This middleware checks if the authenticated user has a specific permission.
 * It is used to protect routes that require specific permissions.
 * 
 * Usage: Route::get('/path', 'Controller@method')->middleware('permission:edit-articles');
 * 
 * If the user doesn't have the required permission, a 403 error is returned.
 */
class CheckPermission
{
    /**
     * Handle an incoming request to check if user has required permission.
     * 
     * @param Request $request The incoming request
     * @param Closure $next The next middleware/controller
     * @param string $permission The permission name to check
     * @return Response
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('admin.login')->with('error', 'Authentication required.');
        }

        // Check if user has the required permission
        if (!$user->hasPermission($permission)) {
            abort(403, 'Unauthorized. You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
