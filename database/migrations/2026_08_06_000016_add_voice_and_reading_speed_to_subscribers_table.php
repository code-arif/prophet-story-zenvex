<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the learner listening preferences:
 *  - voice:          'default' | 'bn' | 'en' (which TTS voice to use)
 *  - reading_speed:  speed multiplier string, e.g. '0.75' | '1.0' | '1.25' | '1.5' | '2.0'
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->string('voice', 10)->default('default');
            $table->decimal('reading_speed', 3, 2)->default(1.0);
        });
    }

    public function down(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropColumn(['voice', 'reading_speed']);
        });
    }
};
