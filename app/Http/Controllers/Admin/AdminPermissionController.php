<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminPermissionController extends Controller
{
    /**
     * Display a listing of the permissions.
     */
    public function index()
    {
        $permissions = Permission::all();

        return Inertia::render('Admin/Permissions/Index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created permission in database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name', 'regex:/^[a-zA-Z0-9_]+$/'],
            'display_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ], [
            'name.regex' => 'The permission name must only contain letters, numbers, and underscores (e.g. manage_users).',
        ]);

        Permission::create([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'],
            'description' => $validated['description'] ?? null,
            'guard_name' => 'web',
        ]);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Remove the specified permission from database.
     */
    public function destroy(Permission $permission)
    {
        // Core system permissions protection list
        $corePermissions = [
            'view_articles', 'create_articles', 'edit_articles', 'delete_articles',
            'manage_categories', 'view_users', 'create_users', 'edit_users', 'delete_users',
            'view_subscribers', 'manage_subscriptions', 'view_settings', 'edit_settings',
            'manage_media', 'send_sms'
        ];

        if (in_array($permission->name, $corePermissions)) {
            return back()->with('error', 'Core system permissions cannot be deleted.');
        }

        $permission->delete();

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
}
