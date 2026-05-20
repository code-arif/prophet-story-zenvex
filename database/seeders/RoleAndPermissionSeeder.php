<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Seed permissions
        $permissions = [
            // Content permissions
            'view_articles' => ['display_name' => 'View Articles', 'description' => 'Can view articles in admin'],
            'create_articles' => ['display_name' => 'Create Articles', 'description' => 'Can create new articles'],
            'edit_articles' => ['display_name' => 'Edit Articles', 'description' => 'Can edit articles'],
            'delete_articles' => ['display_name' => 'Delete Articles', 'description' => 'Can delete articles'],
            
            // Category permissions
            'manage_categories' => ['display_name' => 'Manage Categories', 'description' => 'Can manage categories'],
            
            // User permissions
            'view_users' => ['display_name' => 'View Users', 'description' => 'Can view users'],
            'create_users' => ['display_name' => 'Create Users', 'description' => 'Can create users'],
            'edit_users' => ['display_name' => 'Edit Users', 'description' => 'Can edit users'],
            'delete_users' => ['display_name' => 'Delete Users', 'description' => 'Can delete users'],
            
            // Subscriber permissions
            'view_subscribers' => ['display_name' => 'View Subscribers', 'description' => 'Can view subscribers'],
            'manage_subscriptions' => ['display_name' => 'Manage Subscriptions', 'description' => 'Can manage subscriptions'],
            
            // Settings permissions
            'view_settings' => ['display_name' => 'View Settings', 'description' => 'Can view settings'],
            'edit_settings' => ['display_name' => 'Edit Settings', 'description' => 'Can edit settings'],
            
            // Media permissions
            'manage_media' => ['display_name' => 'Manage Media', 'description' => 'Can manage media files'],
            
            // SMS permissions
            'send_sms' => ['display_name' => 'Send SMS', 'description' => 'Can send SMS messages'],
        ];

        $createdPermissions = [];
        foreach ($permissions as $name => $details) {
            $createdPermissions[$name] = Permission::firstOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                [
                    'display_name' => $details['display_name'],
                    'description' => $details['description'],
                ]
            );
        }

        // Seed roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'web'],
            [
                'display_name' => 'Administrator',
                'description' => 'Full access to all features',
            ]
        );

        $moderatorRole = Role::firstOrCreate(
            ['name' => 'moderator', 'guard_name' => 'web'],
            [
                'display_name' => 'Moderator',
                'description' => 'Can manage content and users',
            ]
        );

        $editorRole = Role::firstOrCreate(
            ['name' => 'editor', 'guard_name' => 'web'],
            [
                'display_name' => 'Editor',
                'description' => 'Can create and edit content',
            ]
        );

        // Assign permissions to roles
        $adminRole->syncPermissions(array_keys($permissions));

        $moderatorRole->syncPermissions([
            'view_articles',
            'create_articles',
            'edit_articles',
            'delete_articles',
            'manage_categories',
            'view_users',
            'view_subscribers',
            'manage_subscriptions',
            'manage_media',
            'send_sms',
            'view_settings',
        ]);

        $editorRole->syncPermissions([
            'view_articles',
            'create_articles',
            'edit_articles',
            'manage_categories',
            'manage_media',
        ]);

        // Assign admin role to existing admin users
        $adminUsers = User::where('is_admin', true)->get();
        foreach ($adminUsers as $user) {
            $user->assignRole($adminRole);
        }

        $this->command->info('Roles and permissions seeded successfully using Spatie package.');
    }
}
