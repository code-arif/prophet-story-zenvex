<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use App\Models\SidebarMenu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Facades\DB;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        Cache::forget('sidebar_menus');

        // Create admin role
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web'], [
            'display_name' => 'Administrator'
        ]);

        // Get all menus
        $menus = SidebarMenu::all();
        $allPermissionNames = [];

        foreach ($menus as $menu) {
            $types = ['view', 'manage'];
            
            foreach ($types as $type) {
                $permissionName = $type . ' ' . $menu->name;
                
                Permission::firstOrCreate([
                    'name' => $permissionName,
                    'guard_name' => 'web'
                ], [
                    'display_name' => $permissionName,
                    'menu_id' => $menu->id,
                ]);

                $allPermissionNames[] = $permissionName;
            }
        }

        // Add extra permissions for Access Control
        $extraPermissions = ['manage Access Control', 'view Access Control'];
        foreach ($extraPermissions as $perm) {
            Permission::firstOrCreate([
                'name' => $perm,
                'guard_name' => 'web'
            ], [
                'display_name' => $perm,
            ]);
            $allPermissionNames[] = $perm;
        }

        // Sync all permissions to admin
        $adminRole->syncPermissions($allPermissionNames);

        // Optional: Reset cache again after sync
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Assign admin role to the first user
        $firstUser = User::where('is_admin', true)->first() ?: User::first();
        if ($firstUser) {
            $firstUser->assignRole($adminRole);
        }
    }
}
