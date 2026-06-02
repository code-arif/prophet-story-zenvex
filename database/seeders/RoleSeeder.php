<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create basic roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Administrator', 'description' => 'Full access to all features']
        );

        $moderatorRole = Role::firstOrCreate(
            ['name' => 'moderator'],
            ['display_name' => 'Moderator', 'description' => 'Can moderate content']
        );

        $editorRole = Role::firstOrCreate(
            ['name' => 'editor'],
            ['display_name' => 'Editor', 'description' => 'Can edit content']
        );

        // Assign admin role to existing admins
        $admins = User::where('is_admin', true)->get();
        
        foreach ($admins as $admin) {
            if (!$admin->hasRole('admin')) {
                $admin->roles()->attach($adminRole->id);
            }
        }
    }
}
