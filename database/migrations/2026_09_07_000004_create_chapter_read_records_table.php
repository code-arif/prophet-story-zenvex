<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Chapter Read Records Table
 *
 * Completion tracking: one row per subscriber per chapter, created when
 * the reader reaches the end of a chapter in either reading mode. A unique
 * (subscriber_id, story_chapter_id) pair keeps marking idempotent — reading
 * a chapter again simply refreshes `completed_at`, never duplicates the row.
 * Per-Prophet and overall library completion percentages are computed from
 * these rows.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chapter_read_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')
                ->constrained('subscribers')
                ->cascadeOnDelete();
            $table->foreignId('story_chapter_id')
                ->constrained('story_chapters')
                ->cascadeOnDelete();
            $table->timestamp('completed_at'); // When the reader reached the end
            $table->timestamps();

            // A chapter is either read or not — one record per reader per chapter.
            $table->unique(['subscriber_id', 'story_chapter_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chapter_read_records');
    }
};
