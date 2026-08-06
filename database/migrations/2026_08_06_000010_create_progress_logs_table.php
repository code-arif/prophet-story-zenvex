<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Progress logs — one row per completed study activity. Powers the daily
 * loop (home), the progress dashboard (skills, streak, weekly minutes) and
 * the weekly chart. `skill` maps to reading | listening | writing | speaking
 * | grammar | vocabulary.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progress_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('subscribers')->cascadeOnDelete();
            $table->string('skill');                 // reading | listening | writing | speaking | grammar | vocabulary
            $table->string('type');                  // lesson | vocab | quiz | reading | listening | speaking | writing
            $table->string('reference_type')->nullable(); // Lesson | Quiz | ReadingPassage | VocabularyWord …
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->unsignedSmallInteger('points')->default(0);
            $table->unsignedSmallInteger('minutes')->default(0);
            $table->timestamp('created_at')->nullable(); // activity date (log only, no updated_at)

            $table->index(['subscriber_id', 'created_at']);
            $table->index(['subscriber_id', 'skill']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progress_logs');
    }
};
