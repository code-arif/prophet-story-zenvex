<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Writing feedback persistence: each writing_drafts row gains a `feedback`
 * JSON column holding the last AI review of that draft
 * (issues[], correctedText, level, score, praiseBn, ai, checked_at,
 * checked_text) so learners can reopen a draft and review past feedback.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('writing_drafts', function (Blueprint $table) {
            $table->json('feedback')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('writing_drafts', function (Blueprint $table) {
            $table->dropColumn('feedback');
        });
    }
};
