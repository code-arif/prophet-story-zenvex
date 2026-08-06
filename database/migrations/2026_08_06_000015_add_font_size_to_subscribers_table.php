<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the learner UI text-size preference (0 small · 1 medium · 2 large).
 * Applied app-wide via a data-text-size attribute on <html> + CSS zoom.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->unsignedTinyInteger('font_size')->default(1);
        });
    }

    public function down(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropColumn('font_size');
        });
    }
};
