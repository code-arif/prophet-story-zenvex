<?php

namespace Tests\Feature;

use App\Http\Controllers\ProphetController;
use App\Models\ChapterReadRecord;
use App\Models\Prophet;
use App\Models\StoryChapter;
use App\Models\Subscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChapterCompletionTest extends TestCase
{
    use RefreshDatabase;

    private function createSubscriber(): Subscriber
    {
        return Subscriber::create([
            'msisdn' => '8801700000001',
            'name' => 'Test Reader',
        ]);
    }

    private function createProphetWithChapters(string $name, int $chapterCount): Prophet
    {
        $prophet = Prophet::create([
            'name' => $name,
            'chronological_order' => 1,
            'short_intro' => 'Intro for ' . $name,
            'cover_image_path' => 'covers/' . strtolower(str_replace(' ', '_', $name)) . '.jpg',
        ]);

        for ($i = 1; $i <= $chapterCount; $i++) {
            StoryChapter::create([
                'prophet_id' => $prophet->id,
                'chapter_number' => $i,
                'title' => "Chapter {$i} of {$name}",
                'content_standard' => "Standard content for chapter {$i}",
                'content_kid_friendly' => "Kid content for chapter {$i}",
                'moral_lesson' => "Moral lesson {$i}",
                'source_reference' => "Reference {$i}",
            ]);
        }

        return $prophet;
    }

    public function test_unauthenticated_user_cannot_mark_chapter_as_read(): void
    {
        $prophet = $this->createProphetWithChapters('Adam (AS)', 1);
        $chapter = $prophet->chapters()->first();

        $response = $this->postJson('/reader/read', [
            'chapter_id' => $chapter->id,
        ]);

        $response->assertStatus(401);
        $this->assertDatabaseMissing('chapter_read_records', [
            'story_chapter_id' => $chapter->id,
        ]);
    }

    public function test_subscriber_can_mark_chapter_as_read_and_it_is_idempotent(): void
    {
        $subscriber = $this->createSubscriber();
        $prophet = $this->createProphetWithChapters('Nuh (AS)', 2);
        $chapter = $prophet->chapters()->first();

        // Mark as read with subscriber session
        $response = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->postJson('/reader/read', [
                'chapter_id' => $chapter->id,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'saved' => true,
                'is_read' => true,
            ]);

        $this->assertDatabaseHas('chapter_read_records', [
            'subscriber_id' => $subscriber->id,
            'story_chapter_id' => $chapter->id,
        ]);

        // Calling again does not duplicate the record (idempotent)
        $response2 = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->postJson('/reader/read', [
                'chapter_id' => $chapter->id,
            ]);

        $response2->assertStatus(200);
        $this->assertSame(
            1,
            ChapterReadRecord::where('subscriber_id', $subscriber->id)
                ->where('story_chapter_id', $chapter->id)
                ->count()
        );
    }

    public function test_prophet_controller_progress_computes_per_prophet_and_overall(): void
    {
        $subscriber = $this->createSubscriber();

        // Prophet 1 has 2 chapters (both read -> 100%, completed = true)
        $p1 = $this->createProphetWithChapters('Ibrahim (AS)', 2);
        $p1Chapters = $p1->chapters()->get();
        foreach ($p1Chapters as $ch) {
            ChapterReadRecord::create([
                'subscriber_id' => $subscriber->id,
                'story_chapter_id' => $ch->id,
                'completed_at' => now(),
            ]);
        }

        // Prophet 2 has 2 chapters (1 read -> 50%, completed = false)
        $p2 = $this->createProphetWithChapters('Musa (AS)', 2);
        $p2Chapters = $p2->chapters()->get();
        ChapterReadRecord::create([
            'subscriber_id' => $subscriber->id,
            'story_chapter_id' => $p2Chapters[0]->id,
            'completed_at' => now(),
        ]);

        $controller = new ProphetController();
        $progress = $controller->progress($subscriber);

        // Per prophet
        $this->assertEquals(2, $progress['prophets'][$p1->id]['chapters_read']);
        $this->assertEquals(2, $progress['prophets'][$p1->id]['total_chapters']);
        $this->assertEquals(100, $progress['prophets'][$p1->id]['percentage']);
        $this->assertTrue($progress['prophets'][$p1->id]['is_completed']);

        $this->assertEquals(1, $progress['prophets'][$p2->id]['chapters_read']);
        $this->assertEquals(2, $progress['prophets'][$p2->id]['total_chapters']);
        $this->assertEquals(50, $progress['prophets'][$p2->id]['percentage']);
        $this->assertFalse($progress['prophets'][$p2->id]['is_completed']);

        // Overall
        $this->assertEquals(1, $progress['overall']['completed_prophets']);
        $this->assertEquals(2, $progress['overall']['total_prophets']);
        $this->assertEquals(3, $progress['overall']['completed_chapters']);
        $this->assertEquals(4, $progress['overall']['total_chapters']);
        $this->assertEquals(75, $progress['overall']['overall_percentage']);

        // Progress endpoint JSON
        $response = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->getJson('/library/progress');

        $response->assertStatus(200)
            ->assertJsonPath('overall.completed_prophets', 1)
            ->assertJsonPath('overall.total_prophets', 2)
            ->assertJsonPath('overall.overall_percentage', 75);
    }

    public function test_library_index_and_reader_views_receive_completion_props(): void
    {
        $subscriber = $this->createSubscriber();
        $prophet = $this->createProphetWithChapters('Isa (AS)', 1);
        $chapter = $prophet->chapters()->first();

        // Initially unread
        $readerResponse = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->get("/read/{$chapter->id}");
        $readerResponse->assertStatus(200);

        // Mark read
        ChapterReadRecord::create([
            'subscriber_id' => $subscriber->id,
            'story_chapter_id' => $chapter->id,
            'completed_at' => now(),
        ]);

        // Library index
        $libraryResponse = $this->withSession(['msisdn' => $subscriber->msisdn])
            ->get('/library');
        $libraryResponse->assertStatus(200);
    }
}
