<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Article::query()->updateOrCreate(
            ['slug' => 'welcome'],
            [
                'title' => 'Welcome to BD Election Daily',
                'excerpt' => 'Subscriber-only coverage and analysis.',
                'body' => "This is a sample article.\n\nYour full content will be protected behind an active subscription.",
                'published_at' => now(),
            ]
        );

        Article::query()->updateOrCreate(
            ['slug' => 'results'],
            [
                'title' => 'Live Results: Key Districts',
                'excerpt' => 'Updates from major constituencies.',
                'body' => "This is a second sample article.\n\nReplace with your newsroom content.",
                'published_at' => now(),
            ]
        );
    }
}
