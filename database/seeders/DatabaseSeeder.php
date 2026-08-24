<?php

namespace Database\Seeders;

use Database\Seeders\ArticleSeeder;
use Database\Seeders\NewsSeeder;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(['email' => 'admin@bdelection.xyz'], [
            'name' => 'Super Admin',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        User::updateOrCreate(['email' => 'asraful2001a@gmail.com'], [
            'name' => 'Asraful Islam',
            'password' => bcrypt('11X2jXG9jthh4IFI'),
            'is_admin' => true,
        ]);

        $this->call(SidebarMenuSeeder::class);
        $this->call(RoleAndPermissionSeeder::class);
        $this->call(BdAppsSettingsSeeder::class);
        $this->call(EasyRiseSeeder::class);
    }
}
