<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminRoleController extends Controller
{
    /**
     * Display a listing of the roles.
     */
    public function index()
    {
        if ($this->checkPermission('Access Control', 'manage')) {
            $roles = Role::with('permissions')->get();

            return Inertia::render('Admin/Roles/Index', [
                'roles' => $roles,
            ]);
        }
        return Inertia::render('Errors/Unauthorized');
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        if ($this->checkPermission('Access Control', 'manage')) {
            $permissions = Permission::all();

            return Inertia::render('Admin/Roles/Create', [
                'permissions' => $permissions,
            ]);
        }
        return Inertia::render('Errors/Unauthorized');
    }

    /**
     * Store a newly created role in database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'display_name' => ['required', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $name = \Illuminate\Support\Str::slug($request->display_name, '_');

        $role = Role::create([
            'name' => $name,
            'display_name' => $request->display_name,
            'guard_name' => 'web',
        ]);

        if (isset($request->permissions)) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        if ($this->checkPermission('Access Control', 'manage')) {
            $role->load('permissions');
            $permissions = Permission::all();

            return Inertia::render('Admin/Roles/Edit', [
                'role' => $role,
                'permissions' => $permissions,
                'rolePermissionNames' => $role->permissions->pluck('name')->toArray(),
            ]);
        }
        return Inertia::render('Errors/Unauthorized');
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'display_name' => ['required', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        if ($role->name === 'admin') {
            $role->update([
                'display_name' => $request->display_name,
            ]);
            $role->syncPermissions(Permission::all());
        } else {
            $role->update([
                'name' => \Illuminate\Support\Str::slug($request->display_name, '_'),
                'display_name' => $request->display_name,
            ]);

            if (isset($request->permissions)) {
                $role->syncPermissions($request->permissions);
            } else {
                $role->syncPermissions([]);
            }
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role from database.
     */
    public function destroy(Role $role)
    {
        // Prevent deleting default roles
        if ($role->name === 'admin') {
            return back()->with('error', 'Default system roles cannot be deleted.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
