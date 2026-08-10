<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the voice assistant preference:
 *  - voice_auto_continue: whether the mic re-opens automatically after each
 *    AI voice reply (hands-free conversation, default on).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->boolean('voice_auto_continue')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropColumn('voice_auto_continue');
        });
    }
};
