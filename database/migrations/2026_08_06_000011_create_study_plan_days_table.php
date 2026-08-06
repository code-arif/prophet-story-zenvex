<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * AI 30-day study plan (feature 14): one row per day, per subscriber.
 * tasks JSON: [{ title, done }] — today's checkable items come from here.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('study_plan_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('subscribers')->cascadeOnDelete();
            $table->unsignedTinyInteger('day_number');
            $table->string('summary')->nullable();   // e.g. 'Unit 3 · Lesson 3 + রিভিউ কুইজ'
            $table->json('tasks')->nullable();       // [{ title, done }]
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['subscriber_id', 'day_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('study_plan_days');
    }
};
