<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\AppSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LoginChargingTextTest extends TestCase
{
    use RefreshDatabase;
    public function test_login_page_renders_with_app_charge_text(): void
    {
        /** @var AppSettings $settings */
        $settings = app(AppSettings::class);
        $settings->set('app.download_charge_text', 'Charge: Tk 5.00+ (VAT+SD+SC) per day.');

        $response = $this->get('/login');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Auth/PhoneLogin')
            ->where('appChargeText', 'Charge: Tk 5.00+ (VAT+SD+SC) per day.')
        );
    }

    public function test_admin_settings_general_receives_and_updates_app_charge_text(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create(['is_admin' => true]);

        /** @var AppSettings $settings */
        $settings = app(AppSettings::class);
        $settings->set('app.download_charge_text', 'Old Charge 3.00');

        $this->actingAs($admin)
            ->get('/admin/settings/general')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Settings/General')
                ->where('settings.app_download_charge_text', 'Old Charge 3.00')
                ->where('settings.app_charge_text', 'Old Charge 3.00')
            );

        // Update charge text via admin settings post
        $postData = [
            'guest_mode_enabled' => false,
            'app_charge_text' => 'New Charge: Tk 4.00+ per day',
        ];

        $this->actingAs($admin)
            ->post('/admin/settings/general', $postData)
            ->assertSessionHas('status', 'Settings saved.');

        $this->assertEquals('New Charge: Tk 4.00+ per day', $settings->get('app.download_charge_text'));

        // Verify login page now receives the updated charge text
        $this->get('/login')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Auth/PhoneLogin')
                ->where('appChargeText', 'New Charge: Tk 4.00+ per day')
            );
    }
}
