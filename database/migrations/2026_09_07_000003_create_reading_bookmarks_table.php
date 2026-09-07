<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Reading Bookmarks Table
 *
 * Resume-where-you-left-off positions. One active bookmark per subscriber
 * per prophet (a unique pair) — opening a chapter upserts the bookmark to
 * that chapter rather than accumulating history (full history is the
 * reading-progress feature's job).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reading_bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')
                ->constrained('subscribers')
                ->cascadeOnDelete();
            $table->foreignId('prophet_id')
                ->constrained('prophets')
                ->cascadeOnDelete();
            $table->foreignId('story_chapter_id')
                ->constrained('story_chapters')
                ->cascadeOnDelete();
            $table->float('scroll_position')->nullable(); // 0..1 vertical ratio for mid-chapter resume
            $table->timestamp('last_read_at')->nullable();
            $table->timestamps();

            // One active bookmark per subscriber per prophet.
            $table->unique(['subscriber_id', 'prophet_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_bookmarks');
    }
};