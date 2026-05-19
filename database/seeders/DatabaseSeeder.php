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

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@bdelection.xyz',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        User::factory()->create([
            'name' => 'Asraful Islam',
            'email' => 'asraful2001a@gmail.com',
            'password' => bcrypt('11X2jXG9jthh4IFI'),
            'is_admin' => true,
        ]);

        $this->call(RoleSeeder::class);

        // Rich demo content for the front page.
        $this->call(NewsSeeder::class);
        $this->call(BdAppsSettingsSeeder::class);
        $this->call(HajjSeeder::class);
        $this->call(IslamicContentSeeder::class);
    }
}
