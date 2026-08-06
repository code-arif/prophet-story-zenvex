<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Audio practice (features 4 & 5).
 *  - pronunciation_items: word / sentence / pairs modes. words JSON:
 *    [{ w, ok }] used for the word-by-word scored review.
 *  - listening_items: dictation sentences + comprehension passages with
 *    questions JSON ([{ q, options[], answer }]).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pronunciation_items', function (Blueprint $table) {
            $table->id();
            $table->string('mode');                  // word | sentence | pairs
            $table->string('target');
            $table->string('phonetic')->nullable();
            $table->json('words')->nullable();       // [{ w, ok }]
            $table->string('level')->default('A2');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index('mode');
        });

        Schema::create('listening_items', function (Blueprint $table) {
            $table->id();
            $table->string('kind');                  // dictation | comprehension
            $table->string('title')->nullable();
            $table->text('text');                    // sentence or passage spoken via device voice
            $table->json('questions')->nullable();   // comprehension MCQs
            $table->string('level')->default('A2');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index('kind');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listening_items');
        Schema::dropIfExists('pronunciation_items');
    }
};
