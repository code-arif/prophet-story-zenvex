<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create roles table
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Create permissions table
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Create role_user pivot table
        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'role_id']);
        });

        // Create permission_role pivot table
        Schema::create('permission_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['role_id', 'permission_id']);
        });

        // Seed default roles
        DB::table('roles')->insert([
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full access to all features',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'moderator',
                'display_name' => 'Moderator',
                'description' => 'Can manage content and users',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'editor',
                'display_name' => 'Editor',
                'description' => 'Can create and edit content',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Seed default permissions
        DB::table('permissions')->insert([
            // Content permissions
            ['name' => 'view_articles', 'display_name' => 'View Articles', 'description' => 'Can view articles in admin', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'create_articles', 'display_name' => 'Create Articles', 'description' => 'Can create new articles', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'edit_articles', 'display_name' => 'Edit Articles', 'description' => 'Can edit articles', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'delete_articles', 'display_name' => 'Delete Articles', 'description' => 'Can delete articles', 'created_at' => now(), 'updated_at' => now()],
            
            // Category permissions
            ['name' => 'manage_categories', 'display_name' => 'Manage Categories', 'description' => 'Can manage categories', 'created_at' => now(), 'updated_at' => now()],
            
            // User permissions
            ['name' => 'view_users', 'display_name' => 'View Users', 'description' => 'Can view users', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'create_users', 'display_name' => 'Create Users', 'description' => 'Can create users', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'edit_users', 'display_name' => 'Edit Users', 'description' => 'Can edit users', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'delete_users', 'display_name' => 'Delete Users', 'description' => 'Can delete users', 'created_at' => now(), 'updated_at' => now()],
            
            // Subscriber permissions
            ['name' => 'view_subscribers', 'display_name' => 'View Subscribers', 'description' => 'Can view subscribers', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'manage_subscriptions', 'display_name' => 'Manage Subscriptions', 'description' => 'Can manage subscriptions', 'created_at' => now(), 'updated_at' => now()],
            
            // Settings permissions
            ['name' => 'view_settings', 'display_name' => 'View Settings', 'description' => 'Can view settings', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'edit_settings', 'display_name' => 'Edit Settings', 'description' => 'Can edit settings', 'created_at' => now(), 'updated_at' => now()],
            
            // Media permissions
            ['name' => 'manage_media', 'display_name' => 'Manage Media', 'description' => 'Can manage media files', 'created_at' => now(), 'updated_at' => now()],
            
            // SMS permissions
            ['name' => 'send_sms', 'display_name' => 'Send SMS', 'description' => 'Can send SMS messages', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Assign all permissions to admin role
        $adminRole = DB::table('roles')->where('name', 'admin')->first();
        $allPermissions = DB::table('permissions')->get();
        
        foreach ($allPermissions as $permission) {
            DB::table('permission_role')->insert([
                'role_id' => $adminRole->id,
                'permission_id' => $permission->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Assign content permissions to moderator
        $moderatorRole = DB::table('roles')->where('name', 'moderator')->first();
        $moderatorPermissions = ['view_articles', 'create_articles', 'edit_articles', 'delete_articles', 
                                 'manage_categories', 'view_users', 'view_subscribers', 'manage_subscriptions', 
                                 'manage_media', 'send_sms', 'view_settings'];
        
        foreach ($moderatorPermissions as $permName) {
            $perm = DB::table('permissions')->where('name', $permName)->first();
            if ($perm) {
                DB::table('permission_role')->insert([
                    'role_id' => $moderatorRole->id,
                    'permission_id' => $perm->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Assign content permissions to editor
        $editorRole = DB::table('roles')->where('name', 'editor')->first();
        $editorPermissions = ['view_articles', 'create_articles', 'edit_articles', 'manage_categories', 'manage_media'];
        
        foreach ($editorPermissions as $permName) {
            $perm = DB::table('permissions')->where('name', $permName)->first();
            if ($perm) {
                DB::table('permission_role')->insert([
                    'role_id' => $editorRole->id,
                    'permission_id' => $perm->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Assign admin role to existing admin users
        $adminUsers = DB::table('users')->where('is_admin', true)->get();
        foreach ($adminUsers as $user) {
            DB::table('role_user')->insert([
                'user_id' => $user->id,
                'role_id' => $adminRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
