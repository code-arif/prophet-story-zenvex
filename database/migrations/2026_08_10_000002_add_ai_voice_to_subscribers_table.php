<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the voice assistant's chosen reply voice:
 *  - voice_ai_name: the exact SpeechSynthesis voice name (e.g. "Google US
 *    English") the AI assistant uses to speak its replies. Null = auto pick.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->string('voice_ai_name', 120)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropColumn('voice_ai_name');
        });
    }
};
