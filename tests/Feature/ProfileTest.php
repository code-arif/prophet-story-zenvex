<?php

namespace Tests\Feature;

use App\Models\Subscriber;
use App\Models\Subscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private function createSubscriber(string $msisdn = '8801700000001'): Subscriber
    {
        $subscriber = Subscriber::create([
            'msisdn' => $msisdn,
            'name' => 'John Doe',
        ]);

        Subscription::create([
            'msisdn' => $msisdn,
            'status' => Subscription::STATUS_ACTIVE,
            'starts_at' => now(),
            'channel' => 'web',
        ]);

        return $subscriber;
    }

    public function test_subscribed_user_can_view_profile(): void
    {
        $subscriber = $this->createSubscriber();

        $response = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->get('/profile');

        $response->assertStatus(200);
    }

    public function test_user_can_update_profile(): void
    {
        $subscriber = $this->createSubscriber();

        $response = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->post('/profile', [
                'name' => 'Updated Name',
                'dob' => '1995-05-15',
            ]);

        $response->assertRedirect('/profile');

        $this->assertDatabaseHas('subscribers', [
            'msisdn' => $subscriber->msisdn,
            'name' => 'Updated Name',
            'dob' => '1995-05-15 00:00:00',
        ]);
    }

    public function test_user_can_unsubscribe(): void
    {
        $subscriber = $this->createSubscriber();

        $response = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->post('/unsubscribe');

        $response->assertRedirect(route('login.show'));

        $this->assertDatabaseHas('subscriptions', [
            'msisdn' => $subscriber->msisdn,
            'status' => Subscription::STATUS_CANCELED,
        ]);
    }

    public function test_user_can_logout(): void
    {
        $subscriber = $this->createSubscriber();

        $response = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->post('/logout');

        $response->assertRedirect(route('login.show'));
    }
}
