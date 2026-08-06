<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Vocabulary domain (feature 2): decks, words and per-subscriber SRS state.
 *  - vocab_decks: e.g. দৈনন্দিন জীবন, চাকরির ইন্টারভিউ…
 *  - vocabulary_words: the cards (front en, back bn, example, ipa)
 *  - deck_word: which words belong to which deck
 *  - subscriber_vocabulary: per-learner progress (rating, due_at, saved)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vocab_decks', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');                  // বাংলা নাম
            $table->string('icon_key')->default('home'); // Home | Briefcase | GraduationCap | Plane | Star
            $table->string('tint_class')->default('bg-learn-primary-tint text-learn-primary');
            $table->string('level')->default('A1');  // lowest level that opens the deck
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('vocabulary_words', function (Blueprint $table) {
            $table->id();
            $table->string('word');
            $table->string('ipa')->nullable();
            $table->string('meaning_bn');
            $table->string('example_en')->nullable();
            $table->string('example_bn')->nullable();
            $table->string('level')->default('A1');
            $table->timestamps();

            $table->index('level');
        });

        Schema::create('deck_word', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deck_id')->constrained('vocab_decks')->cascadeOnDelete();
            $table->foreignId('word_id')->constrained('vocabulary_words')->cascadeOnDelete();
            $table->unique(['deck_id', 'word_id']);
        });

        Schema::create('subscriber_vocabulary', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('subscribers')->cascadeOnDelete();
            $table->foreignId('word_id')->constrained('vocabulary_words')->cascadeOnDelete();
            // 0 = জানি না · 1 = কঠিন · 2 = জানি  (flashcard ratings)
            $table->unsignedTinyInteger('rating')->nullable();
            $table->unsignedSmallInteger('repetitions')->default(0);
            $table->date('due_at')->nullable();      // SRS next review date
            $table->boolean('saved')->default(false);// ★ saved word
            $table->timestamps();

            $table->unique(['subscriber_id', 'word_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriber_vocabulary');
        Schema::dropIfExists('deck_word');
        Schema::dropIfExists('vocabulary_words');
        Schema::dropIfExists('vocab_decks');
    }
};
