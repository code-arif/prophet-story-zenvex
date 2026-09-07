<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Reflection Questions Table
 *
 * Post-chapter discussion prompts tied to a specific story chapter.
 * These are not graded quiz questions — they are conversation starters
 * designed to reinforce understanding, especially between parent and child.
 * Each question optionally carries a short `answer_hint` for the reader's
 * reference, but no right/wrong scoring UI is presented.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reflection_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('story_chapter_id')
                ->constrained('story_chapters')
                ->cascadeOnDelete();
            $table->text('question');
            $table->text('answer_hint')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('story_chapter_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reflection_questions');
    }
};
