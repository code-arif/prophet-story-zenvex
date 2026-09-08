<?php

namespace Tests\Feature;

use App\Models\KidProfile;
use App\Models\Prophet;
use App\Models\Subscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KidProfileTest extends TestCase
{
    use RefreshDatabase;

    private function createSubscriber(): Subscriber
    {
        return Subscriber::create([
            'msisdn' => '8801700000002',
            'name' => 'Parent User',
        ]);
    }

    private function createProphet(string $name, int $order): Prophet
    {
        return Prophet::create([
            'name' => $name,
            'chronological_order' => $order,
            'short_intro' => 'Intro for ' . $name,
            'cover_image_path' => 'covers/' . strtolower(str_replace(' ', '_', $name)) . '.jpg',
        ]);
    }

    public function test_parent_can_view_and_create_kid_profile(): void
    {
        $subscriber = $this->createSubscriber();
        $p1 = $this->createProphet('Adam (AS)', 1);
        $p2 = $this->createProphet('Nuh (AS)', 2);

        $response = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->get('/kid-profiles');
        $response->assertStatus(200);

        $kidResponse = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->get('/kid');
        $kidResponse->assertStatus(200);

        $postResponse = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->postJson('/kid-profiles', [
                'name' => 'Ayan',
                'default_reader_mode' => 'kid',
                'unlocked_prophet_ids' => [$p1->id],
            ]);

        $postResponse->assertStatus(200)
            ->assertJsonPath('saved', true)
            ->assertJsonPath('profile.name', 'Ayan');

        $this->assertDatabaseHas('kid_profiles', [
            'parent_user_id' => $subscriber->id,
            'name' => 'Ayan',
            'default_reader_mode' => 'kid',
        ]);
    }

    public function test_parent_can_update_and_delete_kid_profile(): void
    {
        $subscriber = $this->createSubscriber();
        $p1 = $this->createProphet('Musa (AS)', 1);

        $profile = KidProfile::create([
            'parent_user_id' => $subscriber->id,
            'name' => 'Sara',
            'default_reader_mode' => 'kid',
            'unlocked_prophet_ids' => [$p1->id],
        ]);

        $updateResponse = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->putJson("/kid-profiles/{$profile->id}", [
                'name' => 'Sara Updated',
                'default_reader_mode' => 'kid',
                'unlocked_prophet_ids' => [$p1->id],
            ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('saved', true)
            ->assertJsonPath('profile.name', 'Sara Updated');

        $this->assertDatabaseHas('kid_profiles', [
            'id' => $profile->id,
            'name' => 'Sara Updated',
        ]);

        $deleteResponse = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->deleteJson("/kid-profiles/{$profile->id}");

        $deleteResponse->assertStatus(200);
        $this->assertDatabaseMissing('kid_profiles', [
            'id' => $profile->id,
        ]);
    }

    public function test_parent_can_switch_context_to_kid_profile_and_back(): void
    {
        $subscriber = $this->createSubscriber();
        $profile = KidProfile::create([
            'parent_user_id' => $subscriber->id,
            'name' => 'Child Profile',
            'default_reader_mode' => 'kid',
        ]);

        // Switch to Child profile
        $switchResponse = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->postJson('/kid-profiles/switch', [
                'profile_id' => $profile->id,
            ]);

        $switchResponse->assertStatus(200)
            ->assertJsonPath('active_profile.name', 'Child Profile');

        $switchResponse->assertSessionHas('active_kid_profile_id', $profile->id);

        // Switch back to Parent
        $parentResponse = $this->withSession([
            'msisdn' => $subscriber->msisdn,
            'active_kid_profile_id' => $profile->id,
        ])->postJson('/kid-profiles/switch', [
            'profile_id' => 'parent',
        ]);

        $parentResponse->assertStatus(200)
            ->assertJsonPath('reading_as', 'parent');

        $parentResponse->assertSessionMissing('active_kid_profile_id');
    }

    public function test_library_index_filters_prophets_when_kid_profile_active(): void
    {
        $subscriber = $this->createSubscriber();
        $p1 = $this->createProphet('Ibrahim (AS)', 1);
        $p2 = $this->createProphet('Yusuf (AS)', 2);

        // Profile with ONLY Prophet 1 unlocked
        $profile = KidProfile::create([
            'parent_user_id' => $subscriber->id,
            'name' => 'Young Child',
            'default_reader_mode' => 'kid',
            'unlocked_prophet_ids' => [$p1->id],
        ]);

        // 1. Visit /library as Child (session has active_kid_profile_id)
        $childLibraryResponse = $this->withSession([
            'msisdn' => $subscriber->msisdn,
            'active_kid_profile_id' => $profile->id,
        ])->get('/library');

        $childLibraryResponse->assertStatus(200);
        $prophetsList = $childLibraryResponse->viewData('page')['props']['prophets'];
        $this->assertCount(1, $prophetsList);
        $this->assertEquals($p1->id, $prophetsList[0]['id']);

        // 2. Visit /library as Parent (clear child profile from session)
        $this->flushSession();
        $parentLibraryResponse = $this->withSession([
            'msisdn' => $subscriber->msisdn,
        ])->get('/library');

        $parentLibraryResponse->assertStatus(200);
        $parentProphetsList = $parentLibraryResponse->viewData('page')['props']['prophets'];
        $this->assertCount(2, $parentProphetsList);
    }
}
