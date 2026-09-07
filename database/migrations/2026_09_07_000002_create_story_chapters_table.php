<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Story Chapters Table
 *
 * Chapters of each Prophet's narrative. Every chapter carries two content
 * modes — `content_standard` (adult reading) and `content_kid_friendly`
 * (simplified, gentler language for kid mode) — plus a required
 * `source_reference` citation, the field that matters most for content trust.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('story_chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prophet_id')
                ->constrained('prophets')
                ->cascadeOnDelete();                // Chapters belong to one prophet
            $table->integer('chapter_number');      // Order within the prophet's story
            $table->string('title');                // Chapter title
            $table->text('content_standard');       // Standard / adult reading mode
            $table->text('content_kid_friendly');   // Simplified kid-mode version
            $table->string('illustration_path')->nullable(); // Kid-mode illustration
            $table->string('audio_path')->nullable();         // Narration audio
            $table->text('moral_lesson');           // "What we learn from this" summary
            $table->text('source_reference');       // Citation — required for content trust
            $table->timestamps();

            $table->index(['prophet_id', 'chapter_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('story_chapters');
    }
};