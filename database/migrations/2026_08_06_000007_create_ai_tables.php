<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * AI companion (features 13): scenario picker + chat sessions.
 *  - ai_scenarios: picker tiles + canned opening/replies used by the
 *    rule-based tutor until a real AI proxy is connected.
 *  - ai_chat_sessions: per-subscriber conversation (messages JSON).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_scenarios', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_bn');
            $table->string('title_en');
            $table->string('icon_key')->default('briefcase'); // Briefcase | ShoppingBag | Stethoscope | Plane | MessagesSquare | MessageCircle
            $table->string('level')->default('A2');
            $table->json('opening');                 // [{ role, text }] initial messages
            $table->json('replies');                 // [text…] canned tutor follow-ups (rotated)
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('ai_chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('subscribers')->cascadeOnDelete();
            $table->foreignId('scenario_id')->nullable()->constrained('ai_scenarios')->nullOnDelete();
            $table->json('messages')->nullable();    // [{ role: ai|learner, text, correction? }]
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->index(['subscriber_id', 'scenario_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_chat_sessions');
        Schema::dropIfExists('ai_scenarios');
    }
};
