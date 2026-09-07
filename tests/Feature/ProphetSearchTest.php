<?php

namespace Tests\Feature;

use App\Models\Prophet;
use App\Models\StoryChapter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProphetSearchTest extends TestCase
{
    use RefreshDatabase;

    private function seedSearchData(): void
    {
        // Prophet 1: Musa (AS)
        $musa = Prophet::create([
            'name' => 'হযরত মুসা (আঃ)',
            'name_arabic' => 'موسى',
            'short_intro' => 'বনী ইসরাইলের পথপ্রদর্শক ও ফেরাউনের বিরুদ্ধে তাওহীদের প্রচারক।',
            'cover_image_path' => 'covers/musa.jpg',
            'chronological_order' => 14,
        ]);

        StoryChapter::create([
            'prophet_id' => $musa->id,
            'chapter_number' => 1,
            'title' => 'মিশরে জন্ম ও নীল নদের ঘটনা',
            'content_standard' => 'ফেরাউনের নির্দেশ ছিল বনী ইসরাইলের নবজাতক পুত্র সন্তানদের হত্যা করা। মুসার মাতা তাকে নীল নদে ভাসিয়ে দিলেন।',
            'content_kid_friendly' => 'ছোট মুসাকে তার মা একটি সুন্দর ঝুড়িতে করে নীল নদে ভাসিয়ে দিলেন।',
            'moral_lesson' => 'আল্লাহর পরিকল্পনার ওপর পূর্ণ বিশ্বাস ও তাওয়াক্কুল রাখা।',
            'source_reference' => 'সূরা আল-কাসাস, আয়াত ৭-১৩',
        ]);

        StoryChapter::create([
            'prophet_id' => $musa->id,
            'chapter_number' => 2,
            'title' => 'তুর পাহাড়ে নূর ও আসমানী বাণী',
            'content_standard' => 'তুর পাহাড়ে আল্লাহ তাআলা মুসা (আঃ)-এর সাথে সরাসরি কথা বললেন এবং নিদর্শন স্বরূপ লাঠি প্রদান করলেন।',
            'content_kid_friendly' => 'তুর পাহাড়ে মুসা (আঃ) একটি উজ্জ্বল আলো দেখতে পেলেন।',
            'moral_lesson' => 'আল্লাহর আদেশের সামনে বিনীত ও অনুগত থাকা।',
            'source_reference' => 'সূরা ত্বাহা, আয়াত ৯-২৪',
        ]);

        // Prophet 2: Ibrahim (AS)
        $ibrahim = Prophet::create([
            'name' => 'হযরত ইব্রাহিম (আঃ)',
            'name_arabic' => 'إبراهيم',
            'short_intro' => 'তাওহীদের পিতা ও খলিলুল্লাহ।',
            'cover_image_path' => 'covers/ibrahim.jpg',
            'chronological_order' => 6,
        ]);

        StoryChapter::create([
            'prophet_id' => $ibrahim->id,
            'chapter_number' => 1,
            'title' => 'মহা কুরবানী ও ইসমাঈল (আঃ)',
            'content_standard' => 'আল্লাহ তাআলা ইব্রাহিম (আঃ)-কে তার প্রিয় পুত্রকে কুরবানী করার নির্দেশ দিয়ে পরীক্ষা করলেন।',
            'content_kid_friendly' => 'পিতা ও পুত্র দুজনেই আল্লাহর নির্দেশের সামনে হাসিমুখে আত্মসমর্পণ করলেন।',
            'moral_lesson' => 'আল্লাহর সন্তুষ্টির জন্য সর্বোচ্চ ত্যাগ স্বীকারের শিক্ষা।',
            'source_reference' => 'সূরা আস-সাফফাত, আয়াত ১০২-১১০',
        ]);
    }

    public function test_empty_search_returns_empty_results(): void
    {
        $this->seedSearchData();

        $response = $this->getJson('/search?q=');

        $response->assertStatus(200)
            ->assertJson([
                'q' => '',
                'results' => [],
                'totalMatches' => 0,
            ]);
    }

    public function test_search_by_prophet_name_groups_results(): void
    {
        $this->seedSearchData();

        $response = $this->getJson('/search?q=মুসা');

        $response->assertStatus(200)
            ->assertJsonPath('q', 'মুসা')
            ->assertJsonCount(1, 'results')
            ->assertJsonPath('results.0.name', 'হযরত মুসা (আঃ)')
            ->assertJsonCount(2, 'results.0.matching_chapters');
    }

    public function test_search_by_chapter_title(): void
    {
        $this->seedSearchData();

        $response = $this->getJson('/search?q=কুরবানী');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'results')
            ->assertJsonPath('results.0.name', 'হযরত ইব্রাহিম (আঃ)')
            ->assertJsonPath('results.0.matching_chapters.0.title', 'মহা কুরবানী ও ইসমাঈল (আঃ)');
    }

    public function test_search_by_body_content_returns_snippet(): void
    {
        $this->seedSearchData();

        $response = $this->getJson('/search?q=নীল নদ');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'results')
            ->assertJsonPath('results.0.name', 'হযরত মুসা (আঃ)')
            ->assertJsonPath('results.0.matching_chapters.0.chapter_number', 1);

        $snippet = $response->json('results.0.matching_chapters.0.snippet');
        $this->assertStringContainsString('নীল নদ', $snippet);
    }

    public function test_search_page_renders_via_inertia(): void
    {
        $this->seedSearchData();

        $response = $this->get('/search?q=তুর পাহাড়');

        $response->assertStatus(200);
    }
}
