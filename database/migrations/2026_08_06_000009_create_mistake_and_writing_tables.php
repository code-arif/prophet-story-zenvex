<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Mistake Doctor (feature 16) + Writing Desk (feature 15).
 *  - common_mistakes: fixed Bangla-speaker error patterns used by both the
 *    Mistake Doctor and the AI writing-feedback engine.
 *  - writing_prompts: the desk's "নতুন লেখা শুরু করুন" list.
 *  - writing_drafts: autosaved learner drafts.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('common_mistakes', function (Blueprint $table) {
            $table->id();
            $table->string('pattern');               // lowercase regex-ish needle (used case-insensitively)
            $table->string('wrong');
            $table->string('correct');
            $table->text('reason_bn');
            $table->json('examples');                // [{ en, bn }]
            $table->string('category')->nullable();  // Grammar | Preposition | Tense …
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('writing_prompts', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_bn');
            $table->string('level')->default('A2');
            $table->string('word_range')->nullable(); // '১০০–১৫০ শব্দ'
            $table->string('category')->default('সব'); // দরখাস্ত | ইমেইল | প্যারাগ্রাফ | গল্প | মতামত
            $table->json('structure')->nullable();    // [{ label, phrases[] }]
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('writing_drafts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('subscribers')->cascadeOnDelete();
            $table->foreignId('prompt_id')->nullable()->constrained('writing_prompts')->nullOnDelete();
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->timestamps();

            $table->index(['subscriber_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('writing_drafts');
        Schema::dropIfExists('writing_prompts');
        Schema::dropIfExists('common_mistakes');
    }
};
