<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\SidebarMenu;
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
        if ($this->checkPermission('Access Control', 'manage')) {
            $permissions = Permission::with('menu')->get();
            $menus = SidebarMenu::all();

            return Inertia::render('Admin/Permissions/Index', [
                'permissions' => $permissions,
                'menus' => $menus,
            ]);
        }
        return Inertia::render('Errors/Unauthorized');
    }

    /**
     * Store a newly created permission in database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'menu_id' => ['nullable', 'exists:sidebar_menus,id'],
            'types' => ['required', 'array', 'min:1'],
            'types.*' => ['string', 'in:view,manage'],
        ]);

        $menu = $request->menu_id ? SidebarMenu::find($request->menu_id) : null;
        $baseName = $request->name;

        foreach ($request->types as $type) {
            $name = $type . ' ' . $baseName;
            
            Permission::updateOrCreate(
                ['name' => $name],
                [
                    'display_name' => $name,
                    'menu_id' => $menu?->id,
                    'guard_name' => 'web'
                ]
            );
        }

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permissions created successfully.');
    }

    /**
     * Update the specified permission in database.
     */
    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'menu_id' => ['nullable', 'exists:sidebar_menus,id'],
            'types' => ['required', 'array', 'min:1'],
            'types.*' => ['string', 'in:view,manage'],
        ]);

        $baseName = $request->name;
        
        // Update the current permission first
        $firstType = $request->types[0];
        $newName = $firstType . ' ' . $baseName;
        
        $permission->update([
            'name' => $newName,
            'display_name' => $newName,
            'menu_id' => $request->menu_id,
        ]);

        // If more types were selected, create/update them too
        if (count($request->types) > 1) {
            foreach (array_slice($request->types, 1) as $type) {
                Permission::updateOrCreate(
                    ['name' => $type . ' ' . $baseName],
                    [
                        'display_name' => $type . ' ' . $baseName,
                        'menu_id' => $request->menu_id,
                        'guard_name' => 'web'
                    ]
                );
            }
        }

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission updated successfully.');
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
