<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Reading passages (feature 6). Reader screen renders content with tappable
 * glossary words and comprehension questions from JSON.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reading_passages', function (Blueprint $table) {
            $table->id();
            $table->string('level');                 // A1 | A2 | B1
            $table->string('title_en');
            $table->string('summary_bn')->nullable();
            $table->text('content');                 // plain English text (tokens are matched against glossary)
            $table->json('glossary');                // { token: { ipa, bn, exampleEn, exampleBn } }
            $table->json('questions');               // [{ q, options[], answer }]
            $table->unsignedInteger('words')->default(0);
            $table->unsignedSmallInteger('minutes')->default(3);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index('level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_passages');
    }
};
