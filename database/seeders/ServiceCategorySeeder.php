<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electrician',
                'icon_key' => 'zap',
                'description' => 'Wiring, circuit breaker repair, fan, light, and electrical appliance fixing.',
            ],
            [
                'name' => 'Plumber',
                'icon_key' => 'wrench',
                'description' => 'Pipe leak repair, bathroom fittings, water pump, and drainage solutions.',
            ],
            [
                'name' => 'AC Mechanic',
                'icon_key' => 'wind',
                'description' => 'AC servicing, gas refill, installation, cooling troubleshooting, and repair.',
            ],
            [
                'name' => 'Carpenter',
                'icon_key' => 'hammer',
                'description' => 'Furniture repair, door lock installation, woodwork, and custom cabinetry.',
            ],
            [
                'name' => 'Painter',
                'icon_key' => 'paint-brush',
                'description' => 'Interior and exterior wall painting, damp treatment, and polish work.',
            ],
            [
                'name' => 'Appliance Repair',
                'icon_key' => 'tv',
                'description' => 'Refrigerator, washing machine, oven, TV, and IPS servicing.',
            ],
            [
                'name' => 'Other',
                'icon_key' => 'grid',
                'description' => 'General handyman, cleaning, or specialized technical repair services.',
            ],
        ];

        foreach ($categories as $cat) {
            ServiceCategory::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'icon_key' => $cat['icon_key'],
                    'description' => $cat['description'],
                ]
            );
        }
    }
}
