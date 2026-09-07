<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Family Reading Logs Table
 *
 * Lightweight habit tracker for families who read together. Each row
 * records one day's shared reading session. The streak is computed from
 * data (consecutive calendar days with at least one log), never stored
 * as a separate counter.
 *
 * `kid_profile_id` is nullable — a parent may log a session without
 * tying it to a specific child profile (general family reading).
 * `story_chapter_id` is also nullable — the log captures that reading
 * happened today, regardless of which specific chapter was read.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_reading_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_user_id')
                ->constrained('subscribers')
                ->cascadeOnDelete();
            $table->foreignId('kid_profile_id')
                ->nullable()
                ->constrained('kid_profiles')
                ->nullOnDelete();
            $table->foreignId('story_chapter_id')
                ->nullable()
                ->constrained('story_chapters')
                ->nullOnDelete();
            $table->date('read_date');
            $table->timestamps();

            // One log per parent per day (idempotent).
            $table->unique(['parent_user_id', 'read_date']);
            $table->index('read_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_reading_logs');
    }
};
