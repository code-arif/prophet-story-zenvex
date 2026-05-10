<?php

require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Page;

// Find or create a test page
$page = Page::firstOrCreate(
    ['slug' => 'slider-test'],
    [
        'title' => 'Slider Test Page',
        'published_at' => now(),
    ]
);

// Add a slider block
$page->builder_data = [
    [
        'type' => 'slider',
        'props' => [
            'items' => [
                [
                    'title' => 'Slide 1 - Welcome',
                    'desc' => 'This is the first slide',
                    'image' => '',
                    'href' => '/articles/slide1',
                ],
                [
                    'title' => 'Slide 2 - Features',
                    'desc' => 'Check out our features',
                    'image' => '',
                    'href' => '/articles/slide2',
                ],
                [
                    'title' => 'Slide 3 - Get Started',
                    'desc' => 'Start using our service today',
                    'image' => '',
                    'href' => '/articles/slide3',
                ],
            ],
            'loop' => true,
            'autoplay' => true,
            'autoplayInterval' => 3000,
            'showDots' => true,
            'showArrows' => true,
        ],
    ],
];
$page->use_builder = true;

$page->save();

echo "Page created/updated with slug: slider-test\n";
echo "Visit: http://127.0.0.1:8000/p/slider-test\n";
