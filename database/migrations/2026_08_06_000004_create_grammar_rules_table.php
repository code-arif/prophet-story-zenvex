<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Grammar rules (feature 3). Detail screen renders five blocks from JSON:
 * explanation_bn (paragraphs), correct (examples), mistakes (wrong/right/reason).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grammar_rules', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_en');
            $table->string('summary_bn');
            $table->string('category');              // Tense | Article | Preposition | Voice | Narration | Sentence
            $table->string('level')->default('A1');
            $table->json('explanation_bn');          // array of paragraphs
            $table->string('structure')->nullable(); // Subject + verb (+ s/es)…
            $table->string('structure_note_bn')->nullable();
            $table->json('correct');                 // [{ en, bn }]
            $table->json('mistakes');                // [{ wrong, right, reasonBn }]
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grammar_rules');
    }
};
