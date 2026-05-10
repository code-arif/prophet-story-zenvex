<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class BdAppsSettingsSeeder extends Seeder
{
    public function run(): void
    {
        // BDApps credentials are now managed via admin panel (Settings > Integrations)
        // They are stored as integrations.bdapps_app_id and integrations.bdapps_password
        // and loaded into config by AppServiceProvider at boot time
        
        $settings = [
            [
                'key' => 'bdapps.use_platform_otp',
                'value' => 'true',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }

        $this->command->info('BDApps settings seeded successfully.');
        $this->command->warn('Remember to configure BDApps credentials in Admin Settings > Integrations');
    }
}
