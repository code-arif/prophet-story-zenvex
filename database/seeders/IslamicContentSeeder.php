<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Orchestrates all Islamic & Hajj-related seeders.
 * Runs in dependency order: PostTypes → Categories → Content → Pages
 */
class IslamicContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            Hajj\HajjPostTypesSeeder::class,
            Hajj\HajjCategoriesSeeder::class,
            Hajj\HajjDuasSeeder::class,
            Hajj\HajjArticlesSeeder::class,
            Hajj\HajjIslamSeeder::class,
            Hajj\HajjPagesSeeder::class,
        ]);
    }
}
