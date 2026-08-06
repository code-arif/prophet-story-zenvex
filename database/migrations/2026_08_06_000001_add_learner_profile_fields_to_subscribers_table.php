<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the "Learn English" learner profile fields to the existing
 * subscribers table (auth system untouched — same table, new columns).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            // Onboarding
            $table->string('level')->nullable()->index();          // CEFR: A1 | A2 | B1
            $table->string('learning_goal')->nullable();           // চাকরি / পরীক্ষা / বিদেশ যাত্রা / সাধারণ উন্নতি
            $table->unsignedSmallInteger('daily_minutes')->nullable(); // daily study target
            $table->unsignedTinyInteger('placement_score')->nullable();
            $table->unsignedTinyInteger('placement_total')->nullable();
            $table->timestamp('onboarded_at')->nullable();

            // Daily-loop tracking (streak)
            $table->unsignedInteger('streak')->default(0);
            $table->date('last_study_date')->nullable();           // last day any activity happened

            // Reminder settings (screen 31)
            $table->boolean('reminder_enabled')->default(false);
            $table->string('reminder_time')->default('21:00');
            $table->json('reminder_days')->nullable();             // ['শ','র','সো','ম','বু','বৃ','শু']

            // AI study plan (screen 30)
            $table->timestamp('study_plan_generated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropColumn([
                'level',
                'learning_goal',
                'daily_minutes',
                'placement_score',
                'placement_total',
                'onboarded_at',
                'streak',
                'last_study_date',
                'reminder_enabled',
                'reminder_time',
                'reminder_days',
                'study_plan_generated_at',
            ]);
        });
    }
};
