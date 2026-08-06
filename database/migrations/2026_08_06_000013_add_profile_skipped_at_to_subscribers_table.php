<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tracks when a learner skipped the onboarding profile setup.
 *
 * Purpose (analytics): distinguish profiles that were explicitly skipped
 * (profile_skipped_at set) from ones that were never started (name + goal +
 * daily_minutes all null, profile_skipped_at null). The timestamp is cleared
 * once the learner completes the profile later.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->timestamp('profile_skipped_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropColumn('profile_skipped_at');
        });
    }
};
