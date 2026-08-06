<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Quizzes (feature 8): quiz centre + session + attempt history.
 * questions JSON: [{ topic, q, options[], answer, reasonBn }]
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('kind');                  // quick | topic | level
            $table->string('title_bn');
            $table->string('description_bn')->nullable();
            $table->string('topic')->nullable();     // Tense | Article | Preposition | Vocabulary …
            $table->string('level')->default('A2');
            $table->json('questions');
            $table->unsignedSmallInteger('duration_minutes')->default(3);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('subscribers')->cascadeOnDelete();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->unsignedTinyInteger('score');
            $table->unsignedTinyInteger('total');
            $table->json('answers');                 // per-question chosen index (null = skipped)
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['subscriber_id', 'quiz_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
        Schema::dropIfExists('quizzes');
    }
};
